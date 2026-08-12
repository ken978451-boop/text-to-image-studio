import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

describe("browser UI contract", () => {
  it("provides labelled prompt controls and live status regions", async () => {
    const html = await readProjectFile("public/index.html");

    assert.match(html, /<label[^>]+for="prompt"/);
    assert.match(html, /<textarea[^>]+id="prompt"[^>]+maxlength="1000"/);
    assert.match(html, /id="status"[^>]+aria-live="polite"/);
    assert.match(html, /id="error-message"[^>]+role="alert"/);
    assert.match(html, /<button[^>]+id="generate-button"[^>]+type="submit"/);
  });

  it("offers a complete in-memory Traditional Chinese and English switch", async () => {
    const html = await readProjectFile("public/index.html");
    const script = await readProjectFile("public/app.js");
    const translations = await readProjectFile("public/translations.js");

    assert.match(html, /<html lang="zh-Hant">/);
    assert.match(html, /data-title-key="meta\.home\.title"/);
    assert.match(html, /data-description-key="meta\.home\.description"/);
    assert.match(html, /role="group"[^>]+data-i18n-aria-label="locale\.label"/);
    assert.match(html, /<button[^>]+data-locale="zh-Hant"[^>]+aria-pressed="true"/);
    assert.match(html, /<button[^>]+data-locale="en"[^>]+aria-pressed="false"/);
    assert.match(html, /data-i18n="home\.title"/);
    assert.match(html, /data-i18n-placeholder="prompt\.placeholder"/);
    assert.match(script, /applyTranslations\(currentLocale/);
    assert.match(script, /buildPrivacyReceipt\(\{[^}]*locale: currentLocale/s);
    assert.doesNotMatch(`${html}\n${script}\n${translations}`, /localStorage|sessionStorage|indexedDB|document\.cookie/);
  });

  it("uses semantic builder values and localized prompt fragments", async () => {
    const html = await readProjectFile("public/index.html");
    const script = await readProjectFile("public/app.js");

    for (const value of [
      "taipei-rain",
      "forest-dawn",
      "soft-natural",
      "neon-cinematic",
      "realistic-photo",
      "watercolor",
      "centered",
      "close-up",
    ]) {
      assert.match(html, new RegExp(`value="${value}"`));
    }
    assert.match(html, /data-prompt-key="builder\.scene\.taipei-rain\.prompt"/);
    assert.match(html, /data-prompt-key="builder\.style\.realistic-photo\.prompt"/);
    assert.match(script, /selectedPromptPart/);
    assert.match(script, /translate\(currentLocale, "prompt\.separator"\)/);
  });

  it("maps stable API error codes and does not display server error messages", async () => {
    const script = await readProjectFile("public/app.js");

    assert.match(script, /translationKeyForApiError\(body\?\.error\?\.code\)/);
    assert.doesNotMatch(script, /body\?\.error\?\.message/);
  });

  it("loads only local scripts and avoids unsafe HTML rendering", async () => {
    const html = await readProjectFile("public/index.html");
    const script = await readProjectFile("public/app.js");

    assert.match(html, /<script type="module" src="\/app\.js"><\/script>/);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/);
    assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|document\.write/);
  });

  it("discloses external data flow and provides explicit clearing and exports", async () => {
    const html = await readProjectFile("public/index.html");
    const script = await readProjectFile("public/app.js");
    const styles = await readProjectFile("public/styles.css");

    assert.match(html, /data-i18n="privacy\.note\.body"/);
    assert.match(html, /href="\/transparency\.html"/);
    assert.match(html, /<button[^>]+id="clear-button"[^>]+type="button"/);
    assert.match(script, /resultImage\.removeAttribute\("src"\)/);
    assert.match(script, /promptInput\.value = ""/);
    for (const action of ["download-image", "copy-prompt", "download-receipt"]) {
      assert.match(html, new RegExp(`id="${action}"[^>]+type="button"`));
    }
    assert.match(html, /id="privacy-receipt"[^>]+hidden/);
    assert.match(script, /navigator\.clipboard\.writeText/);
    assert.match(script, /new Blob\(\[currentReceipt\]/);
    assert.match(styles, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s);
  });
});

