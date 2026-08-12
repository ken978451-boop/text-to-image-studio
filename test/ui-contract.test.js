import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const projectRoot = new URL("../", import.meta.url);

describe("browser UI contract", () => {
  it("provides labelled prompt controls and live status regions", async () => {
    const html = await readFile(new URL("public/index.html", projectRoot), "utf8");

    assert.match(html, /<label[^>]+for="prompt"/);
    assert.match(html, /<textarea[^>]+id="prompt"[^>]+maxlength="1000"/);
    assert.match(html, /id="status"[^>]+aria-live="polite"/);
    assert.match(html, /id="error-message"[^>]+role="alert"/);
    assert.match(html, /<button[^>]+id="generate-button"[^>]+type="submit"/);
  });

  it("loads local scripts and avoids unsafe HTML rendering", async () => {
    const html = await readFile(new URL("public/index.html", projectRoot), "utf8");
    const script = await readFile(new URL("public/app.js", projectRoot), "utf8");

    assert.match(html, /<script src="\/app\.js" defer><\/script>/);
    assert.doesNotMatch(html, /<script(?! src=)/);
    assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|document\.write/);
  });

  it("discloses the external data flow and lets users clear transient data", async () => {
    const html = await readFile(new URL("public/index.html", projectRoot), "utf8");
    const script = await readFile(new URL("public/app.js", projectRoot), "utf8");

    assert.match(html, /提示文字會在你按下產生後傳送至 OpenAI/);
    assert.match(html, /本專案不會將提示文字或圖片保存到資料庫/);
    assert.match(html, /<button[^>]+id="clear-button"[^>]+type="button"/);
    assert.match(script, /resultImage\.removeAttribute\("src"\)/);
    assert.match(script, /promptInput\.value = ""/);
    assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB/);
  });
});
