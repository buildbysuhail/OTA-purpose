
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseModel } from '../../../../base/response-model';
import { APIClient } from '../../../../helpers/api-client';
import Urls from '../../../../redux/urls';
const api = new APIClient();
export interface loadAccVoucherInput {
  transactionType: string;
  params: any;
}
export interface deleteAccVoucherInput {
  transactionType: string;
  accTransactionMasterID: number;
}

export const deleteAccVoucher = createAsyncThunk<ResponseModel<string>, deleteAccVoucherInput>(
  'deleteAccVoucher',
  async (input, { rejectWithValue }) => {
    try {
      
      const response = await api.delete(
        `${Urls.acc_transaction_base}${input.transactionType}/${input.accTransactionMasterID}`
      );

      // Assuming response.data contains the expected number
      return response as any;
    } catch (error: any) {
      // Use rejectWithValue for error handling
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const unlockTransactionMaster = createAsyncThunk<any, any>('unlockAccTransactionMaster', async (accTransactionMasterID) => {
  
  const response = await await api.postAsync(
    `${Urls.unlock_acc_transaction_master}${accTransactionMasterID}`,
    {} 
  );
  return response;
});

