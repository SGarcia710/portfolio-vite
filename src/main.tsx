import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './i18n';
import './styles/index.css';
import App from './app/App';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
