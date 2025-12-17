import VoucherType from "../../../../enums/voucher-types";
import {
  Countries,
  UserModel,
} from "../../../../redux/slices/user-session/reducer";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import { ColumnModel, TransactionFormState } from "../transaction-types";
// voucherType ?? formState.transaction.master.voucherType
// formType ?? formState.transaction.master.voucherForm
export const purchaseGridCol = (
  applicationSettings: ApplicationSettingsType,
  userSession: UserModel,
  voucherType: string,
  formType: string,
  t: any,
  formState: TransactionFormState
) =>
  (
    [
      {
        dataField: "slNo",
        caption: "",
        dataType: "number",
        width: 40,
        isLocked: true,
        alignment: "center",
      },
      {
        dataField: "pCode",
        caption: t("code"),
        dataType: "string",
        allowEditing: true,
        width: 150,
        alignment: "left",
        visible: false,
      },
      {
        dataField: "barCode",
        caption: t("barcode"),
        dataType: "string",
        allowEditing: true,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "productBatchID",
        caption: t("item_batch_id"),
        dataType: "number",
        width: 200,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "product",
        caption: t("product"),
        dataType: "string",
        allowEditing: true,
        width: 250,
        alignment: "left",
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "brandName",
        caption: t("brand"),
        dataType: "string",
        width: 150,
        alignment: "left",
        visible: false,
      },
      {
        dataField: "brandID",
        field: { valueKey: "id", labelKey: "name" },
        caption: t("brand_id"),
        dataType: "number",
        width: 100,
        readOnly: false,
        allowEditing: true,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "qty",
        caption: t("qty"),
        dataType: "number",
        allowEditing: true,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "unit",
        idField: "unitID",
        caption: t("unit"),
        dataType: "cb",
        width: 150,
        alignment: "left",
        allowEditing: true,
        readOnly: true,
      },
      {
        dataField: "unitID",
        caption: t("unit_id"),
        detailsOptionKey: "units",
        allowEditing: true,
        visible: false,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "ratePlusTax",
        caption: t("rate"),
        dataType: "number",
        visible: false,
        width: 130,
        alignment: "right",
        allowEditing: true,
        // decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        allowEditing: true,
        width: 130,
        alignment: "right",
      },
      {
        dataField: "gross",
        caption: t("gross"),
        dataType: "number",
        decimalPoint: 4,
        readOnly: true,
        width: 100,
        alignment: "right",
        allowEditing: true,
      },
      {
        dataField: "discPerc",
        caption: t("disc_perc"),
        dataType: "number",
        decimalPoint: 3,
        allowEditing: true,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "number",
        decimalPoint: 4,
        allowEditing: true,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        decimalPoint: 4,
        width: 100,
        alignment: "right",
        readOnly: true,
        visible: false,
      },
      {
        dataField: "total",
        caption: t("total"),
        dataType: "number",
        width: 100,
        alignment: "right",
        readOnly: true,
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "stockDetails",
        caption: t("stock_details"),
        dataType: "string",
        readOnly: true,
        visible: false,
        width: 200,
        alignment: "left",
      },
      {
        dataField: "adjQty",
        caption: t("adj_qty"),
        dataType: "number",
        visible: false,
        width: 100,
        alignment: "right",
        decimalPoint: 4,
      },
      {
        dataField: "manualBarcode",
        caption: t("m_barcode"),
        dataType: "string",
        visible: false,
        readOnly: true,
        width: 200,
        alignment: "left",
      },
      {
        dataField: "margin",
        caption: t("margin"),
        dataType: "number",
        visible: false,
        width: 100,
        allowEditing: true,
        alignment: "right",
        decimalPoint: 4,
      },
      {
        dataField: "vatPerc",
        caption: t("vat_perc"),
        dataType: "number",
        readOnly: true,
        allowEditing: true,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "vatAmount",
        caption: t("vat"),
        dataType: "number",
        readOnly: true,
        width: 100,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "cstPerc",
        caption: t("cst_perc"),
        dataType: "number",
        visible: false,
        width: 100,
        allowEditing: true,
        alignment: "right",
        decimalPoint: 2,
      },
      {
        dataField: "cst",
        caption: t("cst"),
        dataType: "number",
        visible: false,
        width: 100,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        visible: false,
        allowEditing: true,
        width: 200,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "size",
        caption: t("size"),
        dataType: "string",
        visible: false,
        readOnly: true,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "stickerQty",
        caption: t("sticker"),
        dataType: "number",
        visible: false,
        width: 130,
        alignment: "right",
        allowEditing: true,
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
        readOnly: true,
        visible: false,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "batchCreated",
        caption: t("batch_created"),
        dataType: "chk",
        visible: false,
        width: 150,
        alignment: "center",
      },
      {
        dataField: "barcodePrinted",
        caption: t("barcode_printed"),
        dataType: "chk",
        visible: false,

        width: 50,
        alignment: "center",
      },
      {
        dataField: "employeeCode",
        caption: t("sm_code"),
        dataType: "string",
        width: 55,
        visible: false,
        alignment: "center",
      },
      {
        dataField: "employeeName",
        caption: t("sales_man"),
        dataType: "string",
        width: 55,
        visible: false,
        alignment: "center",
      },
      {
        dataField: "stdPurchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        width: 55,
        visible: false,
        alignment: "center",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        width: 100,
        visible: false,
        alignment: "right",
        decimalPoint: 4,
      },
      {
        dataField: "minSalePrice",
        caption: t("min_sale_price"),
        dataType: "number",
        width: 150,
        readOnly: true,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "free",
        caption: t("free"),
        dataType: "number",
        allowEditing: true,
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "productDescription",
        caption: t("product_description"),
        dataType: "string",
        width: 250,
        alignment: "left",
        visible: false,
      },
      {
        dataField: "serial",
        caption: t("sl"),
        dataType: "btn",
        visible: false,
        width: 150,
        alignment: "left",
        allowEditing: false,
      },
      {
        dataField: "nosQty",
        caption: t("nos"),
        dataType: "number",
        visible: false,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "grossConvert",
        caption: t("gr"),
        dataType: "btn",
        allowEditing: false,
        width: 140,
        readOnly: true,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "soTransDetailsID",
        caption: t("so_trans_details_id"),
        dataType: "number",
        visible: false,
        width: 200,
        alignment: "right",
      },
      {
        dataField: "gdTransDetailsID",
        caption: t("gd_trans_details_id"),
        dataType: "number",
        visible: false,
        width: 180,
        alignment: "right",
      },
      {
        dataField: "fLV",
        caption: t("flv"),
        dataType: "btn",
        allowEditing: false,
        width: 140,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "flavors",
        caption: t("flavor"),
        dataType: "string",
        allowEditing: false,
        width: 140,
        readOnly: true,
        alignment: "right",
        visible: false,
      },
      //warehouseId as label in sales actualy value is warehouse not id
      // and from SR label is warehouse so name changed to warehouse for both
      {
        dataField: "warehouseID",
        caption: t("warehouse"),
        dataType: "string",
        visible: false,
        width: 130,
        alignment: "right",
      },
      {
        dataField: "profit",
        caption: t("profit"),
        dataType: "number",
        width: 100,
        visible: false,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "schemeQtyLimit",
        caption: t("scheme_qty_limit"),
        dataType: "number",
        visible: false,
        width: 100,
        alignment: "right",
        decimalPoint: 4,
      },
      {
        dataField: "schemeFreeQty",
        caption: t("scheme_free_qty"),
        dataType: "number",
        visible: false,
        width: 100,
        alignment: "right",
        decimalPoint: 4,
      },
      {
        dataField: "isSchemeProcessed",
        caption: t("is_scheme_processed"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "ArabicName",
        caption: t("arabic_name"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      //show in delivery return and grr but not assign any values on load
      {
        dataField: "refTransDtailId",
        caption: t("ref_trans_Detail_id"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "image",
        caption: t("image"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "imf",
        caption: t("imf"),
        dataType: "btn",
        allowEditing: false,
        width: 140,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      //for goods delivery return and GRR only
      {
        dataField: "supplierReferenceProductCode",
        caption: t("supplier_p_code"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "sITransDetailID",
        caption: t("si_trans_detail_id"),
        dataType: "string",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "nLA_SalesPrice",
        caption: t("nLA_sales_price"),
        dataType: "number",
        width: 150,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "boxQty",
        caption: t("box_qty"),
        dataType: "number",
        width: 150,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "itemType",
        caption: t("item_type"),
        dataType: "string",
        width: 55,
        visible: false,
        readOnly: true,
        alignment: "center",
      },
      {
        dataField: "location",
        caption: t("location"),
        dataType: "string",
        visible: false,
        readOnly: true,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "refBranchID",
        caption: t("ref_branch_id"),
        dataType: "string",
        width: 55,
        visible: false,
        readOnly: true,
        alignment: "center",
      },
      {
        dataField: "isSchemeItem",
        caption: t("is_scheme_item"),
        dataType: "string",
        width: 55,
        visible: false,
        alignment: "center",
      },

      {
        dataField: "actualPrice",
        caption: t("actual_price"),
        dataType: "number",
        visible: false,
        width: 200,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "schemeType",
        caption: t("scheme_type"),
        dataType: "string",
        visible: false,
        width: 280,
        readOnly: true,
        alignment: "left",
      },
      {
        dataField: "btnPrintBarcode",
        caption: t("pb"),
        dataType: "btn",
        visible: false,
        allowEditing: false,
        width: 250,
        alignment: "center",
      },
      {
        dataField: "customer_LSP",
        caption: t("customer_lsp"),
        dataType: "number",
        width: 150,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "memo",
        caption: t("memo"),
        dataType: "string",
        visible: false,
        width: 200,
        alignment: "left",
      },
      {
        dataField: "memoEditor",
        caption: t("me"),
        dataType: "btn",
        visible: false,
        width: 150,
        alignment: "left",
      },
      {
        dataField: "unitDiscount",
        caption: t("unit_discount"),
        dataType: "number",
        visible: false,
        width: 140,
        readOnly: true,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      //gcc only
      {
        dataField: "netConvert",
        caption: t("nr"),
        dataType: "number",
        readOnly: true,
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "schemeID",
        caption: t("scheme_id"),
        dataType: "number",
        readOnly: true,
        width: 100,
        alignment: "right",
      },
      {
        dataField: "isQtyFreezed",
        caption: t("is_qty_freezed"),
        dataType: "string",
        visible: false,
        readOnly: true,
        width: 280,
        alignment: "left",
      },
      {
        dataField: "profitPercentage",
        caption: t("profit_percentage"),
        dataType: "number",
        visible: false,
        width: 140,
        readOnly: true,
        alignment: "right",
      },
      {
        dataField: "expDate",
        caption: t("expiry_date"),
        dataType: "date",
        visible: false,
        width: 100,
        format: "DD-MMM-YYYY",
        alignment: "left",
      },
      {
        dataField: "unitPriceFC",
        caption: t("unit_price_fc"),
        dataType: "number",
        allowEditing: true,
        width: 150,
        readOnly: false,
        alignment: "right",
        visible: false,
        decimalPoint: 4,
      },
      {
        dataField: "grossFC",
        caption: t("gross_fc"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
        visible: false,
      },
      //india only
      {
        dataField: "sgstPerc",
        caption: t("sgst_perc"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "sgst",
        caption: t("sgst"),
        dataType: "number",
        width: 100,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },
      {
        dataField: "cgstPerc",
        caption: t("cgst_perc"),
        dataType: "number",
        width: 100,
        alignment: "right",
      },
      {
        dataField: "cgst",
        caption: t("cgst"),
        dataType: "number",
        width: 100,
        alignment: "right",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
      },

      {
        dataField: "igstPerc",
        caption: t("igst_perc"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "igst",
        caption: t("igst"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
        alignment: "right",
      },
      {
        dataField: "cessPerc",
        caption: t("cess_perc"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "cessAmt",
        caption: t("cess_amt"),
        dataType: "number",
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "additionalCessPerc",
        caption: t("additional_cess_perc"),
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "additionalCess",
        caption: t("additional_cess"),
        decimalPoint: applicationSettings.mainSettings.decimalPoints,
        dataType: "number",
        width: 100,
        allowEditing: true,
        alignment: "right",
      },
      {
        dataField: "mrp",
        decimalPoint: applicationSettings.mainSettings?.decimalPoints,
        caption: t("mrp"),
        dataType: "number",
        allowEditing: true,
        width: 100,
        readOnly: false,
        alignment: "right",
      },
      {
        dataField: "hsnCode",
        caption: t("hsn_code"),
        dataType: "string",
        width: 150,
        alignment: "left",
      },
      {
        dataField: "purchaseCost",
        caption: t("purchase_cost"),
        dataType: "number",
        width: 100,
        alignment: "right",
      },
      {
        dataField: "taxCategoryID",
        caption: t("taxCategory_id"),
        dataType: "number",
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "productCategoryID",
        caption: t("product_category_id"),
        dataType: "number",
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "invTransactionDetailID",
        caption: t("inv_transaction_detail_id"),
        dataType: "number",
        width: 100,
        alignment: "right",
        visible: false,
      },
      {
        dataField: "gatePass",
        caption: t("gate_pass"),
        dataType: "string",
        width: 150,
        alignment: "left",
      },
      {
        dataField: "colour",
        caption: t("colour"),
        dataType: "string",
        width: 150,
        alignment: "left",
        visible: false,
      },

      {
        dataField: "actionCol",
        caption: "",
        dataType: "boolean",
        width: 55,
        readOnly: true,
        isLocked: true,
        alignment: "center",
      },
    ] as ColumnModel[]
  )
    .filter((gc: ColumnModel) => {
      const field = gc.dataField ?? "";

      // ---------------- SALES INVOICE ----------------
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.SalesInvoice
      ) {
        return ![
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.SalesInvoice
      ) {
        return ![
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      // ---------------- SALES RETURN INVOICE ----------------
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.SalesReturn
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //sales
          "manualBarcode",
          "employeeCode",
          "employeeName",
          "stock",
          "minSalePrice",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "fLV",
          "flavors",
          "imf",
          "image",
          "nLA_SalesPrice",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "customer_LSP",
          "memo",
          "memoEditor",
          "unitDiscount",
          "boxQty",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.SalesReturn
      ) {
        return ![
          //sales gcc
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //sales
          "manualBarcode",
          "employeeCode",
          "employeeName",
          "minSalePrice",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "fLV",
          "flavors",
          "imf",
          "image",
          "nLA_SalesPrice",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "customer_LSP",
          "memo",
          "memoEditor",
          "unitDiscount",
          "boxQty",
          //india sales
          "purchaseCost",
          "gatePass",
          "colour",
          //india sales return
          "serial",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      // ---------------- SALES QUOTATION ----------------
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.SalesQuotation
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //sales
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "warehouseID",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "batchNo",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.SalesQuotation
      ) {
        return ![
          //sales gcc only
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //quotaion
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "warehouseID",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "batchNo",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //sq for india only
          "profit",
          "flavors",
          "fLV",
          //india sales
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      // ---------------- SALES ORDER ----------------
      if (
        userSession.countryId != Countries.India &&
        (voucherType == VoucherType.SalesOrder ||
          VoucherType.RequestForQuotation ||
          VoucherType.GoodRequest)
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //sales
          "manualBarcode",
          "cstPerc",
          "cst",
          "employeeCode",
          "employeeName",
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "memo",
          "memoEditor",
          "unitDiscount",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        (voucherType == VoucherType.SalesOrder ||
          VoucherType.RequestForQuotation ||
          VoucherType.GoodRequest)
      ) {
        return ![
          //sales gcc only
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //sales
          "manualBarcode",
          "cstPerc",
          "cst",
          "employeeCode",
          "employeeName",
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "memo",
          "memoEditor",
          "unitDiscount",
          //so for india only
          "stock",
          "flavors",
          "fLV",
          //india sales
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      // ---------------- GOODS DELIVERY ----------------
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.GoodsDeliveryNote
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //sales
          "nosQty",
          "grossConvert",
          "gdTransDetailsID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.GoodsDeliveryNote
      ) {
        return ![
          //sales gcc only
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //sales
          "nosQty",
          "grossConvert",
          "gdTransDetailsID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //GD for india only
          "flavors",
          "fLV",
          //india sales
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      // ---------------- GOODS DELIVERY RETURN----------------
      if (
        (userSession.countryId != Countries.India &&
          voucherType == VoucherType.GoodsDeliveryReturn) ||
        VoucherType.GoodsReceiptReturn
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //sales
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "customer_LSP",
          "memo",
          "memoEditor",
          "flavors",
          "fLV",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
        (voucherType == VoucherType.GoodsDeliveryReturn ||
          VoucherType.GoodsReceiptReturn)
      ) {
        return ![
          //sales gcc only
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //sales
          "nosQty",
          "grossConvert",
          "gdTransDetailsID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",

          //india sales
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //SO
          "adjQty",
        ].includes(field);
      }
      // ---------------- SERVICE INVOICE ----------------
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.ServiceInvoice
      ) {
        return ![
          // sales india
          "cgst",
          "cgstPerc",
          "sgstPerc",
          "sgst",
          "igstPerc",
          "igst",
          "cessPerc",
          "cessAmt",
          "additionalCessPerc",
          "additionalCess",
          "mrp",
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //sales
          "manualBarcode",
          "cstPerc",
          "cst",
          "employeeCode",
          "employeeName",
          "stock",
          "minSalePrice",
          "serial",
          "customer_LSP",
          "arabicName",
          "memo",
          "memoEditor",
          "flavors",
          "fLV",
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "warehouseID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //gcc sales
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      } else if (
        userSession.countryId == Countries.India &&
      voucherType == VoucherType.ServiceInvoice
      ) {
        return ![
          //sales gcc only
          "netConvert",
          "schemeID",
          "isQtyFreezed",
          "profitPercentage",
          "expDate",
          "unitPriceFC",
          "grossFC",
          //sales
          "manualBarcode",
          "cstPerc",
          "cst",
          "employeeCode",
          "employeeName",
          "stock",
          "minSalePrice",
          "serial",
          "customer_LSP",
          "arabicName",
          "memo",
          "memoEditor",
          "flavors",
          "fLV",
          "nosQty",
          "grossConvert",
          "soTransDetailsID",
          "gdTransDetailsID",
          "warehouseID",
          "profit",
          "schemeQtyLimit",
          "schemeFreeQty",
          "isSchemeProcessed",
          "imf",
          "image",
          "nLA_SalesPrice",
          "boxQty",
          "itemType",
          "location",
          "refBranchID",
          "isSchemeItem",
          "actualPrice",
          "schemeType",
          "btnPrintBarcode",
          "unitDiscount",
          //india sales
          "hsnCode",
          "purchaseCost",
          "taxCategoryID",
          "productCategoryID",
          "invTransactionDetailID",
          "gatePass",
          "colour",
          //SR
          "sITransDetailID",
          //DR and GRR
          "refTransDtailId",
          "supplierReferenceProductCode",
        ].includes(field);
      }
      return true;
    })
    .map((mi) => {
      if (
        (userSession.countryId == Countries.India &&
          voucherType == VoucherType.SalesInvoice) ||
        (voucherType != VoucherType.SalesInvoice &&
          (mi.dataField == "vatPerc" || mi.dataField == "vatAmount"))
      ) {
        return {
          ...mi,
          visible: false,
        };
      }
      if (
        userSession.countryId != Countries.India &&
        voucherType == VoucherType.SalesInvoice &&
        formType.toUpperCase() == "EXPORT" &&
        (mi.dataField == "unitPriceFC" || mi.dataField == "grossFC")
      ) {
        return {
          ...mi,
          visible: true,
        };
      }
      if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.SalesReturn &&
        (mi.dataField == "pCode" || mi.dataField == "stock")
      ) {
        return {
          ...mi,
          visible: true,
        };
      }
      if (
        userSession.countryId == Countries.India &&
        voucherType == VoucherType.SalesReturn &&
        ["discPerc", "discount"].includes(mi.dataField ?? "")
      ) {
        return {
          ...mi,
          visible: false,
        };
      }
      if (
        (voucherType == VoucherType.SalesOrder ||
          VoucherType.RequestForQuotation ||
          VoucherType.GoodRequest) &&
        (mi.dataField == "stock" || mi.dataField == "stdPurchasePrice")
      ) {
        return {
          ...mi,
          visible: true,
        };
      }
      if (
        (voucherType == VoucherType.ServiceInvoice &&
        mi.dataField == "stdPurchasePrice")
      ) {
        return {
          ...mi,
          visible: true,
        };
      }
      return mi;
    });
