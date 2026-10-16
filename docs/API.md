# ToneVault API

The API is served under `/api`. JSON validation failures return `422`, missing or invalid Sanctum authentication returns `401`, policy failures return `403`, unknown resource IDs return `404`, successful creates return `201`, successful reads/updates return `200`, and successful deletes return `204`.

All endpoint paths below are confirmed against `backend/routes/api.php`.

## Authentication

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| POST | `/api/register` | Public | Create a regular user and issue a bearer token. Registration always forces `role=user`; a submitted `admin` role is ignored. |
| POST | `/api/login` | Public | Authenticate and issue a bearer token. |
| GET | `/api/user` | Authenticated | Read the current authenticated user (includes `role`). |
| POST | `/api/logout` | Authenticated | Revoke the current Sanctum token. |

Send protected requests with `Authorization: Bearer <token>`. The API allows browser requests from the frontend origin configured by `FRONTEND_URL` (default `http://127.0.0.1:5173`) and `http://localhost:5173`. The React app defaults to `http://127.0.0.1:8000/api`; override it with `VITE_API_BASE_URL` when the API is hosted elsewhere. `VITE_API_URL` remains supported for existing local configurations.

## Pedals and Categories

Pedal and category reads are public. Create, update, and delete operations require an authenticated administrator.

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/api/pedals` | Public | Paginated pedals, eager-loaded category. Supports `search`, `category`, `type`, `status`, `page`. |
| GET | `/api/pedal-filters` | Public | Distinct catalog `types` and `statuses` for filter controls. |
| GET | `/api/pedals/{id}` | Public | Read a single pedal. |
| POST | `/api/pedals` | Admin | Create a pedal. |
| PUT | `/api/pedals/{id}` | Admin | Update a pedal. |
| DELETE | `/api/pedals/{id}` | Admin | Delete a pedal and its pedalboard links. |
| GET | `/api/categories` | Public | List categories with pedal count. |
| POST | `/api/categories` | Admin | Create a category. |
| GET | `/api/categories/{id}` | Public | Read a single category. |
| PUT | `/api/categories/{id}` | Admin | Update a category. |
| DELETE | `/api/categories/{id}` | Admin | Delete an empty category (categories with pedals return `422`). |

`search` matches pedal `name`, `brand`, or `model`. `category` accepts a category ID or exact category name. Categories containing pedals cannot be deleted and return `422`.

## Pedalboards

All pedalboard endpoints require Sanctum authentication. Users list, read, create, update, and delete their own boards. Administrators may list and read all boards, but may only change or delete boards they own. The owner is assigned from the authenticated user and cannot be overridden in request data.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/pedalboards` | Paginated boards; admin sees all, user sees own. |
| POST | `/api/pedalboards` | Create an owned board (`name`, optional `description`, optional ordered `pedals` ID array). |
| GET | `/api/pedalboards/{id}` | Read board with ordered pedals and owner. |
| PUT | `/api/pedalboards/{id}` | Update board name/description. |
| DELETE | `/api/pedalboards/{id}` | Delete owned board. |
| POST | `/api/pedalboards/{id}/pedals` | Add a pedal (`pedal_id`, optional `position`, `settings`, `notes`). |
| PUT | `/api/pedalboards/{id}/pedals/{pedalId}` | Update relationship `position`, `settings`, and/or `notes`. |
| DELETE | `/api/pedalboards/{id}/pedals/{pedalId}` | Remove a pedal and compact remaining positions. |

Pedal positions are one-based and contiguous. When creating a board, the optional `pedals` array attaches pedal IDs in the supplied order. Adding a pedal later inserts it at a position and shifts later pedals. Relationship data is stored in `pedalboard_pedals`.

## Rig Presets

All rig preset endpoints require Sanctum authentication. Users can list/read only their own presets and create, update, submit, or delete their own non-archived presets. A user-supplied `user_id` is ignored; presets are created for the authenticated user. A supplied pedalboard must belong to that user.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/rig-presets` | Paginated own presets; admins see all. |
| POST | `/api/rig-presets` | Create a `Draft` preset. |
| GET | `/api/rig-presets/{id}` | Read own preset; admin may read any. |
| PUT | `/api/rig-presets/{id}` | Update preset fields; editing a non-Draft preset returns it to `Draft`. |
| DELETE | `/api/rig-presets/{id}` | Delete own non-archived preset. |
| POST | `/api/rig-presets/{id}/submit` | Owner moves `Draft` to `Submitted`. |
| POST | `/api/rig-presets/{id}/approve` | Admin moves another user's `Submitted` preset to `Approved`. |
| POST | `/api/rig-presets/{id}/archive` | Admin moves a non-archived preset to `Archived`. |

The status workflow is `Draft → Submitted → Approved`; an administrator may archive any non-archived preset. Status cannot be set through create/update request bodies (`status` is `prohibited`). Even an administrator cannot approve a preset they own.

Preset fields: `name`, optional `pedalboard_id`, `description`, `amp_settings` (JSON object), `guitar`, and `tuning`. Responses eager-load the preset owner, pedalboard, pedals, and pedal categories.

## Dashboard

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/api/dashboard` | Authenticated | Return summary totals (`total_pedals`, `total_pedalboards`, `total_rig_presets`) and `submitted_rig_presets` for admins. Figures are user-scoped unless the caller is an admin. |

## Users (Admin)

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/api/users` | Admin | Paginated list of registered users. |
| GET | `/api/users/{id}` | Admin | Read a single user's profile. |

## Development Seed Data

Run `cd backend && php artisan migrate --seed`. The repeatable ToneVault seeder provides realistic pedals, categories, ordered pedalboard-pedal relationships, two pedalboards, and two related rig presets, along with development accounts:

- Admin: `admin@tonevault.test` / `ToneVaultAdmin!2026`
- User: `guitarist@tonevault.test` / `ToneVaultUser!2026`

Use only in a local development environment.
