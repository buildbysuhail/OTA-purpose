import moment from "moment";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { UserAction, useUserRights } from "../../../../helpers/user-right-helper";
import { Countries, UserModel } from "../../../../redux/slices/user-session/reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { DeepPartial } from "redux";
import { generateUniqueKey, isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero, sanitizeDataAdvanced, } from "../../../../utilities/Utils";
import { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import VoucherType from "../../../../enums/voucher-types";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly } from "../reducer";
import { TransactionMaster3InitialData, initialTransactionDetails2, initialInventoryTotals, initialTransactionDetailData, TransactionMasterInitialData, } from "../transaction-type-data";
import { TransactionFormState, TransactionMaster, SummaryItems, FormElementsState, CommonParams, TransactionDetail, TransactionDetailKeys, TransactionDetails2, GiftModel, DataAutoBarcode, LoadProductDetailsByAutoBarcodeProps, CurrentCell, } from "../transaction-types";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { useTranslation } from "react-i18next";
import warehouseId from "./components/warehouse-id ";
import { getStorageString } from "../../../../utilities/storage-utils";
import { merge } from "lodash";
import { getApLocalData } from "../../../../redux/cached-urls";

const api = new APIClient();
export const useTransactionHelper = (transactionType: string, focusToNextColumn: (
  rowIndex: number,
  column: string,
  excludedColumns?: (keyof TransactionDetail)[]
) => { column: string; rowIndex: number } | null,
  focusColumn: (
    rowIndex: number,
    column: string
  ) => { column: string; rowIndex: number } | null) => {
  const dispatch = useDispatch();
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const clientSession = useAppSelector((state: RootState) => state.ClientSession);
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const { t } = useTranslation();
  const {
    round,
    getFormattedValueIgnoreRoundingToNumber,
    toTaxFormat,
    posRoundAmount,
    roundAmount,
    RoundAmountGlobal,
    getFormattedValue
  } = useNumberFormat();

  const { hasRight } = useUserRights();
  const clearEntryControl = (state: TransactionFormState): TransactionFormState => {
    return state;
  };
  const setCurrentCell = (
    input: { column: string; rowIndex: number } | null,
    data: TransactionDetail,
    reCenterRow: boolean
  ) => {
    if (input) {
      dispatch(
        formStateHandleFieldChange({
          fields: {
            currentCell: {
              reCenterRow: reCenterRow,
              column: input?.column,
              data: data,
              rowIndex: input?.rowIndex,
            },
          },
        })
      );
    }
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
    return new Date(date);
  };


  // ---------- Helper stubs (replace with your real helpers if available) ----------
  const calculateRowAmount = async (
    transactionDetail: TransactionDetail,
    currentColumn: TransactionDetailKeys,
    commonParams: CommonParams,
    ignoreCalculateTotal?: boolean,
    rowIndex?: number,
    reverseDiscountClicked?: boolean
  ): Promise<DeepPartial<TransactionFormState>> => {
    rowIndex = rowIndex ?? -1;
    ignoreCalculateTotal = ignoreCalculateTotal ?? false;
    let { result } = commonParams || ({} as CommonParams);

    result = result || { transaction: { details: [] } };
    result.transaction ??= { details: [] };
    result.transaction.details ??= [];

    const detailFromResult = { ...result.transaction.details[0] };
    if (!transactionDetail || !(transactionDetail.productID > 0)) {
      return result;
    }

    let detail: TransactionDetail = { ...(transactionDetail || {}), ...detailFromResult };

    try {
      const isIndia = clientSession.isAppGlobal === true; // true = India (GST), false = GCC (VAT)
      const settings = applicationSettings || {};
      const form = formState;
      const chkShowRateBeforeTax = !!(formState?.userConfig?.showRateBeforeTax);
      const chkTaxOnMRP = !!(formState?.userConfig?.taxOnMRP);
      const chkTaxOnFreeItem = !!(formState?.userConfig?.taxOnFreeItem);
      const master = formState.transaction.master;

      // read numeric values directly (no toNum helper)
      let Qty = Number(detail.qty ?? 0);
      let FreeQty = Number(detail.free ?? 0);
      let Rate = Number(detail.unitPrice ?? 0);
      let UnitDiscount = Number(detail.unitDiscount ?? 0);
      let Disc = Number(detail.discount ?? 0);
      let DiscPerc = Number(detail.discPerc ?? 0);
      let RatePlusTax = Number(detail.ratePlusTax ?? 0);
      let UP = Number(detail.unitPrice ?? 0);

      // VAT-specific
      let VatPerc = Number(detail.vatPerc ?? 0);
      let Vat = 0;
      let ExciseTaxPer = Number(detail.cstPerc ?? 0);
      let ExciseTax = Number(detail.cst ?? 0);

      // GST-specific (India)
      let CGSTPerc = Number(detail.details2?.cgstPerc ?? 0);
      let SGSTPerc = Number(detail.details2?.sgstPerc ?? 0);
      let IGSTPerc = Number(detail.details2?.igstPerc ?? 0);
      let AddnlCessPerc = Number(detail.details2?.additionalCessPerc ?? 0);
      let CessPerc = Number(detail.details2?.cessPerc ?? 0);

      let CGST = Number(detail.details2?.cgst ?? 0);
      let SGST = Number(detail.details2?.sgst ?? 0);
      let IGST = Number(detail.details2?.igst ?? 0);
      let AddnlCess = Number(detail.details2?.additionalCess ?? 0);
      let Cess = Number(detail.details2?.cessAmt ?? 0);

      // Flags
      const isEdit = form?.isEdit ?? false;
      const TenderClosed = formState?.tenderOpen !== true;

      // ---------------- RatePlusTax -> UnitPrice conversion (exact C# behavior) ----------------
      if (RatePlusTax > 0 && (currentColumn === "ratePlusTax" || currentColumn === "netConvert")) {
        if (isIndia) {
          const dval = ((SGSTPerc + CGSTPerc + IGSTPerc + CessPerc + AddnlCessPerc) / 100) + 1;
          if (dval === 0) {
            Rate = 0;
          } else {
            if ([VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(master.voucherType as any)) {
              Rate = Number((RatePlusTax / dval).toFixed(3));
            } else {
              Rate = round(RatePlusTax / dval, 4);
            }
          }
          detail.unitPrice = Rate;
        } else {
          const dval = (VatPerc / 100) + 1;
          let Qty1 = Qty || 1;
          if (Qty1 === 0) Qty1 = 1;
          if ([VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(master.voucherType as any)) {
            Rate = Number(((RatePlusTax * Qty1) / dval).toFixed(3));
          } else {
            Rate = round((RatePlusTax * Qty1) / dval, 4);
          }

          Rate = Rate / Qty1;
          detail.unitPrice = Rate;
        }
      } else {
        // When RatePlusTax not used for conversion: if RatePlusTax isn't visible/used C# sometimes sets unitPrice->0 when ratePlusTax <= 0 and user edited ratePlusTax col
        if ((currentColumn === "ratePlusTax") && RatePlusTax <= 0) {
          // reflect C# behaviour: set unitPrice to 0
          detail.unitPrice = 0;
          Rate = 0;
        } else {
          Rate = Rate || Number(detail.unitPrice ?? 0);
        }
      }

      // ---------- Gross ----------
      let precision = 5;
      if (master.voucherType === VoucherType.SalesInvoice) {
        precision = 4;
      }
      if (
        isIndia &&
        [VoucherType.SalesReturn, VoucherType.SaleReturnEstimate]
          .includes(master.voucherType as any)
      ) {
        precision = 4;
      }

      let Gross = round(Qty * Rate, precision);
      // ---------- Discount logic (mirror C# branches exactly) ----------
      // Case: Discount amount edited

      if (master.voucherType === VoucherType.SalesInvoice && !isIndia) {
        if (DiscPerc > 0 && currentColumn !== "discount") {
          if (DiscPerc * Gross / 100 != Disc) {
            Disc = round(DiscPerc * Gross / 100, 5);
          }
        }
      }
      if (Disc > 0 && currentColumn === "discount") {
        DiscPerc = Gross !== 0 ? master.voucherType == VoucherType.ServiceInventory ? 100 * Disc / Gross : round((100 * Disc) / Gross, 5) : 0;
        UnitDiscount = round(Disc / (Qty === 0 ? 1 : Qty), 5);
      }
      // Case: Discount % edited
      else if (DiscPerc > 0 && currentColumn === "discPerc") {
        if (DiscPerc * Gross / 100 != Disc) {
          Disc = round(DiscPerc * Gross / 100, 5);
          UnitDiscount = Disc / (Qty === 0 ? 1 : Qty);
        }
      }
      // Case: ReverseDiscountClicked or other edits where discPerc > 0 and discount column not being edited
      else if (DiscPerc > 0 && (reverseDiscountClicked === true || currentColumn !== "discount")) {
        if (DiscPerc * Gross / 100 != Disc) {
          Disc = round(DiscPerc * Gross / 100, 5);
          UnitDiscount = Disc / (Qty === 0 ? 1 : Qty);
        }
      } else {
        // default - maintain UnitDiscount if provided, else 0
        UnitDiscount = UnitDiscount || 0;
      }

      // Discount slab offer behavior (exact mapping)
      if (master.voucherType == VoucherType.SalesInvoice && settings?.inventorySettings?.enableDiscountSlabOffer) {
        // C# checks for EnableDiscountSlabOffer and DiscPerc == 0 and (isEdit || TenderClosed)
        if ((DiscPerc === 0) && (isEdit || TenderClosed)) {
          if (DiscPerc !== Disc) {
            Disc = DiscPerc;
            UnitDiscount = Disc / (Qty === 0 ? 1 : Qty);
          }
        }
      }

      if (Rate > 0 && currentColumn === "discount") {
        DiscPerc = round(100 * Disc / (Gross === 0 ? 1 : Gross), 5);
      }

      // Reset ReverseDiscountClicked equivalent handled by caller; we don't mutate global flag here.

      // ---------- CalculationDiff & Show Rate Before Tax ----------
      let CalculationDiff = 0;
      CalculationDiff = Gross - Qty * (RatePlusTax / (1 + VatPerc / 100 || 1));

      if (RatePlusTax > 0 && VatPerc > 0 && Disc === 0 && chkShowRateBeforeTax && Math.abs(CalculationDiff) < 0.5) {
        Gross = round(Qty * (RatePlusTax / (1 + VatPerc / 100)), 5);
      }


      // ---------- NetValue ----------
      let NetValue = master.voucherType == VoucherType.ServiceInventory ? Gross - Disc : round(Gross - Disc, 4);

      // ---------- VAT path (GCC, isIndia === false) ----------
      if (!isIndia) {
        // Excise on NetValue
        ExciseTax = (NetValue * ExciseTaxPer) / 100;
        NetValue += ExciseTax;

        // KSA einvoice rounding
        if ([VoucherType.SalesInvoice, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(master.voucherType as any) && !isIndia && applicationSettings?.branchSettings?.maintainKSA_EInvoice && applicationSettings?.branchSettings.apply_KSA_EInvoice_Validation_Rules) {
          NetValue = round(NetValue, 2);
        }

        Vat = round(NetValue * VatPerc / 100, 4);

        // Map values to detail (matching C# cell writes)
        detail.cst = getFormattedValueIgnoreRoundingToNumber(ExciseTax);
        detail.netValue = getFormattedValueIgnoreRoundingToNumber(NetValue);
        detail.discPerc = getFormattedValueIgnoreRoundingToNumber(DiscPerc);
        detail.discount = getFormattedValueIgnoreRoundingToNumber(Disc);
        detail.unitDiscount = getFormattedValueIgnoreRoundingToNumber(round(UnitDiscount, 5));
        detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(Vat);

        let NetAmount = NetValue + Vat;

        // If unit price edited update RatePlusTax similar to C#
        if (currentColumn === "unitPrice" && VatPerc > 0 && UP * (1 + VatPerc / 100) !== RatePlusTax) {
          RatePlusTax = UP * (1 + VatPerc / 100);
          detail.ratePlusTax = round(RatePlusTax, 4);
        }
        NetAmount = master.voucherType == VoucherType.GoodsDeliveryNote ? NetAmount : round(NetAmount, 4);
        if (RatePlusTax > 0 && Vat > 0 && Disc == 0 && chkShowRateBeforeTax && Math.abs(Qty * RatePlusTax - NetAmount) < 0.5 && master.voucherType != VoucherType.SalesInvoice) {

          NetAmount = round(Qty * RatePlusTax, applicationSettings?.mainSettings.decimalPoints);
        }
        //Cost
        let Cost = 0;
        if ([VoucherType.SalesInvoice, VoucherType.SalesReturn].includes(master.voucherType as any)) {
          Cost = Qty !== 0 ? (NetValue / Qty) : 0;
        } else {

          Cost = Qty !== 0 ? (NetAmount / Qty) : 0;
        }

        if (master.voucherType == VoucherType.ServiceInventory) {
          detail.gross = Number((Gross).toFixed(2));
          detail.total = Number((NetAmount).toFixed(2));
          detail.cost = Number((Cost).toFixed(2));
        } else {
          detail.gross = getFormattedValueIgnoreRoundingToNumber(Gross);
          detail.total = master.voucherType == VoucherType.SalesQuotation && isIndia ? parseFloat(getFormattedValue(NetAmount)) : NetAmount;
          detail.cost = round(Cost);
        }


        // Profit calculation (same as C#)
        if ([VoucherType.SalesInvoice, VoucherType.SalesReturn].includes(master.voucherType as any)) {
          const purchasePrice = Number(detail.purchasePrice ?? detail.purchaseRate ?? 0);
          const Profit = NetValue - (Qty * purchasePrice);
          detail.profit = Profit;
          // Profit percentage only if column visible in grid (mimic C# try/catch)
          try {
            const profitColumn = formState.gridColumns?.find((x: any) => x.dataField == "profitPercentage");
            if (profitColumn?.visible !== false) {
              let profit_perc = 0;
              if (purchasePrice > 0 && Qty > 0) {
                profit_perc = (Profit / (purchasePrice * Qty)) * 100;
              } else {
                profit_perc = 0;
              }
              detail.profitPercentage = profit_perc;
            }
          } catch {
            /* ignore like C# */
          }
        }
      }
      // ---------- GST path (India) ----------
      else {
        // RatePlusTax handling (C# had special block)
        if (currentColumn === "ratePlusTax") {
          if (RatePlusTax > 0) {
            const dval = ((SGSTPerc + CGSTPerc + IGSTPerc + CessPerc + AddnlCessPerc) / 100) + 1;
            if (dval === 0) {
              Rate = 0;
            } else {
              Rate = round(RatePlusTax / dval, 4);
            }
            detail.unitPrice = Rate;
          } else {
            // C# sets unit price to "0.00" when ratePlusTax <= 0 and user edited ratePlusTax column
            detail.unitPrice = 0;
          }
        }

        if (Rate === 0) Rate = Number(detail.unitPrice ?? 0);

        // recalc gross
        Gross = round(Qty * Rate, 4);

        // NetValue after discount
        NetValue = round(Gross - Disc, 4);

        // If AddnlCess amount edited, recompute percentage
        if (Number(detail.details2?.additionalCess ?? 0) > 0 && currentColumn === "details2.additionalCess") {
          const AddCessAmount = Number(detail.details2?.additionalCess ?? 0);
          if (NetValue > 0) {
            AddnlCessPerc = round((AddCessAmount * 100) / NetValue, 3);
            detail.details2 = { ...(detail.details2 || initialTransactionDetails2), additionalCessPerc: AddnlCessPerc };
          }
        }

        // Tax on MRP branch (exact C#)
        if (chkTaxOnMRP && master.voucherType == VoucherType.SalesInvoice) {
          let TaxableMRP = 0;
          const denom = 1 + ((CGSTPerc + SGSTPerc + IGSTPerc) / 100 || 0);
          TaxableMRP = denom !== 0 ? (Number(detail.mrp ?? 0) / denom) : 0;

          if (chkTaxOnFreeItem) {
            const qtyForTax = Qty + FreeQty;
            CGST = qtyForTax * TaxableMRP * (CGSTPerc / 100);
            SGST = qtyForTax * TaxableMRP * (SGSTPerc / 100);
            IGST = qtyForTax * TaxableMRP * (IGSTPerc / 100);
            AddnlCess = qtyForTax * TaxableMRP * (AddnlCessPerc / 100);

            if (CessPerc > 0 && currentColumn !== "details2.cessAmt") {
              Cess = qtyForTax * TaxableMRP * (CessPerc / 100);
            } else if ((qtyForTax * TaxableMRP) > 0 && currentColumn === "details2.cessAmt") {
              CessPerc = (Cess * 100) / (qtyForTax * TaxableMRP);
            } else {
              Cess = 0;
              CessPerc = 0;
            }
          } else {
            CGST = Qty * TaxableMRP * (CGSTPerc / 100);
            SGST = Qty * TaxableMRP * (SGSTPerc / 100);
            IGST = Qty * TaxableMRP * (IGSTPerc / 100);
            AddnlCess = Qty * TaxableMRP * (AddnlCessPerc / 100);

            if (CessPerc > 0 && currentColumn !== "details2.cessAmt") {
              Cess = Qty * TaxableMRP * (CessPerc / 100);
            } else if ((Qty * TaxableMRP) > 0 && currentColumn === "details2.cessAmt") {
              CessPerc = (Cess * 100) / (Qty * TaxableMRP);
            } else {
              Cess = 0;
              CessPerc = 0;
            }
          }
        } else {
          // default: tax on NetValue
          CGST = NetValue * CGSTPerc / 100;
          SGST = NetValue * SGSTPerc / 100;
          IGST = NetValue * IGSTPerc / 100;
          AddnlCess = NetValue * AddnlCessPerc / 100;

          if (CessPerc > 0 && currentColumn !== "details2.cessAmt") {
            Cess = NetValue * CessPerc / 100;
          } else if (NetValue > 0 && currentColumn === "details2.cessAmt") {
            CessPerc = (Cess * 100) / NetValue;
          } else {
            Cess = 0;
            CessPerc = 0;
          }

          // Tax on free item: C# uses FreeQty * Rate => NetValue1 = Gross1 - Disc ??? 
          // According to original C# GST: Free tax calculated by NetValue1 = Gross1 - Disc (they used same Disc for free item)
          if (chkTaxOnFreeItem && FreeQty > 0) {
            const Gross1 = FreeQty * Rate;
            const NetValue1 = Gross1 - Disc; // keep same as original C# implementation
            const FreeCGST = NetValue1 * (CGSTPerc / 100);
            const FreeSGST = NetValue1 * (SGSTPerc / 100);
            const FreeIGST = NetValue1 * (IGSTPerc / 100);
            const FreeAddnlCess = NetValue1 * (AddnlCessPerc / 100);
            const FreeCess = CessPerc > 0 ? NetValue1 * (CessPerc / 100) : 0;

            CGST += FreeCGST;
            SGST += FreeSGST;
            IGST += FreeIGST;
            AddnlCess += FreeAddnlCess;
            Cess += FreeCess;
          }
        }

        // Store results in details2
        detail.details2 = {
          ...(detail.details2 || initialTransactionDetails2),
          cgst: round(CGST),
          sgst: round(SGST),
          igst: round(IGST),
          additionalCess: round(AddnlCess),
          cessAmt: round(Cess),
          cessPerc: round(CessPerc, 4),
          cgstPerc: CGSTPerc,
          sgstPerc: SGSTPerc,
          igstPerc: IGSTPerc,
          additionalCessPerc: AddnlCessPerc,
        };

        // Voucher form special rules (exact mapping)
        const vform = (form?.transaction?.master?.voucherForm ?? "").toString().toUpperCase();
        if (vform === "INTERSTATE" || vform === "INT" || vform === "IMPORT") {
          detail.details2.cgst = 0;
          detail.details2.sgst = 0;
          detail.details2.cgstPerc = 0;
          detail.details2.sgstPerc = 0;
          // C# doesn't zero IGST here (IGST used for interstate)
        }
        if (((form?.transaction?.master?.voucherType ?? "") === VoucherType.SalesEstimate)
          || (((form?.transaction?.master?.voucherForm == ""
            && ![VoucherType.SalesInvoice, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(form?.transaction?.master?.voucherType as any))
            || (form?.transaction?.master?.voucherType ?? "") === VoucherType.SaleReturnEstimate))) {
          detail.details2.cgst = 0;
          detail.details2.sgst = 0;
          detail.details2.igst = 0;
          detail.details2.cessAmt = 0;
          detail.details2.additionalCess = 0;
          detail.details2.sgstPerc = 0;
          detail.details2.cgstPerc = 0;
          detail.details2.igstPerc = 0;
          detail.details2.cessPerc = 0;
          detail.details2.additionalCessPerc = 0;
        }

        // VAT compatibility variable (sum of GST components)
        Vat = round(CGST + SGST + IGST + Cess + AddnlCess, 4);

        let NetAmount = NetValue + CGST + SGST + IGST + Cess + AddnlCess;
        NetAmount = round(NetAmount, 4);

        // Map many fields back to detail
        detail.netValue = getFormattedValueIgnoreRoundingToNumber(NetValue);
        detail.discPerc = getFormattedValueIgnoreRoundingToNumber(DiscPerc);
        detail.discount = getFormattedValueIgnoreRoundingToNumber(Disc);
        detail.unitDiscount = getFormattedValueIgnoreRoundingToNumber(round(UnitDiscount, 5));
        detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(Vat);
        detail.gross = getFormattedValueIgnoreRoundingToNumber(Gross);
        detail.total = NetAmount;

        if (master.voucherType == VoucherType.SalesInvoice) {
          detail.cost = Qty !== 0 ? (NetValue / Qty) : 0;
        } else {

          detail.cost = Qty !== 0 ? (NetAmount / Qty) : 0;
        }

        // Profit
        //not need for SQ global- not added condition because already not have that column
        if (![VoucherType.GoodsDeliveryNote, VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn, VoucherType.ServiceInventory].includes(master.voucherType as any)) {
          const purchasePrice = Number(detail.purchasePrice ?? detail.purchaseRate ?? 0);
          const Profit = NetValue - (Qty * purchasePrice);
          if ([VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(master.voucherType as VoucherType)) {
            detail.profit = -1 * Profit;
          } else {
            detail.profit = Profit;
          }
        }
      }

      // ---------- Final profit percentage (common) ----------
      const costForPerc = Number(detail.purchasePrice ?? detail.purchaseRate ?? 0);
      if (costForPerc > 0 && Qty > 0) {
        detail.profitPercentage = ((detail.profit ?? 0) / (costForPerc * Qty)) * 100;
      } else {
        detail.profitPercentage = 0;
      }

      // ---------- Final formatting/rounding ----------
      detail.gross = getFormattedValueIgnoreRoundingToNumber(round(Gross, 4));
      detail.netValue = getFormattedValueIgnoreRoundingToNumber(round(Number(detail.netValue ?? 0), 4));
      detail.total = round(Number(detail.total ?? (Number(detail.netValue ?? 0) + Number(detail.vatAmount ?? 0))), 4);
      detail.unitDiscount = getFormattedValueIgnoreRoundingToNumber(round(UnitDiscount, 5));

      // Put result back
      result.transaction.details = [{ ...detail }];

      // Keep formState, calculateSummary, calculateTotal unchanged (per your request)
      if (!ignoreCalculateTotal && typeof rowIndex === "number" && rowIndex >= 0) {
        const details = [...formState.transaction.details];
        const current = { ...(formState.transaction.details[rowIndex] || {}) };
        const final = { ...current, ...detail };
        details[rowIndex] = final;

        const summaryRes = calculateSummary(details, formState, { result: {} });
        const totals = await calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
          formState.formElements,
          { result }
        );
        let _result = totals;
        _result.transaction = _result.transaction ?? {};
        _result.summary = summaryRes.summary;
        _result.transaction.details = [{ ...detail, slNo: current.slNo }];
        result = _result;
      }

      if (commonParams.formStateHandleFieldChangeKeysOnly && dispatch) {
        dispatch(
          commonParams.formStateHandleFieldChangeKeysOnly({
            fields: result,
            updateOnlyGivenDetailsColumns: true,
          })
        );
      }
    } catch (error) {
      console.error("calculateRowAmount error:", error);
    } finally {
      return result;
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

      if (!result) {
        result = {};
      }
      if (!result.summary) {
        result.summary = {};
      }
      const summaryConfig = formState.summaryConfig;

      summaryConfig.forEach((config) => {
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

  const refactorDetails = async (
    _details: any[],
    formType: string,
    voucherType: string,
    commonParams: CommonParams,
    loadType?: string
  ): Promise<TransactionDetail[]> => {
    const detailsLength = _details.length;
    let details = [..._details];
    let validDetailsCount = 0;
    for (let i = 0; i < detailsLength; i++) {
      const row = details[i];
      let detail: TransactionDetail = { ...(details[i] || {}) };
      if (isNullOrUndefinedOrZero(detail.productID)) {
        break;
      }
      // if (clientSession.isAppGlobal) {
      //   if (voucherType != VoucherType.SaleReturnEstimate && formType != "" || [VoucherType.SalesInvoice, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(voucherType as any)) {
      //     if (detail.details2) {
      //       if (formType.toUpperCase() == "INTERSTATE" || formType.toUpperCase() == "INT" && loadType != "") {
      //         detail.details2.cessPerc = row.cessPerc;
      //         detail.details2.cessAmt = row.cessAmt;
      //         //IGST calculation
      //         const CGSTPerc = row.cgstPerc ?? 0;
      //         const CGST = row.cgst ?? 0;
      //         const SGSTPerc = row.sgstPerc ?? 0;
      //         const SGST = row.sgst ?? 0;
      //         const IGSTPerc = row.igstPerc ?? 0;
      //         const IGST = row.igst ?? 0;
      //         const totalTaxPerc = CGSTPerc + SGSTPerc + IGSTPerc;
      //         const totalTax = CGST + SGST + IGST;
      //         detail.details2.igstPerc = totalTaxPerc;
      //         detail.details2.igst = totalTax;
      //         detail.details2.additionalCessPerc = row.additionalCessPerc;
      //         detail.details2.additionalCess = row.additionalCess;
      //         detail.details2.cgstPerc = 0;
      //         detail.details2.cgst = 0;
      //         detail.details2.sgstPerc = 0;
      //         detail.details2.sgst = 0;
      //       } else {
      //         detail.hsnCode = row.hsnCode;
      //         detail.details2.cessPerc = row.cessPerc;
      //         detail.details2.cessAmt = row.cessAmt;
      //         detail.details2.cgstPerc = row.cgstPerc;
      //         detail.details2.cgst = row.cgst;
      //         detail.details2.sgstPerc = row.sgstPerc;
      //         detail.details2.sgst = row.sgst;
      //         detail.details2.igstPerc = row.igstPerc;
      //         detail.details2.igst = row.igst;
      //         detail.details2.additionalCessPerc = row.additionalCessPerc;
      //         detail.details2.additionalCess = row.additionalCess;
      //       }
      //     } 
      //     detail.mrp = row.mrp;
      //     //customerType is always ""
      //     // if(customerType.toUpperCase() == "INT" &&loadType == "SI"){} 
      //   }
      // }
      validDetailsCount++;
      // Set row header/index
      detail.slNo = generateUniqueKey();
      if ([VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation, VoucherType.GoodsDeliveryNote, VoucherType.ServiceInvoice].includes(voucherType as any)) {
        detail.adjQty = row.adjQty;
      }
      detail.pCode = row.productCode;
      // detail.productBatchID = row.productBatchID;
      detail.barCode = row.autoBarcode;
      detail.product = row.productName;
      // detail.productID = row.productID;
      // detail.brandID = row.brandID;
      detail.brand = row.brandName;
      detail.arabicName = row.itemNameInSecondLanguage;
      detail.free = round(Number(row.free || 0), 4);
      if (loadType == "SO") {
        detail.isQtyFreezed = Number(row.qtyOut | 0) > 0;
      }
      detail.qty = round(Number(row.quantity || 0), 4);
      detail.qtyTag = row.quantity;
      detail.nosQty = row.qtyInNumbers;
      detail.stickerQty = Number(row.barcodeQty || 0);
      detail.stock = row.stock;
      detail.unit = row.unitName;
      detail.unitID = row.unitID;
      detail.purchasePrice = voucherType == VoucherType.SalesInvoice ? getFormattedValueIgnoreRoundingToNumber(
        Number(row.costPerItem || 0)
      ) : row.costPerItem;
      detail.batchNo = row.batchNo;
      detail.warehouseID = row.warehouseID;
      detail.warehouseName = row.warehouse;
      if (voucherType == VoucherType.SalesInvoice) {
        if (loadType != "" && Number(row.multiFactor || 0) > 0) {
          detail.purchasePrice = Number(row.multiFactor) * Number(row.stdSalesPrice);
          detail.boxQty = Number(row.multiFactor);
        }
        else {
          detail.boxQty = Number(row.multiFactor || 0);
        }
      }
      if (voucherType == VoucherType.ServiceInvoice) {
        detail.unitPrice = row.unitPrice
        detail.netValue = row.netValue;
        detail.total = row.netAmount;
        detail.gross = row.grossValue
        detail.discount = row.discountAmt1;
        if (!clientSession.isAppGlobal) {
          detail.vatAmount = row.totalVatAmount;
        }
      } else {
        detail.unitPrice = getFormattedValueIgnoreRoundingToNumber(
          Number(row.unitPrice || 0)
        );
        detail.netValue = getFormattedValueIgnoreRoundingToNumber(
          Number(row.netValue || 0)
        );
        detail.total = getFormattedValueIgnoreRoundingToNumber(
          Number(row.netAmount || 0)
        );
        detail.gross = getFormattedValueIgnoreRoundingToNumber(
          Number(row.grossValue || 0)
        );
        detail.discount = getFormattedValueIgnoreRoundingToNumber(
          Number(row.discountAmt1 || 0)
        );
        if (!clientSession.isAppGlobal) {
          detail.vatAmount = getFormattedValueIgnoreRoundingToNumber(
            Number(row.totalVatAmount || 0)
          );
        }
      }
      //global
      if (voucherType == VoucherType.SalesInvoice && clientSession.isAppGlobal) {
        if (applicationSettings?.inventorySettings?.setMagininSales) {
          detail.margin = getFormattedValueIgnoreRoundingToNumber(
            Number(row.marginPer || 0));
          detail.purchaseCost = getFormattedValueIgnoreRoundingToNumber(
            Number(row.lastPurchaseCost || 0));
        }
        detail.manualBarcode = row.mannualBarcode;
        detail.colour = row.color;
      }
      if ([VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any) && clientSession.isAppGlobal) {
        detail.colour = row.color;
        detail.taxCategoryID = row.taxCategoryID;
        detail.productCategoryID = row.productCategoryID;
        detail.invTransactionDetailID = row.invTransactionDetailID;
      }
      detail.discPerc = [VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(voucherType as any) ? getFormattedValueIgnoreRoundingToNumber(
        Number(row.discountPer1 || 0)
      ) : row.discountPer1;

      detail.unitDiscount = getFormattedValueIgnoreRoundingToNumber(
        Number(row.discountAmt1 || 0)
      );
      if (!clientSession.isAppGlobal) {
        detail.vatPerc = voucherType == VoucherType.SalesInvoice ? getFormattedValueIgnoreRoundingToNumber(
          Number(row.vatPercentage || 0)
        ) : row.vatPercentage;
        detail.cstPerc = voucherType == VoucherType.SalesInvoice ? getFormattedValueIgnoreRoundingToNumber(
          Number(row.cstPerc || 0)
        ) : row.cstPerc;
        detail.cst = voucherType == VoucherType.SalesInvoice ? getFormattedValueIgnoreRoundingToNumber(
          Number(row.cst || 0)
        ) : row.cst;
      }

      detail.ratePlusTax = [VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any) && clientSession.isAppGlobal
        ? row.rateWithTax
        : [VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(voucherType as any) && !clientSession.isAppGlobal ?
          row.rateWithTax
          : [VoucherType.SalesReturn, VoucherType.ServiceInvoice].includes(voucherType as any)
            ? Math.round((Number(row.unitPrice) * (1 + Number(row.vatPercentage) / 100)) * 100) / 100
            : getFormattedValueIgnoreRoundingToNumber(Number(row.rateWithTax || 0));
      detail.productDescription = row.productDescription;
      detail.actualSalesPrice = row.transMRP;
      detail.memo = row.memo;
      detail.barcodePrinted = true;
      detail.batchCreated = true;

      if (userSession.dbIdValue == "543140180640" && voucherType == VoucherType.SalesInvoice) {
        detail.nLA_StdSalesPrice = row.valuationPrice
      }
      if (voucherType == VoucherType.SalesInvoice) {
        detail.minSalePrice = row.minSalePrice;
      }
      if ([VoucherType.SalesInvoice, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(voucherType as any)) {
        if (row.productPriceCategoryMSP > 0) {
          detail.minSalePrice = row.productPriceCategoryMSP;
        } else if (Number(row.MinSalePrice || 0) > 0) {
          detail.minSalePrice = row.productStandardUnitMSP;
        }
      }
      if (userSession.dbIdValue === "MALABAR_RIYADH" && loadType === "GD" && voucherType == VoucherType.SalesInvoice && !clientSession.isAppGlobal) {
        try {
          detail.minSalePrice = getFormattedValueIgnoreRoundingToNumber(
            Number(row.modelNo || 0)
          );
        } catch { }
      }
      if (voucherType == VoucherType.GoodsDeliveryNote && !clientSession.isAppGlobal && userSession.dbIdValue == "MALABAR_RIYADH" && loadType === "SQ") {
        detail.minSalePrice = row.modelNo;
      }
      detail.profit = Number(row.totalProfit || 0);

      if (formState.gridColumns?.find(
        (x) => x.dataField == "profitPercentage"
      )?.visible == true && voucherType == VoucherType.SalesInvoice && !clientSession.isAppGlobal) {
        const purchasePrice = Number(detail.purchasePrice || 0);
        const qty = Number(detail.qty || 0);

        let profitPerc = 0;
        if (purchasePrice > 0 && qty > 0) {
          profitPerc = (detail.profit / (purchasePrice * qty)) * 100;
        }

        detail.profitPercentage = profitPerc;
      }


      // detail.removeCol = "Remove";
      detail.image = "Show";

      detail.flavors = row.Color ?? "";
      detail.brand = row.brandName ?? "";
      detail.brandID = Number(row.brandID || 0);

      detail.itemType = row.ItemType ?? "";
      detail.smCode = row?.employeeCode ?? "";
      detail.salesman = row?.employeeName ?? "";
      detail.salesmanID = row.salesManID;

      if (voucherType == VoucherType.SalesInvoice && clientSession.isAppGlobal) {
        detail.gatePass = row.specification ?? "";
      } else if ([VoucherType.SalesInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(voucherType as any)) {
        detail.size = row.specification ?? "";
      }

      if ([VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn].includes(voucherType as any)) {
        detail.supplierReferenceProductCode = row.supplierReferenceProductCode;
      }


      // Store original cost for restoration after calculation
      const originalCost = detail.cost;

      // Calculate row amounts
      const res = await calculateRowAmount(
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
    allowStockUpdate: boolean
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
      outputRow.actualPrice = detail.actualSalesPrice;

      // Pricing and transaction details
      outputRow.unitPrice = detail.unitPrice;
      outputRow.transDate = transDate;
      outputRow.unitID = detail.unitID;
      outputRow.SalesManID = detail.SalesManID > 0 ? detail.SalesManID : formState.transaction.master.employeeID;

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

      // Date handling
      outputRow.mfgDate = detail.mfdDate == "" ? null : detail.mfdDate;
      outputRow.mfdDate = detail.mfdDate == "" ? null : detail.mfdDate;
      outputRow.expiryDate = detail.expDate == "" ? null : detail.expDate;
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
      salesManID: formState.transaction.master.employeeID,
      voucherPrefix: formState.transaction.master.voucherPrefix || "",
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
    if ([VoucherType.SalesReturn, VoucherType.SaleReturnEstimate].includes(formState.transaction.master.voucherType as any)) {
      master.cashReturned = master.cashReceived;
    }
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
  async function applySpecialSpriceExactQtyLimitReached(
    qtyLimit: number,
    baseRow: TransactionDetail,
    slNo: string,
    chkShowRateBeforeTax: boolean,
    SpecialSchemePrice: number
  ): Promise<any> {
    try {
      let totalQty = 0;

      if (!baseRow) return false;
      const rowIndex = formState.transaction.details.findIndex(
        (d) => d.slNo === slNo
      );
      if (rowIndex === -1) return false;
      const productBatchID = Number(baseRow.productBatchID || 0);
      const unitID = Number(baseRow.unitID || 0);

      // ----------------------------
      // 1. Calculate total qty (only unprocessed scheme rows)
      // ----------------------------
      for (let i = 0; i <= rowIndex; i++) {
        let row = formState.transaction.details[i];
        if (!row) continue;

        if (row.slNo === slNo) { row = merge({}, row, baseRow); }

        if (
          Number(row.productBatchID || 0) === productBatchID &&
          Number(row.unitID || 0) === unitID &&
          row.isSchemeProcessed === "N"
        ) {
          totalQty += Number(row.qty || 0);
        }
      }

      // ----------------------------
      // 2. Apply scheme ONLY if qty == limit
      // ----------------------------
      if (totalQty === qtyLimit) {

        let _outRow: DeepPartial<TransactionDetail> = {};
        const taxPerc = Number(baseRow.vatPerc || 0);
        let hascurrentRowProcessed = false;
        for (let i = 0; i <= rowIndex; i++) {
          let row = formState.transaction.details[i];
          let outRow: DeepPartial<TransactionDetail> = { slNo: row.slNo };
          if (!row) continue;

          if (row.slNo === slNo) { row = merge({}, row, baseRow); }

          if (
            Number(row.productBatchID || 0) === productBatchID &&
            Number(row.unitID || 0) === unitID &&
            row.isSchemeProcessed === "N"
          ) {
            // Set scheme price
            outRow.unitPrice = SpecialSchemePrice;
            outRow.ratePlusTax = SpecialSchemePrice;

            // Handle rate-before-tax logic
            if (
              taxPerc > 0 &&
              chkShowRateBeforeTax &&
              i !== rowIndex
            ) {
              const uRate =
                Number(outRow.unitPrice || 0) / (1 + taxPerc / 100);
              outRow.unitPrice = round(uRate);
            }

            outRow.isSchemeProcessed = "Y";

            // Recalculate row
            if (row.slNo !== slNo) {
              const outRowd = await calculateRowAmount(
                row,
                "qty",
                { result: { transaction: { details: [outRow] } } },
                true,
                i
              );
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {
                    transaction: {
                      details: [outRowd.transaction!.details![0]],
                    },
                  },
                })
              );

            } else {
              _outRow = outRow;
              hascurrentRowProcessed = true;
            }
          }

        }
        if (hascurrentRowProcessed) {
          return _outRow;
        }
        return null
      }
      return null
    } catch {
      return null
    }

    return false;
  }
  async function applyQtyDiscount(
    qtyLimit: number,
    baseRow: TransactionDetail,
    slNo: string,
    freeQty: number,
  ): Promise<any> {
    try {
      let totalQty = 0;
      debugger;
      if (!baseRow) return false;
      const rowIndex = formState.transaction.details.findIndex(
        (d) => d.slNo === slNo
      );
      if (rowIndex === -1) return false;
      const productBatchID = Number(baseRow.productBatchID || 0);
      const unitID = Number(baseRow.unitID || 0);

      // ----------------------------
      // 1. Calculate total qty (only unprocessed scheme rows)
      // ----------------------------
      for (let i = 0; i <= rowIndex; i++) {

        let row = formState.transaction.details[i];
        if (row.slNo === slNo) { row = merge({}, row, baseRow); }
        if (!row) continue;

        if (
          Number(row.productBatchID || 0) === productBatchID &&
          Number(row.unitID || 0) === unitID &&
          row.isSchemeProcessed === "N"
        ) {
          totalQty += Number(row.slNo === slNo ? baseRow.qty : row.qty || 0);
        }
      }

      // ----------------------------
      // 2. Apply scheme ONLY if qty == limit
      // ----------------------------
      if (totalQty > qtyLimit) {


        let _outRow: DeepPartial<TransactionDetail> = {};

        debugger;
        let hascurrentRowProcessed = false;
        for (let i = 0; i <= rowIndex; i++) {
          let row = formState.transaction.details[i];
          if (row.slNo === slNo) { row = merge({}, row, baseRow); }
          let outRow: DeepPartial<TransactionDetail> = { slNo: row.slNo };
          if (!row) continue;



          if (
            Number(row.productBatchID || 0) === productBatchID &&
            Number(row.unitID || 0) === unitID &&
            row.isSchemeProcessed === "N"
          ) {


            outRow.isSchemeProcessed = "Y";

            // Recalculate row
            if (row.slNo !== slNo) {
              const outRowd = await calculateRowAmount(
                row,
                "qty",
                { result: { transaction: { details: [outRow] } } },
                true,
                i
              );
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: {
                    transaction: {
                      details: [outRowd.transaction!.details![0]],
                    },
                  },
                })
              );

            } else {
              hascurrentRowProcessed = true;
              outRow.free = freeQty,
                outRow.qty = 0
              _outRow = outRow; debugger;
            }
          }

        }
        debugger;
        if (hascurrentRowProcessed) {
          return _outRow
        }
        return null
      }
      return null
    } catch {
      return null
    }

    return false;
  }

  function checkSpecialSpriceLimitReached(
    qtyLimit: number,
    rowIndex: number,
    details: TransactionDetail[]
  ): boolean {
    try {
      let totalQty = 0;

      const row = details[rowIndex];
      if (!row) return false;

      const productBatchID = Number(row.productBatchID || 0);
      const unitID = Number(row.unitID || 0);

      for (let i = 0; i <= rowIndex; i++) {
        const d = details[i];
        if (!d) continue;

        if (
          Number(d.productBatchID || 0) === productBatchID &&
          Number(d.unitID || 0) === unitID
        ) {
          totalQty += Number(d.qty || 0);
        }
      }

      return totalQty > qtyLimit;
    } catch {
      return false;
    }
  }
  const loadProductDetailsByAutoBarcode = async (
    data: LoadProductDetailsByAutoBarcodeProps,
    commonParams: CommonParams,
    proceedAll?: boolean,
    forImport?: boolean
  ): Promise<DeepPartial<TransactionFormState> | null> => {
    let { result } = commonParams;

    try {
      let detail = data.detail;
      let outDetail: DeepPartial<TransactionDetail> = {};

      outDetail.slNo = detail.slNo;
      outDetail.warehouseID = detail.warehouseID;
      outDetail.salesPrice = detail.salesPrice;
      outDetail.unitID = detail.unitID;
      outDetail.productBatchID = detail.productBatchID;
      if (!detail) {
        return {};
      }

      let warehouseId = 1;
      if (applicationSettings?.inventorySettings?.maintainWarehouse === true) {
        warehouseId = formState.transaction.master.fromWarehouseID;
      }
      if (applicationSettings?.productsSettings?.enableMultiWarehouseBilling) {
        const detailWarehouseId = outDetail.warehouseID;
        if (detailWarehouseId ?? 0 > 0) {
          warehouseId = detailWarehouseId ?? 0;
        }
      }
      const _lastSelectedWarehouseIDOfItemPopupsSearch = (async () => {
        try {
          const stored = await getStorageString(
            "lastSelectedWarehouseIDOfItemPopupsSearch"
          );
          return stored ? Number(stored) || 0 : 0;
        } catch (error) {
          console.warn("Failed to read from localStorage:", error);
          return 0;
        }
      })();
      const isStockDetailsVisible = formState.gridColumns?.find(
        (x) => x.dataField == "stockDetails"
      )?.visible
      let payload = {
        useProductCode: data.useProductCode,
        productCode: data.productCode,
        barCode: data.autoBarcode,
        wareHouseId: warehouseId,
        txtData: data.searchText,
        partyId: formState.transaction.master.ledgerID,
        isUnitDetailsRequired: true,
        isCheckUseSupplierProductCode:
          formState.userConfig?.useSupplierProductCode,
        isActualPriceVisible: formState.gridColumns?.find(
          (x) => x.dataField == "actualSalesPrice"
        )?.visible,
        isStockDetailsVisible: isStockDetailsVisible,
        lastSelectedWareHouseIdOfItemPopUpsSearch:
          await _lastSelectedWarehouseIDOfItemPopupsSearch,
        priceCategoryId: formState.transaction.master.priceCategoryID,
        isPrintGatepassChecked: formState.userConfig?.gatePass,
        lsAlowExcessCashReceipt: formState.userConfig?.allowExcessCashReceipt,
        lsBlockZeroFigureEntry: formState.userConfig?.blockZeroFigureEntry,
        lsBlockNonStockItemInSO: formState.userConfig?.blockNonStockItemsSO,

      };
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value as any);
        }
      });

      const res: DataAutoBarcode = await api.getAsync(
        `${Urls.inv_transaction_base
        }${transactionType}/LoadProductDetailsByAutoBarCode?${queryParams.toString()}`
      );

      warehouseId = -1;

      if (applicationSettings?.productsSettings?.enableMultiWarehouseBilling) {
        warehouseId = 0;
      }

      if (res?.isShowItemPopUp && forImport != true) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              formElements: {
                productSearchPopupWindow: {
                  visible: true,
                  data: {
                    searchColumn: data.searchColumn,
                    rowIndex: data.rowIndex,
                    searchCriteria: data.useProductCode ? "pCode" : "product",
                    searchText: data.searchText,
                    voucherType: formState.transaction.master.voucherType,
                    warehouseId: warehouseId,
                  },
                },
              },
            },
          })
        );
      } else if (res?.products?.length === 1) {

        let product = res.products[0];
        product.productName = product.productName.replace(/^\s+/, (m) =>
          "\u00A0".repeat(m.length)
        );
        const _index =
          forImport != true
            ? formState.transaction.details.findIndex(
              (x) =>
                x.barCode == product.autoBarcode &&
                x.productID > 0 &&
                x.slNo != detail.slNo
            )
            : -1;
        if (
          product.autoBarcode != "" &&
          _index > -1 &&
          formState.userConfig?.duplicationMessage
        ) {
          const confirm = await ERPAlert.show({
            icon: "info",
            title: t("warning"),
            text: t("item_already_selected", { row: _index + 1 }),
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            showCancelButton: true,
            onCancel: () => {
              return false;
            },
          });
          if (confirm) {
            let pld: DeepPartial<TransactionFormState> = {
              transaction: {
                details: [
                  { ...initialTransactionDetailData, slNo: detail.slNo },
                ],
              },
            };
            const res = focusColumn(_index, "qty");
            if (res) {
              pld.currentCell = {
                ...res,
                data: formState.transaction.details[_index],
                reCenterRow: false,
              };
            }
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: pld,
                updateOnlyGivenDetailsColumns: false,
                rowIndex: data.rowIndex,
              })
            );

            return {};
          } else {
          }
        }
        const voucherType = formState.transaction.master.voucherType;

        const isSI = voucherType === VoucherType.SalesInvoice;
        const isSR = voucherType === VoucherType.SalesReturn;
        const isSO = voucherType === VoucherType.SalesOrder;

        /* ---------------- BASIC PRODUCT INFO ---------------- */
        outDetail.pCode = product.productCode;
        outDetail.product = product.productName;
        outDetail.productID = product.productID;
        outDetail.barCode = product.autoBarcode;
        outDetail.manualBarcode = product.mannualBarcode;
        outDetail.productBatchID = product.productBatchID;
        outDetail.batchNo = product.batchNo;

        outDetail.unit = product.unitName;
        outDetail.unitID = product.basicUnitID;

        outDetail.brand = product.brandName;
        outDetail.brandID = product.brandID;

        outDetail.arabicName = product.itemNameinSecondLanguage;
        outDetail.location = product.location;
        outDetail.itemType = product.itemType;

        outDetail.size = product.specification;
        outDetail.stockDetails = product.stockDetails;
        outDetail.purchasePrice = product.stdPurchasePrice;
        outDetail.minSalePrice = product.minSalePrice;
        outDetail.productDescription = product.serialNumber;
        outDetail.image = "Show";

        /* ---------------- DEFAULT QTY ---------------- */
        if (applicationSettings?.productsSettings?.setDefaultQty1) {
          outDetail.qty = detail.qty || 1;
        }

        if (product.weighingQty && product.weighingQty > 0) {
          outDetail.qty = product.weighingQty;
        }

        /* ---------------- MULTI UNIT / BARCODE ---------------- */
        let multiFactor = product.multiFactor ?? 1;

        if (product.isUnit2BarCode) {
          outDetail.unit = product.unit2;
          outDetail.unitID = product.unit2ID;
          outDetail.unitPrice = product.unit2SalesPrice || 0;
        }

        if (product.isUnit3BarCode) {
          outDetail.unit = product.unit3;
          outDetail.unitID = product.unit3ID;
          outDetail.unitPrice = product.unit3SalesPrice || 0;
        }

        if (
          product.isMultiUnitBarCode &&
          Number(product.unitSPrice || 0) > 0
        ) {
          outDetail.unitPrice = product.unitSPrice;
        }

        /* ---------------- FALLBACK SALES PRICE ---------------- */
        if ((!outDetail.unitPrice || outDetail.unitPrice === 0) && product.stdSalesPrice > 0) {
          outDetail.unitPrice = product.stdSalesPrice;
        }
        if (
          applicationSettings?.productsSettings?.enableMultiWarehouseBilling &&
          userSession.dbIdValue === "SAMAPLASTICS"
        ) {
          try {
            const sd = await getApLocalData("Warehouses");
            outDetail.warehouseName = sd && sd.length > 0 ? sd.find((x) => x.id === formState.transaction.master.fromWarehouseID)?.name : "";
            outDetail.warehouseID = formState.transaction.master.fromWarehouseID;
            outDetail.warehouseID = formState.transaction.master.fromWarehouseID;
          } catch (err) {
            // intentionally ignored (same as C#)
          }
        }
        /* ---------------- MULTI FACTOR PRICE ADJUST ---------------- */
        if (multiFactor > 0) {
          // outDetail.unitPrice = round(outDetail.unitPrice * multiFactor);
          // outDetail.purchasePrice = round(product.stdPurchasePrice * multiFactor);
          outDetail.minSalePrice = round(product.minSalePrice * multiFactor);
          // outDetail.boxQty = multiFactor;
        }
        outDetail.boxQty = multiFactor;
        outDetail.stock = round(product.stock);

        if (isStockDetailsVisible) {
          outDetail.stockDetails = product.stockDetails;
        }


        // -----------------------------
        // UNIT 2 BARCODE
        // -----------------------------
        if (product.isUnit2BarCode) {
          if (Number(product.unit2SalesPrice || 0) === 0) {
            if (multiFactor > 0) {
              const salePrice = Number(product.stdSalesPrice || 0);
              const purchasePrice = Number(product.stdPurchasePrice || 0);

              outDetail.unitPrice = salePrice * multiFactor;
              outDetail.purchasePrice = purchasePrice * multiFactor;
              outDetail.boxQty = multiFactor;
            }
          }
        }

        // -----------------------------
        // UNIT 3 BARCODE
        // -----------------------------
        else if (product.isUnit3BarCode) {
          if (Number(product.unit3SalesPrice || 0) === 0) {
            if (multiFactor > 0) {
              const salePrice = Number(product.stdSalesPrice || 0);
              const purchasePrice = Number(product.stdPurchasePrice || 0);

              outDetail.unitPrice = salePrice * multiFactor;
              outDetail.purchasePrice = purchasePrice * multiFactor;
              outDetail.boxQty = multiFactor;
            }
          }
        }

        // -----------------------------
        // NORMAL / MULTI UNIT BARCODE
        // -----------------------------
        else {
          // Multi-unit barcode with special price
          if (product.isMultiUnitBarCode && Number(product.unitSPrice || 0) > 0) {
            outDetail.unitPrice = Number(product.unitSPrice || 0);
          }
          // Multi-factor calculation
          else if (multiFactor > 0) {
            const salePrice = Number(product.stdSalesPrice || 0);
            const purchasePrice = Number(product.stdPurchasePrice || 0);

            outDetail.unitPrice = salePrice * multiFactor;
            outDetail.purchasePrice = purchasePrice * multiFactor;

            // DB-specific logic
            if (userSession.dbIdValue === "543140180640") {
              outDetail.nLA_StdSalesPrice = salePrice * multiFactor;
            }

            outDetail.boxQty = multiFactor;
          }
          // Default price
          else {
            outDetail.unitPrice = Number(product.stdSalesPrice || 0);

            if (userSession.dbIdValue === "543140180640") {
              outDetail.nLA_StdSalesPrice = Number(product.stdSalesPrice || 0);
            }
          }
        }

        // -----------------------------
        // APPLY MULTI FACTOR (COMMON)
        // -----------------------------
        if (multiFactor > 0) {
          const minSalePrice = Number(product.minSalePrice || 0);
          const purchasePrice = Number(product.stdPurchasePrice || 0);

          outDetail.purchasePrice = purchasePrice * multiFactor;
          outDetail.minSalePrice = minSalePrice * multiFactor;
          outDetail.boxQty = multiFactor;
        }
        if (
          Number(product.defSalesUnitID || 0) > 0 &&
          !product.isMultiUnitBarCode &&
          !product.isUnit2BarCode &&
          !product.isUnit3BarCode &&
          !product.isMannualBarCode &&
          Number(product.basicUnitID) !== Number(product.defSalesUnitID)
        ) {
          try {

            if (!isNullOrUndefinedOrEmpty(product.defUnitName)) {
              outDetail.unit = product.unitName;
            }
            if ((product.defUnitSPrice ?? 0) > 0) {
              outDetail.unitPrice = round(Number(product.defUnitSPrice));
            } else {
              if (multiFactor > 0) {

                // Number(product.minSalePrice || 0) * multiFactor;

                outDetail.unitPrice =
                  round(product.stdSalesPrice || 0) * multiFactor;
              }


            }


            // Assign default sales unit
            outDetail.unitID = product.defSalesUnitID;

            if (multiFactor > 0) {
              outDetail.minSalePrice =
                Number(product.minSalePrice || 0) * multiFactor;

              outDetail.purchasePrice =
                Number(product.stdPurchasePrice || 0) * multiFactor;

              outDetail.boxQty = multiFactor;
            }
          } catch (err) {
            // same as C#: swallow exception
          }
        }


        /* ---------------- VAT / GST ---------------- */
        if (clientSession.isAppGlobal) {
          if (!outDetail.details2) {
            outDetail.details2 = { ...initialTransactionDetails2 };
          }
          const voucherForm = formState.transaction.master.voucherForm?.toLowerCase();
          if (
            voucherForm === "interstate" ||
            voucherForm === "int" ||
            voucherForm === "import"
          ) {
            outDetail.details2!.igstPerc = product.s_IGSTPerc;
            outDetail.details2!.additionalCessPerc = product.s_AdditionalCessPerc || 0;
            outDetail.details2!.sgstPerc = 0;
            outDetail.details2!.cgstPerc = 0;
          } else {
            outDetail.details2!.sgstPerc = product.s_CGSTPerc;
            outDetail.details2!.cgstPerc = product.s_CGSTPerc;
            outDetail.details2!.cessPerc = product.s_CessPerc;
            outDetail.details2!.additionalCessPerc = product.s_AdditionalCessPerc;
            outDetail.details2!.igstPerc = 0;
          }


        } else {
          if (userSession.dbIdValue === "543140180640") {
            // NAHLA
            outDetail.vatPerc = product.sVatPerc;
          } else {
            if (
              ((["SI", "SR"].includes(formState.transaction.master.voucherType)) && (
                formState.transaction.master.voucherForm === "VAT" ||
                formState.initialFormType === "VAT"
              )) || !["SI", "SR"].includes(formState.transaction.master.voucherType)
            ) {
              outDetail.vatPerc = product.sVatPerc;
              outDetail.cstPerc = product.salesExciseTaxPerc;
            } else {
              outDetail.vatPerc = 0;
            }
          }
        }


        /* ---------------- PRICE CATEGORY ---------------- */
        if (product.priceCategoryPrice == 0) {
          outDetail.discPerc = product.priceCategoryDiscPerc;
        }

        let priceWithoutScheme = Number(outDetail.unitPrice || 0);

        outDetail.actualSalesPrice = priceWithoutScheme;
        outDetail.schemeType = "";
        outDetail.schemeID = 0;

        /** ---------------- Price category ---------------- */
        if ((isSI || isSO) && product.priceCategoryPrice > 0) {
          outDetail.unitPrice = product.priceCategoryPrice;
          priceWithoutScheme = product.priceCategoryPrice;

          if (userSession.dbIdValue === "543140180640") {
            outDetail.nLA_StdSalesPrice = product.priceCategoryPrice;
          }

          if (applicationSettings.productsSettings.maintainSchemes) {

            outDetail.schemeType = product.schemeType;
            outDetail.schemeID = product.schemeID;
            if (product.schemeDiscount > 0) {
              outDetail.discPerc = product.schemeDiscount;
              outDetail.isSchemeItem = "S";
              outDetail.actualSalesPrice = priceWithoutScheme;
            }
          }
        }

        /** ---------------- Scheme logic ---------------- */
        // if (isSI&&applicationSettings.productsSettings.maintainSchemes) {
        //   let schemeApplied = false;

        //   if (product.schemeDiscount > 0) {
        //     outDetail.discPerc = product.schemeDiscount;
        //     outDetail.isSchemeItem = "S";
        //     schemeApplied = true;
        //   }

        //   /** ---- Special scheme price ---- */
        //   if (product.schemeDiscount === 0) {
        //     let loadSchemePrice = true;

        // if (product.schemeID > 0) {
        //       outDetail.schemeQtyLimit = product.schemeQtyLimit;
        //       outDetail.schemeFreeQty = product.schemeFreeQty;
        //       outDetail.schemeType = product.schemeType;
        //       outDetail.schemeID = product.schemeID;
        //       outDetail.isSchemeProcessed = "N";
        //     } else {

        //         outDetail.schemeQtyLimit = 0;
        //         outDetail.schemeFreeQty = 0;
        //         outDetail.schemeType = "";
        //         outDetail.schemeID = 0;
        //     }

        //     if (
        //       outDetail.schemeType !== "Buy Exact N for off" &&
        //       (outDetail.schemeFreeQty ?? 0) === 0 &&
        //       (outDetail.schemeQtyLimit ?? 0) > 0
        //     ) {
        //       const reached = checkSpecialSpriceLimitReached(
        //         outDetail.schemeQtyLimit!,
        //         outDetail as any,
        //         formState.transaction.details.filter((x) => x.productID > 0)
        //       );
        //       if (reached) {
        //         loadSchemePrice = false;
        //         schemeApplied = true;
        //       }
        //     }

        //     if (
        //       loadSchemePrice &&
        //       outDetail.schemeType !== "Buy Exact N for off"
        //     ) {
        //       if (product.specialSchemePrice > 0) {
        //         outDetail.unitPrice = product.specialSchemePrice;
        //         outDetail.isSchemeItem = "S";
        //         outDetail.actualSalesPrice = priceWithoutScheme;
        //       }
        //     }



        //     /** ---- Qty based scheme ---- */
        //     if (!schemeApplied && product.specialSchemePrice == 0) {
        //       if (outDetail.schemeType === "Buy Exact N for off") {
        //         if ((outDetail.schemeQtyLimit ?? 0) > 0) {
        //           const dfg = await applySpecialSpriceExactQtyLimitReached(
        //             outDetail.schemeQtyLimit!,
        //             outDetail as TransactionDetail,
        //             outDetail.slNo!,
        //             formState.userConfig?.showRateBeforeTax || false,
        //             product.specialSchemePrice!
        //           );
        //           if (dfg !== null) {
        //             outDetail = merge({}, outDetail, dfg);
        //           }
        //         }
        //       } else {
        //           if (product.isCheckQtyLimit) {
        //             outDetail.schemeQtyLimit = product.schemeQtyLimit;
        //             outDetail.schemeFreeQty = product.schemeFreeQty;
        //             outDetail.isSchemeProcessed = "N";

        //             const dfg = await applyQtyDiscount(
        //             outDetail.schemeQtyLimit!,
        //             outDetail as TransactionDetail,
        //             outDetail.slNo!,
        //             product.schemeFreeQty
        //           );
        //           debugger;
        //           if (dfg !== null) {
        //             outDetail = merge({}, outDetail, dfg);
        //           }
        //             outDetail.isSchemeItem = "S";
        //           }
        //         }

        //     }
        //   }
        // }
        if (isSI && applicationSettings.productsSettings.maintainSchemes) {
          let schemeApplied = false;

          // Direct scheme discount
          if (product.schemeDiscount > 0) {
            outDetail.discPerc = product.schemeDiscount;
            outDetail.isSchemeItem = "S";
            schemeApplied = true;
          }

          // Special scheme price
          if (product.schemeDiscount === 0) {
            let loadSchemePrice = true;

            // Assign scheme details if exists
            if (product.schemeID > 0) {
              outDetail.schemeQtyLimit = product.schemeQtyLimit;
              outDetail.schemeFreeQty = product.schemeFreeQty;
              outDetail.schemeType = product.schemeType;
              outDetail.schemeID = product.schemeID;
              outDetail.isSchemeProcessed = "N";
            } else {
              outDetail.schemeQtyLimit = 0;
              outDetail.schemeFreeQty = 0;
              outDetail.schemeType = "";
              outDetail.schemeID = 0;
            }

            // Check special scheme quantity limits
            if (
              outDetail.schemeType !== "Buy Exact N for off" &&
              (outDetail.schemeFreeQty ?? 0) === 0 &&
              (outDetail.schemeQtyLimit ?? 0) > 0
            ) {
              const reached = checkSpecialSpriceLimitReached(
                outDetail.schemeQtyLimit!,
                outDetail as any,
                formState.transaction.details.filter((x) => x.productID > 0)
              );
              if (reached) {
                loadSchemePrice = false;
                schemeApplied = true;
              }
            }

            // Apply special scheme price if allowed
            if (loadSchemePrice && outDetail.schemeType !== "Buy Exact N for off") {
              if (product.specialSchemePrice > 0) {
                outDetail.unitPrice = product.specialSchemePrice;
                outDetail.isSchemeItem = "S";
                outDetail.actualSalesPrice = priceWithoutScheme;
              }
            }

            // Quantity-based schemes
            if (!schemeApplied && product.specialSchemePrice === 0) {
              // Buy Exact N for off
              if (outDetail.schemeType === "Buy Exact N for off" && (outDetail.schemeQtyLimit ?? 0) > 0) {
                const result = await applySpecialSpriceExactQtyLimitReached(
                  outDetail.schemeQtyLimit!,
                  outDetail as TransactionDetail,
                  outDetail.slNo!,
                  formState.userConfig?.showRateBeforeTax || false,
                  product.specialSchemePrice!
                );
                if (result !== null) {
                  outDetail = merge({}, outDetail, result);
                }
              }
              // Qty discount schemes
              else if (product.isCheckQtyLimit && (outDetail.schemeQtyLimit ?? 0) > 0) {
                const result = await applyQtyDiscount(
                  outDetail.schemeQtyLimit!,
                  outDetail as TransactionDetail,
                  outDetail.slNo!,
                  outDetail.schemeFreeQty!
                );
                if (result !== null) {
                  outDetail = merge({}, outDetail, result);
                }
                outDetail.isSchemeItem = "S";
              }
            }
          }
        }
        /** ---- Sales Return ---- */
        if (isSR && applicationSettings.productsSettings.maintainSchemes) {
          // Apply direct scheme discount
          if (product.schemeDiscount > 0) {
            outDetail.discPerc = product.schemeDiscount;
          }
          // Apply special scheme price
          else if (product.specialSchemePrice > 0) {
            outDetail.unitPrice = product.specialSchemePrice;
          }
          // Apply quantity-based scheme
          else if (product.isCheckQtyLimit && product.schemeQtyLimit > 0 && product.schemeFreeQty > 0) {
            outDetail.schemeQtyLimit = product.schemeQtyLimit;
            outDetail.schemeFreeQty = product.schemeFreeQty;
            outDetail.isSchemeProcessed = "N";

            const result = await applyQtyDiscount(
              product.schemeQtyLimit,
              outDetail as TransactionDetail,
              outDetail.slNo!,
              product.schemeFreeQty
            );

            if (result !== null) {
              outDetail = merge({}, outDetail, result);
            }
            outDetail.isSchemeItem = "S";
          }
        }

        /** ---------------- Customer last rate ---------------- */
        outDetail.ratePlusTax = round(outDetail.unitPrice || 0);
        outDetail.netConvert = "0.00";

        if (isSI && product.blnCustLastPriceLoaded && product.partyLastSalesRate > 0
        ) {

          if (formState.gridColumns?.find(x => x.dataField === "customer_LSP")?.visible) {
            outDetail.customer_LSP = product.partyLastSalesRate;
          } else {
            outDetail.unitPrice = product.partyLastSalesRate;
          }
        }
        else if (isSR && (product.lastSoldSerialWisePrice || 0 > 0)) {
          outDetail.unitPrice = product.lastSoldSerialWisePrice ?? 0;
        }

        if (product.weighingPrice > 0) {
          outDetail.unitPrice = product.weighingPrice;
          outDetail.ratePlusTax = product.weighingPrice;
        }
        /** ---------------- Tax / MRP inclusive ---------------- */
        let uRate = 0;
        let taxPerc = Number(outDetail.vatPerc || 0);

        // DBID check (same as C#)
        if (userSession.dbIdValue !== "543140180640") {
          // Draft mode / form type condition
          if (
            !(((["SI", "SR"].includes(formState.transaction.master.voucherType)) && (
              formState.transaction.master.voucherForm === "VAT" ||
              formState.initialFormType === "VAT"
            )) || !["SI", "SR"].includes(formState.transaction.master.voucherType))
          ) {
            taxPerc = 0;
            outDetail.vatPerc = 0;
          }

          // -------------------------------
          // Show rate INCLUDING tax
          // -------------------------------
          if (isSI && taxPerc > 0 && !formState.userConfig?.showRateBeforeTax) {
            const rateWithTax =
              Number(outDetail.unitPrice || 0) * (1 + taxPerc / 100);

            outDetail.ratePlusTax = round(rateWithTax);
          }

          // -------------------------------
          // Show rate INCLUDING tax (customer last price loaded)
          // -------------------------------
          else if (
            taxPerc > 0 &&
            formState.userConfig?.showRateBeforeTax &&
            product.blnCustLastPriceLoaded
          ) {
            const rateWithTax =
              Number(outDetail.unitPrice || 0) * (1 + taxPerc / 100);

            outDetail.ratePlusTax = round(rateWithTax);
          }

          if (!isSI) {
            outDetail.ratePlusTax = outDetail.unitPrice;
          }

          // -------------------------------
          // Show rate BEFORE tax
          // -------------------------------
          if (isSI &&
            taxPerc > 0 &&
            formState.userConfig?.showRateBeforeTax &&
            !product.blnCustLastPriceLoaded
          ) {
            uRate =
              Number(outDetail.ratePlusTax || 0) / (1 + taxPerc / 100);

            outDetail.unitPrice = round(uRate);
          }
        }

        let continueProcessing = false;
        // ------------------------------------
        // NORMAL FLOW (NO AUTO INCREMENT)
        // ------------------------------------
        if (
          !formState.userConfig?.qtyAfterBarcode &&
          !formState.userConfig?.autoIncrementQty
        ) {
          continueProcessing = true;
        }
        // ------------------------------------
        // AUTO INCREMENT FLOW
        // ------------------------------------


        if (isSI || isSO) {
          // allow auto increment flow
        } else {
          continueProcessing = true;
        }
        // else {
        //   let isWeighingScaleProduct = false;

        //   if ((product.weighingQty || 0) > 0 || (product.weighingPrice || 0) > 0) {
        //     isWeighingScaleProduct = true;
        //   }

        //   const firstFreeRow = details.length;

        //   if (
        //     formState.formElements.chkAutoIncrement.checked &&
        //     !isWeighingScaleProduct &&
        //     !detail.isSchemeProcessed
        //   ) {
        //     const serial = product.serialNumber || "";
        //     const autoBarcode = product.autoBarcode;
        //     const rowUnit = detail.unit;

        //     for (let i = 0; i < firstFreeRow; i++) {
        //       if (i === rowIndex) continue;

        //       const row = details[i];

        //       if (
        //         row.barCode === autoBarcode &&
        //         row.unit === rowUnit
        //       ) {
        //         // -------------------------------
        //         // CASE 1: NO SERIAL
        //         // -------------------------------
        //         if (serial === "") {
        //           const rIndex = rowIndex;
        //           let incrementValue = 1;

        //           if ((weighQty || 0) > 0) incrementValue = weighQty;

        //           row.qty = Number(row.qty || 0) + incrementValue;

        //           // Move row
        //           details.splice(rowIndex, 1);
        //           details.splice(i, 0, detail);

        //           await calculateRowAmount(i);
        //           reArrangeRowNumber(i, rIndex);

        //           focusCell(currentColumnIndex, rIndex);
        //           txtData.value = "";

        //           dispatchUpdate(details);
        //           return;
        //         }
        //         // -------------------------------
        //         // CASE 2: SERIAL EXISTS CHECK
        //         // -------------------------------
        //         else {
        //           const desc = row.productDescription || "";
        //           if (!desc.includes(serial)) {
        //             let incrementValue = 1;
        //             if ((weighQty || 0) > 0) incrementValue = weighQty;

        //             const rIndex = rowIndex;

        //             row.qty = Number(row.qty || 0) + incrementValue;
        //             row.productDescription = desc
        //               ? `${desc},${serial}`
        //               : serial;

        //             await calculateRowAmount(i);

        //             // Move row
        //             details.splice(rowIndex, 1);
        //             details.splice(i, 0, detail);

        //             reArrangeRowNumber(i, rIndex);
        //             focusCell(currentColumnIndex, rIndex);

        //             dispatchUpdate(details);
        //             return;
        //           } else {
        //             await ERPAlert.show({
        //               icon: "warning",
        //               title: "Duplicate Serial",
        //               text: `Serial exists in Row: ${i + 1}`,
        //               confirmButtonText: "OK",
        //             });

        //             details.splice(rowIndex, 1);
        //             txtData.value = "";

        //             dispatchUpdate(details);
        //             return;
        //           }
        //         }
        //       }
        //     }
        //   }

        //   // Restore NLA sales price
        //   detail.nlaSalesPrice = nlaStdsalesPrice;

        //   // ------------------------------------
        //   // NEXT COLUMN NAVIGATION
        //   // ------------------------------------
        //   let nextCol = getNextVisibleColumn(
        //     "R",
        //     productColumnIndex
        //   );

        //   if (
        //     Number(detail.unitPrice || 0) > 0 &&
        //     formState.formElements.chkAutoIncrement.checked
        //   ) {
        //     nextCol = -1;
        //   }

        //   if (nextCol !== -1) {
        //     focusCell(nextCol, rowIndex);
        //   } else {
        //     if (Number(detail.unitPrice || 0) > 0) {
        //       focusCell(
        //         firstVisibleWritableColumnIndex,
        //         details.length
        //       );
        //     } else {
        //       focusCell(unitPriceColumnIndex, rowIndex);
        //     }
        //   }

        //   dispatchUpdate(details);
        // }


        if (!result.transaction) {
          result.transaction = {};
        }
        result.transaction.details = [outDetail];

        // Update UI state for button enabling
        result.formElements = {
          ...result.formElements,
          btnSave: {
            disabled:
              !hasRight(formState.userRightsFormCode, UserAction.Add) ||
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
          btnEdit: {
            disabled:
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
          btnDelete: {
            disabled:
              applicationSettings?.branchSettings
                ?.maintainInventoryTransactionsEntry == false,
          },
        };
        if (proceedAll) {
          const latestData = outDetail;

          let _res = await calculateRowAmount(
            latestData as TransactionDetail,
            "pCode",
            { result: { transaction: { details: [latestData] } } },
            true
          );
          let currentDetails = [
            ...formState.transaction.details.filter(
              (x) => x.productID > 0 || x.slNo == latestData.slNo
            ),
          ];
          let final =
            _res?.transaction?.details != undefined &&
              _res?.transaction?.details.length > 0
              ? (_res?.transaction
                ?.details[0] as DeepPartial<TransactionDetail>)
              : latestData;
          currentDetails[data.rowIndex] = final as TransactionDetail;
          const summaryRes = calculateSummary(currentDetails, formState, {
            result: {},
          });

          const totalRes = await calculateTotal(
            formState.transaction.master,
            summaryRes.summary as SummaryItems,
            {
              ...formState.formElements,
              ...result.formElements,
            } as FormElementsState,
            { result: {} }
          );
          result = {
            ...totalRes,
            summary: summaryRes.summary,
            showQuantityFactors: { visible: false, rowIndex: -1, qtyDesc: "" },
            transaction: {
              ...totalRes.transaction,
              details: [final],
            },
          };
        }
        if (product.units) {
          for (const unit of product.units) {
            if (!result.batchesUnits) {
              result.batchesUnits = [];
            }
            const exists = result.batchesUnits.some(
              (u) =>
                u.productBatchID === unit.productBatchID && u.value == unit.value
            );
            if (!exists) {
              result.batchesUnits.push(unit);
            }
          }
        }

        commonParams.formStateHandleFieldChangeKeysOnly &&
          dispatch &&
          dispatch(
            commonParams.formStateHandleFieldChangeKeysOnly({
              fields: result,
              updateOnlyGivenDetailsColumns: true,
            })
          );
        if (data.setFocusToNextColumn) {
          const res = focusToNextColumn(data.rowIndex, data.searchColumn, [
            "pCode",
            "product",
            "barCode",
          ]);
          setCurrentCell(
            res,
            result.transaction!.details[0] as TransactionDetail,
            false
          );
        }

        return result;
      } else if (res?.productId > 0 && forImport != true) {
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              batchGridShowKey: res?.productId,
            },
          })
        );
      } else if (forImport != true && data.searchColumn != "product") {
        const res = focusToNextColumn(data.rowIndex, data.searchColumn, [
          "pCode",
          "product",
          "barCode",
        ]);
        setCurrentCell(res, data.detail as TransactionDetail, false);
      }

      return result;
    } catch (err) {
      console.log(err);

      return result;
    }
  };
  const applyDiscountsToItems = async () => {
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
        for (let i = 0; i < details.length; i++) {
          const item = details[i];
          itemGross = item.gross ?? 0;
          grossPerc = (itemGross / totalGross) * 100;
          itemDisc = (billDisc * grossPerc) / 100;
          discPerc = round((itemDisc / itemGross) * 100, 5);

          const detail = { slNo: item.slNo, discPerc: discPerc };
          const updatedRow = await calculateRowAmount(
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

          details[i] = item;
        }

        const summaryRes = await calculateSummary(details, formState, {
          result: {},
        });
        let totalRes = await calculateTotal(
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
  function getTotalTaxable(taxPercentage: number): number {
    let totalTaxable = 0;

    try {
      const details = formState.transaction.details;

      for (let i = 0; i < details.length; i++) {
        const row = details[i];

        // Skip empty rows (similar to FirstFreeRow logic)
        if (!row) continue;

        // Match row with the given VatPerc
        if ((row.vatPerc ?? 0) === taxPercentage) {
          totalTaxable += (row.netValue ?? 0);
        }
      }
    } catch (err) {
      // silent catch like C#
    }

    return totalTaxable;
  }
  function getMaxTaxPercInItemList(): number {
    let maxTaxPerc = 0;

    try {
      const details = formState.transaction.details;

      for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row) continue;

        const vatPerc = Number(row.vatPerc ?? 0);

        if (vatPerc > maxTaxPerc) {
          maxTaxPerc = vatPerc;
        }
      }
    } catch (err) {
      // silent catch – same as C#
    }

    return maxTaxPerc;
  }
  function calculateTaxOnDiscount() {
    try {
      if (!applicationSettings.branchSettings.enableTaxOnBillDiscount) return;

      const decimalPoints = applicationSettings.mainSettings.decimalPoints;

      let oldTaxOnBillDisc = formState.transaction.master.taxOnDiscount ?? 0;
      let taxPerc = getMaxTaxPercInItemList();
      let billDiscount = formState.transaction.master.billDiscount ?? 0;

      // First calculation (3 decimal rounding)
      let taxOnBillDisc = Number(
        (billDiscount * taxPerc / 100).toFixed(3)
      );

      // Double rounding logic same as C#
      if (Math.abs(oldTaxOnBillDisc * 100 - taxOnBillDisc * 100) >= 0.75) {
        taxOnBillDisc = Number(
          taxOnBillDisc.toFixed(decimalPoints)
        );
      } else {
        taxOnBillDisc = oldTaxOnBillDisc;
      }

      // Assign final value
      formState.transaction.master.taxOnDiscount = taxOnBillDisc;

    } catch (err) {
      // swallow like C#
    }
  }

  const checkGiftOnBilling = async (grandTotal: number) => {
    try {
      if (!applicationSettings.productsSettings.giftOnBilling && applicationSettings.productsSettings.giftOnBillingAs != "CashCoupons") {
        if (!formState.giftClaimed && formState.transaction.master.invTransactionMasterID > 0) {
          const api = new APIClient();
          const param = {
            grandTotal: grandTotal,
            warehouseID: formState.transaction.master.fromWarehouseID,
          }
          return await api.postAsync(`${Urls.inv_transaction_base}${transactionType}/IsGiftOnBillingAvailable`, param)
        }
      }
      return false
    } catch (error) {
      console.error("Error in checkGiftOnBilling:", error);
      return false
    }
  }
  const calculateTotal = async (
    master: TransactionMaster,
    summary: SummaryItems,
    formElements: FormElementsState,
    commonParams: CommonParams,
    isEdit: boolean = false
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

    // ensure nested structure
    if (result.transaction == undefined) {
      result.transaction = { master: {} } as any
    };
    if (!result.transaction!.master) {
      result.transaction!.master = {} as any;
    }
    if (!result.transaction!.master!.master3) {
      result.transaction!.master!.master3 = {} as any;
    }

    const netVal = summary.netValue ?? 0;
    let netAmt = summary.total ?? 0;
    let tax = summary.vatAmount ?? 0;
    const cgst = summary.cgst ?? 0;
    const sgst = summary.sgst ?? 0;
    const igst = summary.igst ?? 0;
    const cessAmt = summary.cessAmt ?? 0;
    const additionalCess = summary.additionalCess ?? 0;

    // if totals mismatch, recompute netAmt from netVal+tax (same as PI)
    if (+ (netVal + tax) !== +netAmt) {
      if (!clientSession.isAppGlobal && applicationSettings.branchSettings.maintainKSA_EInvoice && applicationSettings.branchSettings.apply_KSA_EInvoice_Validation_Rules && ![VoucherType.GoodsDeliveryReturn, VoucherType.GoodsReceiptReturn, VoucherType.ServiceInvoice].includes(formState.transaction.master.voucherType as any)) {
        netAmt = round(netVal + tax);
      }
    }
    // Bill discount + tax-on-bill-disc logic (Indian-specific branch will later override if needed)
    const billDisc = Number(master.billDiscount ?? 0);
    const additionalAmt = Number(master.adjustmentAmount ?? 0);

    // write vat to result.master
    result.transaction!.master!.vatAmount = round(tax);
    // If India, populate tax breakup
    if (clientSession.isAppGlobal === true) {

      if (formState.transaction.master.voucherType !== VoucherType.SaleReturnEstimate) {

        if (
          ![VoucherType.SalesInvoice, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation]
            .includes(formState.transaction.master.voucherType as any)
        ) {

          if (formState.transaction.master.voucherForm !== "") {
            result.transaction!.master!.master3 ??= (TransactionMaster3InitialData as any);
            result.transaction!.master!.master3!.totCGST = round(cgst);
            result.transaction!.master!.master3!.totSGST = round(sgst);
            result.transaction!.master!.master3!.totIGST = round(igst);
            result.transaction!.master!.master3!.totCess = round(cessAmt);
            result.transaction!.master!.master3!.totAdditionalCess = round(additionalCess);
          }
        }
      }
    }

    // basic net amount
    if (formState.transaction.master.voucherType == VoucherType.ServiceInvoice) {
      result.netAmount = Number(netAmt.toFixed(2)); //NetAmt.ToString("###0.00");
    } else {
      result.netAmount = round(netAmt);
    }


    // tax on bill discount handling (mirror C# Indian logic)
    let taxOnBilldisc = Number(master.taxOnDiscount ?? 0);
    let blnApplyTaxonDiscount = true;
    if ((master.invTransactionMasterID ?? 0) > 0 && isEdit === false && Number(master.taxOnDiscount ?? 0) === 0) {
      blnApplyTaxonDiscount = false;
    }

    if (
      applicationSettings.branchSettings?.maintainKSA_EInvoice &&
      applicationSettings.branchSettings?.enableTaxOnBillDiscount &&
      Number(billDisc) > 0 &&
      blnApplyTaxonDiscount
    ) {
      const _BillDiscount = Number(billDisc);
      const TaxPerc = getMaxTaxPercInItemList();
      let TaxableAmt_StdRate = getTotalTaxable(TaxPerc);
      const totalGross = Number(summary.gross ?? 0);
      const totalDiscount = Number(summary.discount ?? 0);
      const _TotalNetValue = totalGross - totalDiscount;

      if (TaxableAmt_StdRate >= _BillDiscount) {
        TaxableAmt_StdRate -= _BillDiscount;

        // taxOnBilldisc rounded to decimalPoints (as C# did)
        // taxOnBilldisc = Number((_BillDiscount * TaxPerc / 100).toFixed(applicationSettings.mainSettings.decimalPoints));
      } else if (_BillDiscount > _TotalNetValue && _BillDiscount > 0 && _TotalNetValue > 0) {
        // reset bill discount
        // caller said they will set master fields as needed; mirror C# by setting back
        // but keep result consistent:
        master.billDiscount = 0;
        TaxableAmt_StdRate = 0;
        taxOnBilldisc = 0;
      } else {
        TaxableAmt_StdRate = 0;
        taxOnBilldisc = 0;
      }

      // Tax recalc: first round to 3 decimals, then round to decimalPoints
      tax = Number((TaxableAmt_StdRate * TaxPerc / 100).toFixed(3));
      if (
        !clientSession.isAppGlobal &&
        [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(formState.transaction.master.voucherType as any)
      ) {
        const decimals = applicationSettings.mainSettings.decimalPoints;
        const factor = Math.pow(10, decimals);

        tax = Math.round(tax * factor) / factor;
      } else {
        tax = Number(tax.toFixed(applicationSettings.mainSettings.decimalPoints));
      }


      // update taxed value in result.master
      result.transaction!.master!.taxOnDiscount = taxOnBilldisc;
    }

    // For India: recalc tax breakdown source (if needed) and set totalTax
    if (clientSession.isAppGlobal === true) {
      const taxes = [
        { name: "SGST", amount: round(sgst) },
        { name: "CGST", amount: round(cgst) },
        { name: "IGST", amount: round(igst) },
        { name: "CESS", amount: round(cessAmt) },
        { name: "AddCESS", amount: round(additionalCess) },
      ];
      // keep a copy (optional) and set totalTax
      result.taxBreakdown = taxes as any;
      result.transaction!.master!.totalTax = round(taxes.reduce((s, t) => s + t.amount, 0));
      tax = Number(result.transaction!.master!.totalTax ?? tax);
    } else {
      // KSA / non-India: tax remains summary.vatAmount
    }
    if (formState.transaction.master.voucherType == VoucherType.ServiceInvoice) {
      tax = Math.round(tax * 100) / 100;//Math.Round(Tax, 2);
      result.transaction!.master!.totalTax = Number(tax.toFixed(2));// Tax.ToString("###0.00");
    } else {
      result.transaction!.master!.totalTax = [VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation, VoucherType.SalesInvoice].includes(formState.transaction.master.voucherType as any) ? toTaxFormat(tax) : round(tax);
    }



    // if netVal+tax differs and not India, recalc netAmt (mirrors C#)
    // if (netVal + tax !== netAmt && clientSession.isAppGlobal !== true) {
    // netAmt = ro((netVal + tax).toFixed(applicationSettings.mainSettings.decimalPoints));
    // }

    // Populating totals into result
    result.transaction!.master!.totalGross = summary.gross;
    result.transaction!.master!.totalDiscount = summary.discount;

    // Grand total calculation
    let tcsAmt = 0;
    let _grandTotal = Number(netAmt) + Number(additionalAmt ?? 0) - Number(billDisc ?? 0) - Number(taxOnBilldisc ?? 0);

    result.transaction!.master!.roundAmount = 0;
    // Round-off logic (same structure as PI)
    if ([VoucherType.SalesInvoice
      , VoucherType.SalesReturn
    ].includes(formState.transaction.master.voucherType as any)
      && formState.formElements.hasroundOff.visible == true) {
      if (master.hasroundOff && formState.formElements.hasroundOff.disabled !== true) {
        try {
          result.transaction!.master!.grandTotal = Math.round(_grandTotal);
        } catch (err) {
          console.error("Error in rounding calculation:", err);
        }
      } else if (!master.hasroundOff && formState.formElements.hasroundOff.disabled !== true) {
        try {
          result.transaction!.master!.grandTotal = _grandTotal;
        } catch (err) {
          console.error("Error in rounding calculation:", err);
        }

      } else {
        result.transaction!.master!.grandTotal = posRoundAmount(_grandTotal);
      }
    }
    else {
      if (clientSession.isAppGlobal && formState.transaction.master.voucherType == VoucherType.GoodsReceiptReturn) {
        result.transaction!.master!.grandTotal = RoundAmountGlobal(_grandTotal);
      } else if (clientSession.isAppGlobal) {
        result.transaction!.master!.grandTotal = posRoundAmount(_grandTotal);
      } else {
        result.transaction!.master!.grandTotal = roundAmount(_grandTotal);
      }
    }


    result.transaction!.master!.roundAmount = round(_grandTotal - (result.transaction!.master!.grandTotal || 0));
    if (clientSession.isAppGlobal && formState.transaction.master.voucherType == VoucherType.SalesInvoice) {
      // TCS calculation (Indian SI uses TCS percentage if present)
      const TCSPerc = Number(formState.ledgerData.tCSPerc ?? master.master3?.totTCS ?? 0);
      if (TCSPerc > 0) {
        tcsAmt = (Number(result.transaction!.master!.grandTotal ?? 0) * TCSPerc) / 100;
        // store into master3 or other as you track it
        result.transaction!.master!.master3!.totTCS = round(tcsAmt);
      } else {
        result.transaction!.master!.master3!.totTCS = 0;
      }
    }

    // Net Grand Total = grandTotal + TCS - SR Amount (SR is service rounding / shipping etc.)
    const SRAmt = Number(master.srAmount ?? 0);
    const lblGrandTot = Number(result.transaction!.master!.grandTotal ?? 0) + Number(result.transaction!.master!.master3!.totTCS ?? 0);
    result.transaction!.master!.grandTotal = round(lblGrandTot - SRAmt);

    result.formElements = result.formElements || {} as FormElementsState;
    result.formElements.lblBillBalance = result.formElements.lblBillBalance || { visible: false, Text: "" };
    const safeNum = (v: any): number =>
      Number.isFinite(Number(v)) ? Number(v) : 0;
    const total = safeNum(result.transaction!.master!.grandTotal);
    const adv = safeNum(master?.advAmntFroSO);
    const cash = safeNum(master?.cashReceived);
    const coupon = safeNum(master?.couponAmt);
    const cardAmound = safeNum(master?.bankAmt);
    const balance = round(total - adv - cash - coupon - cardAmound);
    result.formElements.lblBillBalance.visible = formState.transaction.master.voucherType == VoucherType.SalesInvoice;

    result.formElements.lblBillBalance.label =
      Number.isFinite(balance) && balance !== 0
        ? balance.toString()
        : "";
    result.formElements.lblBillBalance.visible = true;

    try {
      if ((cash + cardAmound + adv) > 0) {

        result.formElements.lblBillBalance.label =
          Number.isFinite(balance) ? balance.toString() : "";
        result.formElements.lblBillBalance.visible = true;
      } else {

        result.formElements.lblBillBalance.label = "";
        result.formElements.lblBillBalance.visible = false;
      }
    } catch {
      result.formElements.lblBillBalance.label = "";
    }

    //     if ((Number(master.cashReceived || "") + master.creditAmt +  master.advAmntFroSO) > 0)
    // {
    //   result.formElements.lblBillBalance.visible = true;
    //     const label =  round(
    //         formState.summary.total
    //         - master.advAmntFroSO
    //         - master.cashReceived
    //         - master.couponAmt
    //         - master.creditAmt
    //     ).toString();

    //   result.formElements.lblBillBalance.label = label;
    // }
    // else
    // {

    //   result.formElements.lblBillBalance.visible = true;

    //   result.formElements.lblBillBalance.label = "";
    // }

    // if foreign currency conversion needed (similar to PI)
    if (formElements.pnlImport.visible && master.exchangeRate > 0) {
      const exchangeRate = master.exchangeRate;
      if (exchangeRate > 0) {
        result.transaction!.master!.grandTotalFc = (result.transaction!.master!.grandTotal ?? 0) / exchangeRate;
      }
    }


    const giftEnabled = await checkGiftOnBilling(result.transaction!.master!.grandTotal);
    result.formElements.btnGiftOnBilling = result.formElements.btnGiftOnBilling || { visible: false };
    result.formElements.btnGiftOnBilling.visible = giftEnabled;

    // dispatch only changed fields (keep pattern identical to PI)
    commonParams.formStateHandleFieldChangeKeysOnly &&
      dispatch &&
      dispatch(commonParams.formStateHandleFieldChangeKeysOnly({ fields: result }));

    return result;
  };
  const checkTheProductInSchemes = async (qty: number, price: number, giftModels?: []) => {
    try {
      let result = false;

      // Gift model (same as C# FirstOrDefault)
      let finalRows = [...formState.transaction.details.filter(
        (x) => x.productID > 0
      )];
      let giftClaimed = formState.giftClaimed || false;
      const gt = (giftModels ?? formState.giftModels)[0];
      if (!gt) return;

      const details = formState.transaction.details; // your SI items list

      for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row) continue;

        const rowBatchID = Number(row.productBatchID || 0);
        const rowProductID = Number(row.productID || 0);
        const rowQty = Number(row.qty || 0);

        if (
          Number(gt.productBatchID) === rowBatchID &&
          Number(gt.productID) === rowProductID &&
          rowQty === 1
        ) {
          const confirm = await ERPAlert.show({
            icon: "info",
            title: t("warning"),
            text: t(`Qualified for Gift: ${gt.productName} at price ${price}. Proceed?`),
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            showCancelButton: true,
            onCancel: () => {
              return false;
            },
          });
          if (confirm) {
            row.qty = qty;
            row.schemeFreeQty = qty;
            row.unitPrice = 0;
            row.vatPerc = 0;
            row.discPerc = 0;
            row.ratePlusTax = 0;

            const outRow = await calculateRowAmount(row, "qty", { result: {} }, false, i);
            finalRows[i] = outRow.transaction!.details![0] as TransactionDetail;
            giftClaimed = true;
            result = true;
            break;
          } else {
          }
        }
      }

      if (!result) {
        ERPAlert.show({
          icon: "warning",
          title: "Product Not Found",
          text: "Product not found in bill. Please check!",
          confirmButtonText: "OK",
        });
      } else {
        const summaryRes = calculateSummary(details, formState, {
          result: { giftClaimed: giftClaimed },
        });
        let totalRes = await calculateTotal(
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
          totalRes.transaction.details = finalRows

          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: totalRes,
              updateOnlyGivenDetailsColumns: true,
            })
          );
        }
      }
    } catch (err: any) {
      ERPAlert.show({
        icon: "error",
        title: "Error",
        text: err.message || "checkTheProductPriceInSchemes error",
        confirmButtonText: "OK",
      });
    }
  };
  const checkTheProductPriceInSchemes = async (
    qty: number,
    price: number,
    giftModels?: GiftModel[]
  ) => {
    try {
      let result = false;

      let finalRows = [
        ...formState.transaction.details.filter((x) => x.productID > 0),
      ];

      let giftClaimed = formState.giftClaimed || false;

      const gt = (giftModels ?? formState.giftModels)[0];
      if (!gt) return;

      const details = formState.transaction.details;

      for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row) continue;

        const rowBatchID = Number(row.productBatchID || 0);
        const rowProductID = Number(row.productID || 0);
        const rowQty = Number(row.qty || 0);

        // Same as C#:
        if (
          Number(gt.productBatchID) === rowBatchID &&
          Number(gt.productID) === rowProductID &&
          rowQty === 1
        ) {
          // ---------- ERPAlert Dialog EXACT FORMAT ----------
          const confirm = await ERPAlert.show({
            icon: "info",
            title: t("warning"),
            text: `Qualified for Gift: ${gt.productName} at Price ${price}. Proceed?`,
            confirmButtonText: t("yes"),
            cancelButtonText: t("no"),
            showCancelButton: true,
            onCancel: () => false,
          });
          // ---------------------------------------------------

          if (confirm) {
            // Exact field updates from C#
            row.qty = qty;
            row.schemeFreeQty = qty;
            row.unitPrice = price;
            row.ratePlusTax = price;

            // Reverse VAT into base price
            let taxP = Number(row.vatPerc || 0);
            if (taxP > 0) {
              const uRate =
                Number(row.ratePlusTax || 0) / (1 + taxP / 100);
              row.unitPrice = Number(uRate.toFixed(3)); // "0.000"
            }

            // Recalculate row
            const outRow = await calculateRowAmount(
              row,
              "qty",
              { result: {} },
              false,
              i
            );

            finalRows[i] = outRow.transaction!.details![0] as TransactionDetail;

            giftClaimed = true;
            result = true;
            break;
          } else {
            result = true;
            break;
          }
        }
      }

      // If no matching row found
      if (!result) {
        ERPAlert.show({
          icon: "warning",
          title: "Product Not Found",
          text: "Product not found in bill. Please check!",
          confirmButtonText: "OK",
        });
      } else {
        // Recalculate summary + totals
        const summaryRes = calculateSummary(details, formState, {
          result: { giftClaimed },
        });

        let totalRes = await calculateTotal(
          formState.transaction.master,
          summaryRes
            ? (summaryRes.summary as SummaryItems)
            : initialInventoryTotals,
          formState.formElements,
          { result: {} }
        );

        if (totalRes) {
          totalRes.summary = summaryRes.summary;
          totalRes.transaction = totalRes.transaction ?? {};
          totalRes.transaction.master = totalRes.transaction.master ?? {};

          // Same as C#: Reset bill discount when applying gift
          totalRes.transaction.master.billDiscount = 0;

          // Replace updated rows
          totalRes.transaction.details = finalRows;

          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: totalRes,
              updateOnlyGivenDetailsColumns: true,
            })
          );
        }
      }
    } catch (err: any) {
      ERPAlert.show({
        icon: "error",
        title: "Error",
        text: err.message || "checkTheProductPriceInSchemes error",
        confirmButtonText: "OK",
      });
    }
  };
  const removeGiftFromGrid = async (detailsInput?: TransactionDetail[], currentCell?: CurrentCell | undefined) => {
    try {
      let giftClaimed = formState.giftClaimed || false;

      if (!giftClaimed) return;

      // ------------------ 1. Ask user for confirmation ------------------
      const confirm = await ERPAlert.show({
        icon: "warning",
        title: "Gift Product",
        text: "Gift Product added! Gift will be removed. add it later if you want",
        confirmButtonText: "OK",
        showCancelButton: false,
      });

      if (!confirm) return;

      // ------------------ 2. Lookup gift model ------------------
      const gt = formState.giftModels?.[0];
      if (!gt) return;

      const giftBatchID = formState.giftBatchId;
      const giftProductQty = formState.giftProductQty;
      const giftProductPrice = formState.giftProductPrice;

      // API call that replaces:
      // GetProductsForSalesTransactionsByCode(barcode, productCode, warehouse, type, false, date)
      const apiParams = {
        barcode: gt.barcode,
        productCode: gt.productCode,
        warehouseID: formState.transaction.master.fromWarehouseID,
        voucherType: formState.transaction.master.voucherType,
        transDate: formState.transaction.master.transactionDate,
      };

      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(apiParams).map(([k, v]) => [k, String(v ?? "")])
        )
      ).toString();

      const url = `${Urls.inv_transaction_base}${transactionType}/GetProductsForSalesTransactionsByCode/?${query}`;

      const dtGiftItem = await api.getAsync(url);
      if (!dtGiftItem) return;

      const stdItem = dtGiftItem;
      const details = detailsInput ? [...detailsInput] : [...formState.transaction.details];
      let finalRows = [...details];

      // ------------------ 3. Loop through grid (details) ------------------
      for (let i = 0; i < details.length; i++) {
        const row = details[i];
        if (!row || Number(row.productID) <= 0) continue;

        const rowBatchID = Number(row.productBatchID || 0);
        const rowRatePlusTax = Number(row.ratePlusTax || 0);
        const rowSchemeQty = Number(row.schemeFreeQty || 0);

        // Same C# matching conditions:
        // Batch match + same gift price + same gift qty
        const isGiftRow =
          rowBatchID === Number(giftBatchID) &&
          rowRatePlusTax === Number(giftProductPrice) &&
          rowSchemeQty === Number(giftProductQty);

        if (isGiftRow) {
          // ------------------ 4. Reset to normal product values ------------------
          row.qty = 1;
          row.schemeFreeQty = 0;
          row.unitPrice = Number(stdItem.stdSalesPrice || 0);
          row.vatPerc = (clientSession.isAppGlobal === true && formState.transaction.master.voucherType != VoucherType.SalesEstimate)
            || (!clientSession.isAppGlobal && formState.transaction.master.voucherForm === "VAT") ? Number(stdItem.sVatPerc || 0) : 0;
          row.ratePlusTax = row.unitPrice;

          // Reverse calculate base price from ratePlusTax
          const taxP = Number(row.vatPerc || 0);

          if (taxP > 0) {
            const uRate =
              Number(row.ratePlusTax || 0) / (1 + taxP / 100);
            row.unitPrice = Number(uRate.toFixed(3));
          }

          // Recalculate the row
          const newRow = await calculateRowAmount(
            row,
            "qty",
            { result: {} },
            false,
            i
          );

          finalRows[i] = newRow.transaction!.details![0] as TransactionDetail;

          giftClaimed = false;
        }
      }

      // ------------------ 5. Recalculate totals ------------------
      const summaryRes = calculateSummary(finalRows, formState, {
        result: { giftClaimed },
      });

      let totalRes = await calculateTotal(
        formState.transaction.master,
        summaryRes?.summary ?? initialInventoryTotals as any,
        formState.formElements,
        { result: {} }
      );

      if (totalRes) {
        totalRes.summary = summaryRes.summary;
        totalRes.transaction = totalRes.transaction ?? {};
        totalRes.transaction.master = totalRes.transaction.master ?? {};
        totalRes.transaction.details = finalRows;
        totalRes.giftClaimed = false;
        if (currentCell) {
          totalRes.currentCell = currentCell;
        }
        // Update UI
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: totalRes,
            updateOnlyGivenDetailsColumns: true,
          })
        );
      }
    } catch (err: any) {
      ERPAlert.show({
        icon: "error",
        title: "Error",
        text: err.message || "removeGiftFromGrid error",
        confirmButtonText: "OK",
      });
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
    calculateTaxOnDiscount,
    checkTheProductInSchemes,
    checkTheProductPriceInSchemes,
    setCurrentCell,
    loadProductDetailsByAutoBarcode,
    removeGiftFromGrid
  };
};
