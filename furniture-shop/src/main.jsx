// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
//6/11







// src/main.jsx
import '@ant-design/v5-patch-for-react-19'; // ⬅️ BẮT BUỘC cho React 19 + antd
import 'antd/dist/reset.css';               // ⬅️ Reset CSS của antd (đặt trước CSS của bạn)
import './index.css';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
