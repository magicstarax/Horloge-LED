document.addEventListener('DOMContentLoaded', () => {
    // ─────────────────────────────────────────────────────────────
    // Sélecteurs DOM
    // ─────────────────────────────────────────────────────────────
    const menuButton        = document.getElementById('menu-button');
    const dropdownMenu      = document.getElementById('dropdown-menu');
    const fullscreenToggle  = document.getElementById('fullscreen-toggle');
    const audioToggle       = document.getElementById('audio-toggle');
    const chimeToggle       = document.getElementById('chime-toggle');
    const themeToggle       = document.getElementById('theme-toggle');
    const timezoneToggle    = document.getElementById('timezone-toggle');
    const languageToggle    = document.getElementById('language-toggle');
    const colorsToggle      = document.getElementById('colors-toggle');
    const displayToggle     = document.getElementById('display-toggle');
    const versionContainer  = document.getElementById('app-version');

    const clock       = document.querySelector('.clock');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    // Panneau de langue
    const languageOverlay     = document.getElementById('language-overlay');
    const languagePanel       = document.getElementById('language-panel');
    const languagePanelTitle  = document.getElementById('language-panel-title');
    const languageOptions     = document.querySelectorAll('.language-option');

    // Panneau de couleurs
    const colorsOverlay       = document.getElementById('colors-overlay');
    const colorsPanel         = document.getElementById('colors-panel');
    const colorsPanelTitle    = document.getElementById('colors-panel-title');
    const colorPresetButtons  = document.querySelectorAll('.color-preset');
    const colorSecondsInput   = document.getElementById('color-seconds-input');
    const colorMinutesInput   = document.getElementById('color-minutes-input');
    const colorMarkersInput   = document.getElementById('color-markers-input');
    const colorsApplyCustom   = document.getElementById('colors-apply-custom');
    const colorsReset         = document.getElementById('colors-reset');

    // Panneau fuseau horaire
    const timezoneOverlay        = document.getElementById('timezone-overlay');
    const timezonePanel          = document.getElementById('timezone-panel');
    const timezonePanelTitle     = document.getElementById('timezone-panel-title');
    const timezoneModeRadios     = document.querySelectorAll('input[name="timezone-mode"]');
    const timezoneMap            = document.getElementById('timezone-map');
    const timezoneSelect         = document.getElementById('timezone-select');
    const timezoneSelectLabel    = document.getElementById('timezone-select-label');
    const timezoneZoneSection    = document.querySelector('.timezone-zone-section');
    const timezoneOffsetSection  = document.querySelector('.timezone-offset-section');
    const timezoneModeAutoLabel  = document.getElementById('timezone-mode-auto-label');
    const timezoneModeZoneLabel  = document.getElementById('timezone-mode-zone-label');
    const timezoneModeOffsetLabel= document.getElementById('timezone-mode-offset-label');
    const timezoneOffsetLabel    = document.getElementById('timezone-offset-label');
    const timezoneOffsetInput    = document.getElementById('timezone-offset-input');
    const timezoneOffsetApply    = document.getElementById('timezone-offset-apply');
    const timezoneOffsetHelp     = document.getElementById('timezone-offset-help');

    // Panneau d'affichage
    const displayOverlay      = document.getElementById('display-overlay');
    const displayPanel        = document.getElementById('display-panel');
    const displayPanelTitle   = document.getElementById('display-panel-title');
    const optShowSeconds      = document.getElementById('opt-show-seconds');
    const optShowMinutes      = document.getElementById('opt-show-minutes');
    const optShowMarkers      = document.getElementById('opt-show-markers');
    const optShowDate         = document.getElementById('opt-show-date');
    const optShowAmpm         = document.getElementById('opt-show-ampm');
    const optShowSecondsTime  = document.getElementById('opt-show-seconds-time');
    const optShowSecondsRunner = document.getElementById('opt-show-seconds-runner');

    // Panneau de profils
    const profilesToggle        = document.getElementById('profiles-toggle');
    const profilesOverlay       = document.getElementById('profiles-overlay');
    const profilesPanel         = document.getElementById('profiles-panel');
    const profilesPanelTitle    = document.getElementById('profiles-panel-title');
    const profileNameInput      = document.getElementById('profile-name-input');
    const profileSaveBtn        = document.getElementById('profile-save-btn');
    const profilesListContainer = document.getElementById('profiles-list-container');

        // Panneau de planning du carillon
    const chimeOverlay       = document.getElementById('chime-overlay');
    const chimePanel         = document.getElementById('chime-panel');
    const chimePanelTitle    = document.getElementById('chime-panel-title');
    const chimePanelDesc     = document.getElementById('chime-panel-description');
    const chimeStartInput    = document.getElementById('chime-start-hour');
    const chimeEndInput      = document.getElementById('chime-end-hour');
    const chimeStartLabel    = document.getElementById('chime-start-label');
    const chimeEndLabel      = document.getElementById('chime-end-label');
    const chimeSaveBtn       = document.getElementById('chime-save-btn');
    const chimeCancelBtn     = document.getElementById('chime-cancel-btn');
    const chimeNote          = document.getElementById('chime-note');

    // Bouton de menu pour ouvrir le planning du carillon
    const chimePlanningToggle = document.getElementById('chime-planning-toggle');


    // ─────────────────────────────────────────────────────────────
    // État / configuration
    // ─────────────────────────────────────────────────────────────
    const SETTINGS_KEY = 'studioClockSettings';
    const PROFILES_KEY = 'studioClockProfiles';

    let currentTheme     = 'dark';
    let isAudioEnabled   = false; // bip chaque seconde
    let isChimeEnabled   = false; // son des quarts d'heure

    // Plage horaire
    let chimeStartMinutes = 8 * 60;  // 08:00 en minutes
    let chimeEndMinutes   = 22 * 60; // 22:00 en minutes

    // Nouveau modèle de fuseau horaire
    let timezoneMode   = 'auto';   // 'auto' | 'zone' | 'offset'
    let timezoneId     = null;     // ex: 'Europe/Paris'
    let timezoneOffset = 1;        // utilisé seulement en mode 'offset'

    let currentLanguage  = 'fr';  // Langue par défaut

    let redDots     = [];  // secondes
    let minuteDots  = [];  // minutes

    // Runner des secondes synchronisé avec le changement de seconde affichée
    let lastSecondIndex = 0;                 // dernière seconde affichée (0-59)
    let lastTickTime    = performance.now(); // moment du dernier updateClock()
    let lastChimeKey = null; // ex. "2025-11-23-20-15" (année-mois-jour-heure-minute)

    const DEFAULT_COLOR_THEME = {
        secondsOn: '#ff0000',
        minutesOn: '#00aaff',
        markers:   '#ffa600',
    };

    const COLOR_PRESETS = {
        classic: { ...DEFAULT_COLOR_THEME },
        ocean: {
            secondsOn: '#00e1ff',
            minutesOn: '#0051ff',
            markers:   '#00ffbf',
        },
        matrix: {
            secondsOn: '#00ff00',
            minutesOn: '#00aa66',
            markers:   '#66ff00',
        },
        sunset: {
            secondsOn: '#ff4500',
            minutesOn: '#ff0080',
            markers:   '#ffd000',
        },
    };

    let colorTheme         = { ...DEFAULT_COLOR_THEME };
    let currentColorPreset = 'classic';

    let displayOptions = {
        showSecondsDots:   true,
        showMinuteDots:    true,
        showMarkers:       true,
        showDate:          true,
        showAmpm:          true,
        showSecondsTime:   true,
        // IMPORTANT : la roue des secondes est active par défaut
        showSecondsRunner: true,
    };

    // Profils
    let profiles = {};

    // Version de l'application (sécurisée)
    if (versionContainer) {
        const safeVersion = (typeof appVersion !== 'undefined') ? appVersion : 'dev';
        versionContainer.textContent = `Version : ${safeVersion}`;
    }

    // Fichier audio pour le son de seconde
    const audio = new Audio('son/clock.wav');

    // Sons des quarts d'heure (Big Ben)
    const quarterSounds = {
        1: new Audio('son/bigben_quart1.wav'), // 15 minutes
        2: new Audio('son/bigben_quart2.wav'), // 30 minutes
        3: new Audio('son/bigben_quart3.wav'), // 45 minutes
        4: new Audio('son/bigben_quart4.wav'), // heure pile
    };

    // Préchargement pour éviter le petit délai au déclenchement
    Object.values(quarterSounds).forEach(sound => {
        sound.preload = 'auto';
    });


    // ─────────────────────────────────────────────────────────────
    // Traductions
    // ─────────────────────────────────────────────────────────────
    const translations = {
        en: {
            fullscreen:   'Fullscreen',
            playSound:    'Enable tick sound',
            stopSound:    'Disable tick sound',
            playChime:    'Enable chime sound',
            stopChime:    'Disable chime sound',
            changeTheme:  'Change theme',
            timezone:     'Timezone',
            timezoneTitle: 'Timezone',
            timezoneAuto:  'Automatic (system time)',
            timezoneZoneMode: 'Select by area / city',
            timezoneOffsetMode: 'Custom offset (UTC)',
            timezoneCityLabel: 'City / zone',
            timezoneOffsetLabel: 'Offset from UTC',
            timezoneOffsetHelp: 'Example: -5 for New York, 5.5 for India.',
            timezoneOffsetApply: 'Apply',
            invalidOffset:'Invalid timezone offset.',
            language:     'Language',
            colors:       'Colors',
            colorsTitle:  'Colors',
            display:      'Display',
            displayTitle: 'Display options',
            showSecondsDots:    'Seconds ring',
            showMinutesDots:    'Minutes ring',
            showMarkers:        '5s markers',
            showDate:           'Show date',
            showAmpm:           'Show AM/PM',
            showSecondsTime:    'Show seconds in time',
            showSecondsRunner:  'Seconds runner',

            chimeSchedule:      'Chime schedule',
            chimePanelTitle:    'Chime schedule',
            chimePanelDescription: 'Set the time range during which the chime sound will play on the quarters.',
            chimeStartLabel:    'Chime start time',
            chimeEndLabel:      'Chime end time',
            chimeNote:          'Note: the chime will only play if the tick sound is enabled.',
            chimeSaveBtn:       'Save',
            chimeCancelBtn:     'Cancel',

            profiles:                'Profiles',
            profilesTitle:           'Profiles',
            profileNameLabel:        'Profile name',
            profileSaveButton:       'Save profile',
            profilesListTitle:       'Saved profiles',
            profilesEmpty:           'No profiles saved yet.',
            applyProfile:            'Apply',
            deleteProfile:           'Delete',
            confirmOverwriteProfile: 'A profile with this name already exists. Overwrite?',
            confirmDeleteProfile:    'Delete this profile?',
            sameSettingsWarning:     'Warning: profile "{name}" already has exactly the same settings. Do you still want to save this profile?',
        },

        fr: {
            fullscreen:   'Plein écran',
            playSound:    'Activer le bip',
            stopSound:    'Couper le bip',
            playChime:    'Activer le carillon',
            stopChime:    'Désactiver le carillon',
            changeTheme:  'Changer de thème',
            timezone:     'Fuseau horaire',
            timezoneTitle: 'Fuseau horaire',
            timezoneAuto:  'Automatique (heure du système)',
            timezoneZoneMode: 'Sélection par zone / ville',
            timezoneOffsetMode: 'Décalage personnalisé (UTC)',
            timezoneCityLabel: 'Ville / zone',
            timezoneOffsetLabel: 'Décalage par rapport à UTC',
            timezoneOffsetHelp: 'Exemple : -5 pour New York, 5.5 pour l’Inde.',
            timezoneOffsetApply: 'Appliquer',
            invalidOffset:'Décalage horaire invalide.',
            language:     'Langue',
            colors:       'Couleurs',
            colorsTitle:  'Couleurs',
            display:      'Affichage',
            displayTitle: 'Options d\'affichage',
            showSecondsDots:    'Points des secondes',
            showMinutesDots:    'Points des minutes',
            showMarkers:        'Repères (toutes les 5 s)',
            showDate:           'Afficher la date',
            showAmpm:           'Afficher le AM/PM',
            showSecondsTime:    'Afficher les secondes dans l\'heure',
            showSecondsRunner:  'Afficher la roue des secondes',

            chimeSchedule:      'Planning du carillon',
            chimePanelTitle:    'Planning du carillon',
            chimePanelDescription: 'Définissez la plage horaire durant laquelle le son de carillon jouera à chaque quart d\'heure.',
            chimeStartLabel:    'Heure de début du carillon',
            chimeEndLabel:      'Heure de fin du carillon',
            chimeNote:          'Note : le carillon ne jouera que si le son des battements est activé.',
            chimeSaveBtn:       'Enregistrer',
            chimeCancelBtn:     'Annuler',

            profiles:                'Profils',
            profilesTitle:           'Profils',
            profileNameLabel:        'Nom du profil',
            profileSaveButton:       'Enregistrer le profil',
            profilesListTitle:       'Profils enregistrés',
            profilesEmpty:           'Aucun profil enregistré.',
            applyProfile:            'Appliquer',
            deleteProfile:           'Supprimer',
            confirmOverwriteProfile: 'Un profil portant ce nom existe déjà. Le remplacer ?',
            confirmDeleteProfile:    'Supprimer ce profil ?',
            sameSettingsWarning:     'Attention : le profil "{name}" possède déjà exactement les mêmes paramètres. Voulez-vous quand même enregistrer ce profil ?',
        },

        es: {
            fullscreen:   'Pantalla completa',
            playSound:    'Activar bip',
            stopSound:    'Desactivar bip',
            playChime:    'Activar sonido de campanadas',
            stopChime:    'Desactivar sonido de campanadas',
            changeTheme:  'Cambiar tema',
            timezone:     'Huso horario',
            timezoneTitle: 'Huso horario',
            timezoneAuto:  'Automático (hora del sistema)',
            timezoneZoneMode: 'Selección por zona / ciudad',
            timezoneOffsetMode: 'Desfase personalizado (UTC)',
            timezoneCityLabel: 'Ciudad / zona',
            timezoneOffsetLabel: 'Desfase respecto a UTC',
            timezoneOffsetHelp: 'Ejemplo: -5 para Nueva York, 5.5 para India.',
            timezoneOffsetApply: 'Aplicar',
            invalidOffset:'Desfase horario no válido.',
            language:     'Idioma',
            colors:       'Colores',
            colorsTitle:  'Colores',
            display:      'Visualización',
            displayTitle: 'Opciones de visualización',
            showSecondsDots:    'Anillo de segundos',
            showMinutesDots:    'Anillo de minutos',
            showMarkers:        'Marcas cada 5 s',
            showDate:           'Mostrar fecha',
            showAmpm:           'Mostrar AM/PM',
            showSecondsTime:    'Mostrar segundos en la hora',
            showSecondsRunner:  'Rueda de segundos',

            chimeSchedule:      'Horario de campanadas',
            chimePanelTitle:    'Horario de campanadas',
            chimePanelDescription: 'Establece el rango de tiempo durante el cual el sonido de las campanadas se reproducirá en los cuartos de hora.',
            chimeStartLabel:    'Hora de inicio de las campanadas',
            chimeEndLabel:      'Hora de fin de las campanadas',
            chimeNote:          'Nota: las campanadas solo sonarán si el sonido del tic-tac está activado.',
            chimeSaveBtn:       'Guardar',
            chimeCancelBtn:     'Cancelar',

            profiles:                'Perfiles',
            profilesTitle:           'Perfiles',
            profileNameLabel:        'Nombre del perfil',
            profileSaveButton:       'Guardar perfil',
            profilesListTitle:       'Perfiles guardados',
            profilesEmpty:           'No hay perfiles guardados.',
            applyProfile:            'Aplicar',
            deleteProfile:           'Eliminar',
            confirmOverwriteProfile: 'Ya existe un perfil con ese nombre. ¿Sobrescribir?',
            confirmDeleteProfile:    '¿Eliminar este perfil?',
            sameSettingsWarning:     'Atención: el perfil "{name}" ya tiene exactamente los mismos parámetros. ¿Desea guardar este perfil igualmente?',
        },

        de: {
            fullscreen:   'Vollbild',
            playSound:    'Tick-Ton einschalten',
            stopSound:    'Tick-Ton ausschalten',
            playChime:    'Klang des Viertels einschalten',
            stopChime:    'Klang des Viertels ausschalten',
            changeTheme:  'Theme wechseln',
            timezone:     'Zeitzone',
            timezoneTitle: 'Zeitzone',
            timezoneAuto:  'Automatisch (Systemzeit)',
            timezoneZoneMode: 'Auswahl nach Gebiet / Stadt',
            timezoneOffsetMode: 'Eigener Versatz (UTC)',
            timezoneCityLabel: 'Stadt / Zone',
            timezoneOffsetLabel: 'Versatz zu UTC',
            timezoneOffsetHelp: 'Beispiel: -5 für New York, 5.5 für Indien.',
            timezoneOffsetApply: 'Übernehmen',
            invalidOffset:'Ungültiger Zeitzonenversatz.',
            language:     'Sprache',
            colors:       'Farben',
            colorsTitle:  'Farben',
            display:      'Anzeige',
            displayTitle: 'Anzeigeoptionen',
            showSecondsDots:    'Sekundenring',
            showMinutesDots:    'Minutenring',
            showMarkers:        'Markierungen alle 5 s',
            showDate:           'Datum anzeigen',
            showAmpm:           'AM/PM anzeigen',
            showSecondsTime:    'Sekunden in der Uhr anzeigen',
            showSecondsRunner:  'Sekundenrad anzeigen',

            chimeSchedule:      'Viertelstundenplan',
            chimePanelTitle:    'Viertelstundenplan',
            chimePanelDescription: 'Legen Sie den Zeitraum fest, in dem der Klang der Viertelstunden abgespielt wird.',
            chimeStartLabel:    'Startzeit der Viertelstunden',
            chimeEndLabel:      'Endzeit der Viertelstunden',
            chimeNote:          'Hinweis: Der Klang der Viertelstunden wird nur abgespielt, wenn der Tick-Ton aktiviert ist.',
            chimeSaveBtn:       'Speichern',
            chimeCancelBtn:     'Abbrechen',

            profiles:                'Profile',
            profilesTitle:           'Profile',
            profileNameLabel:        'Profilname',
            profileSaveButton:       'Profil speichern',
            profilesListTitle:       'Gespeicherte Profile',
            profilesEmpty:           'Keine Profile gespeichert.',
            applyProfile:            'Anwenden',
            deleteProfile:           'Löschen',
            confirmOverwriteProfile: 'Ein Profil mit diesem Namen existiert bereits. Überschreiben?',
            confirmDeleteProfile:    'Dieses Profil löschen?',
            sameSettingsWarning:     'Achtung: Das Profil "{name}" besitzt bereits genau dieselben Einstellungen. Möchten Sie dieses Profil trotzdem speichern?',
        },

        it: {
            fullscreen:   'Schermo intero',
            playSound:    'Attiva bip',
            stopSound:    'Disattiva bip',
            playChime:    'Attiva suono delle ore',
            stopChime:    'Disattiva suono delle ore',
            changeTheme:  'Cambia tema',
            timezone:     'Fuso orario',
            timezoneTitle: 'Fuso orario',
            timezoneAuto:  'Automatico (ora di sistema)',
            timezoneZoneMode: 'Selezione per zona / città',
            timezoneOffsetMode: 'Scarto personalizzato (UTC)',
            timezoneCityLabel: 'Città / zona',
            timezoneOffsetLabel: 'Scarto rispetto a UTC',
            timezoneOffsetHelp: 'Esempio: -5 per New York, 5.5 per India.',
            timezoneOffsetApply: 'Applica',
            invalidOffset:'Scarto orario non valido.',
            language:     'Lingua',
            colors:       'Colori',
            colorsTitle:  'Colori',
            display:      'Visualizzazione',
            displayTitle: 'Opzioni di visualizzazione',
            showSecondsDots:    'Anello dei secondi',
            showMinutesDots:    'Anello dei minuti',
            showMarkers:        'Marker ogni 5 s',
            showDate:           'Mostra data',
            showAmpm:           'Mostra AM/PM',
            showSecondsTime:    'Mostra i secondi nell\'ora',
            showSecondsRunner:  'Mostra la ruota dei secondi',

            chimeSchedule:      'Orario delle ore',
            chimePanelTitle:    'Orario delle ore',
            chimePanelDescription: 'Imposta l\'intervallo di tempo durante il quale il suono delle ore verrà riprodotto ai quarti d\'ora.',
            chimeStartLabel:    'Ora di inizio del suono delle ore',
            chimeEndLabel:      'Ora di fine del suono delle ore',
            chimeNote:          'Nota: il suono delle ore verrà riprodotto solo se il suono del ticchettio è attivato.',
            chimeSaveBtn:       'Salva',
            chimeCancelBtn:     'Annulla',

            profiles:                'Profili',
            profilesTitle:           'Profili',
            profileNameLabel:        'Nome profilo',
            profileSaveButton:       'Salva profilo',
            profilesListTitle:       'Profili salvati',
            profilesEmpty:           'Nessun profilo salvato.',
            applyProfile:            'Applica',
            deleteProfile:           'Elimina',
            confirmOverwriteProfile: 'Esiste già un profilo con questo nome. Sovrascrivere?',
            confirmDeleteProfile:    'Eliminare questo profilo?',
            sameSettingsWarning:     'Attenzione: il profilo "{name}" ha già esattamente gli stessi parametri. Vuoi comunque salvare questo profilo?',
        },
    };

    // ─────────────────────────────────────────────────────────────
    // Paramètres de format par langue
    // ─────────────────────────────────────────────────────────────
    const localeSettings = {
        fr: { timeFormat: '24', dateFormat: 'DD/MM/YYYY' },
        es: { timeFormat: '24', dateFormat: 'DD/MM/YYYY' },
        de: { timeFormat: '24', dateFormat: 'DD.MM.YYYY' },
        it: { timeFormat: '24', dateFormat: 'DD/MM/YYYY' },
        en: { timeFormat: '12', dateFormat: 'DD/MM/YYYY' },
    };

    // ─────────────────────────────────────────────────────────────
    // Persistance des réglages
    // ─────────────────────────────────────────────────────────────
    function saveSettings() {
        try {
            const settings = {
                currentTheme,
                isAudioEnabled,
                isChimeEnabled,
                timezoneMode,
                timezoneId,
                timezoneOffset,
                currentLanguage,
                colorTheme,
                currentColorPreset,
                displayOptions,
                chimeStartMinutes,
                chimeEndMinutes,
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return;
            const s = JSON.parse(raw);

            if (s.currentTheme === 'light' || s.currentTheme === 'dark') {
                currentTheme = s.currentTheme;
            }
            if (typeof s.isAudioEnabled === 'boolean') {
                isAudioEnabled = s.isAudioEnabled;
            }
            if (typeof s.isChimeEnabled === 'boolean') {
                isChimeEnabled = s.isChimeEnabled;
            } else { isChimeEnabled = false; }

            if (typeof s.chimeStartMinutes === 'number') {
                chimeStartMinutes = s.chimeStartMinutes;
            }
            if (typeof s.chimeEndMinutes === 'number') {
                chimeEndMinutes = s.chimeEndMinutes;
            }

            if (s.timezoneMode === 'auto' || s.timezoneMode === 'zone' || s.timezoneMode === 'offset') {
                timezoneMode = s.timezoneMode;
            }
            if (typeof s.timezoneId === 'string') {
                timezoneId = s.timezoneId;
            }
            if (typeof s.timezoneOffset === 'number') {
                timezoneOffset = s.timezoneOffset;
            }

            const allowedLangs = ['fr', 'en', 'es', 'de', 'it'];
            if (allowedLangs.includes(s.currentLanguage)) {
                currentLanguage = s.currentLanguage;
            }
            if (s.colorTheme && typeof s.colorTheme === 'object') {
                colorTheme = {
                    ...DEFAULT_COLOR_THEME,
                    ...s.colorTheme,
                };
            }
            if (typeof s.currentColorPreset === 'string') {
                currentColorPreset = s.currentColorPreset;
            } else {
                currentColorPreset = 'custom';
            }

            if (s.displayOptions && typeof s.displayOptions === 'object') {
                displayOptions = {
                    ...displayOptions,
                    ...s.displayOptions,
                };
            }

            // Migration douce : si l’ancienne sauvegarde ne connaît pas encore showSecondsRunner,
            // on active la roue par défaut.
            if (!s.displayOptions || typeof s.displayOptions.showSecondsRunner === 'undefined') {
                displayOptions.showSecondsRunner = true;
            }

        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Persistance des profils
    // ─────────────────────────────────────────────────────────────
    function saveProfiles() {
        try {
            localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        } catch (e) {
            console.error('Error saving profiles:', e);
        }
    }

    function loadProfiles() {
        try {
            const raw = localStorage.getItem(PROFILES_KEY);
            if (!raw) return;
            const p = JSON.parse(raw);
            if (p && typeof p === 'object') {
                profiles = p;
            }
        } catch (e) {
            console.error('Error loading profiles:', e);
        }
    }

    function getCurrentSettingsSnapshot() {
        return {
            currentTheme,
            isAudioEnabled,
            isChimeEnabled,
            timezoneMode,
            timezoneId,
            timezoneOffset,
            currentLanguage,
            colorTheme:      { ...colorTheme },
            currentColorPreset,
            displayOptions:  { ...displayOptions },
            chimeStartMinutes,
            chimeEndMinutes,
        };
    }

    function normalizeSettingsForCompare(s) {
        if (!s || typeof s !== 'object') return null;

        const cTheme = s.colorTheme || {};
        const dOpts  = s.displayOptions || {};

        return {
            currentTheme: (s.currentTheme === 'light') ? 'light' : 'dark',
            isAudioEnabled: !!s.isAudioEnabled,
            isChimeEnabled: !!s.isChimeEnabled,
            chimeStartMinutes: (typeof s.chimeStartMinutes === 'number') ? s.chimeStartMinutes : 8 * 60,
            chimeEndMinutes: (typeof s.chimeEndMinutes === 'number') ? s.chimeEndMinutes : 22 * 60,
            timezoneMode: (s.timezoneMode === 'auto' || s.timezoneMode === 'zone' || s.timezoneMode === 'offset')
                ? s.timezoneMode : 'auto',
            timezoneId: (typeof s.timezoneId === 'string') ? s.timezoneId : null,
            timezoneOffset: (typeof s.timezoneOffset === 'number') ? s.timezoneOffset : 0,
            currentLanguage: s.currentLanguage || 'fr',
            currentColorPreset: (typeof s.currentColorPreset === 'string') ? s.currentColorPreset : 'custom',
            colorTheme: {
                secondsOn: cTheme.secondsOn || DEFAULT_COLOR_THEME.secondsOn,
                minutesOn: cTheme.minutesOn || DEFAULT_COLOR_THEME.minutesOn,
                markers:   cTheme.markers   || DEFAULT_COLOR_THEME.markers,
            },
            displayOptions: {
                showSecondsDots:   (typeof dOpts.showSecondsDots   === 'boolean') ? dOpts.showSecondsDots   : true,
                showMinuteDots:    (typeof dOpts.showMinuteDots    === 'boolean') ? dOpts.showMinuteDots    : true,
                showMarkers:       (typeof dOpts.showMarkers       === 'boolean') ? dOpts.showMarkers       : true,
                showDate:          (typeof dOpts.showDate          === 'boolean') ? dOpts.showDate          : true,
                showAmpm:          (typeof dOpts.showAmpm          === 'boolean') ? dOpts.showAmpm          : true,
                showSecondsTime:   (typeof dOpts.showSecondsTime   === 'boolean') ? dOpts.showSecondsTime   : true,
                showSecondsRunner: (typeof dOpts.showSecondsRunner === 'boolean') ? dOpts.showSecondsRunner : true,
            },
        };
    }

    function areSettingsEqual(a, b) {
        const na = normalizeSettingsForCompare(a);
        const nb = normalizeSettingsForCompare(b);
        if (!na || !nb) return false;

        try {
            return JSON.stringify(na) === JSON.stringify(nb);
        } catch (e) {
            console.error('Error comparing profiles:', e);
            return false;
        }
    }

    function applyProfileSettings(profile) {
        if (!profile) return;

        currentTheme   = (profile.currentTheme === 'light') ? 'light' : 'dark';
        isAudioEnabled = !!profile.isAudioEnabled;
        isChimeEnabled = (typeof profile.isChimeEnabled === 'boolean') ? profile.isChimeEnabled : false;

        if (profile.timezoneMode === 'auto' || profile.timezoneMode === 'zone' || profile.timezoneMode === 'offset') {
            timezoneMode = profile.timezoneMode;
        }
        if (typeof profile.timezoneId === 'string') {
            timezoneId = profile.timezoneId;
        }
        if (typeof profile.timezoneOffset === 'number') {
            timezoneOffset = profile.timezoneOffset;
        }

        if (profile.currentLanguage && translations[profile.currentLanguage]) {
            currentLanguage = profile.currentLanguage;
        }

        if (profile.colorTheme && typeof profile.colorTheme === 'object') {
            colorTheme = {
                ...DEFAULT_COLOR_THEME,
                ...profile.colorTheme,
            };
        }

        if (typeof profile.currentColorPreset === 'string') {
            currentColorPreset = profile.currentColorPreset;
        } else {
            currentColorPreset = 'custom';
        }

        if (profile.displayOptions && typeof profile.displayOptions === 'object') {
            displayOptions = {
                ...displayOptions,
                ...profile.displayOptions,
            };
        }

        if (typeof profile.chimeStartMinutes === 'number') {
            chimeStartMinutes = profile.chimeStartMinutes;
        }

        if (typeof profile.chimeEndMinutes === 'number') {
            chimeEndMinutes = profile.chimeEndMinutes;
        }

        applyTheme();
        applyColorTheme(colorTheme);
        applyDisplayOptions();
        syncDisplayPanelFromState();
        updateColorInputsFromTheme();
        updateColorPresetSelection();
        updateLanguagePanelSelection();
        syncTimezoneUIFromState();
        refreshMenuTexts();

        // On resynchronise l'horloge pour mettre à jour les anneaux + lastSecondIndex
        updateClock();
        saveSettings();
    }

    // ─────────────────────────────────────────────────────────────
    // Utilitaires couleurs
    // ─────────────────────────────────────────────────────────────
    function hexToRgba(hex, alpha) {
        if (!hex) return '';
        let c = hex.trim();
        if (c[0] === '#') c = c.slice(1);
        if (c.length === 3) {
            c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        }
        if (c.length !== 6) return hex;
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);
        const a = typeof alpha === 'number' ? alpha : 1;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function applyColorTheme(theme) {
        const merged = {
            ...DEFAULT_COLOR_THEME,
            ...theme,
        };
        colorTheme = merged;

        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--color-seconds-on',  merged.secondsOn);
        rootStyle.setProperty('--color-minutes-on',  merged.minutesOn);
        rootStyle.setProperty('--color-markers',     merged.markers);

        // L'heure reprend la couleur des secondes
        rootStyle.setProperty('--color-time',       merged.secondsOn);
        rootStyle.setProperty('--color-time-glow',  merged.secondsOn);

        // Couleurs "off" dérivées
        rootStyle.setProperty('--color-seconds-off',  hexToRgba(merged.secondsOn, 0.33));
        rootStyle.setProperty('--color-minutes-off', hexToRgba(merged.minutesOn, 0.45));
    }

    function updateColorInputsFromTheme() {
        if (colorSecondsInput) colorSecondsInput.value = colorTheme.secondsOn;
        if (colorMinutesInput) colorMinutesInput.value = colorTheme.minutesOn;
        if (colorMarkersInput) colorMarkersInput.value = colorTheme.markers;
    }

    function updateColorPresetSelection() {
        colorPresetButtons.forEach(btn => {
            const key = btn.dataset.theme;
            btn.classList.toggle('active', key === currentColorPreset);
        });
    }

    function setColorPreset(key) {
        const preset = COLOR_PRESETS[key];
        if (!preset) return;
        currentColorPreset = key;
        applyColorTheme(preset);
        updateColorPresetSelection();
        updateColorInputsFromTheme();
        saveSettings();
    }

    // ─────────────────────────────────────────────────────────────
    // Affichage : thème / classes / textes
    // ─────────────────────────────────────────────────────────────
    function applyTheme() {
        document.body.classList.toggle('light', currentTheme === 'light');
        document.body.classList.toggle('dark',  currentTheme === 'dark');
    }

    function applyDisplayOptions() {
        document.body.classList.toggle('hide-seconds-dots', !displayOptions.showSecondsDots);
        document.body.classList.toggle('hide-minute-dots',  !displayOptions.showMinuteDots);
        document.body.classList.toggle('hide-markers',      !displayOptions.showMarkers);
        document.body.classList.toggle('hide-date',         !displayOptions.showDate);
        document.body.classList.toggle('hide-ampm',         !displayOptions.showAmpm);
        document.body.classList.toggle('hide-seconds-time', !displayOptions.showSecondsTime);
    }

    function syncDisplayPanelFromState() {
        if (optShowSeconds)         optShowSeconds.checked       = displayOptions.showSecondsDots;
        if (optShowMinutes)         optShowMinutes.checked       = displayOptions.showMinuteDots;
        if (optShowMarkers)         optShowMarkers.checked       = displayOptions.showMarkers;
        if (optShowDate)            optShowDate.checked          = displayOptions.showDate;
        if (optShowAmpm)            optShowAmpm.checked          = displayOptions.showAmpm;
        if (optShowSecondsTime)     optShowSecondsTime.checked   = displayOptions.showSecondsTime;
        if (optShowSecondsRunner)   optShowSecondsRunner.checked = displayOptions.showSecondsRunner;
    }

    function updateFullscreenLabel() {
        if (!fullscreenToggle) return;
        const inFullscreen = !!document.fullscreenElement;
        const iconClass = inFullscreen ? 'bi-arrows-angle-contract' : 'bi-arrows-fullscreen';
        fullscreenToggle.innerHTML = `<i class="bi ${iconClass}"></i> ${translations[currentLanguage].fullscreen}`;
    }

    function refreshLanguagePanelTexts() {
        if (languagePanelTitle) {
            languagePanelTitle.textContent = translations[currentLanguage].language;
        }
    }

    function refreshColorsPanelTexts() {
        if (colorsPanelTitle) {
            colorsPanelTitle.textContent =
                translations[currentLanguage].colorsTitle || translations[currentLanguage].colors;
        }
    }

    function refreshDisplayPanelTexts() {
        if (displayPanelTitle) {
            displayPanelTitle.textContent =
                translations[currentLanguage].displayTitle || translations[currentLanguage].display;
        }

        const labelKeyMap = {
            seconds:        'showSecondsDots',
            minutes:        'showMinutesDots',
            markers:        'showMarkers',
            date:           'showDate',
            ampm:           'showAmpm',
            secondsTime:    'showSecondsTime',
            secondsRunner:  'showSecondsRunner',
        };

        document.querySelectorAll('.display-option .label').forEach(span => {
            const key = span.dataset.displayLabel;
            const tKey = labelKeyMap[key];
            if (tKey && translations[currentLanguage][tKey]) {
                span.textContent = translations[currentLanguage][tKey];
            }
        });
    }

    function refreshChimePanelTexts() {
        const t = translations[currentLanguage];
        if (!t) return;

        if (chimePanelTitle) {
            chimePanelTitle.textContent =
                t.chimePanelTitle || t.chimeSchedule || 'Plage horaire du carillon';
        }
        if (chimePanelDesc) {
            chimePanelDesc.textContent =
                t.chimePanelDescription || '';
        }
        if (chimeStartLabel) {
            chimeStartLabel.textContent =
                t.chimeStartLabel || 'Début';
        }
        if (chimeEndLabel) {
            chimeEndLabel.textContent =
                t.chimeEndLabel || 'Fin';
        }
        if (chimeNote) {
            chimeNote.textContent =
                t.chimeNote || '';
        }
        if (chimeSaveBtn) {
            chimeSaveBtn.textContent =
                t.chimeSaveButton || 'Enregistrer';
        }
        if (chimeCancelBtn) {
            chimeCancelBtn.textContent =
                t.chimeCancelButton || 'Annuler';
        }
    }

    function refreshProfilesPanelTexts() {
        if (profilesPanelTitle) {
            profilesPanelTitle.textContent =
                translations[currentLanguage].profilesTitle || translations[currentLanguage].profiles;
        }

        const nameLabel = document.querySelector('.profiles-name-label');
        if (nameLabel) {
            nameLabel.textContent =
                translations[currentLanguage].profileNameLabel || 'Nom du profil';
        }

        const listTitle = document.querySelector('.profiles-list-title');
        if (listTitle) {
            listTitle.textContent =
                translations[currentLanguage].profilesListTitle || 'Profils enregistrés';
        }

        if (profileSaveBtn) {
            profileSaveBtn.textContent =
                translations[currentLanguage].profileSaveButton || 'Enregistrer le profil';
        }

        // Met à jour les boutons « Appliquer / Supprimer » existants
        renderProfilesList();
    }

    function refreshTimezonePanelTexts() {
        const t = translations[currentLanguage];
        if (!t) return;

        if (timezonePanelTitle) {
            timezonePanelTitle.textContent =
                t.timezoneTitle || t.timezone || 'Fuseau horaire';
        }
        if (timezoneModeAutoLabel) {
            timezoneModeAutoLabel.textContent =
                t.timezoneAuto || 'Automatique (heure du système)';
        }
        if (timezoneModeZoneLabel) {
            timezoneModeZoneLabel.textContent =
                t.timezoneZoneMode || 'Sélection par zone / ville';
        }
        if (timezoneModeOffsetLabel) {
            timezoneModeOffsetLabel.textContent =
                t.timezoneOffsetMode || 'Décalage personnalisé (UTC)';
        }
        if (timezoneSelectLabel) {
            timezoneSelectLabel.textContent =
                t.timezoneCityLabel || 'Ville / zone';
        }
        if (timezoneOffsetLabel) {
            timezoneOffsetLabel.textContent =
                t.timezoneOffsetLabel || 'Décalage par rapport à UTC';
        }
        if (timezoneOffsetHelp) {
            timezoneOffsetHelp.textContent =
                t.timezoneOffsetHelp ||
                'Exemple : -5 pour New York, 5.5 pour l’Inde.';
        }
        if (timezoneOffsetApply) {
            timezoneOffsetApply.textContent =
                t.timezoneOffsetApply || 'Appliquer';
        }
    }

    function updateLanguagePanelSelection() {
        languageOptions.forEach(btn => {
            const lang = btn.dataset.lang;
            btn.classList.toggle('active', lang === currentLanguage);
        });
    }

    function refreshMenuTexts() {
        if (fullscreenToggle) updateFullscreenLabel();

        if (audioToggle) {
            audioToggle.innerHTML = isAudioEnabled
                ? `<i class="bi bi-volume-mute"></i> ${translations[currentLanguage].stopSound}`
                : `<i class="bi bi-music-note"></i> ${translations[currentLanguage].playSound}`;
        }

        if (chimeToggle) {
            chimeToggle.innerHTML = isChimeEnabled
                ? `<i class="bi bi-bell-slash"></i> ${translations[currentLanguage].stopChime}`
                : `<i class="bi bi-bell"></i> ${translations[currentLanguage].playChime}`;
        }

        if (chimePlanningToggle) {
            chimePlanningToggle.innerHTML = `<i class="bi bi-clock-history"></i> ${translations[currentLanguage].chimeSchedule}`;
        }

        if (themeToggle) {
            themeToggle.innerHTML = `<i class="bi bi-moon-stars"></i> ${translations[currentLanguage].changeTheme}`;
        }

        if (colorsToggle) {
            colorsToggle.innerHTML = `<i class="bi bi-sliders"></i> ${translations[currentLanguage].colors}`;
        }

        if (displayToggle) {
            displayToggle.innerHTML = `<i class="bi bi-eye"></i> ${translations[currentLanguage].display}`;
        }

        if (profilesToggle) {
            profilesToggle.innerHTML = `<i class="bi bi-person-badge"></i> ${translations[currentLanguage].profiles}`;
        }

        if (timezoneToggle) {
            timezoneToggle.innerHTML = `<i class="bi bi-globe"></i> ${translations[currentLanguage].timezone}`;
        }

        if (languageToggle) {
            languageToggle.innerHTML = `<i class="bi bi-translate"></i> ${translations[currentLanguage].language}`;
        }

        refreshLanguagePanelTexts();
        refreshColorsPanelTexts();
        refreshDisplayPanelTexts();
        refreshProfilesPanelTexts();
        refreshTimezonePanelTexts();
        refreshChimePanelTexts();
    }

    function isChimeAllowedAtTime(hours, minutes) {
        const current = hours * 60 + minutes;
        const start = chimeStartMinutes;
        const end   = chimeEndMinutes;

        if (start === end) return false; // Toujours désactivé

        if (start < end) {
            return current >= start && current < end;
        }

        return current >= start || current < end;
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLanguage = lang;
        refreshMenuTexts();
        updateLanguagePanelSelection();
        saveSettings();
    }

    // ─────────────────────────────────────────────────────────────
    // Panneau de sélection de langue
    // ─────────────────────────────────────────────────────────────
    function openLanguagePanel() {
        if (languagePanel) languagePanel.classList.add('visible');
        if (languageOverlay) languageOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    function closeLanguagePanel() {
        if (languagePanel) languagePanel.classList.remove('visible');
        if (languageOverlay) languageOverlay.classList.remove('visible');
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            if (!languagePanel) return;
            const isVisible = languagePanel.classList.contains('visible');
            if (isVisible) closeLanguagePanel();
            else openLanguagePanel();
        });
    }

    if (languageOverlay) {
        languageOverlay.addEventListener('click', () => {
            closeLanguagePanel();
        });
    }

    languageOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            closeLanguagePanel();
        });
    });

    // ─────────────────────────────────────────────────────────────
    // Panneau de couleurs
    // ─────────────────────────────────────────────────────────────
    function openColorsPanel() {
        if (colorsPanel) colorsPanel.classList.add('visible');
        if (colorsOverlay) colorsOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    function closeColorsPanel() {
        if (colorsPanel) colorsPanel.classList.remove('visible');
        if (colorsOverlay) colorsOverlay.classList.remove('visible');
    }

    if (colorsToggle) {
        colorsToggle.addEventListener('click', () => {
            if (!colorsPanel) return;
            const isVisible = colorsPanel.classList.contains('visible');
            if (isVisible) closeColorsPanel();
            else openColorsPanel();
        });
    }

    if (colorsOverlay) {
        colorsOverlay.addEventListener('click', () => {
            closeColorsPanel();
        });
    }

    colorPresetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.theme;
            setColorPreset(key);
        });
    });

    if (colorsApplyCustom) {
        colorsApplyCustom.addEventListener('click', () => {
            const seconds = colorSecondsInput?.value || colorTheme.secondsOn;
            const minutes = colorMinutesInput?.value || colorTheme.minutesOn;
            const markers = colorMarkersInput?.value || colorTheme.markers;

            colorTheme = {
                secondsOn: seconds,
                minutesOn: minutes,
                markers:   markers,
            };
            currentColorPreset = 'custom';
            applyColorTheme(colorTheme);
            updateColorPresetSelection();
            saveSettings();
        });
    }

    if (colorsReset) {
        colorsReset.addEventListener('click', () => {
            setColorPreset('classic');
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Panneau fuseau horaire
    // ─────────────────────────────────────────────────────────────
    function openTimezonePanel() {
        if (timezonePanel) timezonePanel.classList.add('visible');
        if (timezoneOverlay) timezoneOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    function closeTimezonePanel() {
        if (timezonePanel) timezonePanel.classList.remove('visible');
        if (timezoneOverlay) timezoneOverlay.classList.remove('visible');
    }

    if (timezoneToggle) {
        timezoneToggle.addEventListener('click', () => {
            if (!timezonePanel) return;
            const isVisible = timezonePanel.classList.contains('visible');
            if (isVisible) closeTimezonePanel();
            else openTimezonePanel();
        });
    }

    if (timezoneOverlay) {
        timezoneOverlay.addEventListener('click', () => {
            closeTimezonePanel();
        });
    }

    function syncTimezoneUIFromState() {
        // Radios
        timezoneModeRadios.forEach(radio => {
            radio.checked = (radio.value === timezoneMode);
        });

        // Affichage sections
        if (timezoneZoneSection) {
            timezoneZoneSection.style.display = (timezoneMode === 'zone') ? 'block' : 'none';
        }
        if (timezoneOffsetSection) {
            timezoneOffsetSection.style.display = (timezoneMode === 'offset') ? 'block' : 'none';
        }

        // Select
        if (timezoneSelect) {
            if (timezoneId) {
                timezoneSelect.value = timezoneId;
            } else {
                const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (sysTz && Array.from(timezoneSelect.options).some(opt => opt.value === sysTz)) {
                    timezoneSelect.value = sysTz;
                }
            }
        }

        // Offset
        if (timezoneOffsetInput) {
            timezoneOffsetInput.value = timezoneOffset;
        }

        // Carte
        if (timezoneMap) {
            timezoneMap.querySelectorAll('rect[data-tz]').forEach(rect => {
                rect.classList.toggle('selected', rect.dataset.tz === timezoneId);
            });
        }
    }

    timezoneModeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            timezoneMode = radio.value;
            saveSettings();
            syncTimezoneUIFromState();
            updateClock();
        });
    });

    if (timezoneMap) {
        timezoneMap.addEventListener('click', (e) => {
            const rect = e.target.closest('rect[data-tz]');
            if (!rect) return;

            timezoneMode = 'zone';
            timezoneId   = rect.dataset.tz;

            if (timezoneSelect) {
                timezoneSelect.value = timezoneId;
            }

            syncTimezoneUIFromState();
            saveSettings();
            updateClock();
        });
    }

    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', () => {
            timezoneMode = 'zone';
            timezoneId   = timezoneSelect.value;
            syncTimezoneUIFromState();
            saveSettings();
            updateClock();
        });
    }

    if (timezoneOffsetApply && timezoneOffsetInput) {
        timezoneOffsetApply.addEventListener('click', () => {
            const value = timezoneOffsetInput.value.trim();
            if (!value) return;

            const normalized = value.replace(',', '.');
            const val = parseFloat(normalized);

            if (Number.isNaN(val) || val < -12 || val > 14) {
                alert(translations[currentLanguage].invalidOffset);
                return;
            }

            timezoneMode   = 'offset';
            timezoneOffset = val;
            saveSettings();
            syncTimezoneUIFromState();
            updateClock();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Panneau d'affichage
    // ─────────────────────────────────────────────────────────────
    function openDisplayPanel() {
        if (displayPanel) displayPanel.classList.add('visible');
        if (displayOverlay) displayOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    function closeDisplayPanel() {
        if (displayPanel) displayPanel.classList.remove('visible');
        if (displayOverlay) displayOverlay.classList.remove('visible');
    }

    if (displayToggle) {
        displayToggle.addEventListener('click', () => {
            if (!displayPanel) return;
            const isVisible = displayPanel.classList.contains('visible');
            if (isVisible) closeDisplayPanel();
            else openDisplayPanel();
        });
    }

    if (displayOverlay) {
        displayOverlay.addEventListener('click', () => {
            closeDisplayPanel();
        });
    }

    // Liaison checkboxes ↔ displayOptions
    if (optShowSeconds) {
        optShowSeconds.addEventListener('change', () => {
            displayOptions.showSecondsDots = optShowSeconds.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowMinutes) {
        optShowMinutes.addEventListener('change', () => {
            displayOptions.showMinuteDots = optShowMinutes.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowMarkers) {
        optShowMarkers.addEventListener('change', () => {
            displayOptions.showMarkers = optShowMarkers.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowDate) {
        optShowDate.addEventListener('change', () => {
            displayOptions.showDate = optShowDate.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowAmpm) {
        optShowAmpm.addEventListener('change', () => {
            displayOptions.showAmpm = optShowAmpm.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowSecondsTime) {
        optShowSecondsTime.addEventListener('change', () => {
            displayOptions.showSecondsTime = optShowSecondsTime.checked;
            applyDisplayOptions();
            saveSettings();
        });
    }

    if (optShowSecondsRunner) {
        optShowSecondsRunner.addEventListener('change', () => {
            displayOptions.showSecondsRunner = optShowSecondsRunner.checked;
            saveSettings();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Panneau de profils
    // ─────────────────────────────────────────────────────────────
    function openProfilesPanel() {
        if (profilesPanel) profilesPanel.classList.add('visible');
        if (profilesOverlay) profilesOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
        if (profileNameInput) profileNameInput.focus();
        renderProfilesList();
    }

    function closeProfilesPanel() {
        if (profilesPanel) profilesPanel.classList.remove('visible');
        if (profilesOverlay) profilesOverlay.classList.remove('visible');
    }

    function renderProfilesList() {
        if (!profilesListContainer) return;

        profilesListContainer.innerHTML = '';

        const names = Object.keys(profiles).sort((a, b) => a.localeCompare(b));

        if (names.length === 0) {
            const p = document.createElement('p');
            p.className = 'profiles-empty';
            p.textContent = translations[currentLanguage].profilesEmpty || 'Aucun profil enregistré.';
            profilesListContainer.appendChild(p);
            return;
        }

        names.forEach(name => {
            const row = document.createElement('div');
            row.className = 'profile-item';
            row.innerHTML = `
                <span class="profile-name">${name}</span>
                <div class="profile-actions">
                    <button type="button" class="profile-apply" data-profile="${name}">
                        ${translations[currentLanguage].applyProfile || 'Appliquer'}
                    </button>
                    <button type="button" class="profile-delete" data-profile="${name}">
                        ${translations[currentLanguage].deleteProfile || 'Supprimer'}
                    </button>
                </div>
            `;
            profilesListContainer.appendChild(row);
        });

        profilesListContainer.querySelectorAll('.profile-apply').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.profile;
                const profile = profiles[name];
                applyProfileSettings(profile);
            });
        });

        profilesListContainer.querySelectorAll('.profile-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.profile;
                const msg = translations[currentLanguage].confirmDeleteProfile || 'Supprimer ce profil ?';
                if (!confirm(msg)) return;
                delete profiles[name];
                saveProfiles();
                renderProfilesList();
            });
        });
    }

    if (profilesToggle) {
        profilesToggle.addEventListener('click', () => {
            if (!profilesPanel) return;
            const isVisible = profilesPanel.classList.contains('visible');
            if (isVisible) closeProfilesPanel();
            else openProfilesPanel();
        });
    }

    if (profilesOverlay) {
        profilesOverlay.addEventListener('click', () => {
            closeProfilesPanel();
        });
    }

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener('click', () => {
            if (!profileNameInput) return;

            const name = profileNameInput.value.trim();
            if (!name) {
                return; // on ne sauvegarde pas un nom vide
            }

            // Si un profil porte déjà ce nom → confirmation d'écrasement
            const exists = !!profiles[name];
            if (exists) {
                const msg = translations[currentLanguage].confirmOverwriteProfile ||
                    'Un profil portant ce nom existe déjà. Le remplacer ?';
                if (!confirm(msg)) return;
            }

            // Snapshot des réglages actuels
            const snapshot = getCurrentSettingsSnapshot();

            // Recherche d'un autre profil (nom différent) avec les mêmes paramètres
            let duplicateName = null;
            for (const existingName in profiles) {
                if (!Object.prototype.hasOwnProperty.call(profiles, existingName)) continue;
                if (existingName === name) continue; // on ignore celui qu'on remplace éventuellement
                const existingProfile = profiles[existingName];
                if (areSettingsEqual(existingProfile, snapshot)) {
                    duplicateName = existingName;
                    break;
                }
            }

            // Confirmation si un profil identique existe déjà
            if (duplicateName) {
                const tpl = translations[currentLanguage].sameSettingsWarning
                    || 'Attention : le profil "{name}" possède déjà exactement les mêmes paramètres. Voulez-vous quand même enregistrer ce profil ?';
                const msg = tpl.replace('{name}', duplicateName);
                if (!confirm(msg)) {
                    return; // on annule la sauvegarde du nouveau profil
                }
            }

            // Sauvegarde / écrasement du profil
            profiles[name] = snapshot;
            saveProfiles();
            renderProfilesList();

            // Réinitialisation du champ après enregistrement
            profileNameInput.value = '';
            profileNameInput.blur();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Panneau de planning du carillon
    // ─────────────────────────────────────────────────────────────
    function formatMinutesToTimeString(totalMinutes) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function parseTimeToMinutes(str) {
        if (!str) return 0;
        const [hStr, mStr] = str.split(':');
        const h = Math.min(23, Math.max(0, parseInt(hStr, 10) || 0));
        const m = Math.min(59, Math.max(0, parseInt(mStr, 10) || 0));
        return h * 60 + m;
    }

    function openChimePanel() {
        if (!chimePanel) return;

        // Remplissage des champs avec la plage actuelle
        if (chimeStartInput) {
            chimeStartInput.value = formatMinutesToTimeString(chimeStartMinutes);
        }
        if (chimeEndInput) {
            chimeEndInput.value = formatMinutesToTimeString(chimeEndMinutes);
        }

        chimePanel.classList.add('visible');
        if (chimeOverlay) chimeOverlay.classList.add('visible');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    function closeChimePanel() {
        if (chimePanel) chimePanel.classList.remove('visible');
        if (chimeOverlay) chimeOverlay.classList.remove('visible');
    }

    if (chimePlanningToggle) {
        chimePlanningToggle.addEventListener('click', () => {
            openChimePanel();
        });
    }

    if (chimeOverlay) {
        chimeOverlay.addEventListener('click', () => {
            closeChimePanel();
        });
    }

    if (chimeCancelBtn) {
        chimeCancelBtn.addEventListener('click', () => {
            closeChimePanel();
        });
    }

    if (chimeSaveBtn) {
        chimeSaveBtn.addEventListener('click', () => {
            if (chimeStartInput) {
                chimeStartMinutes = parseTimeToMinutes(chimeStartInput.value || '08:00');
            }
            if (chimeEndInput) {
                chimeEndMinutes = parseTimeToMinutes(chimeEndInput.value || '22:00');
            }
            saveSettings();
            closeChimePanel();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Clavier global
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLanguagePanel();
            closeColorsPanel();
            closeDisplayPanel();
            closeProfilesPanel();
            closeTimezonePanel();
            closeChimePanel();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // Menu déroulant
    // ─────────────────────────────────────────────────────────────
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!menuButton.contains(event.target) &&
                !dropdownMenu.contains(event.target) &&
                (!languagePanel || !languagePanel.contains(event.target)) &&
                (!colorsPanel   || !colorsPanel.contains(event.target)) &&
                (!displayPanel  || !displayPanel.contains(event.target)) &&
                (!profilesPanel || !profilesPanel.contains(event.target)) &&
                (!timezonePanel || !timezonePanel.contains(event.target))) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Plein écran
    // ─────────────────────────────────────────────────────────────
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Error entering fullscreen:', err);
                });
            } else {
                document.exitFullscreen().catch(err => {
                    console.error('Error exiting fullscreen:', err);
                });
            }
        });

        document.addEventListener('fullscreenchange', updateFullscreenLabel);
    }

    // ─────────────────────────────────────────────────────────────
    // Gestion du son
    // ─────────────────────────────────────────────────────────────
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            refreshMenuTexts();
            saveSettings();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Gestion du carillon 
    // ─────────────────────────────────────────────────────────────
    if (chimeToggle) {
        chimeToggle.addEventListener('click', () => {
            isChimeEnabled = !isChimeEnabled;
            refreshMenuTexts();
            saveSettings();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Changer de thème (clair/sombre)
    // ─────────────────────────────────────────────────────────────
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme();
            saveSettings();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // Création des points (dots)
    // ─────────────────────────────────────────────────────────────
    function createDots() {
        if (!clock) return;

        const radiusRed     = 230; // secondes (intérieur)
        const radiusMinute  = 260; // minutes (milieu)
        const radiusGreen   = 290; // repères 5 s (extérieur)
        const centerX       = 300;
        const centerY       = 300;

        redDots = [];
        minuteDots = [];

        for (let i = 0; i < 60; i++) {
            const angle = ((i - 15) * 6) * (Math.PI / 180);

            // secondes
            const xRed = centerX + radiusRed * Math.cos(angle);
            const yRed = centerY + radiusRed * Math.sin(angle);

            const redDot = document.createElement('div');
            redDot.className = 'dot red';
            redDot.style.left = `${xRed}px`;
            redDot.style.top  = `${yRed}px`;
            clock.appendChild(redDot);
            redDots.push(redDot);

            // minutes
            const xMinute = centerX + radiusMinute * Math.cos(angle);
            const yMinute = centerY + radiusMinute * Math.sin(angle);

            const minuteDot = document.createElement('div');
            minuteDot.className = 'dot minute';
            minuteDot.style.left = `${xMinute}px`;
            minuteDot.style.top  = `${yMinute}px`;
            clock.appendChild(minuteDot);
            minuteDots.push(minuteDot);

            // repères 5s
            if (i % 5 === 0) {
                const xGreen = centerX + radiusGreen * Math.cos(angle);
                const yGreen = centerY + radiusGreen * Math.sin(angle);

                const greenDot = document.createElement('div');
                greenDot.className = 'dot green';
                greenDot.style.left = `${xGreen}px`;
                greenDot.style.top  = `${yGreen}px`;
                clock.appendChild(greenDot);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Gestion de l'heure avec zones IANA
    // ─────────────────────────────────────────────────────────────
    function getZonedTimeParts() {
        const now = new Date();

        // Mode automatique : heure de la machine
        if (timezoneMode === 'auto') {
            return {
                hours:  now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds(),
                day:    now.getDate(),
                month:  now.getMonth() + 1,
                year:   now.getFullYear(),
            };
        }

        // Mode offset manuel
        if (timezoneMode === 'offset') {
            const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
            const localTime = new Date(utcMs + timezoneOffset * 3600000);
            return {
                hours:  localTime.getHours(),
                minutes: localTime.getMinutes(),
                seconds: localTime.getSeconds(),
                day:    localTime.getDate(),
                month:  localTime.getMonth() + 1,
                year:   localTime.getFullYear(),
            };
        }

        // Mode zone IANA
        const tz = timezoneId ||
            (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris');

        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour12: false,
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day:    '2-digit',
            month:  '2-digit',
            year:   'numeric',
        });

        const parts = formatter.formatToParts(now);
        const byType = {};
        for (const part of parts) {
            byType[part.type] = part.value;
        }

        return {
            hours:   parseInt(byType.hour, 10),
            minutes: parseInt(byType.minute, 10),
            seconds: parseInt(byType.second, 10),
            day:     parseInt(byType.day, 10),
            month:   parseInt(byType.month, 10),
            year:    parseInt(byType.year, 10),
        };
    }

    // ─────────────────────────────────────────────────────────────
    // Animation du runner de secondes
    // ─────────────────────────────────────────────────────────────
    function animateSecondsRunner() {
        if (redDots.length !== 60) {
            requestAnimationFrame(animateSecondsRunner);
            return;
        }

        // Si l’option "Roue des secondes" est désactivée → aucune aiguille
        if (!displayOptions.showSecondsRunner) {
            redDots.forEach(dot => dot.classList.remove('runner'));
            requestAnimationFrame(animateSecondsRunner);
            return;
        }

        const now = performance.now();
        const elapsed = now - lastTickTime;
        const progress = (elapsed % 1000) / 1000;

        const offset = Math.floor(progress * 60);
        const index  = (lastSecondIndex + offset) % 60;

        redDots.forEach((dot, i) => {
            dot.classList.toggle('runner', i === index);
        });

        requestAnimationFrame(animateSecondsRunner);
    }

    // ─────────────────────────────────────────────────────────────
    // Lecture des carillons de quarts d'heure
    // ─────────────────────────────────────────────────────────────
    function playQuarterChime(hours, minutes) {
        // Bouton général du carillon
        if (!isChimeEnabled) return;

        // Respect du planning
        if (!isChimeAllowedAtTime(hours, minutes)) return;

        let quarterNumber;
        if (minutes === 0) {
            // Heure pile => 4e quart
            quarterNumber = 4;
        } else {
            // 15 -> 1, 30 -> 2, 45 -> 3
            quarterNumber = Math.floor(minutes / 15);
        }

        const sound = quarterSounds[quarterNumber];
        if (!sound) return;

        try {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.error('Error playing quarter sound:', err);
            });
        } catch (e) {
            console.error('Error playing quarter sound:', e);
        }
    }


    // ─────────────────────────────────────────────────────────────
    // Mise à jour de l'horloge
    // ─────────────────────────────────────────────────────────────
    function updateClock() {
        const {
            hours: rawHours,
            minutes,
            seconds,
            day,
            month,
            year,
        } = getZonedTimeParts();

        const dayStr   = String(day).padStart(2, '0');
        const monthStr = String(month).padStart(2, '0');
        const yearVal  = year;

        const locale     = localeSettings[currentLanguage] || localeSettings.fr;
        const timeFormat = locale.timeFormat || '24';
        const dateFormat = locale.dateFormat || 'DD/MM/YYYY';

        let displayHours = rawHours;
        let ampm = '';

        if (timeFormat === '12') {
            ampm = rawHours >= 12 ? 'PM' : 'AM';
            displayHours = rawHours % 12;
            if (displayHours === 0) displayHours = 12;
        }

        const hoursStr   = String(displayHours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        // Heure centrale : HH:MM + :SS dans un span dédié
        if (timeElement) {
            const hhmm = `${hoursStr}:${minutesStr}`;
            const secondsHtml = `<span class="seconds">:${secondsStr}</span>`;
            const mainTimeHtml = `<span class="main-time"><span class="hhmm">${hhmm}</span>${secondsHtml}</span>`;

            if (ampm) {
                timeElement.innerHTML = `${mainTimeHtml}<span class="ampm"> ${ampm}</span>`;
            } else {
                timeElement.innerHTML = mainTimeHtml;
            }
        }

        // Date
        let dateStr;
        switch (dateFormat) {
            case 'DD.MM.YYYY':
                dateStr = `${dayStr}.${monthStr}.${yearVal}`;
                break;
            case 'MM/DD/YYYY':
                dateStr = `${monthStr}/${dayStr}/${yearVal}`;
                break;
            case 'DD/MM/YYYY':
            default:
                dateStr = `${dayStr}/${monthStr}/${yearVal}`;
                break;
        }

        if (dateElement) {
            dateElement.textContent = dateStr;
        }

        // Anneau des secondes
        if (redDots.length === 60) {
            redDots.forEach((dot, index) => {
                dot.classList.toggle('active', index <= seconds);
            });
        }

        // Anneau des minutes
        if (minuteDots.length === 60) {
            minuteDots.forEach((dot, index) => {
                dot.classList.toggle('active', index <= minutes);
            });
        }

            // Bip de seconde
        if (isAudioEnabled) {
            audio.currentTime = 0;
            audio.play().catch(err => console.error('Error playing audio:', err));
        }

        // Carillon des quarts d'heure (00, 15, 30, 45, seconde exacte 0)
        if (seconds === 0 && minutes % 15 === 0) {
            // On fabrique une clé unique pour ce quart précis
            const chimeKey = `${yearVal}-${monthStr}-${dayStr}-${hoursStr}-${minutesStr}`;
            if (lastChimeKey !== chimeKey) {
                lastChimeKey = chimeKey;
                playQuarterChime(rawHours, minutes);
            }
        }

        // Synchronisation du runner avec le changement de seconde affichée
        lastSecondIndex = seconds;
        lastTickTime    = performance.now();
    }

    // ─────────────────────────────────────────────────────────────
    // INITIALISATION
    // ─────────────────────────────────────────────────────────────
    loadSettings();
    loadProfiles();
    applyTheme();
    applyColorTheme(colorTheme);
    applyDisplayOptions();
    createDots();
    refreshMenuTexts();
    updateLanguagePanelSelection();
    updateColorInputsFromTheme();
    updateColorPresetSelection();
    syncDisplayPanelFromState();
    syncTimezoneUIFromState();
    updateFullscreenLabel();
    renderProfilesList();

    // Premier tick d'horloge avant de lancer le runner
    updateClock();
    setInterval(updateClock, 1000);

    // Animation continue du point rouge
    animateSecondsRunner();
});
