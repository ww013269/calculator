# 09. 計算結果 table

## 本章目標

完成規格 [T-01 ~ T-09](00-spec.md#42-計算結果-table)：

- 按 `+` 把結果加入 table
- 用 `@for` 顯示每一筆資料
- 偶數灰底、奇數 `*`、正數綠字、負數紅字
- 台幣格式 `NT$1,234.00`
- `delete` 刪除單筆（大於 100 不顯示），`clear` 刪除全部

## 觀念 1：用 interface 描述一筆資料

table 的每一筆要記錄兩件事：**結果數值**，以及一個**不會重複的編號**（刪除時才知道要刪哪一筆）。

```ts
interface CalcRecord {
  id: number;
  value: number;
}
```

`interface` 是「資料的形狀」：符合 `CalcRecord` 的物件一定有 `id` 和 `value` 兩個數字。

> **為什麼不用值本身當編號？** 因為同一個結果可能加入很多次（例如兩筆都是 `2`），用值就分不出要刪哪一筆。

## 觀念 2：signal 中的陣列要「換一個新的」

```ts
// ❌ 錯誤：直接修改原本的陣列，Angular 不知道內容變了
this.records().push(newRecord);

// ✅ 正確：建立一個「新陣列」交給 signal
this.records.update((list) => [...list, newRecord]);
```

- `[...list, newRecord]`：把舊陣列的內容展開（`...`），後面加上新的一筆，組成新陣列
- `list.filter((record) => record.id !== id)`：保留所有「編號不等於 id」的項目，等於刪除該筆

## 觀念 3：偶數與奇數怎麼判斷？

`%` 是「取餘數」：`14 % 2` 是 `0`（整除），`339 % 2` 是 `1`。

`calc.ts` 新增兩個函式。規格說**小數既不是偶數也不是奇數**，所以要先用 `Number.isInteger` 確認是整數：

| 值 | `isEven` | `isOdd` |
|---|---|---|
| `14` | ✅ | ❌ |
| `339` | ❌ | ✅ |
| `-5` | ❌ | ✅（`-5 % 2` 是 `-1`，不等於 0） |
| `0` | ✅ | ❌ |
| `2.5` | ❌ | ❌ |

## 步驟 1：calc.ts 加入判斷函式

**檔案：`src/app/calc.ts`（加在檔案最下面）**

```ts
/** 是否為偶數（小數不算） */
export function isEven(value: number): boolean {
  return Number.isInteger(value) && value % 2 === 0;
}

/** 是否為奇數（小數不算） */
export function isOdd(value: number): boolean {
  return Number.isInteger(value) && value % 2 !== 0;
}
```

`&&` 是「而且」：兩邊都成立才是 `true`。

## 步驟 2：Calculator 加入 table 資料與方法

和上一章相比，新增了這些東西（其他都沒變）：

1. import `CurrencyPipe`，並放進 `imports: [ ]`
2. 從 `../calc` 多 import `isEven`、`isOdd`
3. `CalcRecord` interface
4. 狀態 `records`、`nextId`
5. 屬性 `isEven`、`isOdd`
6. 方法 `onAdd`、`onDelete`、`onClearRecords`

**檔案：`src/app/calculator/calculator.ts`（整檔取代）**

```ts
import { Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Display } from '../display/display';
import { NumberPad } from '../number-pad/number-pad';
import { OperatorPad } from '../operator-pad/operator-pad';
import { appendDigit, appendOperator, calculate, isEven, isOdd, removeLast } from '../calc';

/** table 裡的一筆計算結果 */
interface CalcRecord {
  id: number;
  value: number;
}

@Component({
  imports: [CurrencyPipe, Display, NumberPad, OperatorPad],
  selector: 'app-calculator',
  styleUrl: './calculator.css',
  templateUrl: './calculator.html',
})
export class Calculator {
  // ===== 狀態（State）=====
  protected readonly expression = signal('');
  protected readonly result = signal<number | null>(null);
  protected readonly message = signal('');
  protected readonly records = signal<CalcRecord[]>([]);
  private nextId = 1;

  // 讓 HTML 範本也能使用這兩個函式
  protected readonly isEven = isEven;
  protected readonly isOdd = isOdd;

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

  protected onAdd(): void {
    const value = this.result();
    if (value === null) {
      return;
    }
    this.records.update((list) => [...list, { id: this.nextId++, value }]);
  }

  // ===== 結果 table =====
  protected onDelete(id: number): void {
    this.records.update((list) => list.filter((record) => record.id !== id));
  }

  protected onClearRecords(): void {
    this.records.set([]);
  }

  /** 算式一改變，舊的結果與訊息就不再正確，一起清掉 */
  private updateExpression(expression: string): void {
    this.expression.set(expression);
    this.result.set(null);
    this.message.set('');
  }
}
```

### 重點說明

- **`protected readonly isEven = isEven;`**：範本只能使用元件 class 上的屬性與方法，不能直接呼叫 import 進來的函式。所以把函式「掛」到 class 上。
- **`this.nextId++`**：先用目前的值，再加 1。第一筆 id 是 1、第二筆是 2……永遠不會重複。
- **`{ id: this.nextId++, value }`**：`value` 是 `value: value` 的簡寫（屬性名稱和變數名稱一樣時可以省略）。
- **`onAdd` 中的 `if (value === null) return;`**：雖然按鈕已經停用，多一層檢查更安全，TypeScript 也才知道後面的 `value` 一定是數字。

## 步驟 3：Calculator 範本

**檔案：`src/app/calculator/calculator.html`（整檔取代）**

```html
<div class="panel">
  <!-- Component4：算式列 -->
  <app-display
    [expression]="expression()"
    [result]="result()"
    [message]="message()"
    (equals)="onEquals()"
    (add)="onAdd()"
  />

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

  <button type="button" class="clear-all" (click)="onClearRecords()">clear</button>

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
      @for (record of records(); track record.id) {
        <tr [class.even]="isEven(record.value)">
          <td class="ans" [class.positive]="record.value > 0" [class.negative]="record.value < 0">
            {{ record.value | currency: 'TWD' : 'symbol' : '1.2-2' }}
          </td>
          <td class="mark">
            @if (isOdd(record.value)) {
              *
            }
          </td>
          <td>
            @if (record.value <= 100) {
              <button type="button" class="delete" (click)="onDelete(record.id)">delete</button>
            }
          </td>
        </tr>
      } @empty {
        <tr>
          <td colspan="3" class="empty">尚無資料</td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

### 對照規格逐條看

| 規格 | 程式碼 |
|---|---|
| T-01 偶數灰底 | `<tr [class.even]="isEven(record.value)">` |
| T-02 奇數 `*` | `@if (isOdd(record.value)) { * }` |
| T-03 負數紅字 | `[class.negative]="record.value < 0"` |
| T-04 正數綠字 | `[class.positive]="record.value > 0"` |
| T-05 台幣格式 | `{{ record.value \| currency: 'TWD' : 'symbol' : '1.2-2' }}` |
| T-06 刪除單筆 | `(click)="onDelete(record.id)"` |
| T-07 大於 100 不顯示 delete | `@if (record.value <= 100) { … }`（「不大於 100」才顯示） |
| T-08 刪除全部 | `(click)="onClearRecords()"` |
| T-09 沒資料 | `@for … @empty { … }`：陣列是空的時候顯示 `@empty` 區塊 |

### currency pipe

`currency: 'TWD' : 'symbol' : '1.2-2'`，參數用 `:` 隔開：

| 參數 | 意思 |
|---|---|
| `'TWD'` | 幣別代碼：新台幣 |
| `'symbol'` | 顯示貨幣符號 `NT$` |
| `'1.2-2'` | 整數最少 1 位，小數固定 2 位 |

| 值 | 顯示 |
|---|---|
| `14` | `NT$14.00` |
| `-5` | `-NT$5.00` |
| `1234` | `NT$1,234.00` |

## 步驟 4：table 樣式

**檔案：`src/app/calculator/calculator.css`**：在 `.records th, .records td { … }` 後面、`.empty { … }` 前面加入：

```css
.ans {
  min-width: 110px;
  text-align: center;
}

/* 偶數：整列灰底 */
.even {
  background: #d9d9d9;
}

/* 正數綠字、負數紅字 */
.positive {
  color: #2e7d32;
}

.negative {
  color: #d32f2f;
}

.mark {
  width: 16px;
  text-align: center;
}

.delete {
  cursor: pointer;
}
```

## 步驟 5：檢查並 Commit

```powershell
npm run lint
git add .
git commit -m "計算結果 table"
```

## ✅ 檢查點

依序操作（每一步做完先按 `C` 清空算式）：

| 操作 | table 新增的那一列 |
|---|---|
| `7*2` → `=` → `+` | `NT$14.00` 綠字、**整列灰底**、沒有 `*`、有 delete |
| `5-10` → `=` → `+` | `-NT$5.00` **紅字**、有 `*`、有 delete |
| `113*3` → `=` → `+` | `NT$339.00` 綠字、有 `*`、**沒有 delete** |
| `10/4` → `=` → `+` | `NT$2.50` 綠字、不灰底、沒有 `*`、有 delete |

- [ ] 上表四列都正確
- [ ] 按某一列的 `delete`，只有那一列消失
- [ ] 按 `clear`，table 只剩「尚無資料」

![完成畫面](images/final-result.png)

🎉 **恭喜！計算機的功能全部完成了！**

## ⚠️ 常見錯誤

**1. 按 `+` 之後 table 沒有更新**

是否寫成 `this.records().push(…)`？請改用 `this.records.update(…)` 建立新陣列（觀念 2）。

**2. `No pipe found with name 'currency'`**

`calculator.ts` 的 `imports` 中沒有加入 `CurrencyPipe`。

**3. `Property 'isEven' does not exist on type 'Calculator'`**

範本要用的函式必須掛在 class 上：`protected readonly isEven = isEven;`。

**4. 顯示 `TWD14.00` 而不是 `NT$14.00`**

第二個參數要寫 `'symbol'`。

**5. 偶數灰底沒出現，但其他顏色正常**

`[class.even]` 要寫在 `<tr>` 上（整列），不是 `<td>` 上。也要確認 CSS 有 `.even`。

## 小練習

1. 在 table 最下面加一列「合計」，顯示所有結果的總和。（提示：用 `computed()` 建立一個衍生 signal：`protected readonly total = computed(() => this.records().reduce((sum, r) => sum + r.value, 0));`）
2. 讓 `delete` 前先確認：按第一次變成「確定？」，再按一次才刪除。

---

下一章：[10. 測試與收尾](10-testing-and-wrapup.md)
