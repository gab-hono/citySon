# CitySon 🎧🗺️

**EN** | [FR](#français)

---

## English

### Overview

CitySon is an interactive sound mapping web application for Paris. Users can explore site-specific audio pieces tied to precise locations, creating a living sonic archive of the city.

### Current Status

**Version:** 0.1.0 - Prototype  
**Status:** In active development  

### ✅ Implemented Features

- **Interactive Map**
  - Leaflet-based map centered on Paris
  - Pin markers for each audio piece location
  - Click interaction to view details
  
- **Audio Pin Display**
  - Database-driven pin rendering
  - Detail panel with slide-up animation
  - Display of metadata:
    - Title and author
    - Listening location
    - Description/inspiration text
    - Creation technologies
    - Audio link (external for now)

- **Database Architecture**
  - Neon PostgreSQL database
  - Three core tables: `audio_pin`, `user`, `favorites`
  - RESTful API endpoints for data retrieval

- **Responsive Design**
  - Mobile-first layout
  - Desktop two-column layout (hero + map)
  - Dark theme with lime accent

### 🚧 Features In Development

#### 1. Add New Pin Form (`/ajouter`)
**Priority:** HIGH  
**Status:** Not started

- Click on map to set coordinates
- File upload for audio (.mp3, .wav, .m4a)
- Integration with Cloudinary for audio storage
- Form validation
- Success/error feedback

**Technical requirements:**
- Frontend: FormData upload with drag-and-drop
- Backend: Multer + Cloudinary integration
- Database: INSERT query to `audio_pin` table

---

#### 2. User Authentication
**Priority:** HIGH  
**Status:** Not started

- Registration page
- Login page
- Session management
- Protected routes
- User profile display

**Technical requirements:**
- Backend: JWT or session-based auth
- Password hashing (bcrypt)
- Secure cookie handling
- Frontend: Auth context/state management

---

#### 3. Favorites System
**Priority:** MEDIUM  
**Status:** Not started

- "Add to favorites" button on pin detail
- `/favorites` page with saved pins
- Remove from favorites functionality
- Visual indicator for favorited pins on map

**Technical requirements:**
- Backend: POST/DELETE endpoints for `favorites` table
- User authentication required
- Optimistic UI updates

---

#### 4. User Profile (`/profil`)
**Priority:** MEDIUM  
**Status:** Not started

- Display user information
- List of user's uploaded pins
- Edit profile functionality
- Account settings

**Technical requirements:**
- Fetch user data with pins
- Form for profile updates
- Delete account option

---

### 🎯 Roadmap

**Week 1 (Current):**
- ✅ Database setup
- ✅ Map integration
- ✅ Pin display system
- 🚧 Add new pin form

**Future:**
- User authentication
- Audio upload with Cloudinary
- Favorites system basics
- User profile page
- UI/UX refinements
- Testing and bug fixes
- Route creation (audio walk itineraries)
- Social features (comments, sharing)
- Mobile app (React Native)

---

### Tech Stack

**Frontend:**
- React (JavaScript)
- React Router 
- Leaflet + React Leaflet (maps)
- CSS (custom design system)

**Backend:**
- Node.js + Express.js
- Neon PostgreSQL
- CORS enabled

---

### Contributing

This is currently a solo project. Contributions welcome after initial release.

---

### License

© 2026 Gabriel Hono - All rights reserved

---
---

## Français

### Aperçu

CitySon est une application web de cartographie sonore interactive pour Paris. Les utilisateurs peuvent explorer des pièces audio liées à des lieux précis, créant ainsi une archive sonore vivante de la ville.

### État actuel

**Statut :** En développement actif  

### ✅ Fonctionnalités implémentées

- **Carte interactive**
  - Carte Leaflet centrée sur Paris
  - Marqueurs de pins pour chaque pièce audio
  - Interaction au clic pour voir les détails
  
- **Affichage des pins audio**
  - Rendu des pins depuis la base de données
  - Panneau de détails avec animation de glissement
  - Affichage des métadonnées :
    - Titre et auteur
    - Lieu d'écoute
    - Texte de description/inspiration
    - Technologies de création
    - Lien audio (externe pour l'instant)

- **Architecture de base de données**
  - Base de données Neon PostgreSQL
  - Trois tables principales : `audio_pin`, `user`, `favorites`
  - Points d'API RESTful pour la récupération de données

- **Design responsive**
  - Layout mobile-first
  - Layout desktop en deux colonnes (hero + carte)
  - Thème sombre avec accent vert lime

### 🚧 Fonctionnalités en développement

#### 1. Formulaire d'ajout de pin (`/ajouter`)
**Priorité :** HAUTE  
**Statut :** Non commencé

- Clic sur la carte pour définir les coordonnées
- Upload de fichier audio (.mp3, .wav, .m4a)
- Intégration avec Cloudinary pour le stockage audio
- Validation du formulaire
- Feedback de succès/erreur

**Exigences techniques :**
- Frontend : Upload FormData avec drag-and-drop
- Backend : Intégration Multer + Cloudinary
- Base de données : Requête INSERT dans la table `audio_pin`

---

#### 2. Authentification utilisateur
**Priorité :** HAUTE  
**Statut :** Non commencé

- Page d'inscription
- Page de connexion
- Gestion de session
- Routes protégées
- Affichage du profil utilisateur

**Exigences techniques :**
- Backend : Auth basée sur JWT ou session
- Hachage de mot de passe (bcrypt)
- Gestion sécurisée des cookies
- Frontend : Contexte/gestion d'état d'authentification

---

#### 3. Système de favoris
**Priorité :** MOYENNE  
**Statut :** Non commencé

- Bouton "Ajouter aux favoris" sur le détail du pin
- Page `/favorites` avec les pins sauvegardés
- Fonctionnalité de retrait des favoris
- Indicateur visuel pour les pins favoris sur la carte

**Exigences techniques :**
- Backend : Endpoints POST/DELETE pour la table `favorites`
- Authentification utilisateur requise
- Mises à jour UI optimistes

---

#### 4. Profil utilisateur (`/profil`)
**Priorité :** MOYENNE  
**Statut :** Non commencé

- Affichage des informations utilisateur
- Liste des pins uploadés par l'utilisateur
- Fonctionnalité d'édition de profil
- Paramètres de compte

**Exigences techniques :**
- Récupération des données utilisateur avec pins
- Formulaire pour les mises à jour de profil
- Option de suppression de compte

---

### 🎯 Feuille de route

**Semaine 1 (Actuelle) :**
- ✅ Configuration de la base de données
- ✅ Intégration de la carte
- ✅ Système d'affichage des pins
- 🚧 Formulaire d'ajout de nouveau pin


**Futur :**
- Authentification utilisateur
- Upload audio avec Cloudinary
- Système de favoris de base
- Page de profil utilisateur
- Raffinements UI/UX
- Tests et corrections de bugs
- Création de parcours (itinéraires de promenade audio)
- Fonctionnalités sociales (commentaires, partage)
- Application mobile (React Native)

---

### Stack technique

**Frontend :**
- React 18 (JavaScript)
- React Router 7
- Leaflet + React Leaflet (cartes)
- CSS (système de design personnalisé)

**Backend :**
- Node.js + Express.js
- Neon PostgreSQL
- CORS activé

**Intégrations prévues :**
- Cloudinary (stockage audio)
- JWT (authentification)

### Contribuer

Il s'agit actuellement d'un projet solo. Les contributions seront bienvenues après la sortie initiale.

---

### Licence

© 2026 Gabriel Hono - Tous droits réservés