# ToneVault Architecture

## System overview

The frontend and backend are separate applications. The browser-based React
single-page application calls a Laravel REST API using Axios. Laravel uses
Eloquent to read and write application data in MySQL.

```text
┌──────────────────────┐
│ React SPA            │
│ React Router         │
│ Axios                │
└──────────┬───────────┘
           │ HTTPS/HTTP JSON requests
           │ Sanctum bearer token for protected routes
           ▼
┌──────────────────────┐
│ Laravel REST API     │
│ FormRequest          │
│ Sanctum + policies   │
│ Eloquent ORM         │
└──────────┬───────────┘
           │ SQL
           ▼
┌──────────────────────┐
│ MySQL                │
└──────────────────────┘
```

## Technology baseline

The requested implementation baseline is:

- **Backend:** Laravel 11 or 12, PHP 8.2+, Laravel Sanctum.
- **Database:** MySQL.
- **Frontend:** React 18+, Vite, React Router, Axios.
- **Integration:** JSON REST API; the frontend and backend are independently
  developed and run.

**Existing scaffold note:** at planning time, `backend/composer.json` specifies
Laravel 13 and PHP `^8.3`; `frontend/package.json` specifies React 19. Day 1
does not alter either manifest. Confirm the intended versions before
implementation so the actual project baseline matches the assignment.

## Responsibilities and request flow

1. React Router selects a page. Pages call frontend API helpers through Axios.
2. Axios sends JSON and, for protected requests, the current Sanctum API token
   using the `Authorization: Bearer ...` header.
3. Laravel routes dispatch to controllers. FormRequests validate input, while
   Sanctum authentication and authorization rules protect operations.
4. Controllers use Eloquent models and relationships to apply changes to MySQL
   and return JSON, including pagination metadata where applicable.
5. The frontend presents loading, success, error, and validation feedback.

The API is the authority for input validation, identity, role checks, and
resource ownership. Hiding a page or button in React is not authorization.

## Proposed data model

| Entity | Important fields and relationships |
| --- | --- |
| `users` | `id`, `name`, `email`, `password`, `role` (`admin` or `guitarist`); has many pedalboards and rig presets. |
| `pedal_categories` | `id`, `name`, optional `description`; has many pedals. |
| `pedals` | `id`, `pedal_category_id`, `name`, `brand`, optional description/type; belongs to a category. |
| `pedalboards` | `id`, `user_id`, `name`, optional description; belongs to a user and has many pedals through the pivot. |
| `pedalboard_pedals` | `pedalboard_id`, `pedal_id`, `position`, optional board-specific `settings`; associates pedals with boards in an explicit order. |
| `rig_presets` | `id`, `user_id`, optional `pedalboard_id`, `name`, optional description/configuration, `status`; belongs to a user and may refer to a board. |

Use foreign keys for relationships and appropriate uniqueness constraints for
category names and pedalboard/pedal associations. The exact optional catalog
and configuration fields can be finalized while designing migrations.

## Authorization principles

- Public registration assigns the guitarist role on the server.
- Authenticated users can browse the pedal catalog.
- Only admins create, update, or delete categories and pedals.
- Guitarists can create and modify only their own boards and rig presets.
- Admin review endpoints are admin-only; guitarist rig submission is
  owner-only.
- The API validates IDs and ownership before attaching pedals or changing a
  resource.

## Proposed REST API

All endpoints use the `/api` prefix and exchange JSON. Protected endpoints
require a valid Sanctum bearer token. List endpoints should support
`page`/`per_page` and return Laravel pagination metadata. Search and filter
parameters are noted below. The API should use standard HTTP status codes and
consistent validation/error response shapes.

### Authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/register` | Guest | Create a guitarist account. |
| `POST` | `/api/login` | Guest | Authenticate and return a token and user profile. |
| `POST` | `/api/logout` | Authenticated | Revoke the current token. |
| `GET` | `/api/user` | Authenticated | Return the current user and role. |

### Dashboard

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/dashboard/summary` | Authenticated | Return role-appropriate summary counts. |

### Categories

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/pedal-categories` | Authenticated | List categories for catalog filters. |
| `POST` | `/api/pedal-categories` | Admin | Create a category. |
| `GET` | `/api/pedal-categories/{category}` | Authenticated | View a category. |
| `PUT` / `PATCH` | `/api/pedal-categories/{category}` | Admin | Update a category. |
| `DELETE` | `/api/pedal-categories/{category}` | Admin | Delete a category when permitted by its pedal relationships. |

### Pedals

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/pedals` | Authenticated | Browse pedals; supports `search`, `category_id`, `brand`, `page`, and `per_page`. |
| `POST` | `/api/pedals` | Admin | Create a pedal. |
| `GET` | `/api/pedals/{pedal}` | Authenticated | View a pedal. |
| `PUT` / `PATCH` | `/api/pedals/{pedal}` | Admin | Update a pedal. |
| `DELETE` | `/api/pedals/{pedal}` | Admin | Delete a pedal when permitted by its board relationships. |

### Pedalboards and their pedals

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/pedalboards` | Authenticated | List the current user's boards. |
| `POST` | `/api/pedalboards` | Authenticated | Create a board for the current user. |
| `GET` | `/api/pedalboards/{pedalboard}` | Owner | View a board and its ordered pedals. |
| `PUT` / `PATCH` | `/api/pedalboards/{pedalboard}` | Owner | Update board details. |
| `DELETE` | `/api/pedalboards/{pedalboard}` | Owner | Delete a board. |
| `POST` | `/api/pedalboards/{pedalboard}/pedals` | Owner | Add a pedal with its position/settings. |
| `PUT` | `/api/pedalboards/{pedalboard}/pedals` | Owner | Replace/reorder the board's pedal list. |
| `DELETE` | `/api/pedalboards/{pedalboard}/pedals/{pedal}` | Owner | Remove a pedal from the board. |

### Rig presets and review

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/rig-presets` | Authenticated | List the current user's rigs; admins may filter and review all. |
| `POST` | `/api/rig-presets` | Authenticated | Create a draft rig preset for the current user. |
| `GET` | `/api/rig-presets/{rigPreset}` | Owner or admin | View a rig preset and status. |
| `PUT` / `PATCH` | `/api/rig-presets/{rigPreset}` | Owner or admin | Update allowed rig details; ownership and status rules apply. |
| `DELETE` | `/api/rig-presets/{rigPreset}` | Owner or admin | Delete a rig preset, subject to workflow rules. |
| `POST` | `/api/rig-presets/{rigPreset}/submit` | Owner | Submit an eligible rig for approval. |
| `PATCH` | `/api/rig-presets/{rigPreset}/status` | Admin | Approve or reject a submitted rig. |

### Users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users` | Admin | List registered users with pagination. |
| `GET` | `/api/users/{user}` | Admin | View a user's basic profile. |

## Suggested application layout

```text
backend/
├── app/Http/Controllers/Api/  # REST controllers
├── app/Http/Requests/         # FormRequest validation
├── app/Models/                # Eloquent models and relationships
├── routes/api.php             # API route definitions
└── database/migrations/       # MySQL schema

frontend/
├── src/api/                   # Axios client and endpoint helpers
├── src/components/            # Shared UI
├── src/pages/                 # Routed screens
├── src/context/               # Authentication/session state
└── src/                       # App entry and styles
```

This is a proposed organization, not a request to create these application
files during Day 1.
