import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../shared/stores/useAppStore';

const cards = [
  { key: 'setup', icon: '⚙️', title: '初步设置', desc: '配置API密钥、模型提供商和翻译语言', path: '/setup', color: 'from-blue-500 to-cyan-400' },
  { key: 'projects', icon: '📁', title: '项目管理', desc: '创建、管理和启动翻译项目', path: '/projects', color: 'from-emerald-500 to-teal-400' },
  { key: 'settings', icon: '🛠️', title: '应用设置', desc: '全局偏好、快捷键和高级选项', path: '/settings', color: 'from-orange-500 to-amber-400' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const config = useAppStore(s => s.config);
  const isConfigured = !!config.apiKey;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌐</span>
          <h1 className="text-xl font-bold text-gray-800">Polyglot Bridge</h1>
        </div>
        <div className="text-sm text-gray-500">
          {isConfigured ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              已配置 ({config.apiProvider})
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              未配置
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">欢迎使用 Polyglot Bridge</h2>
          <p className="text-gray-500">请选择一个功能开始使用</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => navigate(card.path)}
              className="group relative bg-white rounded-xl border hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-6">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {isConfigured && (
          <div className="mt-12 bg-white rounded-xl border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">当前配置概览</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-400">提供商</span><p className="font-medium">{config.apiProvider}</p></div>
              <div><span className="text-gray-400">模型</span><p className="font-medium">{config.modelTag || '默认'}</p></div>
              <div><span className="text-gray-400">源语言</span><p className="font-medium">{config.sourceLang === 'auto' ? '自动检测' : config.sourceLang}</p></div>
              <div><span className="text-gray-400">目标语言</span><p className="font-medium">{config.targetLang}</p></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
