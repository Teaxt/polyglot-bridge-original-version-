import { useState } from 'react';
import { useProjectStore } from '../../shared/stores/useProjectStore';
import type { Project } from '../../types';

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
}

export default function ProjectDetail({ project, onDelete, onStart }: Props) {
  const { updateProject } = useProjectStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [note, setNote] = useState(project.note);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    await updateProject(project.id, { name, note });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        {editing ? (
          <input value={name} onChange={e => setName(e.target.value)} className="text-2xl font-bold border-b-2 border-indigo-500 outline-none bg-transparent" />
        ) : (
          <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
        )}
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">保存</button>
              <button onClick={() => { setEditing(false); setName(project.name); setNote(project.note); }} className="px-4 py-1.5 bg-gray-200 rounded-lg text-sm">取消</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">✏️ 编辑</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">配置快照</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400 text-xs">模型提供商</span>
            <p className="font-medium mt-0.5">{project.apiProvider || '未配置'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs">模型标签</span>
            <p className="font-medium mt-0.5">{project.modelTag || '默认'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs">源语言</span>
            <p className="font-medium mt-0.5">{project.sourceLang === 'auto' ? '自动检测' : project.sourceLang}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs">目标语言</span>
            <p className="font-medium mt-0.5">{project.targetLang}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400 text-xs">创建时间</span>
            <p className="font-medium mt-0.5">{new Date(project.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">备注</h3>
        {editing ? (
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="记录项目用途、特殊词汇表等..."
            className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.note || '暂无备注'}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onStart(project.id)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ▶ 启动运行
        </button>
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">确认删除？</span>
            <button onClick={() => onDelete(project.id)} className="px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm">确认</button>
            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2.5 bg-gray-200 rounded-lg text-sm">取消</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
            🗑 删除项目
          </button>
        )}
      </div>
    </div>
  );
}
