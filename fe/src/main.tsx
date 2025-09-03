import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { ToastProvider } from './hooks/useToast.js';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);
