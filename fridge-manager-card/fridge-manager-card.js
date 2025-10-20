class FridgeManagerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
  }

  set hass(hass) {
    this._hass = hass;
    this.updateCard();
  }

  setConfig(config) {
    this._config = config;
  }

  connectedCallback() {
    this.updateCard();
  }

  updateCard() {
    if (!this._hass) return;

    const sensor = this._hass.states['sensor.gestionnaire_de_frigo'];
    const items = sensor ? (sensor.attributes.items || []) : [];
    const expiredCount = sensor ? sensor.attributes.expired_count : 0;
    const expiringSoonCount = sensor ? sensor.attributes.expiring_soon_count : 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --fridge-primary: var(--primary-color, #3b82f6);
          --fridge-success: #10b981;
          --fridge-warning: #f59e0b;
          --fridge-danger: #ef4444;
          --fridge-radius: 24px;
          --fridge-spacing: 12px; /* Réduit de 16px */
        }

        ha-card {
          overflow: hidden;
          border-radius: var(--fridge-radius);
          background: var(--ha-card-background, var(--card-background-color, #fff));
        }

        .header {
          padding: var(--fridge-spacing);
          background: linear-gradient(135deg, var(--fridge-primary) 0%, var(--primary-color) 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .header-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          background: rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 12px;
          backdrop-filter: blur(10px);
        }

        .header-text h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .header-text p {
          margin: 4px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px; /* Réduit de 12px */
          padding: var(--fridge-spacing);
          background: var(--secondary-background-color);
          border-bottom: 1px solid var(--divider-color);
        }

        .stat {
          background: var(--card-background-color);
          border-radius: 16px;
          padding: 10px; /* Réduit de 12px */
          text-align: center;
          cursor: pointer;
        }

        .stat:active {
          transform: scale(0.98);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.7;
        }

        .stat.total { color: var(--fridge-primary); }
        .stat.warning { color: var(--fridge-warning); }
        .stat.danger { color: var(--fridge-danger); }

        .content {
          padding: var(--fridge-spacing);
        }

        .add-section {
          margin-bottom: 16px;
        }

        .add-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .input-label {
          display: block;
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-bottom: 4px;
          font-weight: 500;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 16px; /* Augmenté pour iOS */
          border: 2px solid var(--divider-color);
          border-radius: 12px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 16px; /* 16px empêche le zoom iOS */
          font-family: inherit;
          box-sizing: border-box;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--fridge-primary);
        }

        .input-wrapper input::placeholder {
          color: var(--secondary-text-color);
        }

        /* Style spécifique pour le champ date sur iOS */
        input[type="date"] {
          min-height: 48px;
          position: relative;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
        }

        .add-btn {
          background: var(--fridge-primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }

        .add-btn:active {
          transform: scale(0.98);
        }

        .add-btn:disabled {
          opacity: 0.7;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 10px; /* Réduit de 12px */
          -webkit-overflow-scrolling: touch;
        }

        .item {
          background: var(--card-background-color);
          border-radius: 16px;
          padding: 12px; /* Réduit de 16px */
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
          min-height: 60px; /* Hauteur minimale pour tactile */
        }

        .item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--fridge-success);
        }

        .item.expired::before {
          background: var(--fridge-danger);
        }

        .item.expiring-soon::before {
          background: var(--fridge-warning);
        }

        .item:active {
          transform: scale(0.98);
        }

        .item-icon {
          width: 40px; /* Réduit de 48px */
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px; /* Réduit de 24px */
          background: var(--secondary-background-color);
          flex-shrink: 0;
        }

        .item.expired .item-icon {
          background: rgba(239, 68, 68, 0.1);
          color: var(--fridge-danger);
        }

        .item.expiring-soon .item-icon {
          background: rgba(245, 158, 11, 0.1);
          color: var(--fridge-warning);
        }

        .item-info {
          flex: 1;
          min-width: 0; /* Important pour text-overflow */
        }

        .item-name {
          font-weight: 600;
          font-size: 15px; /* Réduit de 16px */
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-date {
          font-size: 13px;
          color: var(--secondary-text-color);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .days-badge {
          background: var(--fridge-success);
          color: white;
          padding: 4px 10px; /* Réduit de 12px */
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .days-badge.expired {
          background: var(--fridge-danger);
          animation: blink 1s ease-in-out infinite;
        }

        .days-badge.expiring-soon {
          background: var(--fridge-warning);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .remove-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          color: var(--fridge-danger);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .remove-btn:active {
          background: var(--fridge-danger);
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px; /* Réduit de 60px */
        }

        .empty-icon {
          font-size: 48px; /* Réduit de 64px */
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-title {
          font-size: 18px; /* Réduit de 20px */
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--primary-text-color);
        }

        .empty-text {
          color: var(--secondary-text-color);
          font-size: 14px;
        }

        ha-icon {
          --mdi-icon-size: 24px;
        }

        .loading {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Désactiver les animations hover sur mobile */
        @media (hover: none) {
          .stat:hover,
          .item:hover,
          .add-section:hover {
            transform: none;
            box-shadow: none;
          }
          
          .remove-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            color: var(--fridge-danger);
            transform: none;
          }
          
          .add-btn:hover {
            background: var(--fridge-primary);
            transform: none;
            box-shadow: none;
          }
        }
      </style>

      <ha-card>
        <div class="header">
          <div class="header-content">
            <div class="header-icon">
              <ha-icon icon="mdi:fridge"></ha-icon>
            </div>
            <div class="header-text">
              <h2>Mon Frigo</h2>
              <p>${this.getStatusMessage(items, expiredCount, expiringSoonCount)}</p>
            </div>
          </div>
        </div>

        <div class="stats">
          <div class="stat total">
            <div class="stat-value">${items.length}</div>
            <div class="stat-label">Articles</div>
          </div>
          <div class="stat warning">
            <div class="stat-value">${expiringSoonCount}</div>
            <div class="stat-label">Bientôt</div>
          </div>
          <div class="stat danger">
            <div class="stat-value">${expiredCount}</div>
            <div class="stat-label">Expirés</div>
          </div>
        </div>

        <div class="content">
          <div class="add-section">
            <div class="add-form">
              <div class="input-wrapper">
                <label class="input-label" for="item-name">Nom de l'article</label>
                <input 
                  type="text" 
                  id="item-name" 
                  placeholder="Nom de l'article"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="words"
                >
              </div>
              <div class="input-wrapper">
                <label class="input-label" for="item-date">Date d'expiration</label>
                <input 
                  type="date" 
                  id="item-date"
                  min="${new Date().toISOString().split('T')[0]}"
                >
              </div>
              <button class="add-btn" id="add-btn">
                <ha-icon icon="mdi:plus"></ha-icon>
                Ajouter
              </button>
            </div>
          </div>
          
          ${items.length === 0 
            ? `
              <div class="empty-state">
                <div class="empty-icon">🥶</div>
                <div class="empty-title">Frigo vide</div>
                <div class="empty-text">Ajoutez vos premiers articles pour commencer</div>
              </div>
            `
            : `
              <div class="items-list">
                ${items.map(item => this.renderItem(item)).join('')}
              </div>
            `
          }
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  getStatusMessage(items, expiredCount, expiringSoonCount) {
    if (expiredCount > 0) {
      return `⚠️ ${expiredCount} article${expiredCount > 1 ? 's' : ''} expiré${expiredCount > 1 ? 's' : ''}`;
    } else if (expiringSoonCount > 0) {
      return `👀 ${expiringSoonCount} article${expiringSoonCount > 1 ? 's' : ''} à consommer rapidement`;
    } else if (items.length > 0) {
      return `✨ Tout est frais !`;
    } else {
      return `Commencez à ajouter des articles`;
    }
  }

  renderItem(item) {
    let itemClass = 'item';
    let daysClass = '';
    let daysText = '';
    let icon = '📦';
    
    if (item.days_left < 0) {
      itemClass += ' expired';
      daysClass = 'expired';
      daysText = 'Expiré';
      icon = '❌';
    } else if (item.days_left === 0) {
      itemClass += ' expiring-soon';
      daysClass = 'expiring-soon';
      daysText = "Aujourd'hui";
      icon = '⏰';
    } else if (item.days_left === 1) {
      itemClass += ' expiring-soon';
      daysClass = 'expiring-soon';
      daysText = "Demain";
      icon = '⏰';
    } else if (item.days_left <= 2) {
      itemClass += ' expiring-soon';
      daysClass = 'expiring-soon';
      daysText = `${item.days_left} jours`;
      icon = '⚠️';
    } else {
      daysText = `${item.days_left} jours`;
      icon = '✅';
    }
    
    const date = new Date(item.expiration_date);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short'
    });
    
    return `
      <div class="${itemClass}">
        <div class="item-icon">${icon}</div>
        <div class="item-info">
          <div class="item-name" title="${item.name}">${item.name}</div>
          <div class="item-date">
            <ha-icon icon="mdi:calendar"></ha-icon>
            ${dateStr}
          </div>
        </div>
        <span class="days-badge ${daysClass}">${daysText}</span>
        <button class="remove-btn" data-item="${item.name}">
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    const addBtn = this.shadowRoot.getElementById('add-btn');
    const nameInput = this.shadowRoot.getElementById('item-name');
    const dateInput = this.shadowRoot.getElementById('item-date');

    // Empêcher le défocus sur iOS
    if (nameInput) {
      nameInput.addEventListener('touchend', (e) => {
        e.preventDefault();
        nameInput.focus();
      });
      
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          if (dateInput) dateInput.focus();
        }
      });
    }

    if (dateInput) {
      dateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addItem();
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addItem();
      });
    }

    this.shadowRoot.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const itemName = e.currentTarget.dataset.item;
        this.removeItem(itemName);
      });
    });
  }

  addItem() {
    const nameInput = this.shadowRoot.getElementById('item-name');
    const dateInput = this.shadowRoot.getElementById('item-date');
    const addBtn = this.shadowRoot.getElementById('add-btn');
    
    if (!nameInput.value || !dateInput.value) {
      // Animation de secousse plus douce
      if (!nameInput.value) {
        nameInput.style.borderColor = 'var(--fridge-danger)';
        setTimeout(() => {
          nameInput.style.borderColor = '';
        }, 1500);
      }
      if (!dateInput.value) {
        dateInput.style.borderColor = 'var(--fridge-danger)';
        setTimeout(() => {
          dateInput.style.borderColor = '';
        }, 1500);
      }
      return;
    }
    
    // Animation de chargement
    addBtn.innerHTML = '<ha-icon icon="mdi:loading" class="loading"></ha-icon> Ajout...';
    addBtn.disabled = true;
    
    this._hass.callService('fridge_manager', 'add_item', {
      name: nameInput.value,
      expiration_date: dateInput.value
    }).then(() => {
      nameInput.value = '';
      dateInput.value = '';
      
      // Sur mobile, on ne refocus pas automatiquement
      
      // Notification visuelle
      addBtn.innerHTML = '<ha-icon icon="mdi:check"></ha-icon> Ajouté !';
      addBtn.style.background = 'var(--fridge-success)';
      
      setTimeout(() => {
        addBtn.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon> Ajouter';
        addBtn.style.background = '';
        addBtn.disabled = false;
      }, 1500);
    }).catch(() => {
      addBtn.innerHTML = '<ha-icon icon="mdi:alert"></ha-icon> Erreur';
      addBtn.style.background = 'var(--fridge-danger)';
      
      setTimeout(() => {
        addBtn.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon> Ajouter';
        addBtn.style.background = '';
        addBtn.disabled = false;
      }, 1500);
    });
  }

  removeItem(name) {
    const btn = this.shadowRoot.querySelector(`[data-item="${name}"]`);
    if (btn) {
      btn.innerHTML = '<ha-icon icon="mdi:loading" class="loading"></ha-icon>';
      btn.disabled = true;
    }
    
    this._hass.callService('fridge_manager', 'remove_item', { name });
  }

  getCardSize() {
    return 4;
  }
}

customElements.define('fridge-manager-card', FridgeManagerCard);

// Enregistrer la carte
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'fridge-manager-card',
  name: 'Gestionnaire de Frigo',
  description: 'Carte moderne pour gérer les articles du frigo'
});
