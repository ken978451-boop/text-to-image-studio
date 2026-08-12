# Privacy

## Summary

Text to Image Studio is designed for local, transient use. It has no user accounts, application database, analytics, advertising, or tracking code. It is not an offline image generator: a submitted prompt is sent to OpenAI.

## Data Flow

1. You type a prompt in the browser. The prompt remains in the page until you submit it.
2. When you select **Generate**, the browser sends the prompt to the local Node.js server.
3. The server validates the prompt and sends it to the OpenAI Image API using the server-side API key.
4. OpenAI returns encoded image data. The server forwards it to the current browser page.
5. The page displays the image as an in-memory data URL. Selecting **Clear screen**, reloading, or closing the page removes the application's active references to the prompt and image.

## What This Application Does Not Persist

This repository does not include code that intentionally writes prompts or generated images to:

- a database or file;
- cookies;
- `localStorage`, `sessionStorage`, or IndexedDB;
- analytics, advertising, or telemetry services; or
- application request logs.

All `/api` responses include `Cache-Control: no-store`. This asks browsers and intermediaries not to cache them, but it cannot guarantee how every browser extension, operating system, proxy, or network product behaves.

## Transient Processing

- The prompt and image necessarily exist in process and browser memory while a request is handled and displayed. Memory release is managed by the runtime and is not a secure erase operation.
- The in-memory rate limiter uses a client network address to count requests. The counter is reset after the 15-minute window or when the server restarts, and this project does not write it to persistent storage.
- The API key is read from the server environment and used by the official OpenAI client for authentication. It is not sent to browser code.

## External Services and Deployment

OpenAI processes submitted prompts and generated output under its own terms and policies. Review the [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy/) and relevant API data controls before using sensitive material.

This project's promises cover only the code in this repository. A hosting platform, reverse proxy, firewall, browser extension, endpoint security product, or network operator may add logs or retention outside the application's control. Anyone deploying this application must document those additions and reassess the privacy model.

## User Choices and Limits

- Do not submit passwords, API keys, health information, personal identifiers, confidential business data, or material you are not authorized to share.
- **Clear screen** clears the prompt and displayed image from the current page state. It does not recall data already sent to OpenAI, remove downloaded files or screenshots, or erase external logs.
- Keep the default `HOST=127.0.0.1` for local-only access.

## Changes to This Privacy Model

A contribution that adds storage, accounts, analytics, logging of request bodies, or another external service must update this document and receive explicit review before it is merged.
