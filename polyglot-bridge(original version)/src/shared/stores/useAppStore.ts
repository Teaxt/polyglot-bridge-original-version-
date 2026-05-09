import { create } from 'zustand';
import { bridge } from '../../ipc-client';
import type { AppConfig } from '../../types';

interface AppState {
  config: AppConfig;
  loaded: boolean;
  loadConfig: () => Promise<void>;
  setConfig: (config: Partial<AppConfig>) => void;
  saveConfig: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  config: { apiProvider: 'openai', apiKey: '', modelTag: '', sourceLang: 'auto', targetLang: 'zh-CN' },
  loaded: false,

  loadConfig: async () => {
    try {
      const saved = await bridge.getConfig();
      if (saved && saved.apiProvider) {
        set({ config: { ...get().config, ...saved }, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (e) {
      console.error('加载配置失败:', e);
      set({ loaded: true });
    }
  },

  setConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),

  saveConfig: async () => {
    await bridge.saveConfig(get().config);
  },
}));
