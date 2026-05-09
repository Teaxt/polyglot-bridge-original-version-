// 全局配置
export interface AppConfig {
  apiProvider: string;
  apiKey: string;
  modelTag: string;
  sourceLang: string;
  targetLang: string;
}

// 项目数据
export interface Project {
  id: string;
  name: string;
  apiProvider: string;
  apiKey: string;
  modelTag: string;
  sourceLang: string;
  targetLang: string;
  note: string;
  createdAt: string;
}

// LLM配置
export interface LLMConfig {
  apiProvider: string;
  apiKey: string;
  modelTag: string;
}

// 运行时模式
export type RuntimeMode = 'translate' | 'explain' | 'summary' | 'custom';

// Bridge API接口
export interface BridgeAPI {
  // 配置
  getConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<void>;
  
  // 项目
  getProjects(): Promise<Project[]>;
  createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<void>;
  deleteProject(id: string): Promise<void>;
  
  // LLM
  testConnection(config: LLMConfig): Promise<{ success: boolean; message: string }>;
  translate(config: LLMConfig, text: string, prompt: string): Promise<string>;
  translateStream(config: LLMConfig, text: string, prompt: string, callback: (chunk: string) => void): void;
  
  // 划词翻译
  startCapture(): void;
  stopCapture(): void;
  onCapturedText(callback: (text: string) => void): void;
  
  // 运行窗口
  startRuntime(projectId: string): void;
}
