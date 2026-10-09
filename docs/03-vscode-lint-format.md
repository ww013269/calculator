# 03. VS Code、ESLint、Prettier 設定

## 本章目標

- 安裝 Angular 開發必備的 VS Code 擴充套件
- 設定「存檔自動排版」（Prettier）
- 設定「自動抓錯」（ESLint），存檔時自動修正
- 解決 Windows 換行字元（CRLF / LF）問題

## 觀念：為什麼需要這些工具？

| 工具 | 做什麼 | 比喻 |
|---|---|---|
| **Prettier** | **排版**：縮排、空白、引號、換行，全部統一 | 自動幫你把字寫工整的鋼筆 |
| **ESLint** | **抓錯**：找出可能的 bug 或不好的寫法（例如宣告了卻沒用到的變數） | 會在旁邊畫紅線的老師 |
| **EditorConfig** | 讓不同編輯器使用同樣的基本規則（縮排 2 格、UTF-8） | 共同的稿紙格式 |

團隊中每個人的程式碼風格都一樣，看別人的程式碼才不會頭痛；而且這些工具會自動完成，你不用記任何規則。

## 步驟 1：安裝 VS Code 擴充套件

點 VS Code 左側「擴充功能」圖示（或按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>），搜尋並安裝：

| 擴充套件 | ID | 用途 |
|---|---|---|
| Angular Language Service | `angular.ng-template` | HTML 範本的自動完成、錯誤提示 |
| Prettier - Code formatter | `esbenp.prettier-vscode` | 自動排版 |
| ESLint | `dbaeumer.vscode-eslint` | 在編輯器中即時顯示 ESLint 錯誤 |
| EditorConfig for VS Code | `editorconfig.editorconfig` | 套用 `.editorconfig` |

接著把它們記錄到專案中，之後別人打開專案時，VS Code 會提示「要不要安裝建議的擴充功能？」。

**檔案：`.vscode/extensions.json`（整檔取代）**

```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=827846
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig"
  ]
}
```

> 💡 `.json` 檔裡的 `//` 是註解。VS Code 的設定檔允許寫註解，一般 JSON 不行。

## 步驟 2：加入 ESLint

在終端機（專案資料夾內）執行：

```powershell
ng add angular-eslint
```

詢問是否安裝時輸入 `Y` 按 Enter。它會自動：

- 安裝 `eslint`、`angular-eslint` 等套件
- 建立設定檔 `eslint.config.js`
- 在 `package.json` 加入 `"lint": "ng lint"` 指令

再安裝 `eslint-config-prettier`。它會關掉 ESLint 中「跟排版有關」的規則，排版全部交給 Prettier，兩個工具才不會互相打架：

```powershell
npm install -D eslint-config-prettier
```

> `-D` 代表「開發用套件」（devDependencies）：只在開發時用，不會打包進網站。

**檔案：`eslint.config.js`（修改：加上兩處 ★ 標記的行）**

```js
// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier'); // ★ 新增

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettierConfig, // ★ 新增，一定要放在最後
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
```

這份設定的意思：

- `**/*.ts`（所有 TypeScript 檔）：使用 JavaScript、TypeScript、Angular 的建議規則。
- `component-selector`：元件標籤必須以 `app-` 開頭，而且用 kebab-case（小寫加連字號），例如 `app-number-pad`。
- `**/*.html`（所有範本）：Angular 範本建議規則，加上**無障礙（Accessibility）**規則，例如圖片要有替代文字。

## 步驟 3：設定 Prettier

專案已經有 `.prettierrc`（`ng new` 建立的）：

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

- `printWidth: 100`：一行超過 100 個字元就自動換行
- `singleQuote: true`：字串用單引號 `'abc'`
- HTML 檔使用 `angular` 解析器，才看得懂 `@if`、`(click)` 等 Angular 語法

**新增檔案：`.prettierignore`**（告訴 Prettier 哪些不用排版）

```
dist
node_modules
.angular
package-lock.json
```

> 💡 如果你是 clone 這個教學 repo 來做（專案裡有 `docs/` 資料夾），請在 `.prettierignore` 多加一行 `docs`。教學文件中的範例程式碼是刻意排成那樣的（例如故意弄亂的示範），不應該被自動排版。

**修改 `package.json` 的 `scripts`**，加入 `format` 指令（注意上一行結尾要加逗號）：

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "format": "prettier --write ."
  },
```

## 步驟 4：VS Code 專案設定（存檔自動排版＋自動修正）

**新增檔案：`.vscode/settings.json`**

```json
{
  // 存檔時自動排版
  "editor.formatOnSave": true,
  // 預設用 Prettier 排版
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 存檔時自動修正 ESLint 能修的問題
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  // 讓 ESLint 也檢查 HTML 範本
  "eslint.validate": ["typescript", "html"],
  // 每行 100 字的參考線（和 .prettierrc 的 printWidth 一致）
  "editor.rulers": [100],
  "files.eol": "\n",
  "typescript.preferences.quoteStyle": "single"
}
```

> 💡 這個設定放在專案的 `.vscode/` 裡，所以**只影響這個專案**，而且會跟著 Git 分享給隊友。

## 步驟 5：統一換行字元（Windows 必做）

**觀念**：每一行結尾都有一個看不見的「換行字元」。Windows 習慣用 `CRLF`，macOS / Linux 用 `LF`。Prettier 預設要求 `LF`，但 Windows 上的 Git 預設會在取出檔案時轉成 `CRLF`，結果 Prettier 會說「每個檔案都排版錯誤」。

解法是告訴 Git：這個專案一律用 LF。

**新增檔案：`.gitattributes`**

```
* text=auto eol=lf
```

接著執行：

```powershell
git add --renormalize .
npm run format
```

- `git add --renormalize .`：讓 Git 依照新規則重新處理所有檔案
- `npm run format`：用 Prettier 把整個專案排版一次

## 步驟 6：驗證設定

**1）確認 ESLint 沒有錯誤：**

```powershell
npm run lint
```

應該看到 `All files pass linting.`

**2）確認排版都符合規則：**

```powershell
npx prettier --check .
```

應該看到 `All matched files use Prettier code style!`

**3）體驗「存檔自動排版」**：打開 `src/app/app.ts`，故意把它弄亂：

```ts
export class App {
protected readonly title = signal("calculator")
}
```

按 <kbd>Ctrl</kbd> + <kbd>S</kbd> 存檔，它會立刻變回：

```ts
export class App {
  protected readonly title = signal('calculator');
}
```

縮排、單引號、分號全部自動修好 ✨

**4）體驗 ESLint 抓錯**：在 `export class App {` 下一行加入：

```ts
  private unused: any;
```

`any` 底下會出現紅色波浪線，滑鼠移上去會看到 `Unexpected any. Specify a different type.`。ESLint 提醒你：`any` 會讓 TypeScript 失去型別檢查。**確認看到後把這行刪掉。**

> 如果沒看到紅線：按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> → 輸入 `Developer: Reload Window` → Enter，重新載入 VS Code。

## 步驟 7：Commit

```powershell
git add .
git commit -m "設定 ESLint、Prettier 與 VS Code"
```

## ✅ 檢查點

- [ ] `npm run lint` → `All files pass linting.`
- [ ] `npx prettier --check .` → `All matched files use Prettier code style!`
- [ ] 故意弄亂排版後存檔，會自動排好
- [ ] 寫 `any` 會出現 ESLint 紅線

## ⚠️ 常見錯誤

**1. 存檔沒有自動排版**

- 確認右下角狀態列有 `Prettier` 字樣，旁邊沒有 ⚠️ 或 ❌。
- 在檔案中按右鍵 →「格式化文件時使用…」→「設定預設格式器」→ 選 Prettier。
- 確認 VS Code 開啟的是 `calculator` 資料夾本身，不是它的上一層。

**2. `npx prettier --check .` 幾乎每個檔案都出現 `[warn]`**

是換行字元的問題，請確實完成「步驟 5」。

**3. `ng add angular-eslint` 失敗**

確認目前在專案資料夾內（終端機路徑結尾是 `calculator`），並且網路正常。

---

下一章：[04. HTML / CSS 速成](04-html-css-basics.md)
