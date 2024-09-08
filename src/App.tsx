import 'devextreme/dist/css/dx.light.css';
import { Fragment, Suspense, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Loader from "./components/common/loader/loader";
import Switcher from "./components/common/switcher/switcher";
import Layout from "./components/common/layout/layout";
import Login from "./pages/auth/Login";
import Cookies from "js-cookie";
import { useAppDispatch } from "./utilities/hooks/useAppDispatch";
import { getAppState } from "./redux/slices/app/thunk";
import { Theme } from "./pages/account-settings/account-settings-preference";
import { setColorPrimary, setColorPrimaryRgb, setDataHeaderStyles, setDirection, setMode } from "./redux/slices/app/reducer";
import { APIClient } from "./helpers/api-client";
import Urls from "./redux/urls";
import AccountSettingsLayout from './components/common/layout/account-settings-layout';
import WorkspaceSettingsLayout from './components/common/layout/workspace-settings-layout';
import { userSession } from './redux/slices/user-session/thunk';
import Logout from './pages/auth/Logout';

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};

function App() {
  let api = new APIClient();
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  var dispatch = useAppDispatch();
  Cookies.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJ1c2VySWQiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwibG9nZ2VkVXNlciI6ImFkbWluIiwidWlDdWx0dXJlIjoiZW4iLCJncm91cCI6IkJyYW5jaCBBZG1pbiIsImdyb3VwSWQiOiJCQSIsImNvbXBhbnlJZCI6IjEiLCJlbXBsb3llZUlkIjoiMCIsImNvbXBhbnlOYW1lIjoiMS5CdXNpbmVzcyBOYW1lIiwidXNlckNvbXBhbmllcyI6IjEiLCJjb21wYW55Q3VycmVuY3kiOiJTQVIiLCJjb21wYW55Q3VycmVuY3lEZWNpbWFsUG9pbnRzIjoiMiIsInRheERlY2ltYWxQb2ludCI6IjAiLCJ1bml0UHJpY2VEZWNpbWFsUG9pbnQiOiIwIiwiY29tcGFueUN1cnJlbmN5U3ltYm9sIjoiMiIsImV4cCI6MTcyNDY4MTIxOCwiaXNzIjoiSldIODciLCJhdWQiOiJYMkhJSSJ9.lAVC0lK5QDm7kEya30Wu9kGflCYTs8MtoJCvhR_eh4o"
  );
  const token = Cookies.get("token");
  const syncAppStates = async () => {
    // setReloading(true);
    let res = await api.get(Urls.getUserThemes)
    let res2 = await dispatch(userSession())
      debugger;

      dispatch(setDirection(res.direction ?? "ltr"));

      dispatch(setDirection(res.direction ?? "ltr"));
      localStorage.setItem("ynexltr", res.direction ?? "ltr");
      localStorage.removeItem("ynexrtl");

      dispatch(setMode(res.mode ?? "light"));
      if (res.mode == "light") {
        dispatch(setMode(res.mode ?? "light"));
        localStorage.setItem("ynexlighttheme", "light");
        localStorage.removeItem("ynexdarktheme");
        localStorage.removeItem("Light");
        localStorage.removeItem("bodyBgRGB");
        localStorage.removeItem("darkBgRGB");
      } else {
        localStorage.setItem("ynexdarktheme", "dark");
        localStorage.removeItem("ynexlighttheme");
        localStorage.removeItem("ynexlighttheme");
        localStorage.removeItem("darkBgRGB");
      }
debugger;
      dispatch(setColorPrimaryRgb(res.colorPrimaryRgb));
      dispatch(setColorPrimary(res.colorPrimaryRgb));
      localStorage.setItem("primaryRGB", res.colorPrimaryRgb);
    localStorage.setItem("primaryRGB1", res.colorPrimaryRgb);

      dispatch(setDataHeaderStyles("color"));
      localStorage.setItem("ynexHeader", "color");
      localStorage.removeItem("dark");
  
  };
  useEffect(() => {
    if (!token && pathname !== "/shared-view") {
      navigate("/login");
    } else {
      syncAppStates();
    }
  }, [token]);
  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  };

  useEffect(() => {
    import("preline");
  }, []);

  return (
    <Fragment>
      <Loader />
      <HelmetProvider>
        <Helmet
          htmlAttributes={{
            lang: "en",
            dir: "ltr",
            "data-menu-styles": "dark",
            class: "light",
            "data-nav-layout": "vertical",
            "data-header-styles": "light",
            "data-vertical-style": "overlay",
            loader: "disable",
            "data-icon-text": MyclassName,
          }}
        />
        <Switcher />
        <div className="page">
          <Suspense fallback={LoadingAnimation()}>
            <Routes>
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />

              {/* <Route path="create-organization" element={<Organization />} />
              <Route path="select-organization" element={<OrgSelect />} />
               */}
               <Route path="account-settings/*" element={<AccountSettingsLayout setMyClass={setMyClass} />} />
               <Route path="workspace-settings/*" element={<WorkspaceSettingsLayout setMyClass={setMyClass} />} />
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
