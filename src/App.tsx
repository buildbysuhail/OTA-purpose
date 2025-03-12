import "devextreme/dist/css/dx.light.css";
import { Fragment, Suspense, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router,Route, Routes, useLocation, useNavigate, } from "react-router-dom";
import Loader from "./components/common/loader/loader";
import Switcher from "./components/common/switcher/switcher";
import Layout from "./components/common/layout/layout";
import Login from "./pages/auth/Login";
import usFlag from "./assets/images/flags/us_flag.png";
import { useAppDispatch, useAppSelector } from "./utilities/hooks/useAppDispatch";
import "./i18n/config";
import { APIClient } from "./helpers/api-client";
import AccountSettingsLayout from "./components/common/layout/account-settings-layout";
import WorkspaceSettingsLayout from "./components/common/layout/workspace-settings-layout";
import Logout from "./pages/auth/Logout";
import OrgSelect from "./pages/OrgSelect";
import { initialUserSessionData, UserModel, } from "./redux/slices/user-session/reducer";
import { customJsonParse, modelToBase64 } from "./utilities/jsonConverter";
import { syncAppStates } from "./pages/auth/syncSettings";
import { AppState, languagesData, } from "./redux/slices/app/types";
import SettingsLayout from "./components/common/layout/settings-layout";
import { useTranslation } from "react-i18next";
import ReportsLayout from "./components/common/layout/reports-layout";
import TemplateDesignerLayout from "./components/common/layout/template-designer-layout";
import { Device } from "@capacitor/device";
import { useSelector } from "react-redux";
import { setDeviceInfo } from "./redux/slices/device/reducer";
import store, { RootState } from "./redux/store";
import MobileFooter from "./pages/dashboards/crm/mobile-footer";
import RPosLayout from "./components/common/layout/rpos-layout";
import PDFBarcodeDesigner from "./pages/LabelDesigner/label_designer";
import ERPAlert from "./components/ERPComponents/erp-sweet-alert";
import { onCloseWithUnsavedChange } from "./redux/slices/popup-reducer";
import { appInitialState } from "./redux/slices/app/reducer";
import { UserTypeRights } from "./redux/slices/user-rights/reducer";
import Urls from "./redux/urls";
import { setApplicationSettings } from "./redux/slices/app/application-settings-reducer";
import AutoClicker from "./Nodevwatermark";
import { ClientSessionModel, setSoftwareDate } from "./redux/slices/client-session/reducer";
import moment from "moment";
import { useUnsavedChangesWarning } from "./pages/accounts/transactions/use-unsaved-changes-warning";
import UnsavedChangesModal from "./pages/accounts/transactions/unsavedChangesModal";
import { useAppState } from "./utilities/hooks/useAppState";
// import 'devextreme/dist/css/dx.dark.css';  

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};

function App() {
  const { appState, updateAppState } = useAppState();
  useEffect(() => {
    const sd = moment().local(); // Ensure local time is used
    const asd = sd.format("DD/MM/YYYY");
    dispatch(setSoftwareDate(asd));
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getAsync(Urls.application_setting);
        const token =localStorage.getItem("token");
        
        if(token) {
          
          console.log(token);
          
        localStorage.setItem("as", modelToBase64(settings));
        dispatch(setApplicationSettings({ ...settings, apiLoaded: true }));
        }
      } catch (error) {
        console.error("Error fetching application settings:", error);
      }
    };
    fetchSettings();
  }, []);

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
  const withUnsavedChange = useAppSelector((state: RootState) => state.PopupData.onCloseWithUnsavedChange);
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const { i18n } = useTranslation()
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const { isModalOpen, handleStay, handleLeave } = useUnsavedChangesWarning();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let upt = localStorage.getItem("up");
    let urr = localStorage.getItem("ur");
    let utt = localStorage.getItem("ut");
    let css = localStorage.getItem("cs");

    let userRights: UserTypeRights[] = [];
    try {
      if (urr != undefined && urr != null && urr != "") {
        userRights = customJsonParse(atob(urr));
      }
    } catch (error) { }


    let userProfileDetails: UserModel = initialUserSessionData;
    try {
      if (upt != undefined && upt != null && upt != "") {
        userProfileDetails = customJsonParse(atob(upt));
      }
    } catch (error) { }

    let userThemes: AppState = appInitialState;
    try {
      if (utt != undefined && utt != null && utt != "") {
        userThemes = customJsonParse(atob(utt));
      }
    } catch (error) { };
    let locale = languagesData.find(
      (l) => l.code == userProfileDetails.language
    ) ?? { code: "en", name: "English", flag: usFlag, rtl: false };
    let clientSession: ClientSessionModel = {
      demoExpiryDate: moment().add(1, "years").toISOString(),
      isAppGlobal: false, isDemoVersion: true, softwareDate: moment().local().toISOString(), counterShiftId: 0
    };
    if (css != undefined && css != null && css != "") {
      clientSession =
        customJsonParse(css);
    }
    syncAppStates(dispatch, userThemes, clientSession, userProfileDetails, userRights, locale);
    const language = userProfileDetails?.language;

    if (!token && pathname !== "/shared-view") {
      navigate("/login");
    } else {
    }

    if (locale && i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    } else {
      console.error("i18n is not properly initialized:", i18n);
    }
  }, []);



  // useEffect(() => {
  //   if (locale && i18n && typeof i18n.changeLanguage === "function") {
  //     i18n.changeLanguage(language);
  //   } else {
  //     console.error("i18n is not properly initialized:", i18n);
  //   }
  // }, [i18n, language, locale]);
  // useEffect(() => {
  //   if (!token && pathname !== "/shared-view") {
  //     navigate("/login");
  //   } else {
  //   }
  // }, [token]);
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
  useEffect(() => {
    debugger;
   if (typeof window === 'undefined') {
			// Handle the case where window is not available (server-side rendering)
			return;
		}

		const theme = store.getState();
			if (window.innerWidth < 992) {
				// less than 992;
        updateAppState({ ...theme.AppState.appState, toggled: "close" });
				// ThemeChanger({ ...theme, dataToggled: "close" });
			}
  },[])

  useEffect(() => {
    // Dynamically add or remove the 'isMobile' class on the body
    if (deviceInfo?.isMobile) {
      document.body.classList.add('isMobile');
    } else {
      document.body.classList.remove('isMobile');
    }
  }, [deviceInfo?.isMobile]); // Run this effect when isMobile changes
  
  const { t } = useTranslation('main')
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
        <AutoClicker />
        <div className={`page dark:!bg-dark-bg  `} onClick={Bodyclickk}>
          <Suspense fallback={LoadingAnimation()}>
          
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route path="select-organization" element={<OrgSelect />} />
              <Route path="switch-organization" element={<OrgSelect />} />
              {/* <Route path="create-organization" element={<Organization />} />
               */}
              <Route path="account-settings/*" element={<AccountSettingsLayout setMyClass={setMyClass} />} />
              <Route path="rpos/*" element={<RPosLayout setMyClass={setMyClass} />} />
              <Route path="settings/_/*" element={<SettingsLayout setMyClass={setMyClass} />} />
              <Route path="reports/_/*" element={<ReportsLayout setMyClass={setMyClass} />} />
              <Route path="invoice_designer/*" element={<TemplateDesignerLayout />} />
              <Route path="workspace-settings/*" element={<WorkspaceSettingsLayout setMyClass={setMyClass} />} />
              <Route path="label-designer/:id" element={<PDFBarcodeDesigner />} />
              <Route path="/*" element={<Layout setMyClass={setMyClass} />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
            
          </Suspense>
        </div>
      </HelmetProvider>

      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
      {/* <div className=" w-1/4 h-full  bg-black fixed top-0 right-0">
      <ERPAttachment />
      </div> */}

      {deviceInfo?.isMobile && (
        <div className="w-full h-16 bg-white fixed bottom-0 left-0">
          <MobileFooter />
        </div>
      )}

      {
        withUnsavedChange.warn && (
          <ERPAlert
            showAnimation='animate__fadeIn'
            hideAnimation='animate__fadeOut'
            title={t("are_you_sure")}
            text={t("unsaved_changes")}
            icon="warning"
            position="center"
            confirmButtonText={t("ok")}
            cancelButtonText={t("cancel")}
            onConfirm={() => dispatch(onCloseWithUnsavedChange({ warn: false, succeeded: true, canceled: false }))}
          // onCancel={() =>dispatch(onCloseWithUnsavedChange({warn: false, succeeded: false, canceled: true}))}
          />
        )
      }
      {
        isModalOpen && (
          <UnsavedChangesModal
            isOpen={isModalOpen}
            onClose={handleStay}
            onStay={handleStay}
            onLeave={handleLeave}
          />
        )
      }
    </Fragment>
  );
}
export default App;
