import { create } from 'zustand';
import { bridge } from '../../ipc-client';
import type { Project } from '../../types';

interface ProjectState {
  projects: Project[];
  selectedId: string | null;
  loadProjects: () => Promise<void>;
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedId: null,

  loadProjects: async () => {
    const list = await bridge.getProjects();
    set({ projects: list as Project[] });
  },

  createProject: async (data) => {
    const project = await bridge.createProject(data);
    await get().loadProjects();
    return project as Project;
  },

  updateProject: async (id, data) => {
    await bridge.updateProject(id, data);
    await get().loadProjects();
  },

  deleteProject: async (id) => {
    await bridge.deleteProject(id);
    if (get().selectedId === id) set({ selectedId: null });
    await get().loadProjects();
  },

  selectProject: (id) => set({ selectedId: id }),
}));
