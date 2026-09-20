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

# ─── Démarrage de l'application ───────────────────────────────────────────────
echo "▶️  [Kanto Backend] Lancement de l'application..."
exec "$@"
