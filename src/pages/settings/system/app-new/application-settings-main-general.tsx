import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import Urls from "../../../../redux/urls";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
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

const MainGeneralFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("business_type")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "maintainBusinessType",
            valueKey: "value",
            labelKey: "label",
          }}
          id="maintainBusinessType"
          label={t("business_type")}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "maintainBusinessType",
              data.maintainBusinessType
            )
          }
          options={[
            { value: "General", label: "General" },
            { value: "Distribution", label: "Distribution" },
            { value: "Hypermarket", label: "Hypermarket" },
            { value: "Supermarket", label: "Supermarket" },
            { value: "Textiles", label: "Textiles" },
            { value: "Restaurant", label: "Restaurant" },
            { value: "Opticals", label: "Opticals" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("currency_main")], filterText),
      element: (
        <ERPDataCombobox
          id="currency"
          field={{
            id: "currency",
            getListUrl: Urls.data_currencies,
            valueKey: "id",
            labelKey: "name",
          }}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange("mainSettings", "currency", data.currency)
          }
          label={t("currency_main")}
        />
      ),
    },
    {
      condition: filterComponent([t("currency_format")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "showNumberFormat",
            valueKey: "value",
            labelKey: "label",
          }}
          id="showNumberFormat"
          label={t("currency_format")}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "showNumberFormat",
              data.showNumberFormat
            )
          }
          options={[
            { value: "Millions", label: "Millions" },
            { value: "Lakhs", label: "Lakhs" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("decimal_points")], filterText),
      element: (
        <ERPDataCombobox
          field={{ id: "decimalPoints", valueKey: "value", labelKey: "label" }}
          id="decimalPoints"
          label={t("decimal_points")}
          data={settings?.mainSettings}
          defaultData={settings?.mainSettings?.decimalPoints}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "decimalPoints",
              data.decimalPoints
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
      condition: filterComponent([t("select_country")], filterText),
      element: (
        <ERPDisableEnable targetCount={15}>
          {(hasPermitted) => (
            <ERPDataCombobox
              id="countryName"
              disabled={!hasPermitted}
              field={{
                id: "countryName",
                getListUrl: Urls.data_countries,
                valueKey: "id",
                labelKey: "name",
              }}
              data={settings.branchSettings}
              label={t("select_country")}
              onChangeData={(data) =>
                handleFieldChange(
                  "branchSettings",
                  "countryName",
                  data.countryName
                )
              }
            />
          )}
        </ERPDisableEnable>
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("rounding_method_global")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "roundingMethodGLOBAL",
            valueKey: "value",
            labelKey: "label",
          }}
          id="roundingMethodGLOBAL"
          label={t("rounding_method_global")}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "roundingMethodGLOBAL",
              data.roundingMethodGLOBAL
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
      condition:
        userSession.countryId != Countries.India &&
        filterComponent([t("rounding_method")], filterText),
      element: (
        <ERPDataCombobox
          field={{ id: "roundingMethod", valueKey: "value", labelKey: "label" }}
          id="roundingMethod"
          label={t("rounding_method")}
          data={settings?.mainSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "roundingMethod",
              data.roundingMethod
            )
          }
          options={[
            { value: "Normal", label: "Normal" },
            { value: "No Rounding", label: "No Rounding" },
            { value: "Ceiling", label: "Ceiling" },
            { value: "Floor", label: "Floor" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent(
        [t("keep_user_actions_(in_days)")],
        filterText
      ),
      element: (
        <ERPInput
          id="keepUserActionInDays"
          value={settings?.inventorySettings?.keepUserActionInDays}
          data={settings?.inventorySettings}
          label={t("keep_user_actions_(in_days)")}
          placeholder={t("enter_number_of_days")}
          type="number"
          onChangeData={(data) =>
            handleFieldChange(
              "inventorySettings",
              "keepUserActionInDays",
              parseInt(data.keepUserActionInDays, 10)
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("auto_update_release_up_to")], filterText),
      element: (
        <ERPInput
          id="autoUpdateReleaseUpTo"
          label={t("auto_update_release_up_to")}
          data={settings?.mainSettings}
          value={settings?.mainSettings?.autoUpdateReleaseUpTo}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "autoUpdateReleaseUpTo",
              data.autoUpdateReleaseUpTo
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_cost_center")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultCostCenterID"
          data={settings?.accountsSettings}
          label={t("cost_center")}
          field={{
            id: "defaultCostCenterID",
            getListUrl: Urls.data_costcentres,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "defaultCostCenterID",
              data.defaultCostCenterID
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("report_mode")], filterText),
      element: (
        <ERPDataCombobox
          id="reportMode"
          field={{ id: "reportMode", valueKey: "value", labelKey: "label" }}
          data={settings.branchSettings}
          label={t("report_mode")}
          onChangeData={(data) =>
            handleFieldChange("branchSettings", "reportMode", data.reportMode)
          }
          options={[
            { value: "Classic", label: "Classic" },
            { value: "Standard", label: "Standard" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("file_attachment_method")], filterText),
      element: (
        <ERPDataCombobox
          id="fileAttachmentMethod"
          field={{
            id: "fileAttachmentMethod",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings.branchSettings}
          label={t("file_attachment_method")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "fileAttachmentMethod",
              data.fileAttachmentMethod
            )
          }
          options={[
            { value: "No", label: "No" },
            { value: "File System", label: "File System" },
            { value: "Cloud", label: "Cloud" },
          ]}
        />
      ),
    },
    {
      condition:
        settings.branchSettings?.fileAttachmentMethod === "File System" &&
        filterComponent([t("shared_folder")], filterText),
      element: (
        <ERPInput
          id="fileAttachmentFolder"
          value={settings.branchSettings?.fileAttachmentFolder}
          data={settings.branchSettings}
          label={t("shared_folder")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "fileAttachmentFolder",
              data.fileAttachmentFolder
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_reminders")], filterText),
      element: (
        <ERPCheckbox
          id="showReminders"
          label={t("show_reminders")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.showReminders}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "showReminders",
              data.showReminders
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("show_user_messages")], filterText),
      element: (
        <ERPCheckbox
          id="showUserMessages"
          label={t("show_user_messages")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.showUserMessages}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "showUserMessages",
              data.showUserMessages
            )
          }
        />
      ),
    },
    {
      condition:
        userSession.countryId === Countries.India &&
        filterComponent([t("enable_day_end")], filterText),
      element: (
        <ERPCheckbox
          id="enableDayEnd"
          label={t("enable_day_end")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.enableDayEnd}
          onChangeData={(data) =>
            handleFieldChange("mainSettings", "enableDayEnd", data.enableDayEnd)
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("save_modified_transaction_summary")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="saveModTransSum"
          label={t("save_modified_transaction_summary")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.saveModTransSum}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "saveModTransSum",
              data.saveModTransSum
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("show_financial_year_selector_on_startup")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="showFinancialYearSelector"
          label={t("show_financial_year_selector_on_startup")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.showFinancialYearSelector}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "showFinancialYearSelector",
              data.showFinancialYearSelector
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("maintain_auto_posting_transaction")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="autoPostingTransaction"
          label={t("maintain_auto_posting_transaction")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.autoPostingTransaction}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "autoPostingTransaction",
              data.autoPostingTransaction
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("allow_posted_transactions_edit")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="allowEditPostedTransactions"
          label={t("allow_posted_transactions_edit")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.allowEditPostedTransactions}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "allowEditPostedTransactions",
              data.allowEditPostedTransactions
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_multilanguage")], filterText),
      element: (
        <ERPCheckbox
          id="maintainMultilanguage__"
          label={t("maintain_multilanguage")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.maintainMultilanguage__}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "maintainMultilanguage__",
              data.maintainMultilanguage__
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_24_hours_business")], filterText),
      element: (
        <ERPCheckbox
          id="enable24Hours"
          checked={settings?.accountsSettings?.enable24Hours}
          data={settings?.accountsSettings}
          label={t("enable_24_hours_business")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "enable24Hours",
              data.enable24Hours
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("maintain_multi_currency_transactions")],
        filterText
      ),
      element: (
        <ERPCheckbox
          id="maintainMultiCurrencyTransactions"
          checked={
            settings?.accountsSettings?.maintainMultiCurrencyTransactions
          }
          data={settings?.accountsSettings}
          label={t("maintain_multi_currency_transactions")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "maintainMultiCurrencyTransactions",
              data.maintainMultiCurrencyTransactions
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_cost_center")], filterText),
      element: (
        <ERPCheckbox
          id="maintainCostCenter"
          checked={settings?.accountsSettings?.maintainCostCenter}
          data={settings?.accountsSettings}
          label={t("maintain_cost_center")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "maintainCostCenter",
              data.maintainCostCenter
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_projects/job")], filterText),
      element: (
        <ERPCheckbox
          id="maintainProjectSite"
          checked={settings?.accountsSettings?.maintainProjectSite}
          data={settings?.accountsSettings}
          label={t("maintain_projects/job")}
          onChangeData={(data) =>
            handleFieldChange(
              "accountsSettings",
              "maintainProjectSite",
              data.maintainProjectSite
            )
          }
        />
      ),
    },
    {
      condition: filterComponent(
        [t("allow_postdated_transaction")],
        filterText
      ),
      element: (
        <div className="flex items-center">
          <ERPCheckbox
            id="allowPostdatedTrans"
            label={t("allow_postdated_transaction")}
            data={settings?.mainSettings}
            checked={settings?.mainSettings?.allowPostdatedTrans}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "allowPostdatedTrans",
                data.allowPostdatedTrans
              )
            }
          />
          <ERPInput
            id="postDatedTransInNumbers"
            type="number"
            label=" "
            data={settings?.mainSettings}
            className="min-w-20 ml-2 mt-1"
            value={settings?.mainSettings?.postDatedTransInNumbers}
            disabled={!settings?.mainSettings?.allowPostdatedTrans}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "postDatedTransInNumbers",
                data.postDatedTransInNumbers
              )
            }
          />
          <label className=" ml-2 mr-2 block form-check-label text-gray-700">
            {t("days")}
          </label>
        </div>
      ),
    },
    {
      condition: filterComponent(
        [t("allow_past_dated_transaction")],
        filterText
      ),
      element: (
        <div className="flex items-center">
          <ERPCheckbox
            id="allowPredatedTrans"
            label={t("allow_past_dated_transaction")}
            data={settings?.mainSettings}
            checked={settings?.mainSettings?.allowPredatedTrans}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "allowPredatedTrans",
                data.allowPredatedTrans
              )
            }
          />
          <ERPInput
            id="preDatedTransInNumbers"
            label=" "
            type="number"
            data={settings?.mainSettings}
            className="min-w-20 ml-2 mt-1"
            value={settings?.mainSettings?.preDatedTransInNumbers}
            disabled={!settings?.mainSettings?.allowPredatedTrans}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "preDatedTransInNumbers",
                data.preDatedTransInNumbers
              )
            }
          />
          <label className=" ml-2 mr-2 block form-check-label text-gray-700">
            Days
          </label>
        </div>
      ),
    },
    {
      condition:
        filterComponent(
          [t("maintain_separate_prefix_for_cash_sales")],
          filterText
        ) && userSession.countryId != Countries.India,
      element: (
        <ERPCheckbox
          id="maintainSeperatePrefixforCashSales"
          label={t("maintain_separate_prefix_for_cash_sales")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.maintainSeperatePrefixforCashSales}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "maintainSeperatePrefixforCashSales",
              data.maintainSeperatePrefixforCashSales
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("enable_second_display")], filterText),
      element: (
        <ERPCheckbox
          id="enableSecondDisplay"
          label={t("enable_second_display")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.enableSecondDisplay}
          onChangeData={(data) =>
            handleFieldChange(
              "mainSettings",
              "enableSecondDisplay",
              data.enableSecondDisplay
            )
          }
        />
      ),
    },
   
    {
      condition:
        filterComponent([t("enable_day_end")], filterText) &&
        userSession.countryId === Countries.India,
      element: (
        <ERPCheckbox
          id="enableDayEnd"
          label={t("enable_day_end")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.enableDayEnd}
          onChangeData={(data) =>
            handleFieldChange("mainSettings", "enableDayEnd", data.enableDayEnd)
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
            ref={(el) => (subItemsRef.current["mainGeneral"] = el)}
          >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "mainGeneral"
                  ? "blink-animation bg-[#f1f1f1]"
                  : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}
            >
              {t("general")}
            </h1>
            <div key="mainGeneral" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                      ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                      : `${gridClass ||
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
export default MainGeneralFilterableComponents;
