import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bridge } from '../../ipc-client';
import ProjectDetail from './ProjectDetail';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    const list = await bridge.getProjects();
    setProjects(list);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async () => {
    const config = await bridge.getConfig();
    await bridge.createProject({
      name: '新项目',
      apiKey: config.apiKey,
      modelLabel: config.model,
      sourceLang: config.sourceLang,
      targetLang: config.targetLang,
      note: ''
    });
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    await bridge.deleteProject(id);
    setSelected(null);
    loadProjects();
  };

  const handleStart = (id: string) => {
    bridge.startRuntime(id);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl font-bold mb-4">项目管理</h2>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded mb-4 w-full">新建项目</button>
        <ul>
          {projects.map((p: any) => (
            <li key={p.id} onClick={() => setSelected(p)} className={`p-2 cursor-pointer hover:bg-gray-100 ${selected?.id === p.id ? 'bg-blue-100' : ''}`}>
              {p.name} <span className="text-xs text-gray-500">({p.modelLabel})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4">
        {selected ? (
          <ProjectDetail project={selected} onDelete={handleDelete} onStart={handleStart} />
        ) : (
          <div className="text-gray-500 mt-20 text-center">请选择一个项目</div>
        )}
      </div>
    </div>
  );
}