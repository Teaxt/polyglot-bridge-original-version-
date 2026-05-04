import { ipcMain } from 'electron';
import https from 'https';

async function testConnection(config: any) {
  // 简单模拟请求，实际根据 config.model 切换端点
  return { success: true, message: 'Connection OK (mock)' };
}

function translateStream(config: any, text: string, channel: string, event: any) {
  // 模拟流式返回效果，实际请替换为真正的 API 调用
  const chunks = text.split(' ').map(w => w + ' ');
  let i = 0;
  const interval = setInterval(() => {
    if (i < chunks.length) {
      event.sender.send(channel, chunks[i]);
      i++;
    } else {
      clearInterval(interval);
      event.sender.send(channel, '[DONE]');
    }
  }, 50);
}

export function registerLLMHandlers() {
  ipcMain.handle('llm:test-connection', (_, config) => testConnection(config));
  ipcMain.on('llm:translate-stream', (event, { config, text, channel }) => {
    translateStream(config, text, channel, event);
  });
}