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

    assert.match(html, /<script type="module" src="\/app\.js"><\/script>/);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/);
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

  it("offers an optional browser-only prompt builder without replacing direct entry", async () => {
    const html = await readFile(new URL("public/index.html", projectRoot), "utf8");
    const script = await readFile(new URL("public/app.js", projectRoot), "utf8");

    assert.match(html, /<script[^>]+type="module"[^>]+src="\/app\.js"/);
    assert.match(html, /<details[^>]+id="prompt-builder"/);
    assert.match(html, /需要靈感？使用提示詞建構器/);
    assert.match(html, /id="builder-subject"[^>]+maxlength="200"/);
    for (const field of ["scene", "lighting", "style", "composition"]) {
      assert.match(html, new RegExp(`<select[^>]+id="builder-${field}"`));
    }
    assert.match(html, /所有組合都只在這個瀏覽器頁面中進行/);
    assert.match(html, /id="apply-builder-button"[^>]+type="button"/);
    assert.match(script, /import \{[^}]*composePrompt[^}]*\} from "\.\/prompt-tools\.js"/s);
    assert.match(script, /window\.confirm/);
  });

  it("provides explicit exports and an on-page privacy receipt after generation", async () => {
    const html = await readFile(new URL("public/index.html", projectRoot), "utf8");
    const script = await readFile(new URL("public/app.js", projectRoot), "utf8");
    const styles = await readFile(new URL("public/styles.css", projectRoot), "utf8");

    assert.match(html, /id="export-actions"[^>]+hidden/);
    assert.match(html, /id="export-actions"[^>]+role="group"[^>]+aria-label="成果匯出"/);
    for (const action of ["download-image", "copy-prompt", "download-receipt"]) {
      assert.match(html, new RegExp(`id="${action}"[^>]+type="button"`));
    }
    assert.match(html, /id="privacy-receipt"[^>]+hidden/);
    assert.match(html, /id="receipt-prompt"/);
    assert.match(html, /id="receipt-created-at"/);
    assert.match(html, /無法撤回已傳送至 OpenAI 的資料/);
    assert.match(
      script,
      /import \{[^}]*buildPrivacyReceipt[^}]*createExportFilename[^}]*\} from "\.\/prompt-tools\.js"/s,
    );
    assert.match(script, /navigator\.clipboard\.writeText/);
    assert.match(script, /new Blob\(\[currentReceipt\]/);
    assert.match(script, /receiptPrompt\.textContent = prompt/);
    assert.match(script, /privacyReceipt\.hidden = false/);
    assert.match(script, /privacyReceipt\.hidden = true/);
    assert.match(styles, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s);
  });
});
