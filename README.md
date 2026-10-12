# ToneVault — Guitar Rig & Pedalboard Management System

ToneVault is a decoupled web application with a React single-page frontend and a Laravel REST API backed by MySQL. Guitarists can browse a catalog of effects pedals, assemble ordered pedalboards, save reusable rig presets, and submit rigs for administrator review. Administrators maintain the pedal catalog, manage categories, and review submitted rig presets.

**GigView** (Gig Mode POV) is preserved as a live-performance simulation view for a saved pedalboard, with animated EQ visualizer, footswitch toggles, and volume/gain controls. It is a visual/session-only simulation — ToneVault does not process audio or connect to physical pedal hardware.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.3+, Laravel 13, Laravel Sanctum |
| Frontend | React 19, Vite 8, React Router, Axios |
| Database | MySQL / MariaDB |
| Authentication | Laravel Sanctum bearer tokens |
| Styling | Project CSS (dark, stage-inspired theme) |

## Prerequisites

- PHP 8.3 or later with required Laravel extensions, including `pdo_mysql`
- Composer
- Node.js and npm compatible with Vite 8
- MySQL server

## Setup

### 1. Clone and configure the backend

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Edit `backend/.env` and set the database connection details (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`). The default database name is `tonevault`.

### 2. Run migrations and seeders

```powershell
php artisan migrate
```

To create the demo accounts and the full ToneVault sample catalog:

```powershell
php artisan db:seed --class=ToneVaultSeeder
```

### 3. Start the backend API

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### 4. Configure and run the frontend

In a second terminal, from the repository root:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000/api`. Override with `VITE_API_BASE_URL` if the API is hosted elsewhere. Open the local Vite URL printed in the terminal, usually `http://localhost:5173`.

## Demo Account Credentials

Run `php artisan db:seed --class=ToneVaultSeeder` from `backend/` to create or refresh these local development accounts:

| Role | Email | Password |
|------|-------|----------|
| Guitarist | `guitarist@tonevault.test` | `ToneVaultUser!2026` |
| Administrator | `admin@tonevault.test` | `ToneVaultAdmin!2026` |

These credentials come from `backend/database/seeders/ToneVaultSeeder.php` and are for local demonstrations only. Do not use them in a deployed or production environment.

## Available Features

### Guitarist
- Register and sign in using Laravel Sanctum token authentication (registration always creates a `user` role; admin cannot be self-assigned).
- Browse the pedal catalog, search by name/brand/model, filter by category/type/status, and navigate paginated results.
- Build and save personal pedalboards with an ordered selection of catalog pedals.
- Manage board-specific pedal settings and notes.
- Create and manage rig presets with optional pedalboard, guitar, tuning, amp settings, and description.
- Submit rig presets for administrator review and track status (`Draft → Submitted → Approved/Archived`).
- Open **Gig Mode POV** for a saved pedalboard; toggle visual footswitches and adjust local volume/gain sliders alongside a simulated EQ display and stage audience background.

### Administrator
- Create, update, and delete catalog pedals and pedal categories.
- View registered users (paginated).
- View all rig presets and review submitted presets.
- Approve or archive presets through the review workflow.
- View dashboard statistics scoped across all users.

## API

All API endpoints are served under `/api` and exchange JSON. Protected endpoints require a `Authorization: Bearer <token>` header issued by Laravel Sanctum.

See `docs/API.md` for the complete endpoint reference confirmed against `backend/routes/api.php`.

## Project Limitations

- Gig Mode controls (spectrum, audience, sliders, footswitches) are simulated visual/session controls. They do not capture or process live audio, and their settings are not persisted as pedal audio parameters.
- A manual interactive browser end-to-end test was not performed as part of this documentation update. Backend feature tests, frontend lint, and frontend build all pass.
- The application is planned for a local music group. Features such as payments, public social networking, marketplace listings, and integrations with physical pedal hardware are outside scope.

## Testing

Backend tests:

```powershell
cd backend
php artisan test
```

Result: **22 tests passed, 217 assertions**.

Frontend lint and build:

```powershell
cd frontend
npm run lint
npm run build
```

Result: Both pass with no errors.

## References

- `docs/PROJECT_PROPOSAL.md` — Submitted project proposal (client placeholder included).
- `docs/FEATURE_MATRIX.md` — Nine-feature requirement matrix mapped to actual implementation.
- `docs/PRESET_WORKFLOW.md` — Draft → Submitted → Approved or Archived workflow.
- `docs/API.md` — API endpoint reference confirmed against route definitions.
- `docs/ERD.md` — Database design matching actual migrations.
- `docs/ARCHITECTURE.md` — System architecture.
- `docs/CP2-CHECKLIST.md` / `docs/CP3-CHECKLIST.md` — Implementation checklists.
- `FINAL-AUDIT.md` — Independent audit summary.
