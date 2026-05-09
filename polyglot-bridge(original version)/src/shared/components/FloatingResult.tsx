import { useState } from 'react';

interface Props {
  text: string;
  result?: string;
  onClose: () => void;
}

export default function FloatingResult({ text, result, onClose }: Props) {
  const [pinned, setPinned] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result || text);
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white shadow-xl border rounded-lg w-96 z-50 overflow-hidden ${pinned ? '' : 'animate-fade-in'}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
        <span className="text-xs font-medium text-gray-500">划词翻译</span>
        <div className="flex gap-1">
          <button onClick={() => setPinned(!pinned)} className="text-xs px-2 py-0.5 rounded hover:bg-gray-200" title={pinned ? '取消固定' : '固定'}>
            {pinned ? '📌' : '📍'}
          </button>
          <button onClick={handleCopy} className="text-xs px-2 py-0.5 rounded hover:bg-gray-200" title="复制">📋</button>
          <button onClick={onClose} className="text-xs px-2 py-0.5 rounded hover:bg-gray-200 text-gray-400">✕</button>
        </div>
      </div>
      {/* 原文 */}
      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b max-h-20 overflow-auto">{text}</div>
      {/* 结果 */}
      <div className="px-3 py-3 text-sm max-h-60 overflow-auto">
        {result || <span className="text-gray-400">翻译中...</span>}
      </div>
    </div>
  );
}
