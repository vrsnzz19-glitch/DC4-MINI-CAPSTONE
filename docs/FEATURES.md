# ToneVault Feature Scope

## Roles and permissions

| Capability | Guest | Guitarist | Admin |
| --- | --- | --- | --- |
| Register and sign in | Yes | Yes | Yes |
| Browse, search, and filter pedals | No | Yes | Yes |
| Create and manage own pedalboards | No | Yes | No |
| Add, remove, and arrange board pedals | No | Yes | No |
| Create and manage own rig presets | No | Yes | Yes |
| Submit a rig and view its status | No | Yes | Yes |
| Manage pedal categories and pedals | No | No | Yes |
| View registered users | No | No | Yes |
| Review submissions and change rig status | No | No | Yes |

Registration must always create a guitarist account; clients must not be able
to grant themselves the admin role. Admin-only authorization is enforced by the
API, not just by hiding frontend links.

## Authentication and access

- Register and log in using Laravel Sanctum token authentication.
- Log out by revoking the current token.
- Return the authenticated user's profile and role.
- Protect authenticated routes and provide admin-only authorization.
- Return clear unauthorized and forbidden API responses.

## Pedal catalog

- Admin CRUD for pedals and pedal categories.
- Authenticated catalog browsing for guitarists and admins.
- Search by pedal name or brand; filter by category and other supported catalog
  fields.
- Paginate catalog responses.

## Pedalboards

- Create, view, edit, and delete a user's own pedalboards.
- Add and remove catalog pedals from a board.
- Store an explicit position for each board pedal and support rearranging that
  order.
- Keep board-specific settings with the board-to-pedal association.
- Prevent a guitarist from modifying another user's board.

## Rig presets and approval

- Create, view, edit, and delete a user's own rig presets.
- Save a reusable rig configuration and optionally associate it with a
  pedalboard.
- Submit a rig for admin review and display its current status to its owner.
- Allow admins to review submissions and set a supported status.
- Proposed statuses: `draft`, `pending`, `approved`, and `rejected`.
- Proposed flow: a guitarist saves or edits a draft, submits it as `pending`,
  and an admin changes it to `approved` or `rejected`. A rejected rig can be
  edited and submitted again.
- A guitarist cannot set the approval status directly; only the admin review
  action may change a submitted rig's status.

## Dashboard

- Provide summary figures for the signed-in user's pedalboards, rig presets,
  and rig statuses.
- Provide admins with catalog/user totals and counts of rigs awaiting review.
- Scope summary figures to the current user unless the caller is an admin.

## User experience and validation

- React-side validation for timely form feedback.
- Laravel FormRequest validation as the authoritative API validation.
- Visible loading states for asynchronous operations.
- Clear success and error messages.
- Confirmation before destructive deletes.
- Responsive layouts for desktop and mobile screen sizes.

## Delivery boundaries

The feature list is the target application scope, not a claim that these
features already exist. Day 1 prepares planning documents and confirms the
existing directory structure only.
