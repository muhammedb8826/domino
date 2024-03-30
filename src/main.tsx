import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './satoshi.css';
import { BrowserRouter } from 'react-router-dom'

import store from './redux/store.ts'
import { Provider } from 'react-redux'
import { ParallaxProvider } from "react-scroll-parallax"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <ParallaxProvider>
      <BrowserRouter>
        <App />
        <ToastContainer/>
      </BrowserRouter>
    </ParallaxProvider>
    </Provider>
  </React.StrictMode>,
)
