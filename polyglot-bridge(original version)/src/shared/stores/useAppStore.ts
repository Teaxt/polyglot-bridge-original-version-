import { create } from 'zustand';
import { bridge } from '../../ipc-client';

interface AppState {
  config: any;
  setConfig: (config: any) => void;
  saveConfig: (config: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  config: {},
  setConfig: (config) => set({ config }),
  saveConfig: async (config) => { await bridge.saveConfig(config); }
}));