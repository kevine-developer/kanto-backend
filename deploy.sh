#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "🚀 [Kanto Backend] Déploiement en cours sur le VPS..."

# 1. Vérification / Création préalable du réseau partagé Traefik
echo "🌐 Vérification du réseau Traefik (server_app-network)..."
docker network inspect server_app-network >/dev/null 2>&1 || docker network create server_app-network

# 2. Vérification / Création préalable du réseau interne Kanto
docker network inspect kanto_internal_network >/dev/null 2>&1 || docker network create kanto_internal_network

# 3. Pull des dernières modifications Git
echo "📥 Récupération du code le plus récent (git pull)..."
git pull

# 4. Arrêt et suppression ciblée du BACKEND uniquement
# PostgreSQL et Redis ne sont PAS recréés : préserve les données et évite le cold start
echo "🛑 Arrêt du backend Kanto (postgres et redis préservés)..."
docker rm -f kanto_backend || true

# 5. Démarrage/mise à jour de PostgreSQL et Redis si absents
echo "🐳 Démarrage de la base de données et du cache (si nécessaire)..."
docker compose up -d postgres redis

# 6. Attente du healthcheck de PostgreSQL et Redis
echo "⏳ Attente que PostgreSQL et Redis soient prêts..."
MAX_WAIT=60
ELAPSED=0
while true; do
  PG_STATUS=$(docker inspect --format='{{.State.Health.Status}}' kanto_postgres 2>/dev/null || echo "missing")
  RD_STATUS=$(docker inspect --format='{{.State.Health.Status}}' kanto_redis 2>/dev/null || echo "missing")

  if [ "$PG_STATUS" = "healthy" ] && [ "$RD_STATUS" = "healthy" ]; then
    echo "✅ PostgreSQL et Redis sont prêts."
    break
  fi

  if [ "$ELAPSED" -ge "$MAX_WAIT" ]; then
    echo "❌ Timeout : PostgreSQL ($PG_STATUS) ou Redis ($RD_STATUS) non prêt après ${MAX_WAIT}s."
    docker compose logs --tail=20 postgres redis
    exit 1
  fi

  echo "   PostgreSQL: $PG_STATUS | Redis: $RD_STATUS — attente... (${ELAPSED}s)"
  sleep 5
  ELAPSED=$((ELAPSED + 5))
done

# 7. Construction et démarrage du backend
echo "🐳 Construction de l'image et démarrage du backend..."
docker compose up -d --build backend

# 8. Attente du démarrage du backend
echo "⏳ Attente du démarrage du backend..."
sleep 10

# 9. Vérification de la santé des services
echo "🩺 Contrôle de l'état des services Kanto..."
if docker compose ps | grep -E "unhealthy|restarting|dead|Exit"; then
    echo "⚠️  Anomalie détectée — derniers logs du backend :"
    docker compose logs --tail=30 backend
    exit 1
else
    echo "✅ Tous les conteneurs Kanto sont actifs !"
    docker compose ps
fi

# 10. Nettoyage des images intermédiaires inutilisées (libération disque)
echo "🧹 Nettoyage des images Docker orphelines..."
docker image prune -f

echo "🎉 Déploiement Kanto Backend terminé avec succès !"
