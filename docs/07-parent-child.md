# 07. 父子元件溝通：input() 與 output()

## 本章目標

- 子元件用 `output()` 把「按了什麼鍵」告訴父元件
- 父元件用 signal 保存算式
- 父元件用 `input()` 把算式傳給子元件顯示
- 完成後：按數字鍵、運算子鍵，算式列會即時顯示

## 觀念：資料往下，事件往上

想像一間餐廳：

- **父元件 Calculator＝廚房**：保管所有食材（資料），負責煮菜（計算）
- **子元件＝服務生**：只負責接單（按鈕被按）和上菜（顯示）

服務生不會自己煮菜，他們把客人點了什麼**往上**告訴廚房（`output`）；廚房煮好後，把菜**往下**交給服務生端出去（`input`）。

```
                Calculator（父）
                保存 expression
          ┌──────────┼──────────────┐
  input ↓ │          │ ↑ output     │ ↑ output
 expression          │ digit        │ operator / backspace / clearExpression
          │          │              │
     Display     NumberPad     OperatorPad
```

為什麼不讓每個子元件自己保存資料？因為三個子元件要**共用同一個算式**。資料放在一個地方，才不會發生「數字鍵以為是 12，算式列卻顯示 1」這種不一致。

## 語法速查

**子元件**宣告：

```ts
import { input, output } from '@angular/core';

export class Child {
  readonly name = input('');          // 接收父元件傳來的資料（預設值 ''）
  readonly picked = output<string>(); // 對父元件發出事件，事件帶一個 string
}
```

子元件**發出事件**（在子元件的 HTML）：

```html
<button type="button" (click)="picked.emit('A')">A</button>
```

**父元件**使用子元件（在父元件的 HTML）：

```html
<app-child [name]="parentName()" (picked)="onPicked($event)" />
```

- `[name]="…"`：把父元件的資料**放進**子元件的 input（中括號）
- `(picked)="…"`：**監聽**子元件的 output（小括號）
- `$event`：事件帶來的值，也就是 `emit('A')` 中的 `'A'`

## 步驟 1：NumberPad 發出 digit 事件

**檔案：`src/app/number-pad/number-pad.ts`（整檔取代）**

```ts
import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-number-pad',
  styleUrl: './number-pad.css',
  templateUrl: './number-pad.html',
})
export class NumberPad {
  /** 按下數字鍵時，把數字送給父元件 */
  readonly digit = output<string>();

  /** 依照畫面順序排列的數字鍵 */
  protected readonly digits = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
}
```

**檔案：`src/app/number-pad/number-pad.html`（整檔取代）**

```html
<div class="pad">
  @for (d of digits; track d) {
    <button type="button" class="key" (click)="digit.emit(d)">{{ d }}</button>
  }
</div>
```

按下按鈕 → `digit.emit(d)` → 父元件收到被按的數字。

## 步驟 2：OperatorPad 發出三種事件

**檔案：`src/app/operator-pad/operator-pad.ts`（整檔取代）**

```ts
import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-operator-pad',
  styleUrl: './operator-pad.css',
  templateUrl: './operator-pad.html',
})
export class OperatorPad {
  /** 按下 + - * / 時送出運算子 */
  readonly operator = output<string>();
  /** 按下 ← 時通知父元件 */
  readonly backspace = output<void>();
  /** 按下 C 時通知父元件 */
  readonly clearExpression = output<void>();

  protected readonly operators = ['+', '-', '*', '/'];
}
```

`output<void>()`：這個事件**不帶任何值**，只是通知「發生了」。

**檔案：`src/app/operator-pad/operator-pad.html`（整檔取代）**

```html
<div class="pad">
  @for (op of operators; track op) {
    <button type="button" class="key" (click)="operator.emit(op)">{{ op }}</button>
  }
  <button type="button" class="key" (click)="backspace.emit()">←</button>
  <button type="button" class="key" (click)="clearExpression.emit()">C</button>
</div>
```

## 步驟 3：Display 接收 expression

**檔案：`src/app/display/display.ts`（整檔取代）**

```ts
import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-display',
  styleUrl: './display.css',
  templateUrl: './display.html',
})
export class Display {
  /** 目前的算式，例如 113*3 */
  readonly expression = input('');
}
```

`input` 也是一種 signal，所以讀取時一樣要加 `()`。

**檔案：`src/app/display/display.html`（整檔取代）**

```html
<div class="display">
  <span class="formula">{{ expression() }}</span>
  <button type="button" class="key">=</button>
  <button type="button" class="key">+</button>
</div>
```

## 步驟 4：Calculator 保存算式並處理事件

**檔案：`src/app/calculator/calculator.ts`（整檔取代）**

```ts
import { Component, signal } from '@angular/core';
import { Display } from '../display/display';
import { NumberPad } from '../number-pad/number-pad';
import { OperatorPad } from '../operator-pad/operator-pad';

@Component({
  imports: [Display, NumberPad, OperatorPad],
  selector: 'app-calculator',
  styleUrl: './calculator.css',
  templateUrl: './calculator.html',
})
export class Calculator {
  /** 目前的算式，例如 '113*3' */
  protected readonly expression = signal('');

  protected onDigit(digit: string): void {
    this.expression.update((value) => value + digit);
  }

  protected onOperator(operator: string): void {
    this.expression.update((value) => value + operator);
  }

  protected onBackspace(): void {
    // slice(0, -1)：從第 0 個字取到「倒數第 1 個字之前」＝刪掉最後一個字
    this.expression.update((value) => value.slice(0, -1));
  }

  protected onClearExpression(): void {
    this.expression.set('');
  }
}
```

**檔案：`src/app/calculator/calculator.html`（只修改上半部，table 部分不變）**

把原本的 `<app-display />` 到 `</div>`（`.keys` 結束）換成：

```html
  <!-- Component4：算式列 -->
  <app-display [expression]="expression()" />

  <div class="keys">
    <!-- Component2：數字鍵 -->
    <app-number-pad (digit)="onDigit($event)" />
    <!-- Component3：運算子鍵 -->
    <app-operator-pad
      (operator)="onOperator($event)"
      (backspace)="onBackspace()"
      (clearExpression)="onClearExpression()"
    />
  </div>
```

> 💡 屬性很多時，Prettier 會自動把它們拆成一行一個，像上面的 `<app-operator-pad>` 一樣。

## 一次按鍵的完整旅程

以按下「7」為例：

```
1. 使用者按下 NumberPad 的「7」按鈕
2. number-pad.html：(click)="digit.emit(d)"，d 是 '7'
3. calculator.html：(digit)="onDigit($event)"，$event 是 '7'
4. calculator.ts：onDigit('7') → expression 從 '11' 變成 '117'
5. expression 是 signal，改變後 Angular 知道要更新畫面
6. calculator.html：[expression]="expression()" 把 '117' 傳給 Display
7. display.html：{{ expression() }} 顯示 117
```

## 步驟 5：檢查並 Commit

```powershell
npm run lint
git add .
git commit -m "父子元件溝通：輸入算式"
```

## ✅ 檢查點

- [ ] 按 `1`、`1`、`3`、`*`、`3`，算式列顯示 `113*3`
- [ ] 按 `←`，變成 `113*`
- [ ] 按 `C`，算式列清空
- [ ] 能用自己的話說明「按一個鍵之後，資料怎麼流動」

> 你可能發現一些問題：可以連續輸入 `5++*`，也可以一開始就按運算子。這些規則下一章會處理。

## ⚠️ 常見錯誤

**1. `Can't bind to 'expression' since it isn't a known property of 'app-display'`**

`display.ts` 中沒有宣告 `expression = input('')`，或名稱拼錯（大小寫有差）。

**2. 按鍵沒有反應**

- 子元件 HTML 中是否有 `(click)="digit.emit(d)"`？
- 父元件 HTML 中的 `(digit)` 名稱是否和子元件的 `output` 名稱**完全相同**？
- 是否寫成 `onDigit()`，漏了 `$event`？

**3. 算式列顯示 `[Input Signal: …]`**

`display.html` 中讀取 input 忘了加 `()`，要寫 `{{ expression() }}`。

## 小練習

在 NumberPad 加一個 `00` 按鈕。（提示：只要改 `digits` 陣列！這就是用陣列加 `@for` 的好處。）

---

下一章：[08. 計算邏輯](08-calculator-logic.md)
