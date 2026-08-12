# Specification: Text to Image Studio

## Objective

Provide a public, privacy-first reference application that helps people who are new to prompting create an image, understand the external data flow, and keep a reproducible result. The application runs locally and calls the OpenAI Image API only after the user submits the final prompt.

## Technology

- Node.js 22 or later
- Express for static assets and `POST /api/images`
- Official OpenAI JavaScript SDK with `gpt-image-2`
- Native HTML, CSS, and JavaScript modules
- Node.js built-in `node:test`

## Product Behavior

- Direct prompt entry remains the primary path.
- An optional builder combines subject, scene, lighting, style, and composition entirely in the browser.
- Applying builder choices never sends data or overwrites manual text without confirmation.
- Generation sends one validated prompt to the local server and then to OpenAI.
- A successful result displays the PNG and a privacy receipt for that exact generation.
- Users may explicitly download the PNG, copy the generation prompt, or download the receipt.
- Clearing removes prompt, builder, image, and receipt references from the current page.

## Privacy and Security Boundaries

- No accounts, application database, cookies, analytics, tracking, or browser persistence APIs.
- The API key exists only in the server environment.
- All API responses use `Cache-Control: no-store`.
- Prompt and third-party API output are rendered with safe DOM properties, never HTML injection APIs.
- Export filenames contain a neutral prefix and timestamp, never prompt text.
- User-created downloads and clipboard copies exist outside the page and are not removed by the clear action.
- Requests are size-limited, prompt-validated, rate-limited, and protected with security headers.

## Verification

- Unit tests cover prompt validation, prompt composition, receipt content, and export filenames.
- API tests cover success, invalid input, malformed JSON, external failure, rate limiting, and no-store headers.
- UI contract tests cover accessibility labels, local scripts, data-flow disclosure, safe rendering, builder controls, exports, receipt state, and clear behavior.
- Real-browser checks cover the complete creation flow, console output, keyboard-accessible controls, and responsive widths from 320px to 1440px.
- Tests use a fake image generator and do not call OpenAI or incur API charges.

## Commands

```powershell
npm install --ignore-scripts
npm start
npm test
npm audit --omit=dev
```

## Out of Scope

- User accounts, cloud history, or public galleries
- A second AI call for prompt rewriting
- Prompt text in filenames or image metadata
- A local image model
- Public multi-user deployment hardening
