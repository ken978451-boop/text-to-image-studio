# Spec: Text to Image Studio

## Objective

建立一個可公開展示的開源網頁範例。使用者輸入文字提示後，伺服器透過 OpenAI Image API 產生一張圖片並顯示於頁面。專案主要面向想學習安全串接圖片生成 API 的初學者。

## Tech Stack

- Node.js 22（本機版本 22.23.0）
- Express（實作靜態網站及 `POST /api/images`）
- OpenAI 官方 JavaScript SDK，圖片模型使用 `gpt-image-2`
- 原生 HTML、CSS、JavaScript，不引入前端框架
- Node.js 內建 `node:test` 測試工具

## Commands

- 安裝：`npm install --ignore-scripts`
- 開發：`npm run dev`
- 啟動：`npm start`
- 測試：`npm test`
- 安全檢查：`npm audit --omit=dev`

## Project Structure

- `src/`：Express 應用、API 路由、輸入驗證及 OpenAI 服務
- `public/`：可存取、響應式的網頁介面
- `test/`：輸入驗證與 API 整合測試
- `tasks/`：實作計畫與進度
- `README.md`：安裝、API Key、安全與使用說明

## Code Style

使用簡單的 ES Modules、小函式及明確命名。外部輸入只在 HTTP 邊界驗證，錯誤格式固定。

```js
export function validatePrompt(value) {
  if (typeof value !== "string" || value.trim().length < 3) {
    return { ok: false, message: "提示文字至少需要 3 個字元。" };
  }

  return { ok: true, value: value.trim() };
}
```

## Testing Strategy

- 單元測試：提示文字的空白、型別、最短與最長限制。
- API 整合測試：成功回應、無效輸入、服務錯誤與 API Key 缺失；OpenAI 呼叫以測試替身取代，不產生費用。
- 瀏覽器檢查：鍵盤操作、手機與桌面排版、載入與錯誤狀態。
- 真實圖片產生僅在使用者提供自己的 `OPENAI_API_KEY` 後測試。

## Boundaries

- Always：驗證提示文字、限制請求大小與頻率、加入安全標頭、檢查 OpenAI 回傳資料、執行測試及依賴安全檢查。
- Ask first：使用真實 API Key 產生付費圖片、建立公開 GitHub Repository、同意活動條款或提交申請。
- Never：把 API Key 寫入程式、日誌或 Git；宣稱新專案已有不存在的使用量、Star 或下載量。

## Success Criteria

- 輸入 3–1000 個字元的提示後，可透過伺服器呼叫 `gpt-image-2` 並顯示 PNG 圖片。
- API Key 不會傳給瀏覽器，`.env` 不會被 Git 追蹤。
- API 回應與錯誤有固定 JSON 格式，輸入及第三方回應都有驗證。
- 頁面可用鍵盤操作，並支援 320px 至 1440px 寬度。
- 測試、啟動檢查與安全檢查全部通過，README 可讓初學者重現。
- 最終 Repository 為公開，且由實際 GitHub 帳號擁有。

## Open Questions

- GitHub CLI 目前登入的是 `aphotelaphotel-creator`，不是指定的 `ken978451-boop`；發布前必須確認正確帳號或改用已登入正確帳號的瀏覽器。
- 專案是全新建立，尚無 Star、下載量或實際採用證據；申請內容必須如實說明，入選機率可能偏低。
