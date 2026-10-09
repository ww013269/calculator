# 01. 安裝開發環境

## 本章目標

- 安裝 Node.js、VS Code、Git 三個工具
- 學會打開「終端機」並輸入指令
- 安裝 Angular CLI

## 觀念：這些工具是做什麼的？

| 工具 | 比喻 | 用途 |
|---|---|---|
| **Node.js** | 廚房 | 讓電腦能執行 JavaScript 工具。Angular 的建置、測試、開發伺服器都靠它 |
| **npm** | 食材行 | Node.js 附帶的「套件管理員」，用來下載別人寫好的程式（套件） |
| **Angular CLI**（`ng` 指令） | 萬用料理機 | 建立專案、產生元件、啟動伺服器、建置，全部一行指令搞定 |
| **VS Code** | 筆記本 | 寫程式的編輯器 |
| **Git** | 存檔點 | 記錄每次修改，改壞了可以回到之前的版本 |
| **終端機（Terminal）** | 對講機 | 用打字的方式對電腦下指令 |

## 步驟 1：安裝 Node.js

1. 前往 <https://nodejs.org/>。
2. 下載標示 **LTS**（長期支援版）的版本。本教學使用 **24.x**。
3. 執行安裝檔，全部按「Next」使用預設值即可。

## 步驟 2：安裝 VS Code

1. 前往 <https://code.visualstudio.com/> 下載並安裝。
2. 安裝時建議**勾選**：
   - 「將 "以 Code 開啟" 動作加入 Windows 檔案總管的檔案/目錄操作功能表」
   - 「加入 PATH」（通常預設已勾選）
3. （可選）安裝中文介面：開啟 VS Code → 左側「擴充功能」圖示（四個方塊）→ 搜尋 `Chinese (Traditional)` → 安裝 → 重新啟動。

## 步驟 3：安裝 Git

1. 前往 <https://git-scm.com/> 下載 Git for Windows。
2. 安裝過程的選項都用預設值即可。

## 步驟 4：打開終端機

在 VS Code 中按下 <kbd>Ctrl</kbd> + <kbd>`</kbd>（Esc 下面那個鍵），畫面下方會出現終端機。Windows 預設是 **PowerShell**。

> 💡 本教學中，看到這種灰色區塊：
>
> ```powershell
> node -v
> ```
>
> 就是「在終端機輸入這行，然後按 Enter」。

先輸入以下指令，確認三個工具都裝好了：

```powershell
node -v
npm -v
git --version
```

會看到類似：

```
v24.17.0
11.13.0
git version 2.51.0.windows.1
```

數字不完全相同沒關係，**有出現版本號就代表安裝成功**。

## 步驟 5：設定 Git 身分

Git 每次存檔（commit）都會記錄是誰做的。只需要設定一次：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的 email"
```

## 步驟 6：安裝 Angular CLI

```powershell
npm install -g @angular/cli
```

- `npm install`：下載並安裝套件
- `-g`：global，安裝到整台電腦，任何資料夾都能用 `ng` 指令

安裝完成後確認：

```powershell
ng version
```

看到 `Angular CLI: 22.x.x` 就成功了。

## 終端機基本指令

| 指令 | 意思 | 例子 |
|---|---|---|
| `cd 資料夾` | 進入資料夾（change directory） | `cd calculator` |
| `cd ..` | 回到上一層 | |
| `ls` | 列出目前資料夾的檔案 | |
| `pwd` | 顯示目前在哪個資料夾 | |
| <kbd>↑</kbd> | 叫出上一個指令 | |
| <kbd>Tab</kbd> | 自動補完檔名 | 打 `cd calc` 再按 Tab |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | 停止正在執行的程式 | 停止 `ng serve` |

## ✅ 檢查點

- [ ] `node -v`、`npm -v`、`git --version`、`ng version` 都有顯示版本號

## ⚠️ 常見錯誤

**1. 輸入 `ng` 或 `npm` 出現「因為這個系統上已停用指令碼執行，所以無法載入 …ps1」**

這是 Windows PowerShell 的安全設定。執行下面這行（只影響你自己的帳號），之後重開終端機：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**2. 出現「'node' 不是內部或外部命令」**

安裝 Node.js 之前就打開的 VS Code / 終端機，還不認得新安裝的程式。**把 VS Code 完全關掉再重開**。

**3. `npm install -g` 很久都沒反應**

網路較慢時下載需要幾分鐘，耐心等候。如果出現 `ETIMEDOUT`，檢查網路或公司 Proxy 設定。

---

下一章：[02. 建立 Angular 專案](02-create-project.md)
