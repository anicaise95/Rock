import React, { StrictMode } from 'react';
import './asset/styles/index.scss';
import { ApiContext } from './contexts/AppContext';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ApiContext.Provider value="https://restapi.fr/api/recipes">
      <RouterProvider router={router} />
    </ApiContext.Provider>
  </StrictMode>
);