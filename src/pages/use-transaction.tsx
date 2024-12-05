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
  const validateTransactionDate = (
    transDate: Date,
    skipPostDatedAndPredated: boolean = false
  ): number => {
    // Normalize the transaction date to remove time
    transDate = new Date(transDate.setHours(0, 0, 0, 0));
    let result = 1;

    // Financial period validation
    if (
      userSession.finFrom == undefined ||
      userSession.finFrom == null ||
      userSession.finTo == undefined ||
      userSession.finTo == null
    ) {
      ERPToast.show("Invalid Financial year!", "warning");
    } else {
      if (transDate >= userSession.finFrom && transDate <= userSession.finTo) {
        result = 1;
      } else {
        result = 0;
      }
    }
    // Skip post-dated and pre-dated checks if specified
    if (!skipPostDatedAndPredated) {
      const softwareDate = new Date(clientSession.softwareDate);
      if (
        applicationSettings.mainSettings.allowPostdatedTrans &&
        transDate.toDatePartString() !== softwareDate.toDatePartString()
      ) {
        if (!hasRight("PRE_POST", UserAction.Blocked)) {
          let maxPostDate = new Date();
          maxPostDate.setHours(0, 0, 0, 0);
          maxPostDate = moment(maxPostDate).add(applicationSettings.mainSettings.postDatedTransInNumbers,"days").toDate();
          

          if (transDate > maxPostDate) {
            ERPAlert({icon:"warning", title: "Post Dated Transaction Not Allowed" });
            result = 0;
          }
        } else {
          ERPAlert({icon:"warning", title: "User privilege not assigned. Please contact admin" });
          result = 0;
        }
      }

      if (
        applicationSettings.mainSettings.allowPredatedTrans &&
        transDate.toDatePartString() !== softwareDate.toDatePartString()
      ) {
        if (!hasRight("PRE_POST", UserAction.Blocked)) {
          let minPreDate = new Date();
          minPreDate.setHours(0, 0, 0, 0);
          minPreDate = moment(minPreDate).add(applicationSettings.mainSettings.preDatedTransInNumbers,"days").toDate();
         
          if (transDate < minPreDate) {
            ERPAlert({title:"Warning", text: "Pre Dated Transaction Not Allowed" });
            result = 0;
          }
        } else {
          ERPAlert({title:"Warning", text: "User privilege not assigned. Please contact admin" });
          result = 0;
        }
      }
    }

    return result;
  };
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
    validateTransactionDate,
    printVoucher
  };
};
