import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validatePrompt } from "../src/validation.js";

describe("validatePrompt", () => {
  it("accepts and trims a prompt from 3 to 1000 characters", () => {
    assert.deepEqual(validatePrompt("  a quiet mountain lake  "), {
      ok: true,
      value: "a quiet mountain lake",
    });
  });

  it("rejects values that are not strings", () => {
    assert.deepEqual(validatePrompt(42), {
      ok: false,
      message: "提示文字必須是字串。",
    });
  });

  it("rejects prompts shorter than 3 characters after trimming", () => {
    assert.deepEqual(validatePrompt("  a "), {
      ok: false,
      message: "提示文字至少需要 3 個字元。",
    });
  });

  it("rejects prompts longer than 1000 characters", () => {
    assert.deepEqual(validatePrompt("a".repeat(1001)), {
      ok: false,
      message: "提示文字不可超過 1000 個字元。",
    });
  });
});
