interface Props {
  text: string;
  onClose: () => void;
}

export default function FloatingResult({ text, onClose }: Props) {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded-lg p-4 w-80 z-50">
      <div className="flex justify-between mb-2">
        <h4 className="font-bold">捕获文本</h4>
        <button onClick={onClose} className="text-gray-400">✕</button>
      </div>
      <p className="text-sm">{text}</p>
    </div>
  );
}