import ReactDOM from 'react-dom/client';

import { AppRoutes } from './routes';
import { engine } from './libs/engine';
import { AppProvider } from './providers/app';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function main() {
  await engine.start();

  root.render(
    <AppProvider>
      <AppRoutes />
    </AppProvider>,
  );
}

main();
