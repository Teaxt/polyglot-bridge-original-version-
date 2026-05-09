import type { BridgeAPI } from './types';

// Mock bridge for development outside Electron
function createMockBridge(): BridgeAPI {
  console.warn('⚠️ bridge 未注入，使用 Mock 模式');
  return {
    getConfig: () => Promise.resolve({ apiProvider: '', apiKey: '', modelTag: '', sourceLang: 'auto', targetLang: 'zh-CN' }),
    saveConfig: () => Promise.resolve(),
    getProjects: () => Promise.resolve([]),
    createProject: (data) => Promise.resolve({ id: 'mock', ...data, createdAt: new Date().toISOString() }),
    updateProject: () => Promise.resolve(),
    deleteProject: () => Promise.resolve(),
    testConnection: () => Promise.resolve({ success: false, message: 'Mock模式，无法测试连接' }),
    translate: () => Promise.resolve('[Mock] 翻译结果'),
    translateStream: (_config, text, _prompt, callback) => {
      const words = text.split('');
      let i = 0;
      const timer = setInterval(() => {
        if (i < words.length) { callback(words[i]); i++; }
        else { callback('[DONE]'); clearInterval(timer); }
      }, 30);
    },
    startCapture: () => {},
    stopCapture: () => {},
    onCapturedText: () => () => {},
    startRuntime: () => {},
  };
}

export const bridge: BridgeAPI = (window as any).bridge || createMockBridge();
