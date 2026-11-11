# 開發者與使用指南 (Developer Usage Guide)

本指南適用於有興趣為本專案貢獻程式碼或了解前端網站模組 (`site/` 目錄) 運作原理的開發者。以下將介紹核心模組的使用方式及如何執行本地測試。

## 核心模組介紹與使用範例

專案頁面使用三個核心 JavaScript 模組來負責多國語系 (i18n)、介面互動及流程圖渲染。

### 1. `site/lang.js` (多國語系處理)

此腳本負責在頁面載入時判斷並套用適當的語言設定。它會按照以下優先順序決定語言：
1. URL 查詢參數 (`?lang=zh-TW`)
2. `localStorage` 中儲存的偏好設定 (`tedh-project-lang`)
3. 瀏覽器的語言設定 (`navigator.languages`)

**使用方式：**
此腳本需在 `<head>` 區塊中以阻塞方式載入，確保頁面在渲染前已設置好正確的 `data-lang` 屬性，避免語言閃爍。

```html
<script src="lang.js"></script>
```

### 2. `site/app.js` (介面互動與文本處理)

此腳本處理頁面的基本 DOM 互動，包含：
- 行動版導覽選單 (Mobile menu) 的開關控制。
- 點擊語言切換按鈕時，更新頁面語言與 URL。
- 提供複製到剪貼簿的功能按鈕支援。
- **文本分詞 (Text Segmentation):** 針對包含中文字元的元素 (`.text-content`)，使用 `Intl.Segmenter` 加入 `<wbr>` 標籤，以優化中英混排時的自動換行行為。

**使用方式：**
以 `defer` 屬性載入，確保 DOM 解析完成後再執行。

```html
<script src="app.js" defer></script>
```

### 3. `site/flow.js` (流程圖渲染)

此腳本負責將帶有 `.flow-diagram` 類別的元素內容解析並繪製成 SVG 流程圖，同時支援動畫效果。詳細的 API 說明請參考 [API 參考文獻](api-reference.md)。

**使用範例：**
HTML 中準備一個包含流程圖定義的節點，`flow.js` 會自動解析它並在上方生成 SVG。

```html
<div class="flow-diagram" aria-hidden="true">
# 第一行狀態說明
node1 [icon] 節點一文字
node2 節點二文字
lane node1 node2
</div>
<script src="flow.js" defer></script>
```

## 測試指南

本專案的前端測試使用原生的 Node.js 測試執行器 (`node:test` 和 `node:assert`)，不依賴額外的測試框架 (如 Jest)。

### 執行測試與覆蓋率報告

請確保您的 Node.js 版本支援原生測試執行器。在專案根目錄下，執行以下指令即可運行測試並生成覆蓋率報告：

```bash
node --test --experimental-test-coverage
```

### 撰寫前端測試的注意事項

由於腳本設計為在瀏覽器環境執行，測試中使用了 Node.js 的 `node:vm` 模組來建立沙箱環境 (sandbox) 並模擬必要的 DOM 物件 (如 `window`, `document`)。

**測試範例 (`tests/site_lang.test.js` 摘錄):**

```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

describe('site/lang.js script', () => {
  it('should prioritize URL param over browser languages', () => {
    const code = fs.readFileSync('site/lang.js', 'utf8');

    // 模擬 DOM 環境
    const sandbox = {
      window: {
        location: { search: '?lang=zh-TW' },
        localStorage: { getItem: () => null }
      },
      navigator: { languages: ['en-US', 'en'] },
      document: {
        documentElement: { setAttribute: () => {}, lang: '' }
      }
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    // 驗證預期行為
    assert.strictEqual(sandbox.document.documentElement.lang, 'zh-Hant');
  });
});
```

在為 `app.js` 或 `flow.js` 撰寫測試時，同樣需要準備相對應的 DOM 結構以供腳本操作驗證。