import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../shared/stores/useAppStore';
import { bridge } from '../../ipc-client';

export default function SetupPage() {
  const { config, setConfig, saveConfig } = useAppStore();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'openai');
  const [sourceLang, setSourceLang] = useState(config.sourceLang || 'auto');
  const [targetLang, setTargetLang] = useState(config.targetLang || 'zh');

  useEffect(() => {
  if (bridge.getConfig) {
    bridge.getConfig().then((c: any) => {
      if (c && c.apiKey) setConfig(c);
    }).catch(console.error);
  } else {
    console.warn('bridge.getConfig 不可用，使用默认配置');
  }
}, []);

  const handleSave = () => {
    const newConfig = { apiKey, model, sourceLang, targetLang };
    setConfig(newConfig);
    saveConfig(newConfig);
    navigate('/projects');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">初步设置</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">模型提供商</label>
          <select value={model} onChange={e => setModel(e.target.value)} className="w-full border rounded p-2">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="gemini">Google Gemini</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">API Key</label>
          <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">源语言</label>
            <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full border rounded p-2">
              <option value="auto">自动检测</option>
              <option value="en">英语</option>
              <option value="ja">日语</option>
              <option value="ko">韩语</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">目标语言</label>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full border rounded p-2">
              <option value="zh">中文</option>
              <option value="en">英语</option>
              <option value="ja">日语</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button onClick={() => navigate('/projects')} className="bg-gray-200 px-4 py-2 rounded">稍后设置</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded">确定并进入项目管理</button>
        </div>
      </div>
    </div>
  );
}