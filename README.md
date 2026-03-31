# Cosmic Atlas - Projet Framework Web 2

## 1. Objectif du projet

"Cosmic Atlas" est une application web realisee en Vue.js qui permet d'explorer des contenus de la NASA.
L'objectif est de proposer une experience claire et moderne autour des images spatiales:

- Image astronomique du jour (APOD).
- Galerie des rovers martiens.
- Systeme de favoris.

Le projet met en pratique les notions vues en cours: composants, reactivite, router, appels API avec Axios et store Pinia.

## 2. Fonctionnalites principales

### Exploration des donnees NASA

- Recuperation de l'image astronomique du jour via l'API NASA APOD.
- Recuperation des photos des rovers martiens (Curiosity et Perseverance).
- Bascule automatique vers la NASA Image API si l'API Mars Photos ne renvoie rien ou est indisponible.

### Navigation et experience utilisateur

- Navigation multi-pages avec Vue Router:
  - Accueil.
  - Mars par rover (`/mars/:roverName`).
  - Detail d'image (`/detail/:id`).
  - Favoris (`/favoris`).
- Consultation du detail d'une image avec affichage plein ecran.
- Notifications visuelles (toast) lors de l'ajout en favoris.

### Recherche, filtres et tri (vue Mars)

- Recherche texte (titre, description, date, camera).
- Filtres par date minimale et date maximale.
- Filtre par annee.
- Tri par date (plus recentes / plus anciennes).
- Chargement progressif des resultats (bouton "Charger la suite").

### Gestion des favoris (Pinia)

- Ajout d'une image en favoris.
- Prevention des doublons.
- Affichage de la liste des favoris sauvegardes.
- Getters de comptage des favoris.

## 3. Technologies utilisees

- Vue 3
- Vue Router
- Pinia
- Axios
- Vite
- ESLint + Oxlint + Prettier

## 4. Appels API

- APOD: `https://api.nasa.gov/planetary/apod`
- Mars Rover Photos: `https://api.nasa.gov/mars-photos/api/v1/rovers`
- NASA Images: `https://images-api.nasa.gov/search`

Cle API utilisee:

- Variable d'environnement `VITE_NASA_API_KEY` si elle est definie.
- Sinon, fallback sur `DEMO_KEY`.

## 5. Installation et lancement

### Prerequis

- Node.js 20.19+ (ou 22.12+)
- npm

### Installation

```bash
npm install
```

### Lancement en developpement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```


### (Optionnel) Configuration de la cle NASA

Creer un fichier `.env` a la racine du projet:

```bash
VITE_NASA_API_KEY=VOTRE_CLE_API
```

## 6. Organisation du projet

- `src/views`: pages principales (Accueil, Mars, Detail, Favoris).
- `src/components`: composants reutilisables (`ImageCard`, `NotificationToast`).
- `src/stores`: store Pinia pour les favoris.
- `src/router`: configuration des routes.

## 7. Qui a fait quoi (si binome)

Projet realise en binome:

- Younes Guehhoudi
- Achraf Addaq

Repartition des taches:

- La repartition detaillee des taches est a consulter dans l'historique des commits Git du projet.

## 8. Organisation du travail et collaboration

- Outil principal de collaboration: GitHub.
- Suivi du travail et coordination realises via les commits/push sur le repository.

## 9. Difficultes rencontrees

- Repartition des taches dans le binome.
- Gestion de l'API.


## 10. Etat du projet

Le projet est fonctionnel et couvre les attentes principales du module:

- Composants et reactivite Vue.
- Router avec parametres dynamiques.
- Appels API avec gestion d'erreurs.
- Store Pinia partage entre vues/composants.
