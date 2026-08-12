import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { createApp } from "../src/app.js";

let server;

afterEach(() => {
  server?.close();
  server = undefined;
});

async function postImage(body, generateImage) {
  const app = createApp({ generateImage, rateLimitEnabled: false });
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const { port } = server.address();
  return fetch(`http://127.0.0.1:${port}/api/images`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/images", () => {
  it("returns a generated PNG for a valid prompt", async () => {
    let receivedPrompt;
    const response = await postImage(
      { prompt: "  a friendly robot  " },
      async (prompt) => {
        receivedPrompt = prompt;
        return { imageBase64: "cG5n", mimeType: "image/png" };
      },
    );

    assert.equal(response.status, 200);
    assert.equal(receivedPrompt, "a friendly robot");
    assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-powered-by"), null);
    assert.deepEqual(await response.json(), {
      data: { imageBase64: "cG5n", mimeType: "image/png" },
    });
  });

  it("returns a consistent validation error for an invalid prompt", async () => {
    const response = await postImage({ prompt: " " }, async () => {
      throw new Error("should not be called");
    });

    assert.equal(response.status, 422);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), {
      error: {
        code: "VALIDATION_ERROR",
        message: "提示文字至少需要 3 個字元。",
      },
    });
  });

  it("prevents caching malformed request errors", async () => {
    const app = createApp({
      generateImage: async () => {
        throw new Error("should not be called");
      },
      rateLimitEnabled: false,
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));

    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/images`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    assert.equal(response.status, 400);
    assert.equal(response.headers.get("cache-control"), "no-store");
  });

  it("returns a generic error when the image service is unavailable", async () => {
    const response = await postImage({ prompt: "a tiny red kite" }, async () => {
      throw new Error("secret upstream details");
    });

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), {
      error: {
        code: "IMAGE_GENERATION_FAILED",
        message: "目前無法產生圖片，請稍後再試。",
      },
    });
  });

  it("limits repeated image requests to control API spending", async () => {
    const app = createApp({
      generateImage: async () => ({ imageBase64: "cG5n", mimeType: "image/png" }),
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));

    const { port } = server.address();
    let response;
    for (let requestNumber = 0; requestNumber < 6; requestNumber += 1) {
      response = await fetch(`http://127.0.0.1:${port}/api/images`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: "a small paper boat" }),
      });
    }

    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), {
      error: {
        code: "RATE_LIMITED",
        message: "產生圖片的次數過多，請稍後再試。",
      },
    });
  });
});
