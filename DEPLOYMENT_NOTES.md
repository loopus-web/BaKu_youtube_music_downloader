# 📝 Notes de déploiement

## Pourquoi `npm install` au lieu de `npm ci` ?

Le projet utilise `npm install` dans le script de build pour les raisons suivantes :

1. **`package-lock.json` non versionné** : Les fichiers `package-lock.json` sont dans `.gitignore` pour éviter les conflits entre différents environnements
2. **Flexibilité** : `npm install` fonctionne avec ou sans `package-lock.json`
3. **Compatibilité** : Fonctionne sur tous les services d'hébergement

## Structure des fichiers

```
.gitignore          # Exclut package-lock.json
build.sh            # Script de build pour Render (utilise npm install)
start-render.sh     # Script de démarrage pour production
render.yaml         # Configuration Render
```

## Différences npm ci vs npm install

| Commande | Avantages | Inconvénients |
|----------|-----------|---------------|
| `npm ci` | Plus rapide, déterministe | Nécessite package-lock.json |
| `npm install` | Flexible, toujours fonctionne | Peut avoir des versions différentes |

## Pour un déploiement déterministe

Si vous voulez garantir les mêmes versions partout :

1. Retirez `package-lock.json` du `.gitignore`
2. Commitez les fichiers `package-lock.json`
3. Revenez à `npm ci` dans `build.sh`

```bash
# Retirer de .gitignore
sed -i '/package-lock/d' .gitignore

# Ajouter les fichiers
git add frontend/package-lock.json backend/package-lock.json
git commit -m "Add package-lock.json for deterministic builds"

# Modifier build.sh pour utiliser npm ci
```

## État actuel

✅ **Fonctionne sur** : Render, Railway, Heroku, VPS
✅ **Build reproductible** : Via package.json
⚠️ **Versions** : Peuvent varier légèrement entre déploiements