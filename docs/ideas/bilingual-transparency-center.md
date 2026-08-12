# Bilingual Transparency Center

## Problem

The studio currently serves Traditional Chinese readers only, while reviewers may need English. Privacy behavior is documented across repository files, but it is not easy for a visitor to inspect from the product itself.

## Goal

Provide a complete Traditional Chinese and English experience, plus a public transparency page that explains the application's real data flow and links each important privacy claim to inspectable source or tests.

## User experience

- Default to Traditional Chinese (`zh-Hant`).
- Provide a visible `繁中 / EN` switch in the page header.
- Change language without reloading the page.
- Keep the selected language only in current page memory; do not use cookies, `localStorage`, `sessionStorage`, or IndexedDB.
- Preserve the typed prompt, generated image, receipt, builder selections, and open state when language changes.
- Translate all product-owned visible text, form labels, helper text, builder options, status messages, errors, confirmation dialogs, accessibility labels, and privacy receipts.
- Keep user-entered prompts unchanged when language changes.
- Update the document language, title, and description for the active locale.

## Transparency page

Add `/transparency.html` with the same language control and these sections:

1. Data flow: browser to the local Node.js server to OpenAI.
2. What is processed: the exact prompt and the generated image response.
3. What this application does not add: no database, analytics, account system, prompt log, or automatic browser storage.
4. Safeguards: input limits, security headers, rate limiting, server-side API key, safe DOM rendering, and explicit exports.
5. Limitations: the application cannot control OpenAI's service-side handling, hosting infrastructure, browser extensions, network operators, or user-added changes.
6. How to verify: direct repository links to relevant source, tests, `PRIVACY.md`, and `THREAT-MODEL.md`.

The page must avoid certification, compliance, guarantee, or privacy-score claims.

## Technical approach

- Centralize translations in `public/translations.js` with stable keys and matching key sets for both locales.
- Give prompt-builder options stable semantic values; resolve their localized labels and prompt fragments at use time.
- Let prompt composition accept a locale-specific separator.
- Build privacy receipts from the active locale while preserving the exact generated prompt and timestamp.
- Map stable API error codes to client translations rather than presenting server messages directly.
- Keep current status and error identifiers so visible messages can be translated after a language switch.

## Verification

- Unit tests prove translation completeness, bilingual prompt composition, and bilingual receipts.
- UI contract tests prove the switch, semantic option values, stable error mapping, no language persistence, and transparency links.
- API tests continue to prove stable error codes and privacy-related boundaries.
- Real-browser checks cover both languages, state preservation, generation, receipt/export controls, transparency content, keyboard access, a clean console, and responsive layouts at 320, 768, 1024, and 1440 pixels.

## Out of scope

- Automatic prompt translation.
- Persisting the language choice.
- Languages beyond Traditional Chinese and English.
- Privacy scores, compliance claims, certifications, or third-party scanning.
- Inspecting or scanning the user's computer.
