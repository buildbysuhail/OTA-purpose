import moment from "moment";
import { appInitialState } from "./redux/slices/app/reducer";
import { AppState, languagesData } from "./redux/slices/app/types";
import { ClientSessionModel } from "./redux/slices/client-session/reducer";
import { UserTypeRights } from "./redux/slices/user-rights/reducer";
import { customJsonParse } from "./utilities/jsonConverter";
import usFlag from "./assets/images/flags/us_flag.png";
import { initialUserSessionData, UserModel, } from "./redux/slices/user-session/reducer";
export function getUserSessionData(): {
  token: string | null;
  userThemes: AppState;
  clientSession: ClientSessionModel;
  userProfileDetails: UserModel;
  userRights: UserTypeRights[];
  locale: { code: string; name: string; flag: string; rtl: boolean };
} {
  const token = localStorage.getItem("token");
  const upt = localStorage.getItem("up");
  const urr = localStorage.getItem("ur");
  const utt = localStorage.getItem("ut");
  const css = localStorage.getItem("cs");

  let userRights: UserTypeRights[] = [];
  try {
    if (urr) {
      userRights = customJsonParse(atob(urr));
    }
  } catch (error) {
    console.error("Error parsing user rights:", error);
  }

  let userProfileDetails: UserModel = initialUserSessionData;
  try {
    if (upt) {
      userProfileDetails = customJsonParse(atob(upt));
    }
  } catch (error) {
    console.error("Error parsing user profile:", error);
  }

  let userThemes: AppState = appInitialState;
  try {
    if (utt) {
      userThemes = customJsonParse(atob(utt));
    }
  } catch (error) {
    console.error("Error parsing user theme:", error);
  }

  let clientSession: ClientSessionModel = {
    demoExpiryDate: moment().add(1, "years").toISOString(),
    isAppGlobal: false,
    isDemoVersion: true,
    softwareDate: moment().local().toISOString(),
    counterShiftId: 0,
  };
  try {
    if (css) {
      clientSession = customJsonParse(css);
    }
  } catch (error) {
    console.error("Error parsing client session:", error);
  }

  const locale =
    languagesData.find((l) => l.code === userProfileDetails.language) ?? {
      code: "en",
      name: "English",
      flag: usFlag,
      rtl: false,
    };

  return {
    token,
    userThemes,
    clientSession,
    userProfileDetails,
    userRights,
    locale,
  };
}
