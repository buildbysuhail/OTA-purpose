import { useEffect, useState } from "react";

// import { handleResponse } from '../HandleResponse';
import { customJsonParse } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
}
const api = new APIClient();
export const useAccTransaction = () => {

//   useEffect(() => {
//     const response = api.get(Urls.acc_user_config);
//     const _userConfig = atob(response);
//     const userConfig: any = customJsonParse(_userConfig);
//     setUserConfig(userConfig);
//   }, []);

//   const postUserConfig = async () => {
//     const updatedSystemCodes = [...userConfig, addUserConfig];
//     setAddUserConfig({
//       userConfig: "",
//     });

//     try {
//       const response = await api.post(
//         `${Urls.acc_user_config}`,
//         updatedSystemCodes
//       );
//       handleResponse(response);
//       getSystemCode();
//     } catch (error) {
//       console.error("Error post System Code settings:", error);
//     } finally {
//       setIsSavingSystemCode(false);
//     }
//   };

  return {
    // postUserConfig,
  };
};
