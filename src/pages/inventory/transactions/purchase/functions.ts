import moment from "moment";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import VoucherType from "../../../../enums/voucher-types";
import { UserAction } from "../../../../helpers/user-right-helper";
import { ClientSessionModel } from "../../../../redux/slices/client-session/reducer";
import { UserModel } from "../../../../redux/slices/user-session/reducer";
import { modelToBase64Unicode } from "../../../../utilities/jsonConverter";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import {
  FormElementsState,
  SummaryItems,
  TransactionDetail,
  TransactionFormState,
  TransactionMaster,
} from "./transaction-types";
import {
  useNumberFormat,
  UseNumberFormatResult,
} from "../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { ApplicationInventorySettings } from "../../../settings/system/application-settings-types/application-settings-types-inventory";
import { AnyAction, DeepPartial, Dispatch } from "redux";

export const clearEntryControl = (
  state: TransactionFormState,
  defaultCostCenterID: number
): TransactionFormState => {
  return state;
};
export const setUserRightsFn = (
  state: TransactionFormState,
  userSession: UserModel,
  hasRight: (formCode: string, action: UserAction) => boolean
): TransactionFormState => {
  const isClosed = userSession.financialYearStatus === "Closed";
  state.formElements.btnSave.disabled = !isClosed
    ? hasRight(state.formCode, UserAction.Add) &&
      (state?.transaction?.details?.length ?? 0) > 0
    : false;

  state.formElements.btnEdit.disabled = !isClosed
    ? hasRight(state.formCode, UserAction.Edit)
    : false;

  state.formElements.btnProductSummary.visible = !isClosed
    ? hasRight("PSUMRPT", UserAction.Show)
    : false;

  state.formElements.btnDelete.disabled = !isClosed
    ? hasRight(state.formCode, UserAction.Delete)
    : false;

  state.formElements.btnPrint.disabled = !isClosed
    ? hasRight(state.formCode, UserAction.Print)
    : false;
  return state;
};
export const disableControlsFn = (
  state: TransactionFormState
): TransactionFormState => {
  state.formElements.pnlMasters.disabled = true;
  state.formElements.dxGrid.disabled = true;
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
      }
      1;
    }
  }

  return { valid: isValid, message };
};
export interface CommonParams {
  useNumberFormat: () => UseNumberFormatResult;
  result: DeepPartial<TransactionFormState>;
  dispatch?: Dispatch<AnyAction>;
  accFormStateHandleFieldChangeKeysOnly?: any;
}
export const getClosedDate = async (
  api: APIClient,
  transactionType: string
) => {
  const date = await api.getAsync(
    `${Urls.inv_transaction_base}${transactionType}/getClosedDate/`
  );
  const xTimestamp = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  return new Date(date);
};

const calculateTotal = (
  master: TransactionMaster,
  summary: SummaryItems,
  formElements: FormElementsState,
  commonParams: CommonParams
) => {
  let {
    useNumberFormat,
    result,
    dispatch,
    accFormStateHandleFieldChangeKeysOnly,
  } = commonParams;
  result = result
    ? result
    : {
        netAmount: 0,
        transaction: {
          master: {
            grandTotal: 0,
            grandTotalFc: undefined,
            vatAmount: 0,
            roundAmount: 0,
          },
        },
      };

  const { round } = useNumberFormat();
  const netVal = summary.netValue;
  let netAmt = summary.total;
  const tax = summary.vatAmount;

  if (+(netVal + tax) !== +netAmt) {
    netAmt = round(netVal + tax);
  }

  const billDisc = master.billDiscount;
  const additionalAmt = master.adjustmentAmount;

  if (!result.transaction) {
    result.transaction = { master: {} };
  }
  if (!result.transaction.master) {
    result.transaction.master = {};
  }
  result.transaction.master.vatAmount = round(tax);
  result.netAmount = round(netAmt);

  let _grandTotal = netAmt + additionalAmt - billDisc;

  if (master.hasroundOff) {
    try {
      result.transaction!.master!.roundAmount = parseFloat(
        (Math.round(_grandTotal) - _grandTotal).toFixed(3)
      );
      result.transaction!.master!.grandTotal = Math.round(_grandTotal);
    } catch (err) {
      // handle error if needed
      console.error("Error in rounding calculation:", err);
    }
  } else {
    result.transaction!.master!.roundAmount = 0;
    result.transaction!.master!.grandTotal = _grandTotal;
  }

  // Check if foreign currency calculation is needed
  if (formElements.pnlImport.visible && master.exchangeRate > 0) {
    const exchangeRate = master.exchangeRate;
    if (exchangeRate > 0) {
      result.transaction!.master!.grandTotalFc = _grandTotal / exchangeRate;
    }
    accFormStateHandleFieldChangeKeysOnly &&
      dispatch &&
      dispatch(accFormStateHandleFieldChangeKeysOnly(result));
  }
  return result;
};
const calculateRowAmount = (
  transactionDetail: TransactionDetail,
  currentColumn: keyof TransactionDetail,
  formState: TransactionFormState,
  applicationSettings: ApplicationSettingsType,
  commonParams: CommonParams
): DeepPartial<TransactionFormState> => {
  let {
    useNumberFormat,
    result,
    dispatch,
    accFormStateHandleFieldChangeKeysOnly,
  } = commonParams;

  result = result
    ? result
    : {
        transaction: {
          details: [],
        },
      };
  const detail =
    result.transaction?.details?.find(
      (x) => x?.slNo == transactionDetail.slNo
    ) ?? {};
  if (
    result.transaction?.details?.find(
      (x) => x?.slNo == transactionDetail.slNo
    ) == undefined
  ) {
    return result;
  }
  const { getFormattedValueIgnoreRoundingToNumber, round } = useNumberFormat();
  // Early return if no product selected
  if (!transactionDetail.product) {
    return result;
  }

  try {
    // Initialize variables with proper null checks and defaults
    let qty = Number(transactionDetail.qty || 0);
    let freeQty = Number(transactionDetail.free || 0);
    let rate = Number(transactionDetail.unitPrice || 0);
    let addAmt = Number(transactionDetail.additionalExpense || 0);
    let vatPerc = Number(transactionDetail.vatPerc || 0);
    let disc = Number(transactionDetail.discount || 0);
    let discPerc = Number(transactionDetail.discPerc || 0);
    let exciseTaxPer = Number(transactionDetail.cstPerc || 0);
    let exciseTax = Number(transactionDetail.cst || 0);
    let ratePlusTax = 0;
    let cost = 0;
    let unitPrice = Number(transactionDetail.unitPrice || 0);

    // Handle RatePlusTax visibility and calculation
    if (
      transactionDetail.ratePlusTax !== undefined &&
      transactionDetail.ratePlusTax !== null
    ) {
      ratePlusTax = Number(transactionDetail.ratePlusTax || 0);
    } else {
      ratePlusTax = 0;
    }

    // Calculate gross amount (Qty * Rate)
    let gross = round(qty * rate, 5);

    // Handle RatePlusTax calculation when current column is RatePlusTax
    if (ratePlusTax > 0 && currentColumn === "ratePlusTax") {
      const dval = vatPerc / 100 + 1;
      let qty1 = qty || 1;

      if (qty1 === 0) qty1 = 1;

      rate = round((ratePlusTax * qty1) / dval, 3);
      rate = rate / qty1;

      // Update unit price in form state
      detail.unitPrice = rate;
    } else {
      const dval = vatPerc / 100 + 1;
      detail.ratePlusTax = round(unitPrice * dval, 2);
    }

    // Fallback for rate if still 0
    if (rate === 0) {
      rate = Number(detail.unitPrice || 0);
    }

    // Handle discount percentage calculation
    if (discPerc > 0 && currentColumn !== "discount") {
      const calculatedDisc = round((discPerc * gross) / 100, 5);
      if ((discPerc * gross) / 100 !== disc) {
        disc = calculatedDisc;
      }
    }

    // Handle discount percentage when discount amount is being edited
    if (rate > 0 && currentColumn === "discount") {
      discPerc = round((100 * disc) / gross, 5);
    }

    // Calculate net value after discount
    let netValue = gross - disc;

    // Calculate excise tax
    exciseTax = (netValue * exciseTaxPer) / 100;
    netValue += exciseTax;

    // Update form state with calculated values
    detail.cst = getFormattedValueIgnoreRoundingToNumber(exciseTax);
    detail.netValue = getFormattedValueIgnoreRoundingToNumber(netValue);
    detail.discPerc = getFormattedValueIgnoreRoundingToNumber(discPerc);
    detail.discount = getFormattedValueIgnoreRoundingToNumber(disc);

    // Calculate total additional expense
    detail.totalAddExpense = round(addAmt * qty);

    // Recalculate VAT percentage (in case it was updated)
    vatPerc = Number(detail.vatPerc || 0);

    // Calculate VAT amount
    let vat = round((netValue * vatPerc) / 100, 4);

    // Calculate net value per unit for cost calculation
    let netVal = rate - (rate * discPerc) / 100;

    // Calculate cost based on settings
    if (applicationSettings?.inventorySettings?.setProductCostWithVATAmount) {
      cost = round(netVal + (netVal * vatPerc) / 100, 2);
    } else {
      cost = netVal;
    }

    // Update cost and VAT amount
    detail.cost = round(cost);
    detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(vat);

    // Calculate final net amount (NetValue + VAT)
    let netAmount = netValue + vat;
    netAmount = round(netAmount, 4);

    // Update gross and total
    detail.gross = getFormattedValueIgnoreRoundingToNumber(gross);
    detail.total = round(netAmount);

    // Calculate margin per row
    const sp_margin = calculateMarginPerRow(
      {
        total: detail.total,
        margin: transactionDetail.margin,
        qty,
        salesPrice: transactionDetail.salesPrice,
      },
      formState,
      useNumberFormat,
      applicationSettings
    );
    detail.salesPrice = sp_margin ?? detail.salesPrice;

    // Calculate profit and profit percentage
    let sp = Number(detail.salesPrice || 0);

    // Use actual sales price if available
    if (Number(detail.actualSalesPrice || 0) > 0) {
      sp = Number(detail.actualSalesPrice || 0);
    }

    // Adjust sales price if showing rate before tax
    if (applicationSettings?.productsSettings?.showRateBeforeTax) {
      sp = sp / (1 + vatPerc / 100);
    }

    if (sp > 0) {
      const profit = qty * (sp - netVal);
      detail.profit = round(profit);

      const profitPerc =
        Math.round(((sp - netVal) / netVal) * 100 * 1000) / 1000;
      detail.profitPercentage = profitPerc;
    } else {
      detail.profit = 0.0;
      detail.profitPercentage = 0.0;
    }

    // Auto calculation and summary
    // if (formState.autoCalculation || rowIndex < 15) {
    //   calculateAutoSummary(formState);
    //   calculateTotal(formState);
    // }
    if (!result.transaction) {
      result.transaction = { details: [] };
    }
    if (!result.transaction.details) {
      result.transaction.details = [];
    }
    result.transaction.details.push(detail);
    result = calculateTotal(
      formState.transaction.master,
      formState.summary,
      formState.formElements,
      {
        result,
        useNumberFormat,
        accFormStateHandleFieldChangeKeysOnly,
        dispatch,
      }
    );
    accFormStateHandleFieldChangeKeysOnly &&
      dispatch &&
      dispatch(accFormStateHandleFieldChangeKeysOnly(result));
  } catch (error) {
    console.error("Error in calculateRowAmount:", error);
    // Handle error gracefully - could set default values or show user message
  } finally {
    return result;
  }
};
const calculateMarginPerRow = (
  detail: { total: number; qty: number; margin: number; salesPrice: number },
  formState: TransactionFormState,
  useNumberFormat: () => UseNumberFormatResult,
  applicationSettings: ApplicationSettingsType
): number | undefined => {
  try {
    const { round, getFormattedValueToNumber } = useNumberFormat();
    // Initialize variables
    let sp = 0;
    let cost = Number(detail.total || 0);
    let qty = Number(detail.qty || 0);
    let marginPerc = Number(detail.margin || 0);

    // Early return if no margin percentage
    if (marginPerc === 0) return;

    // Default qty to 1 if 0
    if (qty === 0) qty = 1;

    // Calculate cost per unit
    cost = cost / qty;

    // Calculate sales price based on cost and margin
    if (cost !== 0) {
      sp = cost + (cost * marginPerc) / 100;
    } else {
      sp = 0;
    }

    // Handle margin column visibility logic
    if (
      formState.gridColumns?.find((x) => x.dataField == "margin")?.visible !=
      true
    ) {
      sp = Number(detail.salesPrice || 0);
    } else {
      const currentSalesPrice = Number(detail.salesPrice || 0);
      if (Math.abs(sp - currentSalesPrice) > 0.01) {
        sp = round(sp);
      }
    }

    // Apply margin rounding based on settings
    sp = round(sp, applicationSettings.productsSettings.marginRoundTo);

    // Final rounding to 3 decimal places
    sp = Math.round(sp * 1000) / 1000;

    // Update sales price if margin and sp are valid
    if (marginPerc > 0 && sp > 0) {
      return getFormattedValueToNumber(sp);
    }
    return undefined;
  } catch (error) {
    console.error("Error in calculateMarginPerRow:", error);
  }
};
const changeGrossToUnitRate = (
  rowIndex: number,
  currentColumn: keyof TransactionDetail,
  formState: TransactionFormState,
  applicationSettings: ApplicationSettingsType,
  commonParams: CommonParams
): void => {
  try {
      let {
    useNumberFormat,
    result,
    dispatch,
    accFormStateHandleFieldChangeKeysOnly,
  } = commonParams;

    const { round } = useNumberFormat();
    const detail = formState.transaction.details[rowIndex];
    const formType = formState.transaction.master.voucherForm;
    const exchangeRate = Number(formState.transaction.master.exchangeRate || 0);

    // Initialize variables
    let qty = Number(detail.qty || 0);
    let gross = Number(detail.gross || 0);
    let uRate = Number(detail.unitPrice || 0);
    let grossFC = Number(detail.grossFC || 0);
    let uRateFC = Number(detail.unitPriceFC || 0);

    // Prevent division by zero
    if (qty === 0) {
      return;
    }

    if (formType === "Import") {
      // Handle Import form type - Foreign Currency calculations
      if (grossFC > 0) {
        const calculatedURateFC = grossFC / qty;

        if (calculatedURateFC !== uRateFC) {
          uRateFC = calculatedURateFC;
          uRate = uRateFC * exchangeRate;

          // Update form state
          const unitPriceFC = round(uRateFC, 4);
          const unitPrice = round(uRate, 4);

          // Recalculate row amounts
          result = calculateRowAmount(
            detail,
            currentColumn,
            formState,
            applicationSettings,
            commonParams
          );
          result.transaction!.details!.find(
            (x) => x?.slNo == detail.slNo
          )!.unitPrice = unitPrice;
          result.transaction!.details!.find(
            (x) => x?.slNo == detail.slNo
          )!.unitPriceFC = unitPriceFC;
        }
      }
    } else {
      // Handle other form types - Local Currency calculations
      if (gross > 0) {
        const calculatedURate = gross / qty;

        if (calculatedURate !== uRate) {
          uRate = calculatedURate;

          // Update form state
          const unitPrice = round(uRate,4);

          // Recalculate row amounts
          result = calculateRowAmount(
            detail,
            currentColumn,
            formState,
            applicationSettings,
            commonParams
          );
          result.transaction!.details!.find(
            (x) => x?.slNo == detail.slNo
          )!.unitPrice = unitPrice;
        }
      }
    }
     accFormStateHandleFieldChangeKeysOnly &&
      dispatch &&
      dispatch(accFormStateHandleFieldChangeKeysOnly(result));
  } catch (error) {
    console.error("Error in changeGrossToUnitRate:", error);
  }
};
const enableControls = (
 commonParams: CommonParams
) => {
 let {
   result,
   dispatch,
   accFormStateHandleFieldChangeKeysOnly,
 } = commonParams;
 
 try {
   if (!result.formElements) {
     result.formElements = {};
   }
   
   // Enable masters panel
   if (!result.formElements.pnlMasters) {
     result.formElements.pnlMasters = { disabled: false };
   } else {
     result.formElements.pnlMasters.disabled = false;
   }
   
   // Enable inventory grid
   if (!result.formElements.dgvInventory) {
     result.formElements.dgvInventory = { disabled: false };
   } else {
     result.formElements.dgvInventory.disabled = false;
   }
   
   // Enable amount summary panel
   if (!result.formElements.pnlAmountSummary) {
     result.formElements.pnlAmountSummary = { disabled: false };
   } else {
     result.formElements.pnlAmountSummary.disabled = false;
   }

   // Dispatch the updated state
   accFormStateHandleFieldChangeKeysOnly &&
     dispatch &&
     dispatch(accFormStateHandleFieldChangeKeysOnly(result));

 } catch (error) {
   console.error('Error in enableControls:', error);
 } finally {
   return result;
 }
};

const disableControls = (
 commonParams: CommonParams
) => {
 let {
   result,
   dispatch,
   accFormStateHandleFieldChangeKeysOnly,
 } = commonParams;
 
 try {
   if (!result.formElements) {
     result.formElements = {};
   }
   
   // Disable masters panel
   if (!result.formElements.pnlMasters) {
     result.formElements.pnlMasters = { disabled: true };
   } else {
     result.formElements.pnlMasters.disabled = true;
   }
   
   // Disable inventory grid
   if (!result.formElements.dgvInventory) {
     result.formElements.dgvInventory = { disabled: true };
   } else {
     result.formElements.dgvInventory.disabled = true;
   }
   
   // Disable amount summary panel
   if (!result.formElements.pnlAmountSummary) {
     result.formElements.pnlAmountSummary = { disabled: true };
   } else {
     result.formElements.pnlAmountSummary.disabled = true;
   }
   
   // Hide data panel
   if (!result.formElements.txtData) {
     result.formElements.txtData = { visible: false };
   } else {
     result.formElements.txtData.visible = false;
   }
   
   // Hide product batches panel
   if (!result.formElements.pnlProductBatches) {
     result.formElements.pnlProductBatches = { visible: false };
   } else {
     result.formElements.pnlProductBatches.visible = false;
   }

   // Dispatch the updated state
   accFormStateHandleFieldChangeKeysOnly &&
     dispatch &&
     dispatch(accFormStateHandleFieldChangeKeysOnly(result));

 } catch (error) {
   console.error('Error in disableControls:', error);
 } finally {
   return result;
 }
};

