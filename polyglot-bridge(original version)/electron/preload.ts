import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('bridge', {
  // 配置
  getConfig: () => ipcRenderer.invoke('storage:get-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('storage:save-config', config),
  
  // 项目
  getProjects: () => ipcRenderer.invoke('storage:project:list'),
  createProject: (data: any) => ipcRenderer.invoke('storage:project:create', data),
  updateProject: (id: string, data: any) => ipcRenderer.invoke('storage:project:update', id, data),
  deleteProject: (id: string) => ipcRenderer.invoke('storage:project:delete', id),
  
  // LLM
  testConnection: (config: any) => ipcRenderer.invoke('llm:test-connection', config),
  translate: (config: any, text: string, prompt: string) => ipcRenderer.invoke('llm:translate', config, text, prompt),
  translateStream: (config: any, text: string, prompt: string, callback: (chunk: string) => void) => {
    const channel = `llm:stream-${Date.now()}-${Math.random()}`;
    const handler = (_: any, chunk: string) => callback(chunk);
    ipcRenderer.on(channel, handler);
    ipcRenderer.send('llm:translate-stream', { config, text, prompt, channel });
    return () => ipcRenderer.removeListener(channel, handler);
  },
  
  // 划词翻译
  startCapture: () => ipcRenderer.send('word-capture:start'),
  stopCapture: () => ipcRenderer.send('word-capture:stop'),
  onCapturedText: (callback: (text: string) => void) => {
    const handler = (_: any, text: string) => callback(text);
    ipcRenderer.on('word-capture:on-text-captured', handler);
    return () => ipcRenderer.removeListener('word-capture:on-text-captured', handler);
  },
  
  // 运行窗口
  startRuntime: (projectId: string) => ipcRenderer.send('project:start-runtime', projectId),
});
