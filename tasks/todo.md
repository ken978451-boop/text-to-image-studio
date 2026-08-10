# Task Checklist

- [x] Task 1: 定義並測試提示驗證與 API 合約
  - Acceptance: 無效提示回傳一致的 422；成功回傳 PNG base64。
  - Verify: `npm test -- --test-name-pattern="validation|API"`
  - Files: `test/validation.test.js`, `test/api.test.js`, `src/validation.js`

- [x] Task 2: 實作 OpenAI 圖片服務與安全伺服器
  - Acceptance: 使用 `gpt-image-2`；Key 僅在伺服器；有大小、頻率及安全標頭限制。
  - Verify: `npm test`、`npm audit --omit=dev`
  - Files: `src/image-service.js`, `src/app.js`, `src/server.js`, `package.json`

- [x] Task 3: 建立可存取的響應式網頁
  - Acceptance: 可輸入、送出並顯示載入、錯誤、圖片結果；手機及鍵盤可用。
  - Verify: 瀏覽器檢查 320/768/1024/1440px，主控台無錯誤。
  - Files: `public/index.html`, `public/styles.css`, `public/app.js`

- [ ] Task 4: 完成文件與 GitHub 發布
  - Acceptance: README、環境範例、授權、忽略規則完整；公開 Repository 擁有者正確。
  - Verify: 全套測試、安全掃描、從 README 重新安裝啟動、GitHub 公開頁檢查。
  - Files: `README.md`, `.env.example`, `.gitignore`, `LICENSE`
