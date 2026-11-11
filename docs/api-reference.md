# API 參考文獻 (API Reference)

本文檔主要介紹 `site/flow.js` 模組的核心 API 規範，該模組用於渲染專案介紹頁面的流程圖 (flow diagrams)。

## 模組：`site/flow.js`

該腳本提供了一組 API，用於將特定的文本格式解析並繪製為 SVG 流程圖，同時支援動畫狀態展示。

### 導出的方法 (Exported Methods)

這些方法可透過 `window.TedFlow` 訪問（在瀏覽器環境中），或者作為 CommonJS 模組導出的物件使用（在 Node.js 測試環境中）。

#### 1. `renderAll(doc)`
- **說明:** 掃描提供的文檔（或 DOM 節點）中所有帶有 `.flow-diagram` 類別的元素，並調用 `render` 方法進行渲染。
- **參數:**
  - `doc` (Document | Element): 要掃描的 DOM 根節點，通常是 `window.document`。

#### 2. `render(node)`
- **說明:** 將單個 DOM 節點（其內部包含流程圖定義文本）渲染為 SVG 流程圖，並插入到該節點上方。
- **參數:**
  - `node` (Element): 包含流程圖原始文字的 DOM 元素（通常具有 `.flow-diagram` 類別）。

#### 3. `plan(text, isWide)`
- **說明:** 解析流程圖的文本內容，並計算出渲染所需的幾何佈局計畫 (layout plan)。這是一個內部核心邏輯，用於將字串轉換為節點 (nodes)、連線 (lanes) 以及狀態 (status) 資料結構。
- **參數:**
  - `text` (String): 流程圖的原始文本定義。
  - `isWide` (Boolean): 指示當前視圖是否為寬螢幕模式，影響佈局的寬度計算。
- **回傳值:** `Object` 包含佈局規劃結果，包含解析出的行、狀態數、寬高配置等。

#### 4. `wrap(text, limit, contextWeight)`
- **說明:** 將長字串根據指定的寬度限制進行自動換行處理，以確保在 SVG 中渲染時不會超出邊界。
- **參數:**
  - `text` (String): 要換行的字串。
  - `limit` (Number): 單行的寬度限制（基於預估的字元權重）。
  - `contextWeight` (Number): 上下文的預設字元權重，用於計算單詞長度。
- **回傳值:** `String` 插入換行符號（`\n`）後的字串。

#### 5. `textWithBreaks(parent, text, x, y, lineHeight, limit, weight)`
- **說明:** 在指定的 SVG 元素 (`parent`) 中建立文本節點，並支援根據預設的換行邏輯（基於 `wrap` 方法）自動拆分為多行 `<tspan>` 元素。
- **參數:**
  - `parent` (Element): 目標 SVG 元素（通常是 `<text>` 元素）。
  - `text` (String): 要繪製的文字內容。
  - `x` (Number): X 座標起點。
  - `y` (Number): Y 座標起點。
  - `lineHeight` (Number): 行高。
  - `limit` (Number): 單行的最大寬度限制。
  - `weight` (Number): 用於寬度預估的字元權重。

#### 6. `advance(state)`
- **說明:** 用於管理流程圖中「狀態 (status)」動畫輪播的方法。根據當前的時間和狀態，計算出下一個要顯示的狀態以及動畫進度，用於觸發重繪。
- **參數:**
  - `state` (Object): 當前的動畫狀態物件，包含起始時間、目前活躍索引等資訊。

#### 7. `statusVisible(plan, elapsed, statusLength, index)`
- **說明:** 根據已經經過的時間 (`elapsed`)，計算特定狀態 (`index`) 在動畫輪播中目前的透明度 (opacity)。
- **參數:**
  - `plan` (Object): 流程圖佈局配置，包含預設的動畫時間設定 (`plan.times`)。
  - `elapsed` (Number): 距離動畫開始經過的毫秒數。
  - `statusLength` (Number): 總狀態的數量。
  - `index` (Number): 要查詢的特定狀態索引。
- **回傳值:** `Number` 介於 0 到 1 之間的透明度值。

#### 8. `ICONS`
- **說明:** 此模組內建支援的一組 SVG 圖示路徑資料清單，供流程圖節點使用（例如 `chat`, `route`, `spark` 等）。此屬性導出主要是為了測試驗證，確保所有支援的圖示都有被正確定義。
