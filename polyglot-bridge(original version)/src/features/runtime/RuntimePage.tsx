import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { bridge } from '../../ipc-client';
import MarkdownViewer from '../../shared/components/MarkdownViewer';
import FloatingResult from '../../shared/components/FloatingResult';
import { useAppStore } from '../../shared/stores/useAppStore';

export default function RuntimePage() {
  const { projectId } = useParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('translate');
  const [captureOn, setCaptureOn] = useState(false);
  const [floatingText, setFloatingText] = useState('');
  const config = useAppStore(s => s.config);

  useEffect(() => {
    bridge.onCapturedText((text: string) => {
      setFloatingText(text);
      // 也可直接触发翻译
      doTranslate(text);
    });
  }, []);

  const doTranslate = async (text: string) => {
    if (!text.trim()) return;
    setOutput('翻译中...');
    let full = '';
    bridge.translateStream(config, text, (chunk: string) => {
      if (chunk === '[DONE]') {
        setOutput(full);
      } else {
        full += chunk;
        setOutput(full);
      }
    });
  };

  const toggleCapture = () => {
    if (!captureOn) bridge.startCapture();
    else bridge.stopCapture();
    setCaptureOn(!captureOn);
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">运行窗口 - {projectId}</h2>
        <div className="flex space-x-2">
          <select value={mode} onChange={e => setMode(e.target.value)} className="border rounded p-1">
            <option value="translate">翻译全文</option>
            <option value="explain">解释单词</option>
            <option value="summary">总结段落</option>
          </select>
          <button onClick={toggleCapture} className={`px-3 py-1 rounded ${captureOn ? 'bg-red-500' : 'bg-gray-300'}`}>
            {captureOn ? '停止划词' : '启用划词'}
          </button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="粘贴或键入文本，或从剪贴板导入..."
        className="border rounded p-2 h-32 mb-4"
      />
      <button onClick={() => doTranslate(input)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 self-start">翻译</button>
      <div className="flex-1 border rounded p-4 overflow-auto bg-gray-50">
        <MarkdownViewer content={output} />
      </div>
      {floatingText && <FloatingResult text={floatingText} onClose={() => setFloatingText('')} />}
    </div>
  );
}