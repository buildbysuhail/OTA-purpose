
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
  CountriesData: CountriesDataReducer,
  Industries: IndustriesReducer,
  Curencies: CurenciesReducer,
  Usertypecompo: usertypecompoReducer,
  Employeecompo:employeeReducer,
  Ledgercompo:ledgerReducer,
  UserSession: UserSessionReducer,
  PopupData: PopupDataReducer,

  ...dataConfigReducers,
};

export default rootReducer;