# Spec Diff: `docs/spec.md` vs current product

## Verdict

The product follows the **general direction** of the spec, but it does **not** follow it precisely.

What is already aligned:

- Static React/Vite client app with no backend.
- Local storage via IndexedDB.
- Hash-style SPA routing.
- Exact view, character-by-character view, phonetic view.
- Instance phonetic profile config loading with validation fallback.
- PWA/service worker setup exists.
- Required footer attribution exists and is excluded from print layout.

The gaps below are the main differences between the spec and the current implementation.

## Functional mismatches

### 1. `never-store` mode currently drops the secret instead of keeping it only in-memory/session

Spec intent: user should still be able to view/print the secret without storing it in IndexedDB.

Current behavior:

- `SecretForm` removes `secretPlaintext` when purge mode is `never-store`.
- `Home` then stores that already-redacted entry in `sessionStorage`.
- Result: detail/print view receives an entry with no secret value.

Evidence:

- `src/components/SecretForm/SecretForm.tsx:36`
- `src/pages/Home.tsx:40`
- `src/pages/Home.tsx:44`

### 2. Global default purge settings are not applied to the new entry form

Spec intent: settings should control the default purge policy.

Current behavior:

- Settings page persists `defaultPurgePolicy`.
- New entry form still hardcodes `timed` + `3600` seconds unless `initial` props are passed.
- Home page does not pass settings into `SecretForm`.

Evidence:

- `src/components/Settings/Settings.tsx:115`
- `src/components/SecretForm/SecretForm.tsx:19`
- `src/components/SecretForm/SecretForm.tsx:22`
- `src/pages/Home.tsx:67`

### 3. Compact callout output mode is missing

Spec requires output mode D: compact one-line/grouped spoken representation for phone use.

Current behavior:

- Detail page only exposes `exact`, `chars`, and `phonetic`.

Evidence:

- `src/pages/EntryDetail.tsx:24`
- `src/pages/EntryDetail.tsx:81`

### 4. Secret detail screen is missing required actions

Spec screen B requires: exact view, character table, NATO table, print, duplicate, delete.

Current behavior:

- Detail page has print and view tabs.
- No duplicate action.
- No delete action on detail page.

Evidence:

- `src/pages/EntryDetail.tsx:35`

### 5. Print requirements are only partially implemented

Missing from spec:

- optional emergency instructions on print sheet,
- concealed print mode,
- stronger print safety warning about printer memory and PDF copies,
- explicit multi-entry page-break behavior.

Current behavior:

- Print sheet shows exact value, character table, phonetic table, notes.
- Warning text is generic and does not mention retained printer jobs or sensitive PDFs.

Evidence:

- `src/pages/PrintView.tsx:20`
- `src/components/PrintSheet/PrintSheet.tsx:60`
- `src/components/PrintSheet/PrintSheet.tsx:64`

### 6. Grouping and formatting helpers are not implemented

Spec requires optional helpers like:

- grouped characters,
- line breaks after N chars,
- code block formatting,
- large-print mode,
- handwriting-friendly spacing.

Current behavior:

- `formatting` exists in types but is not exposed in UI and not used in rendering.

Evidence:

- `src/types/index.ts:14`
- `src/pages/EntryDetail.tsx:97`
- `src/components/PrintSheet/PrintSheet.tsx:31`

### 7. History features are incomplete

Missing from spec:

- search by title,
- sort by newest / last opened switch,
- duplicate entry action,
- delete selected items,
- panic button separate from normal purge,
- best-effort purge on tab close.

Current behavior:

- history list supports open, single delete, and delete all only.
- storage sorts only by `createdAt`, not `lastOpenedAt`.

Evidence:

- `src/components/HistoryList/HistoryList.tsx:74`
- `src/lib/storage.ts:44`

### 8. Auto purge is not periodic while the app stays open

Spec requires purge on launch and periodically while open.

Current behavior:

- auto purge runs once on initial mount only.

Evidence:

- `src/hooks/useAutoPurge.ts:7`

### 9. Settings page is much narrower than the spec

Missing from spec:

- selected profile preview,
- import JSON for personal profile,
- reset/restore to instance default,
- encryption on/off,
- default print preferences,
- warning/privacy settings.

Current behavior:

- settings supports history toggle, default purge policy, active profile select, create/edit/delete custom profiles via JSON editor.

Evidence:

- `src/components/Settings/Settings.tsx:96`
- `src/components/Settings/Settings.tsx:167`

### 10. Optional local encryption is not integrated into the product flow

Spec marks encryption as a recommended enhancement and later MVP “should have”.

Current behavior:

- crypto helpers exist, but there is no UI, no passphrase flow, and no storage integration using `secretCiphertext`.

Evidence:

- `src/lib/crypto.ts:56`
- `src/lib/storage.ts:34`
- `src/components/Settings/Settings.tsx:92`

### 11. About/privacy route from the proposed information architecture is missing

Spec suggests an `/about` page for privacy model and usage warnings.

Current behavior:

- app only supports home, entry, print, settings.

Evidence:

- `src/App.tsx:14`

### 12. Offline-ready status / install-focused UX is missing

Spec requires offline-ready status and installable PWA metadata.

Current behavior:

- manifest and service worker exist,
- there is no visible offline-ready status in the UI.

Evidence:

- `src/main.tsx:12`
- `src/sw.ts:1`
- `src/App.tsx:75`

## Deployment mismatch

### 13. Current production build fails, so GitHub Pages readiness is not satisfied

Spec requires GitHub Pages deployment/runnability and acceptance criteria explicitly mention it.

Current behavior:

- `npm run build` fails because Workbox refuses to precache `public/images/Origami key with PaperKey logo.png` at 2.7 MB.
- `vite.config.ts` also uses `base: '/'`, which is usually wrong for GitHub Pages project-site deployment unless custom domain/root hosting is guaranteed.

Evidence:

- `vite.config.ts:6`
- `vite.config.ts:12`
- Build result on 2026-04-04: Workbox error for `images/Origami key with PaperKey logo.png` exceeding the 2 MiB precache limit.

## Test coverage mismatch

### 14. E2E tests do not guard the acceptance criteria from the spec

Spec says acceptance criteria should be guarded by E2E tests covering critical flows like:

- exact / per-character / phonetic rendering,
- case distinction,
- symbol naming,
- print flow,
- IndexedDB reopen,
- purge one/all,
- auto purge,
- no backend dependency,
- GitHub Pages deployment,
- offline usage.

Current behavior:

- Playwright suite contains only basic smoke/navigation tests.
- No E2E coverage for print, storage reopen, purge behavior, offline mode, or “no secrets sent anywhere”.

Evidence:

- `tests/e2e/app.spec.ts:1`

## Conclusion

The implementation is **partially compliant** with `docs/spec.md`, but not precisely compliant.

The biggest problems are:

1. `never-store` mode is functionally broken.
2. settings do not drive new-entry defaults.
3. several required UX features are missing from detail/history/settings/print flows.
4. acceptance-test coverage is far below the spec.
5. current build failure blocks the stated GitHub Pages-ready outcome.
