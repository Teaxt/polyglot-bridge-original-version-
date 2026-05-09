import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { registerStorageHandlers } from './modules/storage';
import { registerLLMHandlers } from './modules/llm-adapter';
import { registerWordCaptureHandlers } from './modules/word-capture';
import { registerProjectRunnerHandlers } from './modules/project-runner';

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  registerStorageHandlers();
  registerLLMHandlers();
  registerWordCaptureHandlers();
  registerProjectRunnerHandlers();
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
