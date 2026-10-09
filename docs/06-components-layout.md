# 06. 拆元件與版面

## 本章目標

- 用 Angular CLI 產生 4 個元件
- 把元件組合起來
- 用 `@for` 產生按鈕
- 完成計算機的**外觀**（還不會動）

## 觀念：為什麼要拆元件？

回想第 04 章的靜態計算機：全部寫在一個檔案裡，越寫越長、越難找。拆成元件後：

- **每個元件只負責一件事**，好讀、好改
- 元件可以**重複使用**
- 多人合作時，每個人負責不同元件，不會互相衝突

依照[規格書](00-spec.md#3-畫面與元件架構)，我們要做：

| 元件 | 標籤 | 負責 |
|---|---|---|
| Component1 `Calculator` | `<app-calculator>` | 父元件，把其他元件組起來 |
| Component2 `NumberPad` | `<app-number-pad>` | 數字鍵 |
| Component3 `OperatorPad` | `<app-operator-pad>` | 運算子鍵 |
| Component4 `Display` | `<app-display>` | 算式列 |

## 步驟 1：產生元件

在終端機（如果 `ng serve` 正在執行，點 **+** 開新的終端機）輸入：

```powershell
ng generate component calculator
ng generate component number-pad
ng generate component operator-pad
ng generate component display
```

> 💡 可以縮寫成 `ng g c calculator`。

每個指令會建立一個資料夾和 4 個檔案，例如：

```
CREATE src/app/number-pad/number-pad.spec.ts   ← 測試
CREATE src/app/number-pad/number-pad.ts        ← TypeScript
CREATE src/app/number-pad/number-pad.css       ← 樣式
CREATE src/app/number-pad/number-pad.html      ← 畫面
```

打開 `src/app/number-pad/number-pad.ts`：

```ts
import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-number-pad',
  styleUrl: './number-pad.css',
  templateUrl: './number-pad.html',
})
export class NumberPad {}
```

CLI 自動幫我們把 `number-pad` 轉成：class 名稱 `NumberPad`（PascalCase，每個字首大寫）、標籤 `app-number-pad`（kebab-case，加上 `app-` 前綴）。

## 步驟 2：讓 App 只顯示計算機

**觀念**：要在一個元件的 HTML 中使用另一個元件，必須：

1. 在 `.ts` 中 `import` 那個元件的 class
2. 把它放進 `@Component` 的 `imports: [ ]` 陣列
3. 在 `.html` 中使用它的標籤

**檔案：`src/app/app.ts`（整檔取代）**

```ts
import { Component } from '@angular/core';
import { Calculator } from './calculator/calculator';

@Component({
  imports: [Calculator],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
```

**檔案：`src/app/app.html`（整檔取代）**

```html
<app-calculator />
```

> `<app-calculator />` 是 `<app-calculator></app-calculator>` 的簡寫，沒有內容的元件標籤可以這樣寫。

**檔案：`src/app/app.css`（清空內容）**：第 05 章練習用的 `.big` 已經用不到了，把檔案內容全部刪除。

存檔後瀏覽器應該顯示 `calculator works!`。

## 步驟 3：Component2，數字鍵

用陣列加上 `@for`，就不用手打 10 個按鈕。

**檔案：`src/app/number-pad/number-pad.ts`（整檔取代）**

```ts
import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-number-pad',
  styleUrl: './number-pad.css',
  templateUrl: './number-pad.html',
})
export class NumberPad {
  /** 依照畫面順序排列的數字鍵 */
  protected readonly digits = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
}
```

> `/** … */` 是說明用的註解（JSDoc），滑鼠移到 `digits` 上就會看到這段說明。

**檔案：`src/app/number-pad/number-pad.html`（整檔取代）**

```html
<div class="pad">
  @for (d of digits; track d) {
    <button type="button" class="key">{{ d }}</button>
  }
</div>
```

`@for (d of digits; track d)`：從 `digits` 陣列一個一個取出來，取出的值叫 `d`，每次產生一個按鈕。數字都不重複，所以用 `d` 本身當作 `track` 的依據。

**檔案：`src/app/number-pad/number-pad.css`（整檔取代）**

```css
.pad {
  display: grid;
  grid-template-columns: repeat(3, 48px);
  gap: 12px;
}

.key {
  height: 48px;
  font-size: 16px;
  background: #fafafa;
  border: 1px solid #bbb;
  border-radius: 4px;
  cursor: pointer;
}

.key:hover {
  background: #eee;
}
```

## 步驟 4：Component3，運算子鍵

**檔案：`src/app/operator-pad/operator-pad.ts`（整檔取代）**

```ts
import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-operator-pad',
  styleUrl: './operator-pad.css',
  templateUrl: './operator-pad.html',
})
export class OperatorPad {
  protected readonly operators = ['+', '-', '*', '/'];
}
```

**檔案：`src/app/operator-pad/operator-pad.html`（整檔取代）**

```html
<div class="pad">
  @for (op of operators; track op) {
    <button type="button" class="key">{{ op }}</button>
  }
  <button type="button" class="key">←</button>
  <button type="button" class="key">C</button>
</div>
```

**檔案：`src/app/operator-pad/operator-pad.css`（整檔取代）**

```css
.pad {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key {
  width: 40px;
  height: 30px;
  background: #fafafa;
  border: 1px solid #bbb;
  border-radius: 4px;
  cursor: pointer;
}

.key:hover {
  background: #eee;
}
```

> 💡 **兩個元件都有 `.key`，不會打架嗎？** 不會！Angular 預設會把元件的 CSS「隔離」，`number-pad.css` 裡的 `.key` 只影響 NumberPad 自己的 HTML。

## 步驟 5：Component4，算式列

先寫固定的文字，下一章再換成真的資料。

**檔案：`src/app/display/display.html`（整檔取代）**

```html
<div class="display">
  <span class="formula">113*3 = 339</span>
  <button type="button" class="key">=</button>
  <button type="button" class="key">+</button>
</div>
```

**檔案：`src/app/display/display.css`（整檔取代）**

```css
.display {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 4px 16px;
  background: #e0e0e0;
  border-radius: 999px;
  box-shadow: 2px 3px 6px rgb(0 0 0 / 30%);
}

.formula {
  flex: 1;
  text-align: center;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
}

.message {
  color: #d32f2f;
  font-size: 12px;
}

.key {
  min-width: 24px;
  background: #fafafa;
  border: 1px solid #bbb;
  border-radius: 3px;
  cursor: pointer;
}

.key:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

- `border-radius: 999px`：圓角大到不可能，就會變成膠囊形狀
- `.message`、`.key:disabled` 現在還用不到，第 08 章會用

`display.ts` 不用改。

## 步驟 6：Component1，組合起來

**檔案：`src/app/calculator/calculator.ts`（整檔取代）**

```ts
import { Component } from '@angular/core';
import { Display } from '../display/display';
import { NumberPad } from '../number-pad/number-pad';
import { OperatorPad } from '../operator-pad/operator-pad';

@Component({
  imports: [Display, NumberPad, OperatorPad],
  selector: 'app-calculator',
  styleUrl: './calculator.css',
  templateUrl: './calculator.html',
})
export class Calculator {}
```

> `'../display/display'` 中的 `..` 是「上一層資料夾」：從 `calculator/` 回到 `app/`，再進入 `display/` 找 `display.ts`（`.ts` 副檔名不用寫）。

**檔案：`src/app/calculator/calculator.html`（整檔取代）**

```html
<div class="panel">
  <!-- Component4：算式列 -->
  <app-display />

  <div class="keys">
    <!-- Component2：數字鍵 -->
    <app-number-pad />
    <!-- Component3：運算子鍵 -->
    <app-operator-pad />
  </div>

  <button type="button" class="clear-all">clear</button>

  <!-- 計算結果 table -->
  <table class="records">
    <thead>
      <tr>
        <th>Ans</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="3" class="empty">尚無資料</td>
      </tr>
    </tbody>
  </table>
</div>
```

**檔案：`src/app/calculator/calculator.css`（整檔取代）**

```css
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

.keys {
  display: flex;
  gap: 40px;
}

.clear-all {
  padding: 2px 10px;
  background: #fafafa;
  border: 1px solid #bbb;
  border-radius: 3px;
  cursor: pointer;
}

.records {
  border-collapse: collapse;
}

.records th,
.records td {
  border: 1px solid #555;
  padding: 4px 8px;
  font-family: 'Times New Roman', serif;
}

.empty {
  text-align: center;
  color: #666;
}
```

## 步驟 7：檢查並 Commit

```powershell
npm run lint
git add .
git commit -m "建立計算機四個元件與版面"
```

## ✅ 檢查點

瀏覽器應該看到：

- [ ] 米色圓角面板，置中在頁面上
- [ ] 最上方是灰色膠囊形的算式列：`113*3 = 339 [=] [+]`
- [ ] 左邊是 3 欄的數字鍵（9 8 7 / 6 5 4 / 3 2 1 / 0）
- [ ] 右邊是直排的 `+ - * / ← C`
- [ ] 中間的 `clear` 按鈕，下方的 Ans 表格顯示「尚無資料」
- [ ] 按鈕按下去**沒有反應**，這是正常的，下一章才會處理

## ⚠️ 常見錯誤

**1. `'app-display' is not a known element`**

忘了把 `Display` 放進 `calculator.ts` 的 `imports: [ ]`，或少了最上方的 `import { Display } from '../display/display';`。

> 💡 小技巧：在 HTML 打 `<app-display` 時，VS Code 會跳出建議。選擇它，Angular Language Service 會**自動幫你加好 import**。

**2. `Cannot find module '../display/display'`**

路徑打錯了。檢查資料夾名稱與檔名，注意是 `../`（兩個點）。

**3. 數字鍵沒有排成 3 欄**

`number-pad.css` 的 `.pad` 是否有 `display: grid;`？HTML 中外層 `<div>` 的 class 是否為 `pad`？

## 小練習

1. 把面板寬度改成 360px，看看有什麼變化。
2. 用瀏覽器開發者工具（<kbd>F12</kbd> → Elements 頁籤）找到 `<app-number-pad>`，看看 Angular 產生的 HTML 長什麼樣子。

---

下一章：[07. 父子元件溝通](07-parent-child.md)
