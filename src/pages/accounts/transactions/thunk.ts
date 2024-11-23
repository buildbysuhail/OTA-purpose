//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
import Urls from '../../../redux/urls';
const api = new APIClient();
export interface SetBranchInput {
  companyId: string;
  branchId: string;
}
export const setBranch = createAsyncThunk<ResponseModel<any>, SetBranchInput>('setBranch', async (input) => {
  const response = await api.post(Urls.set_branch, input);
  return response;
});

