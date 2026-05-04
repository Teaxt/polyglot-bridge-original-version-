# polyglot-bridge-original-version-
polyglot-bridge最初始的版本，我需要进行黑箱测试


<<<<<<< HEAD
<div align="center">

# Polyglot Bridge

<h3>多语者大模型翻译助手</h3>

> 便携免安装 · 多模型自由切换 · 划词翻译 · PotPlayer 联动

[![License](https://img.shields.io/github/license/你的用户名/polyglot-bridge)](./LICENSE)
[![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 项目介绍

**Polyglot Bridge** 是一款桌面端翻译工具，面向多语言学习者、翻译从业者和科研人员。  
它通过集成大语言模型（LLM）API（如 OpenAI、Anthropic、Google Gemini、DeepSeek 等），提供可高度定制的翻译与语言处理工作流。  

所有配置与项目数据均以**本地文件**形式保存，无需任何后端服务，彻底保护你的 API Key 与翻译内容隐私。

---

## 🚀 核心特性

- **完全便携，免安装**  
  单个文件夹或单文件即可运行，不污染系统，可放入 U 盘随身携带。

- **多模型、多语言自由切换**  
  支持主流大模型提供商，用户只需提供自己的 API Key，即可在“翻译全文”、“解释单词”、“总结段落”等模式间灵活切换。

- **以“项目”为单位隔离工作上下文**  
  类似 Docker Desktop 镜像管理逻辑，每个项目保存独立的 API 配置、语言预设和备注，启动后生成独立运行窗口。

- **全局划词翻译**  
  自定义快捷键（默认 `Alt+T`）快速捕获选中文本，弹出悬浮窗显示翻译结果，支持朗读、复制、钉住。

- **视频播放器联动**  
  可与 PotPlayer 等支持“字幕复制到剪贴板”的播放器无缝协作，自动翻译视频字幕。

- **纯本地存储，隐私无忧**  
  所有配置、项目、翻译历史均保存在本地 SQLite 数据库中，无数据外泄。

- **模块化架构，易于扩展**  
  采用 Electron 主/渲染进程分离 + React 前端模块化设计，可快速增加新的取词方式或大模型适配器。

---

## 🛠️ 技术栈

| 类别       | 技术选型                                                 |
|------------|----------------------------------------------------------|
| 桌面框架   | [Electron](https://www.electronjs.org/)                  |
| 前端 UI    | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/) |
| 状态管理   | [Zustand](https://github.com/pmndrs/zustand)             |
| 本地存储   | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Markdown 渲染 | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| 打包分发   | [electron-builder](https://www.electron.build/)         |
| 开发工具   | [Vite](https://vitejs.dev/) + [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron) |

---

## 📦 快速开始

### 环境要求
- Node.js >= 18
- npm 或 pnpm（推荐 npm）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/polyglot-bridge.git
cd polyglot-bridge

# 安装依赖
npm install

# 启动开发服务器
npm run dev
=======
# polyglot-bridge-original-version-
polyglot-bridge最初始的版本，我需要进行黑箱测试
>>>>>>> 8c2ea3b7c0d46da87ba2f25a38836aa7d6599b42
