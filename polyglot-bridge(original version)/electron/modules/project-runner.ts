import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

const runtimeWindows = new Map<string, BrowserWindow>();

function createRuntimeWindow(projectId: string) {
  // 如果已有窗口则聚焦
  const existing = runtimeWindows.get(projectId);
  if (existing && !existing.isDestroyed()) {
    existing.focus();
    return;
  }

  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
    },
    title: `运行窗口 - ${projectId}`,
  });

  const url = process.env.VITE_DEV_SERVER_URL
    ? `${process.env.VITE_DEV_SERVER_URL}/#/runtime/${projectId}`
    : `file://${path.join(__dirname, '../../dist/index.html')}#/runtime/${projectId}`;

  win.loadURL(url);
  runtimeWindows.set(projectId, win);
  win.on('closed', () => runtimeWindows.delete(projectId));
}

export function registerProjectRunnerHandlers() {
  ipcMain.on('project:start-runtime', (_, projectId) => createRuntimeWindow(projectId));
}
