"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import { settingGroups, sidebarItems } from './application-settings-virtual-data'
import ERPDataCombobox from '../../../../components/ERPComponents/erp-data-combobox'
import ERPInput from '../../../../components/ERPComponents/erp-input';
import { useTranslation } from 'react-i18next'
import Urls from '../../../../redux/urls'
import ERPCheckbox from '../../../../components/ERPComponents/erp-checkbox'
import { useAppSelector } from '../../../../utilities/hooks/useAppDispatch'
import { RootState } from '../../../../redux/store'
import ERPButton from '../../../../components/ERPComponents/erp-button'
import { Countries } from '../../../../redux/slices/user-session/reducer'
import { APIClient } from '../../../../helpers/api-client'
import { useApplicationMainSettings } from '../../../../utilities/hooks/use-application-main-settings'
import { ApplicationSettingsType } from '../application-settings-types/application-settings-types';
import { ApplicationMainSettings } from '../application-settings-types/application-settings-types-main';
import ERPDisableEnable from '../../../../components/ERPComponents/erp-disable-inable';
import { LedgerType } from '../../../../enums/ledger-types';
import { isNullOrUndefinedOrEmpty } from '../../../../utilities/Utils';
import { useApplicationGstSettings } from '../../../../utilities/hooks/use-application-gst-settings';
import EInvoiceTaxPro from '../e-invoice-taxpro';
import EWBTaxPro from '../ewb-taxpro';
import { systemCodeApplicationMiscSettings, useApplicationMiscSettings } from '../../../../utilities/hooks/use-application-misc-settings';


const api = new APIClient()
const LayoutToggle = ({ onToggle }: { onToggle: (isCompact: boolean) => void }) => {
  const [isCompactView, setIsCompactView] = useState(false)
  const handleToggle = () => {
    const newViewState = !isCompactView
    setIsCompactView(newViewState)
    onToggle(newViewState)
  }

  return (
    <div className="flex items-center justify-end mb-4">
      <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2 text-sm">  {isCompactView ? 'Compact View' : 'Expanded View'}  </span>
        <div className="relative">
          <input type="checkbox" className="sr-only" checked={isCompactView} onChange={handleToggle} />
          <div className={`w-10 h-4 rounded-full shadow-inner transition-colors ${isCompactView ? 'bg-blue-500' : 'bg-gray-300'}  `}></div>
          <div className={`dot absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow transition-transform ${isCompactView ? 'translate-x-full' : ''}`}></div>
        </div>
      </label>
    </div>
  )
}
export default function SettingsPage() {
  const [isCompactView, setIsCompactView] = useState(false)
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const { dataLoaded, systemCode, setAddSystemCode, addSystemCode, SystemCodeAddData, setSystemCodeAddData, isSavingSystemCode, postSystemCode, loadSystemCode, getSystemCode } = useApplicationMiscSettings();
  // const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);
  const { t } = useTranslation("applicationSettings");
  const [isLastSystemGeneratedBarcode, setIsLastSystemGeneratedBarcode] = useState(false);
  const [activeSection, setActiveSection] = useState(settingGroups[0]?.id || 0);
  const [activeSubItem, setActiveSubItem] = useState(settingGroups[0]?.settings?.[0]?.key || "");
  const [activeSubCatItem, setActiveSubCatItem] = useState(settingGroups[0]?.settings?.[0]?.subSettings?.[0]?.key || "");
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})
  const subItemsRef = useRef<Record<string, HTMLElement | null>>({})
  const subItemsCatRef = useRef<Record<string, HTMLElement | null>>({})
  const { settings, setSettings, verifyOtp, sendOtp } = useApplicationMainSettings();
  const { PopupComponent, showEInvoicePopup, setShowEInvoicePopup, setShowEWBPopup, handleShowComponent, showEWBPopup } = useApplicationGstSettings();
  const handleFieldChange = useCallback(
    <T extends keyof ApplicationSettingsType>(type: T, settingName: keyof ApplicationSettingsType[T], value: any
    ) => {
      setSettings((prevSettings = {} as ApplicationSettingsType) => {
        if (
          settingName === "allowSalesRouteArea" &&
          value === false &&
          type === "mainSettings"
        ) {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
              maintainSalesRouteCreditLimit: false,
            },
          };
        }
        else if (settingName === 'allowSalesCounter' && value == false &&
          type === "mainSettings") {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
              allowUserwiseCounter: false,
              enableAuthorizationforShiftClose: false
            },
          };
        } else {
          return {
            ...prevSettings,
            [type]: {
              ...prevSettings[type],
              [settingName]: value,
            },
          };
        }
      });
    },
    []
  );
  const scrollToSection = (sectionId: string, subItemKey?: string, subItemsCatKey?: string) => {
    if (subItemsCatKey) {
      subItemsCatRef.current[subItemsCatKey]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    else if (subItemKey) {
      subItemsRef.current[subItemKey]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      sectionsRef.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset to trigger slightly before the section top
      // Check main sections
      for (const section of settingGroups) {
        const element = sectionsRef.current[section.id]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            // Check sub-items within the active section
            for (const setting of section.settings) {
              const subElement = subItemsRef.current[setting.key]
              if (subElement) {
                const subOffsetTop = subElement.offsetTop
                const subOffsetHeight = subElement.offsetHeight
                if (scrollPosition >= subOffsetTop && scrollPosition < subOffsetTop + subOffsetHeight) {
                  setActiveSubItem(setting.key)
                  if (setting.subSettings != undefined && setting.subSettings.length > 0) {
                    for (const subSetting of setting.subSettings) {
                      const subElement = subItemsRef.current[subSetting.key]
                      if (subElement) {
                        const subOffsetTop = subElement.offsetTop
                        const subOffsetHeight = subElement.offsetHeight
                        if (scrollPosition >= subOffsetTop && scrollPosition < subOffsetTop + subOffsetHeight) {
                          setActiveSubCatItem(subSetting.key)
                          break
                        }
                      }
                    }
                  }
                  else {
                    break
                  }

                }
              }
            }
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark">
      <aside className="md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-screen fixed z-10 bg-[#fafafa]">
        <h1 className="font-medium text-xl p-5 mb-5">Settings</h1>
        <div className="flex flex-col overflow-y-auto pb-24 h-full mt-4">
          {settingGroups.map((item) => (
            <div key={item.id}>
              <button
                className={`  relative flex items-center w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 duration-200 border-r-4 text-left
                  ${item.id === activeSection ? "bg-gray-300 border-primary text-primary" : "border-transparent hover:bg-gray-200 hover:border-gray-400"}`}
                onClick={() => scrollToSection(item.id)}>
                <span className="mx-4 md:mx-2 text-sm">{item.label}</span>
              </button>
              {item.id === activeSection && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.settings.map((set) => (
                    <>
                      <button
                        key={set.key}
                        className={`w-full px-3 md:px-4 py-1.5 text-left text-sm ${set.key === activeSubItem ? "bg-gray-300 border-primary text-primary" : "border-transparent hover:bg-gray-200"}  `}
                        onClick={() => scrollToSection(item.id, set.key)} >
                        {settingGroups.find(group => group.id === item.id)?.settings.find(setting => setting.key === set.key)?.label}
                      </button>
                      {
                        set.key === activeSubItem && (
                          <div className="ml-4 mt-1 space-y-1">
                            {set?.subSettings?.map((subCat) => (
                              <button
                                key={subCat.key}
                                className={`w-full px-3 md:px-4 py-1.5 text-left text-sm ${subCat.key === activeSubCatItem ? "bg-gray-300 border-primary text-primary" : "border-transparent hover:bg-gray-200"}  `}
                                onClick={() => scrollToSection(item.id, subCat.key)} >
                                {subCat?.label}
                              </button>
                            ))}
                          </div>
                        )
                      }
                    </>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 ml-[200px] lg:ml-[300px]">
        <div className="bg-[#fafafa] shadow-md overflow-hidden">
          <div className="p-6">
            {/* {settingGroups.map((group, index) => ( */}
            <LayoutToggle onToggle={setIsCompactView} />
            <section
              key="main"
              ref={el => sectionsRef.current['main'] = el}
              className="mb-8 last:mb-0">
              <div className="space-y-6">
                <div key="mainGeneral" ref={el => subItemsRef.current["mainGeneral"] = el}>
                  <h1 className="text-2xl font-bold">General</h1>
                  <div key="mainGeneral" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className={`  ${isCompactView ? 'grid grid-cols-1 gap-6' : 'grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'}`}>
                        <ERPDataCombobox
                          field={{
                            id: "maintainBusinessType",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="maintainBusinessType"
                          label={t("business_type")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleFieldChange("mainSettings", "maintainBusinessType", data.maintainBusinessType)}
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
                        <ERPDataCombobox
                          id="currency"
                          field={{
                            id: "currency",
                            // required: true,
                            getListUrl: Urls.data_currencies,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleFieldChange("mainSettings", "currency", data.currency)}
                          label={t("currency_main")}
                        />
                        <ERPDataCombobox
                          field={{
                            id: "showNumberFormat",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="showNumberFormat"
                          label={t("currency_format")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleFieldChange("mainSettings", "showNumberFormat", data.showNumberFormat)}
                          options={[
                            { value: "Millions", label: "Millions" },
                            { value: "Lakhs", label: "Lakhs" },
                          ]}
                        />
                        <ERPDataCombobox
                          field={{
                            id: "decimalPoints",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="decimalPoints"
                          label={t("decimal_points")}
                          data={settings?.mainSettings}
                          defaultData={settings?.mainSettings?.decimalPoints}
                          onChangeData={(data) => handleFieldChange("mainSettings", "decimalPoints", data.decimalPoints)}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
                        />
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
                                handleFieldChange("branchSettings", "countryName", data.countryName)
                              }
                            />
                          )}
                        </ERPDisableEnable>

                        {userSession.countryId === Countries.India && (
                          <ERPDataCombobox
                            field={{
                              id: "roundingMethodGLOBAL",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            id="roundingMethodGLOBAL"
                            label={t("rounding_method_global")}
                            data={settings?.mainSettings}
                            onChangeData={(data) => handleFieldChange("mainSettings", "roundingMethodGLOBAL", data.roundingMethodGLOBAL)}
                            options={[
                              { value: "Normal", label: "Normal" },
                              { value: "No Rounding", label: "No Rounding" },
                              { value: "Ceiling", label: "Ceiling" },
                              { value: "Floor", label: "Floor" },
                              { value: "Round to 0.25", label: "Round to 0.25" },
                              { value: "Round to 0.50", label: "Round to 0.50" },
                              { value: "Round to 0.10", label: "Round to 0.10" },
                              { value: "Floor Round to 0.50", label: "Floor Round to 0.50", },
                              { value: "Floor Round to 0.25", label: "Floor Round to 0.25", },
                              { value: "Floor Round to 0.10", label: "Floor Round to 0.10", },
                              { value: "Not Set", label: "Not Set" },
                              { value: "Round to 0.010", label: "Round to 0.010" },
                            ]}
                          />
                        )}

                        {userSession.countryId != Countries.India && (
                          <ERPDataCombobox
                            field={{
                              id: "roundingMethod",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            id="roundingMethod"
                            label={t("rounding_method")}
                            data={settings?.mainSettings}
                            onChangeData={(data) => handleFieldChange("mainSettings", "roundingMethod", data.roundingMethod)}
                            options={[
                              { value: "Normal", label: "Normal" },
                              { value: "No Rounding", label: "No Rounding" },
                              { value: "Ceiling", label: "Ceiling" },
                              { value: "Floor", label: "Floor" },
                            ]}
                          />
                        )}
                      </div>

                      <div className={`${isCompactView ? 'grid grid-cols-1 gap-6' : 'grid xxl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 gap-6'}`}>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPostdatedTrans"
                            label={t("allow_postdated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPostdatedTrans}
                            onChangeData={(data) => handleFieldChange("mainSettings", "allowPostdatedTrans", data.allowPostdatedTrans)}
                          />
                          <ERPInput
                            id="postDatedTransInNumbers"
                            type="number"
                            label=" "
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.postDatedTransInNumbers}
                            disabled={!settings?.mainSettings?.allowPostdatedTrans}
                            onChangeData={(data) => handleFieldChange("mainSettings", "postDatedTransInNumbers", data.postDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPredatedTrans"
                            label={t("allow_past_dated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPredatedTrans}
                            onChangeData={(data) => handleFieldChange("mainSettings", "allowPredatedTrans", data.allowPredatedTrans)}
                          />
                          <ERPInput
                            id="preDatedTransInNumbers"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.preDatedTransInNumbers}
                            disabled={!settings?.mainSettings?.allowPredatedTrans}
                            onChangeData={(data) => handleFieldChange("mainSettings", "preDatedTransInNumbers", data.preDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 items-center justify-center">
                        <ERPCheckbox
                          id="showReminders"
                          label={t("show_reminders")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showReminders}
                          onChangeData={(data) => handleFieldChange("mainSettings", "showReminders", data.showReminders)}
                        />
                        <ERPCheckbox
                          id="showUserMessages"
                          label={t("show_user_messages")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showUserMessages}
                          onChangeData={(data) => handleFieldChange("mainSettings", "showUserMessages", data.showUserMessages)}
                        />
                        {userSession.countryId === Countries.India && (
                          <ERPCheckbox
                            id="enableDayEnd"
                            label={t("enable_day_end")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.enableDayEnd}
                            onChangeData={(data) => handleFieldChange("mainSettings", "enableDayEnd", data.enableDayEnd)}
                          />
                        )}
                        <ERPCheckbox
                          id="saveModTransSum"
                          label={t("save_modified_transaction_summary")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.saveModTransSum}
                          onChangeData={(data) => handleFieldChange("mainSettings", "saveModTransSum", data.saveModTransSum)}
                        />
                        <ERPCheckbox
                          id="showFinancialYearSelector"
                          label={t("show_financial_year_selector_on_startup")}
                          data={settings?.branchSettings}
                          checked={settings?.branchSettings?.showFinancialYearSelector}
                          onChangeData={(data) => handleFieldChange("branchSettings", "showFinancialYearSelector", data.showFinancialYearSelector)}
                        />
                        <ERPCheckbox
                          id="autoPostingTransaction"
                          label={t("maintain_auto_posting_transaction")}
                          data={settings?.branchSettings}
                          checked={settings?.branchSettings?.autoPostingTransaction}
                          onChangeData={(data) => handleFieldChange("branchSettings", "autoPostingTransaction", data.autoPostingTransaction)}
                        />
                        <ERPCheckbox
                          id="allowEditPostedTransactions"
                          label={t("allow_posted_transactions_edit")}
                          data={settings?.branchSettings}
                          checked={settings?.branchSettings?.allowEditPostedTransactions}
                          onChangeData={(data) => handleFieldChange("branchSettings", "allowEditPostedTransactions", data.allowEditPostedTransactions)}
                        />
                        <ERPInput
                          id="keepUserActionInDays"
                          value={settings?.inventorySettings?.keepUserActionInDays}
                          data={settings?.inventorySettings}
                          label={t("keep_user_actions_(in_days)")}
                          placeholder={t("enter_number_of_days")}
                          type="number"
                          onChangeData={(data) =>
                            handleFieldChange("inventorySettings", "keepUserActionInDays", parseInt(data.keepUserActionInDays, 10))
                          }
                        />
                        <ERPCheckbox
                          id="maintainMultilanguage__"
                          label={t("maintain_multilanguage")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.maintainMultilanguage__}
                          onChangeData={(data) => handleFieldChange("mainSettings", "maintainMultilanguage__", data.maintainMultilanguage__)}
                        />
                        <ERPCheckbox
                          id="enable24Hours"
                          checked={settings?.accountsSettings?.enable24Hours}
                          data={settings?.accountsSettings}
                          label={t("enable_24_hours_business")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'enable24Hours', data.enable24Hours)}
                        />
                        <ERPCheckbox
                          id="maintainMultiCurrencyTransactions"
                          checked={settings?.accountsSettings?.maintainMultiCurrencyTransactions}
                          data={settings?.accountsSettings}
                          label={t("maintain_multi_currency_transactions")}
                          onChangeData={(data) =>
                            handleFieldChange("accountsSettings", 'maintainMultiCurrencyTransactions', data.maintainMultiCurrencyTransactions)}
                        />
                        <ERPInput
                          id="autoUpdateReleaseUpTo"
                          label={t("auto_update_release_up_to")}
                          type="number"
                          data={settings?.mainSettings}
                          value={settings?.mainSettings?.autoUpdateReleaseUpTo}
                          onChangeData={(data) => handleFieldChange("mainSettings", "autoUpdateReleaseUpTo", data.autoUpdateReleaseUpTo)}
                        />
                        <ERPCheckbox
                          id="maintainCostCenter"
                          checked={settings?.accountsSettings?.maintainCostCenter}
                          data={settings?.accountsSettings}
                          label={t("maintain_cost_center")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'maintainCostCenter', data.maintainCostCenter)}
                        />
                        <ERPDataCombobox
                          id="defaultCostCenterID"
                          data={settings?.accountsSettings}
                          label={t("default_cost_center")}
                          field={{
                            id: "defaultCostCenterID",
                            getListUrl: Urls.data_costcentres,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultCostCenterID', data.defaultCostCenterID)}
                        />
                        <ERPCheckbox
                          id="maintainProjectSite"
                          checked={settings?.accountsSettings?.maintainProjectSite}
                          data={settings?.accountsSettings}
                          label={t("maintain_projects/job")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'maintainProjectSite', data.maintainProjectSite)}
                        />
                        <ERPDataCombobox
                          id="reportMode"
                          field={{
                            id: "reportMode",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          data={settings.branchSettings}
                          label={t("report_mode")}
                          onChangeData={(data) => handleFieldChange("branchSettings", "reportMode", data.reportMode)}
                          options={[
                            { value: "Classic", label: "Classic" },
                            { value: "Standard", label: "Standard" },
                          ]}
                        />
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
                            handleFieldChange("branchSettings", "fileAttachmentMethod", data.fileAttachmentMethod)
                          }
                          options={[
                            { value: "No", label: "No" },
                            { value: "File System", label: "File System" },
                            { value: "Cloud", label: "Cloud" },
                          ]}
                        />
                        {settings.branchSettings?.fileAttachmentMethod === "File System" && (
                          <ERPInput
                            id="fileAttachmentFolder"
                            value={settings.branchSettings?.fileAttachmentFolder}
                            data={settings.branchSettings}
                            label={t("shared_folder")}
                            onChangeData={(data) =>
                              handleFieldChange("branchSettings", "fileAttachmentFolder", data.fileAttachmentFolder)
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6">
                        {userSession.countryId != Countries.India && (
                          <ERPCheckbox
                            id="maintainSeperatePrefixforCashSales"
                            label={t("maintain_separate_prefix_for_cash_sales")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.maintainSeperatePrefixforCashSales}
                            onChangeData={(data) => handleFieldChange("mainSettings", "maintainSeperatePrefixforCashSales", data.maintainSeperatePrefixforCashSales)}
                          />
                        )}
                        <ERPCheckbox
                          id="enableSecondDisplay"
                          label={t("enable_second_display")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.enableSecondDisplay}
                          onChangeData={(data) => handleFieldChange("mainSettings", "enableSecondDisplay", data.enableSecondDisplay)}
                        />
                        <ERPCheckbox
                          id="allowSalesRouteArea"
                          label={t("allow_sales_route/area")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.allowSalesRouteArea}
                          onChangeData={(data) => handleFieldChange("mainSettings", "allowSalesRouteArea", data.allowSalesRouteArea)}
                        />
                        {userSession.countryId === Countries.India && (
                          <ERPCheckbox
                            id="enableDayEnd"
                            label={t("enable_day_end")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.enableDayEnd}
                            onChangeData={(data) => handleFieldChange("mainSettings", "enableDayEnd", data.enableDayEnd)}
                          />
                        )}
                        <ERPCheckbox
                          id="maintainSalesRouteCreditLimit"
                          label={t("maintain_sales")}
                          data={settings?.mainSettings}
                          disabled={!settings?.mainSettings?.allowSalesRouteArea}
                          checked={settings?.mainSettings?.maintainSalesRouteCreditLimit}
                          onChangeData={(data) => handleFieldChange("mainSettings", "maintainSalesRouteCreditLimit", data.maintainSalesRouteCreditLimit)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* backup */}
                <div key="mainBackup" ref={el => subItemsRef.current["mainBackup"] = el}>
                  <h1 className="text-2xl font-bold">Backup</h1>
                  <div key="mainBackup" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid grid-cols-4 gap-4 items-center justify-center">
                        <ERPDataCombobox
                          id="backupMethods"
                          data={settings.backUpSettings}
                          field={{
                            id: "backupMethods",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          onChangeData={(data: any) =>
                            handleFieldChange("backUpSettings", "backupMethods", data.backupMethods)
                          }
                          label={t("backup_methods")}
                          options={[
                            { value: "No BackUp", label: "No BackUp" },
                            { value: "BackUp On Close", label: "BackUp On Close" },
                            { value: "Scheduled BackUp", label: "Scheduled BackUp" },
                          ]}
                        />
                        {/* disabled always disabled={settings.backUpSettings?.backupMethods == "No BackUp" || true} */}
                        <ERPInput
                          id="backUpPath"
                          value={settings.backUpSettings?.backUpPath}
                          data={settings.backUpSettings}
                          disabled={settings.backUpSettings?.backupMethods == "No BackUp" || true}
                          label={t("backup_path")}
                          placeholder={t("enter_discount_threshold")}
                          onChangeData={(data: any) =>
                            handleFieldChange("backUpSettings", "backUpPath", parseFloat(data.backUpPath))
                          }
                        />
                        <ERPInput
                          id="backupDuration"
                          value={settings.backUpSettings?.backupDuration}
                          data={settings.backUpSettings}
                          label={t("duration")}
                          disabled={settings.backUpSettings?.backupMethods == "No BackUp" || settings.backUpSettings?.backupMethods == "BackUp On Close"}
                          placeholder={t("duration")}
                          type="number"
                          onChangeData={(data: any) =>
                            handleFieldChange("backUpSettings",
                              "backupDuration",
                              parseFloat(data.backupDuration)
                            )
                          }
                        />
                        <ERPCheckbox
                          id="compressBackupFile"
                          checked={settings.backUpSettings?.compressBackupFile}
                          data={settings.backUpSettings}
                          label={t("compress_backup_file")}
                          onChangeData={(data) =>
                            handleFieldChange("backUpSettings", "compressBackupFile", data.compressBackupFile)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* printing */}
                <div key="mainPrinting" ref={el => subItemsRef.current["mainPrinting"] = el}>
                  <h1 className="text-2xl font-bold">Printing</h1>
                  <div key="mainPrinting" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid grid-cols-4 gap-4 items-center justify-center">
                        {userSession.countryId == Countries.India &&
                          <ERPCheckbox
                            id="printGatePass"
                            checked={settings?.printSettings?.printGatePass}
                            data={settings?.printSettings}
                            label={t("print_gatePass")}
                            onChangeData={(data: any) =>
                              handleFieldChange("printSettings", "printGatePass", data.printGatePass)
                            }
                          />
                        }
                        <ERPCheckbox
                          id="showReprintAuthorisation"
                          checked={settings?.printSettings?.showReprintAuthorisation}
                          data={settings?.printSettings}
                          label={t("show_reprint_authorisation")}
                          onChangeData={(data: any) =>
                            handleFieldChange("printSettings",
                              "showReprintAuthorisation",
                              data.showReprintAuthorisation
                            )
                          }
                        />
                        <ERPDataCombobox
                          id="invoicePrintingStyle"
                          field={{
                            id: "invoicePrintingStyle",
                            // required: true,
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          data={settings?.branchSettings}
                          label={t("printing_style")}
                          onChangeData={(data) =>
                            handleFieldChange("branchSettings",
                              "invoicePrintingStyle",
                              data.invoicePrintingStyle
                            )
                          }
                          options={[
                            { value: "Default", label: "Default" },
                            { value: "Standard", label: "Standard" },
                          ]}
                        />
                        <ERPDataCombobox
                          id="defaultPrinter"
                          data={settings?.printSettings}
                          field={{
                            id: "defaultPrinter",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          disabled
                          onChangeData={(data: any) =>
                            handleFieldChange("printSettings", "defaultPrinter", data.defaultPrinter)
                          }
                          label={t("default_printer")}
                          options={[
                            { value: 0, label: "Canon" },
                            { value: 1, label: "HP (Hewlett-Packard)" },
                            { value: 2, label: "Epson " },
                            { value: 3, label: "Brother  " },
                            { value: 4, label: "Lexmark  " },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* multi branch */}
                <div key="mainMultiBranch" ref={el => subItemsRef.current["mainMultiBranch"] = el}>
                  <h1 className="text-2xl font-bold">Multi Branch</h1>
                  <div key="mainMultiBranch" className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 items-center justify-center">
                      <ERPDataCombobox
                        id="defaultBTOAccount"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultBTOAccount",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultBTOAccount",
                            data.defaultBTOAccount
                          )
                        }
                        label={t("default_BTO_account")}
                      />
                      <ERPDataCombobox
                        id="defaultBTIAccount"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultBTIAccount",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultBTIAccount",
                            data.defaultBTIAccount
                          )
                        }
                        label={t("default_BTI_account")}
                      />
                      <ERPCheckbox
                        id="bTOUsingMSP"
                        checked={settings?.inventorySettings?.bTOUsingMSP}
                        data={settings?.inventorySettings}
                        label={t("BTO_using_MSP")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "bTOUsingMSP", data.bTOUsingMSP)
                        }
                      />
                      <ERPCheckbox
                        id="useCostForStockTransferToBranch"
                        checked={settings?.inventorySettings?.useCostForStockTransferToBranch}
                        data={settings?.inventorySettings}
                        label={t("use_cost_for_stock_transfer_to_branch")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "useCostForStockTransferToBranch",
                            data.useCostForStockTransferToBranch
                          )
                        }
                      />
                      <ERPDisableEnable targetCount={5} >
                        {(hasPermitted) => (
                          <ERPCheckbox
                            id="maintainMasterEntry"
                            label={t("maintain_inventory_master_entry")}
                            disabled={!hasPermitted}
                            data={settings?.branchSettings}
                            checked={settings?.branchSettings?.maintainMasterEntry}
                            onChangeData={(data) =>
                              handleFieldChange("branchSettings",
                                "maintainMasterEntry",
                                data.maintainMasterEntry
                              )
                            }
                          />
                        )}
                      </ERPDisableEnable>
                      <ERPCheckbox
                        id="maintainInventoryTransactionsEntry"
                        label={t("maintain_inventory_transactions_entry")}
                        data={settings?.branchSettings}
                        checked={settings?.branchSettings?.maintainInventoryTransactionsEntry}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings",
                            "maintainInventoryTransactionsEntry",
                            data.maintainInventoryTransactionsEntry
                          )
                        }
                      />
                      <ERPDisableEnable targetCount={5}>
                        {(hasPermitted) => (
                          <ERPCheckbox
                            id="useBranchWiseSalesPrice"
                            disabled={!hasPermitted}
                            label={t("use_branch_wise_sales_price")}
                            data={settings?.branchSettings}
                            checked={settings?.branchSettings?.useBranchWiseSalesPrice}
                            onChangeData={(data) =>
                              handleFieldChange("branchSettings",
                                "useBranchWiseSalesPrice",
                                data.useBranchWiseSalesPrice
                              )
                            }
                          />
                        )}
                      </ERPDisableEnable>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center justify-center">
                      <ERPCheckbox
                        id="maintainSynchronization"
                        checked={settings?.branchSettings?.maintainSynchronization}
                        data={settings?.branchSettings}
                        label={t("maintain_synchronization")}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings",
                            "maintainSynchronization",
                            data.maintainSynchronization
                          )
                        }
                      />
                      <ERPInput
                        id="syncIntervals"
                        value={settings?.branchSettings?.syncIntervals}
                        data={settings?.branchSettings}
                        label={t("intervals_(minutes)")}
                        disabled={settings?.branchSettings?.syncMethod !== "Auto Sync" && settings?.branchSettings?.syncMethod !== "Auto Sync and Upload Only"}
                        type="number"
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings", "syncIntervals", data.syncIntervals)
                        }
                      />
                      <ERPCheckbox
                        id="refreshStockAfterSync"
                        checked={settings?.branchSettings?.refreshStockAfterSync}
                        data={settings?.branchSettings}
                        disabled={!settings?.branchSettings?.maintainSynchronization}
                        label={t("refresh_stock_after_sync")}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings",
                            "refreshStockAfterSync",
                            data.refreshStockAfterSync
                          )
                        }
                      />
                      <ERPCheckbox
                        id="refreshServerStockAfterSync"
                        checked={settings?.branchSettings?.refreshServerStockAfterSync}
                        data={settings?.branchSettings}
                        disabled={!settings?.branchSettings?.maintainSynchronization}
                        label={t("refresh_server_stock_after_sync")}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings",
                            "refreshServerStockAfterSync",
                            data.refreshServerStockAfterSync
                          )
                        }
                      />


                      <div className="max-h-[300px] w-[300px] xxl:w-[250px] xxl:max-h-[350px] p-3 border border-gray-300 rounded-sm shadow-sm">
                        <h6 className="text-center font-medium mb-5">
                          {" "}
                          {t("sync_systemCode")}
                        </h6>
                        <div className="h-32 xxl:h-40 overflow-y-scroll snap-x  mb-2 rounded-sm shadow-sm">
                          {!dataLoaded ? (
                            <div className="my-5 xxl:my-10 ">
                              <ul className="list-none text-center text-gray-500 snap-center">
                                <li className="py-5 xxl:py-10 px-3">
                                  {t("click_load_to_fetch_system_code")}
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <ul className="list-none text-center snap-center">
                              {systemCode && systemCode.length > 0 ? (
                                systemCode.map((code: systemCodeApplicationMiscSettings, index: number) => (
                                  <li className="p-1 text-xs " key={index}>
                                    {code.systemCode}{" "}
                                  </li>
                                ))
                              ) : (
                                <li className="">{"No data available"}</li>
                              )}
                            </ul>
                          )}
                        </div>
                        <li className="flex justify-end mb-2">
                          <ERPButton
                            className=" w-0 h-0 p-0 bg-white "
                            type="button"
                            onClick={() => setAddSystemCode(!addSystemCode)}
                            startIcon="ri-pencil-line"
                          />
                        </li>
                        {addSystemCode && (

                          <ERPInput
                            id="newSystemCode"
                            noLabel={true}
                            data={SystemCodeAddData}
                            value={SystemCodeAddData.systemCode}
                            onChange={(e) => {
                              setSystemCodeAddData({
                                ...SystemCodeAddData,
                                systemCode: e.target.value,
                              });
                            }}
                            placeholder={"enter_new_system_code"}
                          />

                        )}
                        <div className="flex  justify-end ">
                          <ERPButton
                            startIcon="ri-refresh-line"
                            variant="secondary"
                            className="h-6 w-8 rounded-[2px]"
                            type="button"
                            loading={loadSystemCode}
                            disabled={loadSystemCode}
                            onClick={getSystemCode}
                          />
                          <ERPButton
                            startIcon="ri-save-line"
                            className="h-6 w-8 rounded-[2px]"
                            variant="primary"
                            type="button"
                            loading={isSavingSystemCode}
                            disabled={isSavingSystemCode}
                            onClick={postSystemCode}
                          />
                        </div>
                      </div>
                    </div>

                    <ERPCheckbox
                      id="showBTINotification"
                      checked={settings?.branchSettings?.showBTINotification}
                      data={settings?.branchSettings}
                      label={t("show_BTI_notification")}
                      onChangeData={(data) =>
                        handleFieldChange("branchSettings",
                          "showBTINotification",
                          data.showBTINotification
                        )
                      }
                    />
                    <ERPCheckbox
                      id="maintainAllBranchWithCommonInventory"
                      checked={settings?.miscellaneousSettings?.maintainAllBranchWithCommonInventory}
                      data={settings?.miscellaneousSettings}
                      label={t("maintain_all_branch")}
                      onChangeData={(data) =>
                        handleFieldChange("miscellaneousSettings",
                          "maintainAllBranchWithCommonInventory",
                          data.maintainAllBranchWithCommonInventory
                        )
                      }
                    />
                    {userSession.countryId == Countries.India &&
                      <ERPCheckbox
                        id="autoSyncSIandPI_BT"
                        checked={settings?.miscellaneousSettings?.autoSyncSIandPI_BT}
                        data={settings?.miscellaneousSettings}
                        label={t("auto_sync")}
                        onChangeData={(data) =>
                          handleFieldChange("miscellaneousSettings",
                            "autoSyncSIandPI_BT",
                            data.autoSyncSIandPI_BT
                          )
                        }
                      />
                    }
                  </div>
                </div>

                {/* CRM */}
                <div key="mainCRM" ref={el => subItemsRef.current["mainCRM"] = el}>
                  <h1 className="text-2xl font-bold">CRM</h1>
                  <div key="mainCRM" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="form-row grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 items-center justify-center">
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPrivilegeCard"
                            label={t("allow_privilege_card")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) =>
                              handleFieldChange("mainSettings",
                                "allowPrivilegeCard",
                                data.allowPrivilegeCard
                              )
                            }
                          />
                          <ERPInput
                            id="previlegeCardPerc"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.previlegeCardPerc}
                            disabled={!settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) =>
                              handleFieldChange("mainSettings", "previlegeCardPerc", data.previlegeCardPerc)
                            }
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">%</label>
                        </div>
                        <ERPInput
                          id="redeeemValuesSeperatedByComma"
                          value={settings?.inventorySettings?.redeeemValuesSeperatedByComma}
                          data={settings?.inventorySettings}
                          label={t("redeem_points_(separated_by_comma)")}
                          placeholder={t("enter_redeem_points")}
                          onChangeData={(data: any) =>
                            handleFieldChange("inventorySettings",
                              "redeeemValuesSeperatedByComma",
                              data.redeeemValuesSeperatedByComma
                            )
                          }
                        />
                        <ERPCheckbox
                          id="useProductImages"
                          label={t("use_product_images")}
                          data={settings?.productsSettings}
                          checked={settings?.productsSettings?.useProductImages}
                          onChangeData={(data) =>
                            handleFieldChange("productsSettings", "useProductImages", data.useProductImages)
                          }
                        /><ERPInput
                          id="productImagePath"
                          value={settings?.productsSettings?.productImagePath}
                          data={settings?.productsSettings}
                          label={t("set_gift_shared_path")}
                          type="text"
                          placeholder={t("set_gift_shared_path")}
                          onChangeData={(data) =>
                            handleFieldChange("productsSettings", "productImagePath", data.productImagePath)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* general */}
            <section
              key="accounts"
              ref={el => sectionsRef.current['accounts'] = el}
              className="mb-8 last:mb-0">
              <div className="space-y-6">
                <div key="accountsGeneral" ref={el => subItemsRef.current["accountsGeneral"] = el}>
                  <h1 className="text-2xl font-bold">General</h1>
                  <div key="accountsGeneral" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6 items-center justify-center">
                        <ERPDataCombobox
                          id="defaultCashAcc"
                          data={settings?.accountsSettings}
                          label={t("default_cash_account")}
                          field={{
                            id: "defaultCashAcc",
                            //required: true,
                            getListUrl: Urls.data_CashLedgers,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultCashAcc', data.defaultCashAcc)}
                        />
                        <ERPDataCombobox
                          id="defaultSuspenseAcc"
                          data={settings?.accountsSettings}
                          label={t("default_suspense_account")}
                          field={{
                            id: "defaultSuspenseAcc",
                            //required: true,
                            getListUrl: Urls.data_SuspenseAccount,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultSuspenseAcc', data.defaultSuspenseAcc)}
                        />
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
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultServiceAccount', data.defaultServiceAccount)}
                        />
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
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultBankAcc', data.defaultBankAcc)}
                        />
                        <ERPDataCombobox
                          id="defaultCreditCardAcc"
                          data={settings?.accountsSettings}
                          label={t("default_credit_card_account")}
                          field={{
                            id: "defaultCreditCardAcc",
                            //required: true,
                            getListUrl: Urls.data_BankAccounts,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultCreditCardAcc', data.defaultCreditCardAcc)}
                        />
                        <ERPDataCombobox
                          id="defaultLoanAcc"
                          data={settings?.accountsSettings}
                          label={t("default_loan_account")}
                          field={{
                            id: "defaultLoanAcc",
                            //required: true,
                            getListUrl: Urls.data_acc_ledgers,
                            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultLoanAcc', data.defaultLoanAcc)}
                        />
                        <ERPDataCombobox
                          id="defaultBankChargeAccount"
                          data={settings?.accountsSettings}
                          label={t("default_bank_charge_account")}
                          field={{
                            id: "defaultBankChargeAccount",
                            //required: true,
                            getListUrl: Urls.data_acc_ledgers,
                            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultBankChargeAccount', data.defaultBankChargeAccount)}
                        />
                        {userSession.countryId == Countries.India &&
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
                              handleFieldChange("accountsSettings", 'defaultIndirectExpenseAccount', data.defaultIndirectExpenseAccount)
                            }
                            options={[
                              { value: 'All', label: 'All' },
                              { value: 'Customer', label: 'Customer' },
                              { value: 'Supplier', label: 'Supplier' },
                              { value: 'ReferalAgent', label: 'Referal Agent' },
                              { value: 'CashInHand', label: 'Cash In Hand' },
                              { value: 'BankAccount', label: 'Bank Account' },
                              { value: 'SuspenseAccount', label: 'Suspense Account' },
                              { value: 'CustomerAndSupplier', label: 'Customer and Supplier' },
                              { value: 'Cash_Bank', label: 'Cash & Bank' },
                              { value: 'Cash_Bank_Suppliers', label: 'Cash & Bank - Suppliers' },
                              { value: 'Cash_Bank_Customers', label: 'Cash & Bank - Customers' },
                              { value: 'Cash_Bank_Suppliers_Customers', label: 'Cash & Bank - Suppliers & Customers' },
                              { value: 'Sales_Account', label: 'Sales Account' },
                              { value: 'Purchase_Account', label: 'Purchase Account' },
                              { value: 'Salaries', label: 'Salaries' },
                              { value: 'Discount_Received', label: 'Discount Received' },
                              { value: 'Discount_Given', label: 'Discount Given' },
                              { value: 'Incentive_Given', label: 'Incentive Given' },
                              { value: 'Salary_Account', label: 'Salary Account' },
                              { value: 'Job_Works', label: 'Job Works' },
                              { value: 'Branch_Receivable', label: 'Branch Receivable' },
                              { value: 'SalesAndDirectIncome', label: 'Sales and Direct Income' },
                              { value: 'PurchaseAndDirectExpense', label: 'Purchase and Direct Expense' },
                              { value: 'Cash_Bank_Suppliers_Customers_Employees', label: 'Cash & Bank - Suppliers, Customers & Employees' },
                              { value: 'Cash_Bank_Customers_Employees', label: 'Cash & Bank - Customers & Employees' },
                              { value: 'Branch_Payable', label: 'Branch Payable' },
                              { value: 'Branch_Recv_Payable', label: 'Branch Receivable & Payable' },
                              { value: 'Expenses', label: 'Expenses' },
                              { value: 'Incomes', label: 'Incomes' },
                              { value: 'Credit_Note_Ledgers', label: 'Credit Note Ledgers' },
                              { value: 'DebitNote_Note_Ledgers', label: 'Debit Note Ledgers' },
                              { value: 'Liabilities_Expenses_All_Without_Salaries', label: 'Liabilities & Expenses (Excl. Salaries)' },
                              { value: 'Current_Assets', label: 'Current Assets' },
                              { value: 'Fixed_Assets', label: 'Fixed Assets' },
                              { value: 'Indirect_Expenses', label: 'Indirect Expenses' },
                              { value: 'Indirect_Income', label: 'Indirect Income' },
                            ]}
                          />}
                        <ERPCheckbox
                          id="maintainBillwiseAccount"
                          checked={settings?.accountsSettings?.maintainBillwiseAccount}
                          data={settings?.accountsSettings}
                          label={t("maintain_billwise_account")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'maintainBillwiseAccount', data.maintainBillwiseAccount)}
                        />
                        <ERPCheckbox
                          id="billwiseMandatory"
                          checked={settings?.accountsSettings?.billwiseMandatory}
                          data={settings?.accountsSettings}
                          label={t("billwise_mandatory")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'billwiseMandatory', data.billwiseMandatory)}
                        />
                        <ERPCheckbox
                          id="doNotPostAccountsForEachCashSales"
                          checked={settings?.accountsSettings?.doNotPostAccountsForEachCashSales}
                          data={settings?.accountsSettings}
                          label={t("do_not_post_accounts_for_each_cash_sales")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'doNotPostAccountsForEachCashSales', data.doNotPostAccountsForEachCashSales)}
                        />
                        {userSession.countryId == Countries.India &&
                          <ERPCheckbox
                            id="allowPostPDC"
                            checked={settings?.accountsSettings?.allowPostPDC}
                            data={settings?.accountsSettings}
                            label={t("allow_PDC_to_post")}
                            onChangeData={(data) => handleFieldChange("accountsSettings", 'allowPostPDC', data.allowPostPDC)}
                          />
                        }
                        {userSession.countryId == Countries.India &&
                          <ERPCheckbox
                            id="enableCPEandCRE"
                            disabled
                            checked={settings?.accountsSettings?.enableCPEandCRE}
                            data={settings?.accountsSettings}
                            label={t("enable_estimate_for_payments_and_receipts")}
                            onChangeData={(data) => handleFieldChange("accountsSettings", 'enableCPEandCRE', data.enableCPEandCRE)}
                          />
                        }
                        <ERPCheckbox
                          id="printAccAftersave"
                          checked={settings?.accountsSettings?.printAccAftersave}
                          data={settings?.accountsSettings}
                          label={t("print_after_save")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'printAccAftersave', data.printAccAftersave)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HR */}
                <div key="accountsHR" ref={el => subItemsRef.current["accountsHR"] = el} >
                  <h1 className="text-2xl font-bold">HR</h1>
                  <div key="accountsHR" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                        <ERPDataCombobox
                          id="defaultIncentiveAcc1"
                          data={settings?.accountsSettings}
                          label={t("default_incentive_account_1")}
                          field={{
                            id: "defaultIncentiveAcc1",
                            hasCloseButton: true,
                            getListUrl: Urls.data_acc_ledgers,
                            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultIncentiveAcc1', data.defaultIncentiveAcc1)}
                        />
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
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'defaultIncentiveAcc2', data.defaultIncentiveAcc2)}
                        />
                        <ERPCheckbox
                          id="unPostSPDeductionstoAccount"
                          checked={settings?.accountsSettings?.unPostSPDeductionstoAccount}
                          data={settings?.accountsSettings}
                          label={t("unpost_SP_deductions_to_account")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'unPostSPDeductionstoAccount', data.unPostSPDeductionstoAccount)}
                        />
                        <ERPCheckbox
                          id="loadCostcentrewiseEmployeesForSalaryProcess"
                          checked={settings?.accountsSettings?.loadCostcentrewiseEmployeesForSalaryProcess}
                          data={settings?.accountsSettings}
                          label={t("load_costcentre_wise_employees_for_salary_process")}
                          onChangeData={(data) => handleFieldChange("accountsSettings", 'loadCostcentrewiseEmployeesForSalaryProcess', data.loadCostcentrewiseEmployeesForSalaryProcess)}
                        />
                        <ERPInput
                          id="salesmanIncentive"
                          value={settings?.miscellaneousSettings.salesmanIncentive}
                          data={settings?.miscellaneousSettings}
                          type="number"
                          label={t("salesman_incentive")}
                          onChangeData={(data) =>
                            handleFieldChange("miscellaneousSettings", "salesmanIncentive", data.salesmanIncentive)
                          }
                        />
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
                            handleFieldChange("miscellaneousSettings",
                              "defaultIncentiveLedger",
                              data.defaultIncentiveLedger
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <section key="inventory" ref={el => sectionsRef.current['inventory'] = el} className="mb-8 last:mb-0">
              <div key="inventoryGeneral" ref={el => subItemsRef.current["inventoryGeneral"] = el}>
                <h1 className="text-2xl font-bold">General</h1>
                <div key="inventoryGeneral" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                      <ERPDataCombobox
                        id="defaultCouponSalesAccount"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultCouponSalesAccount",
                          required: false,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultCouponSalesAccount",
                            data.defaultCouponSalesAccount
                          )
                        }
                        label={t("coupon_card_account")}
                      />

                      <ERPDataCombobox
                        id="defaultRoundOffAccount"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultRoundOffAccount",
                          required: false,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Indirect_Expenses}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultRoundOffAccount",
                            data.defaultRoundOffAccount
                          )
                        }
                        label={t("default_round_off_account")}
                      />
                      <ERPDataCombobox
                        id="defaultAdditionalAmountAccount"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultAdditionalAmountAccount",
                          required: false,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultAdditionalAmountAccount",
                            data.defaultAdditionalAmountAccount
                          )
                        }
                        label={t("default_additional_amount_account")}
                      />
                      <ERPCheckbox
                        id="maintainWarehouse"
                        checked={settings?.inventorySettings.maintainWarehouse}
                        data={settings?.inventorySettings}
                        label={t("maintain_warehouse")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "maintainWarehouse",
                            data.maintainWarehouse
                          )
                        }
                      />
                      <ERPInput
                        id="priceCode"
                        value={settings?.inventorySettings.priceCode}
                        data={settings?.inventorySettings}
                        label={t("price_code")}
                        placeholder={t("enter_the_price_code")}
                        type="Password"
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "priceCode", data.priceCode)
                        }
                      />
                      <ERPDataCombobox
                        id="defaultServiceSpareWareHouse"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultServiceSpareWareHouse",
                          required: false,
                          getListUrl: Urls.data_warehouse,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultServiceSpareWareHouse",
                            data.defaultServiceSpareWareHouse
                          )
                        }
                        label={t("default_service_spare_warehouse")}
                      />
                      <ERPCheckbox
                        id="printInvAfterSave"
                        checked={settings?.inventorySettings?.printInvAfterSave}
                        data={settings?.inventorySettings}
                        label={t("print_after_save")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "printInvAfterSave",
                            data.printInvAfterSave
                          )
                        }
                      />
                      <ERPCheckbox
                        id="setProductCostWithVATAmount"
                        checked={settings?.inventorySettings.setProductCostWithVATAmount}
                        data={settings?.inventorySettings}
                        label={t("set_product_cost_with_TAX_amount")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "setProductCostWithVATAmount",
                            data.setProductCostWithVATAmount
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showPrinterSelection"
                        checked={settings?.inventorySettings.showPrinterSelection}
                        data={settings?.inventorySettings}
                        label={t("show_printer_selection")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showPrinterSelection",
                            data.showPrinterSelection
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showProductDuplicationMessage"
                        checked={settings?.inventorySettings.showProductDuplicationMessage}
                        data={settings?.inventorySettings}
                        label={t("show_product_duplication_message")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showProductDuplicationMessage",
                            data.showProductDuplicationMessage
                          )
                        }
                      />
                      <ERPDataCombobox
                        id="showNegStockWarning"
                        field={{
                          id: "showNegStockWarning",
                          valueKey: "value",
                          labelKey: "label",
                        }}
                        data={settings?.inventorySettings}
                        options={[
                          { value: "Block", label: "Block" },
                          { value: "Warn", label: "Warn" },
                          { value: "Ignore", label: "Ignore" },
                        ]}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showNegStockWarning",
                            data.showNegStockWarning
                          )
                        }
                        label={t("negative_stock")}
                      />
                      {userSession.countryId == Countries.India &&
                        <ERPCheckbox
                          id="enableAddStockAdjustment"
                          checked={settings?.inventorySettings.enableAddStockAdjustment}
                          data={settings?.inventorySettings}
                          label={t("enable_add_stock_adjustment")}
                          onChangeData={(data: any) =>
                            handleFieldChange("inventorySettings",
                              "enableAddStockAdjustment",
                              data.enableAddStockAdjustment
                            )
                          }
                        />
                      }
                      <ERPInput
                        id="maximum_Allowed_LineItem_Amount"
                        value={settings?.branchSettings?.maximum_Allowed_LineItem_Amount}
                        data={settings?.branchSettings}
                        type="number"
                        label={t("maximum_allowed_line_item_amount")}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings",
                            "maximum_Allowed_LineItem_Amount",
                            data.maximum_Allowed_LineItem_Amount
                          )
                        }
                      />
                      <ERPDataCombobox
                        field={{
                          id: "stockTransferNegativeStock",
                          valueKey: "label",
                          labelKey: "label",
                        }}
                        id="stockTransferNegativeStock"
                        label={t("stock_transfer_negative_stock")}
                        data={settings?.productsSettings}
                        onChangeData={(data) => {
                          handleFieldChange("productsSettings",
                            "stockTransferNegativeStock",
                            data.stockTransferNegativeStock
                          );
                        }}
                        options={[
                          { value: 0, label: "Block" },
                          { value: 1, label: "Warn" },
                          { value: 2, label: "Ignore" },
                        ]}
                      />
                      <ERPCheckbox
                        id="focusToQtyAfterBarcode"
                        label={t("focus_to_qty_after_barcode")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.focusToQtyAfterBarcode}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "focusToQtyAfterBarcode",
                            data.focusToQtyAfterBarcode
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* products */}
              <div key="inventoryProducts" ref={el => subItemsRef.current["inventoryProducts"] = el}>
                <h1 className="text-2xl font-bold">Products</h1>
                <div key="inventoryProducts" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                      <ERPDataCombobox
                        id="batchCriteria"
                        field={{
                          id: "batchCriteria",
                          getListUrl: Urls.data_batchcriteria,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        data={settings?.productsSettings}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "batchCriteria", data.batchCriteria)
                        }
                        label={t("batch_criteria")}
                      />
                      <ERPInput
                        id="marginRoundTo"
                        label={t("margin_round_to")}
                        type="number"
                        data={settings?.productsSettings}
                        value={settings?.productsSettings?.marginRoundTo}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "marginRoundTo", data.marginRoundTo)
                        }
                      />
                      <ERPDataCombobox
                        field={{
                          id: "showHSNCodeWarning",
                          valueKey: "label",
                          labelKey: "label",
                        }}
                        id="showHSNCodeWarning"
                        label={t("HSN_code")}
                        data={settings?.productsSettings}
                        onChangeData={(data) => {
                          handleFieldChange("productsSettings", "showHSNCodeWarning", data.showHSNCodeWarning);
                        }}
                        options={[
                          { value: 0, label: "Block" },
                          { value: 1, label: "Warn" },
                          { value: 2, label: "Ignore" },
                        ]}
                      />
                      {userSession.countryId == Countries.India &&
                        <>
                          <ERPDataCombobox
                            field={{
                              id: "lPPriceLessThanSellingPrice",
                              valueKey: "label",
                              labelKey: "label",
                            }}
                            id="lPPriceLessThanSellingPrice"
                            label={t("LP_priceLess_than_selling_price")}
                            data={settings?.productsSettings}
                            onChangeData={(data) => {
                              handleFieldChange("productsSettings",
                                "lPPriceLessThanSellingPrice",
                                data.lPPriceLessThanSellingPrice
                              );
                            }}
                            options={[
                              { value: 0, label: "Block" },
                              { value: 1, label: "Warn" },
                              { value: 2, label: "Ignore" },
                            ]}
                          />
                          <ERPDataCombobox
                            field={{
                              id: "mRPLessThanSalesPrice",
                              valueKey: "label",
                              labelKey: "label",
                            }}
                            id="mRPLessThanSalesPrice"
                            label={t("MRP_less_than_sales_price")}
                            data={settings?.productsSettings}
                            onChangeData={(data) => {
                              handleFieldChange("productsSettings",
                                "mRPLessThanSalesPrice",
                                data.mRPLessThanSalesPrice
                              );
                            }}
                            options={[
                              { value: 0, label: "Block" },
                              { value: 1, label: "Warn" },
                              { value: 2, label: "Ignore" },
                            ]}
                          />
                          <ERPDataCombobox
                            field={{
                              id: "zeroMultiRateValidate",
                              valueKey: "label",
                              labelKey: "label",
                            }}
                            id="zeroMultiRateValidate"
                            label={t("zero_multi_rate_validate")}
                            data={settings?.productsSettings}
                            onChangeData={(data) => {
                              handleFieldChange("productsSettings",
                                "zeroMultiRateValidate",
                                data.zeroMultiRateValidate
                              );
                            }}
                            options={[
                              { value: 0, label: "Block" },
                              { value: 1, label: "Warn" },
                              { value: 2, label: "Ignore" },
                            ]}
                          />
                        </>
                      }
                      <ERPDataCombobox
                        field={{
                          id: "weighingScaleBarcodeType",
                          valueKey: "label",
                          labelKey: "label",
                        }}
                        id="weighingScaleBarcodeType"
                        label={t("weighing_scale_barcode_type")}
                        data={settings?.productsSettings}
                        onChangeData={(data) => {
                          handleFieldChange("productsSettings",
                            "weighingScaleBarcodeType",
                            data.weighingScaleBarcodeType
                          );
                        }}
                        options={[
                          { value: 0, label: "Standard. No Check Digit" },
                          { value: 1, label: "13 Digit With Check Digit (Qty)" },
                          { value: 2, label: "13 Digit With Check Digit (Value)" },
                          { value: 3, label: "13 Digit With Check Digit (Qty/Value)" },
                          { value: 4, label: "Ignore" },
                        ]}
                      />
                      <ERPCheckbox
                        id="isLastSystemGeneratedBarcode"
                        label={t("last_generated_barcode")}
                        checked={isLastSystemGeneratedBarcode}
                        onChange={(data) =>
                          setIsLastSystemGeneratedBarcode(data.target.checked)
                        }
                      />
                      <ERPInput
                        id="lastSystemGeneratedBarcode"
                        label=" "
                        value={settings?.productsSettings?.lastSystemGeneratedBarcode}
                        data={settings?.productsSettings}
                        noLabel={true}
                        type="text"
                        disabled={!isLastSystemGeneratedBarcode}
                        onChangeData={(data: any) =>
                          handleFieldChange("productsSettings",
                            "lastSystemGeneratedBarcode",
                            data.lastSystemGeneratedBarcode
                          )
                        }
                      />
                      <ERPCheckbox
                        data={settings?.productsSettings}
                        id="allowOnlyScanProductMarkedAsWeighingScaleItems"
                        label={t("allow_only_scan_product")}
                        checked={settings?.productsSettings?.allowOnlyScanProductMarkedAsWeighingScaleItems}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "allowOnlyScanProductMarkedAsWeighingScaleItems",
                            data.allowOnlyScanProductMarkedAsWeighingScaleItems
                          )
                        }
                      />
                      <ERPCheckbox
                        id="allowMultirate"
                        data={settings?.productsSettings}
                        label={t("allow_multi_rate")}
                        checked={settings?.productsSettings?.allowMultirate}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "allowMultirate", data.allowMultirate)
                        }
                      />
                      <ERPCheckbox
                        id="setDefaultQty1"
                        data={settings?.productsSettings}
                        label={t("set_default_qty_1")}
                        checked={settings?.productsSettings?.setDefaultQty1}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "setDefaultQty1",
                            data.setDefaultQty1
                          )
                        }
                      />
                      <ERPCheckbox
                        data={settings?.productsSettings}
                        id="allowOnlyScanProductMarkedAsWeighingScaleItems"
                        label={t("allow_only_scan_product")}
                        checked={settings?.productsSettings?.allowOnlyScanProductMarkedAsWeighingScaleItems}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "allowOnlyScanProductMarkedAsWeighingScaleItems",
                            data.allowOnlyScanProductMarkedAsWeighingScaleItems
                          )
                        }
                      />
                      <ERPCheckbox
                        id="allowMultirate"
                        data={settings?.productsSettings}
                        label={t("allow_multi_rate")}
                        checked={settings?.productsSettings?.allowMultirate}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "allowMultirate", data.allowMultirate)
                        }
                      />
                      {userSession.countryId == Countries.India &&
                        <ERPCheckbox
                          id="allowUpdateMultiRateinPurchase"
                          label={t("allow_update_multiRate")}
                          data={settings?.productsSettings}
                          checked={settings?.productsSettings?.allowUpdateMultiRateinPurchase}
                          onChangeData={(data) =>
                            handleFieldChange("productsSettings",
                              "allowUpdateMultiRateinPurchase",
                              data.allowUpdateMultiRateinPurchase
                            )
                          }
                        />
                      }
                      <ERPCheckbox
                        id="allowMultiUnits"
                        label={t("allow_multi_unit")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.allowMultiUnits}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "allowMultiUnits", data.allowMultiUnits)
                        }
                      />
                      <ERPCheckbox
                        id="allowUpdateSalesPriceFromPurchase"
                        label={t("allow_update_sales")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.allowUpdateSalesPriceFromPurchase}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "allowUpdateSalesPriceFromPurchase",
                            data.allowUpdateSalesPriceFromPurchase
                          )
                        }
                      />
                      <ERPCheckbox
                        id="setDefaultQty1"
                        data={settings?.productsSettings}
                        label={t("set_default_qty_1")}
                        checked={settings?.productsSettings?.setDefaultQty1}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "setDefaultQty1",
                            data.setDefaultQty1
                          )
                        }
                      />
                      <ERPCheckbox
                        id="setQty1ForWeighingScaleItem_ValueMode"
                        data={settings?.productsSettings}
                        label={t("set_qty1_for_weighing_scale_item_value_mode")}
                        checked={settings?.productsSettings?.setQty1ForWeighingScaleItem_ValueMode}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "setQty1ForWeighingScaleItem_ValueMode",
                            data.setQty1ForWeighingScaleItem_ValueMode
                          )
                        }
                      />
                      <ERPCheckbox
                        id="enableGoogleTranslationOfProductName"
                        label={t("enable_google_translation")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.enableGoogleTranslationOfProductName}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "enableGoogleTranslationOfProductName",
                            data.enableGoogleTranslationOfProductName
                          )
                        }
                      />
                      <ERPCheckbox
                        id="includeSearchItemAlias_ItemName2"
                        label={t("include_search_item")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.includeSearchItemAlias_ItemName2}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "includeSearchItemAlias_ItemName2",
                            data.includeSearchItemAlias_ItemName2
                          )
                        }
                      />
                      <ERPCheckbox
                        id="advancedProductSearching"
                        label={t("advanced_product_searching")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.advancedProductSearching}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "advancedProductSearching",
                            data.advancedProductSearching
                          )
                        }
                      />
                      <ERPCheckbox
                        id="loadDummyProducts"
                        label={t("load_dummy_products")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.loadDummyProducts}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "loadDummyProducts", data.loadDummyProducts)
                        }
                      />
                      <ERPCheckbox
                        id="usePopupWindowForItemSearch"
                        label={t("use_popup_window_for_item_search")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.usePopupWindowForItemSearch}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "usePopupWindowForItemSearch",
                            data.usePopupWindowForItemSearch
                          )
                        }
                      />
                      <ERPInput
                        id="weighingScalePluFilePath"
                        value={settings?.miscellaneousSettings?.weighingScalePluFilePath}
                        data={settings?.miscellaneousSettings}
                        className="flex-grow"
                        label={t("plu_path")}
                        onChangeData={(data) =>
                          handleFieldChange("miscellaneousSettings",
                            "weighingScalePluFilePath",
                            data.weighingScalePluFilePath
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GST settings */}
              {userSession.countryId !== Countries.India && (
                <div key="inventoryGSTSettings" ref={el => subItemsRef.current["inventoryGSTSettings"] = el}>
                  <h1 className="text-2xl font-bold">GST Settings</h1>
                  <div key="inventoryGSTSettings" className="space-y-4">

                    <div className='grid xxl:grid-cols-7 lg:grid-cols-4 sm:grid-cols-2'>
                      <label>{t("default_purchase")}</label>
                      <ERPCheckbox
                        id="purchaseNormalType"
                        checked={settings?.gstSettings?.purchaseNormalType}
                        data={settings?.gstSettings}
                        label={t("normal")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseNormalType", data.purchaseNormalType)}
                      />
                      <ERPCheckbox
                        id="purchaseInterstateType"
                        checked={settings?.gstSettings?.purchaseInterstateType}
                        data={settings?.gstSettings}
                        label={t("inter_state")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseInterstateType", data.purchaseInterstateType)}
                      />
                      <ERPCheckbox
                        id="purchaseForm62"
                        checked={settings?.gstSettings?.purchaseForm62}
                        data={settings?.gstSettings}
                        label={t("form_6(2)")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseForm62", data.purchaseForm62)}
                      />
                    </div>
                    <ERPDisableEnable targetCount={5}>
                      {(hasPermitted) => (
                        <div className='border p-4 rounded-lg grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
                          <ERPDataCombobox
                            id="inputCSTAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputCSTAccount)}
                            data={settings?.gstSettings}
                            label={t("input_cst_account")}
                            field={{
                              id: "inputCSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputCSTAccount", data.inputCSTAccount)}
                          />

                          <ERPDataCombobox
                            id="outputCSTAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputCSTAccount)}
                            data={settings?.gstSettings}
                            label={t("output_cst_account")}
                            field={{
                              id: "outputCSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputCSTAccount", data.outputCSTAccount)}
                          />

                          <ERPDataCombobox
                            id="inputCessAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputCessAccount)}
                            field={{
                              id: "inputCessAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            data={settings?.gstSettings}
                            label={t("input_cess_account")}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputCessAccount", data.inputCessAccount)}
                          />

                          <ERPDataCombobox
                            id="outputCessAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputCessAccount)}
                            data={settings?.gstSettings}
                            label={t("output_cess_account")}
                            field={{
                              id: "outputCessAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputCessAccount", data.outputCessAccount)}
                          />

                          <ERPDataCombobox
                            id="inputAddCessAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputAddCessAccount)}
                            data={settings?.gstSettings}
                            label={t("input_add_cess_account")}
                            field={{
                              id: "inputAddCessAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputAddCessAccount", data.inputAddCessAccount)}
                          />

                          <ERPDataCombobox
                            id="outputAddCessAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputAddCessAccount)}
                            data={settings?.gstSettings}
                            label={t("output_add_cess_account")}
                            field={{
                              id: "outputAddCessAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputAddCessAccount", data.outputAddCessAccount)}
                          />

                          <ERPDataCombobox
                            id="expensesTaxAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.expensesTaxAccount)}
                            data={settings?.gstSettings}
                            label={t("expenses_tax_account")}
                            field={{
                              id: "expensesTaxAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "expensesTaxAccount", data.expensesTaxAccount)}
                          />

                          <ERPDataCombobox
                            id="incomeTaxAccount"
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.incomeTaxAccount)}
                            data={settings?.gstSettings}
                            label={t("income_tax_account")}
                            field={{
                              id: "incomeTaxAccount",
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "incomeTaxAccount", data.incomeTaxAccount)}
                          />
                        </div>

                      )}
                    </ERPDisableEnable>
                    <ERPDisableEnable targetCount={5}>
                      {(hasPermitted) => (
                        <div className='border p-4 rounded-lg grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
                          <ERPDataCombobox
                            id="inputSGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputSGSTAccount)}
                            label={t("input_SGST_account")}
                            field={{
                              id: "inputSGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputSGSTAccount", data.inputSGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="outputSGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputSGSTAccount)}
                            label={t("output_SGST_account")}
                            field={{
                              id: "outputSGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputSGSTAccount", data.outputSGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="inputCGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputCGSTAccount)}
                            label={t("input_CGST_ccount")}
                            field={{
                              id: "inputCGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputCGSTAccount", data.inputCGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="outputCGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputCGSTAccount)}
                            label={t("output_CGST_account")}
                            field={{
                              id: "outputCGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputCGSTAccount", data.outputCGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="inputIGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputIGSTAccount)}
                            label={t("input_IGST_account")}
                            field={{
                              id: "inputIGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputIGSTAccount", data.inputIGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="outputIGSTAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputIGSTAccount)}
                            label={t("output_IGST_account")}
                            field={{
                              id: "outputIGSTAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputIGSTAccount", data.outputIGSTAccount)}
                          />

                          <ERPDataCombobox
                            id="outputTCSPaidAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputTCSPaidAccount)}
                            label={t("TCS_paid_account")}
                            field={{
                              id: "outputTCSPaidAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputTCSPaidAccount", data.outputTCSPaidAccount)}
                          />

                          <ERPDataCombobox
                            id="outputTCSPayableAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputTCSPayableAccount)}
                            label={t("TCS_payable_account")}
                            field={{
                              id: "outputTCSPayableAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputTCSPayableAccount", data.outputTCSPayableAccount)}
                          />

                          <ERPDataCombobox
                            id="inputCalamityCessAccount"
                            data={settings?.gstSettings}
                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.inputCalamityCessAccount)}
                            // disabled={true}
                            label={t("input_calamity_cess_account")}
                            field={{
                              id: "inputCalamityCessAccount",
                              // required: true,
                              getListUrl: Urls.data_InputCalamity,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "inputCalamityCessAccount", data.inputCalamityCessAccount)}
                          />

                          <ERPDataCombobox
                            id="outputSalesCalamityCessAccount"
                            data={settings?.gstSettings}

                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.outputSalesCalamityCessAccount)}
                            label={t("output_calamity_cess_account")}
                            field={{
                              id: "outputSalesCalamityCessAccount",
                              // required: true,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "outputSalesCalamityCessAccount", data.outputSalesCalamityCessAccount)}
                          />

                          <ERPCheckbox
                            id="considerSalesPriceasCalamityIncluded"
                            checked={settings?.gstSettings?.considerSalesPriceasCalamityIncluded}
                            data={settings?.gstSettings}

                            disabled={!hasPermitted && !isNullOrUndefinedOrEmpty(settings?.gstSettings?.considerSalesPriceasCalamityIncluded)}
                            label={t("consider_sales_price_as_calamity_included")}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "considerSalesPriceasCalamityIncluded", data.considerSalesPriceasCalamityIncluded)}
                          />

                          <ERPCheckbox
                            id="enableKarnatakaTaxReportFormat"
                            checked={settings?.gstSettings?.enableKarnatakaTaxReportFormat}
                            data={settings?.gstSettings}
                            label={t("enable_karnataka_tax_report_format")}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "enableKarnatakaTaxReportFormat", data.enableKarnatakaTaxReportFormat)}
                          />

                          <ERPCheckbox
                            id="showPrevForms"
                            checked={settings?.gstSettings?.showPrevForms}
                            data={settings?.gstSettings}
                            label={t("show_prev._forms")}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "showPrevForms", data.showPrevForms)}
                          />
                        </div>

                      )}
                    </ERPDisableEnable>
                    <div className='grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
                      <div className='flex justify-between align-center'>
                        <ERPCheckbox
                          id="enableEWB"
                          checked={settings?.gstSettings?.enableEWB}
                          data={settings?.gstSettings}
                          label={t("enable_ewb")}
                          onChangeData={(data: any) => handleFieldChange("gstSettings", "enableEWB", data.enableEWB)}
                        />
                        <ERPButton
                          title={t("ewb_taxPro")}
                          onClick={() => handleShowComponent('ewb')}
                          disabled={!settings?.gstSettings?.enableEWB}
                        />
                      </div>

                      <div className='flex justify-between align-center'>
                        <ERPCheckbox
                          id="enableEInvoiceIndia"
                          checked={settings?.gstSettings?.enableEInvoiceIndia}
                          data={settings?.gstSettings}
                          label={t("enable_e-invoice")}
                          onChangeData={(data: any) => handleFieldChange("gstSettings", "enableEInvoiceIndia", data.enableEInvoiceIndia)}
                        />
                        <ERPButton
                          title={t("EInvoiceTaxPro")}
                          onClick={() => handleShowComponent('eInvoice')}
                          disabled={!settings?.gstSettings?.enableEInvoiceIndia}
                        />
                      </div>
                    </div>
                    <PopupComponent isOpen={showEInvoicePopup} onClose={() => setShowEInvoicePopup(false)}>
                      <EInvoiceTaxPro />
                    </PopupComponent>

                    <PopupComponent isOpen={showEWBPopup} onClose={() => setShowEWBPopup(false)}>
                      <EWBTaxPro />
                    </PopupComponent>
                    <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-6 mt-5'>
                      <ERPDataCombobox
                        field={{
                          id: "einvoiceProvider",
                          valueKey: "value",
                          labelKey: "label",
                        }}
                        id="einvoiceProvider"
                        label={t("e-invoice_provider_type")}
                        data={settings?.gstSettings}
                        onChangeData={(data) => {

                          handleFieldChange("gstSettings", "einvoiceProvider", data.einvoiceProvider)
                        }}
                        options={[
                          { value: "Clear Tax", label: "Clear Tax" },
                          { value: "Tax Pro", label: "Tax Pro" },
                        ]}
                      />

                      <ERPInput
                        id="eInvoiceAuthToken"
                        value={settings?.gstSettings?.eInvoiceAuthToken}
                        data={settings?.gstSettings}
                        label={t("clear_tax_token")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "eInvoiceAuthToken", data.eInvoiceAuthToken)}
                      />

                      <ERPInput
                        id="eInvoiceOwnerID"
                        value={settings?.gstSettings?.eInvoiceOwnerID}
                        data={settings?.gstSettings}
                        label={t("clear_tax_id")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "eInvoiceOwnerID", data.eInvoiceOwnerID)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {userSession.countryId === Countries.Saudi && (
                <div key="inventoryTaxSettings" ref={el => subItemsRef.current["inventoryTaxSettings"] = el}>
                  <h1 className="text-2xl font-bold">
                    Tax Settings
                  </h1>
                  <div key="inventoryTaxSettings" className="space-y-4">

                    <div className='grid xxl:grid-cols-7 lg:grid-cols-4 sm:grid-cols-2'>
                      <label>{t("default_purchase")}</label>
                      <ERPCheckbox
                        id="purchaseNormalType"
                        checked={settings?.gstSettings?.purchaseNormalType}
                        data={settings?.gstSettings}
                        label={t("normal")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseNormalType", data.purchaseNormalType)}
                      />
                      <ERPCheckbox
                        id="purchaseInterstateType"
                        checked={settings?.gstSettings?.purchaseInterstateType}
                        data={settings?.gstSettings}
                        label={t("inter_state")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseInterstateType", data.purchaseInterstateType)}
                      />
                      <ERPCheckbox
                        id="purchaseForm62"
                        checked={settings?.gstSettings?.purchaseForm62}
                        data={settings?.gstSettings}
                        label={t("form_6(2)")}
                        onChangeData={(data: any) => handleFieldChange("gstSettings", "purchaseForm62", data.purchaseForm62)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div key="inventoryPurchase" ref={el => subItemsRef.current["inventoryPurchase"] = el}>
                <h1 className="text-2xl font-bold">Purchase</h1>
                <div key="inventoryPurchase" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                      <ERPDataCombobox
                        id="defaultPurchaseAcc"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultPurchaseAcc",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultPurchaseAcc",
                            data.defaultPurchaseAcc
                          )
                        }
                        label={t("default_purchase_account")}
                      />
                      <ERPDataCombobox
                        id="defaultPurchaseReturnAcc"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultPurchaseReturnAcc",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultPurchaseReturnAcc",
                            data.defaultPurchaseReturnAcc
                          )
                        }
                        label={t("default_purchase_return_account")}
                      />
                      <ERPDataCombobox
                        id="defaultBillDiscGivenLdg"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultBillDiscGivenLdg",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Discount_Given}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultBillDiscGivenLdg",
                            data.defaultBillDiscGivenLdg
                          )
                        }
                        label={t("bill_discount_given_ledger")}
                      />
                      <ERPCheckbox
                        id="carryForwardPurchaseOrderQtyToPurchase"
                        checked={settings?.inventorySettings?.carryForwardPurchaseOrderQtyToPurchase}
                        data={settings?.inventorySettings}
                        label={t("carry_forward_purchase")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "carryForwardPurchaseOrderQtyToPurchase",
                            data.carryForwardPurchaseOrderQtyToPurchase
                          )
                        }
                      />
                      <ERPCheckbox
                        id="setProductCostasPurchasePrice"
                        checked={settings?.inventorySettings?.setProductCostasPurchasePrice}
                        data={settings?.inventorySettings}
                        label={t("set_product_cost_as_purchase_price")}
                        onChangeData={(data: any) => {
                          handleFieldChange("inventorySettings",
                            "setProductCostasPurchasePrice",
                            data.setProductCostasPurchasePrice
                          );
                        }}
                      />
                      <ERPCheckbox
                        id="setLastPurchaseRateAsProctRate"
                        checked={settings?.inventorySettings?.setLastPurchaseRateAsProctRate}
                        data={settings?.inventorySettings}
                        label={t("set_last_purchase")}
                        onChangeData={(data: any) => {
                          // Update the first checkbox
                          const newValue = data.setLastPurchaseRateAsProctRate;

                          // If user unchecks `setLastPurchaseRateAsProctRate` and both are true, uncheck the other one
                          if (!newValue && settings?.inventorySettings?.setProductCostasPurchasePrice) {
                            handleFieldChange("inventorySettings", "setProductCostasPurchasePrice", false);
                          }
                          handleFieldChange("inventorySettings",
                            "setLastPurchaseRateAsProctRate",
                            newValue
                          );
                        }}
                      />
                      <ERPCheckbox
                        id="isReferenceNumberMandatoryInPurchase"
                        checked={settings?.inventorySettings?.isReferenceNumberMandatoryInPurchase}
                        data={settings?.inventorySettings}
                        label={t("is_reference_number")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "isReferenceNumberMandatoryInPurchase",
                            data.isReferenceNumberMandatoryInPurchase
                          )
                        }
                      />
                      <ERPCheckbox
                        id="setAvgPurchaseCostWithStdPurRate"
                        checked={settings?.inventorySettings?.setAvgPurchaseCostWithStdPurRate}
                        data={settings?.inventorySettings}
                        label={t("set_avg_purchase")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "setAvgPurchaseCostWithStdPurRate",
                            data.setAvgPurchaseCostWithStdPurRate
                          )
                        }
                      />
                      <ERPCheckbox
                        id="updatePurhasePriceUpdateOnPurchaseBT"
                        checked={settings?.inventorySettings?.updatePurhasePriceUpdateOnPurchaseBT}
                        data={settings?.inventorySettings}
                        label={t("update_purchase_price")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "updatePurhasePriceUpdateOnPurchaseBT",
                            data.updatePurhasePriceUpdateOnPurchaseBT
                          )
                        }
                      />
                      <ERPCheckbox
                        id="needPOApprovalForPrintout"
                        checked={settings?.inventorySettings?.needPOApprovalForPrintout}
                        data={settings?.inventorySettings}
                        label={t("need_PO_approval_for_printout")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "needPOApprovalForPrintout",
                            data.needPOApprovalForPrintout
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showAccountReceivableInPurchase"
                        checked={settings?.inventorySettings?.showAccountReceivableInPurchase}
                        data={settings?.inventorySettings}
                        label={t("show_account_receivable_in_purchase")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showAccountReceivableInPurchase",
                            data.showAccountReceivableInPurchase
                          )
                        }
                      />
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
                        onChangeData={(data) => {
                          handleFieldChange("mainSettings",
                            "unitPrice_decimalPoint",
                            data.unitPrice_decimalPoint
                          );
                        }}
                        options={[
                          { value: 0, label: "0" },
                          { value: 1, label: "1" },
                          { value: 2, label: "2" },
                          { value: 3, label: "3" },
                          { value: 4, label: "4" },
                          { value: 5, label: "5" },
                        ]}
                      />
                      <ERPCheckbox
                        id="loadListedProductPrices"
                        label={t("check_listed_product_prices_in_purchase_invoice")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.loadListedProductPrices}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "loadListedProductPrices",
                            data.loadListedProductPrices
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showPurchaseCostChangeWarning"
                        label={t("show_purchase_cost_change_warning")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.showPurchaseCostChangeWarning}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "showPurchaseCostChangeWarning",
                            data.showPurchaseCostChangeWarning
                          )
                        }
                      />
                      <ERPCheckbox
                        id="enableImportPurchase"
                        disabled
                        label={t("enable_import_purchase")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.enableImportPurchase}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "enableImportPurchase", data.enableImportPurchase)
                        }
                      />
                      <ERPCheckbox
                        id="maintainUntalliedBills"
                        checked={settings?.miscellaneousSettings?.maintainUntalliedBills}
                        data={settings?.miscellaneousSettings}
                        label={t("maintain_untallied_bills")}
                        onChangeData={(data) =>
                          handleFieldChange("miscellaneousSettings",
                            "maintainUntalliedBills",
                            data.maintainUntalliedBills
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* sales */}
              <div key="inventorySales" ref={el => subItemsRef.current["inventorySales"] = el}>
                <h1 className="text-2xl font-bold">Sales</h1>
                <div key="inventorySales" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-3 gap-6 items-center justify-center">
                      <ERPDataCombobox
                        id="defaultSalesAcc"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultSalesAcc",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "defaultSalesAcc", data.defaultSalesAcc)
                        }
                        label={t("default_sales_account")}
                      />
                      <ERPDataCombobox
                        id="defaultSalesReturnAcc"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultSalesReturnAcc",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultSalesReturnAcc",
                            data.defaultSalesReturnAcc
                          )
                        }
                        label={t("default_sales_return_account")}
                      />
                      <ERPDataCombobox
                        id="defaultBillDiscRecvdLdg"
                        data={settings?.inventorySettings}
                        field={{
                          id: "defaultBillDiscRecvdLdg",
                          // required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Discount_Received}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "defaultBillDiscRecvdLdg",
                            data.defaultBillDiscRecvdLdg
                          )
                        }
                        label={t("bill_discount_received_ledger")}
                      />
                      <ERPCheckbox
                        id="serviceWarrantyInvAccounts"
                        checked={settings?.inventorySettings?.serviceWarrantyInvAccounts}
                        data={settings?.inventorySettings}
                        label={t("service_warranty_inv_accounts")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
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
                          handleFieldChange("inventorySettings",
                            "serviceWarrantyInvLedgerID",
                            data.serviceWarrantyInvLedgerID
                          )
                        }
                        label={t("service_warranty_inv_accounts_info")}
                        noLabel={true}
                      />
                      <ERPCheckbox
                        id="serviceNonWarrantyInvAccounts"
                        checked={settings?.inventorySettings?.serviceNonWarrantyInvAccounts}
                        data={settings?.inventorySettings}
                        // noLabel={true}
                        label={t("service_non_warranty_inv_accounts")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "serviceNonWarrantyInvAccounts",
                            data.serviceNonWarrantyInvAccounts
                          )
                        }
                      />
                      <ERPDataCombobox
                        id="serviceNONWarrantyInvLedgerID"
                        disabled={
                          settings?.inventorySettings?.serviceNonWarrantyInvAccounts !== true
                        }
                        data={settings?.inventorySettings}
                        field={{
                          id: "serviceNONWarrantyInvLedgerID",
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "serviceNONWarrantyInvLedgerID",
                            data.serviceWarrantyInvLedgerID
                          )
                        }
                        label={t("service_non_warranty_inv_accounts_info")}
                        noLabel={true}
                      />
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
                          {
                            value: "If Authentication Fails",
                            label: "If Authentication Fails",
                          },
                        ]}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "blockBillDiscount",
                            data.blockBillDiscount
                          )
                        }
                        label={t("block_bill_discount")}
                      />
                      <ERPInput
                        id="discontAuthorizationIfDiscountAbove"
                        value={settings?.inventorySettings?.discontAuthorizationIfDiscountAbove}
                        data={settings?.inventorySettings}
                        label={t("discount_authorization_if_discount_above")}
                        placeholder={t("enter_discount_threshold")}
                        type="number"
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "discontAuthorizationIfDiscountAbove",
                            parseFloat(data.discontAuthorizationIfDiscountAbove)
                          )
                        }
                      />
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
                          { value: "Ignore", label: "Ignore" }
                        ]}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "showRateWarning", data.showRateWarning)
                        }
                        label={t("if_less_sales_rate")}
                      />
                      <ERPCheckbox
                        id="setAuthorizationinSales"
                        checked={settings?.inventorySettings?.setAuthorizationinSales}
                        data={settings?.inventorySettings}
                        label={t("set_authorization_in_sales")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "setAuthorizationinSales",
                            data.setAuthorizationinSales
                          )
                        }
                      />
                      <ERPCheckbox
                        id="blockNonStockSerialSelling"
                        checked={settings?.inventorySettings?.blockNonStockSerialSelling}
                        data={settings?.inventorySettings}
                        label={t("block_non_stock_serial_selling")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "blockNonStockSerialSelling",
                            data.blockNonStockSerialSelling
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showTransitModeStockTransferAlert"
                        checked={settings?.inventorySettings?.showTransitModeStockTransferAlert}
                        data={settings?.inventorySettings}
                        label={t("show_transit_mode")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showTransitModeStockTransferAlert",
                            data.showTransitModeStockTransferAlert
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showAccountPayableInSales"
                        checked={settings?.inventorySettings?.showAccountPayableInSales}
                        data={settings?.inventorySettings}
                        label={t("show_account_payable_in_sales")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "showAccountPayableInSales",
                            data.showAccountPayableInSales
                          )
                        }
                      />
                      <ERPCheckbox
                        id="holdSalesMan"
                        checked={settings?.inventorySettings?.holdSalesMan}
                        data={settings?.inventorySettings}
                        label={t("hold_sales_man")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "holdSalesMan", data.holdSalesMan)
                        }
                      />
                      <ERPCheckbox
                        id="showNonStockItemsinSales"
                        checked={settings?.inventorySettings?.showNonStockItemsinSales}
                        data={settings?.inventorySettings}
                        label={t("show_non_stock_items_in_sales")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings", "showNonStockItemsinSales", data.showNonStockItemsinSales)
                        }
                      />
                      <ERPCheckbox
                        id="mobileNumberMandotryInSales"
                        checked={settings?.inventorySettings?.mobileNumberMandotryInSales}
                        data={settings?.inventorySettings}
                        label={t("mobile_number_mandatory_in_sales")}
                        onChangeData={(data: any) =>
                          handleFieldChange("inventorySettings",
                            "mobileNumberMandotryInSales",
                            data.mobileNumberMandotryInSales
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showTenderDialogInSales"
                        checked={settings?.accountsSettings?.showTenderDialogInSales}
                        data={settings?.accountsSettings}
                        label={t("show_tender_window_in_sales")}
                        onChangeData={(data) => handleFieldChange('accountsSettings', 'showTenderDialogInSales', data.showTenderDialogInSales)}
                      />
                      <ERPCheckbox
                        id="allowMultiPayments"
                        checked={settings?.accountsSettings?.allowMultiPayments}
                        data={settings?.accountsSettings}
                        label={t("allow_multipayment_mode")}
                        onChangeData={(data) => handleFieldChange('accountsSettings', 'allowMultiPayments', data.allowMultiPayments)}
                      />
                      <ERPCheckbox
                        id="setDefaultCustomerInSales"
                        checked={settings?.accountsSettings?.setDefaultCustomerInSales}
                        data={settings?.accountsSettings}
                        label={t("set_default_customer_in_sales")}
                        onChangeData={(data) => handleFieldChange('accountsSettings', 'setDefaultCustomerInSales', data.setDefaultCustomerInSales)}
                      />
                      <ERPDataCombobox
                        id="defaultCustomerLedgerID"
                        data={settings?.accountsSettings}
                        label={t("default_customer")}
                        field={{
                          id: "defaultCustomerLedgerID",
                          //required: true,
                          getListUrl: Urls.data_acc_ledgers,
                          params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        onChangeData={(data) => handleFieldChange('accountsSettings', 'defaultCustomerLedgerID', data.defaultCustomerLedgerID)}
                      />
                      <ERPCheckbox
                        id="allowSalesRouteArea"
                        label={t("allow_sales_route/area")}
                        data={settings?.mainSettings}
                        checked={settings?.mainSettings?.allowSalesRouteArea}
                        onChangeData={(data) =>
                          handleFieldChange("mainSettings",
                            "allowSalesRouteArea",
                            data.allowSalesRouteArea
                          )
                        }
                      />
                      <ERPCheckbox
                        id="maintainSalesRouteCreditLimit"
                        label={t("maintain_sales")}
                        data={settings?.mainSettings}
                        disabled={!settings?.mainSettings?.allowSalesRouteArea}
                        checked={settings?.mainSettings?.maintainSalesRouteCreditLimit}
                        onChangeData={(data) =>
                          handleFieldChange("mainSettings",
                            "maintainSalesRouteCreditLimit",
                            data.maintainSalesRouteCreditLimit
                          )
                        }
                      />
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
                          { value: 'Block', label: 'Block' },
                          { value: 'Warn', label: 'Warn' },
                          { value: 'Ignore', label: 'Ignore' },
                          { value: 'Allow Cash Sales', label: 'Allow Cash Sales' },
                        ]}
                        onChangeData={(data) =>
                          handleFieldChange("accountsSettings", "blockOnCreditLimit", data.blockOnCreditLimit)
                        }
                      />
                      <ERPCheckbox
                        id="showEmployeesInSales"
                        checked={settings?.accountsSettings?.showEmployeesInSales}
                        data={settings?.accountsSettings}
                        label={t("show_employees_in_sales")}
                        onChangeData={(data) => handleFieldChange('accountsSettings', 'showEmployeesInSales', data.showEmployeesInSales)}
                      />
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
                          handleFieldChange("mainSettings", "pOSRoundingMethod", data.pOSRoundingMethod)
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
                      <ERPCheckbox
                        id="stopScanningOnWrongBarcodeInSales"
                        label={t("stop_scanning_(Sales)")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.stopScanningOnWrongBarcodeInSales}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "stopScanningOnWrongBarcodeInSales",
                            data.stopScanningOnWrongBarcodeInSales
                          )
                        }
                      />
                      <ERPCheckbox
                        id="loadCustomerLastRate"
                        label={t("load_customer_last_sales_rate")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.loadCustomerLastRate}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "loadCustomerLastRate",
                            data.loadCustomerLastRate
                          )
                        }
                      />
                      <ERPCheckbox
                        id="allowMannualProductSelectionInSales"
                        label={t("allow_manual_product")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.allowMannualProductSelectionInSales}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "allowMannualProductSelectionInSales",
                            data.allowMannualProductSelectionInSales
                          )
                        }
                      />
                      <ERPCheckbox
                        id="showRateBeforeTax"
                        label={t("show_rate_(tax_inclusive)")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.showRateBeforeTax}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "showRateBeforeTax", data.showRateBeforeTax)
                        }
                      />
                      {userSession.countryId == Countries.India &&
                        <ERPCheckbox
                          id="enableOrderMangment"
                          disabled
                          label={t("enable_order_management")}
                          data={settings?.productsSettings}
                          checked={settings?.productsSettings?.enableOrderMangment}
                          onChangeData={(data) =>
                            handleFieldChange("productsSettings", "enableOrderMangment", data.enableOrderMangment)
                          }
                        />
                      }
                    </div>
                  </div>

                  {/* POS */}
                  <div key="inventorySalesPOS" ref={el => subItemsCatRef.current["inventorySalesPOS"] = el}>
                    <h1 className="text-2xl font-bold">POS</h1>
                    <div key="inventorySalesPOS" className="space-y-4">
                      <div className="border p-4 flex flex-col gap-6 rounded-lg">
                        <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                          <ERPCheckbox
                            id="blockQtyChangeOptionInPOS"
                            label={t("block_qty_POS")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.blockQtyChangeOptionInPOS}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings",
                                "blockQtyChangeOptionInPOS",
                                data.blockQtyChangeOptionInPOS
                              )
                            }
                          />
                          <ERPCheckbox
                            id="listBarcodeItemsInItemLookup"
                            label={t("list_barcode_items_in_item_lookup")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.listBarcodeItemsInItemLookup}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings",
                                "listBarcodeItemsInItemLookup",
                                data.listBarcodeItemsInItemLookup
                              )
                            }
                          />
                          <ERPDataCombobox
                            id="defaultFormTypeForPOS"
                            field={{
                              id: "defaultFormTypeForPOS",
                              getListUrl: Urls.data_FormTypeBySI,
                              valueKey: "FormType",
                              labelKey: "FormType",
                            }}
                            data={settings?.gstSettings}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "defaultFormTypeForPOS", data.defaultFormTypeForPOS)}
                            label={t("default_SI_form_type_for_POS")}
                          />
                          <ERPDataCombobox
                            id="defaultPrefixForPOS"
                            field={{
                              id: "defaultPrefixForPOS",
                              // required: true,
                              getListUrl: Urls.data_VPrefixForSI,
                              valueKey: "LastVoucherPrefix",
                              labelKey: "LastVoucherPrefix",
                            }}
                            data={settings?.gstSettings}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "defaultPrefixForPOS", data.defaultPrefixForPOS)}
                            label={t("default_SI_prefix_for_POS")}
                          />

                          <ERPDataCombobox
                            id="defaultSRFormTypeForPOS"
                            data={settings?.gstSettings}
                            label={t("default_SR_form_type_for_POS")}
                            field={{
                              id: "defaultSRFormTypeForPOS",
                              // required: true,
                              getListUrl: Urls.data_FormTypeBySR,
                              valueKey: "FormType",
                              labelKey: "FormType",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings", "defaultSRFormTypeForPOS", data.defaultSRFormTypeForPOS)}
                          />
                          <ERPDataCombobox
                            id="defaultSRPrefixForPOS"
                            data={settings?.gstSettings}
                            label={t("default_SR_prefix_for_POS")}
                            field={{
                              id: "defaultSRPrefixForPOS",
                              // required: true,
                              getListUrl: Urls.data_VPrefixForSR,
                              valueKey: "LastVoucherPrefix",
                              labelKey: "LastVoucherPrefix",
                            }}
                            onChangeData={(data: any) => handleFieldChange("gstSettings",
                              "defaultSRPrefixForPOS", data.defaultSRPrefixForPOS)}
                          />
                          <ERPInput
                            id="secondDisplayImagesPath"
                            value={settings?.miscellaneousSettings?.secondDisplayImagesPath}
                            data={settings?.miscellaneousSettings}
                            label={t("second_display_images_path")}
                            type="text"
                            placeholder={t("second_display_images_path")}
                            onChangeData={(data) =>
                              handleFieldChange("miscellaneousSettings", "secondDisplayImagesPath", data.secondDisplayImagesPath)
                            }
                          />
                          <ERPCheckbox
                            id="stopScanningOnWrongBarcode"
                            label={t("stop_scanning_(POS)")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.stopScanningOnWrongBarcode}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings",
                                "stopScanningOnWrongBarcode",
                                data.stopScanningOnWrongBarcode
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* counter */}
                  <div key="inventorySalesCounter" ref={el => subItemsCatRef.current["inventorySalesCounter"] = el}>
                    <h1 className="text-2xl font-bold">Counter</h1>
                    <div key="inventorySalesCounter" className="space-y-4">
                      <div className="border p-4 flex flex-col gap-6 rounded-lg">
                        <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6 items-center justify-center">
                          <ERPCheckbox
                            id="allowSalesCounter"
                            checked={settings?.accountsSettings?.allowSalesCounter}
                            data={settings?.accountsSettings}
                            label={t("allow_sales_counter")}
                            onChangeData={(data) => handleFieldChange("accountsSettings", 'allowSalesCounter', data.allowSalesCounter)}
                          />
                          <ERPCheckbox
                            id="enableAuthorizationforShiftClose"
                            disabled={!settings?.accountsSettings?.allowSalesCounter}
                            checked={settings?.accountsSettings?.enableAuthorizationforShiftClose}
                            data={settings?.accountsSettings}
                            label={t("enable_authorization_for_shift_close")}
                            onChangeData={(data) => handleFieldChange("accountsSettings", 'enableAuthorizationforShiftClose', data.enableAuthorizationforShiftClose)}
                          />
                          <ERPCheckbox
                            id="allowUserwiseCounter"
                            disabled={!settings?.accountsSettings?.allowSalesCounter}
                            checked={settings?.accountsSettings?.allowUserwiseCounter}
                            data={settings?.accountsSettings}
                            label={t("allow_user_wise_counter")}
                            onChangeData={(data) => handleFieldChange("accountsSettings", 'allowUserwiseCounter', data.allowUserwiseCounter)}
                          />
                          <ERPCheckbox
                            id="maintainCounterWisePrefixForTransaction"
                            label={t("maintain_counter_wise_prefix_for_transaction")}
                            data={settings?.branchSettings}
                            checked={settings?.branchSettings?.maintainCounterWisePrefixForTransaction}
                            onChangeData={(data) =>
                              handleFieldChange("branchSettings",
                                "maintainCounterWisePrefixForTransaction",
                                data.maintainCounterWisePrefixForTransaction
                              )
                            }
                          />
                          <div className='flex items-center justify-between'>
                            <ERPCheckbox
                              id="allowMinimumShiftDuration"
                              checked={settings?.accountsSettings?.allowMinimumShiftDuration}
                              data={settings?.accountsSettings}
                              label={t("minimum_shift_duration")}
                              onChangeData={(data) => handleFieldChange("accountsSettings", 'allowMinimumShiftDuration', data.allowMinimumShiftDuration)}
                            />
                            <ERPInput
                              id="minimumShiftDuration"
                              value={settings?.accountsSettings?.minimumShiftDuration}
                              label=' '
                              data={settings?.accountsSettings}
                              type="number"
                              disabled={!settings?.accountsSettings?.allowMinimumShiftDuration}
                              onChangeData={(data) => handleFieldChange("accountsSettings", 'minimumShiftDuration', data.minimumShiftDuration)}
                            />
                            &nbsp;Hours
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PPOS */}
              <div key="inventoryPPOS" ref={el => subItemsRef.current["inventoryPPOS"] = el}>
                <h1 className="text-2xl font-bold">PPOS</h1>
                <div key="inventoryPPOS" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6 items-center justify-center">
                      <ERPCheckbox
                        id="enableVanSale"
                        label={t("enable_PPOS_integration")}
                        data={settings?.branchSettings}
                        className="h-9 translate-y-[20px] "
                        checked={settings?.branchSettings?.enableVanSale}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings", "enableVanSale", data.enableVanSale)
                        }
                      />
                      <div className='flex justify-start space-x-3 align-center'>
                        <ERPInput
                          id="clientPPOSBranchID"
                          label={t("PPOS_branchid")}
                          disabled={settings?.branchSettings?.enableVanSale === false}
                          className="w-2/3"
                          value={settings?.branchSettings?.clientPPOSBranchID}
                          data={settings?.branchSettings}
                          onChangeData={(data) =>
                            handleFieldChange("branchSettings", "clientPPOSBranchID", data.clientPPOSBranchID)
                          }
                        />
                        <ERPButton
                          title={t("verify")}
                          disabled={settings?.branchSettings?.enableVanSale === false}
                          variant="secondary"
                          className="h-8 translate-y-[20px] "
                        // onClick={() => sendOtp()}
                        />
                      </div>
                      <ERPInput
                        id="vanSaleProductSerial"
                        label={t("PPOS_productSerial")}
                        disabled={settings?.branchSettings?.enableVanSale === false}
                        className="w-full"
                        value={settings?.branchSettings?.vanSaleProductSerial}
                        data={settings?.branchSettings}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings", "vanSaleProductSerial", data.vanSaleProductSerial)
                        }
                      />
                      <ERPInput
                        id="pPOSEmail"
                        label={t("PPOS_email")}
                        disabled={settings?.branchSettings?.enableVanSale === false}
                        className="w-full"
                        value={settings?.branchSettings?.pPOSEmail}
                        data={settings?.branchSettings}
                        onChangeData={(data) =>
                          handleFieldChange("branchSettings", "pPOSEmail", data.pPOSEmail)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*Schemes & Promotions*/}
              <div key="inventorySchemesPromotions" ref={el => subItemsRef.current["inventorySchemesPromotions"] = el}>
                <h1 className="text-2xl font-bold">Schemes & Promotions</h1>
                <div key="inventorySchemesPromotions" className="space-y-4">
                  <div className="border p-4 flex flex-col gap-6 rounded-lg">
                    <div className="grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6 items-center justify-center">
                      <div className="flex items-center justify-between sm:justify-between">
                        <ERPCheckbox
                          id="giftOnBilling"
                          data={settings?.productsSettings}
                          label={t("gift_on_billing")}
                          checked={settings?.productsSettings?.giftOnBilling}
                          onChangeData={(data) =>
                            handleFieldChange("productsSettings", "giftOnBilling", data.giftOnBilling)
                          }
                        />
                        <ERPDataCombobox
                          field={{
                            id: "giftOnBillingAs",
                            valueKey: "label",
                            labelKey: "label",
                          }}
                          id="giftOnBillingAs"
                          data={settings?.productsSettings}
                          onChangeData={(data) => {
                            handleFieldChange("productsSettings", "giftOnBillingAs", data.giftOnBillingAs);
                          }}
                          options={[
                            { value: 0, label: "CashCoupons" },
                            { value: 1, label: "Products" },
                            { value: 2, label: "Special Price" },
                          ]}
                          disabled={!settings?.productsSettings?.giftOnBilling}
                          label=" "
                        />
                      </div>
                      <ERPCheckbox
                        id="maintainSchemes"
                        label={t("maintain_schemes")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.maintainSchemes}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings", "maintainSchemes", data.maintainSchemes)
                        }
                      />
                      <ERPCheckbox
                        id="excludeSchemeProductAmountFromPrivilegeCard"
                        label={t("exclude_scheme_product")}
                        data={settings?.productsSettings}
                        checked={settings?.productsSettings?.excludeSchemeProductAmountFromPrivilegeCard}
                        onChangeData={(data) =>
                          handleFieldChange("productsSettings",
                            "excludeSchemeProductAmountFromPrivilegeCard",
                            data.excludeSchemeProductAmountFromPrivilegeCard
                          )
                        }
                      />
                      {userSession.countryId == Countries.India &&
                        <>
                          <ERPCheckbox
                            id="enableQtySlabOffer"
                            label={t("enable_qty_slab_offer")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.enableQtySlabOffer}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings", "enableQtySlabOffer", data.enableQtySlabOffer)
                            }
                          />
                          <ERPCheckbox
                            id="setProductQtyLimitinSales"
                            label={t("set_product_qty_limit_in_sales")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.setProductQtyLimitinSales}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings",
                                "setProductQtyLimitinSales",
                                data.setProductQtyLimitinSales
                              )
                            }
                          />
                          <ERPCheckbox
                            id="enableMultiFOC"
                            label={t("enable_multi_FOC")}
                            data={settings?.productsSettings}
                            checked={settings?.productsSettings?.enableMultiFOC}
                            onChangeData={(data) =>
                              handleFieldChange("productsSettings", "enableMultiFOC", data.enableMultiFOC)
                            }
                          />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <section
              key="miscellaneous"
              ref={el => sectionsRef.current['miscellaneous'] = el}
              className="mb-8 last:mb-0 h-screen">
              <h1 className="text-2xl font-bold">  Miscelll  </h1>
              <div className="border p-4 flex flex-col gap-6 rounded-lg">
                <div className="grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                  <div className="flex items-center  justify-between">
                    <ERPCheckbox
                      id="sendSMS"
                      checked={settings?.miscellaneousSettings?.sendSMS}
                      data={settings?.miscellaneousSettings}
                      label={t("send_sms")}
                      onChangeData={(data) => handleFieldChange("miscellaneousSettings", "sendSMS", data.sendSMS)}
                    />
                    <ERPInput
                      id="sMSURL"
                      value={settings?.miscellaneousSettings?.sMSURL}
                      data={settings?.miscellaneousSettings}
                      label={t("url")}
                      disabled={!settings?.miscellaneousSettings?.sendSMS}
                      onChangeData={(data) => handleFieldChange("miscellaneousSettings", "sMSURL", data.sMSURL)}
                    />
                  </div>
                  <ERPInput
                    id="supervisorPassword"
                    value={settings?.accountsSettings?.supervisorPassword}
                    data={settings?.accountsSettings}
                    label={t("supervisor_password")}
                    onChangeData={(data) => handleFieldChange("accountsSettings", 'supervisorPassword', data.supervisorPassword)}
                  />
                </div>
              </div>
            </section>
          </div>
        </div >
      </main >
    </div >
  )
}