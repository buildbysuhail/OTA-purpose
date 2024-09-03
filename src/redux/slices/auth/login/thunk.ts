//Include Both Helper File with needed methods

import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../../helpers/api-client';
import { ResponseModel, ResponseModelWithValidation } from '../../../../base/response-model';
export class LoginData {
  userName: string = "";
  password: string = "";
}
export class LoginValidations {
  userNameValidationMessage: string = "";
  passwordValidationMessage: string = "";
}


const api = new APIClient();

export const loginUser = createAsyncThunk<ResponseModel<any>, LoginData>('login/loginUser', async (user) => {
  const response = await api.post('/Subscription/Auth/Login', user);
  return response;
});

