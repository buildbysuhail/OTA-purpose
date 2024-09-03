import { combineReducers } from "redux";

// Front
// import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";
import AppStateReducer from "./app/reducer";
import { CreateCrudModuleSlices } from "./crud-slices";
import { CrudConfig } from "../../configs/crud-config";

const crudModuleSlices = CreateCrudModuleSlices(CrudConfig);

// const rootReducer = combineReducers({
//     Login: LoginReducer,
//     Account: AccountReducer,
//     ForgetPassword: ForgetPasswordReducer,
//     Profile: ProfileReducer,
//     AppState: AppStateReducer,
//     ...Object.keys(crudModuleSlices).reduce((acc: any, key: string) => {
//         acc[key] = crudModuleSlices[key].reducer;
//         return acc;
//       }, {}),
// });
const rootReducer = {
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  AppState: AppStateReducer
};

export default rootReducer;