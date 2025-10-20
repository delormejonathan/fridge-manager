# 🧊 Fridge Manager - Gestionnaire de Frigo

**Intégration Home Assistant pour gérer les dates de péremption de votre frigo**

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![HACS](https://img.shields.io/badge/HACS-Compatible-green)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1.0+-blue)

## 🌟 Fonctionnalités

- ✅ **Gestion des articles** avec dates de péremption
- ✅ **Mises à jour automatiques** quotidiennes à minuit
- ✅ **Notifications** pour les articles expirés/bientôt expirés
- ✅ **Carte personnalisée** moderne et intuitive
- ✅ **Statistiques** en temps réel
- ✅ **Support multilingue** (Français inclus)

## 📦 Installation

### 🚀 Via HACS (Recommandé - 1 seule installation !)

1. Allez dans **HACS** > **Integrations**
2. Cliquez sur les **3 points** (⋮) en haut à droite > **Télécharger**
3. Ajoutez l'URL de ce dépôt : `https://github.com/delormejonathan/fridge_manager`
4. Cliquez sur **Télécharger**
5. **Redémarrez** Home Assistant

✅ **C'est tout !** L'intégration ET la carte personnalisée sont installées automatiquement !

### 📋 Manuellement

#### 1. Cloner le dépôt
```bash
cd your-config/
git clone https://github.com/delormejonathan/fridge_manager.git
```

#### 2. Copier les fichiers
```bash
cp -r fridge_manager/custom_components/fridge_manager config/custom_components/
```

#### 3. Ajouter la ressource frontend
Dans `configuration.yaml` :
```yaml
frontend:
  extra_module_url:
    - /local/fridge-manager-card.js
```

#### 4. Copier la carte
```bash
cp fridge_manager/custom_components/fridge_manager/www/fridge-manager-card.js config/www/
```

## ⚙️ Configuration

### 1. Redémarrer Home Assistant
L'intégration se chargera automatiquement.

### 2. Ajouter la carte au tableau de bord
Dans votre tableau de bord, ajoutez une carte manuelle avec :
```yaml
type: custom:fridge-manager-card
```

## 🔧 Services disponibles

### Ajouter un article
```yaml
service: fridge_manager.add_item
data:
  name: "Yaourt Nature"
  expiration_date: "2024-12-25"
```

### Supprimer un article
```yaml
service: fridge_manager.remove_item
data:
  name: "Yaourt Nature"
```

### Vider la liste
```yaml
service: fridge_manager.clear_all
```

## 📊 Sensor disponible

- **`sensor.gestionnaire_de_frigo`** : Sensor principal avec tous les attributs
  - `total_items` : Nombre total d'articles
  - `expired_count` : Articles expirés
  - `expiring_soon_count` : Articles bientôt expirés
  - `items` : Liste détaillée avec jours restants

## 🔄 Automatisations

### Exemple : Notification pour articles expirés
```yaml
automation:
  - alias: "Notification articles expirés"
    trigger:
      - platform: state
        entity_id: sensor.gestionnaire_de_frigo
        attribute: expired_count
        to: "0"
    action:
      - service: notify.mobile_app
        data:
          title: "🚨 Articles périmés"
          message: "Vous avez {{ state_attr('sensor.gestionnaire_de_frigo', 'expired_count') }} articles périmés"
```

### Exemple : Nettoyage automatique
```yaml
automation:
  - alias: "Nettoyage articles périmés"
    trigger:
      - platform: time
        at: "02:00:00"
    condition:
      - condition: template
        value_template: "{{ state_attr('sensor.gestionnaire_de_frigo', 'expired_count') > 0 }}"
    action:
      - service: persistent_notification.create
        data:
          title: "🧊 Nettoyage Frigo"
          message: "Pensez à vérifier les articles périmés dans votre frigo !"
```

## 🐛 Dépannage

### Les articles ne se mettent pas à jour ?
Vérifiez les logs de Home Assistant :
```
INFO Début de la mise à jour quotidienne automatique à minuit
INFO Mise à jour quotidienne terminée
```

### La carte ne s'affiche pas ?
1. Vérifiez que vous avez bien installé la carte via HACS Frontend
2. Redémarrez Home Assistant
3. Videz le cache de votre navigateur

### Problèmes d'installation ?
1. Vérifiez que tous les fichiers sont dans `config/custom_components/fridge_manager/`
2. Assurez-vous que Home Assistant 2024.1.0+ est installé

## 📝 Notes de version

### v1.1.0 (2024-10-20)
- ✅ **Mise à jour automatique quotidienne** à minuit
- ✅ **Support HACS** pour installation simplifiée
- ✅ **Logs améliorés** pour le débogage
- ✅ **Performance optimisée**

### v1.0.0
- ✅ Version initiale
- ✅ Gestion de base des articles
- ✅ Carte personnalisée

## 🤝 Contribution

N'hésitez pas à :
- ⭐ **Forker** ce projet
- 🐛 **Reporter** des bugs
- 💡 **Suggérer** des améliorations
- 🔧 **Contribuer** au code

## 📄 Licence

Ce projet est sous licence MIT.

---

**👨‍💻 Développé par [delormejonathan](https://github.com/delormejonathan)**