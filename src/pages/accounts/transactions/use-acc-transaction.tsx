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
async function updateTransactionEditMode(branchID: number, tType: string, transactionMasterID: number, editRemarks: string) {
let res = 0;
  try {
    const params = {
      BranchID: branchID,
      TType: tType,
      TransactionMasterID: transactionMasterID,
      Remarks: editRemarks,
    };

    res = await api.postAsync("", params);

    // // Assuming the API returns the Result as a direct response or within `data`.
    // const result = response.data?.Result || response.data;
    return res;
  } catch (error) {
    console.error('Error updating transaction edit mode:', error);
    throw error;
  }
}
  return {
    // postUserConfig,
  };
};
