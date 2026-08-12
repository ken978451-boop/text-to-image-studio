# Privacy

## Summary

Text to Image Studio is designed for local, transient use. It has no user accounts, application database, analytics, advertising, or tracking code. It is not an offline image generator: a submitted prompt is sent to OpenAI.

## Data Flow

1. You type a prompt in the browser. The prompt remains in the page until you submit it.
2. If you use the optional builder, the browser combines those fields locally. Applying the builder does not make a network request.
3. When you select **Generate**, the browser sends the final prompt to the local Node.js server.
4. The server validates the prompt and sends it to the OpenAI Image API using the server-side API key.
5. OpenAI returns encoded image data. The server forwards it to the current browser page.
6. The page displays the image and a privacy receipt in memory. Selecting **Clear screen**, reloading, or closing the page removes the application's active references.
7. Only explicit export actions create a PNG download, copy the prompt to the operating-system clipboard, or download a receipt containing the prompt.

## What This Application Does Not Automatically Persist

This repository does not include code that intentionally writes prompts or generated images to:

- a database or server-side file;
- cookies;
- `localStorage`, `sessionStorage`, or IndexedDB;
- analytics, advertising, or telemetry services; or
- application request logs.

The Traditional Chinese and English language choice is also kept only in current page memory. Switching language does not write a cookie or browser-storage value and does not translate or transmit the user's prompt.

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
- **Download PNG**, **Copy prompt**, and **Download privacy receipt** create user-controlled copies outside the page. The receipt and clipboard copy contain the full prompt. Clear those copies using your operating system if they are no longer needed.
- Keep the default `HOST=127.0.0.1` for local-only access.

## Changes to This Privacy Model

A contribution that adds storage, accounts, analytics, logging of request bodies, or another external service must update this document and receive explicit review before it is merged.

The running application provides the same boundaries in both languages at `/transparency.html`, with direct links to the source and tests that implement them. That page is an inspectable project explanation, not a certification or guarantee about OpenAI, hosting infrastructure, or the user's environment.
