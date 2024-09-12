//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
const api = new APIClient();
export interface SetBranchInput {
  companyId: string;
  branchId: string;
}
export const userSession = createAsyncThunk<ResponseModel<any>>('userSession', async () => {
  const response = await api.get('/userSession');
  return response;
});
export const setBranch = createAsyncThunk<ResponseModel<any>, SetBranchInput>('setBranch', async (input) => {
  const response = await api.post('/setSession', input);
  return response;
});

