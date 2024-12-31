//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import Urls from '../../../redux/urls';
import { AccTransactionMaster, AccTransactionRow } from './acc-transaction-types';
const api = new APIClient();
export interface loadAccVoucherInput {
  transactionType: string;
  params: any;
}
export interface AccVoucherOutPut {
  master: AccTransactionMaster;
  details: AccTransactionRow[];
  attachments: any[];
}
export const loadAccVoucher = createAsyncThunk<AccVoucherOutPut, loadAccVoucherInput>('loadAccTransMaster', async (input) => {
  const response = await await api.getAsync(
    `${Urls.acc_transaction_base}${input.transactionType} `,
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

