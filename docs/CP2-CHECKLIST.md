# CP2 Backend Checklist

## Authentication and catalog

- [x] Sanctum registration, login, current-user, and logout endpoints
- [x] Public pedal and category browsing
- [x] Pedal name/brand/model search and category/type/status filters
- [x] Paginated pedal listing with eager-loaded category
- [x] Admin-only pedal/category create, update, and delete
- [x] FormRequest validation and API Resources

## Pedalboards

- [x] Authenticated CRUD with owner-scoped access
- [x] Admin can view all pedalboards
- [x] Owner assignment is server-controlled
- [x] Add, remove, reorder, and edit pedalboard pedal relationship data
- [x] Store relationship settings and notes in `pedalboard_pedals`
- [x] Eager-load board owner, pedals, and pedal categories

## Rig presets

- [x] Authenticated CRUD with user-scoped reads and writes
- [x] `Draft`, `Submitted`, `Approved`, and `Archived` workflow
- [x] Users can submit their own presets; edits to approved/submitted presets require resubmission
- [x] Admin can view all presets and approve/archive them
- [x] Prevent owner from approving their own preset, including admin owners
- [x] Validate preset pedalboards against the authenticated owner
- [x] Eager-load owner, pedalboard, pedals, and categories

## Deliverables and verification

- [x] Realistic related seed data (29 pedals, categories, boards, board-pedal links, presets)
- [x] API reference in `docs/API.md`
- [x] This CP2 checklist
- [x] Postman collection for auth, pedals, categories, pedalboards, and rig presets
- [x] Feature tests for access control, CRUD, relationship management, and status transitions
- [ ] Import the Postman collection and run it against the configured local backend
- [ ] Confirm development seed credentials are changed or disabled before any non-local deployment
