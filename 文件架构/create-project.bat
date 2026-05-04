@echo off
chcp 65001 >nul
title polyglot-bridge 项目结构自动生成器
echo ==============================================
echo          正在生成项目目录结构...
echo ==============================================

:: 切换到脚本所在目录（核心：确保项目生成在正确位置）
cd /d "%~dp0"

:: ====================== 创建所有目录 ======================
md polyglot-bridge
md polyglot-bridge\electron
md polyglot-bridge\electron\modules
md polyglot-bridge\src
md polyglot-bridge\src\features
md polyglot-bridge\src\features\welcome
md polyglot-bridge\src\features\setup
md polyglot-bridge\src\features\project-manager
md polyglot-bridge\src\features\runtime
md polyglot-bridge\src\shared
md polyglot-bridge\src\shared\components
md polyglot-bridge\src\shared\stores
md polyglot-bridge\src\assets

:: ====================== 创建根目录文件 ======================
type nul > polyglot-bridge\package.json
type nul > polyglot-bridge\tsconfig.json
type nul > polyglot-bridge\tsconfig.node.json
type nul > polyglot-bridge\vite.config.ts
type nul > polyglot-bridge\tailwind.config.js
type nul > polyglot-bridge\postcss.config.js
type nul > polyglot-bridge\index.html
type nul > polyglot-bridge\.gitignore

:: ====================== 创建 electron 目录文件 ======================
type nul > polyglot-bridge\electron\main.ts
type nul > polyglot-bridge\electron\preload.ts
type nul > polyglot-bridge\electron\modules\storage.ts
type nul > polyglot-bridge\electron\modules\llm-adapter.ts
type nul > polyglot-bridge\electron\modules\word-capture.ts
type nul > polyglot-bridge\electron\modules\project-runner.ts

:: ====================== 创建 src 目录文件 ======================
type nul > polyglot-bridge\src\main.tsx
type nul > polyglot-bridge\src\App.tsx
type nul > polyglot-bridge\src\router.tsx
type nul > polyglot-bridge\src\ipc-client.ts
type nul > polyglot-bridge\src\assets\styles.css

:: ====================== 创建 src/features 目录文件 ======================
type nul > polyglot-bridge\src\features\welcome\WelcomePage.tsx
type nul > polyglot-bridge\src\features\setup\SetupPage.tsx
type nul > polyglot-bridge\src\features\project-manager\ProjectsPage.tsx
type nul > polyglot-bridge\src\features\project-manager\ProjectDetail.tsx
type nul > polyglot-bridge\src\features\runtime\RuntimePage.tsx

:: ====================== 创建 src/shared 目录文件 ======================
type nul > polyglot-bridge\src\shared\components\MarkdownViewer.tsx
type nul > polyglot-bridge\src\shared\components\FloatingResult.tsx
type nul > polyglot-bridge\src\shared\stores\useAppStore.ts
type nul > polyglot-bridge\src\shared\stores\useProjectStore.ts

echo.
echo ✅ 项目结构创建完成！
echo 📁 生成路径：%cd%\polyglot-bridge
echo.
echo 脚本将在1秒后自动删除...
timeout /t 1 /nobreak >nul

:: 自动删除脚本自身（核心功能）
del "%~f0"