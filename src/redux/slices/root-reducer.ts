
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import UserRightsReducer from "./auth/UserRights/reducer";
import AppStateReducer from "./app/reducer";
import UserSessionReducer from "./user-session/reducer";
import PopupDataReducer from "./popup-reducer";
import { DataConfig } from "../../configs/data-config";
import { actionTypeFromUrl, reducerNameFromUrl } from "../actions/AppActions";
import NetworkReducer from "./network-reducer";

const dataConfigReducers = DataConfig?.reduce((prv: any, api: string, idx: number) => {
  
  const GetType = actionTypeFromUrl(api, "GET");
  const GetName = reducerNameFromUrl(api, "GET");

  return {
    ...prv,
    ...{
      [GetName]: NetworkReducer(GetType),
    },
  };
}, {});

const rootReducer = {
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  UserRights: UserRightsReducer,
  AppState: AppStateReducer,
  UserSession: UserSessionReducer,
  PopupData: PopupDataReducer,

  ...dataConfigReducers,
};

export default rootReducer;