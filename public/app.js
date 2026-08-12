import {
  buildPrivacyReceipt,
  composePrompt,
  createExportFilename,
} from "./prompt-tools.js";
import {
  applyTranslations,
  DEFAULT_LOCALE,
  normalizeLocale,
  translate,
  translationKeyForApiError,
} from "./translations.js";

const modelName = "gpt-image-2";
const form = document.querySelector("#image-form");
const promptInput = document.querySelector("#prompt");
const characterCount = document.querySelector("#character-count");
const generateButton = document.querySelector("#generate-button");
const status = document.querySelector("#status");
const errorMessage = document.querySelector("#error-message");
const emptyState = document.querySelector("#empty-state");
const resultFigure = document.querySelector("#result-figure");
const resultImage = document.querySelector("#result-image");
const resultCaption = document.querySelector("#result-caption");
const clearButton = document.querySelector("#clear-button");
const exportActions = document.querySelector("#export-actions");
const downloadImageButton = document.querySelector("#download-image");
const copyPromptButton = document.querySelector("#copy-prompt");
const downloadReceiptButton = document.querySelector("#download-receipt");
const privacyReceipt = document.querySelector("#privacy-receipt");
const receiptPrompt = document.querySelector("#receipt-prompt");
const receiptCreatedAt = document.querySelector("#receipt-created-at");
const promptBuilder = document.querySelector("#prompt-builder");
const builderSubject = document.querySelector("#builder-subject");
const builderScene = document.querySelector("#builder-scene");
const builderLighting = document.querySelector("#builder-lighting");
const builderStyle = document.querySelector("#builder-style");
const builderComposition = document.querySelector("#builder-composition");
const builderStatus = document.querySelector("#builder-status");
const applyBuilderButton = document.querySelector("#apply-builder-button");
const languageButtons = [...document.querySelectorAll("[data-locale]")];
const builderControls = [
  builderSubject,
  builderScene,
  builderLighting,
  builderStyle,
  builderComposition,
];

let currentLocale = DEFAULT_LOCALE;
let lastAppliedPrompt = "";
let currentGeneratedPrompt = "";
let currentReceipt = "";
let currentCreatedAt;
let currentStatusKey = "";
let currentStatusValues = {};
let currentErrorKey = "";
let currentBuilderStatusKey = "";

class LocalizedError extends Error {
  constructor(translationKey) {
    super(translationKey);
    this.translationKey = translationKey;
  }
}

function formatReceiptDate(date) {
  const locale = currentLocale === "en" ? "en-US" : "zh-TW";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function setStatus(key, values = {}) {
  currentStatusKey = key;
  currentStatusValues = values;
  status.textContent = key ? translate(currentLocale, key, values) : "";
}

function setBuilderStatus(key) {
  currentBuilderStatusKey = key;
  builderStatus.textContent = key ? translate(currentLocale, key) : "";
}

function showErrorKey(key) {
  currentErrorKey = key;
  const message = translate(currentLocale, key);
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  setStatus("status.failed", { message });
  errorMessage.focus();
}

function clearError() {
  currentErrorKey = "";
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function renderDynamicContent() {
  if (currentGeneratedPrompt) {
    resultCaption.textContent = translate(currentLocale, "result.caption", {
      prompt: currentGeneratedPrompt,
    });
  }
  if (currentCreatedAt) {
    receiptCreatedAt.textContent = formatReceiptDate(currentCreatedAt);
    currentReceipt = buildPrivacyReceipt({
      prompt: currentGeneratedPrompt,
      model: modelName,
      createdAt: currentCreatedAt,
      locale: currentLocale,
    });
  }
  if (currentBuilderStatusKey) {
    builderStatus.textContent = translate(currentLocale, currentBuilderStatusKey);
  }
  if (currentErrorKey) {
    const message = translate(currentLocale, currentErrorKey);
    errorMessage.textContent = message;
    status.textContent = translate(currentLocale, "status.failed", { message });
  } else if (currentStatusKey) {
    status.textContent = translate(currentLocale, currentStatusKey, currentStatusValues);
  }
}

function setLocale(locale) {
  currentLocale = normalizeLocale(locale);
  applyTranslations(currentLocale);
  renderDynamicContent();
}

function updatePromptState() {
  const length = promptInput.value.length;
  const isValid = promptInput.value.trim().length >= 3 && length <= 1000;
  characterCount.textContent = `${length} / 1000`;
  generateButton.disabled = !isValid || generateButton.getAttribute("aria-busy") === "true";
}

function setBusy(isBusy) {
  generateButton.setAttribute("aria-busy", String(isBusy));
  promptInput.readOnly = isBusy;
  generateButton.disabled = isBusy;
  applyBuilderButton.disabled = isBusy;
  for (const control of builderControls) {
    control.disabled = isBusy;
  }

  if (isBusy) {
    setStatus("status.generating");
  } else {
    updatePromptState();
  }
}

function selectedPromptPart(select) {
  const promptKey = select.selectedOptions[0]?.dataset.promptKey;
  return promptKey ? translate(currentLocale, promptKey) : "";
}

function triggerDownload(source, filename) {
  const link = document.createElement("a");
  link.href = source;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.className = "sr-only";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) {
    throw new Error("Copy command was rejected");
  }
}

for (const button of languageButtons) {
  button.addEventListener("click", () => setLocale(button.dataset.locale));
}

promptInput.addEventListener("input", () => {
  updatePromptState();
  setBuilderStatus("");
});

applyBuilderButton.addEventListener("click", () => {
  const composedPrompt = composePrompt(
    {
      subject: builderSubject.value,
      scene: selectedPromptPart(builderScene),
      lighting: selectedPromptPart(builderLighting),
      style: selectedPromptPart(builderStyle),
      composition: selectedPromptPart(builderComposition),
    },
    { separator: translate(currentLocale, "prompt.separator") },
  );

  if (!composedPrompt) {
    setBuilderStatus("builder.status.missing");
    builderSubject.focus();
    return;
  }

  const currentPrompt = promptInput.value.trim();
  const hasManualChanges = currentPrompt && currentPrompt !== lastAppliedPrompt;
  if (hasManualChanges && !window.confirm(translate(currentLocale, "builder.status.confirm"))) {
    setBuilderStatus("builder.status.cancelled");
    return;
  }

  promptInput.value = composedPrompt;
  lastAppliedPrompt = composedPrompt;
  setBuilderStatus("builder.status.applied");
  clearError();
  updatePromptState();
  promptInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const prompt = promptInput.value.trim();
  if (prompt.length < 3 || prompt.length > 1000) {
    showErrorKey("errors.validation");
    return;
  }

  setBusy(true);

  try {
    const response = await fetch("/api/images", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const body = await response.json();

    if (!response.ok) {
      throw new LocalizedError(translationKeyForApiError(body?.error?.code));
    }

    const imageBase64 = body?.data?.imageBase64;
    const mimeType = body?.data?.mimeType;
    if (typeof imageBase64 !== "string" || mimeType !== "image/png") {
      throw new LocalizedError("errors.invalidImage");
    }

    resultImage.src = `data:${mimeType};base64,${imageBase64}`;
    currentGeneratedPrompt = prompt;
    currentCreatedAt = new Date();
    receiptPrompt.textContent = prompt;
    emptyState.hidden = true;
    resultFigure.hidden = false;
    exportActions.hidden = false;
    privacyReceipt.hidden = false;
    clearButton.hidden = false;
    renderDynamicContent();
    setStatus("status.generated");
    resultImage.focus();
  } catch (error) {
    showErrorKey(error instanceof LocalizedError ? error.translationKey : "errors.generic");
  } finally {
    setBusy(false);
  }
});

downloadImageButton.addEventListener("click", () => {
  const imageSource = resultImage.getAttribute("src");
  if (!imageSource?.startsWith("data:image/png;base64,") || !currentCreatedAt) {
    showErrorKey("errors.noImage");
    return;
  }

  triggerDownload(imageSource, createExportFilename("image", currentCreatedAt));
  setStatus("status.imageDownloaded");
});

copyPromptButton.addEventListener("click", async () => {
  if (!currentGeneratedPrompt) {
    showErrorKey("errors.noPrompt");
    return;
  }

  try {
    await copyText(currentGeneratedPrompt);
    setStatus("status.promptCopied");
  } catch {
    showErrorKey("errors.copyFailed");
  }
});

downloadReceiptButton.addEventListener("click", () => {
  if (!currentReceipt || !currentCreatedAt) {
    showErrorKey("errors.noReceipt");
    return;
  }

  const receiptFile = new Blob([currentReceipt], { type: "text/plain;charset=utf-8" });
  const receiptUrl = URL.createObjectURL(receiptFile);
  triggerDownload(receiptUrl, createExportFilename("privacy-receipt", currentCreatedAt));
  setTimeout(() => URL.revokeObjectURL(receiptUrl), 0);
  setStatus("status.receiptDownloaded");
});

clearButton.addEventListener("click", () => {
  promptInput.value = "";
  for (const control of builderControls) {
    control.value = "";
  }
  promptBuilder.open = false;
  setBuilderStatus("");
  lastAppliedPrompt = "";
  resultImage.removeAttribute("src");
  resultCaption.textContent = "";
  receiptPrompt.textContent = "";
  receiptCreatedAt.textContent = "";
  currentGeneratedPrompt = "";
  currentReceipt = "";
  currentCreatedAt = undefined;
  resultFigure.hidden = true;
  exportActions.hidden = true;
  privacyReceipt.hidden = true;
  emptyState.hidden = false;
  clearButton.hidden = true;
  clearError();
  setStatus("status.cleared");
  updatePromptState();
  promptInput.focus();
});

setLocale(DEFAULT_LOCALE);
updatePromptState();
