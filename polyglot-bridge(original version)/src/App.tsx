import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { router } from './router';
import { useAppStore } from './shared/stores/useAppStore';

export default function App() {
  const loadConfig = useAppStore(s => s.loadConfig);

  useEffect(() => {
    loadConfig();
  }, []);

  return <RouterProvider router={router} />;
}
