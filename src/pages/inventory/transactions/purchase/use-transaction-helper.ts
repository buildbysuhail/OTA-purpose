import moment from "moment";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { UserAction } from "../../../../helpers/user-right-helper";
import { UserModel } from "../../../../redux/slices/user-session/reducer";
import {
  CommonParams,
  FormElementsState,
  SummaryItems,
  TransactionDetail,
  TransactionFormState,
  TransactionMaster,
} from "./transaction-types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { DeepPartial } from "redux";
import {
  generateUniqueKey,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import {
  initialInventoryTotals,
  initialTransactionDetailData,
} from "./transaction-type-data";
import { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { formStateHandleFieldChangeKeysOnly } from "./reducer";
export const useTransactionHelper = (transactionType: string) => {
  const dispatch = useDispatch();
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );

  const {
    round,
    getAmountInWords,
    getFormattedValue,
    getFormattedValueIgnoreRounding,
    getFormattedValueIgnoreRoundingToNumber,
    getFormattedValueToNumber,
    getNumericFormat,
    getTaxFormat,
  } = useNumberFormat();
  const clearEntryControl = (
    state: TransactionFormState,
    defaultCostCenterID: number
  ): TransactionFormState => {
    return state;
  };
  const setUserRightsFn = (
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
  const disableControlsFn = (
    state: TransactionFormState
  ): TransactionFormState => {
    state.formElements.pnlMasters.disabled = true;
    state.formElements.dxGrid.disabled = true;
    return state;
  };
  const validateTransactionDate = (
    transDate: Date,
    skipPostDatedAndPredated: boolean = false,
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
          debugger;
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

  const getClosedDate = async (api: APIClient, transactionType: string) => {
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
    let { result } = commonParams;
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
      commonParams.formStateHandleFieldChangeKeysOnly &&
        dispatch &&
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
        );
    }
    return result;
  };
  const calculateRowAmount = (
    transactionDetail: TransactionDetail,
    currentColumn: keyof TransactionDetail,
    commonParams: CommonParams,
    ignoreCalculateTotal?: boolean,
    rowIndex?: number
  ): DeepPartial<TransactionFormState> => {
    rowIndex = rowIndex ?? -1;
    ignoreCalculateTotal = ignoreCalculateTotal ?? false;
    let { result } = commonParams;

    result = result || { transaction: { details: [] } };
    result.transaction ??= { details: [] };
    result.transaction.details ??= [];

    const detail = { ...result.transaction.details[0] };
    // Early return if no product selected
    if (!(transactionDetail.productID > 0)) {
      return result;
    }

    try {
      // Initialize variables with proper null checks and defaults

      transactionDetail = {...transactionDetail, ...detail}
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

      detail.unitPrice = transactionDetail.unitPrice;
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
        formState
      );
      detail.salesPrice = sp_margin ?? transactionDetail.salesPrice;

      // Calculate profit and profit percentage
      let sp = Number(detail.salesPrice || 0);

      // Use actual sales price if available
      if (Number(transactionDetail.actualSalesPrice || 0) > 0) {
        sp = Number(transactionDetail.actualSalesPrice || 0);
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

      result.transaction.details = [detail];

      if (!ignoreCalculateTotal && rowIndex >= 0) {
        let details = [...formState.transaction.details];
        let current = { ...formState.transaction.details[rowIndex] };
        const final = { ...current, ...detail };
        details[rowIndex] = final;

        const summaryRes = calculateSummary(details, formState, {
          result: {},
        });
        let _result = calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
          formState.formElements,
          {
            result,
          }
        );
        _result.transaction = _result.transaction ? _result.transaction : {};
        _result.summary = summaryRes.summary;
        _result.transaction.details = [{ ...detail, slNo: current.slNo }];
        result = _result;
      }
      commonParams.formStateHandleFieldChangeKeysOnly &&
        dispatch &&
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({
            fields: result,
            updateOnlyGivenDetailsColumns: true,
          })
        );
    } catch (error) {
      console.error("Error in calculateRowAmount:", error);
      // Handle error gracefully - could set default values or show user message
    } finally {
      return result;
    }
  };
  const calculateMarginPerRow = (
    detail: { total: number; qty: number; margin: number; salesPrice: number },
    formState: TransactionFormState
  ): number | undefined => {
    try {
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
    currentColumn: keyof TransactionDetail
  ): void => {
    try {
      const detail = formState.transaction.details[rowIndex];
      const formType = formState.transaction.master.voucherForm;
      const exchangeRate = Number(
        formState.transaction.master.exchangeRate || 0
      );

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
            calculateRowAmount(
              { ...detail, unitPriceFC: unitPrice, unitPrice: unitPriceFC },
              currentColumn,
              {
                formStateHandleFieldChangeKeysOnly:
                  formStateHandleFieldChangeKeysOnly,
                result: {
                  transaction: {
                    details: [
                      { unitPriceFC: unitPrice, unitPrice: unitPriceFC },
                    ],
                  },
                },
              },
              false,
              rowIndex
            );
          }
        }
      } else {
        // Handle other form types - Local Currency calculations
        if (gross > 0) {
          const calculatedURate = gross / qty;

          if (calculatedURate !== uRate) {
            uRate = calculatedURate;

            // Update form state
            const unitPrice = round(uRate, 4);

            // Recalculate row amounts
            calculateRowAmount(
              { ...detail, unitPrice: unitPrice },
              currentColumn,
              {
                formStateHandleFieldChangeKeysOnly:
                  formStateHandleFieldChangeKeysOnly,
                result: {
                  transaction: { details: [{ unitPrice: unitPrice }] },
                },
              },
              false,
              rowIndex
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in changeGrossToUnitRate:", error);
    }
  };
  const enableControls = (commonParams: CommonParams) => {
    let { result } = commonParams;

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
      commonParams.formStateHandleFieldChangeKeysOnly &&
        dispatch &&
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
        );
    } catch (error) {
      console.error("Error in enableControls:", error);
    } finally {
      return result;
    }
  };

  const disableControls = (commonParams: CommonParams) => {
    let { result } = commonParams;

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
      commonParams.formStateHandleFieldChangeKeysOnly &&
        dispatch &&
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
        );
    } catch (error) {
      console.error("Error in disableControls:", error);
    } finally {
      return result;
    }
  };
  const getColumnValue = (
    detail: TransactionDetail,
    columnName: keyof TransactionDetail
  ): number | null => {
    try {
      // Handle null/undefined detail object
      if (!detail || typeof detail !== "object") {
        return null;
      }

      // Handle invalid column name
      if (!columnName || typeof columnName !== "string") {
        return null;
      }

      // Check if property exists
      if (!(columnName in detail)) {
        return null;
      }

      const value = detail[columnName];

      // Handle null, undefined, empty string
      if (value == null || value === "") {
        return null;
      }

      // Handle already numeric values
      if (typeof value === "number") {
        return isNaN(value) || !isFinite(value) ? null : value;
      }

      // Handle string conversion
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") return null;

        // Handle common edge cases
        if (trimmed === "-" || trimmed === "+") return null;

        const numValue = Number(trimmed);
        return isNaN(numValue) || !isFinite(numValue) ? null : numValue;
      }

      // Handle boolean conversion
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }

      // Handle arrays, objects, functions - return null
      if (typeof value === "object" || typeof value === "function") {
        return null;
      }

      // Last resort conversion attempt
      const numValue = Number(value);
      return isNaN(numValue) || !isFinite(numValue) ? null : numValue;
    } catch (error) {
      // Log error in development, return null in production
      if (process.env.NODE_ENV === "development") {
        console.warn(`getColumnValue error for column '${columnName}':`, error);
      }
      return null;
    }
  };

  const calculateSummaryValue = (
    details: TransactionDetail[],
    config: SummaryConfig
  ): number => {
    // Input validation - fail fast
    if (!details?.length || !config?.summaryType || !config?.column) {
      return 0;
    }

    const { summaryType, column } = config;

    // Initialize variables - only what we need
    let sum = 0;
    let count = 0;
    let min = Infinity;
    let max = -Infinity;

    const needsSum = summaryType === "sum" || summaryType === "avg";
    const needsMin = summaryType === "min";
    const needsMax = summaryType === "max";

    // Single optimized pass for all calculations
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];

      // Handle potential null/undefined detail
      if (!detail) continue;

      const value = getColumnValue(detail, column as keyof TransactionDetail);

      // Robust null/undefined/NaN checking
      if (value === null || value === undefined || !Number.isFinite(value)) {
        continue;
      }

      count++;

      // Conditional processing - only do what's needed
      if (needsSum) sum += value;
      if (needsMin && value < min) min = value;
      if (needsMax && value > max) max = value;
    }

    // Handle no valid data case
    if (count === 0) return 0;

    // Return based on summary type with error handling
    switch (summaryType) {
      case "sum":
        return Number.isFinite(sum) ? sum : 0;

      case "avg":
        const avg = sum / count;
        return Number.isFinite(avg) ? avg : 0;

      case "count":
        return count;

      case "min":
        return min !== Infinity ? min : 0;

      case "max":
        return max !== -Infinity ? max : 0;

      default:
        // Log unexpected summary type in development
        if (process.env.NODE_ENV === "development") {
          console.warn(`Unknown summaryType: ${summaryType}`);
        }
        return 0;
    }
  };
  const calculateSummary = (
    details: any,
    formState: TransactionFormState,
    commonParams: CommonParams
  ) => {
    let { result } = commonParams;

    try {
      let tot = 0;
      debugger;
      if (!result) {
        result = {};
      }
      if (!result.summary) {
        result.summary = {};
      }
      const summaryConfig = formState.summaryConfig;

      summaryConfig.forEach((config, index) => {
        try {
          // Calculate the summary value
          const calculatedValue = calculateSummaryValue(details, config);

          const columnKey = (config.showInColumn ||
            config.column) as keyof SummaryItems;
          if ((config.showInColumn || config.column) == "vatAmount") {
            (result.summary as any)[columnKey] = round(
              calculatedValue,
              undefined,
              true
            );
          } else {
            (result.summary as any)[columnKey] = round(calculatedValue);
          }
        } catch (configError) {
          console.error(
            `Error processing summary config for column ${config.column}:`,
            configError
          );
        }
      });

      // Dispatch the updated state
      commonParams.formStateHandleFieldChangeKeysOnly &&
        dispatch &&
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
        );
    } catch (error) {
      console.error("Error in calculateSummary:", error);
    } finally {
      return result;
    }
  };

  const refactorDetails = (
    details: any[],
    vType: string,
    formType: string,
    commonParams: CommonParams,
    formState: TransactionFormState
  ): TransactionDetail[] => {
    const detailsLength = details.length;

    let validDetailsCount = 0;
    for (let i = 0; i < detailsLength; i++) {
      const row = details[i];
      let detail: TransactionDetail = { ...(details[i] || {}) };
      if (isNullOrUndefinedOrZero(detail.productID)) {
        break;
      }
      validDetailsCount++;
      // Set row header/index
      detail.slNo = generateUniqueKey();

      // Basic product information
      detail.pCode = row.productCode;
      detail.productBatchID = row.productBatchID;
      detail.barCode = row.autoBarcode;
      detail.product = row.productName;
      detail.productID = row.productID;
      detail.brandID = row.brandID;
      detail.brand = row.brandName;
      detail.arabicName = row.itemNameInSecondLanguage;

      // Quantity and pricing
      detail.free = round(Number(row.free || 0), 4);
      detail.qty = round(Number(row.quantity || 0), 4);
      detail.nosQty = row.qtyInNumbers;
      detail.unit = row.unitName;
      detail.unitID = row.unitID;

      // Foreign currency pricing
      detail.unitPriceFC = Number(row.xRate || 0);
      const qtyVal = Number(detail.qty || 0);
      const unitPriceFCVal = Number(detail.unitPriceFC || 0);
      detail.grossFC = qtyVal * unitPriceFCVal;

      // Local currency pricing
      detail.unitPrice = getFormattedValueIgnoreRoundingToNumber(
        Number(row.unitPrice || 0)
      );

      // Special handling for GRN type
      if (vType === "GRN") {
        detail.unitPriceTag = getFormattedValueIgnoreRoundingToNumber(
          Number(row.unitPrice || 0)
        );
      }

      // Cost calculations
      const costPerItem = Number(row.costPerItem || 0);
      const additionalExpense = Number(row.additionalExpense || 0);
      detail.cost = getFormattedValueIgnoreRoundingToNumber(costPerItem);
      detail.cost = costPerItem - additionalExpense;

      // Tax information
      detail.cstPerc = row.cstPerc;
      detail.cst = row.cst;

      // Product specifications
      detail.size = row.specification;
      detail.stickerQty = 0;
      detail.additionalExpense = row.additionalExpense;

      // Color handling with fallback
      detail.colour = row.colour || row.color;

      detail.warranty = row.warranty;
      detail.totalAddExpense =
        Number(row.quantity || 0) * Number(row.additionalExpense || 0);
      detail.location = row.location;
      detail.profit = row.totalProfit;

      // Sales pricing
      detail.salesPrice = getFormattedValueIgnoreRoundingToNumber(
        Number(row.stdSalesPrice || 0)
      );
      detail.ratePlusTax = getFormattedValueIgnoreRoundingToNumber(
        Number(row.rateWithTax || 0)
      );

      // Fallback sales price
      if (Number(detail.salesPrice || 0) === 0) {
        detail.salesPrice = row.stdSalesPricePB;
      }

      detail.margin = row.marginPer;
      detail.stock = row.stock;

      // Minimum sale price calculation
      const minSalePrice = Number(row.minSalePrice || 0);
      const multiFactor = Number(row.multiFactor || 1);
      detail.minSalePrice = minSalePrice * multiFactor;

      // Date handling
      detail.mfdDate = row.mfgDate;
      detail.expDate = row.expiryDate;

      detail.batchNo = row.batchNo;
      detail.manualBarcode = row.manualBarcode;

      // Financial calculations
      detail.gross = getFormattedValueIgnoreRoundingToNumber(
        Number(row.grossValue || 0)
      );
      detail.discPerc = getFormattedValueIgnoreRoundingToNumber(
        Number(row.discountPer1 || 0)
      );
      detail.discount = getFormattedValueIgnoreRoundingToNumber(
        Number(row.discountAmt1 || 0)
      );
      detail.schemeDiscount = getFormattedValueIgnoreRoundingToNumber(
        Number(row.schemeDiscAmt || 0)
      );

      // VAT handling based on form type
      if (formType === "VAT") {
        detail.vatPerc = row.vatPercentage;
        detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(
          Number(row.totalVatAmount || 0)
        );
      } else {
        detail.vatPerc = 0;
        detail.vatAmount = 0;
      }

      detail.netValue = getFormattedValueIgnoreRoundingToNumber(
        Number(row.netValue || 0)
      );
      detail.total = getFormattedValueIgnoreRoundingToNumber(
        Number(row.netAmount || 0)
      );
      detail.productDescription = row.productDescription;

      // Unit 2 information
      detail.unitID2 = row.unitID2;
      detail.unit2Qty = row.unit2Qty;
      detail.unit2MBarcode = row.unit2Barcode;
      detail.unit2SalesRate = row.unit2SalesPrice;
      detail.unit2MRP = row.unit2MRP;

      // Unit 3 information
      detail.unitID3 = row.unitID3;
      detail.unit3Qty = row.unit3Qty;
      detail.unit3MBarcode = row.unit3Barcode;
      detail.unit3SalesRate = row.unit3SalesPrice;
      detail.unit3MRP = row.unit3MRP;

      detail.memo = row.memo;
      detail.actualSalesPrice = row.actualSalesPrice;

      // Optional fields with error handling
      try {
        detail.supplierReferenceProductCode = row.supplierReferenceProductCode;
      } catch (error) {
        console.error("Error setting supplier reference product code:", error);
      }

      try {
        detail.warehouseID = row.warehouseID;
        detail.warehouseName = row.warehouseName;
      } catch (error) {
        console.error("Error setting warehouse information:", error);
      }

      // Additional flags
      detail.barcodePrinted = false;
      detail.batchCreated = true;

      // Store original cost for restoration after calculation
      const originalCost = detail.cost;

      // Calculate row amounts
      const res = calculateRowAmount(
        detail,
        "slNo",
        {
          ...commonParams,
          result: {
            transaction: {
              details: [{ ...detail }],
            },
          },
        },
        true
      );
      if (res.transaction!.details) {
        detail = res.transaction!.details[0] as TransactionDetail;
      }
      // Restore original cost
      detail.cost = originalCost;
      details[i] = detail;
    }

    // Calculate empty rows needed
    const blankDetailsCount = detailsLength - validDetailsCount;
    const emptyRowsNeeded = Math.max(0, 50 - blankDetailsCount);

    // Fill remaining slots with empty rows if needed
    if (emptyRowsNeeded > 0) {
      for (let i = detailsLength; i < detailsLength + emptyRowsNeeded; i++) {
        details[i] = {
          ...initialTransactionDetailData,
          slNo: i + 1,
        };
      }
    }

    // Return appropriately sized array
    return details.slice(0, Math.max(detailsLength + emptyRowsNeeded, 50));
  };
  const attachDetails = (
    details: TransactionDetail[],
    formType: string,
    transDate: string,
    supplierLedgerId: number,
    warehouseId: number,
    allowStockUpdate: boolean
  ) => {
    const outputDetails: TransactionDetail[] = [];
    const errors: string[] = [];
    let hasError = false;

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const rowNumber = i + 1;

      // Check if row is empty - break if product is empty (matching C# logic)
      if (!(detail.productID > 0)) {
        break;
      }

      const outputRow: any = {};

      // Core transaction fields
      outputRow.bulkRowInserted = false;
      outputRow.productBatchID = detail.productBatchID;
      outputRow.productID = detail.productID;
      outputRow.quantity = detail.qty;
      outputRow.qtyInNumbers = detail.nosQty;
      outputRow.free = detail.free;

      // Pricing and transaction details
      outputRow.unitPrice = detail.unitPrice;
      outputRow.transDate = new Date(transDate);
      outputRow.unitID = detail.unitID;

      // Discounts
      outputRow.discountPer1 = detail.discPerc;
      outputRow.discountAmt1 = detail.discount;

      // Tax information
      outputRow.cstPerc = detail.cstPerc;
      outputRow.cst = detail.cst;

      // Supplier and additional fields
      outputRow.supplierLedgerID = supplierLedgerId;
      outputRow.additionalExpense = detail.additionalExpense;

      // VAT handling
      outputRow.vatPercentage = detail.vatPerc;
      outputRow.totalVatAmount = detail.vatAmount;

      // Financial calculations
      outputRow.grossValue = detail.gross;
      outputRow.netValue = detail.netValue;
      outputRow.netAmount = detail.total;
      outputRow.productDescription = detail.productDescription || "";
      outputRow.invStatus = "";

      // Sales and margin
      outputRow.marginPer = detail.margin;
      outputRow.stdSalesPrice = detail.salesPrice;
      outputRow.specification = detail.size;
      outputRow.costPerItem = detail.cost;
      outputRow.totalProfit = detail.profit;
      outputRow.barcodeQty = detail.stickerQty;
      outputRow.rateWithTax = detail.ratePlusTax;

      // Set rate with tax fallback
      if (outputRow.rateWithTax === 0) {
        outputRow.rateWithTax = outputRow.unitPrice;
      }

      // Scheme discount
      outputRow.schemeDiscount = detail.schemeDiscount;

      // Validation checks - collect errors instead of throwing
      if (outputRow.unitID === 0) {
        hasError = true;
        errors.push(`Row ${rowNumber}, Unit Column: Invalid Unit Selected`);
      }

      if (
        Math.abs(
          outputRow.grossValue - outputRow.quantity * outputRow.unitPrice
        ) > 1
      ) {
        hasError = true;
        errors.push(
          `Row ${rowNumber}, Gross Value Column: Gross value calculation mismatch`
        );
      }

      // Warehouse handling
      if (applicationSettings?.inventorySettings?.maintainWarehouse === true) {
        outputRow.wareHouseID = warehouseId;
      } else {
        outputRow.wareHouseId = 1;
      }

      // Multi-warehouse billing
      if (
        applicationSettings?.productsSettings?.enableMultiWarehouseBilling &&
        applicationSettings?.productsSettings?.usePopupWindowForItemSearch
      ) {
        try {
          const warehouseIdFromDetail = detail.warehouseID;
          if (warehouseIdFromDetail > 0) {
            outputRow.wareHouseID = warehouseIdFromDetail;
          }
        } catch (error) {
          hasError = true;
          errors.push(
            `Row ${rowNumber}, Warehouse Column: Error setting warehouse from detail - ${error}`
          );
        }
      }

      // Exchange rate
      outputRow.xRate = 1;
      if (formType === "Import") {
        outputRow.xRate = detail.unitPriceFC;
      }

      // Stock update flag
      outputRow.stockUpdate = allowStockUpdate;

      // Supplier reference
      outputRow.supplierProductReferenceCode =
        detail.supplierReferenceProductCode;

      // GR Transaction details
      outputRow.grTransDetailId = detail.grTransDetailsID;

      // Purchase Order handling
      if (
        applicationSettings?.inventorySettings
          ?.carryForwardPurchaseOrderQtyToPurchase
      ) {
        outputRow.poTransDetailId = detail.poTransDetailsID;
      } else {
        outputRow.poPiTransDetailIds = detail.poTransDetailsID;
        try {
          outputRow.poPiTransDetailQtys = detail.poTransDetailsIDTag;
        } catch (error) {
          hasError = true;
          errors.push(
            `Row ${rowNumber}, PO Detail Quantities Column: Error setting PO detail quantities - ${error}`
          );
        }
      }

      // Memo and random key
      outputRow.memo = detail.memo;
      outputRow.randomKey = 0;

      // Basic product information
      outputRow.productCode = detail.pCode;
      outputRow.autoBarcode = detail.barCode;
      outputRow.productName = detail.product;
      outputRow.brandID = detail.brandID;
      outputRow.brandName = detail.brand;
      outputRow.itemNameInSecondLanguage = detail.arabicName;

      // Unit information
      outputRow.unitName = detail.unit;

      // Product specifications
      outputRow.colour = detail.colour;
      outputRow.color = detail.colour; // Fallback for legacy systems
      outputRow.warranty = detail.warranty;
      outputRow.location = detail.location;

      // Stock and pricing
      outputRow.stock = detail.stock;
      outputRow.minSalePrice = detail.minSalePrice;
      outputRow.multiFactor = 1; // Default or calculate if needed

      // Date handling
      outputRow.mfgDate = detail.mfdDate;
      outputRow.expiryDate = detail.expDate;
      outputRow.batchNo = detail.batchNo;
      outputRow.mannualBarcode = detail.manualBarcode;

      // Unit 2 information
      outputRow.unit2ID = detail.unitID2;
      outputRow.unit2Qty = detail.unit2Qty;
      outputRow.unit2Barcode = detail.unit2MBarcode;
      outputRow.unit2SalesPrice = detail.unit2SalesRate;
      outputRow.unit2MRP = detail.unit2MRP;

      // Unit 3 information
      outputRow.unit3ID = detail.unitID3;
      outputRow.unit3Qty = detail.unit3Qty;
      outputRow.unit3Barcode = detail.unit3MBarcode;
      outputRow.unit3SalesPrice = detail.unit3SalesRate;
      outputRow.unit3MRP = detail.unit3MRP;

      // Additional sales and warehouse info
      outputRow.actualSalesPrice = detail.actualSalesPrice;
      outputRow.warehouse = detail.warehouseID;
      outputRow.warehouse.grandTotal = outputRow.warehouse.grandTotal ?? 0;

      outputDetails.push(outputRow);
    }

    return {
      outputDetails,
      hasError,
      errors,
    };
  };

  const attachMaster = (formState: TransactionFormState) => {
    const master: TransactionMaster = {
      ...formState.transaction.master,
      address2: "",
      address3: "",
      address4: "",
    };
    master.invTransactionMasterID = formState.isEdit
      ? master.invTransactionMasterID
      : 0;
    // master.bankDate = new Date().toISOString();
    master.prevTransDate =
      master.transactionDate == ""
        ? moment().local().toISOString()
        : master.prevTransDate;
    return formState.transaction.master;
  };
  const     applyDiscountsToItems = (): void => {
    debugger;
    try {
      let outState: DeepPartial<TransactionFormState> = {
        transaction: { master: {}, details: [] },
      };
      let billDisc = 0,
        totalGross = 0,
        itemGross = 0,
        grossPerc = 0,
        itemDisc = 0,
        discPerc = 0;

      let details = formState.transaction.details.filter(
        (x) => x.productID > 0
      );
      billDisc = formState.transaction.master.billDiscount;
      outState.transaction!.master!.billDiscount = 0;
      // Calculate total gross for items with productID > 0
      totalGross = formState.summary.gross;
      // Apply discount to each item with productID > 0
      if(details.length > 0) {
      details.forEach((item, i) => {
        itemGross = item.gross ?? 0;
        grossPerc = (itemGross / totalGross) * 100;
        itemDisc = (billDisc * grossPerc) / 100;
        discPerc = round((itemDisc / itemGross) * 100, 5);

        const detail = { slNo: item.slNo, discPerc: discPerc };
        const updatedRow = calculateRowAmount(
          item,
          "discPerc",
          { result: {transaction:{details:[detail]}} },
          true
        );
        if(updatedRow?.transaction?.details?.length??0 > 0) {
        outState.transaction!.details!.push(updatedRow.transaction!.details![0]);
        item = {...item, ...updatedRow.transaction!.details![0]}
        }
      });
      const summaryRes = calculateSummary(details, formState, {
          result: {},
        });
        let totalRes = calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
          formState.formElements,
          {
            result: {},
          }
        );
         if (totalRes) {
          totalRes.summary = summaryRes.summary;
          totalRes.transaction = totalRes.transaction ?? {};
          totalRes.transaction.master = totalRes.transaction.master ?? {};
          totalRes.transaction.master.billDiscount = 0;
          totalRes.transaction.details = outState?.transaction
            ?.details as TransactionDetail[];

          dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: totalRes,
          updateOnlyGivenDetailsColumns: true
        })
      );
        }
    }
    } catch (ex: any) {
      console.error("Error applying discounts:", ex);
    }
  };
  return {
    clearEntryControl,
    setUserRightsFn,
    disableControlsFn,
    validateTransactionDate,
    getClosedDate,
    calculateTotal,
    calculateRowAmount,
    changeGrossToUnitRate,
    enableControls,
    disableControls,
    calculateSummary,
    refactorDetails,
    attachDetails,
    attachMaster,
        applyDiscountsToItems
  };
};
