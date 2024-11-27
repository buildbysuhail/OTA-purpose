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


const api = new APIClient()
export default function SettingsPage() {
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  // const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(sidebarItems[0].id)
  const [activeSubItem, setActiveSubItem] = useState(sidebarItems[0].subItems[0])
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})
  const subItemsRef = useRef<Record<string, HTMLElement | null>>({})
  const { settings, setSettings, verifyOtp, sendOtp } = useApplicationMainSettings();

  const handleMainFieldChange = useCallback(
    <T extends keyof ApplicationSettingsType>(
      type: T,
      settingName: keyof ApplicationSettingsType[T],
      value: any
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
  const scrollToSection = (sectionId: string, subItemKey?: string) => {
    if (subItemKey) {
      subItemsRef.current[subItemKey]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      sectionsRef.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  // const verifyOtp = async () => {
  //   // setLoading(true);
  //   try {
  //     const response = await api.post(Urls.ValidateToken, {
  //       email: settings?.mainSettings?.oTPEmail,
  //       token: settings?.mainSettings?.oTPVerification,
  //     });
  //     handleResponse(response);
  //   } catch (error) {
  //     console.error("Error loading settings:", error);
  //   } finally {
  //   }
  // };
  // const sendOtp = async () => {
  //   // setLoading(true);
  //   try {
  //     const response = await api.post(Urls.SendEmailToken, {
  //       email: settings?.mainSettings?.oTPEmail,
  //     });
  //     handleResponse(response);
  //   } catch (error) {
  //     console.error("Error loading settings:", error);
  //   } finally {
  //   }
  // };
  // const handleMainFieldChange = (
  //   settingName: keyof ApplicationMainSettings,
  //   value: any
  // ) => {
  //   debugger;
  //   setSettings((prevSettings = {} as ApplicationSettingsType) => {
  //     if (settingName === "allowSalesRouteArea" && value == false) {
  //       const newSettings: ApplicationSettingsType = {
  //         ...prevSettings,
  //         mainSettings: {
  //           ...prevSettings.mainSettings,
  //           [settingName]: value,
  //           ["maintainSalesRouteCreditLimit"]: false,
  //         }

  //       };
  //       return newSettings;
  //     } else {
  //       const newSettings: ApplicationSettingsType = {
  //         ...prevSettings,
  //         mainSettings: {
  //           ...prevSettings.mainSettings,
  //           [settingName]: value
  //         }
  //       };
  //       return newSettings;
  //     }
  //   });
  // };
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
                  break
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
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                className={`  relative flex items-center w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 duration-200 border-r-4 text-left
                  ${item.id === activeSection ? "bg-gray-300 border-primary text-primary" : "border-transparent hover:bg-gray-200 hover:border-gray-400"}`}
                onClick={() => scrollToSection(item.id)}>
                <span className="mx-4 md:mx-2 text-sm">{item.label}</span>
              </button>
              {item.id === activeSection && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem}
                      className={`w-full px-3 md:px-4 py-1.5 text-left text-sm ${subItem === activeSubItem ? "bg-gray-300 border-primary text-primary" : "border-transparent hover:bg-gray-200"}  `}
                      onClick={() => scrollToSection(item.id, subItem)} >
                      {settingGroups.find(group => group.id === item.id)?.settings.find(setting => setting.key === subItem)?.label}
                    </button>
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
            <section
              key="main"
              ref={el => sectionsRef.current['main'] = el}
              className="mb-8 last:mb-0">
              <div className="px-0 pb-6">
                <h1 className="text-2xl font-bold">
                  {settingGroups.find(group => group.id === 'main')?.settings.find(setting => setting.key === 'mainGeneral')?.label}
                </h1>
              </div>
              <div className="space-y-6">
                {/* {group.settings.map(setting => ( */}
                <div key="mainGeneral" ref={el => subItemsRef.current["mainGeneral"] = el}>
                  <div key="mainGeneral" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                        <ERPDataCombobox
                          field={{
                            id: "maintainBusinessType",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="maintainBusinessType"
                          label={t("business_type")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainBusinessType", data.maintainBusinessType)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","currency", data.currency)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showNumberFormat", data.showNumberFormat)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","decimalPoints", data.decimalPoints)}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
                        />
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
                            onChangeData={(data) => handleMainFieldChange("mainSettings","roundingMethodGLOBAL", data.roundingMethodGLOBAL)}
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
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
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
                            onChangeData={(data) => handleMainFieldChange("mainSettings","roundingMethod", data.roundingMethod)}
                            options={[
                              { value: "Normal", label: "Normal" },
                              { value: "No Rounding", label: "No Rounding" },
                              { value: "Ceiling", label: "Ceiling" },
                              { value: "Floor", label: "Floor" },
                            ]}
                          />
                        )}
                        <ERPDataCombobox
                          field={{
                            id: "pOSRoundingMethod",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="pOSRoundingMethod"
                          label={t("sales_rounding_method")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","pOSRoundingMethod", data.pOSRoundingMethod)}
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
                        <ERPDataCombobox
                          field={{
                            id: "tax_DecimalPoint",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="tax_DecimalPoint"
                          label={t("tax_decimal_points")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","tax_DecimalPoint", data.tax_DecimalPoint)}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
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
                          onChangeData={(data) => { handleMainFieldChange("mainSettings","unitPrice_decimalPoint", data.unitPrice_decimalPoint); }}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
                        />
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                        {userSession.countryId != Countries.India && (
                          <ERPCheckbox
                            id="autoChangeTransactionDateByMidnight"
                            label={t("auto_change_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings.autoChangeTransactionDateByMidnight}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","autoChangeTransactionDateByMidnight", data.autoChangeTransactionDateByMidnight)}
                          />
                        )}
                        <ERPInput
                          id="autoUpdateReleaseUpTo"
                          label={t("auto_update_release_up_to")}
                          type="number"
                          data={settings?.mainSettings}
                          value={settings?.mainSettings.autoUpdateReleaseUpTo}
                          disabled={!settings?.mainSettings.autoChangeTransactionDateByMidnight}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","autoUpdateReleaseUpTo", data.autoUpdateReleaseUpTo)}
                        />
                      </div>
                    </div>
                    {userSession.countryId != Countries.India && (
                      <div className="flex items-center space-x-4 border rounded-lg p-4">
                        <ERPInput
                          id="oTPEmail"
                          label={t("otp_email")}
                          className="w-1/3"
                          value={settings?.mainSettings?.oTPEmail}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","oTPEmail", data.oTPEmail)}
                        />
                        <div className="mt-4">
                          <ERPButton
                            title={t("send_otp")}
                            variant="secondary"
                            onClick={() => sendOtp()}
                          />
                        </div>
                        <ERPInput
                          id="oTPVerification"
                          label=" "
                          placeholder="Enter OTP"
                          data={settings?.mainSettings}
                          className="w-32 mt-4"
                          value={settings?.mainSettings?.oTPVerification}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","oTPVerification", data.oTPVerification)}
                        />
                        <div className="mt-4">
                          <ERPButton
                            title={t("verify")}
                            variant="primary"
                            onClick={() => verifyOtp()}
                          />
                        </div>
                      </div>
                    )}
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPrivilegeCard"
                            label={t("allow_privilege_card")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPrivilegeCard", data.allowPrivilegeCard)}
                          />
                          <ERPInput
                            id="previlegeCardPerc"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.previlegeCardPerc}
                            disabled={!settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","previlegeCardPerc", data.previlegeCardPerc)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">%</label>
                        </div>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPostdatedTrans"
                            label={t("allow_postdated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPostdatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPostdatedTrans", data.allowPostdatedTrans)}
                          />
                          <ERPInput
                            id="postDatedTransInNumbers"
                            type="number"
                            label=" "
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.postDatedTransInNumbers}
                            disabled={!settings?.mainSettings.allowPostdatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","postDatedTransInNumbers", data.postDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPredatedTrans"
                            label={t("allow_predated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPredatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPredatedTrans", data.allowPredatedTrans)}
                          />
                          <ERPInput
                            id="preDatedTransInNumbers"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.preDatedTransInNumbers}
                            disabled={!settings?.mainSettings.allowPredatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","preDatedTransInNumbers", data.preDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6">
                        {userSession.countryId != Countries.India && (
                          <ERPCheckbox
                            id="maintainSeperatePrefixforCashSales"
                            label={t("maintain_separate_prefix_for_cash_sales")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.maintainSeperatePrefixforCashSales}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","maintainSeperatePrefixforCashSales", data.maintainSeperatePrefixforCashSales)}
                          />
                        )}
                        <ERPCheckbox
                          id="saveModTransSum"
                          label={t("save_modified_transaction_summary")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.saveModTransSum}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","saveModTransSum", data.saveModTransSum)}
                        />
                        <ERPCheckbox
                          id="showReminders"
                          label={t("show_reminders")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showReminders}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showReminders", data.showReminders)}
                        />
                        <ERPCheckbox
                          id="enableSecondDisplay"
                          label={t("enable_second_display")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.enableSecondDisplay}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","enableSecondDisplay", data.enableSecondDisplay)}
                        />
                        <ERPCheckbox
                          id="allowSalesRouteArea"
                          label={t("allow_sales_route/area")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings.allowSalesRouteArea}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","allowSalesRouteArea", data.allowSalesRouteArea)}
                        />
                        {userSession.countryId === Countries.India && (
                          <ERPCheckbox
                            id="enableDayEnd"
                            label={t("enable_day_end")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.enableDayEnd}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","enableDayEnd", data.enableDayEnd)}
                          />
                        )}
                        <ERPCheckbox
                          id="maintainSalesRouteCreditLimit"
                          label={t("maintain_sales")}
                          data={settings?.mainSettings}
                          disabled={!settings?.mainSettings.allowSalesRouteArea}
                          checked={settings?.mainSettings.maintainSalesRouteCreditLimit}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainSalesRouteCreditLimit", data.maintainSalesRouteCreditLimit)}
                        />
                        <ERPCheckbox
                          id="maintainMultilanguage__"
                          label={t("maintain_multilanguage")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.maintainMultilanguage__}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainMultilanguage__", data.maintainMultilanguage__)}
                        />
                        <ERPCheckbox
                          id="showUserMessages"
                          label={t("show_user_messages")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showUserMessages}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showUserMessages", data.showUserMessages)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div key="mainBackup" className="space-y-4"></div>
                </div>
                <div className="px-0 pb-6">
                  <h1 className="text-2xl font-bold">
                    {settingGroups.find(group => group.id === 'main')?.settings.find(setting => setting.key === 'mainBackup')?.label}
                  </h1>
                </div>
                <div key="mainBackup" ref={el => subItemsRef.current["mainBackup"] = el}>
                  <div key="mainBackup" className="space-y-4">
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                        <ERPDataCombobox
                          field={{
                            id: "maintainBusinessType",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="maintainBusinessType"
                          label={t("business_type")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainBusinessType", data.maintainBusinessType)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","currency", data.currency)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showNumberFormat", data.showNumberFormat)}
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
                          onChangeData={(data) => handleMainFieldChange("mainSettings","decimalPoints", data.decimalPoints)}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
                        />
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
                            onChangeData={(data) => handleMainFieldChange("mainSettings","roundingMethodGLOBAL", data.roundingMethodGLOBAL)}
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
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
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
                            onChangeData={(data) => handleMainFieldChange("mainSettings","roundingMethod", data.roundingMethod)}
                            options={[
                              { value: "Normal", label: "Normal" },
                              { value: "No Rounding", label: "No Rounding" },
                              { value: "Ceiling", label: "Ceiling" },
                              { value: "Floor", label: "Floor" },
                            ]}
                          />
                        )}
                        <ERPDataCombobox
                          field={{
                            id: "pOSRoundingMethod",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="pOSRoundingMethod"
                          label={t("sales_rounding_method")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","pOSRoundingMethod", data.pOSRoundingMethod)}
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
                        <ERPDataCombobox
                          field={{
                            id: "tax_DecimalPoint",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          id="tax_DecimalPoint"
                          label={t("tax_decimal_points")}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","tax_DecimalPoint", data.tax_DecimalPoint)}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
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
                          onChangeData={(data) => { handleMainFieldChange("mainSettings","unitPrice_decimalPoint", data.unitPrice_decimalPoint); }}
                          options={[
                            { value: 0, label: "0" },
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                            { value: 5, label: "5" },
                          ]}
                        />
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
                        {userSession.countryId != Countries.India && (
                          <ERPCheckbox
                            id="autoChangeTransactionDateByMidnight"
                            label={t("auto_change_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings.autoChangeTransactionDateByMidnight}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","autoChangeTransactionDateByMidnight", data.autoChangeTransactionDateByMidnight)}
                          />
                        )}
                        <ERPInput
                          id="autoUpdateReleaseUpTo"
                          label={t("auto_update_release_up_to")}
                          type="number"
                          data={settings?.mainSettings}
                          value={settings?.mainSettings.autoUpdateReleaseUpTo}
                          disabled={!settings?.mainSettings.autoChangeTransactionDateByMidnight}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","autoUpdateReleaseUpTo", data.autoUpdateReleaseUpTo)}
                        />
                      </div>
                    </div>
                    {userSession.countryId != Countries.India && (
                      <div className="flex items-center space-x-4 border rounded-lg p-4">
                        <ERPInput
                          id="oTPEmail"
                          label={t("otp_email")}
                          className="w-1/3"
                          value={settings?.mainSettings?.oTPEmail}
                          data={settings?.mainSettings}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","oTPEmail", data.oTPEmail)}
                        />
                        <div className="mt-4">
                          <ERPButton
                            title={t("send_otp")}
                            variant="secondary"
                            onClick={() => sendOtp()}
                          />
                        </div>
                        <ERPInput
                          id="oTPVerification"
                          label=" "
                          placeholder="Enter OTP"
                          data={settings?.mainSettings}
                          className="w-32 mt-4"
                          value={settings?.mainSettings?.oTPVerification}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","oTPVerification", data.oTPVerification)}
                        />
                        <div className="mt-4">
                          <ERPButton
                            title={t("verify")}
                            variant="primary"
                            onClick={() => verifyOtp()}
                          />
                        </div>
                      </div>
                    )}
                    <div className="border p-4 flex flex-col gap-6 rounded-lg">
                      <div className="grid xxl:grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPrivilegeCard"
                            label={t("allow_privilege_card")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPrivilegeCard", data.allowPrivilegeCard)}
                          />
                          <ERPInput
                            id="previlegeCardPerc"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.previlegeCardPerc}
                            disabled={!settings?.mainSettings?.allowPrivilegeCard}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","previlegeCardPerc", data.previlegeCardPerc)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">%</label>
                        </div>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPostdatedTrans"
                            label={t("allow_postdated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPostdatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPostdatedTrans", data.allowPostdatedTrans)}
                          />
                          <ERPInput
                            id="postDatedTransInNumbers"
                            type="number"
                            label=" "
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.postDatedTransInNumbers}
                            disabled={!settings?.mainSettings.allowPostdatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","postDatedTransInNumbers", data.postDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                        <div className="flex items-center">
                          <ERPCheckbox
                            id="allowPredatedTrans"
                            label={t("allow_predated_transaction")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.allowPredatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","allowPredatedTrans", data.allowPredatedTrans)}
                          />
                          <ERPInput
                            id="preDatedTransInNumbers"
                            label=" "
                            type="number"
                            data={settings?.mainSettings}
                            className="w-20 ml-6 mt-1"
                            value={settings?.mainSettings?.preDatedTransInNumbers}
                            disabled={!settings?.mainSettings.allowPredatedTrans}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","preDatedTransInNumbers", data.preDatedTransInNumbers)}
                          />
                          <label className=" ml-2 mr-2 block form-check-label text-gray-700">Days</label>
                        </div>
                      </div>

                      <div className="grid xxl:grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-6">
                        {userSession.countryId != Countries.India && (
                          <ERPCheckbox
                            id="maintainSeperatePrefixforCashSales"
                            label={t("maintain_separate_prefix_for_cash_sales")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.maintainSeperatePrefixforCashSales}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","maintainSeperatePrefixforCashSales", data.maintainSeperatePrefixforCashSales)}
                          />
                        )}
                        <ERPCheckbox
                          id="saveModTransSum"
                          label={t("save_modified_transaction_summary")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.saveModTransSum}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","saveModTransSum", data.saveModTransSum)}
                        />
                        <ERPCheckbox
                          id="showReminders"
                          label={t("show_reminders")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showReminders}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showReminders", data.showReminders)}
                        />
                        <ERPCheckbox
                          id="enableSecondDisplay"
                          label={t("enable_second_display")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.enableSecondDisplay}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","enableSecondDisplay", data.enableSecondDisplay)}
                        />
                        <ERPCheckbox
                          id="allowSalesRouteArea"
                          label={t("allow_sales_route/area")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings.allowSalesRouteArea}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","allowSalesRouteArea", data.allowSalesRouteArea)}
                        />
                        {userSession.countryId === Countries.India && (
                          <ERPCheckbox
                            id="enableDayEnd"
                            label={t("enable_day_end")}
                            data={settings?.mainSettings}
                            checked={settings?.mainSettings?.enableDayEnd}
                            onChangeData={(data) => handleMainFieldChange("mainSettings","enableDayEnd", data.enableDayEnd)}
                          />
                        )}
                        <ERPCheckbox
                          id="maintainSalesRouteCreditLimit"
                          label={t("maintain_sales")}
                          data={settings?.mainSettings}
                          disabled={!settings?.mainSettings.allowSalesRouteArea}
                          checked={settings?.mainSettings.maintainSalesRouteCreditLimit}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainSalesRouteCreditLimit", data.maintainSalesRouteCreditLimit)}
                        />
                        <ERPCheckbox
                          id="maintainMultilanguage__"
                          label={t("maintain_multilanguage")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.maintainMultilanguage__}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","maintainMultilanguage__", data.maintainMultilanguage__)}
                        />
                        <ERPCheckbox
                          id="showUserMessages"
                          label={t("show_user_messages")}
                          data={settings?.mainSettings}
                          checked={settings?.mainSettings?.showUserMessages}
                          onChangeData={(data) => handleMainFieldChange("mainSettings","showUserMessages", data.showUserMessages)}
                        />
                      </div>
                    </div>
                  </div>
                  <div key="mainBackup" className="space-y-4"></div>
                </div>
                {/* ))} */}
              </div>
              <span className="my-8"></span>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}