
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import UserRightsReducer from "./auth/UserRights/reducer";
import AppStateReducer from "./app/reducer";
import { CreateCrudModuleSlices } from "./crud-slices";
import { CrudConfig } from "../../configs/crud-config";
import CountriesDataReducer from "./data/country-reducer";
import IndustriesReducer from "./data/industry-reducer";
import CurenciesReducer from "./data/currency-reducer";
import UserSessionReducer from "./user-session/reducer";
import usertypecompoReducer from "./data/usertypecompo-reducer";
import employeeReducer from "./data/employee-reducer";
import ledgerReducer from "./data/ledger-reducer";
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
  UserRights: UserRightsReducer,
  AppState: AppStateReducer,
  CountriesData: CountriesDataReducer,
  Industries: IndustriesReducer,
  Curencies: CurenciesReducer,
  Usertypecompo: usertypecompoReducer,
  Employeecompo:employeeReducer,
  Ledgercompo:ledgerReducer,
  UserSession: UserSessionReducer
};

export default rootReducer;