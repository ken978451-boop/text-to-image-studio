import { DEFAULT_LOCALE, translate } from "./translations.js";

const promptPartNames = ["subject", "scene", "lighting", "style", "composition"];

const exportTypes = {
  image: { prefix: "text-to-image", extension: "png" },
  "privacy-receipt": { prefix: "privacy-receipt", extension: "txt" },
};

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

export function composePrompt(parts, { separator = "，" } = {}) {
  return promptPartNames
    .map((name) => (typeof parts[name] === "string" ? parts[name].trim() : ""))
    .filter(Boolean)
    .join(separator);
}

export function buildPrivacyReceipt({ prompt, model, createdAt, locale = DEFAULT_LOCALE }) {
  return [
    translate(locale, "receipt.file.title"),
    translate(locale, "receipt.file.created", { value: createdAt.toISOString() }),
    translate(locale, "receipt.file.service", { value: "OpenAI Image API" }),
    translate(locale, "receipt.file.model", { value: model }),
    translate(locale, "receipt.file.prompt", { value: prompt }),
    translate(locale, "receipt.file.storage"),
    translate(locale, "receipt.file.clear"),
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
