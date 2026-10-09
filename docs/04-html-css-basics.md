# 04. HTML / CSS 速成

## 本章目標

只學**這個專案會用到**的 HTML 和 CSS：

- HTML：標籤、屬性、`div`、`span`、`button`、`table`
- CSS：選擇器、顏色、大小、外距與內距、圓角陰影、`flex`、`grid`

> 本章在**專案外**的練習資料夾進行，不會影響計算機專案。

## 準備練習檔案

1. 在 `repo` 資料夾（`calculator` 的上一層）建立新資料夾 `html-practice`。
2. 在 VS Code 選「檔案 → 開新視窗」，再「開啟資料夾」選 `html-practice`。
3. 新增檔案 `index.html`，輸入 `!` 後按 <kbd>Tab</kbd>，VS Code 會自動產生 HTML 骨架。
4. 用檔案總管找到 `index.html`，**拖進瀏覽器**就能看到結果。每次修改存檔後，在瀏覽器按 <kbd>F5</kbd> 重新整理。

## Part 1：HTML，網頁的骨架

### 標籤（Tag）

HTML 用「標籤」把內容包起來，告訴瀏覽器「這是什麼」：

```html
<h1>我的計算機</h1>
<p>這是一段文字。</p>
<button>按我</button>
```

- `<h1>` 是開始標籤，`</h1>` 是結束標籤（多一個 `/`）
- 中間是內容
- 有些標籤沒有內容，可以自己結束，例如 `<br />`（換行）

### 本專案會用到的標籤

| 標籤 | 意思 | 預設外觀 |
|---|---|---|
| `<div>` | 一個「區塊」容器，用來分組 | 獨佔一整行 |
| `<span>` | 一段「行內」文字容器 | 跟前後文字在同一行 |
| `<button>` | 按鈕 | 灰色按鈕 |
| `<table>` | 表格 | 見下方 |
| `<!-- 文字 -->` | 註解，不會顯示 | — |

### 屬性（Attribute）

寫在開始標籤裡，提供額外資訊：

```html
<button type="button" class="key" disabled>9</button>
```

| 屬性 | 意思 |
|---|---|
| `type="button"` | 這是一般按鈕（不是送出表單的按鈕） |
| `class="key"` | 給它一個「類別名稱」，讓 CSS 可以找到它（可以很多元素共用同一個 class） |
| `disabled` | 停用，按不下去 |

### 巢狀結構

標籤可以一層一層放在其他標籤裡面，用**縮排**表示層級：

```html
<div class="panel">
  <div class="display">113*3 = 339</div>
  <div class="keys">
    <button type="button">9</button>
    <button type="button">8</button>
  </div>
</div>
```

### 表格

```html
<table>
  <thead>            <!-- 表頭區 -->
    <tr>             <!-- table row：一列 -->
      <th>Ans</th>   <!-- table header：表頭格 -->
      <th></th>
    </tr>
  </thead>
  <tbody>            <!-- 內容區 -->
    <tr>
      <td>NT$14.00</td>   <!-- table data：一般格 -->
      <td>*</td>
    </tr>
    <tr>
      <td colspan="2">尚無資料</td>   <!-- colspan：橫跨 2 格 -->
    </tr>
  </tbody>
</table>
```

**✏️ 練習 1**：把上面三段範例都放進 `index.html` 的 `<body>` 裡，存檔後在瀏覽器看看長怎樣。

## Part 2：CSS，網頁的外觀

### 寫在哪裡？

練習時先寫在 `<head>` 裡的 `<style>` 標籤：

```html
<head>
  <meta charset="UTF-8" />
  <title>練習</title>
  <style>
    /* CSS 寫在這裡 */
  </style>
</head>
```

> 在 Angular 中，每個元件都有自己的 `.css` 檔，不需要 `<style>` 標籤。

### 語法：選擇器 + 屬性

```css
選擇器 {
  屬性: 值;
  屬性: 值;
}
```

| 選擇器 | 選到誰 | 例子 |
|---|---|---|
| `button` | 所有 `<button>` | `button { color: red; }` |
| `.key` | 所有 `class="key"` 的元素（**前面有點**） | `.key { width: 48px; }` |
| `.records td` | `.records` 裡面的所有 `<td>`（中間空格＝「裡面的」） | |
| `.key:hover` | 滑鼠移上去時的 `.key` | `.key:hover { background: #eee; }` |
| `.key:disabled` | 停用的 `.key` | |

### 常用屬性

```css
.key {
  width: 48px;                  /* 寬度，px = 像素 */
  height: 48px;                 /* 高度 */
  font-size: 16px;              /* 文字大小 */
  color: #2e7d32;               /* 文字顏色（# 加 6 位 16 進位色碼） */
  background: #fafafa;          /* 背景色 */
  border: 1px solid #bbb;       /* 外框：粗細 樣式 顏色 */
  border-radius: 4px;           /* 圓角，數字越大越圓 */
  cursor: pointer;              /* 滑鼠移上去變成手指 */
}
```

> 💡 在 VS Code 中，色碼前面會出現小色塊，點它可以用調色盤選顏色。

### 盒子模型：padding 與 margin

每個元素都是一個盒子：

```
┌──────────── margin（外距：和別人的距離）────────────┐
│  ┌──────────── border（外框）──────────────────┐     │
│  │  ┌──────── padding（內距：框到內容）────┐   │     │
│  │  │              內容                     │   │     │
│  │  └───────────────────────────────────────┘   │     │
│  └──────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

```css
.panel {
  padding: 24px;        /* 四邊內距都是 24px */
  margin: 40px auto;    /* 上下 40px、左右 auto（自動 → 水平置中） */
}
```

### 陰影

```css
.panel {
  box-shadow: 6px 8px 12px rgb(0 0 0 / 35%);
  /*          右移 下移 模糊  顏色（黑色、35% 不透明） */
}
```

### 排版 1：Flexbox（排成一排）

在**容器**加上 `display: flex`，裡面的子元素就會排成一排：

```css
.row {
  display: flex;
  gap: 10px;                /* 子元素之間的間距 */
  align-items: center;      /* 垂直置中 */
}

.column {
  display: flex;
  flex-direction: column;   /* 改成直的排 */
  gap: 10px;
}
```

### 排版 2：Grid（排成格子）

```css
.pad {
  display: grid;
  grid-template-columns: repeat(3, 48px);   /* 3 欄，每欄 48px */
  gap: 12px;
}
```

10 個按鈕放進 `.pad`，就會自動排成 3 欄、4 列，最後一個（0）自己在第 4 列。這正是計算機數字鍵的排法！

### 表格框線

```css
table {
  border-collapse: collapse;   /* 相鄰的框線合併成一條 */
}

th,
td {
  border: 1px solid #555;
  padding: 4px 8px;
}
```

## ✏️ 綜合練習：做一個「靜態」計算機

把下面完整貼進 `index.html`（整檔取代），在瀏覽器打開。**它還不會計算**，只是外觀。接下來幾章，我們會用 Angular 讓它動起來。

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>靜態計算機</title>
    <style>
      .panel {
        width: 320px;
        margin: 40px auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        background: #dfc9a8;
        border-radius: 24px;
        box-shadow: 6px 8px 12px rgb(0 0 0 / 35%);
      }
      .display {
        padding: 8px 16px;
        background: #e0e0e0;
        border-radius: 999px;
      }
      .keys {
        display: flex;
        gap: 40px;
      }
      .pad {
        display: grid;
        grid-template-columns: repeat(3, 48px);
        gap: 12px;
      }
      .ops {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .key {
        height: 48px;
      }
    </style>
  </head>
  <body>
    <div class="panel">
      <div class="display">113*3 = 339</div>
      <div class="keys">
        <div class="pad">
          <button type="button" class="key">9</button>
          <button type="button" class="key">8</button>
          <button type="button" class="key">7</button>
          <button type="button" class="key">6</button>
          <button type="button" class="key">5</button>
          <button type="button" class="key">4</button>
          <button type="button" class="key">3</button>
          <button type="button" class="key">2</button>
          <button type="button" class="key">1</button>
          <button type="button" class="key">0</button>
        </div>
        <div class="ops">
          <button type="button">+</button>
          <button type="button">-</button>
          <button type="button">*</button>
          <button type="button">/</button>
        </div>
      </div>
    </div>
  </body>
</html>
```

**挑戰**：

1. 把面板顏色改成你喜歡的顏色。
2. 把數字鍵改成 4 欄。（提示：`repeat(4, 48px)`）
3. 在 `.ops` 加上 `←` 和 `C` 兩個按鈕。

## 發現問題了嗎？

上面 10 個數字按鈕，我們**手打了 10 次幾乎一樣的程式碼**。如果有 100 個按鈕呢？而且按下按鈕什麼事也不會發生。

這就是 Angular 要幫我們解決的事：

- 用 `@for` 迴圈產生重複的元素
- 用 `(click)` 讓按鈕有反應
- 把畫面拆成元件，每個元件只管自己的事

## ✅ 檢查點

- [ ] 說得出 `<div>`、`<span>`、`<button>`、`<table>`、`<tr>`、`<td>` 的用途
- [ ] 知道 `.key` 和 `key` 兩種選擇器的差別（有沒有點）
- [ ] 靜態計算機在瀏覽器中顯示正常

## ⚠️ 常見錯誤

**1. CSS 沒有效果**

- class 選擇器前面要加 `.`：寫 `.key`，不是 `key`。
- 每一行結尾要有 `;`，大括號 `{ }` 要成對。
- HTML 的 `class="key"` 和 CSS 的 `.key` 拼字要一模一樣（大小寫有差）。

**2. 中文變成亂碼**

確認 `<head>` 中有 `<meta charset="UTF-8" />`。

---

下一章：[05. Angular 基礎](05-angular-basics.md)
