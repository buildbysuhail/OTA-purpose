import { useEffect, useState } from "react";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import "../utilities/date-utils";
import { RootState } from "../redux/store";
import ERPToast from "../components/ERPComponents/erp-toast";
import moment from "moment";
import { UserAction, useUserRights } from "../helpers/user-right-helper";

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
            PolosysFrameWork.General.ShowMessageBox(
              "Post Dated Transaction Not Allowed"
            );
            result = 0;
          }
        } else {
          PolosysFrameWork.General.ShowMessageBox(
            "User privilege not assigned. Please contact admin"
          );
          result = 0;
        }
      }

      if (
        applicationSettings.mainSettings.allowPredatedTrans &&
        transDate.toDatePartString() !== softwareDate.toDatePartString()
      ) {
        if (!hasRight("PRE_POST", UserAction.Blocked)) {
          const minPreDate = new Date();
          minPreDate.setHours(0, 0, 0, 0);
          minPreDate.setDate(
            minPreDate.getDate() - Settings.MainSettings.NumberofPreDatedTrans
          );

          if (transDate < minPreDate) {
            PolosysFrameWork.General.ShowMessageBox(
              "Pre Dated Transaction Not Allowed"
            );
            result = 0;
          }
        } else {
          PolosysFrameWork.General.ShowMessageBox(
            "User privilege not assigned. Please contact admin"
          );
          result = 0;
        }
      }
    }

    return result;
  };

  return {
    validateTransactionDate,
  };
};
