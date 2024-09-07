//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import { ResponseModel } from '../../../base/response-model';
const api = new APIClient();

export const userSession = createAsyncThunk<ResponseModel<any>>('userSession', async (user) => {
  const response = await api.get('/userSession');
  return response;
});

