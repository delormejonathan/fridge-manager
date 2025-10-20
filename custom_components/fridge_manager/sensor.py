"""Sensor pour le gestionnaire de frigo."""
import logging
from datetime import datetime, time, timedelta
from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType
from homeassistant.helpers.event import async_track_time_change

from . import DOMAIN

_LOGGER = logging.getLogger(__name__)

async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Configuration de la plateforme sensor."""
    _LOGGER.info("Configuration du sensor Fridge Manager")
    sensor = FridgeManagerSensor(hass)
    async_add_entities([sensor], True)
    _LOGGER.info("Sensor ajouté")

class FridgeManagerSensor(SensorEntity):
    """Sensor principal du gestionnaire de frigo."""

    def __init__(self, hass):
        """Initialiser le sensor."""
        self.hass = hass
        self._attr_name = "Gestionnaire de Frigo"
        self._attr_unique_id = "fridge_manager_main"
        self._attr_icon = "mdi:fridge"
        self._attr_has_entity_name = True
        self._daily_update_listener = None
        _LOGGER.info("Sensor initialisé")
        
    @property
    def name(self):
        """Retourner le nom."""
        return "Gestionnaire de Frigo"
        
    @property
    def state(self):
        """Retourner le nombre d'articles dans le frigo."""
        if DOMAIN not in self.hass.data:
            return 0
        return len(self.hass.data[DOMAIN].get("items", []))
    
    @property
    def extra_state_attributes(self):
        """Retourner les attributs détaillés."""
        if DOMAIN not in self.hass.data:
            return {}
            
        items = self.hass.data[DOMAIN].get("items", [])
        today = datetime.now().date()
        
        # Trier par date d'expiration
        try:
            sorted_items = sorted(items, key=lambda x: x["expiration_date"])
        except:
            sorted_items = items
        
        # Calculer les jours restants pour chaque article
        items_with_days = []
        expired_items = []
        expiring_soon = []
        
        for item in sorted_items:
            try:
                exp_date = datetime.fromisoformat(item["expiration_date"]).date()
                days_left = (exp_date - today).days
                
                item_info = {
                    "name": item["name"],
                    "expiration_date": item["expiration_date"],
                    "days_left": days_left
                }
                
                if days_left < 0:
                    expired_items.append(item_info)
                elif days_left <= 2:
                    expiring_soon.append(item_info)
                
                items_with_days.append(item_info)
            except Exception as e:
                _LOGGER.error(f"Erreur lors du traitement de l'article {item}: {e}")
        
        return {
            "items": items_with_days,
            "expired_items": expired_items,
            "expiring_soon": expiring_soon,
            "total_items": len(items),
            "expired_count": len(expired_items),
            "expiring_soon_count": len(expiring_soon)
        }
    
    async def async_added_to_hass(self):
        """Enregistrer les callbacks."""
        @callback
        def update_callback(event):
            """Mettre à jour quand les données changent."""
            self.async_schedule_update_ha_state()
        
        self.hass.bus.async_listen("fridge_manager_updated", update_callback)
        _LOGGER.info("Listener enregistré pour les mises à jour")
    
    @property
    def should_poll(self):
        """Activer le polling pour les mises à jour automatiques."""
        return True  # Permettre les mises à jour automatiques

    @property
    def scan_interval(self):
        """Définir l'intervalle de scan à 24 heures."""
        return timedelta(hours=24)  # Mise à jour quotidienne

    async def async_update(self):
        """Mise à jour automatique du sensor."""
        _LOGGER.info("Mise à jour automatique du sensor Fridge Manager")

        # Forcer la mise à jour en réinitialisant l'état
        if DOMAIN in self.hass.data:
            items = self.hass.data[DOMAIN].get("items", [])
            today = datetime.now().date()

            # Recalculer les états des articles
            updated_items = []
            for item in items:
                try:
                    exp_date = datetime.fromisoformat(item["expiration_date"]).date()
                    days_left = (exp_date - today).days

                    updated_item = item.copy()
                    updated_item["days_left"] = days_left
                    updated_items.append(updated_item)

                    if days_left < 0 or days_left <= 2:
                        _LOGGER.info(f"Article '{item['name']}' expire dans {days_left} jours")
                except Exception as e:
                    _LOGGER.error(f"Erreur lors du traitement de l'article {item}: {e}")
                    updated_items.append(item)

            # Mettre à jour les données
            self.hass.data[DOMAIN]["items"] = updated_items

            _LOGGER.info(f"Mise à jour automatique terminée - {len(updated_items)} articles traités")
        else:
            _LOGGER.warning("DOMAIN non trouvé dans hass.data lors de la mise à jour automatique")
