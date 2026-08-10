# Text to Image Studio

一個小型、可閱讀且安全的 OpenAI Image API 開源範例。使用者在網頁輸入文字提示，伺服器以 `gpt-image-2` 產生圖片，再把 PNG 結果傳回瀏覽器。

## 專案特色

- API Key 僅存在伺服器端，不會寫入前端程式或回傳瀏覽器。
- 提示文字會在伺服器驗證並限制為 3–1000 個字元。
- 每 15 分鐘最多產生 5 張圖片，避免意外消耗過多 API 額度。
- 使用低品質 1024 × 1024 PNG 作為低成本預設值。
- 包含 CSP 等安全標頭、固定錯誤格式及第三方回傳資料驗證。
- 支援鍵盤操作及 320px–1440px 響應式版面。

## 執行需求

- Node.js 22 或更新版本
- OpenAI API Key；GPT Image 模型可能要求完成 API 組織驗證
- 可用的 API 餘額。每次圖片產生會依模型與設定計費

## 快速開始

```powershell
git clone https://github.com/ken978451-boop/text-to-image-studio.git
cd text-to-image-studio
npm install --ignore-scripts
Copy-Item .env.example .env
```

編輯 `.env`，將 `<your-api-key>` 換成自己的 OpenAI API Key，接著啟動：

```powershell
npm start
```

開啟 <http://localhost:3000>。

macOS 或 Linux 可使用：

```bash
cp .env.example .env
npm start
```

## 測試與安全檢查

```powershell
npm test
npm audit --omit=dev
```

測試不會呼叫真實 OpenAI API，也不會產生費用。

## API 合約

`POST /api/images`

```json
{
  "prompt": "一隻戴著黃色雨衣的柴犬站在台北雨夜街頭"
}
```

成功回應：

```json
{
  "data": {
    "imageBase64": "...",
    "mimeType": "image/png"
  }
}
```

錯誤回應固定使用以下格式：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "提示文字至少需要 3 個字元。"
  }
}
```

## 安全提醒

- `.env` 已加入 `.gitignore`，請勿把真實 API Key 上傳 GitHub。
- 若 Key 曾經出現在 Commit 或公開頁面，請立即撤銷並重新建立；只刪除檔案並不足夠。
- 這是教育用途的單機範例。公開部署時應使用持久型／分散式 Rate Limit 儲存，並依部署環境調整 Proxy 與 HTTPS 設定。

## 參考資料

- [OpenAI Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [GPT Image 2 model](https://developers.openai.com/api/docs/models/gpt-image-2)

## License

[MIT](LICENSE)
