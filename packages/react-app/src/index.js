import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DAppProvider } from '@usedapp/core';
import './index.css';

import { Config } from './config';

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={Config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
