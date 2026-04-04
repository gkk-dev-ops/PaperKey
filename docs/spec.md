# Secret backup print app — specification draft

## Working goal

A **static, privacy-first web app** for preparing sensitive text such as passwords, recovery codes, seed fragments, backup codes, and emergency contact strings into a format that is:

1. **easy to read exactly as written**, character by character,
2. **easy to communicate verbally** using a **configurable phonetic / spoken alphabet** (default profile may be NATO),
3. **easy to print to paper or save as PDF**,
4. **stored locally only** in the browser using **IndexedDB**, with simple purge controls and optional auto-deletion.

The app must work as a **client-side website** that can be hosted on **GitHub Pages** with **no backend**.

---

## Product positioning

A small offline-capable utility for turning sensitive strings into **printable emergency backups** and **human-readable verbal transmission sheets**.

It is not a password manager. It is a **temporary preparation and print tool** for physical backup and controlled sharing.

---

## Naming

**PaperKey**

Why:

- easy to remember,
- good fit for printed backup use case,
- broad enough for passwords, recovery codes, and backup strings,
- not overly technical,
- brandable for a simple GitHub Pages tool.

Possible tagline:\
**Prepare sensitive strings for print, backup, and verbal recovery.**

---

## Core use cases

1. User pastes a password and gets:
   - original text,
   - character-by-character breakdown,
   - configurable phonetic rendering,
   - printable layout.

2. User pastes a recovery code such as `Ab-42_kQ!9` and gets a clean sheet showing:
   - the exact string,
   - each symbol explained clearly,
   - a phone-friendly spelling version.

3. User prepares several 2FA backup codes and prints them as a compact paper backup sheet.

4. User stores recent entries only locally, then purges them manually or automatically after a configured time.

5. User opens the app later without network dependency and reprints a previously prepared local item before purging it.

---

## Non-goals

- No cloud sync.
- No user accounts.
- No server-side storage.
- No password generation as a primary feature.
- No browser extension in v1.
- No sharing via external APIs.
- No OCR or scanning in v1.

---

## Licensing and attribution

### License recommendation

- Use a **permissive open-source license**.
- Recommended choice: **MIT License**.
- Goal: anyone should be free to use, modify, self-host, and adapt the app.

### Footer attribution requirement

Include one small, unobtrusive footer sentence in the application.

Recommended footer copy:  
**Built by Grzegorz Kaczmarek — need custom software development? Visit gkk-dev.com.**

Behavior:

- visible in normal app layout,
- excluded from print output by default,
- link opens `https://gkk-dev.com`.

## Security model

Because the app handles secrets, this section is critical.

### Hosting model

- App is deployed as a static site on GitHub Pages.
- All processing happens in the browser.
- No secret should ever be sent to a server.
- No analytics, session replay, or third-party scripts.
- No external fonts if avoidable.
- No CDN dependencies in production if possible.

### Local storage model

- Secrets may be stored in IndexedDB **only on the local device/browser**.
- User must be able to disable history entirely.
- User must be able to purge all local secrets instantly.
- User must be able to configure automatic purge after a time window.

### Important limitation to state clearly

If a secret is stored in IndexedDB, it exists on the device in browser-managed storage. That is safer than cloud sync, but still **not equivalent to a hardened password manager vault**.

### Recommended enhancement

Add an **optional local encryption mode** for stored history using the **Web Crypto API**, where:

- the user sets a local passphrase,
- stored records are encrypted before being written to IndexedDB,
- encryption key is derived in-browser,
- nothing leaves the device.

This should be **optional**, because some users will prefer maximum simplicity.

---

## Functional requirements

## 1. Secret input

User can create a new entry with:

- title / label (optional),
- secret text (required),
- notes (optional),
- category (optional): password, recovery code, seed phrase fragment, API key, Wi-Fi password, other.

Input must preserve exact characters, including:

- uppercase letters,
- lowercase letters,
- digits,
- spaces,
- punctuation,
- symbols such as `-`, `_`, `.`, `:`, `/`, `@`, `#`, `!`, `?`, `*`, `+`, `=` and similar.

### Input controls

- show/hide secret toggle,
- paste support,
- clear field button,
- character count,
- warning for leading/trailing spaces,
- optional trim disabled by default,
- multiline support for recovery blocks or grouped codes.

---

## 2. Output modes

For each entry, show the following representations.

### A. Exact view

The secret exactly as entered.

Example:\
`Ab-42_kQ!9`

### B. Character-by-character view

Each character rendered separately in sequence.

Example:

1. `A`
2. `b`
3. `-`
4. `4`
5. `2`
6. `_`
7. `k`
8. `Q`
9. `!`
10. `9`

### C. Spoken / phonetic view

Each character converted into a readable verbal token using the currently selected phonetic alphabet profile.

Example using NATO profile:

- `A` → `Alpha (capital A)`
- `b` → `Bravo (lowercase b)`
- `-` → `Hyphen`
- `4` → `Four`
- `2` → `Two`
- `_` → `Underscore`
- `k` → `Kilo (lowercase k)`
- `Q` → `Quebec (capital Q)`
- `!` → `Exclamation mark`
- `9` → `Nine`

### D. Compact callout view

A compact one-line or grouped representation optimized for reading on a phone call.

Example:\
`Alpha capital A / Bravo lowercase b / Hyphen / Four / Two / Underscore / Kilo lowercase k / Quebec capital Q / Exclamation mark / Nine`

### E. Print sheet view

A layout designed for A4 / Letter printing with:

- title,
- timestamp,
- exact value,
- character-by-character table,
- spoken phonetic table,
- optional notes,
- optional emergency instructions.

---

## 3. Phonetic alphabet, localization, and symbol mapping behavior

### Core principle

The app must not hardcode only one NATO-style alphabet. It should support a **configurable spoken alphabet system** with:

- built-in profiles,
- instance-level admin configuration,
- per-user runtime overrides.

### Built-in profiles

At minimum support:

- **NATO / ICAO** default profile,
- ability to add custom profile, e.g. **Polish custom business profile**,
- future additional locale packs without app redesign.

### Letters

- Profiles map A–Z to spoken words.
- Preserve case information independently from the word map.
- Case must be explicitly visible in output where helpful.

Examples using NATO profile:

- `A` → `Alpha (capital A)`
- `a` → `Alpha (lowercase a)`

### Digits

Map digits to spoken names through the active profile.

Default English example:

- `0` → `Zero`
- `1` → `One`
- `2` → `Two`
- `3` → `Three`
- `4` → `Four`
- `5` → `Five`
- `6` → `Six`
- `7` → `Seven`
- `8` → `Eight`
- `9` → `Nine`

### Common symbols

At minimum support:

- `-` → `Hyphen`
- `_` → `Underscore`
- `.` → `Dot`
- `,` → `Comma`
- `:` → `Colon`
- `;` → `Semicolon`
- `/` → `Slash`
- `\` → `Backslash`
- `@` → `At sign`
- `#` → `Hash`
- `!` → `Exclamation mark`
- `?` → `Question mark`
- `*` → `Asterisk`
- `+` → `Plus`
- `=` → `Equals`
- `(` → `Left parenthesis`
- `)` → `Right parenthesis`
- `[` → `Left bracket`
- `]` → `Right bracket`
- `{` → `Left brace`
- `}` → `Right brace`
- `%` → `Percent`
- `$` → `Dollar sign`
- `&` → `Ampersand`
- `"` → `Double quote`
- `'` → `Apostrophe`
- space → `Space`

### Unknown or uncommon symbols

If a symbol is not in the predefined map:

- show the raw symbol,
- show Unicode code point optionally in advanced mode,
- label it as `Unknown symbol` or `Custom symbol`,
- allow user to add it to a custom symbols dictionary and use user-provided string.

### Customization model

#### A. Instance-level configuration

There must be a simple place in the app deployment where the operator can provide JSON configuration for phonetic mappings.

Recommended approach:

- a static JSON config file bundled with the site, for example `/config/phonetic-profiles.json`,
- loaded at app startup,
- used to define available profiles, default profile, symbol labels, digit labels, and optional locale metadata.

Use cases:

- change certain words for one deployment,
- provide a custom Polish spoken alphabet,
- adjust wording to match company habits.

#### B. User-level runtime customization

Users must be able to customize phonetic words for themselves in Settings during runtime.

Requirements:

- duplicate a built-in or instance profile into a personal profile,
- edit letter, digit, and symbol labels,
- save the personal profile locally,
- choose active profile per user,
- reset to instance default.

Store user customizations locally only.

#### C. Profile selection UI

Settings should include:

- active phonetic profile selector,
- preview of the selected profile,
- per-user custom profile editor,
- import JSON for personal profile,
- reset / restore controls.

#### D. Config validation

The app should validate provided JSON configuration and fail safely.
If config is invalid:

- fall back to built-in default profile,
- surface a non-sensitive configuration warning,
- never break core secret viewing.

## 4. Grouping and formatting helpers

User can optionally enable:

- group characters visually in chunks (e.g. 4 or 5 chars),
- line breaks after N characters,
- code block formatting for backup codes,
- large-print mode,
- handwriting-friendly print mode with extra spacing.

This is useful for long recovery keys and printed paper backups.

---

## 5. History and local records

Store entries in IndexedDB with:

- id,
- title,
- secret value,
- notes,
- category,
- createdAt,
- updatedAt,
- lastOpenedAt,
- expiresAt (nullable),
- purgePolicy,
- encryption metadata if local encryption is enabled.

### History requirements

- list recent items locally,
- search by title only by default,
- never index partial secret text for search unless explicitly enabled,
- sort by newest / last opened,
- duplicate entry action,
- delete single entry,
- purge expired entries automatically on app launch and periodically while app is open.

---

## 6. Purge features

### Manual purge

- delete single item,
- delete selected items,
- purge all history,
- panic button: instant wipe all local secrets.

### Automatic purge settings

User can configure:

- do not store history,
- purge on tab close best-effort,
- purge after 10 minutes,
- purge after 1 hour,
- purge after 24 hours,
- purge after 7 days,
- custom duration.

### Suggested default

- History enabled by default.
- Default TTL: **1 hour**.
- User can disable history entirely or choose a different purge policy.
- Show a clear note that locally stored data remains on the device until purged or expired.

---

## 7. Print and PDF export

### Print requirements

- use browser print dialog,
- printable CSS optimized for A4 and Letter,
- remove buttons and UI chrome in print mode,
- page breaks between entries,
- monospaced font for exact secret view,
- high contrast, black-on-white by default,
- optional “concealed mode” where only the character table prints, not the continuous exact string.

### PDF requirements

- no custom PDF engine required in v1,
- rely on browser print-to-PDF,
- layout must be consistent enough that PDF output is clean.

### Print safety reminders

Before printing, show a warning:

- printer memory / office printers may retain jobs,
- PDFs saved to disk may be sensitive,
- printed pages should be stored securely.

---

## 8. Offline capability and PWA requirements

- App should work offline after first load.
- PWA support is required for MVP.
- Use a service worker for static asset caching and offline availability.
- No network access required for core functionality after install / initial load.
- Show offline-ready status.
- Provide installable PWA metadata and icons.
- Support standalone launch on supported devices.
- Keep the PWA implementation simple and privacy-friendly.
- Do not introduce background sync or remote telemetry.

---

## 9. UI / UX requirements

## Design direction

- minimal,
- calm,
- trustworthy,
- technical but not intimidating,
- works well on desktop first, mobile second.

## Main screens

### A. Home / workspace

- new secret form,
- preview panel,
- recent local entries,
- purge controls,
- settings shortcut.

### B. Secret detail

- exact view,
- character table,
- NATO table,
- print button,
- duplicate,
- delete.

### C. Print preview

- clean printable layout,
- page margin preview,
- print now action.

### D. Settings

- history on/off,
- auto purge policy,
- active phonetic profile selector,
- personal profile customization editor,
- optional encryption on/off,
- default print preferences,
- warning/privacy settings.

## Visual details

- monospaced font for secrets,
- bigger spacing for similar-looking characters,
- visually distinguish `O` from `0`, `I` from `l`, `S` from `5` where possible,
- accessible contrast,
- keyboard-friendly navigation.

---

## 10. Accessibility requirements

- fully keyboard navigable,
- labels for all controls,
- aria-live only where useful,
- print output readable with large fonts,
- support screen readers for mapping tables,
- no color-only distinctions,
- copy buttons with confirmation.

---

## 11. Technical specification

## Suggested stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** simple CSS modules, Tailwind, or lightweight design tokens
- **Storage:** IndexedDB via small wrapper library or native API
- **Routing:** optional, lightweight
- **Hosting:** GitHub Pages
- **PWA:** service worker + web app manifest
- **Configuration:** static JSON config files for instance-level phonetic profile overrides

### Suggested libraries

- IndexedDB wrapper: `idb` or `Dexie`
- Print styling: native `window.print()` + print CSS
- Optional schema validation: `zod`
- Optional state management: simple React context or Zustand

### Strong recommendation

Keep dependencies minimal because this app handles secrets.

---

## 12. Proposed information architecture

### Routes

- `/` — main app
- `/print/:id` — print-friendly entry view
- `/settings` — privacy, purge, display settings
- `/about` — privacy model and usage warnings

Since it is a GitHub Pages static app, routes may need SPA fallback handling or hash routing.

Safer/simple option:

- use a single-page app with internal views,
- or use hash routing.

---

## 13. Data model

```ts
interface SecretEntry {
  id: string;
  title?: string;
  category?:
    | "password"
    | "recovery-code"
    | "seed-fragment"
    | "api-key"
    | "wifi"
    | "other";
  secretCiphertext?: string; // if encrypted
  secretPlaintext?: string; // only if encryption disabled
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
  expiresAt?: string | null;
  purgePolicy?: {
    mode: "never-store" | "manual" | "timed";
    ttlSeconds?: number;
  };
  formatting?: {
    groupSize?: number;
    lineBreakEvery?: number;
    largePrint?: boolean;
    includeExactView?: boolean;
  };
  phoneticProfileId?: string;
  encryption?: {
    enabled: boolean;
    salt?: string;
    iv?: string;
    version?: number;
  };
}

interface PhoneticProfile {
  id: string;
  label: string;
  locale?: string;
  source: "built-in" | "instance-config" | "user-custom";
  letters: Record<string, string>;
  digits: Record<string, string>;
  symbols: Record<string, string>;
}
```

---

## 14. Conversion logic requirements

For each character in the string:

1. detect character type,
2. preserve original character exactly,
3. map to display token,
4. determine case metadata if alphabetic,
5. output row object for rendering.

Suggested output structure:

```ts
interface CharacterToken {
  index: number;
  raw: string;
  type: "upper" | "lower" | "digit" | "space" | "symbol" | "unknown";
  phonetic?: string;
  spoken: string;
  caseLabel?: "capital" | "lowercase";
}
```

---

## 15. Privacy and warning copy

The app should clearly state:

- all data stays in this browser unless you print or manually export it,
- local storage is device-bound and not guaranteed secure against a compromised machine,
- printing and PDF saving create additional sensitive copies,
- shared/public computers are unsafe.

---

## 16. Edge cases to support

- empty secret blocked,
- very long strings,
- multi-line secrets,
- repeated spaces,
- leading/trailing spaces,
- mixed alphabets or Unicode symbols,
- pasted recovery code lists,
- similar-looking characters like `O/0`, `I/l/1`, `B/8`, `S/5`.

---

## 17. Recommended MVP scope

### Must have

- create entry,
- exact view,
- character-by-character view,
- configurable spoken / phonetic view,
- print-friendly layout,
- IndexedDB local history,
- default TTL of 1 hour,
- delete single entry,
- purge all,
- auto purge policy,
- per-instance phonetic JSON configuration,
- per-user phonetic profile customization,
- GitHub Pages deployment,
- PWA support,
- no-backend architecture.

### Should have

- optional local encryption for stored history,
- offline support,
- grouped formatting for long codes,
- settings screen,
- privacy warnings.

### Could have later

- import/export encrypted local backup,
- QR splitting / emergency cards,
- multilingual phonetic alphabets,
- custom word mapping for symbols,
- passphrase mode for seed phrases,
- hidden print variants.

---

## 18. Acceptance criteria

Acceptence cirteria should be guarded with set of E2E tests. Tests should cover following critical scenarios:

1. User can paste a secret and see exact, per-character, and configurable phonetic views instantly.
2. Uppercase and lowercase letters are clearly distinguished in the spoken output.
3. Symbols like hyphen and underscore are named correctly.
4. User can print a clean A4/Letter sheet via browser print.
5. User can save and reopen entries from IndexedDB when history is enabled.
6. User can purge one or all entries at any time.
7. Auto purge deletes expired items without user confusion.
8. No backend or network dependency exists for core secret handling.
9. App deploys and runs on GitHub Pages.
10. UI remains usable offline after first load.

To ensure security, tests should also verify that no secrets are sent to any server and that local storage behaves as expected under different purge policies.

### Testing

To test the app, use a combination of:

- unit tests for conversion logic,
- integration tests for storage and configuration,
- E2E tests for user flows and print output, using playwright.

---

## 19. Suggested builder brief

Build a static TypeScript web app hosted on GitHub Pages. The app lets users paste sensitive strings such as passwords or recovery codes and renders them in three forms: exact text, character-by-character breakdown, and configurable phonetic / spoken representation with case awareness and support for special symbols. It must support local-only IndexedDB history, manual purge, configurable auto purge with a default TTL of 1 hour, print-friendly CSS, PWA offline capability, per-instance JSON phonetic profile configuration, and per-user runtime customization of spoken alphabet words. Keep dependencies minimal, avoid third-party tracking, and design for privacy-first desktop usage.

---

## 20. Suggested one-sentence pitch

**PaperKey is a privacy-first static web app that converts sensitive strings into printable, phone-readable backup sheets with exact character preservation and configurable phonetic spelling.**
