
import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../../../helpers/api-client";
import { ResponseModel } from "../../../../base/response-model";
import { IIdTextIsDefaultDto } from "../../../../base/id-text-is-default-dto";

let api = new APIClient();
 export interface IUserSession {
    userId: number,
    displayName: string,
    userImageSm: string,
    email: string,
    group: string,
    currentClientId: number,
    currentClientName: string,
    currentBranchId:number,
    currentBranchName: string,
    permissions: string[],
    currency: any,
    currencyDecimalPoints: any,
    currencySymbol: any,
    taxDecimalPoint: number,
    unitPriceDecimalPoint:number,
    language: string;
    companies: Array<IIdTextIsDefaultDto>;
    branches: Array<IIdTextIsDefaultDto>;
 }
 export interface UserSession {
    userId: number;
    displayName: string;
    userImageSm: string;
    email: string;
    group: string;
    currentClientId: number;
    currentClientName: string;
    currentBranchId: number;
    currentBranchName: string;
    currency: any;
    currencyDecimalPoints: any;
    currencySymbol: any;
    taxDecimalPoint: number;
    unitPriceDecimalPoint: number;
    language: string;
    permissions: string[];
    companies: Array<IIdTextIsDefaultDto>;
    branches: Array<IIdTextIsDefaultDto>;
}
export const getUserSession = createAsyncThunk<UserSession>('profile/userSession', async (user) => {
    const response = await api.get('/api/Subscription/profile/userSession');
    return response;
  });