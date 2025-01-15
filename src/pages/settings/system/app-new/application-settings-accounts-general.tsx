import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useApplicationSetting } from "../../../../utilities/hooks/use-application-settings";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import Urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
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

const AccountsGeneralFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("default_cash_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultCashAcc"
          data={settings?.accountsSettings}
          label={t("default_cash_account")}
          field={{
            id: "defaultCashAcc",
            getListUrl: Urls.data_CashLedgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultCashAcc",
              data.defaultCashAcc
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_suspense_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSuspenseAcc"
          data={settings?.accountsSettings}
          label={t("default_suspense_account")}
          field={{
            id: "defaultSuspenseAcc",
            getListUrl: Urls.data_SuspenseAccount,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultSuspenseAcc",
              data.defaultSuspenseAcc
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_service_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultServiceAccount"
          data={settings?.accountsSettings}
          label={t("default_service_account")}
          field={{
            id: "defaultServiceAccount",
            getListUrl: Urls.data_SalesAccount,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultServiceAccount",
              data.defaultServiceAccount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_bank_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultBankAcc"
          data={settings?.accountsSettings}
          label={t("default_bank_account")}
          field={{
            id: "defaultBankAcc",
            getListUrl: Urls.data_BankAccounts,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultBankAcc",
              data.defaultBankAcc
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_credit_card_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultCreditCardAcc"
          data={settings?.accountsSettings}
          label={t("default_credit_card_account")}
          field={{
            id: "defaultCreditCardAcc",
            getListUrl: Urls.data_BankAccounts,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultCreditCardAcc",
              data.defaultCreditCardAcc
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_loan_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultLoanAcc"
          data={settings?.accountsSettings}
          label={t("default_loan_account")}
          field={{
            id: "defaultLoanAcc",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultLoanAcc",
              data.defaultLoanAcc
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_bank_charge_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultBankChargeAccount"
          data={settings?.accountsSettings}
          label={t("default_bank_charge_account")}
          field={{
            id: "defaultBankChargeAccount",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultBankChargeAccount",
              data.defaultBankChargeAccount
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId == Countries.India && filterComponent([t("default_indirect_expense_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultIndirectExpenseAccount"
          field={{
            id: "defaultIndirectExpenseAccount",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings?.accountsSettings}
          label={t("default_indirect_expense_account")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultIndirectExpenseAccount",
              data.defaultIndirectExpenseAccount
            )
          }
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
        />
      ),
    },
    {
      condition:userSession.countryId == Countries.India &&  filterComponent([t("default_PDC_receivable_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPDCReceivableAccount"
          disabled={!settings?.accountsSettings?.allowPostPDC}
          data={settings?.accountsSettings}
          label={t("default_PDC_receivable_account")}
          field={{
            id: "defaultPDCReceivableAccount",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultPDCReceivableAccount",
              data.defaultPDCReceivableAccount
            )
          }
        />
      ),
    },
    {
      condition:userSession.countryId == Countries.India &&  filterComponent([t("default_PDC_payable_account")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPDCPayableAccount"
          disabled={!settings?.accountsSettings?.allowPostPDC}
          data={settings?.accountsSettings}
          label={t("default_PDC_payable_account")}
          field={{
            id: "defaultPDCPayableAccount",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultPDCPayableAccount",
              data.defaultPDCPayableAccount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_billwise_account")], filterText),
      element: (
        <ERPCheckbox
          id="maintainBillwiseAccount"
          checked={settings?.accountsSettings?.maintainBillwiseAccount}
          data={settings?.accountsSettings}
          label={t("maintain_billwise_account")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "maintainBillwiseAccount",
              data.maintainBillwiseAccount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("billwise_mandatory")], filterText),
      element: (
        <ERPCheckbox
          id="billwiseMandatory"
          checked={settings?.accountsSettings?.billwiseMandatory}
          data={settings?.accountsSettings}
          label={t("billwise_mandatory")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "billwiseMandatory",
              data.billwiseMandatory
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("do_not_post_accounts_for_each_cash_sales")], filterText),
      element: (
        <ERPCheckbox
          id="doNotPostAccountsForEachCashSales"
          checked={settings?.accountsSettings?.doNotPostAccountsForEachCashSales}
          data={settings?.accountsSettings}
          label={t("do_not_post_accounts_for_each_cash_sales")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "doNotPostAccountsForEachCashSales",
              data.doNotPostAccountsForEachCashSales
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId == Countries.India && filterComponent([t("allow_PDC_to_post")], filterText),
      element: (
        <ERPCheckbox
          id="allowPostPDC"
          checked={settings?.accountsSettings?.allowPostPDC}
          data={settings?.accountsSettings}
          label={t("allow_PDC_to_post")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "allowPostPDC",
              data.allowPostPDC
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId == Countries.India && filterComponent([t("enable_estimate_for_payments_and_receipts")], filterText),
      element: (
        <ERPCheckbox
          id="enableCPEandCRE"
          disabled
          checked={settings?.accountsSettings?.enableCPEandCRE}
          data={settings?.accountsSettings}
          label={t("enable_estimate_for_payments_and_receipts")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "enableCPEandCRE",
              data.enableCPEandCRE
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("print_after_save")], filterText),
      element: (
        <ERPCheckbox
          id="printAccAftersave"
          checked={settings?.accountsSettings?.printAccAftersave}
          data={settings?.accountsSettings}
          label={t("print_after_save")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "printAccAftersave",
              data.printAccAftersave
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_tax")], filterText),
      element: (
        <ERPCheckbox
        id="maintainTax"
        label={t("maintain_tax")}
        data={settings?.branchSettings}
        checked={settings?.branchSettings?.maintainTax}
        onChangeData={(data) =>
          handleFieldChange("branchSettings","maintainTax", data.maintainTax)
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


  return (
    <>
    {items.filter((component) => component.condition == true).length > 0 && (
      <div>
        <div
          key={key}
          ref={(el) => (subItemsRef.current["accountsGeneral"] = el)}
        >
          <h1
            className={`h-[50px] text-[20px] dark:!bg-dark-bg-header font-normal flex items-center my-2 rounded-md px-2 ${
              blinkSection === "accountsGeneral"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
            }`}
            onClick={handleGeneralHeaderClick}
          >
            {t("general")}
          </h1>
          <div key="accountsGeneral" className="space-y-4">
            <div className={`border border-solid  dark:!bg-dark-bg  dark:!border-dark-border border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
              <div
                className={`grid ${
                  isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${
                        gridClass ||
                        "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                      } gap-4 items-center justify-center`
                }`}
              >
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
export default AccountsGeneralFilterableComponents;
