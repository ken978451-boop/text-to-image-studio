import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyTranslations,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  normalizeLocale,
  translationKeyForApiError,
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

  it("maps stable API error codes without relying on server messages", () => {
    assert.equal(translationKeyForApiError("VALIDATION_ERROR"), "errors.validation");
    assert.equal(translationKeyForApiError("RATE_LIMITED"), "errors.rateLimited");
    assert.equal(translationKeyForApiError("IMAGE_GENERATION_FAILED"), "errors.generationFailed");
    assert.equal(translationKeyForApiError("UNKNOWN"), "errors.generic");
  });

  it("updates document-owned text and attributes for the active locale", () => {
    const textElement = { dataset: { i18n: "actions.generate" }, textContent: "" };
    const placeholderElement = {
      dataset: { i18nPlaceholder: "prompt.placeholder" },
      placeholder: "",
      setAttribute(name, value) {
        this[name] = value;
      },
    };
    const ariaElement = {
      dataset: { i18nAriaLabel: "locale.label" },
      setAttribute(name, value) {
        this[name] = value;
      },
    };
    const metaElement = { content: "" };
    const fakeDocument = {
      documentElement: { lang: "zh-Hant" },
      title: "",
      body: {
        dataset: {
          titleKey: "meta.home.title",
          descriptionKey: "meta.home.description",
        },
      },
      querySelector(selector) {
        return selector === 'meta[name="description"]' ? metaElement : null;
      },
      querySelectorAll(selector) {
        return {
          "[data-i18n]": [textElement],
          "[data-i18n-placeholder]": [placeholderElement],
          "[data-i18n-aria-label]": [ariaElement],
        }[selector] ?? [];
      },
    };

    applyTranslations("en", fakeDocument);

    assert.equal(fakeDocument.documentElement.lang, "en");
    assert.equal(fakeDocument.title, "Text to Image Studio");
    assert.match(metaElement.content, /privacy-first/);
    assert.equal(textElement.textContent, "Generate image");
    assert.match(placeholderElement.placeholder, /Shiba Inu/);
    assert.equal(ariaElement["aria-label"], "Choose interface language");
  });
});
