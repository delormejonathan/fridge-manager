# 🔄 Workflow de Mise à Jour

## 🎯 Vue d'ensemble

Guide simple pour mettre à jour votre extension Fridge Manager après avoir fait des modifications.

## 📝 Étapes pour une mise à jour

### 1. Faire vos modifications
Modifiez les fichiers nécessaires :
- `custom_components/fridge_manager/__init__.py` pour la logique
- `custom_components/fridge_manager/sensor.py` pour les sensors
- `custom_components/fridge_manager/www/fridge-manager-card.js` pour la carte
- `README.md` pour la documentation

### 2. Mettre à jour le numéro de version
Dans `custom_components/fridge_manager/manifest.json` :

**Pour un bug fix :**
```json
"version": "1.1.1"
```

**Pour une nouvelle fonctionnalité :**
```json
"version": "1.2.0"
```

**Pour un changement majeur :**
```json
"version": "2.0.0"
```

### 3. Mettre à jour la documentation
Dans `README.md`, mettez à jour le badge de version :
```markdown
![Version](https://img.shields.io/badge/version-1.1.1-blue)
```

### 4. Commit et Push
```bash
git add .
git commit -m "🐛 Fix: Correction calcul dates v1.1.1"
git push origin main
```

## 🔄 Workflow pour les utilisateurs

### Mise à jour automatique via HACS

1. **Détection** : HACS vérifie automatiquement les mises à jour toutes les heures
2. **Notification** : Une notification apparaît dans HACS
3. **Installation** :
   - Allez dans **HACS** > **Integrations**
   - Cliquez sur le bouton "Mise à jour" à côté de Fridge Manager
4. **Redémarrage** : Home Assistant proposera automatiquement de redémarrer

### Vérification
Après la mise à jour, vérifiez que :
- ✅ Le sensor `sensor.gestionnaire_de_frigo` fonctionne
- ✅ La carte s'affiche correctement
- ✅ Les nouvelles fonctionnalités sont disponibles

## 🏷️ Stratégie de Versionning Sémantique

- **Patch (X.X.1)** : Bug fixes, corrections mineures
- **Minor (X.1.0)** : Nouvelles fonctionnalités, améliorations
- **Major (1.0.0)** : Changements cassants, refactoring important

## 📋 Exemples de Messages de Commit

```bash
# Bug fix
git commit -m "🐛 Fix: Correction calcul dates péremption v1.1.1"

# Nouvelle fonctionnalité
git commit -m "✨ Feature: Ajout notifications push v1.2.0"

# Documentation
git commit -m "📝 Docs: Mise à jour README installation v1.1.2"

# Refactoring
git commit -m "♻️ Refactor: Optimisation code sensor v1.1.3"
```

## ⚡ Bonnes Pratiques

1. **Testez localement** avant de pusher
2. **Utilisez des messages de commit clairs**
3. **Mettez à jour la documentation** à chaque changement
4. **Respectez le versionning sémantique**
5. **Créez une release GitHub** pour les versions importantes (optionnel)

## 🚀 Pour aller plus loin (Optionnel)

### Créer une Release GitHub
1. Allez sur votre dépôt GitHub
2. Cliquez sur **Releases** > **Create a new release**
3. Créez un nouveau tag (ex: `v1.1.1`)
4. Ajoutez les notes de version
5. Publiez la release

### Automatisation future
Vous pourriez ajouter GitHub Actions pour :
- Tester automatiquement le code
- Créer des releases automatiques
- Valider la structure des fichiers

---

**💡 Astuce : Ce workflow est simple mais efficace pour des mises à jour rapides et fréquentes !**