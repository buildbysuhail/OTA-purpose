import React from "react";
import "devextreme/dist/css/dx.light.css";
import { Fragment, Suspense, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store, { RootState } from "./redux/store";
import moment from "moment";

// Components / Pages (lazy-loaded)
const Layout = React.lazy(() => import("./components/common/layout/layout"));
const AccountSettingsLayout = React.lazy(() => import("./components/common/layout/account-settings-layout"));
const WorkspaceSettingsLayout = React.lazy(() => import("./components/common/layout/workspace-settings-layout"));
const SettingsLayout = React.lazy(() => import("./components/common/layout/settings-layout"));
const ReportsLayout = React.lazy(() => import("./components/common/layout/reports-layout"));
const TemplateDesignerLayout = React.lazy(() => import("./components/common/layout/template-designer-layout"));
const RPosLayout = React.lazy(() => import("./components/common/layout/rpos-layout"));
const PDFBarcodeDesigner = React.lazy(() => import("./pages/LabelDesigner/label_designer"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Logout = React.lazy(() => import("./pages/auth/Logout"));
const OrgSelect = React.lazy(() => import("./pages/OrgSelect"));
const AcceptInvitation = React.lazy(() => import("./pages/auth/accept-invitation"));
const MobileFooter = React.lazy(() => import("./pages/dashboards/crm/mobile-footer"));
const ERPModal = React.lazy(() => import("./components/ERPComponents/erp-modal"));
const ERPAlert = React.lazy(() => import("./components/ERPComponents/erp-sweet-alert"));
const Switcher = React.lazy(() => import("./components/common/switcher/switcher"));
const Loader = React.lazy(() => import("./components/common/loader/loader"));

// Redux / Utilities / Helpers / Hooks (regular imports)
import { modelToBase64 } from "./utilities/jsonConverter";
import { syncAppStates } from "./pages/auth/syncSettings";
import { setDeviceInfo } from "./redux/slices/device/reducer";
import { onCloseWithUnsavedChange, toggleSelectPrinterPopup, toggleTemplateChooserModal } from "./redux/slices/popup-reducer";
import Urls from "./redux/urls";
import { setApplicationSettings } from "./redux/slices/app/application-settings-reducer";
import AutoClicker from "./Nodevwatermark";
import { useAppState } from "./utilities/hooks/useAppState";
import { getUserSessionData } from "./session-data";
import { useRootState } from "./utilities/hooks/useRootState";
import { AccessPrinterList } from "./pages/InvoiceDesigner/utils/get_printers";
import { getStorageString } from "./utilities/storage-utils";
import { setLightStatusBar } from "./Android/lib/statusBar";
import { registerPush } from "./Android/lib/push";
import { Device } from "@capacitor/device";
import "./i18n/config";
import { APIClient } from "./helpers/api-client";
import { useAppSelector, useAppDispatch } from "./utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useUnsavedChangesWarning } from "./pages/use-unsaved-changes-warning";
import UnsavedChangesModal from "./pages/accounts/transactions/unsavedChangesModal";
import { setSoftwareDate } from "./redux/slices/client-session/reducer";
import ERPResizableSidebar from "./components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "./pages/transaction-base/template_picker";
import { formStateHandleFieldChange } from "./pages/inventory/transactions/reducer";
import { accFormStateHandleFieldChange } from "./pages/accounts/transactions/reducer";
// ====
// import ERPModal from "./components/ERPComponents/erp-modal";
// import 'devextreme/dist/css/dx.dark.css';  

export const LoadingAnimation = () => {
  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
    </div>
  );
};


function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();

  useEffect(() => {
    // Example: default UI is light background
    setLightStatusBar();
  }, []);

  useEffect(() => {
    registerPush((token) => {
      // Send token to backend for targeting
      console.log('Device token:', token);
    });
  }, []);

  


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const { appState, updateAppState } = useAppState();
  useEffect(() => {
    const sd = moment().local(); // Ensure local time is used
    const asd = sd.format("DD/MM/YYYY");
    dispatch(setSoftwareDate(asd));
  }, []);

  useEffect(() => {

    if (!isOnline) { return }
    const fetchSettings = async () => {
      try {
        const settings = await api.getAsync(Urls.application_setting);
        // const token =   await getStorageString("token");
        const token = localStorage.getItem("token")
        if (token) {

          console.log(token);
          localStorage.setItem("as", modelToBase64(settings))
          // await setStorageString("as", modelToBase64(settings))

          dispatch(setApplicationSettings({ ...settings, apiLoaded: true }));
        }
      } catch (error) {
        console.error("Error fetching application settings:", error);
      }
    };
    fetchSettings();
  }, [isOnline]);

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

  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  let api = new APIClient();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const popupData = useSelector((state: RootState) => state?.PopupData);
  const withUnsavedChange = useAppSelector((state: RootState) => state?.PopupData?.onCloseWithUnsavedChange);
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const { i18n } = useTranslation()
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const { isModalOpen, handleStay, handleLeave } = useUnsavedChangesWarning();
  useEffect(() => {
    // Simulate app initialization process
    const initializeApp = async () => {
      try {

        await new Promise(resolve => setTimeout(resolve, 500));

        setIsAppReady(true);

        // Small delay for smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error('App initialization failed:', error);
        // Handle initialization errors
      }
    };

    initializeApp();
  }, []);


  if (deviceInfo?.isMobile) {
  useEffect(() => {
  const handler = (e:any) => e.preventDefault();
  
  document.addEventListener("copy", handler);
  document.addEventListener("cut", handler);
  document.addEventListener("paste", handler);
  document.addEventListener("contextmenu", handler);
  document.addEventListener("selectstart", handler);

  return () => {
    document.removeEventListener("copy", handler);
    document.removeEventListener("cut", handler);
    document.removeEventListener("paste", handler);
    document.removeEventListener("contextmenu", handler);
    document.removeEventListener("selectstart", handler);
  };
}, []);
  }



  useEffect(() => {
    if (!isOnline) return;

    const fetchSession = async () => {
      const {
        token,
        userThemes,
        clientSession,
        userProfileDetails,
        userRights,
        locale,
      } = await getUserSessionData();
      await syncAppStates(dispatch, userThemes, clientSession, userProfileDetails, userRights, locale);

      const language = userProfileDetails?.language;

      if (!token && !["/login", "/shared-view", "accept-user-invitation"].includes(pathname)) {
        navigate("/login");
      }

      if (locale && i18n && typeof i18n.changeLanguage === "function") {
        i18n.changeLanguage(language);
      } else {
        console.error("i18n is not properly initialized:", i18n);
      }
    };

    fetchSession();
  }, [isOnline]);

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
  const Bodyclickk = async () => {
    let isCheck = await getStorageString("ynexverticalstyles")
    if (isCheck == "icontext") {
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
  }, [])

  useEffect(() => {
    // Dynamically add or remove the 'isMobile' class on the body
    if (deviceInfo?.isMobile) {
      document.body.classList.add('mobile-screen');
    } else {
      document.body.classList.remove('mobile-screen');
    }
  }, [deviceInfo?.isMobile]); // Run this effect when isMobile changes
  const { t } = useTranslation('main')
  if (isLoading || isOnline != true) {
    return <><Loader isOnline={isOnline} /></>;
  }

  return (
    <Fragment>
      {/* <Loader /> */}
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
              <Route path="accept-user-invitation" element={<AcceptInvitation />} />
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
              <Route path="label-designer/:id" element={<PDFBarcodeDesigner forCustomRows={false} />} />
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

      {/* {deviceInfo?.isMobile && (
        <div className="w-full h-16 bg-white fixed bottom-0 left-0">
          <MobileFooter />
        </div>
      )} */}

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
      <ERPModal
        isOpen={popupData.printerList.isOpen || false}
        title={t("set_default-printer")}
        width={800}
        height={700}
        isForm={true}
        closeModal={() => {
          dispatch(toggleSelectPrinterPopup({ isOpen: false }));

        }}
        content={
          <AccessPrinterList
            templateData={popupData.printerList?.template}
            data={popupData.printerList?.data ?? []}
            formState={[popupData.printerList?.formState]}
            restInRoot
          // onChange={(propertiesState) => dispatch(setTemplatePropertiesState(propertiesState))}
          />
        }
      />
      {popupData.TemplateChooserModal.isOpen &&
        <ERPResizableSidebar
          minWidth={350}
          isOpen={popupData.TemplateChooserModal.isOpen ?? false}
          setIsOpen={() =>
            dispatch(
              toggleTemplateChooserModal({ isOpen: false, templateGroup: "", customerType: "", formType: "" })
            )
          }
        >
          {popupData.TemplateChooserModal.isOpen && (
            <TemplatesView
              voucherType={popupData.TemplateChooserModal?.templateGroup ?? ""}
              formType={popupData.TemplateChooserModal?.formType ?? ""}
              customerType={popupData.TemplateChooserModal?.customerType ?? ''}
              onTemplateChoosed={(template: any) => {
                popupData.TemplateChooserModal?.isInv?
                  dispatch(formStateHandleFieldChange({fields:{lastChoosedTemplate: template}}))
                  :
                  dispatch(accFormStateHandleFieldChange({fields:{lastChoosedTemplate: template}}))
               }} 
              setIsOpen={() =>
                dispatch(
                  toggleTemplateChooserModal({ isOpen: false, templateGroup: "", customerType: "", formType: "" })
                )
            }
          />
        )}
        </ERPResizableSidebar>
      }
    </Fragment>
  );
}
export default App;
