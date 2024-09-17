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
export class LogoutData {
  systemId: string = "";
}

const api = new APIClient();

export const loginUser = createAsyncThunk<ResponseModel<any>, LoginData>('login/loginUser', async (user) => {
  debugger;
  const response = await api.post('/Subscription/Auth/Login', user);
  debugger;
  return response;
});
export const logoutUser = createAsyncThunk<ResponseModel<any>, LogoutData>('logout/logoutUser', async (user) => {
  const response = await api.post('/Subscription/Auth/Logout', user);
  return response;
});

