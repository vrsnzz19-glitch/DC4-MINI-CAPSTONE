# ToneVault Nine-Feature Requirement Matrix

This matrix maps each requirement in the submitted project proposal to the
actual implementation. The source of truth is the code in `backend/`
and `frontend/`. No feature is claimed as working unless its implementation
was verified.

## 1. Authentication

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Registration | `POST /api/register` creates a user and issues a Sanctum bearer token. Registration always forces `role=user`; an submitted `admin` role is ignored. | `backend/app/Http/Controllers/Api/AuthController.php:16-28`, `backend/app/Http/Requests/Auth/RegisterRequest.php`, `backend/database/migrations/0001_01_01_000000_create_users_table.php` | `AuthApiTest::test_registration_creates_a_normal_user_and_returns_a_token` — verifies token, role forced to `user`, no password in response |
| Login | `POST /api/login` validates credentials and returns a bearer token and user profile. Invalid credentials return `401`. | `AuthController.php:30-49`, `backend/app/Http/Requests/Auth/LoginRequest.php` | `AuthApiTest::test_login_returns_a_token_and_invalid_credentials_return_unauthorized` |
| Logout | `POST /api/logout` revokes the current token. Frontend removes token from localStorage on 401. | `AuthController.php:51-58`, `frontend/src/services/apiClient.js:22-32` | `AuthApiTest::test_authenticated_user_can_view_profile_and_revoke_current_token` |
| Role-based access | `auth:sanctum` middleware on protected routes; `admin` middleware on admin routes; Gate policies for ownership. | `backend/routes/api.php`, `backend/app/Http/Middleware/EnsureUserIsAdmin.php`, `backend/app/Policies/PedalboardPolicy.php`, `backend/app/Policies/RigPresetPolicy.php` | `AuthApiTest::test_admin_middleware_allows_admins_and_forbids_regular_users` |

## 2. Roles and Authorization

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Two roles (`user`, `admin`) | `users.role` column, default `user`. Registration cannot grant `admin`. | `backend/app/Models/User.php`, `backend/app/Http/Controllers/Api/AuthController.php:19` | `AuthApiTest` confirms registration rejects `admin` input |
| Admin-only catalog writes | `['auth:sanctum', 'admin']` middleware group on pedal/category create/update/delete. | `backend/routes/api.php:34-41` | `PedalCatalogApiTest::test_pedal_writes_require_admin_and_validate_input` |
| Owner-scoped boards/presets | Policies restrict board/preset access to owner; admins may view all but only edit/delete own boards. | `backend/app/Policies/PedalboardPolicy.php`, `RigPresetPolicy.php` | `PedalboardAndRigPresetApiTest` ownership tests |
| Frontend route guards | `ProtectedRoute` (auth), `AdminRoute` (role) in React Router. | `frontend/src/components/ProtectedRoute.jsx`, `frontend/src/App.jsx` | Lint/build pass; no unauthenticated access to protected pages |

## 3. Pedal/Category Management

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Public pedal browsing | `GET /api/pedals` public, eager-loads category. | `backend/app/Http/Controllers/Api/PedalController.php:18-45` | `PedalCatalogApiTest::test_pedals_are_publicly_searchable_filterable_and_paginated_with_categories` |
| Admin pedal CRUD | `POST/PUT/DELETE /api/pedals` under `admin` middleware. | `PedalController.php:69-93`, `routes/api.php:35-37` | `PedalCatalogApiTest::test_admin_can_create_read_update_and_delete_pedals` |
| Pedal categories | `GET/POST/PUT/DELETE /api/categories`; categories with pedals cannot be deleted. | `backend/app/Http/Controllers/Api/PedalCategoryController.php` | `PedalCatalogApiTest::test_categories_can_be_browsed_and_administered` |
| Frontend admin catalog | `AdminPedalsPage`, `AdminCategoriesPage` with create/edit/delete modals and confirmation. | `frontend/src/pages/AdminCatalogPages.jsx` | Lint/build pass |

## 4. Pedalboard CRUD and Many-to-Many Relationships

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Pedalboard CRUD | `apiResource('pedalboards')` — index, store, show, update, destroy. Owner-scoped. | `backend/app/Http/Controllers/Api/PedalboardController.php:21-85`, `routes/api.php:23-24` | `PedalboardAndRigPresetApiTest::test_users_can_crud_only_their_own_pedalboards` |
| Many-to-many via pivot | `pedalboard_pedals` table with `pedalboard_id`, `pedal_id`, `position`, `settings` (JSON), `notes`. `PedalboardPedal` pivot model. | `backend/database/migrations/2026_10_07_115249_create_pedalboard_pedals_table.php`, `backend/app/Models/PedalboardPedal.php`, `Pedalboard.php:46-53` | `PedalboardAndRigPresetApiTest::test_pedalboard_pedals_can_be_added_reordered_updated_and_removed` |
| No partial board on invalid pedal | `pedals.*` validated with `exists:pedals,id`; transaction wraps creation. | `backend/app/Http/Requests/Pedalboards/StorePedalboardRequest.php`, `PedalboardController.php:45-58` | `PedalboardAndRigPresetApiTest::test_pedalboard_creation_rejects_invalid_pedal_ids_without_creating_a_partial_board` |

## 5. Pedal Order, Settings, and Notes

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Ordered signal chain | `position` column on pivot; `reorderPedals()` rebuilds contiguous one-based positions in a transaction. | `PedalboardController.php:178-191`, `migration:position` | `PedalboardAndRigPresetApiTest` reorder assertions (`pivot.position` = 1, 2) |
| Board-specific settings | `settings` JSON on pivot; updatable via `PUT /pedalboards/{id}/pedals/{pedalId}`. | `PedalboardController.php:119-157`, `migration:settings` | `PedalboardAndRigPresetApiTest` settings/notes assertions |
| Board-specific notes | `notes` text on pivot; updatable alongside settings/position. | `PedalboardController.php:119-157`, `migration:notes` | Same test as above |

## 6. Rig Presets and Status Workflow

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Rig preset CRUD | `apiResource('rig-presets')` plus `submit`, `approve`, `archive` actions. | `backend/app/Http/Controllers/Api/RigPresetController.php`, `routes/api.php:28-32` | `PedalboardAndRigPresetApiTest` preset CRUD tests |
| Draft → Submitted → Approved/Archived | Controller sets `Draft` on create; `submit` → `Submitted`; `approve` → `Approved`; `archive` → `Archived`. | `RigPresetController.php:39-42, 78-100`, `RigPresetPolicy.php:35-50` | `PedalboardAndRigPresetApiTest::test_users_own_preset_crud_and_submit_while_admin_approves_and_archives` |
| Only admin approves/archives | Policy requires `role === admin` and not owner for approve; admin for archive. | `RigPresetPolicy.php:40-50` | `test_preset_approval_is_admin_only_and_never_allowed_for_the_owner` |
| Owner submits own drafts | Policy requires owner + `Draft` status for submit. | `RigPresetPolicy.php:35-38` | Same preset workflow test |
| Status cannot be injected | `status` is `prohibited` in `StoreRigPresetRequest` and `UpdateRigPresetRequest`. | `backend/app/Http/Requests/RigPresets/StoreRigPresetRequest.php:32`, `UpdateRigPresetRequest.php:32` | `test_pedalboard...` status injection test (`assertJsonValidationErrors('status')`) |
| Edits return non-Draft to Draft | Controller resets `status` to `Draft` when editing a non-Draft preset. | `RigPresetController.php:61-63` | `test_users_own_preset_crud...` (edits after approve return to `Draft`) |

## 7. Search, Filtering, and Pagination

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Pedal search | `search` matches `name`, `brand`, `model`. | `PedalController.php:23-28` | `PedalCatalogApiTest` search assertions |
| Category/type/status filters | `when()` clauses on category (ID or name), type, status. | `PedalController.php:30-40` | `PedalCatalogApiTest` filter assertions |
| Distinct filter options | `GET /api/pedal-filters` returns distinct `types` and `statuses`. | `PedalController.php:47-62` | `test_pedal_filter_options_are_distinct_and_public` |
| Pagination | `->paginate()` on all list endpoints; `meta.current_page`, `meta.last_page`, `meta.total` returned. | `PedalController.php:42`, `DashboardController.php`, `RigPresetController.php:20,30`, `PedalboardController.php:32` | `PedalCatalogApiTest` page 2 assertions |
| Frontend pagination | `Pagination` component with Previous/Next, disabled at boundaries; resets to page 1 on search/filter change. | `frontend/src/components/ui.jsx:67-70`, `frontend/src/pages/PedalLibraryPage.jsx`, `RigPresetsPage.jsx:339-411` | Lint/build pass |

## 8. Dashboard and GigView

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Dashboard totals | `GET /api/dashboard` returns `total_pedals`, `total_pedalboards`, `total_rig_presets` (user-scoped; all for admin) and `submitted_rig_presets` (admin only). | `backend/app/Http/Controllers/Api/DashboardController.php`, `routes/api.php:21` | `DashboardApiTest::test_dashboard_statistics_are_authenticated_and_scoped_to_the_signed_in_user` |
| Admin dashboard shortcuts | Nav cards to Manage pedals, Manage categories, Review rig presets. | `frontend/src/pages/StudioPages.jsx:89-113` | Lint/build pass |
| GigView preserved | `GigMode.jsx` loads a saved board, renders staged live view, animated EQ visualizer, crowd backdrop, footswitch toggles, volume/gain sliders. | `frontend/src/pages/GigMode.jsx`, `frontend/src/App.jsx:82` | `FINAL-AUDIT.md` — Gig Mode PASS — visual controls |

## 9. Validation, Delete Confirmation, Responsive UI, Preset Review

| Requirement | Actual Implementation | Relevant Files | Testing Evidence |
|-------------|----------------------|----------------|------------------|
| Form validation | Laravel FormRequests on all write endpoints; React client-side validation in forms. | `backend/app/Http/Requests/`, `frontend/src/pages/StudioPages.jsx` (auth forms) | `PedalCatalogApiTest::test_pedal_writes_require_admin_and_validate_input` |
| Delete confirmation | `ConfirmModal` component used for pedal, category, preset deletion. | `frontend/src/components/ui.jsx:57-59`, `AdminCatalogPages.jsx`, `RigPresetsPage.jsx:239` | Lint/build pass |
| Error messages | `ErrorMessage`/`SuccessMessage` components; field-level validation errors; 401/403 handling. | `frontend/src/components/ui.jsx:45-51`, `apiClient.js` 401 interceptor | Lint/build pass |
| Responsive UI | CSS layouts in `App.css`/`index.css` for desktop/tablet/mobile. | `frontend/src/App.css`, `frontend/src/index.css` | Lint/build pass |
| Preset review | Admin review queue lists submitted presets with owner, pedalboard, guitar, tuning, status; approve/archive actions. | `frontend/src/pages/RigPresetsPage.jsx:339-415` | `PedalboardAndRigPresetApiTest` admin approve/archive tests |
