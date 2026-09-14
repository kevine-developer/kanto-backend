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

## 5. Configuration Nginx Inverse Proxy avec SSL & WebSockets

Pour exposer votre API publiquement avec un nom de domaine (ex: `api.votre-domaine.com`) et un certificat SSL HTTPS gratuit Let's Encrypt :

### A. Installer Nginx et Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### B. Créer la configuration Nginx

Créez le fichier `/etc/nginx/sites-available/kanto-backend` :

```bash
nano /etc/nginx/sites-available/kanto-backend
```

Collez la configuration suivante (remplacez `api.votre-domaine.com` par votre vrai domaine) :

```nginx
server {
    server_name api.votre-domaine.com;

    # Taille maximale des fichiers téléversés (audio, images)
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # En-têtes critiques pour WebSockets (Jeu Multijoueur / Socket.io)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # En-têtes standards de proxy
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts pour connexions longues WebSockets
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Cache pour les uploads statiques
    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### C. Activer le site et tester

```bash
ln -s /etc/nginx/sites-available/kanto-backend /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### D. Obtenir le certificat SSL Let's Encrypt

```bash
certbot --nginx -d api.votre-domaine.com
```

Certbot configurera automatiquement le renouvellement SSL HTTPS.

---

## 6. Maintenance, Mises à Jour & Sauvegardes

### Mettre à jour l'application lors d'une nouvelle version de code

```bash
cd /opt/kanto/backend-kanto
git pull
docker compose up -d --build
```

> Le script `docker-entrypoint.sh` appliquera automatiquement les nouvelles migrations Prisma sans interruption prolongée.

### Sauvegarde quotidienne de la base de données PostgreSQL

Exécutez un dump à chaud :

```bash
docker compose exec postgres pg_dump -U kanto_user -d kanto_prod | gzip > backup_kanto_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restaurer une sauvegarde

```bash
gunzip < backup_kanto_XXXXXX.sql.gz | docker compose exec -T postgres psql -U kanto_user -d kanto_prod
```
