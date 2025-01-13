//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import Urls from '../../../redux/urls';
const api = new APIClient();
export interface loadAccVoucherInput {
  action: string;        // Description of the action
  module: string;        // Module where the action is performed
  voucherType: string;   // Type of voucher (e.g., Cheque, Invoice)
  voucherNumber: string; // Unique identifier for the voucher
  type?: string;         // Optional field to specify the type of action (e.g., Print, Edit)
}
export const logUserAction = createAsyncThunk<any, loadAccVoucherInput>('logUserAction', async (input) => {

  
  const response = await api.getAsync(
    `${Urls.log_user_action}`,
    new URLSearchParams(input as any).toString()
  );
  return response;
});
