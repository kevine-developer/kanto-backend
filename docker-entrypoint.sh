#!/bin/sh
set -e

STARTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "🚀 [Kanto Backend] Démarrage du conteneur — Environnement: ${NODE_ENV:-production} — ${STARTED_AT}"

# ─── Migrations Prisma ────────────────────────────────────────────────────────
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "📦 [Prisma] Vérification et déploiement des migrations..."

  if npx prisma migrate deploy 2>&1; then
    echo "✅ [Prisma] Migrations appliquées avec succès."
  else
    MIGRATION_EXIT_CODE=$?
    echo ""
    echo "❌ [Prisma] Échec des migrations (exit code: ${MIGRATION_EXIT_CODE})."
    echo "   Vérifiez : DATABASE_URL, connectivité PostgreSQL, et prisma/migrations/"

    if [ "${STRICT_MIGRATIONS:-true}" = "true" ]; then
      echo "🛑 [Prisma] STRICT_MIGRATIONS=true — Arrêt du conteneur pour éviter un état incohérent."
      exit 1
    else
      echo "⚠️  [Prisma] STRICT_MIGRATIONS=false — Démarrage malgré les erreurs (non recommandé en prod)."
    fi
  fi
else
  echo "⏭️  [Prisma] RUN_MIGRATIONS=false — Migrations ignorées."
fi

# ─── Initialisation du compte administrateur par défaut ────────────────────────
if [ "${AUTO_CREATE_ADMIN:-true}" = "true" ]; then
  echo "🔐 [Admin] Vérification et initialisation du compte administrateur..."
  if [ -f "dist/src/scripts/create-admin.js" ]; then
    node dist/src/scripts/create-admin.js || echo "⚠️  [Admin] Étape création admin ignorée ou non bloquante."
  elif [ -f "src/scripts/create-admin.ts" ]; then
    npx tsx src/scripts/create-admin.ts || echo "⚠️  [Admin] Étape création admin ignorée ou non bloquante."
  else
    echo "ℹ️  [Admin] Script create-admin introuvable, étape ignorée."
  fi
fi

# ─── Démarrage de l'application ───────────────────────────────────────────────
echo "▶️  [Kanto Backend] Lancement de l'application..."
exec "$@"

