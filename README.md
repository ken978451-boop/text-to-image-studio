# Text to Image Studio

A small, readable, privacy-first example of integrating the OpenAI Image API. The application runs on your computer, keeps the API key on the server, and does not add accounts, analytics, or an application database.

This project is local-first, not offline. When you submit a prompt, the server sends it to OpenAI to generate the image.

## Features

- Keeps the API key on the server and never exposes it to browser code or responses.
- Does not persist prompts or generated images in an application database or browser storage.
- Marks all API responses `Cache-Control: no-store` and provides a clear-screen action.
- Binds to `127.0.0.1` by default to avoid unintended local-network access.
- Validates prompts on the server and limits them to 3–1,000 characters.
- Limits image generation to five requests every 15 minutes to reduce accidental API spending.
- Uses a low-quality 1024 × 1024 PNG as a cost-conscious default.
- Includes a Content Security Policy, other security headers, consistent error responses, and validation of third-party API data.
- Supports keyboard navigation and responsive layouts from 320px to 1440px.

## Privacy Model

The prompt travels from your browser to this local server and then to the OpenAI Image API only after you select **Generate**. The generated image returns to the current browser page. This application does not intentionally write the prompt or image to disk, a database, cookies, browser storage, or analytics services.

The in-memory rate limiter temporarily processes a client network address for up to 15 minutes. OpenAI and any hosting or network provider are outside this project's storage boundary and may process data under their own policies. Do not enter secrets, personal data, or confidential material in a prompt.

See [Privacy](PRIVACY.md) for the exact data flow and limitations, [Security](SECURITY.md) for vulnerability reporting, and the [Threat Model](THREAT-MODEL.md) for risks and mitigations.

## Requirements

- Node.js 22 or later
- An OpenAI API key; access to GPT Image models may require OpenAI organization verification
- Available API credits or billing; each generated image is billed according to the selected model and settings

## Quick Start

```powershell
git clone https://github.com/ken978451-boop/text-to-image-studio.git
cd text-to-image-studio
npm install --ignore-scripts
Copy-Item .env.example .env
```

Edit `.env` and replace `<your-api-key>` with your OpenAI API key, then start the application:

```powershell
npm start
```

Open <http://127.0.0.1:3000>.

On macOS or Linux, use:

```bash
cp .env.example .env
npm start
```

Keep the default `HOST=127.0.0.1` for private local use. A public container deployment may require `HOST=0.0.0.0`, but doing so changes the threat and privacy model and requires HTTPS, access control, deployment-specific logging review, and stronger abuse protection.

## Testing and Security Checks

```powershell
npm test
npm audit --omit=dev
```

The test suite uses a fake image generator. It does not call the live OpenAI API or incur API charges.

## API Contract

`POST /api/images`

```json
{
  "prompt": "A Shiba Inu wearing a yellow raincoat on a rainy Taipei street at night"
}
```

Successful response:

```json
{
  "data": {
    "imageBase64": "...",
    "mimeType": "image/png"
  }
}
```

Errors consistently use the following structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Localized validation message"
  }
}
```

The current web interface and user-facing validation messages are written in Traditional Chinese. Project documentation is provided in English for international contributors and reviewers.

## Project Documents

- [Privacy](PRIVACY.md)
- [Security](SECURITY.md)
- [Threat Model](THREAT-MODEL.md)
- [Contributing](CONTRIBUTING.md)
- [Specification](SPEC.md)

## References

- [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [GPT Image 2 model](https://developers.openai.com/api/docs/models/gpt-image-2)
- [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy/)

## License

[MIT](LICENSE)
