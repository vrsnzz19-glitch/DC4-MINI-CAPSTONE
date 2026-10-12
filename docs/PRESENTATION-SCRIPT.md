# ToneVault Capstone Presentation Script

**Format:** 8 slides with a live application walkthrough  
**Target duration:** approximately 17 minutes (within the requested 15–20 minute window)  
**Presenter:** Iverson Loquere · BSIT – Section 2

> **Citation note:** The `[cite: 3, 4]` markers below are retained as requested. Match them to the corresponding numbered references in the capstone paper or presentation reference list before submission.

## Run of show

| Slide | Topic | Target time |
| --- | --- | ---: |
| 1 | Introduction | 1:00 |
| 2 | Problem | 1:15 |
| 3 | Solution | 1:15 |
| 4 | Users and Features | 1:15 |
| 5 | Architecture and ERD | 1:45 |
| 6 | Live Walkthrough | 7:15 |
| 7 | Security, Validation, and Responsive Design | 2:00 |
| 8 | Conclusion | 1:00 |
| **Total** |  | **16:45** |

Allow up to two additional minutes for transitions, loading, or audience questions while keeping the presentation within 20 minutes.

---

## Slide 1 — Introduction

**On-screen:** *ToneVault: Guitar Effects Pedalboard Rig Setup* · Presenter name · BSIT – Section 2

**Script:**

“Good day. I’m Iverson Loquere, and this is ToneVault, a web application for organizing guitar effects pedals and keeping repeatable rig setups in one place. I’ll explain the problem it addresses, show how guitarists and administrators use it, and then walk through the application from pedal discovery to rig review.”

**Transition:** “First, let’s look at what makes a guitar setup difficult to reproduce.”

## Slide 2 — Problem

**On-screen:** A scattered setup: pedal inventory, handwritten signal-chain notes, amp settings, and messages.

**Script:**

“A guitarist’s tone is often more than a list of pedals. The order of effects, pedal-specific settings, amp values, guitar, and tuning all contribute to a setup. When this information is split between memory, notes, or informal messages, it can be difficult to reconstruct the same sound for rehearsal or performance. Sharing a rig is also harder when every musician records the information differently. ToneVault addresses this organization and repeatability problem with a structured, searchable workspace. [cite: 3, 4]”

**Transition:** “The project brings those pieces together rather than asking users to change how they play.”

## Slide 3 — Solution

**On-screen:** Discover pedals → assemble a board → save a rig preset → submit for review.

**Script:**

“ToneVault combines a shared pedal catalog with personal pedalboards and reusable rig presets. A guitarist can find catalog items, arrange pedals into an ordered signal chain, and save a preset with guitar, tuning, amp settings, and notes. When the preset is ready, they can submit it for an administrator to review. The application is a planning and organization tool; it does not process guitar audio or connect to physical pedal hardware. Gig Mode adds an interactive stage-style view, but its analyzer and controls are visual simulations. [cite: 3, 4]”

**Transition:** “Those capabilities are separated by the needs and permissions of two main user roles.”

## Slide 4 — Users and Features

**On-screen:**

- **Guitarist:** browse/search pedals, build personal boards, save presets, submit for review.
- **Administrator:** maintain pedals/categories, view submissions, approve or archive presets.

**Script:**

“The guitarist is the primary user. They can browse and filter the pedal library, manage their own pedalboards, store board-specific pedal settings, and create or submit rig presets. The administrator maintains shared catalog information and reviews submitted rigs. New registrations receive the regular user role, so a person cannot grant themselves administrator access through the registration form. These roles let the project support personal organization while keeping shared catalog and approval decisions under administrative control. [cite: 4]”

**Transition:** “The next slide shows how the application represents those features in its technical design.”

## Slide 5 — Architecture and ERD

**On-screen:** A simplified system diagram and ERD:

```text
React SPA (Vite) ── Axios / JSON ──> Laravel API
                                         │
                              Sanctum · policies · validation
                                         │
                                  MySQL / MariaDB

users 1 ── * pedalboards ── * pedals * ── 1 pedal_categories
  │                              │
  └── * rig_presets ── optional ─┘
```

**Script:**

“ToneVault uses a React single-page frontend and a Laravel JSON API. Axios sends requests to the API; Laravel handles authentication, validation, authorization, and persistence. Sanctum issues bearer tokens for protected API actions. In the data model, a user owns pedalboards and rig presets. Pedalboards connect to pedals through a join table that stores pedal order and board-specific settings. Pedals can optionally belong to a category, and a preset can optionally reference a pedalboard. The current checkout uses Laravel 13, React 19, Vite 8, and is configured for MySQL or MariaDB. [cite: 4]”

**Presenter cue:** Point out that the board-pedal join is what lets the same catalog pedal appear on multiple users’ boards with different positions and settings.

**Transition:** “I’ll now demonstrate the main path through the application.”

## Slide 6 — Live Walkthrough

**On-screen:** Application in browser. Keep the seeded guitarist and administrator accounts ready in separate browser profiles or be prepared to sign out between roles.

**Opening line:**

“I’ll follow one guitarist’s workflow: discover pedals, save an ordered board, use its Gig Mode view, create a preset, and then switch to the administrator review workflow.”

### Live demo order (7 minutes 15 seconds)

| Order | Time | Action and narration |
| --- | ---: | --- |
| 1. Sign in and establish role | 0:45 | Sign in as the local guitarist account. Point out the signed-in workspace and navigation. Explain that protected personal work requires authentication; don’t display or read a password aloud. |
| 2. Find a pedal | 1:00 | Open **Pedal Library**. Search by a pedal name, brand, or model, then apply a category/type/status filter and show pagination or the result count. Mention that the catalog is shared. |
| 3. Build and save a board | 1:30 | Choose **Build a pedalboard**, enter a recognizable board name, search for and select several pedals, and save. Return to **My pedalboards** and show the saved board. Explain that pedal order and board-specific settings are associated with the board. |
| 4. Enter Gig Mode | 1:15 | Open the saved board’s live view. Toggle a footswitch and adjust volume and gain sliders. Point to the stage/audience backdrop and animated EQ-style spectrum. Explicitly note these are simulated visual controls, not audio processing. |
| 5. Create and submit a rig preset | 1:15 | Create a preset linked to the board. Show guitar, tuning, amp settings, and description fields; save the draft and submit it. Point out the resulting review status. |
| 6. Review as administrator | 1:30 | Switch to the seeded administrator account. Open the submitted preset, review its details, approve it, and show the updated status. Optionally demonstrate archive only if time remains; do not delete demo data. |

**Demo close:** “That completes the user journey from catalog discovery to an administrator-reviewed preset. I’ll finish with the safeguards and the project’s verification results.”

### Live demo fallback

If the API or database is unavailable, use screenshots or seeded records to explain the same sequence. Do not claim a failed live request succeeded. Continue with Slide 7 and disclose that the live environment was unavailable during the demo.

### Presenter preparation

- Start the backend and frontend using the setup instructions in the repository README, and confirm the API and browser UI are reachable before presenting.
- Seed local demo data with `ToneVaultSeeder` if needed. The local-only demo account details are documented in the README; do not reuse them outside a development database.
- Ensure the demo database is disposable or backed up. Use a new board/preset for the walkthrough and avoid destructive actions on shared or production data.
- Preload a guitarist session and administrator session in separate browser profiles if possible. Check that the sample account roles and submitted preset are in the expected state.
- If the allotted time is short, skip the archive action and keep the six steps in order.

## Slide 7 — Security, Validation, and Responsive Design

**On-screen:** Three columns: **Identity & permissions**, **Input & feedback**, **Responsive UI**. Add a small verification footer: **22 backend tests · 217 assertions · frontend build/lint passed**.

**Script:**

“Security is enforced at the API, not only by hiding buttons in the interface. Sanctum protects authenticated operations; role checks restrict catalog changes and preset approval to administrators; ownership checks prevent one guitarist from editing another person’s board or preset. Registration assigns the regular user role, and Laravel validation rejects invalid input or attempts to set privileged preset status directly. The interface provides loading, error, and success feedback, and the layouts are designed to adapt across screen sizes. In the current verification run, all 22 backend tests passed with 217 assertions, and the frontend production build and lint checks passed. This is automated and implementation-level verification, not a claim that a manual browser end-to-end test was completed. [cite: 4]”

**Presenter cue:** If available, briefly resize the browser to a narrow viewport; otherwise show a prepared mobile-width screenshot. Do not spend time navigating away from the review flow.

**Transition:** “To conclude, ToneVault turns scattered setup notes into a structured workflow.”

## Slide 8 — Conclusion

**On-screen:** **Find it. Build it. Save it. Share it for review.**

**Script:**

“To summarize, ToneVault helps guitarists organize a pedal collection, build ordered pedalboards, and preserve rig settings as reusable presets. Its role-based review workflow gives administrators control over shared catalog information and submitted rigs, while validation and ownership checks protect user data. Gig Mode provides a visual performance-oriented presentation of a saved board; actual audio processing remains outside the system’s scope. The project’s core goal is simple: make a useful tone easier to document, retrieve, and review. Thank you. I’m happy to take your questions. [cite: 3, 4]”

## Q&A handoff (if time remains)

- **Does Gig Mode process audio?** No. The spectrum display, audience, sliders, and footswitch toggles are visual/session interactions only; the app does not process sound or communicate with hardware.
- **Who can approve a submitted rig?** An administrator. A guitarist can create and submit their own preset but cannot grant themselves admin privileges or approve it.
- **How is the board order stored?** On the pedalboard-to-pedal association, alongside board-specific settings and notes.
- **What was tested?** Laravel feature tests, frontend lint, and a frontend production build. The audit did not include a manual browser end-to-end run.
