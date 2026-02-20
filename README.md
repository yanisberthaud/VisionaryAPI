# Visionary - Explorateur de Films & Séries

Visionary est une application web Netflix-style construite avec **TypeScript*** et **Vite**, permettant d'explorer films et séries en temps réel via la [TMDB API](https://www.themoviedb.org/).

## Fonctionnalités Principales

- **5 Carousels dynamiques** : Films populaires, mieux notés, en ce moment au cinéma, séries populaires et mieux notées — chargés en parallèle via `Promise.all()`.
- **Recherche intelligente** : Barre de recherche avec debounce à 300ms pour limiter les appels API.
- **Système de Favoris** : Ajout/suppression de favoris avec persistance via `localStorage` (clé `visionary-favorites`), filtre dédié.
- **Tri avancé** : Classement par note, titre (A→Z / Z→A) ou date de sortie, côté client sans appel réseau.
- **Modale de détails** : Affichage de la description, date, note et gestion des favoris. Fermeture via `Escape`, clic extérieur ou bouton ✕.
- **Skeleton Loading** : 6 placeholders animés affichés pendant chaque appel réseau.
- **Statistiques temps réel** : Nombre de films affichés, favoris, et note moyenne recalculés à chaque action.
- **Accessibilité** : Attributs ARIA sur la modale (`role="dialog"`, `aria-modal`).

## Stack Technique

- **Frontend** : TypeScript (mode strict, `0 any`), HTML5, SCSS
- **Tooling** : Vite.js
- **API** : TMDB API v3
- **Icônes** : Font Awesome 6
- **Typo** : Google Fonts — Inter

## Structure du Projet

- **src/types/** : Interfaces TypeScript (`Movie`, `TVShow`, `AppState`, union types).
- **src/services/** : `ApiService` (appels TMDB) et `StorageService` (localStorage).
- **src/components/** : `MovieCard`, `Modal`, `Stats` — génération et gestion du DOM.
- **src/utils/** : `Helpers` — tri, formatage des dates/notes, debounce.
- **src/main.ts** : Classe `App`, orchestration générale et gestion de l'état.
- **index.html** : Point d'entrée de l'application.

## Obtenir une clé API TMDB

1. Créer un compte sur [themoviedb.org](https://www.themoviedb.org/).
2. Aller dans `Profil` → `Paramètres` → `API`.
3. Cliquer sur **Créer** → choisir **Developer** et remplir le formulaire (usage `Personal`, URL `http://localhost:5173`).
4. Copier la clé **API Key (v3 auth)** générée (32 caractères hexadécimaux).

## Installation et Lancement

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-username/visionary.git
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer la clé API :
   ```bash
   cp .env.example .env
   # Renseigner VITE_TMDB_API_KEY=votre_clé dans .env
   ```
4. Lancer le projet :
   ```bash
   npm run dev
   ```

> ⚠️ Le fichier `.env` est dans `.gitignore`. Ne committez jamais votre clé API.

## Auteur

BERTHAUD Yanis
