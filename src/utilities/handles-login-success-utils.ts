
import { syncAppStates } from "../pages/auth/syncSettings";
import { ApplicationSettingsType } from "../pages/settings/system/application-settings-types/application-settings-types";
import { setApplicationSettings } from "../redux/slices/app/application-settings-reducer";
import { AppState, languagesData } from "../redux/slices/app/types";
import { ClientSessionModel } from "../redux/slices/client-session/reducer";
import { UserTypeRights } from "../redux/slices/user-rights/reducer";
import { UserModel } from "../redux/slices/user-session/reducer";
import { customJsonParse } from "./jsonConverter";
import usFlag from "../assets/images/flags/us_flag.png";
import { getStorageString, removeStorageString, setStorageString } from "./storage-utils";


export const handleLoginSuccess = async (
  login: any,
  dispatch: any,
  load: () => Promise<void>,
  setIsLoggedToBranch: (v: boolean) => void,
  setHasToChooseBranch: (v: boolean) => void
) => {
  let ass =await getStorageString("as");

  await removeStorageString("_token");
  await setStorageString("token", login.item.token);
  await setStorageString("up", login.item.userProfileDetails);
  await setStorageString("cs", login.item.clientSessions);
  await setStorageString("ut", login.item.userThemes);
  await setStorageString("ur", login.item.userRights);

  const userProfileDetails: UserModel = customJsonParse(atob(login.item.userProfileDetails));
  const clientSession: ClientSessionModel = customJsonParse(login.item.clientSessions);
  const userRights: UserTypeRights[] = customJsonParse(atob(login.item.userRights));
  const userThemes: AppState = customJsonParse(atob(login.item.userThemes));

  const locale = languagesData.find((l: any) => l.code === userProfileDetails.language) ?? {
    code: "en",
    name: "English",
    flag: usFlag,
    rtl: false,
  };

  await syncAppStates(dispatch, userThemes, clientSession, userProfileDetails, userRights, locale);

  if (ass) {
    const appSettings: ApplicationSettingsType = customJsonParse(atob(ass));
    dispatch(setApplicationSettings({ ...appSettings, apiLoaded: false }));
  } else {
    await load();
  }

  if (login.item.hasToChooseBranch) {
    setHasToChooseBranch(true);
    setIsLoggedToBranch(false);
  } else {
    setIsLoggedToBranch(true);
    setHasToChooseBranch(false);
  }
};
