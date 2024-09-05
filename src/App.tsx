
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
import { toast, ToastContainer } from 'react-toastify';

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
  Cookies.set('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJ1c2VySWQiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwibG9nZ2VkVXNlciI6ImFkbWluIiwidWlDdWx0dXJlIjoiZW4iLCJncm91cCI6IkJyYW5jaCBBZG1pbiIsImdyb3VwSWQiOiJCQSIsImNvbXBhbnlJZCI6IjEiLCJlbXBsb3llZUlkIjoiMCIsImNvbXBhbnlOYW1lIjoiMS5CdXNpbmVzcyBOYW1lIiwidXNlckNvbXBhbmllcyI6IjEiLCJjb21wYW55Q3VycmVuY3kiOiJTQVIiLCJjb21wYW55Q3VycmVuY3lEZWNpbWFsUG9pbnRzIjoiMiIsInRheERlY2ltYWxQb2ludCI6IjAiLCJ1bml0UHJpY2VEZWNpbWFsUG9pbnQiOiIwIiwiY29tcGFueUN1cnJlbmN5U3ltYm9sIjoiMiIsImV4cCI6MTcyNDY4MTIxOCwiaXNzIjoiSldIODciLCJhdWQiOiJYMkhJSSJ9.lAVC0lK5QDm7kEya30Wu9kGflCYTs8MtoJCvhR_eh4o')
  const token = Cookies.get("token");
  const syncAppStates = async () => {
    // setReloading(true);
    // const res = (await dispatch(getAppState()).unwrap()) as any;
    // setReloading(false);
    // handleResponse(res, () => res?.payload?.data[0]?.content && dispatch(syncAppSettings(res?.payload?.data[0]?.content)));
  };
  useEffect(() => {
    
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
