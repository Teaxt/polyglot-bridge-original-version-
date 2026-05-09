import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white select-none">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-6">🌐</div>
        <h1 className="text-5xl font-bold mb-3 tracking-tight">Polyglot Bridge</h1>
        <p className="text-xl opacity-80 mb-2">多语者大模型翻译助手</p>
        <p className="text-sm opacity-50 mb-10">跨语言的桥梁，让沟通无界限</p>
        <button
          onClick={() => navigate('/home')}
          className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300"
        >
          点击进入 →
        </button>
      </div>
    </div>
  );
}
