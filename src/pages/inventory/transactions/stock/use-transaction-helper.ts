import moment from "moment";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { UserAction } from "../../../../helpers/user-right-helper";
import { UserModel } from "../../../../redux/slices/user-session/reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { DeepPartial } from "redux";
import {
  generateUniqueKey,
  getExcelCellValue,
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
  sanitizeDataAdvanced,
} from "../../../../utilities/Utils";
import { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useCallback } from "react";
import VoucherType from "../../../../enums/voucher-types";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import {
  TransactionMaster3InitialData,
  initialTransactionDetails2,
  initialInventoryTotals,
  initialTransactionDetailData,
  TransactionMasterInitialData,
} from "../transaction-type-data";
import {
  TransactionFormState,
  TransactionMaster,
  SummaryItems,
  FormElementsState,
  CommonParams,
  TransactionDetail,
  TransactionDetailKeys,
  TransactionDetails2,
} from "../transaction-types";
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
  ): DeepPartial<TransactionFormState> => {
    let { result } = commonParams;
    let netAmt = summary.total;

    if (!result.transaction) {
      result.transaction = { master: {} };
    }
    if (!result.transaction.master) {
      result.transaction.master = {};
    }
    // if (!result.transaction.master.master3) {
    //   result.transaction.master.master3 = {};
    // }
    let _grandTotal = netAmt;
    result.transaction!.master!.grandTotal = _grandTotal;
    commonParams.formStateHandleFieldChangeKeysOnly &&
      dispatch &&
      dispatch(
        commonParams.formStateHandleFieldChangeKeysOnly({ fields: result })
      );

    return result;
  };

  const calculateRowAmount = (
    transactionDetail: TransactionDetail,
    currentColumn: TransactionDetailKeys,
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

      transactionDetail = { ...transactionDetail, ...detail };

      // The BTO Load condition is added Separate now, Change this based on the situation
      // Make this common if possible
      if(formState.transaction.master.voucherType === "BTO" || formState.transaction.master.voucherType === "BTI"){
        let rate = 0;
        let disc = Number(transactionDetail.discount ?? 0);
        let discPerc = Number(transactionDetail.discPerc ?? 0);
        const qty = Number(transactionDetail.qty ?? 0);
        const vatPerc = Number(transactionDetail.vatPerc ?? 0);
        const unitPrice = Number(transactionDetail.unitPrice ?? 0);
        const ratePlusTax = Number(transactionDetail.ratePlusTax ?? 0);
        if (ratePlusTax > 0 && currentColumn === "ratePlusTax") {

          const dval = (vatPerc / 100) + 1;
          rate = Number((ratePlusTax / dval).toFixed(3));
          detail.unitPrice = rate;
        }
        // If rate is 0, take unitPrice
        if (rate === 0) {
          rate = Number(detail.unitPrice ?? 0);
        }
        // Gross with 5 decimal rounding
        const gross = Number((qty * rate).toFixed(5));
        // If discount % entered (but not editing Discount field)
        if (discPerc > 0 && currentColumn !== "discount") {
          const calculatedDisc = Number(((discPerc * gross) / 100).toFixed(5));
            if (calculatedDisc !== disc) {
              disc = calculatedDisc;
          }
        }
          // If Discount amount edited → recalc Disc %
        if (rate > 0 && currentColumn === "discount" && gross !== 0) {
          discPerc = Number(((100 * disc) / gross).toFixed(5));
        }
        // NetValue
        const netValue = gross - disc;
        // VAT (4 decimal rounding)
        const vat = Number(((netValue * vatPerc) / 100).toFixed(4));
        // NetAmount (round final value)
        const netAmount = Number((netValue + vat).toFixed(2)); 
        // change 2 if you use different numeric precision
        // Cost per unit
        const cost = qty !== 0 ? Number((netAmount / qty).toFixed(2)) : 0;
        // Assign back to detail (equivalent to setting grid cells)
        detail.netValue = netValue;
        detail.discPerc = discPerc;
        detail.discount = disc;
        detail.vatAmount = vat;
        detail.gross = gross;
        detail.total = netAmount;
        detail.cost = cost;
      }else{
      const qty = Number(transactionDetail.qty || 0);
      const rate = Number(transactionDetail.cost || 0);

      const gross = qty * rate;
      const netValue = gross;
      const netAmount = netValue;

      detail.netValue = netValue;
      detail.gross = gross;
      detail.total = netAmount;

      const salesRate = Number(transactionDetail.salesPrice || 0);
      const salesTotal = qty * salesRate;

      detail.salesTotal = salesTotal;
      }
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
              currentColumn as any,
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
              currentColumn as any,
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

      let value: any;
      if (columnName.startsWith("details2.")) {
        const oth = columnName.substring("details2.".length);
        value = detail.details2?.[oth as keyof TransactionDetails2] as any;
      } else {
        // Handle invalid column name
        if (!columnName || typeof columnName !== "string") {
          return null;
        }

        // Check if property exists
        if (!(columnName in detail)) {
          return null;
        }

        value = detail[columnName] as any;
      }

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
          let _columnKey = config.showInColumn || config.column;
          if (_columnKey.startsWith("details2.")) {
            _columnKey = _columnKey.substring("details2.".length);
          }
          const columnKey = _columnKey as keyof SummaryItems;
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
    _details: any[],
    formType: string,
    voucherType: string,
    commonParams: CommonParams,
    loadType?: string
  ): TransactionDetail[] => {
    const detailsLength = _details.length;
    let details = [..._details];
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

      detail.pCode = row.productCode;
      detail.productBatchID = row.productBatchID;
      detail.barCode = row.autoBarcode;
      detail.product = row.productName;
      detail.productID = row.productID;

      detail.qty = round(Number(row.quantity || 0), 4);
      detail.qtyTag = row.quantity;
      detail.nosQty = row.qtyInNumbers;

      detail.productDescription = row.productDescription;
      detail.unit = row.unitName;
      detail.unitID = row.unitID;
      detail.mrp = row.mrp;
      detail.cost = row.costPerItem;
      detail.size = row.specification;
      detail.salesPrice = getFormattedValueIgnoreRoundingToNumber(
        Number(row.stdSalesPrice || 0)
      );
      detail.arabicName = row.itemNameinSecondLanguage;
      detail.gross = getFormattedValueIgnoreRoundingToNumber(
        Number(row.grossValue || 0)
      );
      detail.batchNo = row.batchNo;
      detail.stock = row.stock;

      detail.netValue = getFormattedValueIgnoreRoundingToNumber(
        Number(row.netValue || 0)
      );

      // The BTO Load condition is added Separate now, Change this based on the situation
      // Make this common if possible
      if (voucherType === "BTO"  || voucherType === "BTI") {
       detail.free = round(Number(row.free || 0), 4);
       detail.unitPrice = getFormattedValueIgnoreRoundingToNumber(
          Number(row.unitPrice || 0) + Number(row.additionalExpense || 0)
        );
        detail.discPerc = getFormattedValueIgnoreRoundingToNumber(
          Number(row.discountPer1 || 0)
        );
        detail.discount = getFormattedValueIgnoreRoundingToNumber(
          Number(row.discountAmt1 || 0)
        );
        detail.vatPerc = row.vatPercentage || 0
        detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(
          Number(row.totalVatAmount || 0)
        );
        detail.total = getFormattedValueIgnoreRoundingToNumber(
          Number(row.netAmount || 0)
        );
        // detail.barcodePrinted = "Y";
        // detail.batchCreated = "Y";
        detail.ratePlusTax = row.rateWithTax;
        // Optional: If you need StdPurchasePrice comparison logic like C#
        // detail.stdPurchasePrice = row.stdPurchasePrice;
        
        // If MSP logic required (similar to PI condition in C#)
        // if (row.minSalePrice && Number(row.minSalePrice) > 0) {
        //   detail.unitPrice = Number(row.minSalePrice);
        //   detail.gross = getFormattedValueIgnoreRoundingToNumber(
        //     Number(row.quantity || 0) * Number(row.minSalePrice)
        //   );
        // }
    }

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
      // detail.cost = originalCost;
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
          slNo: generateUniqueKey(),
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
    allowStockUpdate: boolean,
    voucherType?: string,
    toWarehouseId?: number
  ) => {
    const outputDetails: TransactionDetail[] = [];
    const errors: string[] = [];
    let hasError = false;

    for (let i = 0; i < details.length; i++) {
      const rowDetail = details[i];
      const rowNumber = i + 1;

      // Check if row is empty - break if product is empty (matching C# logic)
      if (!(rowDetail.productID > 0)) {
        break;
      }

      let detail = sanitizeDataAdvanced(
        { ...rowDetail },
        initialTransactionDetailData
      );
      let outputRow: any = { ...detail };

      // Core transaction fields
      outputRow.bulkRowInserted = false;
      outputRow.productBatchID = detail.productBatchID;
      outputRow.productID = detail.productID;
      outputRow.quantity = detail.qty;
      outputRow.qtyInNumbers = detail.nosQty;
      outputRow.free = detail.free;

      // Pricing and transaction details
      outputRow.unitPrice = detail.unitPrice;
      outputRow.transDate = transDate;
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
          outputRow.grossValue - outputRow.quantity * outputRow.costPerItem
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
      // outputRow.gRTransDetailID = detail.grTransDetailsID;

      // Purchase Order handling
      // if (
      //   applicationSettings?.inventorySettings
      //     ?.carryForwardPurchaseOrderQtyToPurchase
      // ) {
      //   outputRow.pOTransDetailID = detail.poTransDetailsID;
      // } else {
      //   outputRow.pO_PITransDetailIDs = detail.poTransDetailsID as string;
      //   try {
      //     outputRow.pO_PITransDetailQtys = detail.poTransDetailsIDTag as string;
      //   } catch (error) {
      //     hasError = true;
      //     errors.push(
      //       `Row ${rowNumber}, PO Detail Quantities Column: Error setting PO detail quantities - ${error}`
      //     );
      //   }
      // }
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

      // Warehouse stock - convert to number for nullable decimal
      const fromWhouseStockNum = parseFloat(detail.fromWhouseStock);
      outputRow.fromWhouseStock = isNaN(fromWhouseStockNum) ? null : fromWhouseStockNum;
      const toWhouseStockNum = parseFloat(detail.toWhouseStock);
      outputRow.toWhouseStock = isNaN(toWhouseStockNum) ? null : toWhouseStockNum;

      // Date handling - convert empty strings to null for nullable DateTime fields
      outputRow.mfgDate = isNullOrUndefinedOrEmpty(detail.mfdDate) ? null : detail.mfdDate; // Done for handle "" value when save - change if needed
      outputRow.expiryDate = isNullOrUndefinedOrEmpty(detail.expDate) ? null : detail.expDate;  // Done for handle "" value when save
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
      // outputRow.wareHouseID = detail.warehouse;
      outputRow.grandTotal = outputRow.grandTotal ?? 0;

      // Stock Transfer - set from and to warehouse IDs
      if (voucherType === "ST") {
        outputRow.fromWarehouseID = warehouseId;
        outputRow.toWarehouseID = toWarehouseId;
      }
      // Warehouse ID based on voucher type (matching C# logic)
      if (voucherType === "EX" || voucherType === "EX-SP") {
        outputRow.wareHouseID = toWarehouseId;
      } else if (voucherType === "SH" || voucherType === "SH-SP" || voucherType === "DMG") {
        outputRow.wareHouseID = warehouseId;
      }

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
      master3: {
        ...TransactionMaster3InitialData,
        ...(formState.transaction.master.master3 || {}),
      },
      address2:
        formState.transaction.master.voucherType == VoucherType.PurchaseReturn
          ? formState.transaction.master.address2
          : "",
      address3:
        formState.transaction.master.voucherType == VoucherType.PurchaseReturn
          ? formState.transaction.master.address3
          : "",
      address4:
        formState.transaction.master.voucherType == VoucherType.PurchaseReturn
          ? formState.transaction.master.address4
          : "",
    };

    master.partyName = !isNullOrUndefinedOrEmpty(master.displayName)
      ? master.displayName
      : master.partyName;
    master.invTransactionMasterID = formState.isEdit
      ? master.invTransactionMasterID
      : 0;
    // master.bankDate = new Date().toISOString();
    master.prevTransDate =
      master.transactionDate == ""
        ? moment().local().toISOString()
        : master.prevTransDate;
    master.cashAmt = master.cashReceived;
    master.fromWarehouseID =
      master.fromWarehouseID > 0
        ? master.fromWarehouseID
        : master.voucherType == VoucherType.PurchaseReturn
        ? 0
        : 1;
    master.stockUpdate = master.stockUpdate;
    master.ledgerID = isNullOrUndefinedOrZero(master.ledgerID)
      ? 0
      : master.ledgerID;
    master.supplyType =
      master.supplyType == undefined || master.supplyType == null
        ? ""
        : master.supplyType.toString();

    let _master = sanitizeDataAdvanced(
      { ...master },
      TransactionMasterInitialData
    );
    return _master;
  };
  const applyDiscountsToItems = (): void => {
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
      if (details.length > 0) {
        details = details.map((item, i) => {
          itemGross = item.gross ?? 0;
          grossPerc = (itemGross / totalGross) * 100;
          itemDisc = (billDisc * grossPerc) / 100;
          discPerc = round((itemDisc / itemGross) * 100, 5);

          const detail = { slNo: item.slNo, discPerc: discPerc };
          const updatedRow = calculateRowAmount(
            item,
            "discPerc",
            { result: { transaction: { details: [detail] } } },
            true
          );
          if (updatedRow?.transaction?.details?.length ?? 0 > 0) {
            outState.transaction!.details!.push(
              updatedRow.transaction!.details![0]
            );
            return { ...item, ...updatedRow.transaction!.details![0] };
          }
          return item;
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
              updateOnlyGivenDetailsColumns: true,
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
    applyDiscountsToItems,
  };
};
