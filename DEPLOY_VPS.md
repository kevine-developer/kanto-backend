# Guide de Déploiement VPS — Backend Kanto (Docker)

Ce guide décrit la mise en production du backend Kanto sur un serveur VPS Linux (Ubuntu 22.04 / 24.04 LTS ou Debian 11 / 12) à l'aide de Docker et Docker Compose.

---

## 1. Prérequis sur le VPS

Connectez-vous à votre VPS en SSH :

```bash
ssh root@votre-ip-vps
```

### A. Mettre à jour le système

```bash
apt update && apt upgrade -y
apt install -y curl git ufw fail2ban
```

### B. Installer Docker et Docker Compose

Si Docker n'est pas encore installé :

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable --now docker
```

Vérifiez l'installation :

```bash
docker --version
docker compose version
```

### C. Configurer le pare-feu UFW

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 2. Déploiement de l'Application

### A. Cloner le projet ou transférer les fichiers

```bash
mkdir -p /opt/kanto
cd /opt/kanto
git clone <URL_DU_DEPOT_GIT> .
cd backend-kanto
```

### B. Préparer le fichier d'environnement `.env`

Copiez le modèle de production :

```bash
cp .env.production.example .env
```

Éditez le fichier `.env` avec vos valeurs de production :

```bash
nano .env
```

> **Sécurité essentielle :**
> - Générez une clé robuste pour `BETTER_AUTH_SECRET` :
>
>   ```bash
>   openssl rand -hex 32
>   ```
>
> - Définissez des mots de passe sécurisés pour `POSTGRES_PASSWORD`.
> - Renseignez votre nom de domaine pour `BETTER_AUTH_URL` (ex: `https://api.votre-domaine.com`).
> - Configurez `CORS_ORIGINS` avec les URLs de votre application web et admin.

---

## 3. Lancer la Stack Docker

Lancez la compilation et le démarrage en arrière-plan :

```bash
docker compose up -d --build
```

### Vérifier l'état des conteneurs :

```bash
docker compose ps
```

Vous devriez observer les trois conteneurs avec le statut `healthy` :
- `kanto_backend`
- `kanto_postgres`
- `kanto_redis`

### Consulter les logs en temps réel :

```bash
docker compose logs -f backend
```

### Tester l'API en local sur le VPS :

```bash
curl http://localhost:3000/health
# Réponse attendue : {"status":"ok","timestamp":"...","service":"kanto-backend"}
```

---

## 4. Initialisation des Données (Seed & Admin)

Une fois les conteneurs démarrés, vous pouvez injecter les données initiales (citations, proverbes, contes, etc.) et créer le compte administrateur :

```bash
# Exécuter les seeds de données
docker compose exec backend npm run seed

# Créer le compte administrateur initial
docker compose exec backend npm run seed:admin
```

---

## 5. Routage HTTPS & Certificats SSL Automatiques via Traefik v3

Sur votre VPS, Traefik v3 écoute déjà sur les ports 80 et 443 via le réseau partagé `server_app-network`.
**Aucun Nginx n'est nécessaire**, et aucun port n'a besoin d'être exposé sur l'hôte, ce qui élimine 100% des risques de conflit avec votre projet `kadokou`.

### Fonctionnement automatique :
1. Définissez simplement votre domaine dans votre `.env` :
   ```bash
   KANTO_DOMAIN="api-kanto.gastsar.fr"
   ```
2. Lorsque vous lancez `./deploy.sh`, Traefik détecte automatiquement le conteneur `kanto_backend` via ses labels Docker :
   - Route HTTPS sécurisée : `https://api-kanto.gastsar.fr`
   - Certificat SSL Let's Encrypt généré et renouvelé automatiquement
   - Prise en charge native des WebSockets (Jeu Multijoueur / Socket.io)
   - Headers de sécurité et limitation de débit intégrés


---

## 6. Maintenance, Mises à Jour & Sauvegardes

### Déploiement automatique en 1 commande (`deploy.sh`)

Un script automatisé `deploy.sh` est fourni à la racine de `backend-kanto`. Il effectue le `git pull`, le redémarrage sécurisé des conteneurs, le build, la vérification d'état (health check) et le nettoyage automatique des images obsolètes :

```bash
cd /opt/kanto/backend-kanto
chmod +x deploy.sh
./deploy.sh
```

> Le script `docker-entrypoint.sh` intégré dans le conteneur applique automatiquement les nouvelles migrations Prisma (`RUN_MIGRATIONS=true`) au démarrage sans interruption.

### Sauvegarde quotidienne de la base de données PostgreSQL

Exécutez un dump à chaud :

```bash
docker compose exec postgres pg_dump -U kanto_user -d kanto_prod | gzip > backup_kanto_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restaurer une sauvegarde

```bash
gunzip < backup_kanto_XXXXXX.sql.gz | docker compose exec -T postgres psql -U kanto_user -d kanto_prod
```
