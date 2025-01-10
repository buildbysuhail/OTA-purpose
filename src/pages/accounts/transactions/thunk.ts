//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import Urls from '../../../redux/urls';
import { AccTransactionMaster, AccTransactionRow, AccTransactionRowForOutPut } from './acc-transaction-types';
const api = new APIClient();
export interface loadAccVoucherInput {
  transactionType: string;
  params: any;
}
export interface deleteAccVoucherInput {
  transactionType: string;
  accTransactionMasterID: number;
}
export interface AccVoucherOutPut {
  master: AccTransactionMaster;
  details: AccTransactionRowForOutPut[];
  attachments: any[];
}
export const loadAccVoucher = createAsyncThunk<AccVoucherOutPut, loadAccVoucherInput>('loadAccTransMaster', async (input) => {
  const response = await api.getAsync(
    `${Urls.acc_transaction_base}${input.transactionType}`,
    new URLSearchParams(input.params).toString()
  );
  return response;
});
export const deleteAccVoucher = createAsyncThunk<ResponseModel<string>, deleteAccVoucherInput>(
  'deleteAccVoucher',
  async (input, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${Urls.acc_transaction_base}${input.transactionType}/${input.accTransactionMasterID}}`
      );

      // Assuming response.data contains the expected number
      return response.data as ResponseModel<string>;
    } catch (error: any) {
      // Use rejectWithValue for error handling
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const unlockAccTransactionMaster = createAsyncThunk<any, any>('unlockAccTransactionMaster', async (accTransMasterID) => {
  const response = await await api.postAsync(
    `${Urls.unlock_acc_transaction_master}`,
    accTransMasterID 
  );
  return response;
});

