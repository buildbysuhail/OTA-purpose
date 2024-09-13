//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import { UserModel } from './reducer';
const api = new APIClient();
export interface SetBranchInput {
  companyId: string;
  branchId: string;
}
export const userSession = createAsyncThunk<ResponseModel<UserModel>>('userSession', async () => {
  const response = await api.get('/userSession');
  return response;
});
export const setBranch = createAsyncThunk<ResponseModel<any>, SetBranchInput>('setBranch', async (input) => {
  const response = await api.post('/setBranch', input);
  return response;
});

