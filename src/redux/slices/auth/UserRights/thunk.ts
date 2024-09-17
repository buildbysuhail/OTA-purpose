
import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../../../helpers/api-client";
import { ResponseModel } from "../../../../base/response-model";
import { IIdTextIsDefaultDto } from "../../../../base/id-text-is-default-dto";

let api = new APIClient();
 export interface UserRights {
   formCode: string,
   userRights: string
 }
export const getUserSession = createAsyncThunk<UserRights>('profile/UserRights', async (user) => {
    const response = await api.get('/api/Subscription/profile/UserRights');
    return response;
  });