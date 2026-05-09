import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../shared/stores/useProjectStore';
import { useAppStore } from '../../shared/stores/useAppStore';
import { bridge } from '../../ipc-client';
import ProjectDetail from './ProjectDetail';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, selectedId, loadProjects, createProject, deleteProject, selectProject } = useProjectStore();
  const config = useAppStore(s => s.config);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createProject({
      name: newName.trim(),
      apiProvider: config.apiProvider,
      apiKey: config.apiKey,
      modelTag: config.modelTag,
      sourceLang: config.sourceLang,
      targetLang: config.targetLang,
      note: '',
    });
    setNewName('');
    setShowCreate(false);
  };

  const handleStart = (id: string) => {
    bridge.startRuntime(id);
  };

  const selected = projects.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-gray-600">← 返回</button>
        <h1 className="text-xl font-bold text-gray-800">📁 项目管理</h1>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* 左侧项目列表 */}
        <div className="w-80 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + 新建项目
            </button>
          </div>

          {showCreate && (
            <div className="p-4 border-b bg-gray-50">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="输入项目名称..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm">创建</button>
                <button onClick={() => { setShowCreate(false); setNewName(''); }} className="flex-1 px-3 py-1.5 bg-gray-200 rounded text-sm">取消</button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">📭</div>
                暂无项目，点击上方创建
              </div>
            ) : (
              projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === p.id ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}
                >
                  <div className="font-medium text-sm text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <span>{p.apiProvider || '未配置'}</span>
                    <span>·</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右侧详情 */}
        <div className="flex-1 p-6 overflow-auto">
          {selected ? (
            <ProjectDetail project={selected} onDelete={deleteProject} onStart={handleStart} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-4">👈</div>
                <p>请从左侧选择一个项目</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
