import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { emitter } from './lib/emitter';
import { engine } from './lib/engine';

import './styled/styled.css';

import PageNotFound from './views/pagenotfound';
import Home from './views/home';
import Dashboard from './views/dashboard';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function main() {
  await emitter.start();
  await engine.start();

  root.render(
    <Router>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </Router>,
  );
}

main();
