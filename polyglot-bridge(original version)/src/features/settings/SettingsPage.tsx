import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-gray-600">← 返回</button>
        <h1 className="text-xl font-bold text-gray-800">🛠️ 应用设置</h1>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-6 space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">划词翻译快捷键</h3>
          <p className="text-sm text-gray-500 mb-2">当前快捷键: <code className="bg-gray-100 px-2 py-0.5 rounded">Alt + T</code></p>
          <p className="text-xs text-gray-400">在运行窗口中启用划词翻译后，使用此快捷键从剪贴板捕获文本并翻译。</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">关于</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Polyglot Bridge v2.0.0</p>
            <p>多语者大模型翻译助手</p>
            <p>便携免安装 · 多模型支持 · 划词翻译</p>
          </div>
        </div>
      </main>
    </div>
  );
}
