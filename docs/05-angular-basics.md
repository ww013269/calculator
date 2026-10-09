# 05. Angular 基礎

## 本章目標

- 看得懂基本的 TypeScript
- 理解 Angular 元件的三個檔案如何合作
- 學會 `{{ }}` 顯示資料、`(click)` 處理點擊、`signal` 保存狀態、`[class.xxx]` 動態樣式

本章在 `App` 根元件做一個「點擊計數器」小練習。下一章就會換成計算機。

## Part 1：TypeScript 最小必備

### 變數與型別

```ts
const name: string = 'Amy';   // 文字（字串）用單引號包起來
const age: number = 18;       // 數字
const ok: boolean = true;     // 布林：true / false
let result: number | null = null; // 「數字或 null（沒有值）」
```

- `const`：之後**不能**重新指定值
- `let`：之後可以重新指定值
- `: string`：型別標註。寫錯型別時，VS Code 會畫紅線

### 陣列（Array）

```ts
const digits: string[] = ['9', '8', '7'];
digits.length; // 3
digits[0];     // '9'（從 0 開始數）
```

### 函式（Function）

```ts
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2); // 3
```

`(a: number, b: number)` 是**參數**，`: number`（括號後面）是**回傳值的型別**。

### 箭頭函式（Arrow Function）

一種比較短的函式寫法，常用在「把函式當參數傳進去」：

```ts
const double = (value: number) => value * 2;
double(5); // 10
```

### 類別（Class）

把「資料」和「操作資料的函式（方法）」包在一起：

```ts
class Counter {
  count = 0; // 屬性（資料）

  addOne(): void {
    // 方法；void 代表「不回傳東西」
    this.count = this.count + 1; // this = 這個物件自己
  }
}
```

### 存取修飾詞

| 修飾詞 | 誰可以用 | 本專案的用法 |
|---|---|---|
| `private` | 只有 class 自己 | 內部用的資料或方法 |
| `protected` | class 自己和**它的 HTML 範本** | 給畫面用的資料、事件處理方法 |
| （不寫）＝ `public` | 任何人 | 元件的 `input` / `output` |
| `readonly` | 設定後不能再指定新值 | 搭配 signal 使用 |

## Part 2：元件的三個檔案

```
app.ts    ← 資料與行為（TypeScript）
app.html  ← 畫面（HTML + Angular 範本語法）
app.css   ← 樣式（只影響這個元件）
```

`app.ts` 裡 `class` 的屬性與方法，可以在 `app.html` 中直接使用。

## Part 3：Signal，會「通知畫面」的變數

一般變數改了，Angular 不知道要更新畫面。**Signal** 是一個裝著值的盒子，值一改變，用到它的畫面就會自動更新。

```ts
import { signal } from '@angular/core';

const count = signal(0);  // 建立，初始值 0

count();                  // 讀取：要加 ()  → 0
count.set(5);             // 設定新值        → 5
count.update((value) => value + 1); // 依照舊值算出新值 → 6
```

> ⚠️ 新手最常犯的錯：讀取 signal 時**忘記加 `()`**。

## Part 4：動手做計數器

**檔案：`src/app/app.ts`（整檔取代）**

```ts
import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('我的計算機');
  protected readonly count = signal(0);

  protected addOne(): void {
    this.count.update((value) => value + 1);
  }
}
```

**檔案：`src/app/app.html`（整檔取代，原本 300 多行的歡迎頁可以全部刪掉）**

```html
<h1>{{ title() }}</h1>
<p [class.big]="count() > 5">按了 {{ count() }} 次</p>
<button type="button" (click)="addOne()">+1</button>
```

**檔案：`src/app/app.css`（整檔取代）**

```css
.big {
  color: red;
  font-size: 24px;
}
```

執行 `ng serve`（如果還沒執行），打開 <http://localhost:4200/>，按幾下按鈕。

## Part 5：範本語法說明

### `{{ }}` 插值：把資料顯示在畫面上

```html
<h1>{{ title() }}</h1>
```

`{{ }}` 裡面寫 TypeScript 運算式，結果會變成文字顯示。`title` 是 signal，所以要寫 `title()`。

### `(事件)="方法()"`：事件綁定

```html
<button type="button" (click)="addOne()">+1</button>
```

小括號 `( )` 代表「**監聽事件**」：按下按鈕時（`click` 事件），執行 `addOne()`。

### `[class.名稱]="條件"`：動態 class

```html
<p [class.big]="count() > 5">…</p>
```

中括號 `[ ]` 代表「**綁定屬性**」：條件為 `true` 時，這個 `<p>` 會加上 `class="big"`；`false` 時移除。

按超過 5 次，文字就會變大變紅！

### 記憶口訣

| 寫法 | 方向 | 口訣 |
|---|---|---|
| `{{ 值 }}` | 資料 → 畫面 | 顯示文字 |
| `[屬性]="值"` | 資料 → 畫面 | 中括號＝**放進去** |
| `(事件)="方法()"` | 畫面 → 資料 | 小括號＝**聽事件** |

### 預告：`@if` 與 `@for`

```html
@if (count() > 10) {
  <p>你按太多次了！</p>
}

@for (item of ['A', 'B', 'C']; track item) {
  <span>{{ item }}</span>
}
```

- `@if (條件) { … }`：條件成立才顯示
- `@for (變數 of 陣列; track 唯一值) { … }`：陣列有幾個就重複幾次。`track` 告訴 Angular 用什麼來分辨每一項，幫助它有效率地更新畫面

這兩個語法在後面的章節會大量使用。

## Commit

```powershell
git add .
git commit -m "練習 Angular 基礎：計數器"
```

## ✅ 檢查點

- [ ] 畫面顯示「我的計算機」和「按了 0 次」
- [ ] 按按鈕數字會增加
- [ ] 超過 5 次，文字變成紅色大字
- [ ] 說得出 `{{ }}`、`[ ]`、`( )` 的差別

## ⚠️ 常見錯誤

**1. 畫面顯示奇怪的文字，例如 `[Signal: 0]`，終端機也出現 `NG8109` 警告**

讀取 signal 時忘了加 `()`：`{{ count }}` 要改成 `{{ count() }}`。

**2. 畫面空白**

按 <kbd>F12</kbd> 開啟瀏覽器開發者工具，看「Console（主控台）」頁籤的紅字錯誤訊息。也要看 `ng serve` 終端機有沒有錯誤。

**3. `Property 'addOne' is private and only accessible within class 'App'`**

範本中要用的方法不能是 `private`，請改成 `protected`。

## 小練習

1. 加一個「-1」按鈕。
2. 加一個「歸零」按鈕。（提示：`this.count.set(0)`）
3. 用 `@if` 在 count 為 0 時顯示「還沒按過」。

---

下一章：[06. 拆元件與版面](06-components-layout.md)
