"""Gestionnaire de Frigo pour Home Assistant."""
import logging
import json
import os
from datetime import datetime, date, time
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
import voluptuous as vol
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.discovery import async_load_platform
from homeassistant.helpers.event import async_track_time_change

_LOGGER = logging.getLogger(__name__)

DOMAIN = "fridge_manager"
DATA_FILE = "fridge_items.json"

SERVICE_ADD_ITEM = "add_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_CLEAR_ALL = "clear_all"

SERVICE_ADD_ITEM_SCHEMA = vol.Schema({
    vol.Required("name"): cv.string,
    vol.Required("expiration_date"): cv.date,
})

SERVICE_REMOVE_ITEM_SCHEMA = vol.Schema({
    vol.Required("name"): cv.string,
})

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Configuration de l'intégration."""
    _LOGGER.info("Initialisation de Fridge Manager")
    
    hass.data[DOMAIN] = {}
    
    # Chemin du fichier de données
    data_path = hass.config.path(DATA_FILE)
    
    # Charger les données existantes
    if os.path.exists(data_path):
        try:
            with open(data_path, 'r') as f:
                hass.data[DOMAIN]["items"] = json.load(f)
                _LOGGER.info(f"Données chargées: {len(hass.data[DOMAIN]['items'])} articles")
        except Exception as e:
            _LOGGER.error(f"Erreur lors du chargement des données: {e}")
            hass.data[DOMAIN]["items"] = []
    else:
        hass.data[DOMAIN]["items"] = []
        _LOGGER.info("Aucun fichier de données trouvé, création d'une liste vide")
    
    async def save_data():
        """Sauvegarder les données dans le fichier."""
        try:
            with open(data_path, 'w') as f:
                json.dump(hass.data[DOMAIN]["items"], f, indent=2, default=str)
            _LOGGER.debug("Données sauvegardées")
        except Exception as e:
            _LOGGER.error(f"Erreur lors de la sauvegarde: {e}")
    
    async def add_item(call: ServiceCall) -> None:
        """Ajouter un article au frigo."""
        name = call.data.get("name")
        expiration_date = call.data.get("expiration_date")
        
        _LOGGER.info(f"Ajout de l'article: {name}, expire le {expiration_date}")
        
        # Convertir la date en string
        if isinstance(expiration_date, date):
            expiration_date = expiration_date.isoformat()
        
        # Vérifier si l'article existe déjà
        items = hass.data[DOMAIN]["items"]
        for item in items:
            if item["name"].lower() == name.lower():
                item["expiration_date"] = expiration_date
                await save_data()
                hass.bus.async_fire("fridge_manager_updated")
                return
        
        # Ajouter le nouvel article
        items.append({
            "name": name,
            "expiration_date": expiration_date,
            "added_date": datetime.now().isoformat()
        })
        
        await save_data()
        hass.bus.async_fire("fridge_manager_updated")
    
    async def remove_item(call: ServiceCall) -> None:
        """Retirer un article du frigo."""
        name = call.data.get("name")
        _LOGGER.info(f"Suppression de l'article: {name}")
        
        items = hass.data[DOMAIN]["items"]
        
        hass.data[DOMAIN]["items"] = [
            item for item in items 
            if item["name"].lower() != name.lower()
        ]
        
        await save_data()
        hass.bus.async_fire("fridge_manager_updated")
    
    async def clear_all(call: ServiceCall) -> None:
        """Vider toute la liste."""
        _LOGGER.info("Suppression de tous les articles")
        hass.data[DOMAIN]["items"] = []
        await save_data()
        hass.bus.async_fire("fridge_manager_updated")

    async def daily_update_callback(now):
        """Callback pour la mise à jour quotidienne à minuit."""
        _LOGGER.info("Début de la mise à jour quotidienne automatique à minuit")

        # Mettre à jour les calculs de jours restants
        items = hass.data[DOMAIN]["items"]
        today = date.today()

        updated_items = []
        expired_count = 0
        expiring_soon_count = 0

        for item in items:
            try:
                exp_date = datetime.fromisoformat(item["expiration_date"]).date()
                days_left = (exp_date - today).days

                updated_item = item.copy()
                updated_item["days_left"] = days_left
                updated_items.append(updated_item)

                if days_left < 0:
                    expired_count += 1
                    _LOGGER.info(f"Article expiré détecté: {item['name']} ({days_left} jours)")
                elif days_left <= 2:
                    expiring_soon_count += 1
                    _LOGGER.info(f"Article bientôt expiré: {item['name']} ({days_left} jours)")

            except Exception as e:
                _LOGGER.error(f"Erreur lors du traitement de l'article {item}: {e}")
                updated_items.append(item)

        # Mettre à jour les données
        hass.data[DOMAIN]["items"] = updated_items
        await save_data()

        # Déclencher l'événement pour mettre à jour le sensor
        hass.bus.async_fire("fridge_manager_updated")

        _LOGGER.info(f"Mise à jour quotidienne terminée - {len(updated_items)} articles traités, "
                    f"{expired_count} expirés, {expiring_soon_count} bientôt expirés")
    
    # Enregistrer les services
    hass.services.async_register(
        DOMAIN, SERVICE_ADD_ITEM, add_item, schema=SERVICE_ADD_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_ITEM, remove_item, schema=SERVICE_REMOVE_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_CLEAR_ALL, clear_all
    )
    
    _LOGGER.info("Services enregistrés")

    # Configurer la mise à jour quotidienne à minuit
    async_track_time_change(
        hass,
        daily_update_callback,
        hour=0,
        minute=0,
        second=0
    )
    _LOGGER.info("Planificateur quotidien configuré pour minuit")

    # Charger la plateforme sensor
    hass.async_create_task(
        async_load_platform(hass, "sensor", DOMAIN, {}, config)
    )

    return True
