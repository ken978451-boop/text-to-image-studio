import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPrivacyReceipt,
  composePrompt,
  createExportFilename,
} from "../public/prompt-tools.js";

describe("composePrompt", () => {
  it("trims values, omits empty parts, and accepts a localized separator", () => {
    const parts = {
      subject: "  一隻柴犬 ",
      scene: "台北雨夜街道",
      lighting: "  電影感霓虹光線 ",
      style: "",
      composition: "   ",
    };

    assert.equal(composePrompt(parts), "一隻柴犬，台北雨夜街道，電影感霓虹光線");
    assert.equal(
      composePrompt(parts, { separator: ", " }),
      "一隻柴犬, 台北雨夜街道, 電影感霓虹光線",
    );
  });

  it("returns an empty string when every part is empty", () => {
    assert.equal(
      composePrompt({ subject: "", scene: "", lighting: "", style: "", composition: "" }),
      "",
    );
  });
});

describe("buildPrivacyReceipt", () => {
  const receiptInput = {
    prompt: "一隻穿雨衣的柴犬",
    model: "gpt-image-2",
    createdAt: new Date("2026-08-12T06:05:09.000Z"),
  };

  it("records the exact prompt and boundaries in Traditional Chinese", () => {
    const receipt = buildPrivacyReceipt({ ...receiptInput, locale: "zh-Hant" });

    assert.match(receipt, /實際送出的提示：一隻穿雨衣的柴犬/);
    assert.match(receipt, /外部服務：OpenAI Image API/);
    assert.match(receipt, /模型：gpt-image-2/);
    assert.match(receipt, /產生時間：2026-08-12T06:05:09\.000Z/);
    assert.match(receipt, /不會加入資料庫/);
    assert.match(receipt, /OpenAI/);
  });

  it("records the same exact prompt and boundaries in English", () => {
    const receipt = buildPrivacyReceipt({ ...receiptInput, locale: "en" });

    assert.match(receipt, /Exact prompt sent: 一隻穿雨衣的柴犬/);
    assert.match(receipt, /External service: OpenAI Image API/);
    assert.match(receipt, /Model: gpt-image-2/);
    assert.match(receipt, /Created at: 2026-08-12T06:05:09\.000Z/);
    assert.match(receipt, /does not add database storage/);
    assert.match(receipt, /OpenAI/);
  });
});

describe("createExportFilename", () => {
  it("creates neutral timestamped names without prompt content", () => {
    const createdAt = new Date(2026, 7, 12, 14, 5, 9);

    assert.equal(createExportFilename("image", createdAt), "text-to-image-20260812-140509.png");
    assert.equal(
      createExportFilename("privacy-receipt", createdAt),
      "privacy-receipt-20260812-140509.txt",
    );
  });

  it("rejects unknown export types", () => {
    assert.throws(() => createExportFilename("unknown", new Date()), /Unknown export type/);
  });
});

