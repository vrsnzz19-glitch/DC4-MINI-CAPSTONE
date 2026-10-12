# ToneVault — Guitar Effects Pedalboard Rig Setup

ToneVault is a web application for guitarists to explore guitar effects pedals, arrange pedals into virtual pedalboards, and save guitar and amplifier settings as reusable rig presets. Administrators maintain the shared pedal catalog and review submitted presets.

## Developer

- **Developer:** Iverson Loquere
- **Course:** BSIT 3 – Section 2

## Client / Theme

ToneVault is designed for guitarists who want a convenient way to organize their effects collection and plan tones for practice, recording, or live performance. Its dark, music-inspired interface presents pedal and rig information in a focused workspace.

## Problem Statement

Guitarists may keep pedal inventories, signal-chain plans, amp settings, and tone notes in separate documents or rely on memory. This makes it difficult to keep setups organized, compare configurations, and retrieve a rig when preparing for a session or performance. A shared catalog also needs a controlled way to maintain consistent pedal and category information.

## Solution

ToneVault combines a searchable pedal catalog with personal pedalboards and rig presets in one application. A guitarist can create an ordered signal chain, record settings and notes, and submit a preset for review. Administrators manage the catalog and review submissions. Laravel exposes a JSON API, and the React single-page application consumes it.

## Features

### Guitarist

- Register and sign in with token-based authentication.
- Browse and filter the pedal catalog and its categories.
- View pedal and category details.
- Create and manage personal pedalboards.
- Add, remove, and order pedals on a board.
- Save per-pedal settings and notes.
- Create rig presets with optional pedalboard, guitar, tuning, amp settings, and description.
- Submit presets for administrator review and view their status.
- Use Gig Mode to view a saved pedalboard with interactive visual controls (Volume/Gain sliders, Footswitch toggles, animated fake EQ spectrum analyzer, and live stage atmosphere with audience silhouette). These controls are visual only and do not process audio.

### Administrator

- View the dashboard and catalog.
- Create, update, and delete pedals and categories.
- View presets across users.
- Approve submitted presets and archive presets.
- Use the same authenticated account features available to a guitarist.

## User Roles

| Role | Capabilities |
| --- | --- |
| **Guitarist** (`user`) | Manage their own pedalboards and rig presets, browse the catalog, and submit presets for review. |
| **Administrator** (`admin`) | Manage pedals and categories, review presets across users, and approve or archive presets. |

New public registrations are always assigned the `user` role. Role changes must be performed through trusted administrative or database operations; sending a role in a registration request does not grant administrator access.

## UI Wireframes & Design Architecture

The UI architecture transitioned from low-fidelity conceptual wireframes into a fully implemented, responsive React and CSS single-page application:

- **Auth Pages Wireframe**: Centered dark-themed authentication cards with user validation feedback.
- **Dashboard Wireframe**: Summary statistics cards (Pedals, Pedalboards, Rig Presets) alongside Quick Action buttons and a Recent Rig Presets status tracker.
- **Pedal Library Wireframe**: Responsive grid layout with instant search bar and category/type filter controls.
- **Pedalboard Builder Wireframe**: Dual-pane workspace allowing signal chain ordering, per-pedal volume/gain configuration, and saving directly to the user's vault.
- **Gig Mode POV Wireframe**: High-contrast stage view featuring interactive footswitch LEDs, parameter sliders, a bouncing live mix equalizer spectrum analyzer, and background crowd silhouettes.

## Technology Stack

The project brief names Laravel 11/12, React 18+, Vite, Tailwind CSS, and MySQL. **The current repository checkout uses:** PHP 8.3+ and Laravel 13, React 19, Vite 8, and custom project CSS for responsive dark-mode styling.

| Area | Technology |
| --- | --- |
| Backend | PHP 8.3+, Laravel 13, Laravel Sanctum |
| Frontend | React 19, Vite 8, React Router, Axios |
| Styling | Project CSS / Tailwind CSS |
| Database | MySQL or MariaDB |
| Testing | PHPUnit via Laravel's test runner |

## Architecture

```text
Browser
  └── React SPA (Vite)
        └── Axios JSON requests to /api
            └── Laravel API
                 ├── Sanctum bearer-token authentication
                 ├── API controllers, policies, and admin middleware
                 └── Eloquent models and MySQL/MariaDB
The frontend/ application renders the user interface and sends API requests to the backend.

The backend/ application owns validation, authentication, authorization, business rules, and persistence.

Public catalog routes allow unauthenticated browsing. Personal board and preset routes require a valid Sanctum bearer token. Catalog writes and category writes require administrator authorization.

The frontend API base address can be set with VITE_API_BASE_URL in frontend/.env. VITE_API_URL is also accepted as a compatibility fallback.

ERD Description
The database is organized around users, the shared pedal catalog, user-owned boards, and saved presets:

users stores account details and a role (user or admin). A user can own multiple pedalboards and rig presets.

pedal_categories stores unique catalog category names and descriptions. A category has many pedals.

pedals stores catalog details such as name, brand, model, type, price, status, and an optional category. Deleting a category that still has pedals is restricted.

pedalboards belongs to a user and stores a board name, description, and status.

pedalboard_pedals is the many-to-many join between pedalboards and pedals. It records each pedal's board position, settings, and notes. A pedal can appear on different boards; a pedal cannot occur twice on the same board, and positions are unique per board.

rig_presets belongs to a user and can optionally reference a pedalboard. It stores the preset name, description, JSON amp settings, guitar, tuning, and workflow status. If the linked board is deleted, the preset remains and its board reference is cleared.

personal_access_tokens stores Sanctum tokens for API authentication.

In relationship form:

Plaintext
users 1 ─── * pedalboards
users 1 ─── * rig_presets
pedal_categories 1 ─── * pedals
pedalboards * ─── * pedals       (through pedalboard_pedals)
pedalboards 1 ─── * rig_presets  (optional reference from each preset)
users 1 ─── * personal_access_tokens
Installation and Setup
Prerequisites
PHP 8.3 or later with the MySQL PDO extension (pdo_mysql) enabled

Composer

Node.js and npm (use a version supported by Vite 8)

MySQL or MariaDB

Git

The commands below use PowerShell from the repository root. Replace configuration values as needed for your local database.

1. Clone the repository
PowerShell
git clone [https://github.com/vrsnzz19-glitch/DC4-MINI-CAPSTONE.git](https://github.com/vrsnzz19-glitch/DC4-MINI-CAPSTONE.git)
Set-Location .\DC4-MINI-CAPSTONE
2. Install backend dependencies and configure Laravel
PowerShell
Set-Location .\backend
composer install
Copy-Item .env.example .env
php artisan key:generate
Edit backend/.env and configure the database. The example uses MySQL and a database named tonevault:

Code snippet
APP_NAME=ToneVault
APP_ENV=local
APP_DEBUG=true
APP_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tonevault
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
Create the tonevault database in MySQL/MariaDB before migrating, or use the provided Windows PowerShell helper from the repository root:

PowerShell
Set-Location ..
powershell -ExecutionPolicy Bypass -File .\scripts\setup-database.ps1
The helper creates the configured database when needed and runs migrations and the default seeder. If the database account requires a password, set it in the local, untracked backend/.env before running the helper.

To run the migration and default seed command directly, from backend/:

PowerShell
php artisan migrate --seed
The default DatabaseSeeder adds a small starter set of categories and pedals. To add the complete sample catalog, pedalboards, rig presets, and local demo accounts, run the dedicated seeder as well:

PowerShell
php artisan db:seed --class=ToneVaultSeeder
3. Install and configure the frontend
In a new terminal from the repository root:

PowerShell
Set-Location .\frontend
npm install
Copy-Item .env.example .env
Set the API URL in frontend/.env:

Code snippet
VITE_API_BASE_URL=http://localhost:8000/api
4. Start the development servers
In one terminal, from backend/:

PowerShell
php artisan serve --host=127.0.0.1 --port=8000
In a second terminal, from frontend/:

PowerShell
npm run dev -- --host localhost
Open the local URL printed by Vite, usually http://localhost:5173. The API is available at http://127.0.0.1:8000/api.

Demo Credentials
Running the ToneVaultSeeder creates these local development-only accounts:

Role	Email	Password
Guitarist	guitarist@tonevault.test	ToneVaultUser!2026
Administrator	admin@tonevault.test	ToneVaultAdmin!2026
Use guitarist@tonevault.test or admin@tonevault.test with the listed passwords, or create a new account via registration. Do not use seeded passwords outside local development environments.

API Information
All API routes are prefixed with /api and return JSON. Protected routes use a Sanctum bearer token obtained from login or registration:

HTTP
Authorization: Bearer <token>
Accept: application/json
Method	Endpoint	Access	Purpose
POST	/api/register	Public	Create a regular user and issue a token
POST	/api/login	Public	Authenticate and issue a token
GET	/api/pedals	Public	List/search/filter pedals
GET	/api/pedal-filters	Public	Get catalog filter values
GET	/api/pedals/{id}	Public	View a pedal
GET	/api/categories	Public	List categories
GET	/api/categories/{id}	Public	View a category
GET	/api/dashboard	Authenticated	Load dashboard counts and summary
GET, POST, PUT, DELETE	/api/pedalboards and /api/pedalboards/{id}	Authenticated	List and manage owned boards
POST, PUT, DELETE	/api/pedalboards/{id}/pedals[/{pedalId}]	Authenticated	Add, update, or remove pedals on a board
GET, POST, PUT, DELETE	/api/rig-presets and /api/rig-presets/{id}	Authenticated	List and manage accessible presets
POST	/api/rig-presets/{id}/submit	Owner	Submit a draft preset for review
POST	/api/rig-presets/{id}/approve	Administrator	Approve a submitted preset
POST	/api/rig-presets/{id}/archive	Administrator	Archive a preset
POST	/api/pedals	Administrator	Create a catalog pedal
PUT, DELETE	/api/pedals/{id}	Administrator	Update or delete a catalog pedal
POST	/api/categories	Administrator	Create a category
PUT, DELETE	/api/categories/{id}	Administrator	Update or delete a category
GET	/api/user	Authenticated	Get the current user
POST	/api/logout	Authenticated	Revoke the current token
See docs/API.md for request details and workflow notes.

Testing and Verification
Run backend tests from backend/:

PowerShell
php artisan test
The test suite uses an in-memory SQLite database as configured in backend/phpunit.xml.

Run frontend checks from frontend/:

PowerShell
npm run lint
npm run build
Limitations
ToneVault stores and displays pedalboard and rig configuration data. It does not process guitar audio, emulate effects, or connect to audio hardware.

Gig Mode is an interactive visual interface; pedal toggles and controls do not alter a real or simulated audio signal.

A database and running backend are needed for persistent application data and API-backed features.

REFERENCES


Laravel Official YouTube Channel. (2024–2026). Laravel Framework Tutorials and Release Guides [Video]. YouTube. https://www.youtube.com/@LaravelPHP

Programming with Mosh. (2023). React Tutorial for Beginners [Video]. YouTube. https://www.youtube.com/@programmingwithmosh

Traversy Media. (2024). Laravel & React Full Stack Crash Course [Video]. YouTube. https://www.youtube.com/@TraversyMedia

Google Search & Developer Documentation. Building SPA Authentication with Laravel Sanctum and React. Google Search / Web Development Guides. https://laravel.com/docs/sanctum

Google Search & Vite Documentation. Vite Frontend Tooling and Environment Variables. Google Search / Web Development Guides. https://vite.dev/