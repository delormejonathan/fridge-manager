# 📦 Guide d'Installation via HACS

## 🎯 Vue d'ensemble

Ce guide explique comment installer l'extension **Fridge Manager** via HACS (Home Assistant Community Store) pour une installation automatique et des mises à jour simplifiées.

## ⚠️ Prérequis

- Home Assistant 2024.1.0 ou supérieur
- HACS installé et configuré
- Accès internet

## 🚀 Installation en 1 seule étape !

### Ajouter le dépôt HACS
1. Allez dans **HACS** > **Integrations**
2. Cliquez sur les **3 points** (⋮) en haut à droite
3. Sélectionnez **Télécharger** (Download)
4. Dans la section **URL du dépôt**, entrez :
   ```
   https://github.com/delormejonathan/fridge_manager
   ```
5. Cliquez sur **Télécharger**

### Installation automatique complète
HACS va automatiquement installer :
- ✅ **L'intégration** dans `custom_components/fridge_manager/`
- ✅ **La carte personnalisée** accessible via `/hacsfiles/fridge_manager/`
- ✅ **Toutes les dépendances** nécessaires

## 🔄 Redémarrage

### Redémarrer Home Assistant
1. Allez dans **Paramètres** > **Système**
2. Cliquez sur **Redémarrer**
3. Attendez que le redémarrage soit terminé

### Vérifier l'installation
1. Allez dans **Outils de développement** > **États**
2. Cherchez `sensor.gestionnaire_de_frigo`
3. Le sensor devrait apparaître avec des attributs

## 📱 Configuration du tableau de bord

### Ajouter la carte au tableau de bord
1. Modifiez votre tableau de bord
2. Ajoutez une nouvelle carte
3. Choisissez **Carte manuelle**
4. Entrez le code YAML :

```yaml
type: custom:fridge-manager-card
```

### Personnaliser (optionnel)
Vous pouvez ajouter des options :

```yaml
type: custom:fridge-manager-card
title: "Mon Frigo"  # Personnaliser le titre
```

## ✅ Vérification finale

### 5.1 Tester l'ajout d'articles
1. Utilisez la carte pour ajouter un article
2. Vérifiez qu'il apparaît dans le sensor

### 5.2 Vérifier les logs
Dans **Paramètres** > **Journaux**, vous devriez voir :
```
INFO Configuration du sensor Fridge Manager
INFO Sensor initialisé
INFO Listener enregistré pour les mises à jour
```

## 🔄 Mises à jour automatiques

HACS gérera automatiquement les mises à jour :
- 🔔 Notification dans HACS quand une mise à jour est disponible
- 📲 Bouton **Mise à jour** dans HACS
- 🔄 Installation automatique après redémarrage

## 🐛 Dépannage

### Problème : L'intégration n'apparaît pas
**Solution :**
1. Vérifiez que les fichiers sont dans `config/custom_components/fridge_manager/`
2. Redémarrez Home Assistant
3. Vérifiez les logs pour des erreurs

### Problème : La carte ne s'affiche pas
**Solution :**
1. Vérifiez l'installation de la partie Frontend dans HACS
2. Videz le cache du navigateur
3. Vérifiez la console du navigateur pour des erreurs

### Problème : Erreur de structure
**Solution :**
1. Assurez-vous que vous avez bien installé les deux parties (Intégration + Frontend)
2. Vérifiez la version de Home Assistant (min. 2024.1.0)
3. Réinstallez via HACS

## 📞 Support

Si vous rencontrez des problèmes :
1. 🔍 Vérifiez les logs Home Assistant
2. 📖 Consultez le [README principal](README.md)
3. 🐛 Ouvrez une issue sur GitHub
4. 💬 Contactez le développeur : [@delormejonathan](https://github.com/delormejonathan)

---

**🎉 Félicitations ! Votre Fridge Manager est maintenant installé et fonctionnel !**