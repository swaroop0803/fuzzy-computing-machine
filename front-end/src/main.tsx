import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/fuzzy-computing-machine/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);