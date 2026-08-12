import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  normalizeLocale,
  translate,
  translations,
} from "../public/translations.js";

describe("translations", () => {
  it("defaults to Traditional Chinese and supports English", () => {
    assert.equal(DEFAULT_LOCALE, "zh-Hant");
    assert.deepEqual(SUPPORTED_LOCALES, ["zh-Hant", "en"]);
    assert.equal(normalizeLocale("en"), "en");
    assert.equal(normalizeLocale("fr"), "zh-Hant");
  });

  it("keeps both locale dictionaries complete and non-empty", () => {
    const chineseKeys = Object.keys(translations["zh-Hant"]).sort();
    const englishKeys = Object.keys(translations.en).sort();

    assert.deepEqual(englishKeys, chineseKeys);
    assert.ok(chineseKeys.length >= 100);
    for (const locale of SUPPORTED_LOCALES) {
      for (const [key, value] of Object.entries(translations[locale])) {
        assert.equal(typeof value, "string", `${locale}:${key} must be a string`);
        assert.ok(value.trim(), `${locale}:${key} must not be empty`);
      }
    }
  });

  it("translates stable keys and replaces named values", () => {
    assert.equal(translate("zh-Hant", "actions.generate"), "產生圖片");
    assert.equal(translate("en", "actions.generate"), "Generate image");
    assert.equal(
      translate("en", "result.caption", { prompt: "A red fox" }),
      "Prompt: A red fox",
    );
  });

  it("throws when a translation key is missing", () => {
    assert.throws(() => translate("en", "missing.key"), /Missing translation/);
  });
});

