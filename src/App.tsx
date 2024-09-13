import "devextreme/dist/css/dx.light.css";
import { Fragment, Suspense, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
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

import { APIClient } from "./helpers/api-client";
import AccountSettingsLayout from "./components/common/layout/account-settings-layout";
import WorkspaceSettingsLayout from "./components/common/layout/workspace-settings-layout";
import Logout from "./pages/auth/Logout";
import OrgSelect from "./pages/OrgSelect";
import { initialUserSessionData, UserModel } from "./redux/slices/user-session/reducer";
import { customJsonParse } from "./utilities/jsonConverter";
import { syncAppStates } from "./pages/auth/syncSettings";
import { initialThemeData, Theme } from "./redux/slices/app/types";

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};

function App() {
  // const { appState, updateAppState } = useAppState();
  let api = new APIClient();
  const dispatch = useAppDispatch();
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = Cookies.get("token");
  
  debugger;
  let upt = Cookies.get("up");
  let utt = Cookies.get("ut");

  debugger;

  let userProfileDetails: UserModel = initialUserSessionData;
  try {
  if(upt != undefined && upt != null && upt != '' ) {
    userProfileDetails = customJsonParse(atob(upt));
  }  
  } catch (error) {
    
  }
  
  let userThemes: Theme = initialThemeData;
  try {
  if(utt != undefined && utt != null && utt != '' ) {
    userThemes = customJsonParse(atob(utt));
  }  
  } catch (error) {
    
  }
  syncAppStates(dispatch,userThemes, userProfileDetails);

  useEffect(() => {
    
    if (!token && pathname !== "/shared-view") {
      navigate("/login");
    } else {
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
              <Route path="select-organization" element={<OrgSelect />} />

              {/* <Route path="create-organization" element={<Organization />} />
               */}
              <Route
                path="account-settings/*"
                element={<AccountSettingsLayout setMyClass={setMyClass} />}
              />
              <Route
                path="workspace-settings/*"
                element={<WorkspaceSettingsLayout setMyClass={setMyClass} />}
              />
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
