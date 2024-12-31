import VoucherType from "../../../enums/voucher-types";
import { UserAction } from "../../../helpers/user-right-helper";
import { UserModel } from "../../../redux/slices/user-session/reducer";
import { AccTransactionFormState } from "./acc-transaction-types";

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
  localStorage.setItem(
    `${state.transaction.master.voucherType}${state.transaction.master.formType}`,
    JSON.stringify(state.transaction.details)
  );
  return state;
};
// export const setUserRight = (
//   state: AccTransactionFormState,
//   userSession: UserModel,
//   hasRight: (formCode: string, action: UserAction) => boolean
// ): AccTransactionFormState => {
//   debugger;

//   const isClosed = userSession.financialYearStatus === "Closed";

//   state.formElements.btnSave.visible = !isClosed
//     ? hasRight(state.formCode, UserAction.Add) &&
//       (state?.transaction?.details?.length ?? 0) > 0
//     : false;

//   state.formElements.btnEdit.visible = !isClosed
//     ? hasRight(state.formCode, UserAction.Edit)
//     : false;

//   state.formElements.btnDelete.visible = !isClosed
//     ? hasRight(state.formCode, UserAction.Delete)
//     : false;

//   state.formElements.btnPrint.visible = !isClosed
//     ? hasRight(state.formCode, UserAction.Print)
//     : false;
//   return state;
// };
