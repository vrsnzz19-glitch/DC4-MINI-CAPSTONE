# ToneVault API

The API is served under `/api`. JSON validation failures return `422`, missing or invalid Sanctum authentication returns `401`, policy failures return `403`, unknown resource IDs return `404`, successful creates return `201`, successful reads/updates return `200`, and successful deletes return `204`.

## Authentication

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/register` | Public | Create a regular user and issue a bearer token |
| POST | `/api/login` | Public | Authenticate and issue a bearer token |
| GET | `/api/user` | Authenticated | Read the current user |
| POST | `/api/logout` | Authenticated | Revoke the current token |

Send protected requests with `Authorization: Bearer <token>`. Public registration always creates a regular user; it cannot grant admin access.

The API allows browser requests from the frontend origin configured by `FRONTEND_URL` (default `http://127.0.0.1:5173`) and `http://localhost:5173`. The React app defaults to `http://127.0.0.1:8000/api`; override it with `VITE_API_URL` when the API is hosted elsewhere.

## Pedals and categories

Pedal and category reads are public. Create, update, and delete operations require an authenticated administrator.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/pedals?search=&category=&type=&status=&page=` | Paginated pedals, eager-loaded category |
| GET | `/api/pedal-filters` | Distinct catalog `types` and `statuses` for filter controls |
| POST | `/api/pedals` | Create pedal |
| GET | `/api/pedals/{id}` | Read pedal |
| PUT | `/api/pedals/{id}` | Update pedal |
| DELETE | `/api/pedals/{id}` | Delete pedal and its pedalboard links |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| GET | `/api/categories/{id}` | Read category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete an empty category |

`search` matches pedal name, brand, or model. `category` accepts a category ID or exact category name. Categories containing pedals cannot be deleted and return `422`.

## Pedalboards

All pedalboard endpoints require Sanctum authentication. Users list, read, create, update, and delete their own boards. Administrators may list and read all boards, but may only change or delete boards they own. The owner is assigned from the authenticated user and cannot be overridden in request data.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/pedalboards` | Paginated boards; admin sees all, user sees own |
| POST | `/api/pedalboards` | Create an owned board (`name`, optional `description`) |
| GET | `/api/pedalboards/{id}` | Read board with ordered pedals and owner |
| PUT | `/api/pedalboards/{id}` | Update board name/description |
| DELETE | `/api/pedalboards/{id}` | Delete owned board; linked presets are detached by the database |
| POST | `/api/pedalboards/{id}/pedals` | Add a pedal (`pedal_id`, optional `position`, `settings`, `notes`) |
| PUT | `/api/pedalboards/{id}/pedals/{pedalId}` | Update relationship `position`, `settings`, and/or `notes` |
| DELETE | `/api/pedalboards/{id}/pedals/{pedalId}` | Remove a pedal and compact remaining positions |

Pedal positions are one-based and contiguous. Adding at a position inserts the pedal there and shifts later pedals. The relationship data is stored in `pedalboard_pedals`.

## Rig presets

All rig preset endpoints require Sanctum authentication. Users can list/read only their own presets and create, update, submit, or delete their own non-archived presets. A user-supplied `user_id` is ignored; presets are created for the authenticated user. A supplied pedalboard must belong to that user.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/rig-presets` | Paginated own presets; admins see all |
| POST | `/api/rig-presets` | Create a `Draft` preset |
| GET | `/api/rig-presets/{id}` | Read own preset; admin may read any |
| PUT | `/api/rig-presets/{id}` | Update preset fields; editing a non-Draft preset returns it to `Draft` |
| DELETE | `/api/rig-presets/{id}` | Delete own non-archived preset |
| POST | `/api/rig-presets/{id}/submit` | Owner moves `Draft` to `Submitted` |
| POST | `/api/rig-presets/{id}/approve` | Admin moves another user's `Submitted` preset to `Approved` |
| POST | `/api/rig-presets/{id}/archive` | Admin moves a non-archived preset to `Archived` |

The status workflow is `Draft` → `Submitted` → `Approved`; an administrator may archive any non-archived preset. Status cannot be set through create/update request bodies. Even an administrator cannot approve a preset they own.

Preset fields: `name`, optional `pedalboard_id`, `description`, `amp_settings` (JSON object), `guitar`, and `tuning`. Responses eager-load the preset owner, pedalboard, pedals, and pedal categories.

## Development seed data

Run `cd backend && php artisan migrate --seed`. The repeatable ToneVault seeder provides 29 realistic pedals, categories, ordered pedalboard-pedal relationships, two pedalboards, and two related rig presets, along with development accounts:

- Admin: `admin@tonevault.test` / `ToneVaultAdmin!2026`
- User: `guitarist@tonevault.test` / `ToneVaultUser!2026`

Use only in a local development environment.

## Postman

Import [ToneVault.postman_collection.json](./ToneVault.postman_collection.json). Set `baseUrl` to `http://localhost:8000`; run the login request to populate the bearer-token variable before protected requests. Replace the example resource IDs with IDs returned by your API.
