# ToneVault Wireframes

## Visual direction

Use a professional, guitar/pedalboard-inspired visual style without making the
interface feel like a guitar shop. The proposed palette is charcoal/near-black
for navigation, warm off-white for page backgrounds, muted gray for borders,
and a restrained amber or copper accent for primary actions and active states.
Use clear sans-serif text, readable labels, consistent spacing, and simple
pedal-shaped cards or small signal-chain indicators as visual motifs.

Keep the layout responsive: desktop uses a sidebar with a content area; mobile
uses a compact top bar and collapsible navigation. Use strong contrast and
visible keyboard focus. The sketches below are structural, not final visual
designs.

## Shared application shell

```text
┌──────────────────────────────────────────────────────────┐
│ ToneVault logo        Search (where relevant)   Profile  │
├───────────────┬──────────────────────────────────────────┤
│ Main nav      │ Breadcrumb / page title                   │
│ Dashboard     │                                          │
│ Pedal Library │ Page content                              │
│ My Boards     │                                          │
│ Rig Presets   │                                          │
│ Admin items*  │                                          │
└───────────────┴──────────────────────────────────────────┘
* Admin items appear only for admins; the API still enforces access.
```

## 1. Login

```text
┌────────────────────────────────┐
│          ToneVault              │
│  Your rigs, ready to play       │
│                                │
│  Email address                  │
│  [________________________]     │
│  Password                       │
│  [________________________]     │
│  [ Sign in ]                    │
│  Don't have an account? Register│
└────────────────────────────────┘
```

Centered sign-in card on a quiet dark/neutral background, with a small
pedalboard or signal-chain accent. Show field errors, a submit loading state,
and an accessible error message for failed sign-in.

## 2. Register

```text
┌────────────────────────────────┐
│          Join ToneVault         │
│  Name                           │
│  [________________________]     │
│  Email address                  │
│  [________________________]     │
│  Password                       │
│  [________________________]     │
│  Confirm password               │
│  [________________________]     │
│  [ Create account ]             │
│  Already registered? Sign in    │
└────────────────────────────────┘
```

Use the same visual language as Login. The role is not selectable: new public
accounts are created as guitarists. Show inline validation and password
requirements.

## 3. User Dashboard

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Good evening, [Name]                     │
│               │ [ Boards  3 ] [ Rigs  5 ] [ Pending 1 ]   │
│               │                                          │
│               │ Recent pedalboards      Rig status        │
│               │ ┌──────────────┐        ┌──────────────┐  │
│               │ │ Board card   │        │ Pending ...  │  │
│               │ └──────────────┘        └──────────────┘  │
│               │ [Browse pedals] [Create pedalboard]      │
└───────────────┴──────────────────────────────────────────┘
```

Prioritize shortcuts and concise counts. Counts are scoped to the signed-in
user. Empty states link to the first useful action.

## 4. Pedal Library

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Pedal Library            [Search...]     │
│               │ [Category v] [Brand v] [Clear filters]   │
│               │ Results: 24                              │
│               │ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│               │ │ image   │ │ image   │ │ image   │      │
│               │ │ Name    │ │ Name    │ │ Name    │      │
│               │ │ Brand   │ │ Brand   │ │ Brand   │      │
│               │ │ Type    │ │ Type    │ │ Type    │      │
│               │ │ Details │ │ Details │ │ Details │      │
│               │ └─────────┘ └─────────┘ └─────────┘      │
│               │          [1] [2] [Next]                   │
└───────────────┴──────────────────────────────────────────┘
```

Use responsive cards, category/brand filters, clear active-filter chips, and
server-backed pagination. Display a neutral image placeholder if the catalog
item has no image. Include loading, no-results, and API-error states.

## 5. Pedal Details

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Pedal Library / Pedal name               │
│               │ ┌───────────────┐  Brand • Category       │
│               │ │ Product image │  Pedal name             │
│               │ │               │  Type / model           │
│               │ └───────────────┘  Price (if available)   │
│               │                    Description            │
│               │                    [Add to pedalboard]    │
│               │                    [Back to library]      │
└───────────────┴──────────────────────────────────────────┘
```

The add action opens a board selector, then confirms success without losing the
pedal detail context. Disable or explain the action when the pedal is inactive.

## 6. My Pedalboards

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ My Pedalboards         [+ New Pedalboard] │
│               │ [Search boards...] [Active v]             │
│               │ ┌───────────────────┐ ┌─────────────────┐ │
│               │ │ Board name        │ │ Board name      │ │
│               │ │ 6 pedals          │ │ 3 pedals        │ │
│               │ │ Updated date      │ │ Updated date    │ │
│               │ │ [Open] [More ...] │ │ [Open] [...]    │ │
│               │ └───────────────────┘ └─────────────────┘ │
└───────────────┴──────────────────────────────────────────┘
```

List only the current user's boards. The overflow menu offers edit, archive,
and delete; destructive deletion requires confirmation. Include a useful empty
state with a create action.

## 7. Create Pedalboard

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Create pedalboard                         │
│               │ Name *                                    │
│               │ [___________________________________]     │
│               │ Description                               │
│               │ [___________________________________]     │
│               │ [Cancel]               [Create board]    │
└───────────────┴──────────────────────────────────────────┘
```

Keep the first version to essential fields. Validate required name, show
inline/server errors, prevent duplicate submissions while saving, and navigate
to the new board builder after success.

## 8. Pedalboard Builder

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Board name                   [Save]      │
│               │ IN ──► [Pedal 1] ─► [Pedal 2] ──► OUT   │
│               │         [↑ ↓]         [↑ ↓]              │
│               │                                          │
│               │ Pedals in library  [Search...]           │
│               │ [Category v]                             │
│               │ [Pedal card] [Add]  [Pedal card] [Add]   │
│               │                                          │
│               │ Selected pedal settings / notes          │
└───────────────┴──────────────────────────────────────────┘
```

Present signal-chain order as an explicit sequence from input to output.
Support reorder with accessible up/down controls (drag-and-drop may be added
later), add/remove actions, and optional per-pedal settings/notes. Persist
position changes and show saving/error feedback.

## 9. Rig Presets

```text
┌───────────────┬──────────────────────────────────────────┐
│ Sidebar       │ Rig Presets                [+ New Rig]    │
│               │ [Status: All v] [Search...]               │
│               │ ┌──────────────────────────────────────┐ │
│               │ │ Name   Board   Guitar   Updated      │ │
│               │ │ ...    ...     ...      ...          │ │
│               │ │ Status badge: Draft/Pending/etc.     │ │
│               │ │ [View] [Edit] [Submit for approval]  │ │
│               │ └──────────────────────────────────────┘ │
└───────────────┴──────────────────────────────────────────┘
```

Show each user's presets and clear status badges. Only eligible drafts or
rejected presets show a submission action. Admin review actions are provided
in the Admin Dashboard, not as a user control.

## 10. Admin Dashboard

```text
┌───────────────┬──────────────────────────────────────────┐
│ Admin nav     │ Admin Dashboard                          │
│ Dashboard     │ [Users 42] [Pedals 86] [Pending rigs 4]   │
│ Pedals        │                                          │
│ Categories    │ Rig submissions awaiting review          │
│ Users         │ ┌──────────────────────────────────────┐ │
│               │ │ Rig   Owner   Submitted   [Review]   │ │
│               │ │ ...                                  │ │
│               │ └──────────────────────────────────────┘ │
└───────────────┴──────────────────────────────────────────┘
```

Keep approval work prominent and provide a link to each management area.
Counts are API-derived; only admins can retrieve admin dashboard data.

## 11. Admin Pedal Management

```text
┌───────────────┬──────────────────────────────────────────┐
│ Admin nav     │ Pedal Management          [+ Add pedal]   │
│               │ [Search...] [Category v] [Status v]       │
│               │ ┌──────────────────────────────────────┐ │
│               │ │ Name    Brand   Category Status      │ │
│               │ │ ...     ...     ...      Active      │ │
│               │ │ [Edit] [Deactivate] [Delete]         │ │
│               │ └──────────────────────────────────────┘ │
│               │                   [Pagination]            │
└───────────────┴──────────────────────────────────────────┘
```

Use a paginated table on wide screens and stacked rows/cards on mobile. Add and
edit use a validated form. Prefer deactivate for pedals already used on boards;
confirm destructive deletion and explain when related records prevent it.

## 12. Admin Category Management

```text
┌───────────────┬──────────────────────────────────────────┐
│ Admin nav     │ Category Management     [+ Add category]  │
│               │ ┌──────────────────────────────────────┐ │
│               │ │ Name        Description    Pedals     │ │
│               │ │ Delay       ...            12         │ │
│               │ │ [Edit] [Delete]                       │ │
│               │ └──────────────────────────────────────┘ │
│               │                                          │
│               │ Category form: Name * / Description      │
│               │ [Cancel]                  [Save]         │
└───────────────┴──────────────────────────────────────────┘
```

Use a small table/list and an inline panel or modal for add/edit. Prevent
duplicate category names. If pedals still reference a category, explain that
it must be reassigned before deletion.

## Shared interaction and accessibility notes

- Mark required fields and errors in text; do not rely on color alone.
- Provide visible focus, semantic headings, labels, and keyboard-operable
  controls.
- Use consistent loading, empty, success, and error states on data-driven
  pages.
- Confirm irreversible deletes and show the affected item name.
- At narrow widths, stack cards/forms, make tables scroll or reflow, and keep
  primary actions reachable.
- These are plans for the UI, not implemented frontend screens.
