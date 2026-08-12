# Implementation Plan: Privacy-First Local Image Studio

## Overview

Evolve Text to Image Studio into a privacy-first, local OpenAI Image API reference without adding accounts, analytics, cloud storage, or a database. The application will clearly disclose that prompts are sent to OpenAI, avoid persistent application storage, prevent API responses from being cached, and give users a direct way to clear prompt and image data from the page.

## Architecture Decisions

- Keep the application local-first and stateless; no user accounts or application database.
- Keep the OpenAI API key in the server environment only.
- Treat prompts and generated images as transient data and mark API responses `no-store`.
- Do not claim the application is offline: prompts are transmitted to OpenAI when the user submits them.
- Add privacy, security, threat-model, and contribution documentation without publishing personal contact details.

## Task List

### Phase 1: Privacy behavior

- [x] Add tests requiring `Cache-Control: no-store` on image API responses.
- [x] Add an accessible clear action for prompt and generated-image data.
- [x] Add a concise in-product privacy disclosure.

### Checkpoint: Privacy behavior

- [x] Focused API and UI tests pass.
- [x] No browser persistence APIs or analytics are introduced.

### Phase 2: Public documentation

- [x] Add `PRIVACY.md`, `SECURITY.md`, `THREAT-MODEL.md`, and `CONTRIBUTING.md`.
- [x] Link privacy and security documentation from the README.
- [x] Document exactly what is and is not retained by this application.

### Checkpoint: Complete

- [x] Full test suite passes.
- [x] Dependency audit has no vulnerabilities.
- [x] Secret scan shows no credentials or personal application data.
- [ ] Changes are reviewed, committed, and published to GitHub.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Users interpret "local-first" as fully offline | High | State clearly that prompts are sent to OpenAI on submission. |
| Browser or intermediary caches image responses | Medium | Send `Cache-Control: no-store` on API responses. |
| API key is accidentally committed | High | Keep `.env` ignored, use placeholders, and scan staged changes. |
| Future hosting adds logs or telemetry | Medium | Document the privacy boundary and require disclosure before adding storage or analytics. |

## Open Questions

- A future release may offer an optional local model backend, but it is outside this privacy-foundation phase.
- A public hosted demo would require a separate privacy and abuse-prevention review.
