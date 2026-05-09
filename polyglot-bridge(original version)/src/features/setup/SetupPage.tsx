import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../shared/stores/useAppStore';
import { bridge } from '../../ipc-client';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic', models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'] },
  { value: 'deepseek', label: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
  { value: 'gemini', label: 'Google Gemini', models: ['gemini-pro', 'gemini-1.5-pro'] },
  { value: 'moonshot', label: 'Moonshot', models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'] },
];

const LANGUAGES = [
  { value: 'auto', label: '自动检测' },
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'fr', label: '法语' },
  { value: 'de', label: '德语' },
  { value: 'es', label: '西班牙语' },
  { value: 'ru', label: '俄语' },
  { value: 'ar', label: '阿拉伯语' },
  { value: 'pt', label: '葡萄牙语' },
  { value: 'it', label: '意大利语' },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const { config, setConfig, saveConfig } = useAppStore();
  const [apiProvider, setApiProvider] = useState(config.apiProvider || 'openai');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [modelTag, setModelTag] = useState(config.modelTag || '');
  const [sourceLang, setSourceLang] = useState(config.sourceLang || 'auto');
  const [targetLang, setTargetLang] = useState(config.targetLang || 'zh-CN');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const currentProvider = PROVIDERS.find(p => p.value === apiProvider);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await bridge.testConnection({ apiProvider, apiKey, modelTag: modelTag || currentProvider?.models[0] || '' });
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = async () => {
    const newConfig = { apiProvider, apiKey, modelTag: modelTag || currentProvider?.models[0] || '', sourceLang, targetLang };
    setConfig(newConfig);
    await saveConfig();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-gray-600">← 返回</button>
        <h1 className="text-xl font-bold text-gray-800">⚙️ 初步设置</h1>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-6 space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">模型提供商</label>
          <select
            value={apiProvider}
            onChange={e => { setApiProvider(e.target.value); setModelTag(''); setTestResult(null); }}
            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">API Key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setTestResult(null); }}
              placeholder="输入你的 API Key"
              className="flex-1 border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={handleTest}
              disabled={!apiKey || testing}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
            >
              {testing ? '测试中...' : '测试连接'}
            </button>
          </div>
          {testResult && (
            <div className={`mt-2 text-sm px-3 py-2 rounded-lg ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult.success ? '✅' : '❌'} {testResult.message}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">模型（选填）</label>
          <select
            value={modelTag}
            onChange={e => setModelTag(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">使用默认模型</option>
            {currentProvider?.models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">翻译语言预设（选填）</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">源语言</label>
              <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">目标语言</label>
              <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                {LANGUAGES.filter(l => l.value !== 'auto').map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={() => navigate('/projects')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
            稍后设置，进入项目管理
          </button>
          <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            保存并返回主页
          </button>
        </div>
      </main>
    </div>
  );
}
