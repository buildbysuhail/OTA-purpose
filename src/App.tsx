import "devextreme/dist/css/dx.light.css";
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
import {
  setColorPrimary,
  setColorPrimaryRgb,
  setDataHeaderStyles,
  setDataMenuStyles,
  setDataNavLayout,
  setDataNavStyle,
  setDataPageStyle,
  setDataVerticalStyle,
  setDirection,
  setMode,
  setToggled,
} from "./redux/slices/app/reducer";
import { APIClient } from "./helpers/api-client";
import Urls from "./redux/urls";
import AccountSettingsLayout from "./components/common/layout/account-settings-layout";
import WorkspaceSettingsLayout from "./components/common/layout/workspace-settings-layout";
import { userSession } from "./redux/slices/user-session/thunk";
import Logout from "./pages/auth/Logout";
import { useAppState } from "./utilities/hooks/useAppState";

import Themeprimarycolor, * as switcherdata from "../src/components/common/switcher/switcherdata/switcherdata";

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
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  var dispatch = useAppDispatch();
  // Cookies.set(
  //   "token",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJ1c2VySWQiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwibG9nZ2VkVXNlciI6ImFkbWluIiwidWlDdWx0dXJlIjoiZW4iLCJncm91cCI6IkJyYW5jaCBBZG1pbiIsImdyb3VwSWQiOiJCQSIsImNvbXBhbnlJZCI6IjEiLCJlbXBsb3llZUlkIjoiMCIsImNvbXBhbnlOYW1lIjoiMS5CdXNpbmVzcyBOYW1lIiwidXNlckNvbXBhbmllcyI6IjEiLCJjb21wYW55Q3VycmVuY3kiOiJTQVIiLCJjb21wYW55Q3VycmVuY3lEZWNpbWFsUG9pbnRzIjoiMiIsInRheERlY2ltYWxQb2ludCI6IjAiLCJ1bml0UHJpY2VEZWNpbWFsUG9pbnQiOiIwIiwiY29tcGFueUN1cnJlbmN5U3ltYm9sIjoiMiIsImV4cCI6MTcyNDY4MTIxOCwiaXNzIjoiSldIODciLCJhdWQiOiJYMkhJSSJ9.lAVC0lK5QDm7kEya30Wu9kGflCYTs8MtoJCvhR_eh4o"
  // );
  const token = Cookies.get("token");
  const syncAppStates = async () => {
    // setReloading(true);
    let res = await api.get(Urls.getUserThemes);
    await dispatch(userSession());
    

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
    
    dispatch(setColorPrimaryRgb(res.colorPrimaryRgb));
    dispatch(setColorPrimary(res.colorPrimaryRgb));
    localStorage.setItem("primaryRGB", res.colorPrimaryRgb);
    localStorage.setItem("primaryRGB1", res.colorPrimaryRgb);

    
    switch (res.menuStyle) {
      case "dark":
        dispatch(setDataMenuStyles("dark"));
        localStorage.setItem("ynexMenu", "dark");
        localStorage.removeItem("light");
        break;
      case "light":
        dispatch(setDataMenuStyles("light"));
        localStorage.setItem("ynexMenu", "light");
        localStorage.removeItem("light");
        break;
      case "color":
        dispatch(setDataMenuStyles("color"));
        localStorage.setItem("ynexMenu", "color");
        localStorage.removeItem("gradient");
        break;
      case "gradient":
        dispatch(setDataMenuStyles("gradient"));
        localStorage.setItem("ynexMenu", "gradient");
        localStorage.removeItem("color");
        break;
      case "transparent":
        dispatch(setDataMenuStyles("transparent"));
        localStorage.setItem("ynexMenu", "transparent");
        localStorage.removeItem("gradient");
        break;
      default:
        break;
    }
    switch (res.headerStyle) {
      case "dark":
        dispatch(setDataHeaderStyles("dark"));
        localStorage.setItem("ynexHeader", "dark");
        localStorage.removeItem("light");
        break;
      case "light":
        dispatch(setDataHeaderStyles("light"));
        localStorage.setItem("ynexHeader", "light");
        localStorage.removeItem("dark");
        break;
      case "color":
        dispatch(setDataHeaderStyles("color"));
        localStorage.setItem("ynexHeader", "color");
        localStorage.removeItem("dark");
        break;
      case "gradient":
        dispatch(setDataHeaderStyles("gradient"));
        localStorage.setItem("ynexHeader", "gradient");
        localStorage.removeItem("transparent");
        break;
      case "transparent":
        dispatch(setDataHeaderStyles("transparent"));
        localStorage.removeItem("gradient");
        localStorage.setItem("ynexHeader", "transparent");
        break;
      default:
        break;
    }
    switch (res.pageStyle) {
      case "regular":
        dispatch(setDataPageStyle("regular"));
        localStorage.setItem("ynexregular", "Regular");
        localStorage.removeItem("ynexclassic");
        localStorage.removeItem("ynexmodern");
        break;
      case "classic":
        dispatch(setDataPageStyle("classic"));
        localStorage.setItem("ynexclassic", "Classic");
        localStorage.removeItem("ynexregular");
        localStorage.removeItem("ynexmodern");
        break;
      case "modern":
        dispatch(setDataPageStyle("modern"));
        localStorage.setItem("ynexmodern", "Modern");
        localStorage.removeItem("ynexregular");
        localStorage.removeItem("ynexclassic");
        break;
      default:
        break;
    }
    /////////////////////////////////
    switch (res.sidemenuLayoutStyles) {
      case "defaultmenu":
        dispatch(setDataVerticalStyle("overlay"));
        dispatch(setDataNavLayout("vertical"));
        dispatch(setToggled(""));
        dispatch(setDataNavStyle(""));
        localStorage.removeItem("ynexnavstyles");
        localStorage.setItem("ynexverticalstyles", "default");
        var icon = document.getElementById(
          "switcher-default-menu"
        ) as HTMLInputElement;
        if (icon) {
          icon.checked = true;
        }
        break;
      case "closedmenu":
        dispatch(setDataNavLayout("vertical"));
        dispatch(setDataVerticalStyle("closed"));
        dispatch(setToggled("close-menu-close"));
        dispatch(setDataNavStyle(""));
        localStorage.setItem("ynexverticalstyles", "closed");
        localStorage.removeItem("ynexnavstyles");
        break;
      case "iconTextfn":
        dispatch(setDataNavLayout("vertical"));
        dispatch(setDataVerticalStyle("icontext"));
        dispatch(setToggled("icon-text-close"));
        dispatch(setDataNavStyle(""));
        localStorage.setItem("ynexverticalstyles", "icontext");
        localStorage.removeItem("ynexnavstyles");

        const MainContent = document.querySelector(".main-content");
        const appSidebar = document.querySelector(".app-sidebar");

        appSidebar?.addEventListener("click", () => {
          switcherdata.icontextOpenFn();
        });
        MainContent?.addEventListener("click", () => {
          switcherdata.icontextCloseFn();
        });
        break;
      case "iconOverayFn":
        dispatch(setDataNavLayout("vertical"));
        dispatch(setDataVerticalStyle("overlay"));
        dispatch(setToggled("icon-overlay-close"));
        dispatch(setDataNavStyle(""));
        localStorage.setItem("ynexverticalstyles", "overlay");
        localStorage.removeItem("ynexnavstyles");
        var icon = document.getElementById(
          "switcher-icon-overlay"
        ) as HTMLInputElement;
        if (icon) {
          icon.checked = true;
        }
        const _MainContent = document.querySelector(".main-content");
        const _appSidebar = document.querySelector(".app-sidebar");
        _appSidebar?.addEventListener("click", () => {
          switcherdata.DetachedOpenFn();
        });
        _MainContent?.addEventListener("click", () => {
          switcherdata.DetachedCloseFn();
        });
        break;
      case "detachedFn":
        dispatch(setDataNavLayout("vertical"));
        dispatch(setDataVerticalStyle("detached"));
        dispatch(setToggled("detached-open"));
        dispatch(setDataNavStyle(""));
        localStorage.setItem("ynexverticalstyles", "detached");
        localStorage.removeItem("ynexnavstyles");

        const __MainContent = document.querySelector(".main-content");
        const __appSidebar = document.querySelector(".app-sidebar");

        __appSidebar?.addEventListener("click", () => {
          switcherdata.DetachedOpenFn();
        });
        __MainContent?.addEventListener("click", () => {
          switcherdata.DetachedCloseFn();
        });
        break;
      case "doubletFn":
        dispatch(setDataNavLayout("vertical"));
        dispatch(setDataVerticalStyle("doublemenu"));
        dispatch(setToggled("double-menu-open"));
        dispatch(setDataNavStyle(""));
        localStorage.setItem("ynexverticalstyles", "doublemenu");
        localStorage.removeItem("ynexnavstyles");
        break;
      default:
        break;
    }
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
