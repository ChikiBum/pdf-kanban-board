import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Provider } from 'react-redux';
import { routeTree } from './routeTree.gen';
import { store } from './store';

const router = createRouter({ routeTree });

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </Provider>
  </React.StrictMode>,
);
