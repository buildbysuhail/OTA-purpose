import { useTranslation } from "react-i18next";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";

export const DiagnosisReportFilterInitialState = {
    zeroRateProductlist: false,
    zeroPURateProductlist: false,
    postDatedTransactions: false,
    salesPriceMRP: false,
    barcodeRepeat: false,
    invalidLedgerRelatedLedger: false,
    duplicateVouchers: false,
    salesPriceCost: false,
    barcodeRepeatMultiBarcodes: false,
    barcodeRepeatMultiUnits: false,
    zeroMRPProductlist: false,
    sPriceLessPPrice: false,
    sPriceEqlPPrice: false,
    sPriceLessMSP: false,
    sPriceLessCat1: false,
    sPriceLessCat2: false,
    zeroCat1: false,
    zeroCat2: false,
    sPriceEqlMRP: false,
    inActiveProducts: false,
    invalidProducts: false,
    allPriceCategory: false,
    priceCategoryLessMRP: false,
    loadProductWithMultiBatch: false
};

const DiagnosisReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport');
    return (
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 p-2 overflow-y-hidden overflow-x-hidden">
            <ERPRadio
                id="zeroRateProductlist"
                name="diagnosisOption"
                value="zeroRateProductlist"
                label={t("zero_salesprice_product_list")}
                checked={getFieldProps("diagnosisOption").value == "zeroRateProductlist"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="postDatedTransactions"
                name="diagnosisOption"
                value="postDatedTransactions"
                label={t("post_dated_transactions")}
                checked={getFieldProps("diagnosisOption").value === "postDatedTransactions"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="salesPriceCost"
                name="diagnosisOption"
                value="salesPriceCost"
                label={t("sales_price_lt_cost")}
                checked={getFieldProps("diagnosisOption").value === "salesPriceCost"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceLessPPrice"
                name="diagnosisOption"
                value="sPriceLessPPrice"
                label={t("sales_price_lt_purchase_price")}
                checked={getFieldProps("diagnosisOption").value === "sPriceLessPPrice"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceLessMSP"
                name="diagnosisOption"
                value="sPriceLessMSP"
                label={t("sales_price_lt_msp")}
                checked={getFieldProps("diagnosisOption").value === "sPriceLessMSP"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceEqlMRP"
                name="diagnosisOption"
                value="sPriceEqlMRP"
                label={t("sales_price_eq_mrp")}
                checked={getFieldProps("diagnosisOption").value === "sPriceEqlMRP"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="priceCategoryLessMRP"
                name="diagnosisOption"
                value="priceCategoryLessMRP"
                label={t("price_category_gt_mrp")}
                checked={getFieldProps("diagnosisOption").value === "priceCategoryLessMRP"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="zeroCat1"
                name="diagnosisOption"
                value="zeroCat1"
                label={t("zero_price_category_1")}
                checked={getFieldProps("diagnosisOption").value === "zeroCat1"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="zeroCat2"
                name="diagnosisOption"
                value="zeroCat2"
                label={t("zero_price_category_2")}
                checked={getFieldProps("diagnosisOption").value === "zeroCat2"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceLessCat1"
                name="diagnosisOption"
                value="sPriceLessCat1"
                label={t("sales_price_lt_price_category_1")}
                checked={getFieldProps("diagnosisOption").value === "sPriceLessCat1"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceLessCat2"
                name="diagnosisOption"
                value="sPriceLessCat2"
                label={t("sales_price_lt_price_category_2")}
                checked={getFieldProps("diagnosisOption").value === "sPriceLessCat2"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="invalidLedgerRelatedLedger"
                name="diagnosisOption"
                value="invalidLedgerRelatedLedger"
                label={t("invalid_ledger_related_ledger")}
                checked={getFieldProps("diagnosisOption").value === "invalidLedgerRelatedLedger"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="duplicateVouchers"
                name="diagnosisOption"
                value="duplicateVouchers"
                label={t("duplicate_vouchers")}
                checked={getFieldProps("diagnosisOption").value === "duplicateVouchers"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="barcodeRepeat"
                name="diagnosisOption"
                value="barcodeRepeat"
                label={t("barcode_repeat")}
                checked={getFieldProps("diagnosisOption").value === "barcodeRepeat"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="barcodeRepeatMultiUnits"
                name="diagnosisOption"
                value="barcodeRepeatMultiUnits"
                label={t("barcode_repeat_multi_units")}
                checked={getFieldProps("diagnosisOption").value === "barcodeRepeatMultiUnits"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="barcodeRepeatMultiBarcodes"
                name="diagnosisOption"
                value="barcodeRepeatMultiBarcodes"
                label={t("barcode_repeat_multi_barcodes")}
                checked={getFieldProps("diagnosisOption").value === "barcodeRepeatMultiBarcodes"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="sPriceEqlPPrice"
                name="diagnosisOption"
                value="sPriceEqlPPrice"
                label={t("sales_price_eq_purchase_price")}
                checked={getFieldProps("diagnosisOption").value === "sPriceEqlPPrice"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="zeroPURateProductlist"
                name="diagnosisOption"
                value="zeroPURateProductlist"
                label={t("zero_purchase_price_product_list")}
                checked={getFieldProps("diagnosisOption").value === "zeroPURateProductlist"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="zeroMRPProductlist"
                name="diagnosisOption"
                value="zeroMRPProductlist"
                label={t("zero_mrp_product_list")}
                checked={getFieldProps("diagnosisOption").value === "zeroMRPProductlist"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="inActiveProducts"
                name="diagnosisOption"
                value="inActiveProducts"
                label={t("inactive_products")}
                checked={getFieldProps("diagnosisOption").value === "inActiveProducts"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="invalidProducts"
                name="diagnosisOption"
                value="invalidProducts"
                label={t("invalid_products")}
                checked={getFieldProps("diagnosisOption").value === "invalidProducts"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="loadProductWithMultiBatch"
                name="diagnosisOption"
                value="loadProductWithMultiBatch"
                label={t("products_with_multi_batch")}
                checked={getFieldProps("diagnosisOption").value === "loadProductWithMultiBatch"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
            <ERPRadio
                id="allPriceCategory"
                name="diagnosisOption"
                value="allPriceCategory"
                label={t("products_with_price_categories")}
                checked={getFieldProps("diagnosisOption").value === "allPriceCategory"}
                onChange={(e) => handleFieldChange("diagnosisOption", e.target.value)}
            />
        </div>
    );
};

export default DiagnosisReportFilter;