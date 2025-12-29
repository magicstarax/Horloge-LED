# Horloge LED Studio (Version Web)

Horloge LED Studio est une horloge LED circulaire entièrement animée, développée en **HTML / CSS / JavaScript**.  
Cette version Web fonctionne 100 % côté client et propose une interface riche : thèmes, couleurs, langues, fuseaux horaires, profils, sons de battements et **carillon programmable**.

---

## Fonctionnalités principales

### Horloge LED circulaire

- Anneaux de **60 points de secondes** et **60 points de minutes**.
- Points de repère toutes les **5 secondes**.
- Affichage central de l’heure au format `HH:MM:SS`, avec gestion du **12 h / 24 h** suivant la langue.
- Option **« Roue des secondes »** : un point rouge baladeur qui tourne en continu en synchronisation avec la seconde courante.

### Sons

- **Bip de seconde** :
  - Un clic sur l’élément de menu **« Activer / Couper le bip »** permet d’activer ou non le son `clock.wav`.
  - Le bip est lu à chaque seconde uniquement si l’option est active.

- **Carillon Big Ben (quarts d’heure)** :
  - Lecture de fichiers distincts :
    - `bigben_quart1.wav` : 15 minutes,
    - `bigben_quart2.wav` : 30 minutes,
    - `bigben_quart3.wav` : 45 minutes,
    - `bigben_quart4.wav` : heure pleine.
  - Le carillon est complètement indépendant du bip : il possède son **propre interrupteur** dans le menu (**Activer/Désactiver le carillon**).

### Planning du carillon

Pour éviter de réveiller tout le quartier à 3 h du matin, le carillon dispose d’un **planning horaire** :

- Ouverture d’un **panneau modal « Planning du carillon »**.
- Choix d’une **heure de début** et d’une **heure de fin** via deux champs `input[type="time"]`.
- Le carillon :
  - ne joue **que** si  
    1. le carillon est activé dans le menu, et  
    2. l’horaire actuel se situe dans la plage définie.
- Un texte de rappel dans le modal précise que le carillon respecte également l’option de bip.

Les paramètres du planning sont, comme le reste, stockés dans le navigateur (localStorage).

### Thèmes et couleurs

- Mode **clair** et **sombre**, sélectionnable à tout moment depuis le menu.
- Panneau **« Couleurs »** avec :
  - Plusieurs **préréglages** :
    - `Classique`,
    - `Océan`,
    - `Matrix`,
    - `Sunset`.
  - Mode **Personnalisé** :
    - Couleur des secondes,
    - Couleur des minutes,
    - Couleur des repères.
- Les couleurs « éteintes » des points sont automatiquement calculées à partir des couleurs choisies (même teinte, intensité réduite).

### Options d’affichage

Panneau **« Affichage »** permettant d’activer ou non :

- Anneau des **secondes**,
- Anneau des **minutes**,
- **Repères** toutes les 5 secondes,
- Affichage de la **date**,
- Affichage du **AM/PM** (utile surtout en anglais),
- Affichage des **secondes** dans l’heure centrale,
- Affichage de la **roue des secondes**.

Chaque option agit en temps réel sur le DOM via des classes CSS (`hide-seconds-dots`, `hide-date`, etc.).

### Fuseaux horaires avancés

Panneau **« Fuseau horaire »** avec trois modes :

1. **Automatique**  
   - Utilise directement la date/heure de la machine.

2. **Zone IANA**  
   - Sélection par **carte simplifiée** (bandes cliquables) ou par **liste déroulante** (ex. `Europe/Paris`, `America/New_York`, …).
   - L’heure affichée suit exactement la zone choisie.

3. **Décalage UTC personnalisé**  
   - Saisie d’un décalage `-12` à `+14` (avec demi-heures possibles, ex. `5.5`).
   - Conversion à partir de l’UTC pour simuler un fuseau spécifique.

### Internationalisation

L’application est disponible en **5 langues** :

- Français (`fr`),
- Anglais (`en`),
- Espagnol (`es`),
- Allemand (`de`),
- Italien (`it`).

Un panneau **« Langue »** présente les options sous forme de boutons avec drapeaux (via la librairie `flag-icons`).  
Les libellés du menu, des panneaux et des boutons sont traduits dynamiquement à partir d’un dictionnaire JavaScript.

### Profils utilisateurs

Panneau **« Profils »** :

- Sauvegarde de la configuration courante sous un nom libre (ex. `Studio nuit`, `Matin bureau`, …).
- Affichage de la liste des profils enregistrés, avec :
  - Bouton **« Appliquer »**,
  - Bouton **« Supprimer »**.
- Si un profil existe déjà avec le même nom, confirmation avant écrasement.
- Un mécanisme compare les réglages pour éviter de dupliquer des profils strictement identiques (avec message d’avertissement).

Les profils et les paramètres de base sont stockés dans le **localStorage** du navigateur.

### Mode plein écran et version

- Un bouton du menu permet de basculer l’horloge en **plein écran** via l’API `Fullscreen`.
- La version de l’application (issue de `version.js`) est affichée en bas à droite de l’horloge.

---

## Persistance des réglages

Les réglages sont stockés côté client via `localStorage` :

- Clé `studioClockSettings` :
  - Thème (clair/sombre),
  - État du bip,
  - État du carillon,
  - Fuseau horaire (mode, zone, offset),
  - Langue,
  - Thème de couleurs (présélection + valeurs hex),
  - Options d’affichage,
  - Créneau horaire du carillon.

- Clé `studioClockProfiles` :
  - Ensemble des profils nommés avec leurs paramètres complets.

Aucune donnée n’est envoyée sur un serveur : l’horloge fonctionne totalement hors ligne.

---

## Structure du projet

Principaux fichiers et répertoires :

- `index.html`  
  Structure de la page : horloge, menus, panneaux (langue, couleurs, fuseau, affichage, profils, planning du carillon), zone d’affichage de la version.

- `style.css`  
  Styles principaux, gestion du thème clair/sombre, disposition des panneaux modaux, apparence de l’horloge LED, animations de base.

- `script.js`  
  Logique applicative :
  - Calcul et affichage de l’heure,
  - Gestion des fuseaux horaires,
  - Gestion des sons (bip + carillon),
  - Planning du carillon,
  - Options d’affichage,
  - Internationalisation,
  - Profils,
  - Sauvegarde/restauration des réglages.

- `version.js`  
  Définit une variable globale `appVersion` utilisée pour afficher la version dans l’interface.

- `son/clock.wav`  
  Son court du bip de seconde.

- `son/bigben_quart1.wav` à `son/bigben_quart4.wav`  
  Sons du carillon Big Ben pour les différents quarts d’heure.

- `icon.ico`  
  Icône de l’application.

Des dépendances côté client sont chargées via CDN :

- **Bootstrap Icons** pour les icônes de menu.
- **flag-icons** pour l’affichage des drapeaux dans le sélecteur de langue.

---

## Prérequis

- Un **navigateur moderne** compatible :
  - HTML5,
  - CSS3,
  - JavaScript ES6+,
  - `Intl.DateTimeFormat` avec prise en charge des zones IANA,
  - API `Fullscreen`,
  - `localStorage`.

---

## Installation et lancement

1. Télécharger ou cloner le projet.
2. Placer l’ensemble des fichiers dans un même dossier en conservant la structure.
3. Ouvrir simplement `index.html` dans votre navigateur.

Aucune installation supplémentaire ni serveur n’est nécessaire.

---

## Utilisation rapide

1. **Lancer l’horloge**  
   Ouvrez `index.html` : l’horloge s’anime immédiatement avec les réglages par défaut.

2. **Ouvrir le menu**  
   Cliquez sur l’icône à trois points en haut à gauche pour afficher le menu.

3. **Activer le bip**  
   Cliquez sur **« Activer le bip »** pour entendre le son à chaque seconde.

4. **Activer le carillon**  
   Cliquez sur **« Activer le carillon »** pour entendre les sons de Big Ben aux quarts d’heure.

5. **Configurer le planning du carillon**  
   Ouvrez le panneau « Planning du carillon », définissez l’heure de début et de fin, puis **Enregistrer**.

6. **Personnaliser l’affichage**  
   Via les panneaux **Affichage**, **Couleurs** et **Fuseau horaire**, ajustez l’apparence et l’heure selon vos besoins.

7. **Créer un profil**  
   Dans le panneau **Profils**, nommez votre configuration et enregistrez-la pour pouvoir la rappeler en un clic.

---

## Historique des versions

- **1.4.x** (version actuelle)  
  - Séparation du **bip de seconde** et du **carillon Big Ben** avec interrupteurs indépendants.  
  - Ajout du **planning du carillon** (créneau horaire paramétrable).  
  - Panneaux complets : **Affichage**, **Couleurs**, **Fuseau horaire**, **Langues**, **Profils**.  
  - Gestion avancée des fuseaux horaires (auto / zone / offset UTC).  
  - Internationalisation étendue à 5 langues (FR, EN, ES, DE, IT).  
  - Ajout des profils utilisateur avec sauvegarde et restauration des réglages.  
  - Persistance globale via `localStorage`.

- **1.1.0**  
  - Ajout d’un premier menu interactif (plein écran, son, changement de thème).  
  - Amélioration de l’interface, support du mode sombre/clair, affichage de la version. :contentReference[oaicite:0]{index=0}  

- **1.0.0**  
  - Version initiale de l’horloge LED en mode sombre, sans internationalisation ni profils. :contentReference[oaicite:1]{index=1}  

---

## Licence

Ce projet est distribué sous licence **MIT**.  
Vous êtes libre de l’utiliser, le modifier et le redistribuer dans les conditions définies par la licence.

---

**Auteur :** Maitr'Astral
