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

  if (isBusy) {
    status.textContent = "正在產生圖片，請稍候。";
    return;
  }

  updatePromptState();
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  status.textContent = `錯誤：${message}`;
  errorMessage.focus();
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

promptInput.addEventListener("input", updatePromptState);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const prompt = promptInput.value.trim();
  if (prompt.length < 3) {
    showError("提示文字至少需要 3 個字元。");
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
      throw new Error(body?.error?.message ?? "目前無法產生圖片，請稍後再試。");
    }

    const imageBase64 = body?.data?.imageBase64;
    const mimeType = body?.data?.mimeType;
    if (typeof imageBase64 !== "string" || mimeType !== "image/png") {
      throw new Error("伺服器回傳了無法顯示的圖片資料。");
    }

    resultImage.src = `data:${mimeType};base64,${imageBase64}`;
    resultCaption.textContent = `提示：${prompt}`;
    emptyState.hidden = true;
    resultFigure.hidden = false;
    status.textContent = "圖片已產生完成。";
    resultImage.focus();
  } catch (error) {
    showError(error instanceof Error ? error.message : "目前無法產生圖片，請稍後再試。");
  } finally {
    setBusy(false);
  }
});

updatePromptState();
