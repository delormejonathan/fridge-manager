# 🎨 Fridge Manager Card

**Carte personnalisée Home Assistant pour le gestionnaire de frigo**

![Card Preview](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue)

## 📦 Installation

### Via HACS (Recommandé)

1. Allez dans **HACS** > **Frontend**
2. Cliquez sur **Explore & Download Repositories**
3. Cherchez "Fridge Manager Card" ou ajoutez l'URL : `https://github.com/delormejonathan/fridge_manager`
4. Cliquez sur **Télécharger**
5. Redémarrez Home Assistant

### Manuellement

1. Téléchargez le fichier `fridge-manager-card.js`
2. Placez-le dans `config/www/`
3. Ajoutez la ressource dans `configuration.yaml` :

```yaml
frontend:
  extra_module_url:
    - /local/fridge-manager-card.js
```

## 🎯 Utilisation

Dans votre tableau de bord, ajoutez une carte manuelle :

```yaml
type: custom:fridge-manager-card
```

## ✨ Fonctionnalités

- 🎨 **Design moderne** avec dégradé et animations
- 📊 **Statistiques en temps réel**
- 📝 **Formulaire d'ajout rapide** d'articles
- 🚨 **Notifications visuelles** pour les articles expirés
- 🌓 **Thème adaptatif** (clair/sombre)
- 📱 **Responsive design** pour mobile

## 🎨 Personnalisation

La carte s'adapte automatiquement à votre thème Home Assistant mais vous pouvez personnaliser les couleurs CSS :

```css
/* Variables CSS personnalisables */
:root {
  --fridge-primary: #3b82f6;
  --fridge-success: #10b981;
  --fridge-warning: #f59e0b;
  --fridge-danger: #ef4444;
  --fridge-radius: 24px;
  --fridge-spacing: 12px;
}
```

## 🔧 Configuration

La carte utilise automatiquement le sensor `sensor.gestionnaire_de_frigo`. Assurez-vous que l'intégration Fridge Manager est installée et fonctionnelle.

## 📱 Compatibilité

- ✅ Home Assistant 2024.1.0+
- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Applications mobiles Home Assistant
- ✅ Responsive design

## 🐛 Dépannage

### La carte ne s'affiche pas
1. Vérifiez que vous avez bien installé l'intégration Fridge Manager
2. Assurez-vous que le sensor `sensor.gestionnaire_de_frigo` existe
3. Redémarrez Home Assistant

### Le style est incorrect
1. Videz le cache de votre navigateur
2. Redémarrez Home Assistant
3. Vérifiez les erreurs dans la console du navigateur

## 📝 Dépendances

Cette carte nécessite l'installation préalable de :
- **Fridge Manager Integration** (disponible dans le même dépôt)

---

**Fait partie du projet [Fridge Manager](https://github.com/delormejonathan/fridge_manager)**