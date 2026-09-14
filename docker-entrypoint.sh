#!/bin/sh
set -e

echo "🚀 [Kanto Backend] Démarrage du conteneur en environnement : ${NODE_ENV:-production}"

# Exécution automatique des migrations Prisma si activée (par défaut en production)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "📦 [Prisma] Vérification et déploiement des migrations de schéma..."
  if npx prisma migrate deploy; then
    echo "✅ [Prisma] Migrations appliquées avec succès."
  else
    echo "⚠️ [Prisma] Avertissement: Impossible d'exécuter les migrations (vérifiez DATABASE_URL)."
    if [ "${STRICT_MIGRATIONS:-false}" = "true" ]; then
      echo "❌ [Prisma] Arrêt du conteneur car STRICT_MIGRATIONS=true."
      exit 1
    fi
  fi
fi

# Exécution de la commande principale du conteneur
exec "$@"
