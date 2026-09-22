# CampusRate

CampusRate est une API REST permettant aux étudiants et/ou au personnel d'un campus de **noter des lieux** (restaurants, résidences, bibliothèques, services administratifs, etc.), afin d'aider les gens d'avoir une idee.

## Objectif

Centraliser les avis sur les différents endroits d'un campus. Chaque lieu (`Place`) peut recevoir plusieurs critiques (`Review`), et sa note moyenne ainsi que son nombre d'avis sont recalculés automatiquement à chaque création, modification ou suppression d'un avis.

## Fonctionnalités

- **Gestion des lieux (`/places`)**
  - Création, consultation, mise à jour et suppression d'un lieu
  - Catégorisation (`category`) et statut (`status`, ex. actif/inactif)
  - Liste des lieux avec **pagination** et **filtrage par catégorie**
  - Suppression bloquée si le lieu possède encore des critiques associées
- **Gestion des critiques (`/reviews`)**
  - Création, consultation, mise à jour et suppression d'un avis attaché à un lieu
  - Calculation automatique de la note moyenne et du nombre d'avis d'un lieu à chaque changement, grace un système d'événements internes
- **Persistance simple par fichiers JSON**, avec écritures atomiques (fichier temporaire puis renommage)
- **Réponses d'erreur normalisées** au format `application/problem+json` (RFC 7807), grace un filtre d'exceptions

## Technologies

- [NestJS](https://nestjs.com/) (Node.js / TypeScript)
- [Express](https://expressjs.com/) comme adaptateur HTTP sous-jacent
- `@nestjs/event-emitter` pour la communication événementielle entre les modules `Places` et `Reviews`
- Stockage sur disque au format **JSON** (pas de base de données pour cette première version)
- [Swagger / OpenAPI](https://docs.nestjs.com/openapi/introduction) pour la documentation interactive de l'API

## Prérequis

- Node.js
- npm

## Installation

```bash
git clone <url-du-repo>
cd campusrate
npm install
```

## Configuration

CampusRate utilise des fichiers JSON comme source de vérité pour les lieux et les critiques. Les chemins de ces fichiers sont définis via des variables d'environnement.

Créez un fichier `.env` à la racine du projet :

```env
PLACES_FILE_PATH=data/places.json
REVIEWS_FILE_PATH=data/reviews.json
PORT=port_utilise
```

> Le répertoire data et les fichiers json seront crées automatiquement. 

Vous pouvez aussi copier le fichier .env avec cette commande:
```bash
cp .env.example .env
```

## Démarrage

```bash
# mode développement (avec rechargement à chaud)
npm run start:dev

# mode production
npm run start:prod
```

## Lint

```bash
# Vérification du code avec ESLint
npm run lint
```

## Compilation (build)

```bash
# Le code compilé est généré dans le dossier `dist/`.
npm run build
```


## Documentation Swagger UI

Une fois le serveur démarré, la documentation interactive de l'API est disponible à l'adresse :

```
http://localhost:3000/api
```

Elle permet d'explorer et de tester chacun des points de terminaison (`Places`, `Reviews`) directement depuis le navigateur.

## Contrat général de l'API

- Toutes les réponses en erreur suivent le format **Problem Details** (`application/problem+json`).
- Les listes paginées (ex. `GET /places`) renvoient un objet contenant :
  - `data` : le tableau des éléments de la page courante
  - `pagination` : `page`, `limit`, `totalItems`, `totalPages`
- Les identifiants sont préfixés par ressource (ex. `plc_a1b2c3` pour un lieu, `rev_a1b2c3` pour une critique).

## Limites connues

- La persistance repose sur de simples fichiers JSON locaux : elle ne convient pas à un usage multi-instance ou à fort volume de données, et ne remplace pas une base de données.
- Aucune authentification ni autorisation n'est actuellement implémentée : tous les points de terminaison sont ouverts.

---