# API 參考文件與開發者指南

這份文件說明了專案中前端靜態網站 (`site/`) 底下核心 JavaScript 模組的行為與 API。

## 1. `site/app.js`

`site/app.js` 是前端網站的主程式，負責處理以下介面互動：

- **手機版選單切換**：監聽選單按鈕的點擊事件 (`.menu-button`) 來展開或收合導覽列 (`.site-nav`)。並支援使用 `Escape` 鍵關閉選單。
- **語言切換 (Language Switcher)**：透過 `apply(lang, updateUrl)` 函數切換網站語言（`zh` 或 `en`），更新 DOM 上的屬性 (`data-lang`, `lang`)、頁面標題與 Meta Description。選擇結果會存入 `localStorage`，並反映在 URL 的查詢字串 (`?lang=`)。
- **複製到剪貼簿功能**：綁定所有帶有 `data-copy` 屬性的按鈕，點擊時將指定元素的文字內容複製到剪貼簿，並暫時添加 `is-done` CSS class 以提供視覺回饋。
- **中文斷詞處理**：若瀏覽器支援 `Intl.Segmenter`，會在中文字標題 (`<h1>`, `<h2>`) 間插入 `<wbr>`，避免長標題在不適合的地方換行。
- **動態年份**：將所有帶有 `data-year` 屬性的元素內容更新為目前的年份。

## 2. `site/lang.js`

`site/lang.js` 是一個輕量且於 `<head>` 中同步執行的腳本。其目的是在畫面渲染前，決定並設定好使用者偏好的語言，避免發生「畫面閃爍 (Flash of wrong language)」。

**語言決定優先順序**：
1. **URL 參數**：`?lang=zh-TW` 或 `?lang=en`
2. **本地儲存 (Local Storage)**：讀取先前存下的 `tedh-project-lang`
3. **瀏覽器偏好**：偵測 `navigator.languages` 中是否以中文 (`zh`) 為主，否則預設為英文 (`en`)。

設定完畢後，會更新 `<html>` 標籤的 `data-lang` 與 `lang` 屬性。

## 3. `site/flow.js`

`site/flow.js` 是用來繪製並控制網頁中 SVG 流程圖 (`<figure class="fd">`) 的模組。
此腳本為 UMD 格式，在瀏覽器環境下會暴露出全域變數 `TedFlow`。

### 主要 API

- `TedFlow.render(figureElement)`
  讀取 `<figure class="fd">` 上的 `data-fd` 屬性，並在其內部動態生成 SVG 元素。
- `TedFlow.renderAll(rootElement)`
  尋找指定節點下所有的 `<figure class="fd">` 並調用 `render()` 初始化。
- `TedFlow.statusAt(elapsed, count)`
  計算特定時間點的動畫狀態與透明度。
- `TedFlow.tokenise(text)`
  將字串拆解為單詞與空白的陣列，支援中文與英文混合處理。

### 執行方式
腳本載入後，會自動在 `DOMContentLoaded` 事件觸發時執行 `TedFlow.renderAll(document)`。
