import { globalShortcut, clipboard, BrowserWindow, ipcMain } from 'electron';

let captureActive = false;
let lastText = '';

function startCapture() {
  captureActive = true;
  globalShortcut.register('Alt+T', () => {
    // 模拟 Ctrl+C 取词（极简版，真实场景需键盘模拟库）
    const text = clipboard.readText();
    if (text && text !== lastText) {
      lastText = text;
      BrowserWindow.getAllWindows().forEach(win => {
        if (!win.isDestroyed()) win.webContents.send('word-capture:on-text-captured', text);
      });
    }
  });
}

function stopCapture() {
  captureActive = false;
  globalShortcut.unregisterAll();
}

export function registerWordCaptureHandlers() {
  ipcMain.on('word-capture:start', startCapture);
  ipcMain.on('word-capture:stop', stopCapture);
}