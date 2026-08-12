# Text to Image Studio

A small, readable, privacy-first example of integrating the OpenAI Image API. The application runs on your computer, keeps the API key on the server, and does not add accounts, analytics, or an application database.

This project is local-first, not offline. When you submit a prompt, the server sends it to OpenAI to generate the image.

## Features

- Offers an optional browser-only builder for subject, scene, lighting, style, and composition.
- Keeps the API key on the server and never exposes it to browser code or responses.
- Does not persist prompts or generated images in an application database or browser storage.
- Marks all API responses `Cache-Control: no-store` and provides a clear-screen action.
- Displays a plain-language privacy receipt after generation.
- Lets users explicitly download the PNG, copy the exact generation prompt, or download the receipt.
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

## Using the Workspace

1. Write a prompt directly or open the optional prompt builder. Applying builder choices only updates the current browser page and does not call OpenAI.
2. Review the final prompt, then select **Generate**. This is the point at which the prompt is sent to OpenAI.
3. Download the PNG, copy the exact generation prompt, or download the plain-text privacy receipt if desired.
4. Select **Clear screen** to remove the prompt, builder values, image, and receipt from the current page.

Downloads and clipboard copies are controlled by the user and exist outside the application's page state. Clearing the page does not delete those copies.

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
