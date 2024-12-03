
import * as switcherdata from "../../../src/components/common/switcher/switcherdata/switcherdata";
import { setDirection, setMode, setColorPrimaryRgb, setColorPrimary, setDataMenuStyles, setDataHeaderStyles, setDataPageStyle, setDataVerticalStyle, setDataNavLayout, setToggled, setDataNavStyle, setLocale, setInputBox, setScrollbarWidth, setScrollbarColor } from "../../redux/slices/app/reducer";
import { AppState, Locale } from "../../redux/slices/app/types";
import { UserModel, setUserSession } from "../../redux/slices/user-session/reducer";
import { AppDispatch } from "../../redux/store";
import { UserRight } from "../settings/userManagement/data";
import { setUserRights, UserTypeRights } from "../../redux/slices/user-rights/reducer";
export const setLanguage = async (dispatch: AppDispatch, locale: Locale) => {
  dispatch(setDirection(locale.rtl ? "rtl" : "ltr"));
  debugger;
  dispatch(setLocale(locale));

  localStorage.setItem("ynexltr", locale.rtl ? "rtl" : "ltr");
  localStorage.removeItem(locale.rtl ? "ynexltr" : "ynexrtl");

}
export const syncAppStates = async (dispatch: AppDispatch, res: AppState, userSession: UserModel,  userRights: UserTypeRights[], locale: Locale) => {

  dispatch(setUserSession(userSession));
  dispatch(setUserRights(userRights));

  setLanguage(dispatch, locale);

  dispatch(setInputBox(res.inputBox));
  dispatch(setScrollbarWidth(res.scrollbarWidth));
  dispatch(setScrollbarColor(res.scrollbarColor));
 
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


  switch (res.dataMenuStyles) {
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
  switch (res.dataHeaderStyles) {
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
  switch (res.dataPageStyle) {
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
  switch (res.dataMenuStyles) {
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