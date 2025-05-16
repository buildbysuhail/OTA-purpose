import moment from "moment";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import VoucherType from "../../../../enums/voucher-types";
import { UserAction } from "../../../../helpers/user-right-helper";
import { ClientSessionModel } from "../../../../redux/slices/client-session/reducer";
import { UserModel } from "../../../../redux/slices/user-session/reducer";
import { modelToBase64Unicode } from "../../../../utilities/jsonConverter";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import { TransactionFormState } from "./transaction-types";

export const calculateTotal = (state: TransactionFormState): number => {
  // return 
  // state.transaction.master.voucherType !== "MJV"
  //   ? 
   return state.transaction.details.reduce(
        (sum, detail) => sum + (Number(detail.netValue) || 0),
        // -(detail.hasDiscount ? Number(detail.discount??0) : 0)
        0
      )
    // : state.transaction.details.reduce(
    //     (sum, detail) => sum + (Number(detail.debit) || 0),
    //     0
    //   );
};
export const clearEntryControl = (
  state: TransactionFormState,
  defaultCostCenterID: number
): TransactionFormState => {
  
  return state;
};
export const validateTransactionDate = (
  transDate: Date,
  skipPostDatedAndPredated: boolean = false,
  userSession: UserModel,
  clientSession: ClientSessionModel,
  applicationSettings: ApplicationSettingsType,
  hasRight?: (formCode: string, action: UserAction) => boolean,
  hasBlockedRight?: (formCode: string) => boolean
): { valid: boolean; message: string } => {
  // Normalize the transaction date to remove the time
  transDate = new Date(transDate.setHours(0, 0, 0, 0));
  let isValid = true;
  let message = "Transaction date is valid.";

  // Financial period validation
  if (!userSession.finFrom || !userSession.finTo) {
    ERPToast.show("Invalid Financial year!", "warning");
    return { valid: false, message: "Invalid Financial year." };
  }

  if (
    moment(transDate).local() < moment(userSession.finFrom).local() ||
    moment(transDate).local() > moment(userSession.finTo).local()
  ) {
    return {
      valid: false,
      message: "Transaction date is outside the financial period.",
    };
  }

  // Skip post-dated and pre-dated checks if specified
  if (!skipPostDatedAndPredated) {
    const softwareDate = moment(
      clientSession.softwareDate,
      "DD/MM/YYYY"
    ).local();
    // Post-dated transaction validation
    if (
      applicationSettings.mainSettings?.allowPostdatedTrans &&
      moment(transDate).local().format("YYYY-MM-DD") !==
        moment(softwareDate, "DD/MM/YYYY").local().format("YYYY-MM-DD")
    ) {
      if (
        hasBlockedRight == undefined ||
        (hasBlockedRight != undefined && hasBlockedRight("PRE_POST") == false)
      ) {
        const maxPostDate = new Date();
        maxPostDate.setHours(0, 0, 0, 0); // Removes time part
        maxPostDate.setDate(
          maxPostDate.getDate() +
            (applicationSettings.mainSettings?.postDatedTransInNumbers || 0)
        );

        const transDateOnly = new Date(transDate);
        transDateOnly.setHours(0, 0, 0, 0); // Removes time part

        if (transDateOnly > maxPostDate) {
          return {
            valid: false,
            message: "Post Dated Transaction Not Allowed.",
          };
        }
      } else {
        return {
          valid: false,
          message: "User privilege not assigned. Please contact admin.",
        };
      }
    }

    // Pre-dated transaction validation
    if (
      applicationSettings.mainSettings?.allowPredatedTrans &&
      moment(transDate).local().format("YYYY-MM-DD") !==
        moment(softwareDate, "DD/MM/YYYY").local().format("YYYY-MM-DD")
    ) {
      if (
        hasBlockedRight == undefined ||
        (hasBlockedRight != undefined && hasBlockedRight("PRE_POST") == false)
      ) {
        
        const minPreDate = new Date();
        minPreDate.setHours(0, 0, 0, 0); // Removes time part
        minPreDate.setDate(
          minPreDate.getDate() -
            (applicationSettings.mainSettings?.preDatedTransInNumbers || 0)
        );

        const transDateOnly = new Date(transDate);
        transDateOnly.setHours(0, 0, 0, 0); // Removes time part

        if (transDateOnly < minPreDate) {
          return {
            valid: false,
            message: "Pre Dated Transaction Not Allowed",
          };
        }
      } else {
        return {
          valid: false,
          message: "User privilege not assigned. Please contact admin.",
        };
      }1
    }
  }

  return { valid: isValid, message };
};
export const isDirtyTransaction = (
  prevState: any,
  currentState: any
): boolean => {
  // // const _prevState = customJsonParse(atob(prevState))
  // const keys = Object.keys(_prevState ?? {}).length;
  const _current = modelToBase64Unicode(setTransactionForHistory({
    transaction: { ...currentState.transaction },
    row: { ...currentState.row },
  }));
  const _isEqual = prevState === _current;
  return _isEqual === false && prevState !== undefined && prevState !== "";
};

export const setTransactionForHistory = (
  _formState: any
): any => {
  
  return {
    transaction: { ..._formState.transaction,
      master:{
        ..._formState.transaction.master,
        // employeeID: _formState.transaction.master.employeeID == null ? "" : _formState.transaction.master.employeeID,
        // currencyID: _formState.transaction.master.currencyID == null ? "" : _formState.transaction.master.currencyID,
      }
     },
    row: { ..._formState.row,
      ledgerID: _formState.row.ledgerID == null || _formState.row.ledgerID == ""  || _formState.row.ledgerID == 0 ? "" : _formState.row.ledgerID,
      //  costCentreID: _formState.row.costCentreID == null ? "" : _formState.row.costCentreID,
      //  projectSiteId: _formState.row.projectSiteId == null ? "" : _formState.row.projectSiteId,
       projectId: _formState.row.projectId == null || _formState.row.projectId == "" || _formState.row.projectId == 0 ? "" : _formState.row.projectId },
  }
};
