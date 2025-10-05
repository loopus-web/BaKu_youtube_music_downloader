# Déploiement sur Render.com (Gratuit)

## ⚠️ Limitations du plan gratuit

- **Mise en veille après 15 minutes** : Le service s'arrête après 15 min d'inactivité
- **Démarrage lent** : 30-60 secondes pour redémarrer après la veille
- **750 heures/mois** : Environ 31 jours pour 1 service
- **RAM limitée** : 512 MB (peut être insuffisant pour certaines vidéos)
- **Pas de stockage persistant** : Fichiers temporaires seulement

## 📋 Prérequis

1. Compte GitHub avec votre code
2. Compte Render.com (gratuit)

## 🚀 Étapes de déploiement

### 1. Préparer votre repository GitHub

```bash
# Initialiser git si pas déjà fait
git init
git add .
git commit -m "Initial commit"

# Créer un repository sur GitHub et pusher
git remote add origin https://github.com/YOUR_USERNAME/musicDownloader.git
git branch -M main
git push -u origin main
```

### 2. Configurer sur Render.com

1. Connectez-vous à [Render.com](https://render.com)
2. Cliquez sur **New +** → **Web Service**
3. Connectez votre compte GitHub
4. Sélectionnez votre repository `musicDownloader`

### 3. Configuration du service

Dans les paramètres Render :

- **Name** : `music-downloader`
- **Region** : `Oregon (US West)` ou `Frankfurt (EU Central)`
- **Branch** : `main`
- **Root Directory** : Laisser vide
- **Runtime** : `Docker`
- **Instance Type** : `Free`

### 4. Variables d'environnement

Ajoutez ces variables dans Render Dashboard :

```
NODE_ENV = production
PORT = 10000
```

### 5. Déploiement

Render va automatiquement :
1. Détecter le Dockerfile
2. Builder l'image Docker
3. Démarrer votre application

## 🔧 Optimisations recommandées

### Alternative sans Docker (plus rapide)

Si le build Docker est trop lent, utilisez un build natif :

1. Supprimez le `Dockerfile`
2. Créez un fichier `build.sh` :

```bash
#!/usr/bin/env bash
# build.sh
set -e

# Install system dependencies
apt-get update
apt-get install -y ffmpeg python3-pip
pip3 install yt-dlp

# Build frontend
cd frontend
npm ci
npm run build
cd ..

# Install backend dependencies
cd backend
npm ci
```

3. Utilisez les scripts fournis

4. Dans Render, configurez :
   - **Build Command** : `chmod +x build.sh && ./build.sh`
   - **Start Command** : `chmod +x start-render.sh && ./start-render.sh`

## 🍪 Authentification YouTube (Optionnel)

Si vous avez des erreurs 403 :

1. Exportez vos cookies YouTube (voir COOKIES_SETUP.md)
2. Encodez le fichier en base64 :
   ```bash
   base64 cookies.txt > cookies_base64.txt
   ```
3. Ajoutez comme variable d'environnement dans Render :
   ```
   COOKIES_BASE64 = [contenu du fichier cookies_base64.txt]
   ```
4. Modifiez `server.js` pour décoder :
   ```javascript
   if (process.env.COOKIES_BASE64) {
     const cookies = Buffer.from(process.env.COOKIES_BASE64, 'base64').toString();
     fs.writeFileSync('./cookies.txt', cookies);
   }
   ```

## 🚨 Problèmes courants

### 1. "Service unavailable" après 750 heures
- Solution : Créez un nouveau service ou attendez le mois suivant

### 2. Démarrage très lent
- Normal sur le plan gratuit (cold start)
- Alternative : Utilisez un service payant (7$/mois)

### 3. Téléchargements échouent (mémoire insuffisante)
- Limitez la qualité audio dans `server.js`
- Utilisez `lowestaudio` au lieu de `highestaudio`

### 4. Build timeout
- Utilisez l'option sans Docker (build natif)
- Ou upgradez temporairement pour le build initial

## 💰 Alternative payante recommandée

Pour une meilleure expérience (7$/mois sur Render) :
- Pas de mise en veille
- 2 GB RAM
- Démarrage instantané
- Support prioritaire

## 🔗 Autres alternatives gratuites

1. **Railway.app** : 500 heures/mois gratuit
2. **Cyclic.sh** : Toujours actif, mais limitations API
3. **Fly.io** : 3 machines gratuites, plus complexe
4. **VPS gratuit** : Oracle Cloud (toujours gratuit mais complexe)

## 📝 Notes finales

- Le plan gratuit convient pour un usage personnel occasionnel
- Pour un usage intensif, considérez un VPS ou plan payant
- Surveillez les logs dans le dashboard Render pour débugger