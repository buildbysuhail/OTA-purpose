import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Crm from './pages/dashboards/crm/crm'
import './index.scss'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store'
import App from './App'
import { PopModelContainer } from './components/ERPComponents/erp-popup-model-form'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <BrowserRouter>
      <div className="scrollbar-hide">
        <Provider store={store}>
          <App />
          <PopModelContainer />
          <ToastContainer />
         
          {/* <SBAlertContainer /> */}
        </Provider>
      </div>
    </BrowserRouter>
  </React.Fragment>
)
