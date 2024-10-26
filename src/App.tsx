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
import usFlag from "./assets/images/flags/us_flag.png";
import { useAppDispatch } from "./utilities/hooks/useAppDispatch";
import "./i18n/config";

import { APIClient } from "./helpers/api-client";
import AccountSettingsLayout from "./components/common/layout/account-settings-layout";
import WorkspaceSettingsLayout from "./components/common/layout/workspace-settings-layout";
import Logout from "./pages/auth/Logout";
import OrgSelect from "./pages/OrgSelect";
import {
  initialUserSessionData,
  UserModel,
} from "./redux/slices/user-session/reducer";
import { customJsonParse } from "./utilities/jsonConverter";
import { syncAppStates } from "./pages/auth/syncSettings";
import {
  initialThemeData,
  languagesData,
  Theme,
} from "./redux/slices/app/types";
import Settings from "./pages/settings/AllSettings/Settings";
import SettingsLayout from "./components/common/layout/settings-layout";
import { useTranslation } from "react-i18next";
import ReportsLayout from "./components/common/layout/reports-layout";
import TemplateDesignerLayout from "./components/common/layout/template-designer-layout";
import { Device } from "@capacitor/device";
import { useDispatch, useSelector } from "react-redux";
import { setDeviceInfo } from "./redux/slices/device/reducer";
import { RootState } from "./redux/store";
import MobileFooter from "./pages/dashboards/crm/mobile-footer";
import { getApplicationSettings } from "./redux/slices/app/thunk";
import RPosLayout from "./components/common/layout/rpos-layout";
import PDFBarcodeDesigner from "./pages/LabelDesigner/label_designer";

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};

function App() {
  const _dispatch = useAppDispatch();
  const _setDeviceInfo = async () => {
    try {
      const info = await Device.getInfo();
      _dispatch(setDeviceInfo(info));
    } catch (error) {
      console.error("Error getting device info:", error);
    }
  };

  _setDeviceInfo();
  // const { appState, updateAppState } = useAppState();
  let api = new APIClient();
  const dispatch = useAppDispatch();
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = Cookies.get("token");

  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

  let upt = Cookies.get("up");
  let utt = Cookies.get("ut");

  let userProfileDetails: UserModel = initialUserSessionData;
  try {
    if (upt != undefined && upt != null && upt != "") {
      userProfileDetails = customJsonParse(atob(upt));
    }
  } catch (error) { }

  let userThemes: Theme = initialThemeData;
  try {
    if (utt != undefined && utt != null && utt != "") {
      userThemes = customJsonParse(atob(utt));
    }
  } catch (error) { }
  const { i18n } = useTranslation();

  let locale = languagesData.find(
    (l) => l.code == userProfileDetails.language
  ) ?? { code: "en", name: "English", flag: usFlag, rtl: false };
  syncAppStates(dispatch, userThemes, userProfileDetails, locale);
  const language = userProfileDetails?.language;

  useEffect(() => {
    dispatch(getApplicationSettings());
  }, [dispatch]);
  useEffect(() => {
    if (locale && i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    } else {
      console.error("i18n is not properly initialized:", i18n);
    }
  }, [i18n, language, locale]);
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

        <div className="page" onClick={Bodyclickk}>
          <Suspense fallback={LoadingAnimation()}>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route path="select-organization" element={<OrgSelect />} />
              <Route path="switch-organization" element={<OrgSelect />} />
              {/* <Route path="create-organization" element={<Organization />} />
               */}
              <Route
                path="account-settings/*"
                element={<AccountSettingsLayout setMyClass={setMyClass} />}
              />
              <Route
                path="rpos/*"
                element={<RPosLayout setMyClass={setMyClass} />}
              />

              <Route
                path="settings/_/*"
                element={<SettingsLayout setMyClass={setMyClass} />}
              />
              <Route
                path="reports/_/*"
                element={<ReportsLayout setMyClass={setMyClass} />}
              />
              <Route
                path="invoice_designer/*"
                element={<TemplateDesignerLayout />}
              />
              <Route
                path="workspace-settings/*"
                element={<WorkspaceSettingsLayout setMyClass={setMyClass} />}
              />
              <Route path="label-designer/:id" element={<PDFBarcodeDesigner />} />
              <Route path="/*" element={<Layout setMyClass={setMyClass} />} />
              <Route path="/*" element={<Layout setMyClass={setMyClass} />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Suspense>

        </div>
      </HelmetProvider>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
      {deviceInfo?.isMobile && (
        <div className="w-full h-16 bg-white fixed bottom-0 left-0">
          <MobileFooter />
        </div>
      )}
    </Fragment>
  );
}

export default App;
