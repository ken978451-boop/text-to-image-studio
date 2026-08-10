# Text to Image Studio

A small, readable, and security-conscious open-source example of integrating the OpenAI Image API. Users enter a text prompt in the web interface, the server generates an image with `gpt-image-2`, and the resulting PNG is returned to the browser.

## Features

- Keeps the API key on the server and never exposes it to browser code or responses.
- Validates prompts on the server and limits them to 3–1,000 characters.
- Limits image generation to five requests every 15 minutes to reduce accidental API spending.
- Uses a low-quality 1024 × 1024 PNG as a cost-conscious default.
- Includes a Content Security Policy, other security headers, consistent error responses, and validation of third-party API data.
- Supports keyboard navigation and responsive layouts from 320px to 1440px.

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

Open <http://localhost:3000>.

On macOS or Linux, use:

```bash
cp .env.example .env
npm start
```

## Testing and Security Checks

```powershell
npm test
npm audit --omit=dev
```

The test suite does not call the live OpenAI API and does not incur API charges.

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

The current web interface and user-facing validation messages are written in Traditional Chinese; the project documentation is provided in English for international contributors and reviewers.

## Security Notes

- `.env` is excluded by `.gitignore`. Never commit a real API key to GitHub.
- If a key ever appears in a commit or on a public page, revoke and replace it immediately. Deleting the file alone is not sufficient.
- This is an educational local application. A public deployment should use persistent or distributed rate-limit storage and configure proxy and HTTPS settings for its hosting environment.

## References

- [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [GPT Image 2 model](https://developers.openai.com/api/docs/models/gpt-image-2)

## License

[MIT](LICENSE)
