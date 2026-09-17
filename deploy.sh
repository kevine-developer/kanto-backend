#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "🚀 [Kanto Backend] Déploiement en cours sur le VPS..."

# 1. Vérification / Création préalable du réseau partagé Traefik
echo "🌐 Vérification du réseau Traefik (server_app-network)..."
docker network inspect server_app-network >/dev/null 2>&1 || docker network create server_app-network

# 2. Pull des dernières modifications Git
echo "📥 Récupération du code le plus récent (git pull)..."
git pull

# 3. Arrêt et suppression ciblée des conteneurs Kanto
# On ne touche JAMAIS aux conteneurs existants du VPS (traefik, postgres_db, api_server, etc.)
echo "🛑 Arrêt et suppression préventive des anciens conteneurs Kanto..."
docker rm -f kanto_backend kanto_postgres kanto_redis || true

# 4. Construction et démarrage de la stack Kanto
echo "🐳 Construction de l'image et démarrage des conteneurs..."
docker compose up -d --build

# 5. Vérification de la santé des services
echo "🩺 Contrôle de l'état des services Kanto..."
sleep 8

if docker compose ps | grep -E "unhealthy|restarting|dead|Exit"; then
    echo "⚠️ Attention : un ou plusieurs conteneurs Kanto rencontrent une anomalie :"
    docker compose ps
    exit 1
else
    echo "✅ Tous les conteneurs Kanto sont actifs et opérationnels !"
    docker compose ps
fi

# 6. Nettoyage des images intermédiaires inutilisées (libération disque)
echo "🧹 Nettoyage des images Docker orphelines..."
docker image prune -f

echo "🎉 Déploiement Kanto Backend terminé avec succès !"
