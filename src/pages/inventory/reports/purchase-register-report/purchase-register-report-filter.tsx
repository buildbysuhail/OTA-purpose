import { useTranslation } from "react-i18next";
import moment from "moment";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { LedgerType } from "../../../../enums/ledger-types";

const PurchaseRegisterFilter = ({
  getFieldProps,
  handleFieldChange,
  formState,
}: any) => {
  const { t } = useTranslation("accountsReport");
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ERPDateInput
          label={t("from_date")}
          {...getFieldProps("fromDate")}
          className="w-full"
          onChangeData={(data: any) =>
            handleFieldChange("fromDate", data.fromDate)
          }
        />
        <ERPDateInput
          label={t("to_date")}
          {...getFieldProps("toDate")}
          className="w-full"
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <ERPDataCombobox
          label={t("transfer_voucher")}
          {...getFieldProps("transferVoucher")}
          options={[
              { value: 'si-bt', label: 'SI-BT' },
              { value: 'se-bt', label: 'SE-BT' }
          ]}
          field={{
              id: "transferVoucher",
              valueKey: "value",
              labelKey: "label",
          }}
          onSelectItem={(data) => {
              handleFieldChange("transferVoucher", data.value);
          }}
      /> */}

        {clientSession.isAppGlobal && (
          <ERPDataCombobox
            label={t("product_category")}
            {...getFieldProps("productCategoryID")}
            field={{
              id: "productCategoryID",
              getListUrl: Urls.productCategory,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("productCategoryID", data.value);
            }}
          />
        )}

        <ERPDataCombobox
          label={t("product_group")}
          {...getFieldProps("productGroupID")}
          field={{
            id: "productGroupID",
            getListUrl: Urls.data_productgroup,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              productGroupID: data.value,
              groupName: data.label,
            });
          }}
        />

        <ERPDataCombobox
          label={t("brand")}
          {...getFieldProps("brandID")}
          field={{
            id: "brandID",
            getListUrl: Urls.data_brands,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              brandID: data.value,
              brand: data.label,
            });
          }}
        />

        <ERPDataCombobox
          label={t("product")}
          {...getFieldProps("productID")}
          field={{
            id: "productID",
            getListUrl: Urls.data_products,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              productID: data.value,
              productName: data.label,
            });
          }}
        />

        <ERPInput
          label={t("product_code")}
          {...getFieldProps("productCode")}
          className="w-full"
          onChangeData={(val: string) => handleFieldChange("productCode", val)}
        />

        <ERPDataCombobox
          label={t("sales_man")}
          {...getFieldProps("salesmanID")}
          field={{
            id: "salesmanID",
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              salesmanID: data.value,
              salesMan: data.label,
            });
          }}
        />

        {applicationSettings.mainSettings?.allowSalesRouteArea == true && (
          <ERPDataCombobox
            label={t("sales_route")}
            {...getFieldProps("salesRouteID")}
            field={{
              id: "salesRouteID",
              getListUrl: Urls.data_salesRoute,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
                salesRouteID: data.value,
                routeName: data.label,
              });
            }}
          />
        )}

        {applicationSettings.inventorySettings?.maintainWarehouse == true && (
          <ERPDataCombobox
            label={t("warehouse")}
            {...getFieldProps("warehouseID")}
            field={{
              id: "warehouseID",
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange({
                warehouseID: data.value,
                warehouse: data.label,
              });
            }}
          />
        )}

        {/* SelectFromTypebyVoucherType -- global*/}
        {/* SelectFromTypebyVoucherType */}

        <ERPDataCombobox
          label={t("voucher_form")}
          {...getFieldProps("voucherForm")}
          field={{
            id: "voucherForm",
            getListUrl: clientSession.isAppGlobal
              ? Urls.data_FormTypeByPI
              : Urls.data_form_type,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("voucherForm", data.value.toString());
          }}
        />

        <ERPDataCombobox
          label={t("group_category")}
          {...getFieldProps("groupCategoryID")}
          field={{
            id: "groupCategoryID",
            getListUrl: Urls.data_groupcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("groupCategoryID", data.value);
          }}
        />

        <ERPDataCombobox
          label={t("section")}
          {...getFieldProps("sectionID")}
          field={{
            id: "sectionID",
            getListUrl: Urls.data_sections,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("sectionID", data.value);
          }}
        />

        {clientSession.isAppGlobal == true && (
          <ERPDataCombobox
            label={t("price_category")}
            {...getFieldProps("priceCategory")}
            field={{
              id: "priceCategory",
              getListUrl: Urls.data_pricectegory,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("priceCategory", data.value);
            }}
          />
        )}

        <ERPDataCombobox
          label={t("party")}
          {...getFieldProps("partyLedgerID")}
          field={{
            id: "partyLedgerID",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("partyLedgerID", data.value);
          }}
        />

        <ERPDataCombobox
          label={t("supplier")}
          {...getFieldProps("supplierID")}
          field={{
            id: "supplierID",
            getListUrl: Urls.data_Suppliers,

            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange({
              supplierID: data.value,
              supplier: data.label,
            });
          }}
        />

        {applicationSettings.accountsSettings?.maintainCostCenter == true && (
          <ERPDataCombobox
            label={t("cost_center")}
            {...getFieldProps("costCenterID")}
            field={{
              id: "costCenterID",
              getListUrl: Urls.data_costcentres,
              valueKey: "id",
              labelKey: "name",
            }}
            onSelectItem={(data) => {
              handleFieldChange("costCenterID", data.value);
            }}
          />
        )}

        {/* not used any where always visible false */}
        {/* <ERPDataCombobox
          label={t("manufacture")}
          {...getFieldProps("manufactureID")}
          field={{
            id: "manufactureID",
            // getListUrl: Urls.data_manufacture,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("manufactureID", data.value);
          }}
        /> */}
        {/* visible only on Inventory Transaction Register */}
        {/* <ERPDataCombobox
          label={t("transaction_type")}
          {...getFieldProps("voucherType")}
          field={{
            id: "voucherType",
            getListUrl: Urls.data_vouchertype,
            valueKey: "id",
            labelKey: "name",
          }}
          onSelectItem={(data) => {
            handleFieldChange("voucherType", data.value);
          }}
        /> */}
        {/* always visible false */}
        {/* <ERPInput
          label={t("vat_percentage")}
          {...getFieldProps("vatPerc")}
          className="w-full"
          onChangeData={(val: string) => handleFieldChange("vatPerc", val)}
        /> */}

        {/* <ERPDataCombobox
          label={t("report_of")}
          {...getFieldProps("reportOf")}
          field={{
              id: "reportOf",
              // getListUrl: Urls.data_reports,
              valueKey: "id",
              labelKey: "name",
          }}
          onSelectItem={(data) => {
              handleFieldChange("reportOf", data.value);
          }}
      /> */}

        <ERPDataCombobox
          label={t("report_of")}
          {...getFieldProps("reportOf")}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Below Cost', label: 'Below Cost' },
          ]}
          field={{
            id: "reportOf",
            valueKey: "value",
            labelKey: "label",
          }}
          onSelectItem={(data) => {
            handleFieldChange("reportOf", data.value);
          }}
        />

        {/* {clientSession.isAppGlobal == true && (
          <ERPCheckbox
            label={t("export_data_to_excel")}
            {...getFieldProps("exportDataToExcel")}
            onChangeData={(data: any) =>
              handleFieldChange("exportDataToExcel", data.exportDataToExcel)
            }
          />
        )} */}

        {/* same procedure with dev grid not needed in web */}
        {/* <ERPCheckbox
          label={t("standard_format")}
          {...getFieldProps("standardFormat")}
          onChangeData={(data: any) =>
            handleFieldChange("standardFormat", data.standardFormat)
          }
        /> */}
      </div>
    </div>
  );
};

export default PurchaseRegisterFilter;

export const PurchaseRegisterFilterInitialState = {
  fromDate: moment().local().startOf("day").toDate(),
  toDate: moment().local().endOf("day").toDate(),
  voucherType: "PI",
  productGroupID: 0,
  brandID: 0,
  productID: 0,
  vatPerc: 0,
  salesRouteID: 0,
  salesmanID: 0,
  warehouseID: 0,
  voucherForm: "",
  groupCategoryID: 0,
  sectionID: 0,
  productCode: "",
  partyLedgerID: 0,
  costCenterID: 0,
  supplierID: 0,
  // Newly added fields to match the UI
  // transferVoucher: "",
  productCategoryID: 0,
  priceCategory: 0,
  reportOf: 'All',
  // exportDataToExcel: false, 
  // transactionType: "",
  manufactureID: 0,
};
