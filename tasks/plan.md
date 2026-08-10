# Implementation Plan: Text to Image Studio

## Overview

以最少依賴建立一條完整流程：瀏覽器送出提示文字、伺服器驗證、OpenAI Image API 產圖、瀏覽器安全顯示結果。先定義合約與失敗測試，再逐步完成 API、介面與文件。

## Architecture Decisions

- API Key 僅存在伺服器環境變數，避免在公開 Repository 或瀏覽器洩漏。
- 使用 Image API 的單次圖片生成端點，符合一個提示產生一張圖的需求。
- 使用 `gpt-image-2` 與低品質 1024x1024 預設值，降低測試成本與等待時間。
- 前端使用原生技術，讓 Repository 容易閱讀、安裝與維護。

## Task List

### Phase 1: Contract and API foundation

- [x] 定義 `/api/images` 的輸入、成功及錯誤格式
- [x] 先寫提示驗證與 API 行為的失敗測試
- [x] 完成最小伺服器實作並讓測試通過

### Checkpoint: API

- [x] API 測試全數通過
- [x] API Key 缺失及外部服務錯誤不洩漏內部資訊

### Phase 2: User interface

- [x] 建立輸入、送出、載入、錯誤及圖片結果介面
- [x] 串接 `/api/images`，避免使用 `innerHTML` 顯示外部資料
- [x] 加入響應式及鍵盤可用性

### Checkpoint: UI

- [x] 320、768、1024、1440px 版面可用
- [x] 可用鍵盤完成主要流程，瀏覽器無主控台錯誤

### Phase 3: Documentation and publish

- [x] 撰寫 README、`.env.example`、授權條款與 `.gitignore`
- [ ] 執行完整測試、依賴稽核及秘密掃描
- [ ] 以正確 GitHub 帳號建立公開 Repository 並推送

### Checkpoint: Complete

- [ ] GitHub 可公開存取，預設分支可直接安裝執行
- [ ] Repository 擁有者及公開狀態已核對
- [ ] 活動申請文字只使用可查證的專案資訊

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| API Key 洩漏 | 高 | 只讀取環境變數、忽略 `.env`、提交前掃描秘密 |
| 惡意或大量提示造成費用 | 高 | 長度限制、請求大小限制、IP 頻率限制、單次一張低品質圖片 |
| 外部 API 回傳格式異常 | 中 | 驗證 base64 欄位後才回傳前端 |
| GitHub 帳號不一致 | 高 | 建立 Repository 前確認實際登入帳號 |
| 新專案不符合活動偏好 | 中 | 誠實描述教育價值，不虛報使用量，提示使用者入選機率 |

## Open Questions

- 是否確認 Repository 建立在 `ken978451-boop`，並以「主要維護者」身分申請？
- 是否接受先做本機可執行版本、不另外部署付費主機？
