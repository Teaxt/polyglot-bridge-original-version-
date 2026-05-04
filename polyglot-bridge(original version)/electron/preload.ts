import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('bridge', {
  // Storage
  getConfig: () => ipcRenderer.invoke('storage:get-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('storage:save-config', config),
  getProjects: () => ipcRenderer.invoke('storage:project:list'),
  createProject: (data: any) => ipcRenderer.invoke('storage:project:create', data),
  deleteProject: (id: string) => ipcRenderer.invoke('storage:project:delete', id),

  // LLM
  testConnection: (config: any) => ipcRenderer.invoke('llm:test-connection', config),
  translateStream: (config: any, text: string, callback: (chunk: string) => void) => {
    const channel = `llm:stream-${Date.now()}`;
    ipcRenderer.on(channel, (_, chunk) => callback(chunk));
    ipcRenderer.send('llm:translate-stream', { config, text, channel });
  },

  // Word Capture
  startCapture: () => ipcRenderer.send('word-capture:start'),
  stopCapture: () => ipcRenderer.send('word-capture:stop'),
  onCapturedText: (callback: (text: string) => void) => {
    ipcRenderer.on('word-capture:on-text-captured', (_, text) => callback(text));
  },

  // Project Runner
  startRuntime: (projectId: string) => ipcRenderer.send('project:start-runtime', projectId)
});