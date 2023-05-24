import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider 
        withGlobalStyles 
        withNormalizeCSS 
        theme={theme}
      >
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);