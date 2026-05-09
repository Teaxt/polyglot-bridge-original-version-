import { globalShortcut, clipboard, BrowserWindow, ipcMain } from 'electron';

let captureActive = false;
let lastText = '';

function startCapture() {
  if (captureActive) return;
  captureActive = true;

  globalShortcut.register('Alt+T', () => {
    const text = clipboard.readText().trim();
    if (text && text !== lastText) {
      lastText = text;
      BrowserWindow.getAllWindows().forEach(win => {
        if (!win.isDestroyed()) {
          win.webContents.send('word-capture:on-text-captured', text);
        }
      });
    }
  });
}

function stopCapture() {
  if (!captureActive) return;
  captureActive = false;
  globalShortcut.unregister('Alt+T');
}

export function registerWordCaptureHandlers() {
  ipcMain.on('word-capture:start', startCapture);
  ipcMain.on('word-capture:stop', stopCapture);
}
