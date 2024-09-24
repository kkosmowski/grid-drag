import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '~/components/App';
import './index.css';
import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';
import { Toaster } from '~/contexts/Toaster';
import { StorageProvider } from '~/contexts/StorageContext';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <StorageProvider>
      <Toaster>
        <App />
      </Toaster>
    </StorageProvider>
  </StrictMode>,
);
