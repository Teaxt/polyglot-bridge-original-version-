import { createMemoryRouter } from 'react-router-dom';
import WelcomePage from './features/welcome/WelcomePage';
import HomePage from './features/home/HomePage';
import SetupPage from './features/setup/SetupPage';
import ProjectsPage from './features/project-manager/ProjectsPage';
import RuntimePage from './features/runtime/RuntimePage';
import SettingsPage from './features/settings/SettingsPage';

export const router = createMemoryRouter([
  { path: '/', element: <WelcomePage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/setup', element: <SetupPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/runtime/:projectId', element: <RuntimePage /> },
  { path: '/settings', element: <SettingsPage /> },
]);
