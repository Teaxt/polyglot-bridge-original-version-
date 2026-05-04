interface Props {
  project: any;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
}

export default function ProjectDetail({ project, onDelete, onStart }: Props) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>模型: {project.modelLabel}</p>
        <p>源语言: {project.sourceLang} → 目标语言: {project.targetLang}</p>
        <p>创建时间: {new Date(project.createdAt).toLocaleString()}</p>
        <p>备注: {project.note || '无'}</p>
      </div>
      <div className="mt-6 space-x-3">
        <button onClick={() => onStart(project.id)} className="bg-blue-600 text-white px-4 py-2 rounded">启动运行</button>
        <button onClick={() => onDelete(project.id)} className="bg-red-500 text-white px-4 py-2 rounded">删除</button>
      </div>
    </div>
  );
}