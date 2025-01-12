import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { BusinessType } from "../../../../enums/business-types";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
interface ApplicationSettingsProps {
  settings: any; // Replace `any` with the actual type if known
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any
  ) => void;
  filterComponent: (keys: string[], fText: string) => boolean;
  filterText: string;
  userSession: any; // Replace `any` with the actual type if known
  isCompactView: boolean;
  gridClass: string;
  sectionsRef: any;
  subItemsRef: MutableRefObject<Record<string, HTMLElement | null>>
  subItemsCatRef: any;
  blinkSection: string | null;
  handleGeneralHeaderClick: any;
  key: string;
}

const InventorySalesFilterableComponents: React.FC<ApplicationSettingsProps> = ({
  settings,
  handleFieldChange,
  filterComponent,
  filterText,
  userSession,
  isCompactView,
  gridClass,
  sectionsRef,
  subItemsRef,
  subItemsCatRef,
  blinkSection,
  handleGeneralHeaderClick,
  key,
}) => {
  const { t } = useTranslation("applicationSettings")
  const [showAllowSalesEdit, setShowAllowSalesEdit] = useState(false);
  const items = [
    {
      condition: filterComponent([t("default_sales_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSalesAcc"
          data={settings?.inventorySettings}
          field={{
            id: "defaultSalesAcc",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultSalesAcc",
              data.defaultSalesAcc
            )
          }
          label={t("default_sales_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_sales_return_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSalesReturnAcc"
          data={settings?.inventorySettings}
          field={{
            id: "defaultSalesReturnAcc",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultSalesReturnAcc",
              data.defaultSalesReturnAcc
            )
          }
          label={t("default_sales_return_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("service_warranty_inv_accounts")], filterText),
      element: (
        <div>
          <ERPCheckbox
            id="serviceWarrantyInvAccounts"
            checked={settings?.inventorySettings?.serviceWarrantyInvAccounts}
            data={settings?.inventorySettings}
            label={t("service_warranty_inv_accounts")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "inventorySettings",
                "serviceWarrantyInvAccounts",
                data.serviceWarrantyInvAccounts
              )
            }
          />
          <ERPDataCombobox
            id="serviceWarrantyInvLedgerID"
            disabled={settings?.inventorySettings?.serviceWarrantyInvAccounts !== true}
            data={settings?.inventorySettings}
            field={{
              id: "serviceWarrantyInvLedgerID",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.All}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "inventorySettings",
                "serviceWarrantyInvLedgerID",
                data.serviceWarrantyInvLedgerID
              )
            }
            label={t("service_warranty_inv_accounts_info")}
            noLabel={true}
          />
        </div>
      ),
    },
    {
      condition: filterComponent([t("service_non_warranty_inv_accounts")], filterText),
      element: (
        <div>
          <ERPCheckbox
            id="serviceNonWarrantyInvAccounts"
            checked={settings?.inventorySettings?.serviceNonWarrantyInvAccounts}
            data={settings?.inventorySettings}
            label={t("service_non_warranty_inv_accounts")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "inventorySettings",
                "serviceNonWarrantyInvAccounts",
                data.serviceNonWarrantyInvAccounts
              )
            }
          />
          <ERPDataCombobox
            id="serviceNONWarrantyInvLedgerID"
            disabled={settings?.inventorySettings?.serviceNonWarrantyInvAccounts !== true}
            data={settings?.inventorySettings}
            field={{
              id: "serviceNONWarrantyInvLedgerID",
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "inventorySettings",
                "serviceNONWarrantyInvLedgerID",
                data.serviceWarrantyInvLedgerID
              )
            }
            label={t("service_non_warranty_inv_accounts_info")}
            noLabel={true}
          />
        </div>
      ),
    },
    {
      condition: filterComponent([t("block_bill_discount")], filterText),
      element: (
        <ERPDataCombobox
          id="blockBillDiscount"
          field={{
            id: "blockBillDiscount",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings?.inventorySettings}
          options={[
            { value: "No", label: "No" },
            { value: "On POS", label: "On POS" },
            { value: "On Standard Sales", label: "On Standard Sales" },
            { value: "On Both", label: "On Both" },
            { value: "If Authentication Fails", label: "If Authentication Fails" },
          ]}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "blockBillDiscount",
              data.blockBillDiscount
            )
          }
          label={t("block_bill_discount")}
        />
      ),
    },
    {
      condition: filterComponent([t("discount_authorization_if_discount_above")], filterText),
      element: (
        <ERPInput
          id="discontAuthorizationIfDiscountAbove"
          min={0}
          value={settings?.inventorySettings?.discontAuthorizationIfDiscountAbove}
          data={settings?.inventorySettings}
          label={t("discount_authorization_if_discount_above")}
          placeholder={t("enter_discount_threshold")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "discontAuthorizationIfDiscountAbove",
              parseFloat(data.discontAuthorizationIfDiscountAbove)
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("if_less_sales_rate")], filterText),
      element: (
        <ERPDataCombobox
          id="showRateWarning"
          data={settings?.inventorySettings}
          field={{
            id: "showRateWarning",
            required: false,
            getListUrl: Urls.data_languages,
            valueKey: "value",
            labelKey: "label",
          }}
          options={[
            { value: "Warn", label: "Warn" },
            { value: "Block", label: "Block" },
            { value: "Ignore", label: "Ignore" },
          ]}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showRateWarning",
              data.showRateWarning
            )
          }
          label={t("if_less_sales_rate")}
        />
      ),
    },
    {
      condition: filterComponent([t("credit_limit")], filterText),
      element: (
        <ERPDataCombobox
          id="blockOnCreditLimit"
          data={settings?.accountsSettings}
          label={t("credit_limit")}
          field={{
            id: "blockOnCreditLimit",
            valueKey: "value",
            labelKey: "label",
          }}
          options={[
            { value: "Block", label: "Block" },
            { value: "Warn", label: "Warn" },
            { value: "Ignore", label: "Ignore" },
            { value: "Allow Cash Sales", label: "Allow Cash Sales" },
          ]}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "blockOnCreditLimit",
              data.blockOnCreditLimit
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("sales_rounding_method")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "pOSRoundingMethod",
            valueKey: "value",
            labelKey: "label",
          }}
          id="pOSRoundingMethod"
          label={t("sales_rounding_method")}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "pOSRoundingMethod",
              data.pOSRoundingMethod
            )
          }
          options={[
            { value: "Normal", label: "Normal" },
            { value: "No Rounding", label: "No Rounding" },
            { value: "Ceiling", label: "Ceiling" },
            { value: "Floor", label: "Floor" },
            { value: "Round to 0.25", label: "Round to 0.25" },
            { value: "Round to 0.50", label: "Round to 0.50" },
            { value: "Round to 0.10", label: "Round to 0.10" },
            { value: "Floor Round to 0.50", label: "Floor Round to 0.50" },
            { value: "Floor Round to 0.25", label: "Floor Round to 0.25" },
            { value: "Floor Round to 0.10", label: "Floor Round to 0.10" },
            { value: "Not Set", label: "Not Set" },
            { value: "Round to 0.010", label: "Round to 0.010" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("default_sales_return_payable_acc")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSalesReturnPayableAcc"
          disabled
          data={settings?.inventorySettings}
          field={{
            id: "defaultSalesReturnPayableAcc",
            required: false,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultSalesReturnPayableAcc",
              data.defaultSalesReturnPayableAcc
            )
          }
          label={t("default_sales_return_payable_acc")}
        />
      ),
    },
    {
      condition: filterComponent([t("bill_discount_given_ledger")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultBillDiscGivenLdg"
          data={settings?.inventorySettings}
          field={{
            id: "defaultBillDiscGivenLdg",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Discount_Given}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultBillDiscGivenLdg",
              data.defaultBillDiscGivenLdg
            )
          }
          label={t("bill_discount_given_ledger")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_customer")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultCustomerLedgerID"
          data={settings?.accountsSettings}
          label={t("default_customer")}
          field={{
            id: "defaultCustomerLedgerID",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultCustomerLedgerID",
              data.defaultCustomerLedgerID
            )
          }
          disabled={!settings?.accountsSettings?.setDefaultCustomerInSales}
        />
      ),
    },
    {
      condition: filterComponent([t("set_default_customer_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="setDefaultCustomerInSales"
          checked={settings?.accountsSettings?.setDefaultCustomerInSales}
          data={settings?.accountsSettings}
          label={t("set_default_customer_in_sales")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "setDefaultCustomerInSales",
              data.setDefaultCustomerInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_authorization_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="setAuthorizationinSales"
          checked={settings?.inventorySettings?.setAuthorizationinSales}
          data={settings?.inventorySettings}
          label={t("set_authorization_in_sales")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "setAuthorizationinSales",
              data.setAuthorizationinSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("block_non_stock_serial_selling")], filterText),
      element: (
        <ERPCheckbox
          id="blockNonStockSerialSelling"
          checked={settings?.inventorySettings?.blockNonStockSerialSelling}
          data={settings?.inventorySettings}
          label={t("block_non_stock_serial_selling")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "blockNonStockSerialSelling",
              data.blockNonStockSerialSelling
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_transit_mode")], filterText),
      element: (
        <ERPCheckbox
          id="showTransitModeStockTransferAlert"
          checked={settings?.inventorySettings?.showTransitModeStockTransferAlert}
          data={settings?.inventorySettings}
          label={t("show_transit_mode")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showTransitModeStockTransferAlert",
              data.showTransitModeStockTransferAlert
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_account_payable_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="showAccountPayableInSales"
          checked={settings?.inventorySettings?.showAccountPayableInSales}
          data={settings?.inventorySettings}
          label={t("show_account_payable_in_sales")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showAccountPayableInSales",
              data.showAccountPayableInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("hold_sales_man")], filterText),
      element: (
        <ERPCheckbox
          id="holdSalesMan"
          checked={settings?.inventorySettings?.holdSalesMan}
          data={settings?.inventorySettings}
          label={t("hold_sales_man")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "holdSalesMan",
              data.holdSalesMan
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_non_stock_items_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="showNonStockItemsinSales"
          checked={settings?.inventorySettings?.showNonStockItemsinSales}
          data={settings?.inventorySettings}
          label={t("show_non_stock_items_in_sales")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showNonStockItemsinSales",
              data.showNonStockItemsinSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("mobile_number_mandatory_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="mobileNumberMandotryInSales"
          checked={settings?.inventorySettings?.mobileNumberMandotryInSales}
          data={settings?.inventorySettings}
          label={t("mobile_number_mandatory_in_sales")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "mobileNumberMandotryInSales",
              data.mobileNumberMandotryInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_tender_window_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="showTenderDialogInSales"
          checked={settings?.accountsSettings?.showTenderDialogInSales}
          data={settings?.accountsSettings}
          label={t("show_tender_window_in_sales")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "showTenderDialogInSales",
              data.showTenderDialogInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_multipayment_mode")], filterText),
      element: (
        <ERPCheckbox
          id="allowMultiPayments"
          checked={settings?.accountsSettings?.allowMultiPayments}
          data={settings?.accountsSettings}
          label={t("allow_multipayment_mode")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "allowMultiPayments",
              data.allowMultiPayments
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_sales_route/area")], filterText),
      element: (
        <ERPCheckbox
          id="allowSalesRouteArea"
          label={t("allow_sales_route/area")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.allowSalesRouteArea}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "allowSalesRouteArea",
              data.allowSalesRouteArea
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_sales")], filterText),
      element: (
        <ERPCheckbox
          id="maintainSalesRouteCreditLimit"
          label={t("maintain_sales")}
          data={settings?.mainSettings}
          disabled={!settings?.mainSettings?.allowSalesRouteArea}
          checked={settings?.mainSettings?.maintainSalesRouteCreditLimit}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "maintainSalesRouteCreditLimit",
              data.maintainSalesRouteCreditLimit
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_employees_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="showEmployeesInSales"
          checked={settings?.accountsSettings?.showEmployeesInSales}
          data={settings?.accountsSettings}
          label={t("show_employees_in_sales")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "showEmployeesInSales",
              data.showEmployeesInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("stop_scanning_(Sales)")], filterText),
      element: (
        <ERPCheckbox
          id="stopScanningOnWrongBarcodeInSales"
          label={t("stop_scanning_(Sales)")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.stopScanningOnWrongBarcodeInSales}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "stopScanningOnWrongBarcodeInSales",
              data.stopScanningOnWrongBarcodeInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("load_customer_last_sales_rate")], filterText),
      element: (
        <ERPCheckbox
          id="loadCustomerLastRate"
          label={t("load_customer_last_sales_rate")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.loadCustomerLastRate}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "loadCustomerLastRate",
              data.loadCustomerLastRate
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("allow_manual_product")], filterText),
      element: (
        <ERPCheckbox
          id="allowMannualProductSelectionInSales"
          label={t("allow_manual_product")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.allowMannualProductSelectionInSales}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "allowMannualProductSelectionInSales",
              data.allowMannualProductSelectionInSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_rate_(tax_inclusive)")], filterText),
      element: (
        <ERPCheckbox
          id="showRateBeforeTax"
          label={t("show_rate_(tax_inclusive)")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.showRateBeforeTax}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "showRateBeforeTax",
              data.showRateBeforeTax
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId == Countries.India && filterComponent([t("enable_order_management")], filterText),
      element: (
        <ERPCheckbox
          id="enableOrderMangment"
          disabled
          label={t("enable_order_management")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.enableOrderMangment}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableOrderMangment",
              data.enableOrderMangment
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_multi_warehouse_billing")], filterText),
      element: (
        <ERPDisableEnable>
          {(hasPermitted = false) => {
            // Conditionally set the state outside of the JSX return
            if (hasPermitted) {
              setShowAllowSalesEdit(true);
            }

            // Return the JSX to meet the ReactNode requirement
            return (
              <ERPCheckbox
                id="enableMultiWarehouseBilling"
                label={t("enable_multi_warehouse_billing")}
                data={settings?.productsSettings}
                checked={settings?.productsSettings?.enableMultiWarehouseBilling}
                onChangeData={(data) =>
                  handleFieldChange(
                    "productsSettings",
                    "enableMultiWarehouseBilling",
                    data.enableMultiWarehouseBilling
                  )
                }
              />
            );
          }}
        </ERPDisableEnable>
      ),
    },
    {
      condition: filterComponent([t("allow_sales_detailed_edit")], filterText) && showAllowSalesEdit,
      element: (<ERPCheckbox
        id="allowSalesDetailedEdit"
        checked={settings?.miscellaneousSettings?.allowSalesDetailedEdit}
        data={settings?.miscellaneousSettings}
        label={t("allow_sales_detailed_edit")}
        onChangeData={(data) =>
          handleFieldChange(
            "miscellaneousSettings",
            "allowSalesDetailedEdit",
            data.allowSalesDetailedEdit
          )
        }
      />)

    },
    {
      condition: userSession.countryId != Countries.India && filterComponent([t("enable_sales_invoice_draft_option")], filterText),
      element: (
        <ERPCheckbox
          id="enableSalesInvoiceDraftOption"
          checked={settings?.inventorySettings?.enableSalesInvoiceDraftOption}
          data={settings?.inventorySettings}
          label={t("enable_sales_invoice_draft_option")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "enableSalesInvoiceDraftOption",
              data.enableSalesInvoiceDraftOption
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId != Countries.India && filterComponent([t("show_cash_sales_separate_menu")], filterText),
      element: (
        <ERPCheckbox
          id="showCashSalesSeperateMenu"
          checked={settings?.inventorySettings?.showCashSalesSeperateMenu}
          data={settings?.inventorySettings}
          label={t("show_cash_sales_separate_menu")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showCashSalesSeperateMenu",
              data.showCashSalesSeperateMenu
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_tax_on_bill_discount")], filterText),
      element: (
        <ERPCheckbox
          id="enableTaxOnBillDiscount"
          label={t("enable_tax_on_bill_discount")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.enableTaxOnBillDiscount}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "enableTaxOnBillDiscount",
              data.enableTaxOnBillDiscount
            )
          }
        />
      ),
    },
    {
      condition: settings != undefined &&
        (settings?.mainSettings?.maintainBusinessType == BusinessType.Hypermarket ||
          settings?.mainSettings?.maintainBusinessType == BusinessType.Supermarket) &&
        filterComponent([t("show_party_balance_in_sales")], filterText),
      element: (
        <ERPCheckbox
          id="showPartyBalanceInSales"
          checked={settings?.accountsSettings?.showPartyBalanceInSales}
          data={settings?.accountsSettings}
          label={t("show_party_balance_in_sales")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "showPartyBalanceInSales",
              data.showPartyBalanceInSales
            )
          }
        />
      ),
    },

  ];
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  const appState = useAppSelector(
    (state: RootState) => state.AppState.appState
  );

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsCatRef.current["inventorySalesGeneral"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] ${appState.mode == 'dark' ? "!bg-[#404344bf] " : ``} font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventorySalesGeneral"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("sales")}
            </h1>
            <div key="inventorySalesGeneral" className="space-y-4">
              <div className={`border border-solid ${appState.mode == 'dark' ? " !border-[#f2f4f538] " : ``} border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`
                    }`}>
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};
export default InventorySalesFilterableComponents;