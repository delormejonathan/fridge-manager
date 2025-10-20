# Mises à jour - Gestionnaire de Frigo v1.1.0

## 🎯 Problème résolu

Les dates de péremption ne se mettaient pas à jour automatiquement dans le widget du tableau de bord et les automations ne fonctionnaient pas correctement car le système manquait de mécanismes de rafraîchissement.

## 🔧 Améliorations implémentées

### 1. Activation du polling automatique (`sensor.py`)
- **Avant** : `should_poll = False` (pas de mise à jour automatique)
- **Après** : `should_poll = True` avec intervalle de 24 heures
- Ajout de la méthode `async_update()` pour recalculer les états

### 2. Planificateur quotidien (`__init__.py`)
- Ajout d'un callback qui se déclenche **tous les jours à minuit**
- Recalcul automatique des jours restants pour tous les articles
- Détection des articles expirés et bientôt expirés
- Sauvegarde automatique et mise à jour du sensor

### 3. Logs améliorés
- Traçabilité des mises à jour automatiques
- Information sur les articles expirés/bientôt expirés
- Logs détaillés pour le débogage

## 📋 Fonctionnalités

### Comportement automatique
- **Mise à jour quotidienne** : Tous les jours à 00:00, le système recalcule les jours restants
- **Polling de secours** : Mise à jour toutes les 24 heures via le système de polling
- **Mise à jour immédiate** : Toujours disponible lors de l'ajout/suppression manuelle

### États gérés automatiquement
- ✅ Articles expirés (jours restants < 0)
- ✅ Articles bientôt expirés (jours restants ≤ 2)
- ✅ Nombre total d'articles
- ✅ Statistiques en temps réel

## 🔍 Logs à surveiller

Dans les logs Home Assistant, recherchez ces messages :
```
INFO Début de la mise à jour quotidienne automatique à minuit
INFO Article expiré détecté: nom_article (-3 jours)
INFO Article bientôt expiré: nom_article (1 jours)
INFO Mise à jour quotidienne terminée - X articles traités
```

## 🚀 Installation

1. Redémarrez Home Assistant après avoir appliqué les mises à jour
2. Le système se mettra à jour automatiquement à minuit
3. Vérifiez les logs pour confirmer le bon fonctionnement

## 🔧 Configuration requise

Aucune configuration supplémentaire n'est nécessaire. Les mises à jour automatiques sont activées par défaut.

## 📊 Performance

- Impact minimal sur les performances (mise à jour unique quotidienne)
- Utilisation efficace de la mémoire
- Sauvegarde optimisée des données