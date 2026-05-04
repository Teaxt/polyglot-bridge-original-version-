import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/setup'), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Polyglot Bridge</h1>
        <p className="text-lg opacity-80">多语者大模型翻译助手</p>
        <button onClick={() => navigate('/setup')} className="mt-8 px-6 py-2 bg-white text-blue-600 rounded-lg">
          进入
        </button>
      </div>
    </div>
  );
}