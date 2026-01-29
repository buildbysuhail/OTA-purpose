import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.scss'
import 'react-toastify/dist/ReactToastify.css';
import './styles/barcode-scanner.css';
import { Provider } from 'react-redux';
import store from './redux/store'
import App from './App'
import { ToastContainer } from 'react-toastify'
import { history as _history } from './history';
import RootWrapper from './Rootwrapper';
import { loadAppConfig } from './loadAppConfig';
import axios from 'axios';

loadAppConfig().then((config) => {
    // After config.json is loaded, set axios baseURL or any global config you need
axios.defaults.baseURL =  `${config.api.APP_API_URL}/api`;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <BrowserRouter >
      <div className="scrollbar-hide">
        <Provider store={store}>
          <RootWrapper>
          <App />
          {/* <PopModelContainer /> */} 
          <ToastContainer />
         </RootWrapper>
          {/* <ERPAlertContainer /> */}
        </Provider>
      </div>
    </BrowserRouter>
  </React.Fragment>
);
});
