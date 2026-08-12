import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPrivacyReceipt,
  composePrompt,
  createExportFilename,
} from "../public/prompt-tools.js";

describe("composePrompt", () => {
  it("trims values and omits empty prompt parts", () => {
    const prompt = composePrompt({
      subject: "  一隻橘貓  ",
      scene: "雨中的台北街道",
      lighting: "  電影感霓虹燈光 ",
      style: "",
      composition: "   ",
    });

    assert.equal(prompt, "一隻橘貓，雨中的台北街道，電影感霓虹燈光");
  });

  it("returns an empty string when every part is empty", () => {
    assert.equal(
      composePrompt({ subject: "", scene: "", lighting: "", style: "", composition: "" }),
      "",
    );
  });
});

describe("buildPrivacyReceipt", () => {
  it("records the exact prompt, external service, model, and retention boundary", () => {
    const receipt = buildPrivacyReceipt({
      prompt: "月光下閱讀的橘貓",
      model: "gpt-image-2",
      createdAt: new Date("2026-08-12T06:05:09.000Z"),
    });

    assert.match(receipt, /完整提示文字：月光下閱讀的橘貓/);
    assert.match(receipt, /接收服務：OpenAI Image API/);
    assert.match(receipt, /模型：gpt-image-2/);
    assert.match(receipt, /產生時間：2026-08-12T06:05:09\.000Z/);
    assert.match(receipt, /本程式保存：不會持久保存提示文字或產生圖片/);
    assert.match(receipt, /無法撤回已傳送至 OpenAI 的資料/);
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
    assert.throws(() => createExportFilename("月光下的橘貓", new Date()), /Unknown export type/);
  });
});
