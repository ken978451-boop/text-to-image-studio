# Contributing

Thank you for helping improve Text to Image Studio. Keep changes small, readable, and consistent with its privacy-first local scope.

## Development Setup

```powershell
npm install --ignore-scripts
npm test
Copy-Item .env.example .env
npm start
```

Tests use a fake image generator and must not call the live OpenAI API.

## Privacy and Security Requirements

- Never commit API keys, personal prompts, generated images containing private data, or `.env` files.
- Do not log request bodies, prompts, image data, authorization headers, or API responses.
- Do not add analytics, tracking, cookies, persistent storage, accounts, or a new external service without prior design discussion and updates to `PRIVACY.md` and `THREAT-MODEL.md`.
- Keep the API key server-side and preserve `Cache-Control: no-store` on API responses.
- Use safe DOM APIs for untrusted content; do not render prompts or errors with `innerHTML`.
- Add or update tests for every behavior change.

## Pull Requests

1. Explain the user problem and the smallest change that solves it.
2. Describe privacy and security impact, including any new data flow.
3. Run `npm test` and `npm audit --omit=dev`.
4. Keep unrelated formatting or refactoring out of the change.

Use GitHub Issues for non-sensitive bugs and feature proposals. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
