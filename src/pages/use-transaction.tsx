import { useEffect, useState } from "react";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import "../utilities/date-utils";
import { RootState } from "../redux/store";
import ERPToast from "../components/ERPComponents/erp-toast";
import moment from "moment";
import { UserAction, useUserRights } from "../helpers/user-right-helper";
import ERPAlert from "../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../helpers/api-client";
import Urls from "../redux/urls";

const api = new APIClient();
export const useTransaction = (transactionType: string) => {
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
const {hasRight} = useUserRights();
  
  const printVoucher = async (
    accTransMasterID: number,
    voucherType: string,
    formType: string,
    vrPrefix: string,
    vrNumber: string,
    printPreview: boolean,
    isReprint: boolean = false,
    data?: any
  ) => {
    const _data = data != undefined ? data : await api.getAsync(`Urls.acc_transaction_base${transactionType}`)

   
  };
  return {
    printVoucher
  };
};
