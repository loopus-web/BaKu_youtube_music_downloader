# Guide rapide : Publier sur GitHub

## 1️⃣ Créer le repository sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. **Repository name** : `musicDownloader`
3. **Visibility** :
   - 🔓 **Public** : Plus simple pour Render gratuit
   - 🔒 **Private** : Nécessite de connecter GitHub à Render
4. **NE PAS** cocher "Initialize with README"
5. Cliquez **Create repository**

## 2️⃣ Publier votre code

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Music Downloader"

# Ajouter GitHub comme remote (remplacez YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/musicDownloader.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

## 3️⃣ Si vous avez une erreur de push

### Erreur "authentication failed" :
```bash
# Utilisez un Personal Access Token au lieu du mot de passe
# 1. GitHub → Settings → Developer settings → Personal access tokens
# 2. Generate new token (classic)
# 3. Sélectionnez "repo" scope
# 4. Utilisez le token comme mot de passe
```

### Erreur "remote already exists" :
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/musicDownloader.git
```

## 4️⃣ Vérifier les fichiers sensibles

**IMPORTANT** : Avant de pusher, vérifiez :

```bash
# Ces fichiers NE doivent PAS être sur GitHub :
backend/cookies.txt         ❌
backend/.env               ❌
.env                      ❌
*-player-script.js        ❌

# Ces fichiers sont OK :
.env.example              ✅
COOKIES_SETUP.md          ✅
```

## 5️⃣ Connecter à Render

### Si repo PUBLIC :
1. Render.com → New → Web Service
2. "Public Git repository"
3. Collez : `https://github.com/YOUR_USERNAME/musicDownloader`

### Si repo PRIVÉ :
1. Render.com → Account Settings → GitHub
2. "Connect GitHub"
3. Autorisez Render
4. New → Web Service → Sélectionnez votre repo

## ⚠️ Sécurité

**Ne jamais commit :**
- Mots de passe
- Cookies YouTube
- Clés API
- Fichiers .env avec vraies valeurs

**Utiliser à la place :**
- Variables d'environnement Render
- .env.example pour la documentation