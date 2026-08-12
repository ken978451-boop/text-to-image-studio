import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

describe("transparency center contract", () => {
  it("provides a bilingual, non-persistent transparency page", async () => {
    const html = await readProjectFile("public/transparency.html");
    const script = await readProjectFile("public/transparency.js");

    assert.match(html, /<html lang="zh-Hant">/);
    assert.match(html, /data-title-key="meta\.transparency\.title"/);
    assert.match(html, /data-description-key="meta\.transparency\.description"/);
    assert.match(html, /<script type="module" src="\/transparency\.js"><\/script>/);
    assert.match(html, /data-locale="zh-Hant"[^>]+aria-pressed="true"/);
    assert.match(html, /data-locale="en"[^>]+aria-pressed="false"/);
    assert.match(script, /applyTranslations/);
    assert.doesNotMatch(`${html}\n${script}`, /localStorage|sessionStorage|indexedDB|document\.cookie/);
  });

  it("explains the complete data flow, safeguards, and limitations", async () => {
    const html = await readProjectFile("public/transparency.html");

    for (const key of [
      "transparency.flow.title",
      "transparency.flow.browser.body",
      "transparency.flow.server.body",
      "transparency.flow.openai.body",
      "transparency.processed.title",
      "transparency.notAdded.title",
      "transparency.safeguards.title",
      "transparency.limits.title",
      "transparency.verify.title",
      "transparency.verify.disclaimer",
    ]) {
      assert.match(html, new RegExp(`data-i18n="${key.replaceAll(".", "\\.")}"`));
    }
  });

  it("links claims to inspectable source, tests, and boundary documents", async () => {
    const html = await readProjectFile("public/transparency.html");
    const repositoryBase = "https://github.com/ken978451-boop/text-to-image-studio/blob/main/";

    for (const path of [
      "src/image-service.js",
      "src/app.js",
      "test/api.test.js",
      "test/ui-contract.test.js",
      "public/prompt-tools.js",
      "THREAT-MODEL.md",
      "PRIVACY.md",
    ]) {
      assert.match(html, new RegExp(`${repositoryBase}${path.replaceAll(".", "\\.")}`));
    }
  });

  it("does not present privacy certification or guarantee claims", async () => {
    const html = await readProjectFile("public/transparency.html");

    assert.doesNotMatch(html, /100% private|certified private|privacy guaranteed|隱私保證|通過隱私認證/i);
  });
});

