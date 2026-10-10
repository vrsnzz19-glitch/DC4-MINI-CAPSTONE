# CP3 End-to-End Checklist

Run against the configured Laravel API and frontend using two accounts: a normal guitarist account and an administrator account. Use catalog and account data created in this environment; the checks below do not depend on preview-only presets or pedalboards.

## Guitarist workflow

- [ ] Register a guitarist account with a unique email and valid password.
- [ ] Log in as that guitarist and confirm the dashboard opens.
- [ ] Browse the pedal library.
- [ ] Search the catalog by pedal name, brand, or model.
- [ ] Apply category, type, and status filters; clear the filters and confirm the catalog resets.
- [ ] Use the pedal-library pagination controls and confirm the page and results change.
- [ ] Open **Pedalboards** and create a pedalboard with a name and optional description.
- [ ] Open the board builder and add pedals from the live catalog.
- [ ] Move pedals up and down; verify the displayed signal-chain order changes.
- [ ] Edit a pedal's settings and notes; save and verify the values remain on the board.
- [ ] Remove a pedal and verify it disappears from the chain.
- [ ] Change the board name or description and save the board details.
- [ ] Return to the board details and confirm the saved metadata and pedal order.
- [ ] Create a rig preset. Select the pedalboard and enter a name, guitar, tuning, amp settings, and description.
- [ ] Save the rig preset as a draft and confirm it appears in **My rig presets** with **Draft** status.
- [ ] Open the preset, submit it for approval, and confirm it changes to **Submitted**.
- [ ] Confirm guitarist screens do not show approve or archive controls.
- [ ] Log out using the workspace profile control.

## Administrator review and guitarist verification

- [ ] Log in with an administrator account.
- [ ] Open **Admin → Rig presets** and confirm the submitted guitarist preset appears in the review queue with its owner and details.
- [ ] Open the submitted preset and approve it. Confirm the status changes to **Approved**.
- [ ] To test archiving without changing the preset needed for the user verification below, submit a second disposable preset and archive that separate non-archived preset from its admin details page. Confirm the status changes to **Archived**.
- [ ] Confirm archive/approve controls are only shown in the administrator review area.
- [ ] Log out of the administrator account.
- [ ] Log in again as the guitarist who submitted the preset.
- [ ] Open **My rig presets** and the preset details; confirm the server-stored **Approved** status is visible.
- [ ] Edit the approved preset and save. Confirm the API returns it to **Draft**, as edits to submitted or approved presets require resubmission.
- [ ] Resubmit the edited preset and confirm **Submitted** status.
- [ ] Delete an own, non-archived preset and confirm the delete prompt and successful removal.
- [ ] Confirm the archived preset is read-only and cannot be edited or deleted by its owner.

## Access-control and validation checks

- [ ] Attempt to open another guitarist's preset as a normal user; confirm the API denies access.
- [ ] Attempt to approve or archive as a normal user through the API; confirm the API denies the request even if the UI is bypassed.
- [ ] Attempt to create or update a preset with another user's pedalboard; confirm the API returns HTTP 422 and the form reports the validation error.
- [ ] Submit the preset form without a name; confirm browser/form validation prevents an empty name.
- [ ] Submit invalid preset data through the API; confirm Laravel 422 field errors are shown next to the corresponding fields where available.
