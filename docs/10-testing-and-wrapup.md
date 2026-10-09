# 10. 測試與收尾

## 本章目標

- 了解什麼是單元測試，以及為什麼要寫
- 用 Vitest 測試 `calc.ts` 的純函式
- 用 Angular `TestBed` 測試 Calculator 元件（模擬按鈕點擊）
- 建置正式版、跑完驗收清單

## 觀念：為什麼要寫測試？

你剛剛在第 09 章用手按了十幾次按鈕，確認每個功能都正常。如果之後修改程式，**每次都要重按一遍**嗎？

**測試**就是把「手動檢查」寫成程式，讓電腦在幾秒內幫你全部按一遍。改壞了什麼，它立刻告訴你。

Angular 22 預設使用 **Vitest** 測試工具，測試檔都以 `.spec.ts` 結尾，放在被測檔案旁邊。

## 測試的基本長相

```ts
describe('要測的東西', () => {
  it('應該要有什麼行為', () => {
    expect(實際結果).toBe(預期結果);
  });
});
```

| 語法 | 意思 |
|---|---|
| `describe` | 一組測試 |
| `it` | 一個測試案例，名稱描述「應該怎樣」 |
| `expect(x).toBe(y)` | 斷言：x 應該等於 y，不相等測試就失敗 |
| `toBeNull()`、`toBeTruthy()`、`toContain()` | 其他常用的比對方式 |

## 步驟 1：先跑一次測試

```powershell
ng test --watch=false
```

> 不加 `--watch=false` 的話，測試會持續監看檔案，存檔就自動重跑。按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 結束。

你會發現 **`App` 的測試失敗了**：

```
FAIL  |calculator| src/app/app.spec.ts > App > should render title
```

因為它在找歡迎頁面的 `<h1>Hello, calculator</h1>`，但我們在第 06 章已經把 `app.html` 改掉了。**程式改了，測試也要跟著更新**。

**檔案：`src/app/app.spec.ts`（整檔取代）**

```ts
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the calculator', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-calculator')).toBeTruthy();
  });
});
```

## 步驟 2：測試純函式 calc.ts

純函式最好測：給輸入、檢查輸出。

**檔案：`src/app/calc.spec.ts`（新檔案）**

```ts
import { appendDigit, appendOperator, calculate, isEven, isOdd, removeLast } from './calc';

describe('calc', () => {
  it('appendDigit：把數字接在後面', () => {
    expect(appendDigit('11', '3')).toBe('113');
  });

  it('appendOperator：空算式不能加運算子', () => {
    expect(appendOperator('', '+')).toBe('');
  });

  it('appendOperator：連按運算子會替換', () => {
    expect(appendOperator('5+', '*')).toBe('5*');
  });

  it('appendOperator：已經有兩個數字就不再加', () => {
    expect(appendOperator('5+2', '-')).toBe('5+2');
  });

  it('removeLast：刪掉最後一個字', () => {
    expect(removeLast('113*')).toBe('113');
  });

  it('calculate：四則運算', () => {
    expect(calculate('1+1')).toBe(2);
    expect(calculate('5-10')).toBe(-5);
    expect(calculate('113*3')).toBe(339);
    expect(calculate('10/4')).toBe(2.5);
  });

  it('calculate：算式不完整或除以 0 回傳 null', () => {
    expect(calculate('5+')).toBeNull();
    expect(calculate('8/0')).toBeNull();
  });

  it('isEven / isOdd：小數兩者都不是', () => {
    expect(isEven(14)).toBe(true);
    expect(isOdd(-5)).toBe(true);
    expect(isEven(2.5)).toBe(false);
    expect(isOdd(2.5)).toBe(false);
  });
});
```

注意每個 `it` 都對應[規格書](00-spec.md#4-功能需求)的一條規則。**測試本身就是「會自己檢查的規格書」**。

## 步驟 3：測試 Calculator 元件

元件測試要**模擬使用者操作**：在測試環境中建立元件、找到按鈕、點擊、檢查畫面。

**檔案：`src/app/calculator/calculator.spec.ts`（整檔取代）**

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('Calculator', () => {
  let fixture: ComponentFixture<Calculator>;
  let element: HTMLElement;

  /** 在指定區塊（area）裡，找到文字相符的按鈕並點擊 */
  async function click(area: string, label: string): Promise<void> {
    const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>(`${area} button`));
    const button = buttons.find((b) => b.textContent?.trim() === label);
    if (!button) {
      throw new Error(`在 ${area} 找不到按鈕：${label}`);
    }
    button.click();
    await fixture.whenStable();
  }

  /** 用數字鍵、運算子鍵輸入，例如 type('113*3') */
  async function type(keys: string): Promise<void> {
    for (const key of keys) {
      const area = /\d/.test(key) ? 'app-number-pad' : 'app-operator-pad';
      await click(area, key);
    }
  }

  function formula(): string {
    return element.querySelector('.formula')?.textContent?.trim() ?? '';
  }

  function rows(): HTMLTableRowElement[] {
    return Array.from(element.querySelectorAll('tbody tr'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculator],
    }).compileComponents();

    fixture = TestBed.createComponent(Calculator);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('按 = 會顯示計算結果', async () => {
    await type('113*3');
    await click('app-display', '=');
    expect(formula()).toContain('113*3');
    expect(formula()).toContain('= 339');
  });

  it('按 + 加入 table：台幣格式、正數綠字、奇數 *、大於 100 沒有 delete', async () => {
    await type('113*3');
    await click('app-display', '=');
    await click('app-display', '+');
    const row = rows()[0];
    expect(row.querySelector('.ans')?.textContent?.trim()).toBe('NT$339.00');
    expect(row.querySelector('.ans')?.classList).toContain('positive');
    expect(row.querySelector('.mark')?.textContent?.trim()).toBe('*');
    expect(row.querySelector('.delete')).toBeNull();
  });

  it('負數紅字、偶數整列灰底', async () => {
    await type('5-10');
    await click('app-display', '=');
    await click('app-display', '+');
    await type('C7*2');
    await click('app-display', '=');
    await click('app-display', '+');
    expect(rows()[0].querySelector('.ans')?.textContent?.trim()).toBe('-NT$5.00');
    expect(rows()[0].querySelector('.ans')?.classList).toContain('negative');
    expect(rows()[1].classList).toContain('even');
  });

  it('← 刪除最後一個字，C 清空算式', async () => {
    await type('12+←');
    expect(formula()).toBe('12');
    await type('C');
    expect(formula()).toBe('');
  });

  it('delete 刪除單筆、clear 刪除全部', async () => {
    await type('1+1');
    await click('app-display', '=');
    await click('app-display', '+');
    await click('app-display', '+');
    expect(rows().length).toBe(2);
    await click('table', 'delete');
    expect(rows().length).toBe(1);
    await click('.panel', 'clear');
    expect(rows()[0].textContent).toContain('尚無資料');
  });

  it('除以 0 顯示「無法計算」', async () => {
    await type('8/0');
    await click('app-display', '=');
    expect(element.querySelector('.message')?.textContent).toContain('無法計算');
  });
});
```

### 重點說明

| 程式碼 | 意思 |
|---|---|
| `beforeEach` | **每個** `it` 執行前都先跑一次：建立一個全新的 Calculator，測試之間互不影響 |
| `TestBed.createComponent` | 在測試環境中建立元件 |
| `fixture.nativeElement` | 元件產生的 HTML 元素 |
| `querySelector('.formula')` | 用 CSS 選擇器找**第一個**符合的元素 |
| `querySelectorAll('tbody tr')` | 找**全部**符合的元素 |
| `await fixture.whenStable()` | 等 Angular 把畫面更新完再繼續 |
| `async` / `await` | 「等一下」：等前一件事做完再做下一件 |
| `?.` | 可選串連：前面如果是 null 就停下來，不會出錯 |
| `?? ''` | 前面是 null 或 undefined 時，改用 `''` |

### 💡 為什麼 `click` 要指定區塊（area）？

畫面上有**兩個** `+` 按鈕：運算子鍵的 `+`，和算式列上「加入 table」的 `+`。如果只用文字找按鈕，會找到排在前面的那一個（算式列的），測試就會按錯鍵！

所以 `click('app-operator-pad', '+')` 和 `click('app-display', '+')` 要分清楚。這也提醒我們：**寫測試時要像使用者一樣精確**。

## 步驟 4：執行全部測試

```powershell
ng test --watch=false
```

應該看到：

```
 Test Files  6 passed (6)
      Tests  19 passed (19)
```

> 💡 **故意弄壞試試看**：把 `calc.ts` 中的 `first + second` 改成 `first - second`，再跑一次測試，看看哪些測試失敗、錯誤訊息長什麼樣子。**確認看過後改回來！**

## 步驟 5：建置正式版

```powershell
ng build
```

成功會看到：

```
Application bundle generation complete.
Output location: …\calculator\dist\calculator
```

`dist/calculator/browser/` 裡的檔案就是可以放到網頁伺服器上的正式網站。（`dist/` 已經在 `.gitignore` 中，不會進 Git。）

## 步驟 6：最終驗收

逐項執行，全部通過才算完成：

```powershell
npm run lint
npx prettier --check .
ng test --watch=false
ng build
```

- [ ] `All files pass linting.`
- [ ] `All matched files use Prettier code style!`
- [ ] 測試全部 passed
- [ ] `Application bundle generation complete.`
- [ ] [規格書的驗收條件](00-spec.md#7-驗收條件)全部打勾

最後 commit：

```powershell
git add .
git commit -m "加入單元測試"
```

🎉 **恭喜你完成了第一個 Angular 專案！**

## 回顧：你學會了什麼

| 主題 | 內容 |
|---|---|
| 開發環境 | Node.js、npm、Angular CLI、VS Code、Git |
| 程式碼品質 | ESLint 抓錯、Prettier 排版、存檔自動修正、`.gitattributes` 換行字元 |
| HTML / CSS | 標籤、屬性、class、flex、grid、table |
| TypeScript | 型別、函式、class、interface、陣列操作 |
| Angular | 元件、signal、`{{ }}`、`[ ]`、`( )`、`@if`、`@for`、`@empty`、pipe |
| 元件設計 | 父子溝通 `input()` / `output()`、資料往下事件往上、純函式分離 |
| 測試 | Vitest、TestBed、模擬點擊 |

## 常見問題 FAQ

**Q1. 存檔後瀏覽器沒有更新？**
確認 `ng serve` 還在執行、終端機沒有紅字錯誤。可以按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 停止後重新 `ng serve`。

**Q2. VS Code 一直顯示紅線，但 `ng build` 是成功的？**
VS Code 可能還在讀舊的狀態。<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> → `Developer: Reload Window`。

**Q3. 改壞了，想回到上一次 commit？**

```powershell
git status                 # 看看改了哪些檔案
git restore 檔案路徑        # 還原單一檔案
git restore .              # ⚠️ 還原全部未 commit 的修改（無法復原）
```

**Q4. `npm install` 或 `ng` 指令出現奇怪的錯誤？**
試著刪除 `node_modules` 資料夾和 `.angular` 資料夾，再執行 `npm install`。

**Q5. ESLint 說 `The selector should start with one of these prefixes: "app"`？**
元件的 `selector` 要以 `app-` 開頭，例如 `app-display`。

**Q6. `NG0100: ExpressionChangedAfterItHasBeenCheckedError`？**
通常是在範本中呼叫了「每次結果都不一樣」的方法（例如產生亂數）。範本中只放讀取資料的運算式，修改資料放到事件處理方法中。

**Q7. 我想學更多 Angular？**
官方教學：<https://angular.dev/tutorials>，以及官方文件：<https://angular.dev/overview>。

## 延伸挑戰

1. **鍵盤輸入**：讓使用者可以用鍵盤打數字和運算子。（提示：`@HostListener` 或在 `host` 設定 `'(document:keydown)'`）
2. **保存紀錄**：重新整理後 table 資料還在。（提示：`localStorage` 搭配 `effect()`）
3. **支援小數點與負數**：需要修改正規表達式和 `appendOperator` 的規則，並補上測試。
4. **部署上線**：把 `ng build` 的結果放到 GitHub Pages 或 Firebase Hosting。
