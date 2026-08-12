const promptPartNames = ["subject", "scene", "lighting", "style", "composition"];

const exportTypes = {
  image: { prefix: "text-to-image", extension: "png" },
  "privacy-receipt": { prefix: "privacy-receipt", extension: "txt" },
};

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

export function composePrompt(parts) {
  return promptPartNames
    .map((name) => (typeof parts[name] === "string" ? parts[name].trim() : ""))
    .filter(Boolean)
    .join("，");
}

export function buildPrivacyReceipt({ prompt, model, createdAt }) {
  return [
    "Text to Image Studio｜隱私收據",
    `產生時間：${createdAt.toISOString()}`,
    "接收服務：OpenAI Image API",
    `模型：${model}`,
    `完整提示文字：${prompt}`,
    "本程式保存：不會持久保存提示文字或產生圖片。",
    "清除限制：清除目前頁面無法撤回已傳送至 OpenAI 的資料。",
  ].join("\n");
}

export function createExportFilename(type, createdAt) {
  const exportType = exportTypes[type];
  if (!exportType) {
    throw new Error("Unknown export type");
  }

  const timestamp = [
    createdAt.getFullYear(),
    twoDigits(createdAt.getMonth() + 1),
    twoDigits(createdAt.getDate()),
    "-",
    twoDigits(createdAt.getHours()),
    twoDigits(createdAt.getMinutes()),
    twoDigits(createdAt.getSeconds()),
  ].join("");

  return `${exportType.prefix}-${timestamp}.${exportType.extension}`;
}
