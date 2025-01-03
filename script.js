document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const audioToggle = document.getElementById('audio-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const timezoneToggle = document.getElementById('timezone-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const versionContainer = document.getElementById('app-version');

    const clock = document.querySelector('.clock');
    let currentTheme = 'dark';
    let isAudioEnabled = false;
    let timezoneOffset = +1;

    // Version de l'application
    versionContainer.textContent = `Version : ${appVersion}`;

    // Fichier audio pour le son
    const audio = new Audio('son/clock.wav');

    // Traductions pour les différentes langues
    const translations = {
        en: {
            fullscreen: 'Fullscreen',
            playSound: 'Play Sound',
            stopSound: 'Stop Sound',
            changeTheme: 'Change Theme',
            timezone: 'Timezone',
            enterOffset: 'Enter timezone offset from UTC (e.g., -5 for UTC-5):',
            offsetSet: 'Timezone offset set to UTC',
            cancelOffset: 'No timezone offset set.', // Message pour annulation
            invalidOffset: 'Invalid timezone offset entered.', // Message pour saisie invalide
            language: 'Language',
        },
        fr: {
            fullscreen: 'Plein écran',
            playSound: 'Activer le son',
            stopSound: 'Couper le son',
            changeTheme: 'Changer de thème',
            timezone: 'Fuseau horaire',
            enterOffset: 'Entrez le décalage horaire par rapport à UTC (ex. : -5 pour UTC-5) :',
            offsetSet: 'Décalage horaire défini à UTC',
            cancelOffset: 'Aucun décalage horaire défini.', // Message pour annulation
            invalidOffset: 'Décalage horaire invalide.', // Message pour saisie invalide
            language: 'Langue',
        },
    };
    

    // Langue actuelle (par défaut : français)
    let currentLanguage = 'fr';

    // Gestion du menu déroulant
    menuButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('active');
        }
    });

    // Plein écran
    fullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Gestion du son
    audioToggle.addEventListener('click', () => {
        isAudioEnabled = !isAudioEnabled;
        audioToggle.innerHTML = isAudioEnabled
            ? `<i class="bi bi-volume-mute"></i> ${translations[currentLanguage].stopSound}` // Icône pour "son coupé"
            : `<i class="bi bi-music-note"></i> ${translations[currentLanguage].playSound}`; // Icône pour "son activé"
    });    

    // Changer de thème
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.classList.toggle('light', currentTheme === 'light');
        document.body.classList.toggle('dark', currentTheme === 'dark');
    });

    // Fuseau horaire
    timezoneToggle.addEventListener('click', () => {
        const offset = prompt(translations[currentLanguage].enterOffset); // Affiche le message dans la langue choisie
        if (offset === null || offset.trim() === '') {
            alert(translations[currentLanguage].cancelOffset || 'No timezone offset set.');
            return;
        }
    
        if (!isNaN(offset)) {
            timezoneOffset = parseInt(offset);
            alert(
                `${translations[currentLanguage].offsetSet} ${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`
            );
        } else {
            alert(translations[currentLanguage].invalidOffset || 'Invalid timezone offset entered.');
        }
    });
    

    // Changer de langue
    languageToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';

        // Mise à jour des textes traduits dans le menu
        fullscreenToggle.innerHTML = `<i class="bi bi-arrows-fullscreen"></i> ${translations[currentLanguage].fullscreen}`;
        audioToggle.innerHTML = isAudioEnabled
            ? `<i class="bi bi-music-note-off"></i> ${translations[currentLanguage].stopSound}`
            : `<i class="bi bi-music-note"></i> ${translations[currentLanguage].playSound}`;
        themeToggle.innerHTML = `<i class="bi bi-palette"></i> ${translations[currentLanguage].changeTheme}`;
        timezoneToggle.innerHTML = `<i class="bi bi-globe"></i> ${translations[currentLanguage].timezone}`;
        languageToggle.innerHTML = `<i class="bi bi-translate"></i> ${translations[currentLanguage].language}`;
    });

    // Mise à jour de l'horloge
    function updateClock() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utc + timezoneOffset * 3600000);
        const hours = String(localTime.getHours()).padStart(2, '0');
        const minutes = String(localTime.getMinutes()).padStart(2, '0');
        const seconds = localTime.getSeconds();
        const day = String(localTime.getDate()).padStart(2, '0');
        const month = String(localTime.getMonth() + 1).padStart(2, '0');
        const year = localTime.getFullYear();

        document.getElementById('time').textContent = `${hours}:${minutes}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('date').textContent = `${day}/${month}/${year}`;

        // Mettre à jour les points rouges en fonction des secondes
        document.querySelectorAll('.dot.red').forEach((dot, index) => {
            dot.classList.toggle('active', index <= seconds);
        });

        // Jouer le son à chaque seconde si activé
        if (isAudioEnabled) {
            audio.currentTime = 0;
            audio.play().catch(err => console.error('Error playing audio:', err));
        }
    }

    // Création des points rouges et orange autour de l'horloge
    function createDots() {
        const radiusRed = 250;
        const radiusGreen = radiusRed + 30;

        for (let i = 0; i < 60; i++) {
            const angle = ((i - 15) * 6) * (Math.PI / 180);

            const xRed = 300 + radiusRed * Math.cos(angle);
            const yRed = 300 + radiusRed * Math.sin(angle);

            const redDot = document.createElement('div');
            redDot.className = 'dot red';
            redDot.style.left = `${xRed}px`;
            redDot.style.top = `${yRed}px`;
            clock.appendChild(redDot);

            if (i % 5 === 0) {
                const xGreen = 300 + radiusGreen * Math.cos(angle);
                const yGreen = 300 + radiusGreen * Math.sin(angle);

                const greenDot = document.createElement('div');
                greenDot.className = 'dot green';
                greenDot.style.left = `${xGreen}px`;
                greenDot.style.top = `${yGreen}px`;
                clock.appendChild(greenDot);
            }
        }
    }

    // Initialisation de l'horloge
    createDots();
    setInterval(updateClock, 1000);
    updateClock();
});
