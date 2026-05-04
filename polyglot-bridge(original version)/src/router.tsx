import { createMemoryRouter } from 'react-router-dom';
import WelcomePage from './features/welcome/WelcomePage';
import SetupPage from './features/setup/SetupPage';
import ProjectsPage from './features/project-manager/ProjectsPage';
import RuntimePage from './features/runtime/RuntimePage';

export const router = createMemoryRouter([
  { path: '/', element: <WelcomePage /> },
  { path: '/setup', element: <SetupPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/runtime/:projectId', element: <RuntimePage /> }
]);