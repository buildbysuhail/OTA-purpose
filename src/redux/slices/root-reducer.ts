
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import UserRightsReducer from "./user-rights/reducer";
import AppStateReducer from "./app/reducer";
import UserSessionReducer from "./user-session/reducer";
import PopupDataReducer from "./popup-reducer";
import TemplateReducer from "./templates/reducer";
import { Template } from "devextreme-react";
const rootReducer = {
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  UserRights: UserRightsReducer,
  AppState: AppStateReducer,
  UserSession: UserSessionReducer,
  PopupData: PopupDataReducer,
  Template: TemplateReducer

  // ...dataConfigReducers,
};

export default rootReducer;