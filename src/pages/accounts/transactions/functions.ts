import moment from "moment";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import VoucherType from "../../../enums/voucher-types";
import { UserAction } from "../../../helpers/user-right-helper";
import { ClientSessionModel } from "../../../redux/slices/client-session/reducer";
import { UserModel } from "../../../redux/slices/user-session/reducer";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import { AccTransactionFormState } from "./acc-transaction-types";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";

export const calculateTotal = (state: AccTransactionFormState): number => {
  return state.transaction.master.voucherType !== "MJV"
    ? state.transaction.details.reduce(
        (sum, detail) => sum + (Number(detail.amount) || 0),
        0
      )
    : state.transaction.details.reduce(
        (sum, detail) => sum + (Number(detail.debit) || 0),
        0
      );
};
export const clearEntryControl = (
  state: AccTransactionFormState,
  defaultCostCenterID: number

): AccTransactionFormState => {
  state.row.ledgerCode = "";
  state.row.groupName = "";
  state.row.ledgerId = 0;
  state.row.amount = 0;
  state.row.discount = 0;
  state.row.bankName = "";
  state.previousNarration = state.row.narration;
  state.row.narration =
    state.transaction.master.voucherType == VoucherType.JournalVoucher
      ? state.userConfig.keepNarrationForJV != true
        ? ""
        : state.row.narration
      : "";
  state.row.chequeNumber = "";
  state.isRowEdit = false;
  state.row.costCentreId =
    state.userConfig.presetCostenterId > 0
      ? state.userConfig.presetCostenterId
      : defaultCostCenterID;

  state.transaction.master.totalAmount = calculateTotal(state);
  state.formElements.btnAdd.label = "Add";
  state.isRowEdit = false;
  return state;
};
export const validateTransactionDate = (
  transDate: Date,
  skipPostDatedAndPredated: boolean = false,
  userSession: UserModel,
  clientSession: ClientSessionModel,
  applicationSettings: ApplicationSettingsType,
  hasRight: (formCode: string, action: UserAction) => boolean
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

  if ((moment(transDate) < moment(userSession.finFrom)) || (moment(transDate) > moment(userSession.finTo))) {
    return {
      valid: false,
      message: "Transaction date is outside the financial period.",
    };
  }

  // Skip post-dated and pre-dated checks if specified
  if (!skipPostDatedAndPredated) {
    const softwareDate = new Date(clientSession.softwareDate);

    // Post-dated transaction validation
    if (
      applicationSettings.mainSettings?.allowPostdatedTrans &&
      transDate.toDatePartString() !== softwareDate.toDatePartString()
    ) {
      if (!hasRight("PRE_POST", UserAction.Blocked)) {
        const maxPostDate = moment().add(
          applicationSettings.mainSettings?.postDatedTransInNumbers,
          "days"
        ).toDate();

        if (transDate > maxPostDate) {
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
      transDate.toDatePartString() !== softwareDate.toDatePartString()
    ) {
      if (!hasRight("PRE_POST", UserAction.Blocked)) {
        const minPreDate = moment().subtract(
          applicationSettings.mainSettings?.preDatedTransInNumbers,
          "days"
        ).toDate();

        if (transDate < minPreDate) {
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
      }
    }
  }

  return { valid: isValid, message };
};