class ThemeManager {
    constructor() {
        this.themes = {
            'light-default': {
                name: 'Claro Padrão',
                type: 'light',
                preview: {
                    primary: '#6c5ce7',
                    secondary: '#00cec9',
                    bg: '#f9f9fb',
                    text: '#2d2d2d'
                },
                colors: {
                    '--primary-color': '#6c5ce7',
                    '--primary-dark': '#5649c0',
                    '--primary-darker': '#3d3589',
                    '--primary-light': '#8577ec',
                    '--secondary-color': '#00cec9',
                    '--secondary-dark': '#00a8a4',
                    '--background': '#f9f9fb',
                    '--text-color': '#2d2d2d',
                    '--text-secondary': '#666',
                    '--text-tertiary': '#999',
                    '--border-color': '#e0e0e0',
                    '--hover-bg': '#f0f0f0',
                    '--player-bg': '#ffffff',
                    '--danger-color': '#ff4757'
                }
            },
            'dark-default': {
                name: 'Escuro Padrão',
                type: 'dark',
                preview: {
                    primary: '#6c5ce7',
                    secondary: '#00cec9',
                    bg: '#1a1a1a',
                    text: '#ffffff'
                },
                colors: {
                    '--primary-color': '#6c5ce7',
                    '--primary-dark': '#5649c0',
                    '--primary-darker': '#3d3589',
                    '--primary-light': '#8577ec',
                    '--secondary-color': '#00cec9',
                    '--secondary-dark': '#00a8a4',
                    '--background': '#1a1a1a',
                    '--text-color': '#ffffff',
                    '--text-secondary': '#cccccc',
                    '--text-tertiary': '#999999',
                    '--border-color': '#333333',
                    '--hover-bg': '#2d2d2d',
                    '--player-bg': '#222222',
                    '--danger-color': '#ff4757'
                }
            },
            'light-ocean': {
                name: 'Oceano Claro',
                type: 'light',
                preview: {
                    primary: '#2196f3',
                    secondary: '#00bcd4',
                    bg: '#e3f2fd',
                    text: '#0d47a1'
                },
                colors: {
                    '--primary-color': '#2196f3',
                    '--primary-dark': '#1976d2',
                    '--primary-darker': '#0d47a1',
                    '--primary-light': '#64b5f6',
                    '--secondary-color': '#00bcd4',
                    '--secondary-dark': '#0097a7',
                    '--background': '#e3f2fd',
                    '--text-color': '#0d47a1',
                    '--text-secondary': '#1976d2',
                    '--text-tertiary': '#2196f3',
                    '--border-color': '#bbdefb',
                    '--hover-bg': '#e1f5fe',
                    '--player-bg': '#ffffff',
                    '--danger-color': '#ff4081'
                }
            },
            'dark-space': {
                name: 'Espaço Escuro',
                type: 'dark',
                preview: {
                    primary: '#7e57c2',
                    secondary: '#26c6da',
                    bg: '#121212',
                    text: '#e1f5fe'
                },
                colors: {
                    '--primary-color': '#7e57c2',
                    '--primary-dark': '#5e35b1',
                    '--primary-darker': '#4527a0',
                    '--primary-light': '#b39ddb',
                    '--secondary-color': '#26c6da',
                    '--secondary-dark': '#00acc1',
                    '--background': '#121212',
                    '--text-color': '#e1f5fe',
                    '--text-secondary': '#b3e5fc',
                    '--text-tertiary': '#81d4fa',
                    '--border-color': '#1e1e1e',
                    '--hover-bg': '#1d1d1d',
                    '--player-bg': '#1a1a1a',
                    '--danger-color': '#ff6e40'
                }
            },
            'light-nature': {
                name: 'Natureza Clara',
                type: 'light',
                preview: {
                    primary: '#4caf50',
                    secondary: '#8bc34a',
                    bg: '#f1f8e9',
                    text: '#1b5e20'
                },
                colors: {
                    '--primary-color': '#4caf50',
                    '--primary-dark': '#388e3c',
                    '--primary-darker': '#2e7d32',
                    '--primary-light': '#81c784',
                    '--secondary-color': '#8bc34a',
                    '--secondary-dark': '#7cb342',
                    '--background': '#f1f8e9',
                    '--text-color': '#1b5e20',
                    '--text-secondary': '#2e7d32',
                    '--text-tertiary': '#689f38',
                    '--border-color': '#c8e6c9',
                    '--hover-bg': '#dcedc8',
                    '--player-bg': '#ffffff',
                    '--danger-color': '#f44336'
                }
            },
            'dark-midnight': {
                name: 'Meia-Noite',
                type: 'dark',
                preview: {
                    primary: '#9c27b0',
                    secondary: '#673ab7',
                    bg: '#121212',
                    text: '#e1bee7'
                },
                colors: {
                    '--primary-color': '#9c27b0',
                    '--primary-dark': '#7b1fa2',
                    '--primary-darker': '#4a148c',
                    '--primary-light': '#ba68c8',
                    '--secondary-color': '#673ab7',
                    '--secondary-dark': '#5e35b1',
                    '--background': '#121212',
                    '--text-color': '#e1bee7',
                    '--text-secondary': '#ce93d8',
                    '--text-tertiary': '#ba68c8',
                    '--border-color': '#1e1e1e',
                    '--hover-bg': '#1d1d1d',
                    '--player-bg': '#1a1a1a',
                    '--danger-color': '#ff5252'
                }
            },
            // Tema 1: Minimal Light
            'minimal-light': {
                name: 'Minimal Claro',
                type: 'light',
                preview: {
                    primary: '#3498db',
                    secondary: '#2ecc71',
                    bg: '#f5f6fa',
                    text: '#2d3436'
                },
                colors: {
                    '--primary-color': '#3498db',
                    '--primary-dark': '#2980b9',
                    '--primary-darker': '#1f618d',
                    '--primary-light': '#5dade2',
                    '--secondary-color': '#2ecc71',
                    '--secondary-dark': '#27ae60',
                    '--background': '#f5f6fa',
                    '--text-color': '#2d3436',
                    '--text-secondary': '#636e72',
                    '--text-tertiary': '#b2bec3',
                    '--border-color': '#dfe6e9',
                    '--hover-bg': '#e0e6ef',
                    '--player-bg': '#ecf0f1',
                    '--danger-color': '#e74c3c'
                }
            },
            // Tema 2: Sunset Glow
            'sunset-glow': {
                name: 'Pôr do Sol',
                type: 'dark',
                preview: {
                    primary: '#fd79a8',
                    secondary: '#ff9f43',
                    bg: '#2d142c',
                    text: '#f5f6fa'
                },
                colors: {
                    '--primary-color': '#fd79a8',
                    '--primary-dark': '#d81b60',
                    '--primary-darker': '#ad1457',
                    '--primary-light': '#ff85b3',
                    '--secondary-color': '#ff9f43',
                    '--secondary-dark': '#f57c00',
                    '--background': '#2d142c',
                    '--text-color': '#f5f6fa',
                    '--text-secondary': '#dfe6e9',
                    '--text-tertiary': '#b2bec3',
                    '--border-color': '#4a2b48',
                    '--hover-bg': '#3f1e3e',
                    '--player-bg': '#351a35',
                    '--danger-color': '#e91e63'
                }
            },
            // Tema 3: Ocean Breeze
            'ocean-breeze': {
                name: 'Brisa Oceânica',
                type: 'light',
                preview: {
                    primary: '#00b7eb',
                    secondary: '#55efc4',
                    bg: '#e6f3fa',
                    text: '#2c3e50'
                },
                colors: {
                    '--primary-color': '#00b7eb',
                    '--primary-dark': '#0097c7',
                    '--primary-darker': '#006d8e',
                    '--primary-light': '#4dd2ff',
                    '--secondary-color': '#55efc4',
                    '--secondary-dark': '#00d4b0',
                    '--background': '#e6f3fa',
                    '--text-color': '#2c3e50',
                    '--text-secondary': '#636e72',
                    '--text-tertiary': '#95a5a6',
                    '--border-color': '#b3cde0',
                    '--hover-bg': '#d1e7f2',
                    '--player-bg': '#d9e8f0',
                    '--danger-color': '#e74c3c'
                }
            },
            // Tema 4: Midnight Blue
            'midnight-blue': {
                name: 'Azul Meia-Noite',
                type: 'dark',
                preview: {
                    primary: '#0984e3',
                    secondary: '#00d2d3',
                    bg: '#0a0f2c',
                    text: '#dfe6e9'
                },
                colors: {
                    '--primary-color': '#0984e3',
                    '--primary-dark': '#0767b0',
                    '--primary-darker': '#054a80',
                    '--primary-light': '#3498db',
                    '--secondary-color': '#00d2d3',
                    '--secondary-dark': '#00a8a9',
                    '--background': '#0a0f2c',
                    '--text-color': '#dfe6e9',
                    '--text-secondary': '#b2bec3',
                    '--text-tertiary': '#7f8c8d',
                    '--border-color': '#2c3e50',
                    '--hover-bg': '#1b263b',
                    '--player-bg': '#141a3a',
                    '--danger-color': '#ff6b6b'
                }
            },
            // Tema 5: Warm Amber
            'warm-amber': {
                name: 'Âmbar Quente',
                type: 'light',
                preview: {
                    primary: '#e67e22',
                    secondary: '#f1c40f',
                    bg: '#fdf6e3',
                    text: '#3c2f2f'
                },
                colors: {
                    '--primary-color': '#e67e22',
                    '--primary-dark': '#d35400',
                    '--primary-darker': '#a04000',
                    '--primary-light': '#f39c12',
                    '--secondary-color': '#f1c40f',
                    '--secondary-dark': '#f39c12',
                    '--background': '#fdf6e3',
                    '--text-color': '#3c2f2f',
                    '--text-secondary': '#6c5b5b',
                    '--text-tertiary': '#a89696',
                    '--border-color': '#e0d1b7',
                    '--hover-bg': '#f0e7d2',
                    '--player-bg': '#f7eed9',
                    '--danger-color': '#c0392b'
                }
            },
            // * Temas temáticos inspirados em vibes específicas
            // Tema 6: Porsche Taycan Turbo S
            'porsche-taycan': {
                name: 'Porsche Taycan Turbo S',
                type: 'dark',
                preview: {
                    primary: '#004170',
                    secondary: '#ff073a',
                    bg: '#1c2526',
                    text: '#e6e6e6'
                },
                colors: {
                    '--primary-color': '#004170', // * Azul escuro do Taycan
                    '--primary-dark': '#002b4e',
                    '--primary-darker': '#001b33',
                    '--primary-light': '#336699',
                    '--secondary-color': '#ff073a', // * Vermelho vibrante dos detalhes
                    '--secondary-dark': '#cc062e',
                    '--background': '#1c2526', // * Cinza escuro metálico
                    '--text-color': '#e6e6e6',
                    '--text-secondary': '#b3b3b3',
                    '--text-tertiary': '#808080',
                    '--border-color': '#404040',
                    '--hover-bg': '#2e3a3b',
                    '--player-bg': '#252f30',
                    '--danger-color': '#ff4040'
                }
            },
            // Tema 7: Country Vibes
            'country-vibes': {
                name: 'Vibe Country',
                type: 'light',
                preview: {
                    primary: '#8b4513',
                    secondary: '#d4a017',
                    bg: '#f5e6cc',
                    text: '#3c2f2f'
                },
                colors: {
                    '--primary-color': '#8b4513', // * Marrom de botas de couro
                    '--primary-dark': '#663311',
                    '--primary-darker': '#4a240c',
                    '--primary-light': '#a0522d',
                    '--secondary-color': '#d4a017', // * Amarelo de campos dourados
                    '--secondary-dark': '#b8860b',
                    '--background': '#f5e6cc', // * Bege suave de paisagem rural
                    '--text-color': '#3c2f2f',
                    '--text-secondary': '#6c5b5b',
                    '--text-tertiary': '#a89696',
                    '--border-color': '#d9c2a6',
                    '--hover-bg': '#e8d7b9',
                    '--player-bg': '#eddcc1',
                    '--danger-color': '#c0392b'
                }
            },
            // Tema 8: Drift King
            'drift-king': {
                name: 'Rei do Drift',
                type: 'dark',
                preview: {
                    primary: '#ff2e63',
                    secondary: '#00b7eb',
                    bg: '#0f0f0f',
                    text: '#ffffff'
                },
                colors: {
                    '--primary-color': '#ff2e63', // * Rosa neon dos carros de drift
                    '--primary-dark': '#cc254e',
                    '--primary-darker': '#991b39',
                    '--primary-light': '#ff577f',
                    '--secondary-color': '#00b7eb', // * Azul dos pneus queimando
                    '--secondary-dark': '#0097c7',
                    '--background': '#0f0f0f', // * Asfalto escuro
                    '--text-color': '#ffffff',
                    '--text-secondary': '#cccccc',
                    '--text-tertiary': '#999999',
                    '--border-color': '#333333',
                    '--hover-bg': '#1f1f1f',
                    '--player-bg': '#181818',
                    '--danger-color': '#ff073a'
                }
            },
            // Tema 9: Tech Startup
            'tech-startup': {
                name: 'Startup Tech',
                type: 'light',
                preview: {
                    primary: '#007bff',
                    secondary: '#28a745',
                    bg: '#ffffff',
                    text: '#212529'
                },
                colors: {
                    '--primary-color': '#007bff', // * Azul tech moderno
                    '--primary-dark': '#005cbf',
                    '--primary-darker': '#004085',
                    '--primary-light': '#3395ff',
                    '--secondary-color': '#28a745', // * Verde de inovação
                    '--secondary-dark': '#218838',
                    '--background': '#ffffff',
                    '--text-color': '#212529',
                    '--text-secondary': '#6c757d',
                    '--text-tertiary': '#adb5bd',
                    '--border-color': '#dee2e6',
                    '--hover-bg': '#f1f3f5',
                    '--player-bg': '#f8f9fa',
                    '--danger-color': '#dc3545'
                }
            },
            // Tema 10: Pop Music
            'pop-music': {
                name: 'Pop Music',
                type: 'dark',
                preview: {
                    primary: '#ff69b4',
                    secondary: '#40c4ff',
                    bg: '#1c1124',
                    text: '#f5f6fa'
                },
                colors: {
                    '--primary-color': '#ff69b4', // * Rosa vibrante de shows pop
                    '--primary-dark': '#db4e99',
                    '--primary-darker': '#b03a7a',
                    '--primary-light': '#ff85c2',
                    '--secondary-color': '#40c4ff', // * Azul de luzes de palco
                    '--secondary-dark': '#00a8e6',
                    '--background': '#1c1124', // * Fundo roxo escuro de shows
                    '--text-color': '#f5f6fa',
                    '--text-secondary': '#dfe6e9',
                    '--text-tertiary': '#b2bec3',
                    '--border-color': '#3d2b4a',
                    '--hover-bg': '#2e1e38',
                    '--player-bg': '#261a30',
                    '--danger-color': '#ff3d6e'
                }
            }
        };

        this.currentTheme = null;
        this.init();
    }

    init() {
        this.loadTheme();

        if(location.href.includes('index.html') || location.href.endsWith('/')) {
            this.renderThemeSelector();
            this.setupEventListeners();
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        const defaultTheme = 'light-default';

        if (savedTheme && this.themes[savedTheme]) {
            this.applyTheme(savedTheme);
        } else {
            this.applyTheme(defaultTheme);
        }
    }

    applyTheme(themeId) {
        const theme = this.themes[themeId];
        if (!theme) return;

        const root = document.documentElement;

        // Aplica todas as variáveis CSS
        Object.keys(theme.colors).forEach(key => {
            root.style.setProperty(key, theme.colors[key]);
        });

        // Atualiza o tema atual
        this.currentTheme = themeId;

        // Salva no localStorage
        localStorage.setItem('selectedTheme', themeId);

        // Atualiza a UI do seletor de temas
        this.updateThemeSelectorUI();
    }

    renderThemeSelector() {
        const themeContainer = document.createElement('div');
        themeContainer.id = 'theme-selector-container';
        themeContainer.innerHTML = `
      <div class="theme-selector-header">
        <h3>Temas</h3>
        <div class="theme-tabs">
          <button class="theme-tab active" data-type="all">Todos</button>
          <button class="theme-tab" data-type="light">Claros</button>
          <button class="theme-tab" data-type="dark">Escuros</button>
        </div>
      </div>
      <div class="theme-grid" id="theme-grid"></div>
    `;

        document.body.appendChild(themeContainer);
        this.updateThemeGrid('all');
    }

    updateThemeGrid(filter = 'all') {
        const themeGrid = document.getElementById('theme-grid');
        if (!themeGrid) return;

        themeGrid.innerHTML = '';

        Object.entries(this.themes).forEach(([id, theme]) => {
            if (filter === 'all' || theme.type === filter) {
                const isActive = this.currentTheme === id;

                const themeCard = document.createElement('div');
                themeCard.className = `theme-card ${isActive ? 'active' : ''}`;
                themeCard.dataset.themeId = id;

                themeCard.innerHTML = `
          <div class="theme-preview">
            <div class="theme-preview-primary" style="background-color: ${theme.preview.primary}"></div>
            <div class="theme-preview-secondary" style="background-color: ${theme.preview.secondary}"></div>
            <div class="theme-preview-bg" style="background-color: ${theme.preview.bg}">
              <span style="color: ${theme.preview.text}">Aa</span>
            </div>
          </div>
          <div class="theme-info">
            <span class="theme-name">${theme.name}</span>
            <span class="theme-type ${theme.type}">${theme.type === 'light' ? 'Claro' : 'Escuro'}</span>
          </div>
          ${isActive ? '<div class="theme-active-marker"><i class="fas fa-check"></i></div>' : ''}
        `;

                themeGrid.appendChild(themeCard);
            }
        });
    }

    updateThemeSelectorUI() {
        // Atualiza os cards ativos
        document.querySelectorAll('.theme-card').forEach(card => {
            if (card.dataset.themeId === this.currentTheme) {
                card.classList.add('active');
                card.innerHTML += '<div class="theme-active-marker"><i class="fas fa-check"></i></div>';
            } else {
                card.classList.remove('active');
                const marker = card.querySelector('.theme-active-marker');
                if (marker) marker.remove();
            }
        });

        // Atualiza o botão de tema atual
        const themeButton = document.getElementById('theme-button');
        if (themeButton) {
            const currentTheme = this.themes[this.currentTheme];
            themeButton.innerHTML = `
        <div class="current-theme-preview">
          <span style="background-color: ${currentTheme.preview.primary}"></span>
          <span style="background-color: ${currentTheme.preview.secondary}"></span>
          <span style="background-color: ${currentTheme.preview.bg}"></span>
        </div>
        <span>Tema</span>
      `;
        }
    }

    setupEventListeners() {
        // Botão para abrir o seletor de temas
        const themeButton = document.createElement('button');
        themeButton.id = 'theme-button';
        themeButton.className = 'floating-button';
        themeButton.innerHTML = `
        <div class="current-theme-preview">
            <span style="background-color: ${this.themes[this.currentTheme].preview.primary}"></span>
            <span style="background-color: ${this.themes[this.currentTheme].preview.secondary}"></span>
            <span style="background-color: ${this.themes[this.currentTheme].preview.bg}"></span>
        </div>
        <span>Tema</span>
        `;

        themeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o evento chegue ao document
            document.getElementById('theme-selector-container').classList.toggle('visible');
        });

        document.body.appendChild(themeButton);

        // Filtros de tema
        document.querySelectorAll('.theme-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o evento chegue ao document
                document.querySelectorAll('.theme-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.updateThemeGrid(tab.dataset.type);
            });
        });

        // Seleção de tema - não fecha o popup
        document.addEventListener('click', (e) => {
            const themeCard = e.target.closest('.theme-card');
            if (themeCard) {
                e.stopPropagation(); // Impede que o evento chegue ao document
                this.applyTheme(themeCard.dataset.themeId);
                if(sound_desk) {
                    sound_desk.command = 'change_theme'
                    sound_desk.theme = themeCard.dataset.themeId
                    console.log(sound_desk)
                    
                    db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
                }
                return;
            }

            // Fechar seletor apenas ao clicar fora
            if (!e.target.closest('#theme-selector-container') &&
                e.target !== themeButton) {
                document.getElementById('theme-selector-container').classList.remove('visible');
            }
        });

        // Adiciona evento global para fechar ao pressionar Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('theme-selector-container').classList.remove('visible');
            }
        });
    }
}

// Inicializa o gerenciador de temas
const temaManager = new ThemeManager()