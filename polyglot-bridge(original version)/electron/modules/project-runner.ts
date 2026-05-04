import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

const runtimeWindows: Map<string, BrowserWindow> = new Map();

function createRuntimeWindow(projectId: string) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true
    },
    title: `Project ${projectId}`
  });
  const url = process.env.VITE_DEV_SERVER_URL
    ? `${process.env.VITE_DEV_SERVER_URL}/#/runtime/${projectId}`
    : `file://${path.join(__dirname, '../../dist/index.html')}#/runtime/${projectId}`;
  win.loadURL(url);
  runtimeWindows.set(projectId, win);
  win.on('closed', () => runtimeWindows.delete(projectId));
}

export function registerProjectRunnerHandlers() {
  ipcMain.on('project:start-runtime', (_, projectId) => {
    createRuntimeWindow(projectId);
  });
}