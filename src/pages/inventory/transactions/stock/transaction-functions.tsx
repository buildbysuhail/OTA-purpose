import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
export interface AccUserConfig {
  keepNarrationForJV: boolean;
  clearDetailsAfterSaveAccounts: boolean;
  mnuShowConfirmationForEditOnAccounts: boolean;
  maximizeBillwiseScreenInitially: boolean;
  alignment: 'left' | 'center' | 'right';
}
const api = new APIClient();
export const updateTransactionEditMode = async (
  tType: string,
  transactionMasterId: number,
  editRemarks: string
) => {
  let res = 0;
  try {
    const params = {
      transactionType: tType,
      isDelete: true,
      TransactionMasterId: transactionMasterId,
    };

    return (res = await api.postAsync(
      Urls.upsert_bill_modified_history,
      params
    ));
  } catch (error) {
    return res;
  }
};
