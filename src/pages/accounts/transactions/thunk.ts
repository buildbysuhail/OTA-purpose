//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import Urls from '../../../redux/urls';
const api = new APIClient();
export interface SetBranchInput {
  transactionType: string;
  params: any;
}
export const loadAccTransMaster = createAsyncThunk<any, any>('loadAccTransMaster', async (input) => {
  const response = await await api.getAsync(
    `${Urls.acc_transaction_base}${input.transactionType}/GetVoucherAsync`,
    new URLSearchParams(input.params).toString()
  );
  return response;
});
export const unlockAccTransactionMaster = createAsyncThunk<any, any>('unlockAccTransactionMaster', async (accTransMasterID) => {
  const response = await await api.postAsync(
    `${Urls.unlock_acc_transaction_master}`,
    accTransMasterID 
  );
  return response;
});

