import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
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

const AccountsHrFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("default_incentive_account_1")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultIncentiveAcc1"
          data={settings?.accountsSettings}
          label={t("default_incentive_account_1")}
          field={{
            id: "defaultIncentiveAcc1",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultIncentiveAcc1",
              data.defaultIncentiveAcc1
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_incentive_account_2")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultIncentiveAcc2"
          data={settings?.accountsSettings}
          label={t("default_incentive_account_2")}
          field={{
            id: "defaultIncentiveAcc2",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultIncentiveAcc2",
              data.defaultIncentiveAcc2
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("salesman_incentive")], filterText),
      element: (
        <ERPInput
          id="salesmanIncentive"  
          min={0}
          value={settings?.miscellaneousSettings?.salesmanIncentive}
          data={settings?.miscellaneousSettings}
          type="number"
          label={t("salesman_incentive")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "salesmanIncentive",
              parseFloat(data.salesmanIncentive)
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_incentive_ledger")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultIncentiveLedger"
          field={{
            id: "defaultIncentiveLedger",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Incentive_Given}`,
            valueKey: "id",
            labelKey: "name",
          }}
          data={settings?.miscellaneousSettings}
          label={t("default_incentive_ledger")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "defaultIncentiveLedger",
              data.defaultIncentiveLedger
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("unpost_SP_deductions_to_account")], filterText),
      element: (
        <ERPCheckbox
          id="unPostSPDeductionstoAccount"
          checked={settings?.accountsSettings?.unPostSPDeductionstoAccount}
          data={settings?.accountsSettings}
          label={t("unpost_SP_deductions_to_account")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "unPostSPDeductionstoAccount",
              data.unPostSPDeductionstoAccount
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("load_costcentre_wise_employees_for_salary_process")], filterText),
      element: (
        <ERPCheckbox
          id="loadCostcentrewiseEmployeesForSalaryProcess"
          checked={settings?.accountsSettings?.loadCostcentrewiseEmployeesForSalaryProcess}
          data={settings?.accountsSettings}
          label={t("load_costcentre_wise_employees_for_salary_process")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "loadCostcentrewiseEmployeesForSalaryProcess",
              data.loadCostcentrewiseEmployeesForSalaryProcess
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


  return (
    <>
    {items.filter((component) => component.condition == true).length > 0 && (
      <div>
        <div
          key={key}
          ref={(el) => (subItemsRef.current["accountsHR"] = el)}
        >
          <h1
            className={`h-[50px] text-[20px] dark:!bg-dark-bg-header dark:!text-dark-text font-normal flex items-center my-2 rounded-md px-2 ${
              blinkSection === "accountsHR"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
            }`}
            onClick={handleGeneralHeaderClick}
          >
            {t("hr")}
          </h1>
          <div key="accountsHR" className="space-y-4">
            <div className={`border border-solid dark:!bg-dark-bg dark:!border-dark-border border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
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
export default AccountsHrFilterableComponents;
