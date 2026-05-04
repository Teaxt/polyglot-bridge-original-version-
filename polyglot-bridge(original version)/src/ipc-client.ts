// 安全获取 bridge，如果不存在则返回 mock 对象（避免崩溃）
const getBridge = () => {
  const b = (window as any).bridge;
  if (!b) {
    console.warn('⚠️ bridge 未注入，请确认是否在 Electron 窗口中打开应用');
  }
  return b || createMockBridge();
};

function createMockBridge() {
  return {
    getConfig: () => Promise.resolve({}),
    saveConfig: () => Promise.resolve(),
    getProjects: () => Promise.resolve([]),
    createProject: () => Promise.resolve({ id: 'mock' }),
    deleteProject: () => Promise.resolve(),
    testConnection: () => Promise.resolve({ success: false, message: '未连接' }),
    translateStream: () => {},
    startCapture: () => {},
    stopCapture: () => {},
    onCapturedText: () => {},
    startRuntime: () => {}
  };
}

export const bridge = getBridge();