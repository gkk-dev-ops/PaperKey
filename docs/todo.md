# TODO: Address spec gaps from `docs/spec-diff.md`

## Priority 0: Fix broken behavior and deployment blockers

- [ ] Fix `never-store` flow so the secret remains available for detail and print views without being persisted to IndexedDB.
  Acceptance:
  - Selecting `Never save to history` must still show the exact secret on the detail page.
  - The same entry must remain printable in the current session.
  - The entry must not be written to IndexedDB.

- [ ] Apply saved default purge settings to the new entry form.
  Acceptance:
  - `settings.defaultPurgePolicy` must prefill the form on the home screen.
  - Changing default TTL or purge mode in Settings must affect newly created entries.

- [ ] Fix production build so the app can be deployed successfully.
  Acceptance:
  - `npm run build` must pass.
  - PWA precache configuration must no longer fail on oversized assets.
  - Asset handling must be compatible with the selected deployment model.

- [ ] Verify GitHub Pages deployment configuration.
  Acceptance:
  - `vite.config.ts` base path must match the intended hosting mode.
  - App routes, assets, manifest, and service worker must work from the deployed base path.

## Priority 1: Complete missing core MVP behavior

- [ ] Add compact callout output mode for phone-readable spoken output.
  Acceptance:
  - Entry detail must expose a compact spoken representation in addition to exact, character, and phonetic views.
  - Output must preserve order and case context.

- [ ] Add missing secret detail actions: duplicate and delete.
  Acceptance:
  - Users must be able to duplicate an entry from the detail screen.
  - Users must be able to delete an entry from the detail screen.

- [ ] Expand print flow to match the spec more closely.
  Acceptance:
  - Add optional emergency instructions to the print sheet.
  - Add concealed print mode that omits the continuous exact string.
  - Improve print warning copy to mention printer memory and saved PDF risk.
  - Ensure print layout rules support clean page separation for printable entries.

- [ ] Implement formatting helpers for long secrets and backup codes.
  Acceptance:
  - Support grouped character display.
  - Support line breaks after configurable intervals.
  - Support code-block formatting for grouped backup codes.
  - Support large-print mode.
  - Support handwriting-friendly spacing mode.

- [ ] Make auto purge run periodically while the app remains open.
  Acceptance:
  - Expired entries must be purged on launch and on a repeating timer while the app is active.
  - History UI must refresh after periodic purge.

## Priority 2: Complete history and settings requirements

- [ ] Add history search by title.
  Acceptance:
  - Search must match title only by default.
  - Search must not index or search partial secret text unless that behavior is explicitly added later.

- [ ] Add history sorting controls.
  Acceptance:
  - Users must be able to sort by newest and by last opened.
  - `lastOpenedAt` must be updated when entries are opened if sort-by-last-opened is supported.

- [ ] Add bulk history actions.
  Acceptance:
  - Users must be able to select multiple entries.
  - Users must be able to delete selected entries.
  - Add a dedicated panic wipe action distinct from ordinary purge-all UI.

- [ ] Add best-effort purge on tab close.
  Acceptance:
  - If enabled in settings, app should attempt to purge local records on tab/window close.

- [ ] Expand settings to cover the spec-defined controls.
  Acceptance:
  - Add selected profile preview.
  - Add import JSON for personal profiles.
  - Add reset/restore-to-default controls.
  - Add default print preferences.
  - Add warning/privacy settings.

- [ ] Add visible offline-ready/install status to the UI.
  Acceptance:
  - User must be able to tell when offline capability is ready.
  - Install/PWA readiness should be surfaced without adding telemetry or background sync.

- [ ] Add `/about` privacy/warnings screen.
  Acceptance:
  - Include the privacy model, storage limitations, printing/PDF risks, and public-computer warning.

## Priority 3: Integrate optional encryption enhancement

- [ ] Decide whether local encryption is in current scope.
  Acceptance:
  - Document explicit product decision: include now or defer.

- [ ] If encryption is in scope, integrate Web Crypto storage flow end-to-end.
  Acceptance:
  - Add settings/UI for enabling local encryption.
  - Add passphrase flow for encrypt/decrypt.
  - Persist ciphertext + encryption metadata instead of plaintext when enabled.
  - Ensure history, detail, duplicate, purge, and print flows work correctly with encrypted entries.

## Priority 4: Bring tests up to spec

- [ ] Expand E2E coverage to guard the acceptance criteria from `docs/spec.md`.
  Acceptance:
  - Cover exact, per-character, and phonetic rendering.
  - Cover uppercase/lowercase distinction in spoken output.
  - Cover correct naming of symbols such as hyphen and underscore.
  - Cover print flow.
  - Cover save and reopen from IndexedDB.
  - Cover delete one and purge all.
  - Cover auto purge behavior.
  - Cover offline usability after first load.

- [ ] Add tests for the corrected `never-store` flow.
  Acceptance:
  - Ensure the secret is viewable/printable in-session.
  - Ensure it is not saved to IndexedDB history.

- [ ] Add deployment/build verification to CI or release checks.
  Acceptance:
  - Build step must fail fast on PWA precache/deployment regressions.

## Nice-to-have follow-ups

- [ ] Add stronger validation and UX for custom profile editing beyond raw JSON parsing.
- [ ] Add support for import/export of personal phonetic profiles with safer schema feedback.
- [ ] Add visual handling for similar-looking characters such as `O/0`, `I/l/1`, `S/5`.

## Suggested implementation order

1. Fix `never-store`.
2. Fix build and deployment configuration.
3. Wire settings defaults into the new entry flow.
4. Add missing detail/print core behaviors.
5. Expand history and settings.
6. Add encryption if still in scope.
7. Backfill E2E coverage to match the spec.
