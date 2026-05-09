import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { bridge } from '../../ipc-client';
import MarkdownViewer from '../../shared/components/MarkdownViewer';
import FloatingResult from '../../shared/components/FloatingResult';
import { useAppStore } from '../../shared/stores/useAppStore';
import type { RuntimeMode } from '../../types';

const MODES: { value: RuntimeMode; label: string; prompt: string }[] = [
  { value: 'translate', label: '翻译全文', prompt: 'You are a professional translator. Translate the following text to the target language accurately and naturally. Preserve formatting.' },
  { value: 'explain', label: '解释单词', prompt: 'You are a language teacher. Explain the meaning of the given word or phrase in detail, including pronunciation, part of speech, common usage, and example sentences.' },
  { value: 'summary', label: '总结段落', prompt: 'You are a summarization assistant. Summarize the following text concisely while preserving key information.' },
  { value: 'custom', label: '自定义指令', prompt: '' },
];

export default function RuntimePage() {
  const { projectId } = useParams();
  const config = useAppStore(s => s.config);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [mode, setMode] = useState<RuntimeMode>('translate');
  const [customPrompt, setCustomPrompt] = useState('');
  const [captureOn, setCaptureOn] = useState(false);
  const [floating, setFloating] = useState<{ text: string; result: string } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const getPrompt = useCallback(() => {
    if (mode === 'custom') return customPrompt || 'Translate the following text.';
    return MODES.find(m => m.value === mode)?.prompt || '';
  }, [mode, customPrompt]);

  const doTranslate = useCallback((text: string, isFloating = false) => {
    if (!text.trim()) return;
    const prompt = getPrompt();

    if (isFloating) {
      setFloating({ text, result: '' });
      let full = '';
      bridge.translateStream(config, text, prompt, (chunk: string) => {
        if (chunk === '[DONE]') {
          setFloating(prev => prev ? { ...prev, result: full } : null);
        } else if (chunk.startsWith('[ERROR]')) {
          setFloating(prev => prev ? { ...prev, result: `❌ ${chunk}` } : null);
        } else {
          full += chunk;
          setFloating(prev => prev ? { ...prev, result: full } : null);
        }
      });
      return;
    }

    setOutput('');
    setStreaming(true);
    let full = '';
    bridge.translateStream(config, text, prompt, (chunk: string) => {
      if (chunk === '[DONE]') {
        setStreaming(false);
      } else if (chunk.startsWith('[ERROR]')) {
        setOutput(`❌ 翻译失败: ${chunk.slice(8)}`);
        setStreaming(false);
      } else {
        full += chunk;
        setOutput(full);
      }
    });
  }, [config, getPrompt]);

  useEffect(() => {
    const cleanup = bridge.onCapturedText((text: string) => {
      doTranslate(text, true);
    });
    return cleanup;
  }, [doTranslate]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const toggleCapture = () => {
    if (captureOn) bridge.stopCapture();
    else bridge.startCapture();
    setCaptureOn(!captureOn);
  };

  const handleCopy = () => navigator.clipboard.writeText(output);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg">🚀</span>
          <h1 className="text-sm font-bold text-gray-800">运行窗口</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{projectId}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={e => setMode(e.target.value as RuntimeMode)}
            className="border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <button
            onClick={toggleCapture}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${captureOn ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {captureOn ? '🔴 停止划词' : '✂️ 启用划词'}
          </button>
        </div>
      </header>

      {mode === 'custom' && (
        <div className="bg-yellow-50 border-b px-4 py-2 shrink-0">
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="输入自定义提示词，例如：将以下日语翻译为中文并保留敬语..."
            className="w-full bg-transparent text-sm outline-none resize-none h-12"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
        <div className="shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">输入文本</span>
            <button
              onClick={() => navigator.clipboard.readText().then(text => setInput(text))}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              📋 从剪贴板导入
            </button>
          </div>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) doTranslate(input); }}
              placeholder="粘贴或键入文本... (Ctrl+Enter 发送)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={() => doTranslate(input)}
              disabled={streaming || !input.trim()}
              className="px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors self-end"
            >
              {streaming ? '翻译中...' : '翻译'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="text-xs font-medium text-gray-500">翻译结果</span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={handleCopy} className="text-xs text-gray-500 hover:text-gray-700">📋 复制</button>
                  <button onClick={() => doTranslate(input)} disabled={streaming} className="text-xs text-gray-500 hover:text-gray-700">🔄 重新生成</button>
                </>
              )}
            </div>
          </div>
          <div ref={outputRef} className="flex-1 border rounded-lg p-4 overflow-auto bg-white">
            {output ? (
              <MarkdownViewer content={output} />
            ) : (
              <div className="text-gray-300 text-sm text-center mt-20">翻译结果将在此显示</div>
            )}
          </div>
        </div>
      </div>

      {floating && (
        <FloatingResult
          text={floating.text}
          result={floating.result}
          onClose={() => setFloating(null)}
        />
      )}
    </div>
  );
}
