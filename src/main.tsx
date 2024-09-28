import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.scss'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store'
import App from './App'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <BrowserRouter>
      <div className="scrollbar-hide">
        <Provider store={store}>
          <App />
          {/* <PopModelContainer /> */}
          <ToastContainer />
         
          {/* <ERPAlertContainer /> */}
        </Provider>
      </div>
    </BrowserRouter>
  </React.Fragment>
)
