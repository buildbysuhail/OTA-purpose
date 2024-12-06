import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
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

const InventoryPurchaseFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
  const items = [
    {
      condition: filterComponent([t("default_purchase_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPurchaseAcc"
          data={settings?.inventorySettings}
          field={{
            id: "defaultPurchaseAcc",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultPurchaseAcc",
              data.defaultPurchaseAcc
            )
          }
          label={t("default_purchase_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_purchase_return_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPurchaseReturnAcc"
          data={settings?.inventorySettings}
          field={{
            id: "defaultPurchaseReturnAcc",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultPurchaseReturnAcc",
              data.defaultPurchaseReturnAcc
            )
          }
          label={t("default_purchase_return_account")}
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
      condition: filterComponent([t("unit_price_decimal_points")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "unitPrice_decimalPoint",
            valueKey: "value",
            labelKey: "label",
          }}
          id="unitPrice_decimalPoint"
          label={t("unit_price_decimal_points")}
          data={settings?.mainSettings}
          defaultData={settings?.mainSettings?.unitPrice_decimalPoint}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "unitPrice_decimalPoint",
              data.unitPrice_decimalPoint
            )
          }
          options={[
            { value: 0, label: "0" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("default_purchase_assets_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPurchaseAssetsAccount"
          field={{
            id: "defaultPurchaseAssetsAccount",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings?.accountsSettings}
          label={t("default_purchase_assets_account")}
          options={[
            { value: "All", label: "All" },
            { value: "Customer", label: "Customer" },
            { value: "Supplier", label: "Supplier" },
            { value: "ReferalAgent", label: "Referal Agent" },
            { value: "CashInHand", label: "Cash In Hand" },
            { value: "BankAccount", label: "Bank Account" },
            { value: "SuspenseAccount", label: "Suspense Account" },
            { value: "CustomerAndSupplier", label: "Customer and Supplier" },
            { value: "Cash_Bank", label: "Cash & Bank" },
            { value: "Cash_Bank_Suppliers", label: "Cash & Bank - Suppliers" },
            { value: "Cash_Bank_Customers", label: "Cash & Bank - Customers" },
            { value: "Cash_Bank_Suppliers_Customers", label: "Cash & Bank - Suppliers & Customers" },
            { value: "Sales_Account", label: "Sales Account" },
            { value: "Purchase_Account", label: "Purchase Account" },
            { value: "Salaries", label: "Salaries" },
            { value: "Discount_Received", label: "Discount Received" },
            { value: "Discount_Given", label: "Discount Given" },
            { value: "Incentive_Given", label: "Incentive Given" },
            { value: "Salary_Account", label: "Salary Account" },
            { value: "Job_Works", label: "Job Works" },
            { value: "Branch_Receivable", label: "Branch Receivable" },
            { value: "SalesAndDirectIncome", label: "Sales and Direct Income" },
            { value: "PurchaseAndDirectExpense", label: "Purchase and Direct Expense" },
            { value: "Cash_Bank_Suppliers_Customers_Employees", label: "Cash & Bank - Suppliers, Customers & Employees" },
            { value: "Cash_Bank_Customers_Employees", label: "Cash & Bank - Customers & Employees" },
            { value: "Branch_Payable", label: "Branch Payable" },
            { value: "Branch_Recv_Payable", label: "Branch Receivable & Payable" },
            { value: "Expenses", label: "Expenses" },
            { value: "Incomes", label: "Incomes" },
            { value: "Credit_Note_Ledgers", label: "Credit Note Ledgers" },
            { value: "DebitNote_Note_Ledgers", label: "Debit Note Ledgers" },
            { value: "Liabilities_Expenses_All_Without_Salaries", label: "Liabilities & Expenses (Excl. Salaries)" },
            { value: "Current_Assets", label: "Current Assets" },
            { value: "Fixed_Assets", label: "Fixed Assets" },
            { value: "Indirect_Expenses", label: "Indirect Expenses" },
            { value: "Indirect_Income", label: "Indirect Income" },
          ]}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultPurchaseAssetsAccount",
              data.defaultPurchaseAssetsAccount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("carry_forward_purchase")], filterText),
      element: (
        <ERPCheckbox
          id="carryForwardPurchaseOrderQtyToPurchase"
          checked={settings?.inventorySettings?.carryForwardPurchaseOrderQtyToPurchase}
          data={settings?.inventorySettings}
          label={t("carry_forward_purchase")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "carryForwardPurchaseOrderQtyToPurchase",
              data.carryForwardPurchaseOrderQtyToPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_product_cost_as_purchase_price")], filterText),
      element: (
        <ERPCheckbox
          id="setProductCostasPurchasePrice"
          checked={settings?.inventorySettings?.setProductCostasPurchasePrice}
          data={settings?.inventorySettings}
          label={t("set_product_cost_as_purchase_price")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "setProductCostasPurchasePrice",
              data.setProductCostasPurchasePrice
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_last_purchase")], filterText),
      element: (
        <ERPCheckbox
          id="setLastPurchaseRateAsProctRate"
          checked={settings?.inventorySettings?.setLastPurchaseRateAsProctRate}
          data={settings?.inventorySettings}
          label={t("set_last_purchase")}
          onChangeData={(data: any) => {
            const newValue = data.setLastPurchaseRateAsProctRate;
            if (!newValue && settings?.inventorySettings?.setProductCostasPurchasePrice) {
              handleFieldChange("inventorySettings", "setProductCostasPurchasePrice", false);
            }
            handleFieldChange("inventorySettings", "setLastPurchaseRateAsProctRate", newValue);
          }}
        />
      ),
    },
    {
      condition: filterComponent([t("is_reference_number")], filterText),
      element: (
        <ERPCheckbox
          id="isReferenceNumberMandatoryInPurchase"
          checked={settings?.inventorySettings?.isReferenceNumberMandatoryInPurchase}
          data={settings?.inventorySettings}
          label={t("is_reference_number")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "isReferenceNumberMandatoryInPurchase",
              data.isReferenceNumberMandatoryInPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_avg_purchase")], filterText),
      element: (
        <ERPCheckbox
          id="setAvgPurchaseCostWithStdPurRate"
          checked={settings?.inventorySettings?.setAvgPurchaseCostWithStdPurRate}
          data={settings?.inventorySettings}
          label={t("set_avg_purchase")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "setAvgPurchaseCostWithStdPurRate",
              data.setAvgPurchaseCostWithStdPurRate
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("update_purchase_price")], filterText),
      element: (
        <ERPCheckbox
          id="updatePurhasePriceUpdateOnPurchaseBT"
          checked={settings?.inventorySettings?.updatePurhasePriceUpdateOnPurchaseBT}
          data={settings?.inventorySettings}
          label={t("update_purchase_price")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "updatePurhasePriceUpdateOnPurchaseBT",
              data.updatePurhasePriceUpdateOnPurchaseBT
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("need_PO_approval_for_printout")], filterText),
      element: (
        <ERPCheckbox
          id="needPOApprovalForPrintout"
          checked={settings?.inventorySettings?.needPOApprovalForPrintout}
          data={settings?.inventorySettings}
          label={t("need_PO_approval_for_printout")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "needPOApprovalForPrintout",
              data.needPOApprovalForPrintout
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_account_receivable_in_purchase")], filterText),
      element: (
        <ERPCheckbox
          id="showAccountReceivableInPurchase"
          checked={settings?.inventorySettings?.showAccountReceivableInPurchase}
          data={settings?.inventorySettings}
          label={t("show_account_receivable_in_purchase")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "showAccountReceivableInPurchase",
              data.showAccountReceivableInPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("check_listed_product_prices_in_purchase_invoice")], filterText),
      element: (
        <ERPCheckbox
          id="loadListedProductPrices"
          label={t("check_listed_product_prices_in_purchase_invoice")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.loadListedProductPrices}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "loadListedProductPrices",
              data.loadListedProductPrices
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_purchase_cost_change_warning")], filterText),
      element: (
        <ERPCheckbox
          id="showPurchaseCostChangeWarning"
          label={t("show_purchase_cost_change_warning")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.showPurchaseCostChangeWarning}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "showPurchaseCostChangeWarning",
              data.showPurchaseCostChangeWarning
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_import_purchase")], filterText),
      element: (
        <ERPCheckbox
          id="enableImportPurchase"
          disabled
          label={t("enable_import_purchase")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.enableImportPurchase}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "enableImportPurchase",
              data.enableImportPurchase
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_untallied_bills")], filterText),
      element: (
        <ERPCheckbox
          id="maintainUntalliedBills"
          checked={settings?.miscellaneousSettings?.maintainUntalliedBills}
          data={settings?.miscellaneousSettings}
          label={t("maintain_untallied_bills")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "maintainUntalliedBills",
              data.maintainUntalliedBills
            )
          }
        />
      ),
    }
  ];
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsCatRef.current["inventoryPurchase"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryPurchase"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("purchase")}
            </h1>
            <div key="inventoryPurchase" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`
                    }`} >
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
      )}
    </>
  );
};
export default InventoryPurchaseFilterableComponents;