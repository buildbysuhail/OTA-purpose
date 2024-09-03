
import { Fragment, Suspense, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/common/footer/footer';
import Header from './components/common/header/header';
import Loader from './components/common/loader/loader';
import Sidebar from './components/common/sidebar/sidebar';
import Switcher from './components/common/switcher/switcher';
import store from './redux/store';
import Layout from './components/common/layout/layout';
import Login from './pages/auth/Login';
import Cookies from "js-cookie";

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};

function App() {
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = Cookies.get("token");
  const syncAppStates = async () => {
    // setReloading(true);
    // const res = (await dispatch(getAppState()).unwrap()) as any;
    // setReloading(false);
    // handleResponse(res, () => res?.payload?.data[0]?.content && dispatch(syncAppSettings(res?.payload?.data[0]?.content)));
  };
  useEffect(() => {
    debugger;
    if (!token && pathname !== "/shared-view") {
      navigate("/login");
    }
    else {
      syncAppStates();
    }
  }, [token]);
  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('icon-overlay') === 'open') {
          html.setAttribute('icon-overlay' ,"");
      }
    }
  }


 
  useEffect(() => {
    import("preline");

  }, []);
  
  return (
    <Fragment>
      <Loader/>
      <HelmetProvider>
          <Helmet
            htmlAttributes={{
              lang: "en",
              dir: "ltr",
              "data-menu-styles": "dark",
              "class": "light",
              "data-nav-layout": "vertical",
              "data-header-styles": "light",
              "data-vertical-style": "overlay",
              "loader": "disable",
              "data-icon-text": MyclassName,
            }}
          />
          <Switcher />
          <div className='page'>
          <Suspense fallback={LoadingAnimation()}>
            <Routes>
              <Route path="login" element={<Login />} />
              
              {/* <Route path="create-organization" element={<Organization />} />
              <Route path="select-organization" element={<OrgSelect />} />
              <Route path="shared-view" element={<ExternalView />} /> */}
              <Route path="/*" element={<Layout setMyClass={setMyClass} />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Suspense>
            
          </div>
        </HelmetProvider>
    </Fragment>
  );
}

export default App;
