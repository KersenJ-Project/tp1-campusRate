# CampusRate

CampusRate est une API REST permettant aux étudiants et/ou au personnel d'un campus de noter des lieux, afin d'aider les gens à avoir une idée.

## Objectif

Centraliser les avis sur les différents endroits d'un campus. Chaque lieu peut recevoir plusieurs critiques, et sa note moyenne ainsi que son nombre d'avis sont recalculés automatiquement à chaque création, modification ou suppression d'un avis.

## Fonctionnalités

- **Gestion des lieux** : création, consultation, mise à jour et suppression d'un lieu, avec une catégorie (`category`), un statut (`status`), une liste paginée et un filtre par catégorie. La suppression est bloquée si le lieu possède encore des critiques.
- **Gestion des critiques** : création, consultation, mise à jour et suppression d'un avis attaché à un lieu. Un avis ne peut être créé que pour un lieu existant. La note moyenne et le nombre d'avis du lieu sont recalculés à chaque changement, grâce à un système d'événements internes.
- **Persistance dans MongoDB** avec Mongoose, séparée en contrôleurs, services et repositories.
- **Sécurité HTTP** avec CORS configuré explicitement, Helmet et HTTPS local.
- **Réponses d'erreur normalisées** au format `application/problem+json` (RFC 7807), grâce à un filtre d'exceptions.

## Technologies

- [NestJS](https://nestjs.com/) (Node.js / TypeScript) avec [Express](https://expressjs.com/) comme adaptateur HTTP sous-jacent
- [MongoDB](https://www.mongodb.com/) (hébergé sur Atlas) avec [Mongoose](https://mongoosejs.com/) via `@nestjs/mongoose`
- `@nestjs/config` et Joi pour la configuration et sa validation
- `class-validator` et `class-transformer` pour la validation des DTO
- `@nestjs/event-emitter` pour la communication entre les modules `Places` et `Reviews`
- [Helmet](https://helmetjs.github.io/) pour les en-têtes de sécurité
- [Swagger / OpenAPI](https://docs.nestjs.com/openapi/introduction) pour la documentation interactive de l'API

## Prérequis

- Node.js et npm
- Un cluster MongoDB
- OpenSSL ou [mkcert](https://github.com/FiloSottile/mkcert) pour générer le certificat HTTPS local

## Installation

```bash
git clone <url-du-repo>
cd campusrate
npm ci
```

## Configuration

### 1. Configurer MongoDB (Atlas)

Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) et un cluster. Créez ensuite un utilisateur de base de données avec un mot de passe et autorisez votre adresse IP. Les collections `places` et `reviews` sont créées automatiquement à la première insertion.

### 2. Créer le fichier `.env`

Copiez le fichier d'exemple avec cette commande, puis remplissez-le :

```bash
cp .env.example .env
```

```env
PORT=3000
MONGO_URI=mongodb+srv://<utilisateur>:<mot_de_passe>@<cluster>.mongodb.net/campusrate?retryWrites=true&w=majority
CORS_ORIGINS=http://localhost:5173
HTTPS_KEY_PATH=localhost-key.pem
HTTPS_CERT_PATH=localhost.pem
HTTP_REDIRECT_PORT=3001
```

Si `MONGO_URI` est absente, l'application refuse de démarrer.

L'API sera disponible sur l'adresse `https://localhost:3000/api/v1`.

## Démarrage

```bash
# mode développement (avec rechargement à chaud)
npm run start:dev

# mode production
npm run start:prod
```

L'API est disponible sur l'adresse `https://localhost:3000/api/v1`. Le navigateur affiche un avertissement parce que le certificat est autosigné, ce qui est normal en local.

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
https://localhost:3000/docs
```

Le document OpenAPI brut est disponible à `https://localhost:3000/openapi.json`. Swagger permet d'explorer et de tester chacun des points de terminaison (`Endroits`, `Appréciations`) directement depuis le navigateur.

## Contrat général de l'API

Toutes les réponses en erreur suivent le format **Problem Details** (`application/problem+json`). Les listes paginées (ex. `GET /places`) renvoient un objet avec `data`, le tableau des éléments de la page courante, et `pagination` (`page`, `limit`, `totalItems`, `totalPages`). Les identifiants sont préfixés par ressource (ex. `plc_a1b2c3d4` pour un lieu, `rev_a1b2c3d4` pour une critique). Le contrat HTTP du TP1 est conservé : le passage à MongoDB est un changement interne, donc les URI, les méthodes et les formats de réponse restent les mêmes, avec `id` et non `_id`.

## Principales validations

Les données reçues d'un client sont considérées comme non fiables. Un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) applique les règles des DTO :

| Ressource | Règles principales |
|---|---|
| Lieu (`POST /places`) | `name`, `description` (max 300), `category` (enum) et `address` obligatoires ; `services` (tableau de textes uniques) et `status` (enum) optionnels |
| Lieu (`PATCH /places/:id`) | Mêmes règles, tous les champs sont optionnels |
| Avis (`POST /reviews?placeId=`) | `authorName` obligatoire ; `rating` entier de 1 à 5 ; `comment` de 10 à 500 caractères |
| Liste (`GET /places`) | `category` dans l'enum ; `page` ≥ 1 ; `limit` de 1 à 100 |

Toute propriété inconnue ou interdite est refusée avec une erreur **400**. Les champs `id`, `createdAt`, `updatedAt`, `averageRating` et `reviewCount` sont gérés par le serveur, donc un client ne peut ni les envoyer ni les modifier.

## Sécurité HTTP

**CORS.** Seules les origines listées explicitement sont autorisées, avec les méthodes `GET`, `POST`, `PATCH` et `DELETE`. CORS indique au navigateur quels sites peuvent lire les réponses, mais ce n'est pas un mécanisme d'authentification et `curl` ou Postman n'y sont pas soumis.

**Helmet.** Helmet ajoute des en-têtes HTTP de sécurité (`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, etc.) et retire `X-Powered-By`. Il réduit certains risques côté navigateur, mais ne remplace ni la validation, ni l'authentification.

## HTTPS / TLS

**Rôle de HTTPS.** HTTPS est HTTP transporté dans un tunnel chiffré par TLS. Il garantit que quelqu'un d'autre sur le réseau ne peut pas lire les échanges, les messages ne peuvent pas être modifiés pendant le voyage sans être détectés et il y a un certificat qui prouve que l'on communique avec le bon serveur.

**Dans CampusRate (local).** L'API est servie en HTTPS avec un certificat autosigné (voir la section Configuration). Un second serveur HTTP écoute sur le port `3001` et redirige (301) toute requête vers l'adresse HTTPS correspondante. La destination est fixe (`https://localhost:<PORT>`) pour éviter une redirection ouverte.

## Limites connues

- Aucune authentification ni autorisation n'est actuellement implémentée : tous les points de terminaison sont ouverts.
- Le certificat HTTPS est autosigné : il convient uniquement au développement local, jamais à la production.
- Les certificats ne sont pas versionnés : il faut les générer avant le premier démarrage (sans eux, l'API ne démarre pas).

---