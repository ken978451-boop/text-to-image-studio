const MIN_PROMPT_LENGTH = 3;
const MAX_PROMPT_LENGTH = 1000;

export function validatePrompt(value) {
  if (typeof value !== "string") {
    return { ok: false, message: "提示文字必須是字串。" };
  }

  const prompt = value.trim();

  if (prompt.length < MIN_PROMPT_LENGTH) {
    return { ok: false, message: "提示文字至少需要 3 個字元。" };
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { ok: false, message: "提示文字不可超過 1000 個字元。" };
  }

  return { ok: true, value: prompt };
}
