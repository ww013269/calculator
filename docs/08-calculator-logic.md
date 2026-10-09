# 08. 計算邏輯：=、←、C

## 本章目標

- 把計算規則寫成**純函式**，放在獨立的 `calc.ts`
- 實作規格 [F-01 ~ F-08](00-spec.md#41-算式列component4)：運算子規則、`=` 計算、除以 0
- Display 顯示結果與錯誤訊息，並發出 `equals`、`add` 事件
- 用 `number` pipe 格式化數字

## 觀念：什麼是純函式？為什麼要分出來？

**純函式（Pure Function）**：

- 輸入一樣，輸出**一定**一樣（`calculate('1+1')` 永遠是 `2`）
- 不會偷偷改變外面的東西

把「規則」從元件中抽出來放到 `calc.ts`：

- 元件只負責「什麼時候呼叫」，規則只寫在一個地方
- **很容易測試**：不需要畫面，丟輸入、檢查輸出就好（第 10 章會寫測試）

## 步驟 1：建立 calc.ts

在 `src/app/` 上按右鍵 →「新增檔案」→ 輸入 `calc.ts`。

**檔案：`src/app/calc.ts`（新檔案）**

```ts
/** 計算機支援的四種運算子 */
export const OPERATORS = ['+', '-', '*', '/'];

/** 判斷一個字元是不是運算子 */
export function isOperator(char: string): boolean {
  return OPERATORS.includes(char);
}

/** 在算式後面加上一個數字 */
export function appendDigit(expression: string, digit: string): string {
  return expression + digit;
}

/**
 * 在算式後面加上運算子：
 * - 算式是空的 → 不加（一定要先有數字1）
 * - 最後一個字已經是運算子 → 換成新的運算子
 * - 已經有運算子了（例如 12+3）→ 不加（只算兩個數字）
 */
export function appendOperator(expression: string, operator: string): string {
  if (expression === '') {
    return expression;
  }
  const lastChar = expression.slice(-1);
  if (isOperator(lastChar)) {
    return expression.slice(0, -1) + operator;
  }
  const hasOperator = [...expression].some((char) => isOperator(char));
  if (hasOperator) {
    return expression;
  }
  return expression + operator;
}

/** 刪除算式最後一個字 */
export function removeLast(expression: string): string {
  return expression.slice(0, -1);
}

/**
 * 計算「數字1 運算子 數字2」。
 * 算式不完整或除以 0 時回傳 null，代表「無法計算」。
 */
export function calculate(expression: string): number | null {
  const match = /^(\d+)([+\-*/])(\d+)$/.exec(expression);
  if (match === null) {
    return null;
  }
  const first = Number(match[1]);
  const operator = match[2];
  const second = Number(match[3]);

  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? null : first / second;
    default:
      return null;
  }
}
```

### 逐段說明

**`export`**：讓其他檔案可以 `import` 這些函式。

**`if (條件) { … }`**：條件成立才執行大括號裡的程式。`===` 是「等於」，`!==` 是「不等於」。`return` 會立刻結束函式並回傳值。

**字串操作**

| 寫法 | 意思 | `'113*'` 的結果 |
|---|---|---|
| `s.slice(-1)` | 取最後 1 個字 | `'*'` |
| `s.slice(0, -1)` | 去掉最後 1 個字 | `'113'` |
| `[...s]` | 拆成一個字一個字的陣列 | `['1','1','3','*']` |
| `陣列.some(條件)` | 是否**有任何一個**符合條件 | 有 `*` → `true` |
| `陣列.includes(值)` | 陣列中是否包含這個值 | |

**正規表達式（Regular Expression）**：`/^(\d+)([+\-*/])(\d+)$/` 是描述「文字長相」的規則：

```
^          開頭
(\d+)      一個以上的數字      → 第 1 組：數字1
([+\-*/])  + - * / 其中一個    → 第 2 組：運算子
(\d+)      一個以上的數字      → 第 3 組：數字2
$          結尾
```

`exec('113*3')` 會得到 `match[1]` = `'113'`、`match[2]` = `'*'`、`match[3]` = `'3'`。不符合規則（例如 `'5+'`）就得到 `null`。

> 💡 正規表達式看起來像外星文，現在看得懂這一行就夠了。

**`Number('113')`**：把文字 `'113'` 轉成數字 `113`。文字 `'1' + '1'` 是 `'11'`（接起來），數字 `1 + 1` 才是 `2`。

**`switch`**：依照 `operator` 的值走不同的 `case`，等同於一連串的 `if`。

**`條件 ? A : B`**（三元運算子）：條件成立用 A，否則用 B。`second === 0 ? null : first / second`＝「除數是 0 就回傳 null，否則相除」。

## 步驟 2：OperatorPad 改用共用的 OPERATORS

運算子清單現在 `calc.ts` 裡也有一份。**同樣的資料只寫一次**，以後要新增運算子才不會漏改。

**檔案：`src/app/operator-pad/operator-pad.ts`（修改兩處）**

```ts
import { Component, output } from '@angular/core';
import { OPERATORS } from '../calc'; // ★ 新增

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

  protected readonly operators = OPERATORS; // ★ 修改
}
```

## 步驟 3：Display 顯示結果並發出事件

**檔案：`src/app/display/display.ts`（整檔取代）**

```ts
import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
  selector: 'app-display',
  styleUrl: './display.css',
  templateUrl: './display.html',
})
export class Display {
  /** 目前的算式，例如 113*3 */
  readonly expression = input('');
  /** 計算結果，還沒算就是 null */
  readonly result = input<number | null>(null);
  /** 錯誤訊息，沒有錯誤就是空字串 */
  readonly message = input('');

  /** 按下 = */
  readonly equals = output<void>();
  /** 按下 +（加入 table） */
  readonly add = output<void>();
}
```

- `input<number | null>(null)`：型別是「數字或 null」，預設值 null
- `DecimalPipe`：要在範本使用 `number` pipe，必須先 import

**檔案：`src/app/display/display.html`（整檔取代）**

```html
<div class="display">
  <span class="formula">
    {{ expression() }}
    @if (result() !== null) {
      = {{ result() | number: '1.0-2' }}
    }
  </span>
  @if (message()) {
    <span class="message">{{ message() }}</span>
  }
  <button type="button" class="key" (click)="equals.emit()">=</button>
  <button type="button" class="key" [disabled]="result() === null" (click)="add.emit()">+</button>
</div>
```

### 新觀念：Pipe（管線）

`{{ 值 | pipe名稱: 參數 }}`：把值「通過管子」轉換成適合顯示的格式，**原本的資料不會被改變**。

`number: '1.0-2'` 的意思是：

```
'1.0-2'
 │ │ └─ 小數最多 2 位
 │ └─── 小數最少 0 位
 └───── 整數最少 1 位
```

| 原始值 | 顯示 |
|---|---|
| `339` | `339` |
| `2468` | `2,468`（自動加千分位） |
| `3.3333…` | `3.33` |

### 其他重點

- `@if (result() !== null)`：有結果才顯示 `= 339`
- `@if (message())`：空字串會被當成「false」，所以有訊息時才顯示
- `[disabled]="result() === null"`：還沒有結果時，`+` 按鈕停用（規格 F-05）

## 步驟 4：Calculator 使用 calc.ts

**檔案：`src/app/calculator/calculator.ts`（整檔取代）**

```ts
import { Component, signal } from '@angular/core';
import { Display } from '../display/display';
import { NumberPad } from '../number-pad/number-pad';
import { OperatorPad } from '../operator-pad/operator-pad';
import { appendDigit, appendOperator, calculate, removeLast } from '../calc';

@Component({
  imports: [Display, NumberPad, OperatorPad],
  selector: 'app-calculator',
  styleUrl: './calculator.css',
  templateUrl: './calculator.html',
})
export class Calculator {
  // ===== 狀態（State）=====
  protected readonly expression = signal('');
  protected readonly result = signal<number | null>(null);
  protected readonly message = signal('');

  // ===== 算式（Component2、3、4 傳上來的事件）=====
  protected onDigit(digit: string): void {
    this.updateExpression(appendDigit(this.expression(), digit));
  }

  protected onOperator(operator: string): void {
    this.updateExpression(appendOperator(this.expression(), operator));
  }

  protected onBackspace(): void {
    this.updateExpression(removeLast(this.expression()));
  }

  protected onClearExpression(): void {
    this.updateExpression('');
  }

  protected onEquals(): void {
    const value = calculate(this.expression());
    this.result.set(value);
    this.message.set(value === null ? '無法計算' : '');
  }

  /** 算式一改變，舊的結果與訊息就不再正確，一起清掉 */
  private updateExpression(expression: string): void {
    this.expression.set(expression);
    this.result.set(null);
    this.message.set('');
  }
}
```

**為什麼要有 `updateExpression`？** 規格 F-08 說「算式一變動，舊的結果就要清掉」。四個方法都需要做同樣的三件事，所以抽成一個 `private` 方法，避免寫四次。它只在 class 內部使用，範本用不到，所以是 `private`。

**檔案：`src/app/calculator/calculator.html`（只修改 `<app-display />` 那段）**

```html
  <!-- Component4：算式列 -->
  <app-display
    [expression]="expression()"
    [result]="result()"
    [message]="message()"
    (equals)="onEquals()"
  />
```

> Display 的 `add` 事件下一章才會接上。

## 步驟 5：檢查並 Commit

```powershell
npm run lint
git add .
git commit -m "計算邏輯：運算子規則、=、←、C"
```

## ✅ 檢查點

- [ ] `113*3` → `=` → 顯示 `113*3 = 339`
- [ ] `5-10` → `=` → 顯示 `5-10 = -5`
- [ ] `10/3` → `=` → 顯示 `10/3 = 3.33`
- [ ] `1234*2` → `=` → 顯示 `1234*2 = 2,468`
- [ ] `8/0` → `=` → 顯示紅字「無法計算」
- [ ] `5+` → `=` → 顯示「無法計算」
- [ ] 一開始就按 `+`：沒反應
- [ ] `5`、`+`、`*` → 算式是 `5*`（替換）
- [ ] `5+2` 再按 `-`：沒反應（只能兩個數字）
- [ ] 算出結果後再按任何鍵，結果消失
- [ ] 沒有結果時，算式列上的 `+` 是灰色、按不下去

## ⚠️ 常見錯誤

**1. `1+1` 算出 `11`**

忘了用 `Number()` 把文字轉成數字，文字相加會直接接起來。

**2. `No pipe found with name 'number'`**

`display.ts` 的 `imports` 中沒有加入 `DecimalPipe`。

**3. `Type 'number | null' is not assignable to type 'number'`**

TypeScript 提醒你：這個值可能是 null。宣告時要寫成 `signal<number | null>(null)`。

## 小練習

1. 讓 `calculate` 支援 `%`（取餘數）運算。需要改哪些地方？（提示：`OPERATORS`、正規表達式、`switch`）
2. 想一想：為什麼 OperatorPad 會**自動**出現 `%` 按鈕？

---

下一章：[09. 計算結果 table](09-result-table.md)
