# ToneVault — Guitar Effects Pedalboard Rig Setup

## 1. Project Title

**ToneVault — Guitar Effects Pedalboard Rig Setup**

ToneVault is a web application for finding guitar effects pedals, organizing them into pedalboards, saving reusable rig presets, and submitting presets for administrator review.

## 2. Developer Name

**Iverson Loquere (BSIT – Section 2)**

## 3. Theme Description

ToneVault focuses on guitar effects organization and practical tone planning for practice, recording, and gigs. Guitarists can keep pedal details, signal-chain order, amp settings, guitar, tuning, and rig notes together rather than relying on scattered notes or memory.

The interface uses a dark, stage-inspired visual theme. **Gig Mode POV** presents a saved pedalboard as a live stage rig, with a simulated EQ spectrum, audience backdrop, volume/gain sliders, and footswitch toggles. These are interactive visual controls only: ToneVault does not process audio or connect to physical pedal hardware.

## 4. Features List

### Guitarist

- Register and sign in using Laravel Sanctum token authentication.
- Browse the pedal catalog, search for pedals, filter results, and navigate paginated results.
- Build and save personal pedalboards with an ordered selection of catalog pedals.
- Manage board-specific pedal settings and notes.
- Create and manage rig presets with an optional pedalboard, guitar, tuning, amp settings, and description.
- Submit rig presets for administrator review and track their status.
- Open **Gig Mode POV** for a saved pedalboard, toggle its visual footswitches, and adjust local volume/gain sliders alongside a simulated EQ display and stage audience background.

### Administrator

- Create, update, and delete catalog pedals and pedal categories.
- View rig presets across users and review submitted presets.
- Approve or archive presets through the review workflow.

## 5. Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP 8.3+, Laravel 13, Laravel Sanctum |
| Frontend | React 19, Vite 8 |
| Database | MySQL |

The React application communicates with the Laravel JSON API. The current frontend uses project CSS for styling.

## 6. Setup Steps

### Prerequisites

- PHP 8.3 or later with the required Laravel extensions, including `pdo_mysql`
- Composer
- Node.js and npm compatible with Vite 8
- MySQL server

Create a MySQL database named `tonevault` (or choose another database name and update the backend `.env` accordingly). The commands below assume PowerShell from the repository root.

### Configure and migrate the backend

```powershell
Set-Location .\backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Edit `backend/.env` and set the database connection details. For a local MySQL installation, configure `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. Then run the requested migration and default seed command:

```powershell
php artisan migrate --seed
```

To create the guitarist and administrator demo accounts and the full ToneVault sample catalog, run the dedicated project seeder:

```powershell
php artisan db:seed --class=ToneVaultSeeder
```

Start the Laravel API in this terminal:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### Configure and run the frontend

In a second PowerShell terminal, from the repository root:

```powershell
Set-Location .\frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The provided frontend environment file points the app to `http://localhost:8000/api`. Open the local Vite URL printed in the terminal, usually `http://localhost:5173`.

## 7. Demo Account Credentials

Run `php artisan db:seed --class=ToneVaultSeeder` from `backend/` to create or refresh these local development accounts.

| Role | Email | Password |
| --- | --- | --- |
| Guitarist | `guitarist@tonevault.test` | `ToneVaultUser!2026` |
| Administrator | `admin@tonevault.test` | `ToneVaultAdmin!2026` |

These credentials are for local demonstrations only. Do not use them in a deployed or production environment.

## 8. References

### YouTube tutorials

- Traversy Media. [Laravel PHP Framework Tutorial — Full Course for Beginners (2019)](https://www.youtube.com/watch?v=ImtZ5yENzgE).
- Programming with Mosh. [React Tutorial for Beginners](https://www.youtube.com/watch?v=SqcY0GlETPk).

### Official documentation

- [PHP Manual](https://www.php.net/manual/en/)
- [Laravel 13 Documentation](https://laravel.com/docs/13.x)
- [Laravel Sanctum Documentation](https://laravel.com/docs/13.x/sanctum)
- [React Documentation — Quick Start](https://react.dev/learn)
- [Vite Guide](https://vite.dev/guide/)
- [MySQL Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
