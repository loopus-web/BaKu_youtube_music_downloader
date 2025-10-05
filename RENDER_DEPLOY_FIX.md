# 🔧 Solution pour le déploiement Render

## ❌ Le problème
Render ne permet pas d'installer ffmpeg via `apt-get` dans le plan gratuit.

## ✅ Solutions disponibles

### Option 1: Utiliser UNIQUEMENT yt-dlp (Recommandé)

1. **Modifiez `backend/server.js`** pour toujours utiliser yt-dlp :

```javascript
// Ligne ~175, changez :
let useYtDlp = false;
// En :
let useYtDlp = true; // Force yt-dlp on Render
```

2. **Committez et pushez** :
```bash
git add .
git commit -m "Force yt-dlp for Render deployment"
git push
```

### Option 2: Utiliser Docker sur Render (Plan payant)

Render supporte Docker qui permet d'installer ffmpeg, mais nécessite un plan payant (7$/mois).

### Option 3: Utiliser une alternative gratuite

#### Railway.app (Recommandé)
- 500 heures gratuites/mois
- Supporte ffmpeg nativement
- Déploiement simple depuis GitHub

#### Replit.com
- Gratuit avec limitations
- Supporte ffmpeg
- IDE intégré

## 📋 Configuration actuelle pour Render

Les fichiers sont déjà configurés pour fonctionner avec yt-dlp seul :

- ✅ `render-build.sh` : Installe yt-dlp via pip
- ✅ `render.yaml` : Configuration optimisée
- ✅ `server.js` : Fallback automatique vers yt-dlp

## 🚀 Déploiement sur Render (sans ffmpeg)

1. **Sur Render Dashboard** :
   - New → Web Service
   - Connect GitHub repository
   - **Build Command** : `chmod +x render-build.sh && ./render-build.sh`
   - **Start Command** : `chmod +x start-render.sh && ./start-render.sh`

2. **Variables d'environnement** (dans Render) :
   ```
   NODE_ENV = production
   PORT = 10000
   USE_YTDLP_ONLY = true
   ```

## ⚠️ Limitations sans ffmpeg

- Pas de conversion audio en streaming
- Téléchargement MP3 direct uniquement via yt-dlp
- Pas de preview streaming

## 💡 Alternative recommandée

Pour une meilleure expérience, utilisez :
1. **VPS** (DigitalOcean, Linode) : 5$/mois
2. **Railway.app** : 500h gratuites
3. **Render payant** : 7$/mois avec Docker