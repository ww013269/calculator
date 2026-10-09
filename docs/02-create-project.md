# 02. 建立 Angular 專案

## 本章目標

- 用 Angular CLI 建立新專案
- 認識專案裡每個檔案的用途
- 啟動開發伺服器，在瀏覽器看到畫面

> 💡 **已經有這個 repo 了？**（例如你是 clone 下來的）那就跳過「步驟 1」，在專案資料夾執行 `npm install` 下載套件，然後從「步驟 2」繼續。

## 觀念：什麼是 Angular？

一個網頁由三種語言組成：

| 語言 | 負責 | 比喻 |
|---|---|---|
| **HTML** | 內容與結構：這裡有按鈕、那裡有表格 | 房子的骨架 |
| **CSS** | 外觀：顏色、大小、位置 | 油漆與裝潢 |
| **JavaScript / TypeScript** | 行為：按下按鈕後要做什麼 | 水電配線 |

**Angular** 是 Google 維護的「前端框架」：它把畫面切成一塊一塊的**元件（Component）**，每個元件都有自己的 HTML、CSS、TypeScript。就像樂高積木，最後組成整個網頁。

**TypeScript** 是「加上型別的 JavaScript」。例如它會提醒你「這裡應該放數字，你卻放了文字」，在程式執行前就抓出錯誤。

## 步驟 1：建立專案

1. 在檔案總管建立一個放專案的資料夾，例如 `C:\Users\你的名字\repo`。
2. 在 VS Code 選「檔案 → 開啟資料夾」，選擇 `repo`。
3. 按 <kbd>Ctrl</kbd> + <kbd>`</kbd> 開啟終端機，輸入：

```powershell
ng new calculator --style=css --ssr=false --routing=false --ai-config=none
```

| 參數 | 意思 |
|---|---|
| `calculator` | 專案名稱，也是資料夾名稱 |
| `--style=css` | 樣式使用一般的 CSS |
| `--ssr=false` | 不使用伺服器端渲染（進階功能，本專案用不到） |
| `--routing=false` | 不使用路由（多頁面切換，本專案只有一頁） |
| `--ai-config=none` | 不產生 AI 工具設定檔 |

等待 1～3 分鐘下載套件，看到 `Packages installed successfully` 就完成了。

4. 用 VS Code 開啟新專案：「檔案 → 開啟資料夾」→ 選 `calculator`。

> ⚠️ **一定要開啟 `calculator` 這一層**，不要開到上一層的 `repo`。ESLint、Prettier 等工具都是從開啟的資料夾找設定檔。

## 步驟 2：啟動開發伺服器

在終端機輸入：

```powershell
ng serve
```

看到下面的訊息後，按住 <kbd>Ctrl</kbd> 點擊網址，或在瀏覽器開啟 <http://localhost:4200/>：

```
  ➜  Local:   http://localhost:4200/
```

你會看到 Angular 的歡迎頁面 🎉

> 💡 `ng serve` 會**一直執行**，並且監看檔案：你一存檔，瀏覽器就自動重新整理。
> 要停止就在終端機按 <kbd>Ctrl</kbd> + <kbd>C</kbd>。
> 想同時執行其他指令？點終端機右上角的 **+** 開第二個終端機。

## 步驟 3：認識專案檔案

在 VS Code 左側「檔案總管」中可以看到：

```
calculator/
├─ .vscode/              VS Code 的專案設定（下一章會修改）
├─ node_modules/         npm 下載的套件（很大，不要手動修改，也不會進 Git）
├─ public/               圖示等靜態檔案，原封不動放到網站上
├─ src/                  ★ 我們寫的程式都在這裡
│  ├─ index.html         整個網站唯一的 HTML 頁面，裡面有 <app-root></app-root>
│  ├─ main.ts            程式進入點：啟動 Angular，把 App 元件放進 <app-root>
│  ├─ styles.css         全域樣式（整個網站共用）
│  └─ app/
│     ├─ app.ts          根元件的 TypeScript（行為）
│     ├─ app.html        根元件的 HTML（畫面）
│     ├─ app.css         根元件的 CSS（只影響這個元件）
│     ├─ app.spec.ts     根元件的測試
│     └─ app.config.ts   應用程式設定
├─ .editorconfig         編輯器基本規則（縮排 2 格等）
├─ .gitignore            哪些檔案不進 Git（例如 node_modules）
├─ .prettierrc           Prettier 自動排版設定
├─ angular.json          Angular CLI 的設定
├─ package.json          專案資訊、npm 指令、套件清單
└─ tsconfig*.json        TypeScript 編譯設定
```

**畫面是怎麼出現的？**

```
瀏覽器打開 index.html
  └─ 看到 <app-root></app-root>
       └─ main.ts 啟動 Angular，把 App 元件（app.ts）放進去
            └─ App 元件顯示 app.html 的內容 ← 我們看到的歡迎頁面
```

打開 `src/app/app.ts` 看看：

```ts
import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-root', // ← 這個元件的 HTML 標籤名稱
  styleUrl: './app.css', // ← 樣式檔
  templateUrl: './app.html', // ← 畫面檔
})
export class App {
  protected readonly title = signal('calculator');
}
```

`@Component({...})` 告訴 Angular：「下面這個 class 是一個元件，它的標籤叫 `app-root`，畫面在 `app.html`，樣式在 `app.css`」。

## 步驟 4：package.json 裡的指令

打開 `package.json`，`scripts` 區塊定義了常用指令，用 `npm run 名稱` 執行：

| 指令 | 實際執行 | 用途 |
|---|---|---|
| `npm start` | `ng serve` | 啟動開發伺服器 |
| `npm run build` | `ng build` | 建置正式版，輸出到 `dist/` |
| `npm test` | `ng test` | 執行單元測試 |

## 步驟 5：第一次 commit

`ng new` 已經幫你建好 Git 倉庫並做了第一次 commit。之後每章結束，我們都會這樣存檔：

```powershell
git status            # 看看改了哪些檔案
git add .             # 把所有變更加入這次存檔
git commit -m "說明這次做了什麼"
```

## ✅ 檢查點

- [ ] 瀏覽器 <http://localhost:4200/> 顯示 Angular 歡迎頁面
- [ ] 說得出 `index.html`、`main.ts`、`app.ts`、`app.html` 之間的關係

## ⚠️ 常見錯誤

**1. `ng serve` 出現 `Port 4200 is already in use`**

已經有一個 `ng serve` 在執行（可能在另一個終端機）。關掉它，或改用別的埠號：`ng serve --port 4300`。

**2. `ng new` 出現 `npm ERR!` 或下載失敗**

網路問題居多。刪除產生的 `calculator` 資料夾後重新執行一次。

**3. 終端機出現 `Error: This command is not available when running the Angular CLI outside a workspace.`**

你不在專案資料夾內。用 `cd calculator` 進入後再執行。

---

下一章：[03. VS Code、ESLint、Prettier 設定](03-vscode-lint-format.md)
