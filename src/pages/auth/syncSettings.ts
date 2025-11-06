
import * as switcherdata from "../../../src/components/common/switcher/switcherdata/switcherdata";
import { setDirection, setMode, setColorPrimaryRgb, setColorPrimary, setDataMenuStyles, setDataHeaderStyles, setDataPageStyle, setDataVerticalStyle, setDataNavLayout, setToggled, setDataNavStyle, setLocale, setInputBox, setScrollbarWidth, setScrollbarColor } from "../../redux/slices/app/reducer";
import { AppState, Locale } from "../../redux/slices/app/types";
import { UserModel, setUserSession } from "../../redux/slices/user-session/reducer";
import { AppDispatch } from "../../redux/store";
import { UserRight } from "../settings/userManagement/data";
import { setUserRights, UserTypeRights } from "../../redux/slices/user-rights/reducer";
import { setUserBranches } from "../../redux/slices/user-session/user-branches-reducer";
import { ClientSessionModel, setClientSession } from "../../redux/slices/client-session/reducer";
import { removeStorageString, setStorageString } from "../../utilities/storage-utils";
export const setLanguage = async (dispatch: AppDispatch, locale: Locale) => {
  dispatch(setDirection(locale.rtl ? "rtl" : "ltr"));
  
  dispatch(setLocale(locale));

  await setStorageString("ynexltr", locale.rtl ? "rtl" : "ltr");
  await removeStorageString(locale.rtl ? "ynexltr" : "ynexrtl");

}
export const syncAppStates = async (dispatch: AppDispatch, res: AppState, clientSession: ClientSessionModel, userSession: UserModel,  userRights: UserTypeRights[], locale: Locale,) => {

  dispatch(setUserBranches(userSession.branches));
  dispatch(setUserSession({...userSession, branches:[]}));
  dispatch(setUserBranches(userSession.branches));
  dispatch(setUserRights(userRights));
  dispatch(setClientSession(clientSession));

  await setLanguage(dispatch, locale);

  dispatch(setInputBox(res.inputBox));
  dispatch(setScrollbarWidth(res.scrollbarWidth));
  dispatch(setScrollbarColor(res.scrollbarColor));
 
  dispatch(setMode(res.mode ?? "light"));

 if (res.mode == "light") {
    // dispatch(setMode(res.mode ?? "light"));
    await setStorageString("ynexlighttheme", "light");
    await removeStorageString("ynexdarktheme");
    await removeStorageString("Light");
    await removeStorageString("bodyBgRGB");
    await removeStorageString("darkBgRGB");
  } else {
    await setStorageString("ynexdarktheme", "dark");
    await removeStorageString("ynexlighttheme");
    await removeStorageString("ynexlighttheme");
    await removeStorageString("darkBgRGB");
  }
  dispatch(setColorPrimaryRgb(res.colorPrimaryRgb));
  dispatch(setColorPrimary(res.colorPrimaryRgb));
  await setStorageString("primaryRGB", res.colorPrimaryRgb);
  await setStorageString("primaryRGB1", res.colorPrimaryRgb);


  switch (res.dataMenuStyles) {
    case "dark":
      dispatch(setDataMenuStyles("dark"));
      await setStorageString("ynexMenu", "dark");
      await removeStorageString("light");
      break;
    case "light":
      dispatch(setDataMenuStyles("light"));
      await setStorageString("ynexMenu", "light");
      await removeStorageString("light");
      break;
    case "color":
      dispatch(setDataMenuStyles("color"));
      await setStorageString("ynexMenu", "color");
      await removeStorageString("gradient");
      break;
    case "gradient":
      dispatch(setDataMenuStyles("gradient"));
      await setStorageString("ynexMenu", "gradient");
      await removeStorageString("color");
      break;
    case "transparent":
      dispatch(setDataMenuStyles("transparent"));
      await setStorageString("ynexMenu", "transparent");
      await removeStorageString("gradient");
      break;
    default:
      break;
  }
  switch (res.dataHeaderStyles) {
    case "dark":
      dispatch(setDataHeaderStyles("dark"));
      await setStorageString("ynexHeader", "dark");
      await removeStorageString("light");
      break;
    case "light":
      dispatch(setDataHeaderStyles("light"));
      await setStorageString("ynexHeader", "light");
      await removeStorageString("dark");
      break;
    case "color":
      dispatch(setDataHeaderStyles("color"));
      await setStorageString("ynexHeader", "color");
      await removeStorageString("dark");
      break;
    case "gradient":
      dispatch(setDataHeaderStyles("gradient"));
      await setStorageString("ynexHeader", "gradient");
      await removeStorageString("transparent");
      break;
    case "transparent":
      dispatch(setDataHeaderStyles("transparent"));
      await removeStorageString("gradient");
      await setStorageString("ynexHeader", "transparent");
      break;
    default:
      break;
  }
  switch (res.dataPageStyle) {
    case "regular":
      dispatch(setDataPageStyle("regular"));
      await setStorageString("ynexregular", "Regular");
      await removeStorageString("ynexclassic");
      await removeStorageString("ynexmodern");
      break;
    case "classic":
      dispatch(setDataPageStyle("classic"));
      await setStorageString("ynexclassic", "Classic");
      await removeStorageString("ynexregular");
      await removeStorageString("ynexmodern");
      break;
    case "modern":
      dispatch(setDataPageStyle("modern"));
      await setStorageString("ynexmodern", "Modern");
      await removeStorageString("ynexregular");
      await removeStorageString("ynexclassic");
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
      await removeStorageString("ynexnavstyles");
      await setStorageString("ynexverticalstyles", "default");
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
      await setStorageString("ynexverticalstyles", "closed");
      await removeStorageString("ynexnavstyles");
      break;
    case "iconTextfn":
      dispatch(setDataNavLayout("vertical"));
      dispatch(setDataVerticalStyle("icontext"));
      dispatch(setToggled("icon-text-close"));
      dispatch(setDataNavStyle(""));
      await setStorageString("ynexverticalstyles", "icontext");
      await removeStorageString("ynexnavstyles");

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
      await setStorageString("ynexverticalstyles", "overlay");
      await removeStorageString("ynexnavstyles");
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
      await setStorageString("ynexverticalstyles", "detached");
      await removeStorageString("ynexnavstyles");

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
      await setStorageString("ynexverticalstyles", "doublemenu");
      await removeStorageString("ynexnavstyles");
      break;
    default:
      break;
  }
};