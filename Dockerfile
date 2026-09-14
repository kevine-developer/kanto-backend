# syntax=docker/dockerfile:1.7

# -----------------------------------------------------------------------------
# Stage 1: Base - Configuration de l'environnement Node.js 24 Alpine
# -----------------------------------------------------------------------------
FROM node:24-alpine AS base

WORKDIR /app

# Dépendances système essentielles pour Prisma Engine et signal handling
RUN apk add --no-cache libc6-compat openssl dumb-init

# -----------------------------------------------------------------------------
# Stage 2: Dependencies - Installation des dépendances avec cache propre
# -----------------------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json ./

# Installation propre de l'ensemble des dépendances (y compris dev pour le build)
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 3: Builder - Génération Prisma et Compilation NestJS
# -----------------------------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig*.json nest-cli.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

# Génération du client Prisma pour l'architecture Linux du conteneur
RUN npx prisma generate

# Compilation NestJS
RUN npm run build

# Élagage des devDependencies (garde les dépendances de production dont prisma)
RUN npm prune --omit=dev

# -----------------------------------------------------------------------------
# Stage 4: Runner - Image de Production Légère et Sécurisée
# -----------------------------------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /app

# Dépendances de runtime pour Prisma et wget pour le healthcheck
RUN apk add --no-cache libc6-compat openssl dumb-init wget

ENV NODE_ENV=production
ENV PORT=3000

# Copie des fichiers applicatifs compilés et dépendances de production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Normalisation des sauts de ligne (sécurité CRLF -> LF) et permissions
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# Création du dossier uploads pour les fichiers audio/médias locaux et assignation non-root
RUN mkdir -p /app/uploads && chown -R node:node /app

# Exécution sous l'utilisateur non-root standard de Node.js
USER node

# Exposition du port applicatif
EXPOSE 3000

# Volume persistant pour les fichiers téléversés
VOLUME ["/app/uploads"]

# Vérification d'état périodique
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Signal handling et exécution via le script d'entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--", "./docker-entrypoint.sh"]

# Démarrage de l'application NestJS compilée
CMD ["node", "dist/src/main.js"]
