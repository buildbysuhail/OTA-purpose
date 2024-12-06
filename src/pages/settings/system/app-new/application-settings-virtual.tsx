"use client";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { settingGroups } from "./application-settings-virtual-data";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { APIClient } from "../../../../helpers/api-client";
import { useApplicationMainSettings } from "../../../../utilities/hooks/use-application-main-settings";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { LedgerType } from "../../../../enums/ledger-types";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";
import { useApplicationGstSettings } from "../../../../utilities/hooks/use-application-gst-settings";
import EInvoiceTaxPro from "../e-invoice-taxpro";
import EWBTaxPro from "../ewb-taxpro";
import {
  systemCodeApplicationMiscSettings,
  useApplicationMiscSettings,
} from "../../../../utilities/hooks/use-application-misc-settings";
import { BusinessType } from "../../../../enums/business-types";
import { useApplicationSetting } from "../../../../utilities/hooks/use-application-settings";
import { useSearchInputFocus } from "../../../../utilities/shortKeys";
import { handleResponse } from "../../../../utilities/HandleResponse";
import MainGeneralFilterableComponents from "./application-settings-main-general";
import MainBackupFilterableComponents from "./application-settings-main-backup";
import MainPrintingFilterableComponents from "./application-settings-main-printing";
import MainCRMFilterableComponents from "./application-settings-main-crm";
import AccountsGeneralFilterableComponents from "./application-settings-accounts-general";
import AccountsHrFilterableComponents from "./application-settings-accounts-hr";
import MainSalesPOSFilterableComponents from "./application-settings-inventory-sales-pos";
import MainInventoryGeneralFilterableComponents from "./application-settings-inventory-general";

const api = new APIClient();
const LayoutToggle = ({
  onToggle,
}: {
  onToggle: (isCompact: boolean) => void;
}) => {
  const [isCompactView, setIsCompactView] = useState(false);
  const handleToggle = () => {
    const newViewState = !isCompactView;
    setIsCompactView(newViewState);
    onToggle(newViewState);
  };
  return (
    <div className="flex items-center justify-end">
      <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2 text-sm">
          {" "}
          {isCompactView ? "Compact View" : "Expanded View"}{" "}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isCompactView}
            onChange={handleToggle}
          />
          <div
            className={`w-10 h-4 rounded-full shadow-inner transition-colors ${isCompactView ? "bg-blue-500" : "bg-gray-300"
              }`}
          ></div>
          <div
            className={`dot absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow transition-transform ${isCompactView ? "translate-x-full" : ""
              }`}
          ></div>
        </div>
      </label>
    </div>
  );
};
export default function SettingsPage() {
  const [inputValueVisibility, setInputValueVisibility] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [gridClass, setGridClass] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blinkSection, setBlinkSection] = useState<string | null>(null);
  const [showSystemCodeBox, setShowSystemCodeBox] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const {
    dataLoaded,
    systemCode,
    setAddSystemCode,
    addSystemCode,
    SystemCodeAddData,
    setSystemCodeAddData,
    isSavingSystemCode,
    postSystemCode,
    loadSystemCode,
    getSystemCode,
  } = useApplicationMiscSettings();
  // const [settings, setSettings] = useState<ApplicationSettingsType>(applicationSettings);
  const { t } = useTranslation("applicationSettings");
  const [isLastSystemGeneratedBarcode, setIsLastSystemGeneratedBarcode] =
    useState(false);
  const [activeSection, setActiveSection] = useState(settingGroups[0]?.id || 0);
  const [activeSubItem, setActiveSubItem] = useState(
    settingGroups[0]?.settings?.[0]?.key || ""
  );
  const [activeSubCatItem, setActiveSubCatItem] = useState(
    settingGroups[0]?.settings?.[0]?.subSettings?.[0]?.key || ""
  );
  const {
    isSaving,
    handleSubmit,
    handleFieldChange,
    filterComponent,
    filterText,
    onFilterChange,
  } = useApplicationSetting();
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const subItemsRef = useRef<Record<string, HTMLElement | null>>({});
  const subItemsCatRef = useRef<Record<string, HTMLElement | null>>({});
  const { verifyOtp, sendOtp, otpSending, otpVerifying } =
    useApplicationMainSettings();
  const {
    PopupComponent,
    showEInvoicePopup,
    setShowEInvoicePopup,
    setShowEWBPopup,
    handleShowComponent,
    showEWBPopup,
  } = useApplicationGstSettings();
  const settings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const scrollToSection = (
    sectionId: string,
    subItemKey?: string,
    subItemsCatKey?: string
  ) => {
    let targetElement: HTMLElement | null = null;
    if (subItemsCatKey) {
      debugger;
      targetElement = subItemsCatRef.current[subItemsCatKey];
      setActiveSubCatItem(subItemsCatKey);
    } else if (subItemKey) {
      const first = settingGroups.find((x) => x.id == sectionId);
      const second =
        first && first.settings != null && first.settings.length > 0
          ? first.settings.find((x) => x.key == subItemKey)
          : null;
      const third =
        second && second.subSettings != null && second.subSettings.length > 0
          ? second.subSettings[0]
          : null;
      const targetKey =
        third != null ? third.key : second != null ? second.key : sectionId;
      if (third != null) {
        targetElement = subItemsCatRef.current[targetKey];
        setActiveSubCatItem(targetKey);
      } else if (second != null) {
        targetElement = subItemsRef.current[targetKey];
        setActiveSubItem(targetKey);
      } else {
        targetElement = sectionsRef.current[targetKey];
        setActiveSection(targetKey);
      }
    } else {
      console.log("sdsdsdsdsd");
      const first = settingGroups.find((x) => x.id == sectionId);
      const second =
        first && first.settings != null && first.settings.length > 0
          ? first.settings[0]
          : null;
      const third =
        second && second.subSettings != null && second.subSettings.length > 0
          ? second.subSettings[0]
          : null;
      const targetKey =
        third != null ? third.key : second != null ? second.key : sectionId;
      if (third != null) {
        targetElement = subItemsCatRef.current[targetKey];
        setActiveSubCatItem(targetKey);
      } else if (second != null) {
        targetElement = subItemsRef.current[targetKey];
        setActiveSubItem(targetKey);
      } else {
        targetElement = sectionsRef.current[targetKey];
        setActiveSection;
      }
    }
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
    if (sectionId) {
      setBlinkSection(subItemsCatKey || subItemKey || sectionId);

      const blinkTimeout = setTimeout(() => {
        setBlinkSection(null);
      }, 2000);

      return () => clearTimeout(blinkTimeout);
    }
  };
  const searchInputRef = useSearchInputFocus();

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  // const handleUpdateGridClass = async () => {
  //   const gridClassParts = inputValue.split(' ');
  //   const screenSizes = ['sm', 'md', 'lg', 'xl', 'xxl'];
  //   const finalGridClass = screenSizes.map(size => {
  //     const existingClass = gridClassParts.find(part => part.startsWith(`${size}:grid-cols-`));
  //     return existingClass || '';
  //   }).filter(Boolean).join(' ');
  //   setGridClass(finalGridClass);
  //   try {
  //     const response: any = await api.post( `${Urls.application_settings_UpdateSettingsScreen}`,gridClass);
  //     handleResponse(response);
  //   } catch (error) {
  //     console.error("Error submitting data:", error);
  //   }
  // };

  const handleUpdateGridClass = async () => {
    const gridClassParts = inputValue.split(" ");
    const screenSizes = ["sm", "md", "lg", "xl", "xxl"];
    const finalGridClass = screenSizes
      .map((size) => {
        const existingClass = gridClassParts.find((part) =>
          part.startsWith(`${size}:grid-cols-`)
        );
        return existingClass || "";
      })
      .filter(Boolean)
      .join(" ");

    setGridClass(finalGridClass);

    try {
      const payload = {
        settingsScreen: finalGridClass,
      };
      const response: any = await api.post(
        `${Urls.application_settings_UpdateSettingsScreen}`,
        payload
      );
      handleResponse(response);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const loadGridClass = async () => {
    try {
      const response = await api.getAsync(
        Urls.application_settings_GetSettingsScreen
      );
      setGridClass(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };
  useEffect(() => {
    if (gridClass == null || gridClass == "" || gridClass == undefined) {
      loadGridClass();
    }
  }, []);

  const handleGeneralHeaderClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount === 5) {
      setInputValueVisibility(true);
      setClickCount(0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset to trigger slightly before the section top
      // Check main sections
      for (const section of settingGroups) {
        const element = sectionsRef.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            // Check sub-items within the active section
            for (const setting of section.settings?.filter(
              (x) =>
                (x.key !== "accountsEInvoiceGCC" ||
                  userSession.countryId === Countries.Saudi) &&
                (x.key !== "inventoryTAXSettings" ||
                  userSession.countryId === Countries.Saudi) &&
                (x.key !== "inventoryGSTSettings" ||
                  userSession.countryId === Countries.India)
            )) {
              const subElement = subItemsRef.current[setting.key];
              if (subElement) {
                const subOffsetTop = subElement.offsetTop;
                const subOffsetHeight = subElement.offsetHeight;
                if (
                  scrollPosition >= subOffsetTop &&
                  scrollPosition < subOffsetTop + subOffsetHeight
                ) {
                  setActiveSubItem(setting.key);
                  if (
                    setting.subSettings != undefined &&
                    setting.subSettings.length > 0
                  ) {
                    for (const subSettingCat of setting.subSettings) {
                      const subElementCat =
                        subItemsCatRef.current[subSettingCat.key];
                      if (subElementCat) {
                        const subOffsetTop = subElementCat.offsetTop;
                        const subOffsetHeight = subElementCat.offsetHeight;
                        if (
                          scrollPosition >= subOffsetTop &&
                          scrollPosition < subOffsetTop + subOffsetHeight
                        ) {
                          setActiveSubCatItem(subSettingCat.key);
                          break;
                        }
                      }
                    }
                  } else {
                    break;
                  }
                }
              }
            }
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fieldDescriptions = {
    businessType:
      "Select the primary type of business to help customize settings and reports for your specific industry sector.",
    currency:
      "Choose the primary currency used in your financial transactions and reporting.",
    currencyFormat:
      "Select how large numbers are displayed - in Millions or Lakhs (hundred thousands).",
    decimalPoints:
      "Set the number of decimal places to display for monetary and numeric values.",
    country:
      "Select the primary country for your business to apply region-specific settings and compliance.",
    roundingMethod:
      "Determine how numerical values are rounded in calculations and financial reports.",
  };

  return (
    <div className="flex overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark">
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-100 p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <i className="ri-close-circle-line"></i>
        ) : (
          <i className="ri-menu-line"></i>
        )}
      </button>
      <aside
        className={`fixed z-20 bg-[#fafafa] h-screen w-[250px] md:w-[200px] lg:w-[300px] transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 ltr:border-r rtl:border-l `}
      >
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <i className="ri-close-circle-line"></i>
          </button>
        </div>
        <h1 className="font-medium text-xl p-5 mb-5 sm:hidden lg:block">
          {t("settings")}
        </h1>
        <div className="flex flex-col overflow-y-auto pb-24 h-full mt-4">
          {settingGroups.map((item) => (
            <div key={item.id}>
              <button
                className={`  relative flex items-center w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 duration-200 border-r-4 text-left
                  ${item.id === activeSection
                    ? "bg-gray-300 border-primary text-primary"
                    : "border-transparent hover:bg-gray-200 hover:border-gray-400"
                  }`}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="mx-4 md:mx-2 text-sm">{item.label}</span>
              </button>
              {item.id === activeSection && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.settings
                    ?.filter(
                      (x) =>
                        (x.key !== "accountsEInvoiceGCC" ||
                          userSession.countryId === Countries.Saudi) &&
                        (x.key !== "inventoryTAXSettings" ||
                          userSession.countryId === Countries.Saudi) &&
                        (x.key !== "inventoryGSTSettings" ||
                          userSession.countryId === Countries.India)
                    )
                    .map((set) => (
                      <>
                        <button
                          key={set.key}
                          className={`w-full px-3 md:px-4 py-1.5 text-left text-sm ${set.key === activeSubItem
                              ? "bg-gray-300 border-primary text-primary"
                              : "border-transparent hover:bg-gray-200"
                            }  `}
                          onClick={() => scrollToSection(item.id, set.key)}
                        >
                          {
                            settingGroups
                              .find((group) => group.id === item.id)
                              ?.settings.find(
                                (setting) => setting.key === set.key
                              )?.label
                          }
                        </button>
                        {set.key === activeSubItem && (
                          <div className="ml-4 mt-1 space-y-1">
                            {set?.subSettings?.map((subCat) => (
                              <button
                                key={subCat.key}
                                className={`w-full px-3 md:px-4 py-1.5 text-left text-sm ${subCat.key === activeSubCatItem
                                    ? "bg-gray-300 border-primary text-primary"
                                    : "border-transparent hover:bg-gray-200"
                                  }  `}
                                onClick={() =>
                                  scrollToSection(item.id, set.key, subCat.key)
                                }
                              >
                                {subCat?.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* main */}
      {/* <main className="flex-1 md:ml-[200px] lg:ml-[300px] relative transition-all duration-300 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"> */}
      <main className="flex-1 md:ml-[200px] lg:ml-[300px] relative transition-all duration-300">
        <div className="flex items-center justify-between z-10 fixed bg-white shadow w-[-webkit-fill-available] p-2">
          <button
            className="md:hidden mr-2 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="ri-menu-line"></i>
          </button>
          <input
            ref={searchInputRef}
            id="search-input"
            type="search"
            placeholder="Search..."
            className="w-2/5 rounded-md focus:border-accent focus:outline-accent active:border-accent active:outline-accent"
            onChange={onFilterChange}
            autoFocus
          />
          <LayoutToggle onToggle={setIsCompactView} />
        </div>
        <div className="p-4">
          <style>{`
          @keyframes blink {
            0%, 100% { background-color: #f1f1f1; }
            50% { background-color: #e0e0e0; }
          }
          .blink-animation {
            animation: blink 2s ease-in-out;
          }
        `}</style>
          <section
            key="main"
            ref={(el) => (sectionsRef.current["main"] = el)}
            className="mb-8 last:mb-0 pt-12"
          >
            <div className="space-y-6">
              {inputValueVisibility && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter grid classes (e.g., xl:grid-cols-4 lg:grid-cols-2)"
                    className="border px-2 py-1 mr-2 w-1/3"
                  />
                  <button
                    onClick={handleUpdateGridClass}
                    className="bg-blue text-white px-4 py-1 rounded"
                  >
                    {t("apply")}
                  </button>
                  <p className="text-danger mt-2">
                    For Example : xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2
                    md:grid-cols-2 sm:grid-cols-1 gap-3
                  </p>
                </div>
              )}
            </div>
            <div>
              <MainGeneralFilterableComponents
                key="mainGeneral"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainGeneralFilterableComponents>

              {/* backup */}

              <MainBackupFilterableComponents
                key="mainBackup"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainBackupFilterableComponents>

              {/* printing */}
              <MainPrintingFilterableComponents
                key="mainPrinting"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainPrintingFilterableComponents>


              {/* multi branch */}
              <div>
                <div
                  key="mainMultiBranch"
                  ref={(el) => (subItemsRef.current["mainMultiBranch"] = el)}
                >
                  <h1
                    className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "mainMultiBranch"
                        ? "blink-animation bg-[#f1f1f1]"
                        : "bg-[#f1f1f1]"
                      }`}
                  >
                    {t("multi_branch")}
                  </h1>
                  <div key="mainMultiBranch" className="space-y-4">
                    <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                      <div
                        className={`grid ${isCompactView
                            ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                            : `${gridClass ||
                            "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                            } gap-4 items-center justify-center`
                          }`}
                      >
                        {filterComponent(
                          [t("default_BTO_account")],
                          filterText
                        ) && (
                            <ERPDataCombobox
                              id="defaultBTOAccount"
                              data={settings?.inventorySettings}
                              field={{
                                id: "defaultBTOAccount",
                                getListUrl: Urls.data_acc_ledgers,
                                params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
                                valueKey: "id",
                                labelKey: "name",
                              }}
                              onChangeData={(data: any) =>
                                handleFieldChange(
                                  "inventorySettings",
                                  "defaultBTOAccount",
                                  data.defaultBTOAccount
                                )
                              }
                              label={t("default_BTO_account")}
                            />
                          )}

                        {filterComponent(
                          [t("default_BTI_account")],
                          filterText
                        ) && (
                            <ERPDataCombobox
                              id="defaultBTIAccount"
                              data={settings?.inventorySettings}
                              field={{
                                id: "defaultBTIAccount",
                                getListUrl: Urls.data_acc_ledgers,
                                params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
                                valueKey: "id",
                                labelKey: "name",
                              }}
                              onChangeData={(data: any) =>
                                handleFieldChange(
                                  "inventorySettings",
                                  "defaultBTIAccount",
                                  data.defaultBTIAccount
                                )
                              }
                              label={t("default_BTI_account")}
                            />
                          )}

                        {filterComponent([t("BTO_using_MSP")], filterText) && (
                          <ERPCheckbox
                            id="bTOUsingMSP"
                            checked={settings?.inventorySettings?.bTOUsingMSP}
                            data={settings?.inventorySettings}
                            label={t("BTO_using_MSP")}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "inventorySettings",
                                "bTOUsingMSP",
                                data.bTOUsingMSP
                              )
                            }
                          />
                        )}

                        {filterComponent(
                          [t("use_cost_for_stock_transfer_to_branch")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="useCostForStockTransferToBranch"
                              checked={
                                settings?.inventorySettings
                                  ?.useCostForStockTransferToBranch
                              }
                              data={settings?.inventorySettings}
                              label={t("use_cost_for_stock_transfer_to_branch")}
                              onChangeData={(data: any) =>
                                handleFieldChange(
                                  "inventorySettings",
                                  "useCostForStockTransferToBranch",
                                  data.useCostForStockTransferToBranch
                                )
                              }
                            />
                          )}
                      </div>

                      <div
                        className={`grid ${isCompactView
                            ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                            : `${gridClass ||
                            "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                            } gap-4 items-center justify-center`
                          }`}
                      >
                        <div>
                          {filterComponent(
                            [t("maintain_synchronization")],
                            filterText
                          ) && (
                              <>
                                <ERPCheckbox
                                  id="maintainSynchronization"
                                  checked={
                                    settings?.branchSettings
                                      ?.maintainSynchronization
                                  }
                                  data={settings?.branchSettings}
                                  label={t("maintain_synchronization")}
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "branchSettings",
                                      "maintainSynchronization",
                                      data.maintainSynchronization
                                    )
                                  }
                                />
                                <ERPDataCombobox
                                  id="syncMethod"
                                  disabled={
                                    settings?.branchSettings
                                      ?.maintainSynchronization === false
                                  }
                                  label=" "
                                  field={{
                                    id: "syncMethod",
                                    valueKey: "value",
                                    labelKey: "label",
                                  }}
                                  data={settings?.branchSettings}
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "branchSettings",
                                      "syncMethod",
                                      data.syncMethod
                                    )
                                  }
                                  options={[
                                    {
                                      value: "Manual Sync",
                                      label: "Manual Sync",
                                    },
                                    { value: "Auto Sync", label: "Auto Sync" },
                                    {
                                      value: "Auto Sync and Upload Only",
                                      label: "Auto Sync and Upload Only",
                                    },
                                    {
                                      value: "Manual Sync and Upload Only",
                                      label: "Manual Sync and Upload Only",
                                    },
                                    {
                                      value: "Upload And Download",
                                      label: "Upload And Download",
                                    },
                                  ]}
                                />
                              </>
                            )}
                        </div>

                        {filterComponent(
                          [t("intervals_(minutes)")],
                          filterText
                        ) && (
                            <ERPInput
                              id="syncIntervals"
                              value={settings?.branchSettings?.syncIntervals}
                              data={settings?.branchSettings}
                              label={t("intervals_(minutes)")}
                              disabled={
                                settings?.branchSettings?.syncMethod !==
                                "Auto Sync" &&
                                settings?.branchSettings?.syncMethod !==
                                "Auto Sync and Upload Only"
                              }
                              type="number"
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "syncIntervals",
                                  data.syncIntervals
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("refresh_stock_after_sync")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="refreshStockAfterSync"
                              checked={
                                settings?.branchSettings?.refreshStockAfterSync
                              }
                              data={settings?.branchSettings}
                              disabled={
                                !settings?.branchSettings?.maintainSynchronization
                              }
                              label={t("refresh_stock_after_sync")}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "refreshStockAfterSync",
                                  data.refreshStockAfterSync
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("refresh_server_stock_after_sync")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="refreshServerStockAfterSync"
                              checked={
                                settings?.branchSettings
                                  ?.refreshServerStockAfterSync
                              }
                              data={settings?.branchSettings}
                              disabled={
                                !settings?.branchSettings?.maintainSynchronization
                              }
                              label={t("refresh_server_stock_after_sync")}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "refreshServerStockAfterSync",
                                  data.refreshServerStockAfterSync
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("maintain_inventory_master_entry")],
                          filterText
                        ) && (
                            <ERPDisableEnable targetCount={5}>
                              {(hasPermitted) => (
                                <ERPCheckbox
                                  id="maintainMasterEntry"
                                  label={t("maintain_inventory_master_entry")}
                                  disabled={!hasPermitted}
                                  data={settings?.branchSettings}
                                  checked={
                                    settings?.branchSettings?.maintainMasterEntry
                                  }
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "branchSettings",
                                      "maintainMasterEntry",
                                      data.maintainMasterEntry
                                    )
                                  }
                                />
                              )}
                            </ERPDisableEnable>
                          )}

                        {filterComponent(
                          [t("maintain_inventory_transactions_entry")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="maintainInventoryTransactionsEntry"
                              label={t("maintain_inventory_transactions_entry")}
                              data={settings?.branchSettings}
                              checked={
                                settings?.branchSettings
                                  ?.maintainInventoryTransactionsEntry
                              }
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "maintainInventoryTransactionsEntry",
                                  data.maintainInventoryTransactionsEntry
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("use_branch_wise_sales_price")],
                          filterText
                        ) && (
                            <ERPDisableEnable targetCount={5}>
                              {(hasPermitted) => (
                                <ERPCheckbox
                                  id="useBranchWiseSalesPrice"
                                  disabled={!hasPermitted}
                                  label={t("use_branch_wise_sales_price")}
                                  data={settings?.branchSettings}
                                  checked={
                                    settings?.branchSettings
                                      ?.useBranchWiseSalesPrice
                                  }
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "branchSettings",
                                      "useBranchWiseSalesPrice",
                                      data.useBranchWiseSalesPrice
                                    )
                                  }
                                />
                              )}
                            </ERPDisableEnable>
                          )}

                        {filterComponent(
                          [t("show_BTI_notification")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="showBTINotification"
                              checked={
                                settings?.branchSettings?.showBTINotification
                              }
                              data={settings?.branchSettings}
                              label={t("show_BTI_notification")}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "showBTINotification",
                                  data.showBTINotification
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("maintain_all_branch")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="maintainAllBranchWithCommonInventory"
                              checked={
                                settings?.miscellaneousSettings
                                  ?.maintainAllBranchWithCommonInventory
                              }
                              data={settings?.miscellaneousSettings}
                              label={t("maintain_all_branch")}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "miscellaneousSettings",
                                  "maintainAllBranchWithCommonInventory",
                                  data.maintainAllBranchWithCommonInventory
                                )
                              }
                            />
                          )}

                        {userSession.countryId === Countries.India &&
                          filterComponent([t("auto_sync")], filterText) && (
                            <ERPCheckbox
                              id="autoSyncSIandPI_BT"
                              checked={
                                settings?.miscellaneousSettings
                                  ?.autoSyncSIandPI_BT
                              }
                              data={settings?.miscellaneousSettings}
                              label={t("auto_sync")}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "miscellaneousSettings",
                                  "autoSyncSIandPI_BT",
                                  data.autoSyncSIandPI_BT
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("apply_TAX_on_purchase_converted_to_BTO")],
                          filterText
                        ) && (
                            <ERPCheckbox
                              id="applyVATOnPurchaseToBTO"
                              label={t("apply_TAX_on_purchase_converted_to_BTO")}
                              data={settings?.branchSettings}
                              checked={
                                settings?.branchSettings?.applyVATOnPurchaseToBTO
                              }
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "applyVATOnPurchaseToBTO",
                                  data.applyVATOnPurchaseToBTO
                                )
                              }
                            />
                          )}

                        {filterComponent(
                          [t("set_system_code")],
                          filterText
                        ) && (
                            <div>
                              <button
                                className="text-blue-500 underline"
                                onClick={() => setShowSystemCodeBox(true)}
                              >
                                {t("set_system_code")}
                              </button>
                              {showSystemCodeBox && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                  <div className="max-h-[300px] w-[300px] xxl:w-[250px] xxl:max-h-[350px] p-3 border border-gray-300 rounded-sm shadow-sm bg-white">
                                    <div className="flex justify-between items-center mb-5">
                                      <h6 className="text-center font-medium">
                                        {t("sync_systemCode")}
                                      </h6>
                                      <button
                                        className="text-red-500 font-bold"
                                        onClick={() =>
                                          setShowSystemCodeBox(false)
                                        }
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    {/* Content */}
                                    <div className="h-32 xxl:h-40 overflow-y-scroll snap-x mb-2 rounded-sm shadow-sm">
                                      {!dataLoaded ? (
                                        <div className="my-5 xxl:my-10">
                                          <ul className="list-none text-center text-gray-500 snap-center">
                                            <li className="py-5 xxl:py-10 px-3">
                                              {t(
                                                "click_load_to_fetch_system_code"
                                              )}
                                            </li>
                                          </ul>
                                        </div>
                                      ) : (
                                        <ul className="list-none text-center snap-center">
                                          {systemCode && systemCode.length > 0 ? (
                                            systemCode.map(
                                              (
                                                code: systemCodeApplicationMiscSettings,
                                                index: number
                                              ) => (
                                                <li
                                                  className="p-1 text-xs"
                                                  key={index}
                                                >
                                                  {code.systemCode}
                                                </li>
                                              )
                                            )
                                          ) : (
                                            <li>{"No data available"}</li>
                                          )}
                                        </ul>
                                      )}
                                    </div>

                                    <li className="flex justify-end mb-2">
                                      <ERPButton
                                        className="w-0 h-0 p-0 bg-white"
                                        type="button"
                                        onClick={() =>
                                          setAddSystemCode(!addSystemCode)
                                        }
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
                                    <div className="flex justify-end">
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
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRM */}
              <MainCRMFilterableComponents
                key="mainCRM"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainCRMFilterableComponents>

            </div>
          </section>

          {/* general */}
          <section
            key="accounts"
            ref={(el) => (sectionsRef.current["accounts"] = el)}
            className="mb-8 last:mb-0"
          >
            <div className="space-y-6">
              <div>
                <div
                  key="accountsGeneral"
                  ref={(el) => (subItemsRef.current["accountsGeneral"] = el)}
                >
                  <h1
                    className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "accountsGeneral"
                        ? "blink-animation bg-[#f1f1f1]"
                        : "bg-[#f1f1f1]"
                      }`}
                  >
                    {t("general")}
                  </h1>
                  <div key="accountsGeneral" className="space-y-4">
                    <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                      <AccountsGeneralFilterableComponents
                        key="accountsGeneral"
                        subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                        handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                        blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                        sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></AccountsGeneralFilterableComponents>

                    </div>
                  </div>
                </div>
              </div>

              {/* HR */}
              <AccountsHrFilterableComponents
                key="accountsHR"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></AccountsHrFilterableComponents>

              {/* KSA E-invoice  */}
              {userSession.countryId === Countries.Saudi && (
                <div>
                  <div
                    key="accountsEInvoiceGCC"
                    ref={(el) =>
                      (subItemsRef.current["accountsEInvoiceGCC"] = el)
                    }
                  >
                    <h1
                      className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "accountsEInvoiceGCC"
                          ? "blink-animation bg-[#f1f1f1]"
                          : "bg-[#f1f1f1]"
                        }`}
                    >
                      {t("ksa_e-invoice")}
                    </h1>
                    <div key="accountsEInvoiceGCC" className="space-y-4">
                      <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                        <div
                          className={`grid ${isCompactView
                              ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                              : `${gridClass ||
                              "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                              } gap-4 items-center justify-center`
                            }`}
                        >
                          {filterComponent(
                            [t("e-Invoice_sync_systemCode")],
                            filterText
                          ) && (
                              <ERPDisableEnable targetCount={5}>
                                {(hasPermitted) => (
                                  <ERPInput
                                    id="kSA_EInvoice_Sync_SystemCode"
                                    disabled={!hasPermitted}
                                    value={
                                      settings?.branchSettings
                                        .kSA_EInvoice_Sync_SystemCode
                                    }
                                    data={settings?.branchSettings}
                                    label={t("e-Invoice_sync_systemCode")}
                                    onChangeData={(data) =>
                                      handleFieldChange(
                                        "branchSettings",
                                        "kSA_EInvoice_Sync_SystemCode",
                                        data.kSA_EInvoice_Sync_SystemCode
                                      )
                                    }
                                  />
                                )}
                              </ERPDisableEnable>
                            )}
                          {filterComponent(
                            [t("maintain_KSA_eInvoice")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="maintainKSA_EInvoice"
                                label={t("maintain_KSA_eInvoice")}
                                disabled={
                                  settings?.branchSettings?.maintainTax === false
                                }
                                data={settings?.branchSettings}
                                checked={
                                  settings?.branchSettings?.maintainKSA_EInvoice
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "branchSettings",
                                    "maintainKSA_EInvoice",
                                    data.maintainKSA_EInvoice
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("apply_KSA_eInvoice_validation_rules")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="apply_KSA_EInvoice_Validation_Rules"
                                label={t("apply_KSA_eInvoice_validation_rules")}
                                checked={
                                  settings?.branchSettings
                                    ?.apply_KSA_EInvoice_Validation_Rules
                                }
                                data={settings?.branchSettings}
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "branchSettings",
                                    "apply_KSA_EInvoice_Validation_Rules",
                                    data.apply_KSA_EInvoice_Validation_Rules
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [
                              t(
                                "create_credit_note_automatically_on_sales_edit"
                              ),
                            ],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="createCreditNoteAutomaticallyOnSalesEdit"
                                label={t(
                                  "create_credit_note_automatically_on_sales_edit"
                                )}
                                data={settings?.branchSettings}
                                checked={
                                  settings?.branchSettings
                                    ?.createCreditNoteAutomaticallyOnSalesEdit
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "branchSettings",
                                    "createCreditNoteAutomaticallyOnSalesEdit",
                                    data.createCreditNoteAutomaticallyOnSalesEdit
                                  )
                                }
                              />
                            )}
                        </div>
                        <div
                          className={`grid ${isCompactView
                              ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                              : `${gridClass ||
                              "xxl:grid-cols-3 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1"
                              } gap-2 items-center justify-center border border-solid border-[#e3e3e3] p-4 rounded-lg`
                            }`}
                        >
                          {filterComponent([t("otp_email")], filterText) && (
                            <>
                              <div className="flex gap-4 items-center">
                                <ERPInput
                                  id="oTPEmail"
                                  label={t("otp_email")}
                                  value={settings?.mainSettings?.oTPEmail}
                                  data={settings?.mainSettings}
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "mainSettings",
                                      "oTPEmail",
                                      data.oTPEmail
                                    )
                                  }
                                />
                                <ERPButton
                                  title={t("send_otp")}
                                  variant="secondary"
                                  loading={otpSending}
                                  className="mt-4"
                                  disabled={otpSending}
                                  onClick={() => sendOtp()}
                                />
                              </div>
                              <div className="flex gap-4 items-center xxl:mt-4">
                                <ERPInput
                                  id="oTPVerification"
                                  label=" "
                                  placeholder="Enter OTP"
                                  data={settings?.mainSettings}
                                  value={
                                    settings?.mainSettings?.oTPVerification
                                  }
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "mainSettings",
                                      "oTPVerification",
                                      data.oTPVerification
                                    )
                                  }
                                />
                                <ERPButton
                                  title={t("verify")}
                                  variant="primary"
                                  loading={otpVerifying}
                                  disabled={otpVerifying}
                                  onClick={() => verifyOtp()}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section
            key="inventory"
            ref={(el) => (sectionsRef.current["inventory"] = el)}
            className="mb-8 last:mb-0 space-y-6">
            {/* General */}
            <MainInventoryGeneralFilterableComponents
              key="inventoryGeneral"
              subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
              handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
              blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
              sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
            </MainInventoryGeneralFilterableComponents>

            {/* products */}
            <div>
              <div
                key="inventoryProducts"
                ref={(el) => (subItemsRef.current["inventoryProducts"] = el)}
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventoryProducts"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("products")}
                </h1>
                <div key="inventoryProducts" className="space-y-4">
                  <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent([t("batch_criteria")], filterText) && (
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
                            handleFieldChange(
                              "productsSettings",
                              "batchCriteria",
                              data.batchCriteria
                            )
                          }
                          label={t("batch_criteria")}
                        />
                      )}

                      {filterComponent([t("margin_round_to")], filterText) && (
                        <ERPInput
                          id="marginRoundTo"
                          label={t("margin_round_to")}
                          type="number"
                          data={settings?.productsSettings}
                          value={settings?.productsSettings?.marginRoundTo}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "productsSettings",
                              "marginRoundTo",
                              data.marginRoundTo
                            )
                          }
                        />
                      )}

                      {filterComponent([t("HSN_code")], filterText) && (
                        <ERPDataCombobox
                          field={{
                            id: "showHSNCodeWarning",
                            valueKey: "label",
                            labelKey: "label",
                          }}
                          id="showHSNCodeWarning"
                          label={t("HSN_code")}
                          data={settings?.productsSettings}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "productsSettings",
                              "showHSNCodeWarning",
                              data.showHSNCodeWarning
                            )
                          }
                          options={[
                            { value: 0, label: "Block" },
                            { value: 1, label: "Warn" },
                            { value: 2, label: "Ignore" },
                          ]}
                        />
                      )}

                      {userSession.countryId == Countries.India && (
                        <>
                          {filterComponent(
                            [t("LP_priceLess_than_selling_price")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                field={{
                                  id: "lPPriceLessThanSellingPrice",
                                  valueKey: "label",
                                  labelKey: "label",
                                }}
                                id="lPPriceLessThanSellingPrice"
                                label={t("LP_priceLess_than_selling_price")}
                                data={settings?.productsSettings}
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "lPPriceLessThanSellingPrice",
                                    data.lPPriceLessThanSellingPrice
                                  )
                                }
                                options={[
                                  { value: 0, label: "Block" },
                                  { value: 1, label: "Warn" },
                                  { value: 2, label: "Ignore" },
                                ]}
                              />
                            )}

                          {filterComponent(
                            [t("MRP_less_than_sales_price")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                field={{
                                  id: "mRPLessThanSalesPrice",
                                  valueKey: "label",
                                  labelKey: "label",
                                }}
                                id="mRPLessThanSalesPrice"
                                label={t("MRP_less_than_sales_price")}
                                data={settings?.productsSettings}
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "mRPLessThanSalesPrice",
                                    data.mRPLessThanSalesPrice
                                  )
                                }
                                options={[
                                  { value: 0, label: "Block" },
                                  { value: 1, label: "Warn" },
                                  { value: 2, label: "Ignore" },
                                ]}
                              />
                            )}

                          {filterComponent(
                            [t("zero_multi_rate_validate")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                field={{
                                  id: "zeroMultiRateValidate",
                                  valueKey: "label",
                                  labelKey: "label",
                                }}
                                id="zeroMultiRateValidate"
                                label={t("zero_multi_rate_validate")}
                                data={settings?.productsSettings}
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "zeroMultiRateValidate",
                                    data.zeroMultiRateValidate
                                  )
                                }
                                options={[
                                  { value: 0, label: "Block" },
                                  { value: 1, label: "Warn" },
                                  { value: 2, label: "Ignore" },
                                ]}
                              />
                            )}
                        </>
                      )}

                      {filterComponent(
                        [t("weighing_scale_barcode_type")],
                        filterText
                      ) && (
                          <ERPDataCombobox
                            field={{
                              id: "weighingScaleBarcodeType",
                              valueKey: "label",
                              labelKey: "label",
                            }}
                            id="weighingScaleBarcodeType"
                            label={t("weighing_scale_barcode_type")}
                            data={settings?.productsSettings}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "weighingScaleBarcodeType",
                                data.weighingScaleBarcodeType
                              )
                            }
                            options={[
                              { value: 0, label: "Standard. No Check Digit" },
                              {
                                value: 1,
                                label: "13 Digit With Check Digit (Qty)",
                              },
                              {
                                value: 2,
                                label: "13 Digit With Check Digit (Value)",
                              },
                              {
                                value: 3,
                                label: "13 Digit With Check Digit (Qty/Value)",
                              },
                              { value: 4, label: "Ignore" },
                            ]}
                          />
                        )}

                      <div>
                        {filterComponent(
                          [t("last_generated_barcode")],
                          filterText
                        ) && (
                            <>
                              <ERPCheckbox
                                id="isLastSystemGeneratedBarcode"
                                label={t("last_generated_barcode")}
                                checked={isLastSystemGeneratedBarcode}
                                onChange={(data) =>
                                  setIsLastSystemGeneratedBarcode(
                                    data.target.checked
                                  )
                                }
                              />

                              <ERPInput
                                id="lastSystemGeneratedBarcode"
                                label=" "
                                value={
                                  settings?.productsSettings
                                    ?.lastSystemGeneratedBarcode
                                }
                                data={settings?.productsSettings}
                                noLabel={true}
                                type="text"
                                disabled={!isLastSystemGeneratedBarcode}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "lastSystemGeneratedBarcode",
                                    data.lastSystemGeneratedBarcode
                                  )
                                }
                              />
                            </>
                          )}
                      </div>

                      {filterComponent(
                        [t("weighing_scale_plu_file_path")],
                        filterText
                      ) && (
                          <ERPInput
                            id="weighingScalePluFilePath"
                            value={
                              settings?.miscellaneousSettings
                                ?.weighingScalePluFilePath
                            }
                            data={settings?.miscellaneousSettings}
                            className="flex-grow"
                            label={t("plu_path")}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "miscellaneousSettings",
                                "weighingScalePluFilePath",
                                data.weighingScalePluFilePath
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("allow_only_scan_product")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            data={settings?.productsSettings}
                            id="allowOnlyScanProductMarkedAsWeighingScaleItems"
                            label={t("allow_only_scan_product")}
                            checked={
                              settings?.productsSettings
                                ?.allowOnlyScanProductMarkedAsWeighingScaleItems
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "allowOnlyScanProductMarkedAsWeighingScaleItems",
                                data.allowOnlyScanProductMarkedAsWeighingScaleItems
                              )
                            }
                          />
                        )}

                      {filterComponent([t("allow_multi_rate")], filterText) && (
                        <ERPCheckbox
                          id="allowMultirate"
                          data={settings?.productsSettings}
                          label={t("allow_multi_rate")}
                          checked={settings?.productsSettings?.allowMultirate}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "productsSettings",
                              "allowMultirate",
                              data.allowMultirate
                            )
                          }
                        />
                      )}

                      {userSession.countryId === Countries.India &&
                        filterComponent(
                          [t("allow_update_multiRate")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="allowUpdateMultiRateinPurchase"
                            label={t("allow_update_multiRate")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.allowUpdateMultiRateinPurchase
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "allowUpdateMultiRateinPurchase",
                                data.allowUpdateMultiRateinPurchase
                              )
                            }
                          />
                        )}

                      {filterComponent([t("allow_multi_unit")], filterText) && (
                        <ERPCheckbox
                          id="allowMultiUnits"
                          label={t("allow_multi_unit")}
                          data={settings?.productsSettings}
                          checked={settings?.productsSettings?.allowMultiUnits}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "productsSettings",
                              "allowMultiUnits",
                              data.allowMultiUnits
                            )
                          }
                        />
                      )}

                      {filterComponent(
                        [t("allow_update_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="allowUpdateSalesPriceFromPurchase"
                            label={t("allow_update_sales")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.allowUpdateSalesPriceFromPurchase
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "allowUpdateSalesPriceFromPurchase",
                                data.allowUpdateSalesPriceFromPurchase
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("set_default_qty_1")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setDefaultQty1"
                            data={settings?.productsSettings}
                            label={t("set_default_qty_1")}
                            checked={settings?.productsSettings?.setDefaultQty1}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "setDefaultQty1",
                                data.setDefaultQty1
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("set_qty1_for_weighing_scale_item_value_mode")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setQty1ForWeighingScaleItem_ValueMode"
                            data={settings?.productsSettings}
                            label={t(
                              "set_qty1_for_weighing_scale_item_value_mode"
                            )}
                            checked={
                              settings?.productsSettings
                                ?.setQty1ForWeighingScaleItem_ValueMode
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "setQty1ForWeighingScaleItem_ValueMode",
                                data.setQty1ForWeighingScaleItem_ValueMode
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("enable_google_translation")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableGoogleTranslationOfProductName"
                            label={t("enable_google_translation")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.enableGoogleTranslationOfProductName
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "enableGoogleTranslationOfProductName",
                                data.enableGoogleTranslationOfProductName
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("include_search_item")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="includeSearchItemAlias_ItemName2"
                            label={t("include_search_item")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.includeSearchItemAlias_ItemName2
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "includeSearchItemAlias_ItemName2",
                                data.includeSearchItemAlias_ItemName2
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("advanced_product_searching")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="advancedProductSearching"
                            label={t("advanced_product_searching")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.advancedProductSearching
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "advancedProductSearching",
                                data.advancedProductSearching
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("load_dummy_products")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="loadDummyProducts"
                            label={t("load_dummy_products")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.loadDummyProducts
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "loadDummyProducts",
                                data.loadDummyProducts
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("use_popup_window_for_item_search")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="usePopupWindowForItemSearch"
                            label={t("use_popup_window_for_item_search")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.usePopupWindowForItemSearch
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "usePopupWindowForItemSearch",
                                data.usePopupWindowForItemSearch
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("enable_supplier_wise_item_code")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableSupplierWiseItemCode"
                            label={t("enable_supplier_wise_item_code")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.enableSupplierWiseItemCode
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "enableSupplierWiseItemCode",
                                data.enableSupplierWiseItemCode
                              )
                            }
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GST settings */}
            {userSession.countryId === Countries.India && (
              <div>
                <div
                  key="inventoryGSTSettings"
                  ref={(el) =>
                    (subItemsRef.current["inventoryGSTSettings"] = el)
                  }
                >
                  <h1
                    className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventoryGSTSettings"
                        ? "blink-animation bg-[#f1f1f1]"
                        : "bg-[#f1f1f1]"
                      }`}
                  >
                    {t("gst_settings")}
                  </h1>
                  <div key="inventoryGSTSettings" className="space-y-4">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent([t("default_purchase")], filterText) && (
                        <>
                          <label>{t("default_purchase")}</label>
                          <ERPCheckbox
                            id="purchaseNormalType"
                            checked={
                              settings?.gSTTaxesSettings?.purchaseNormalType
                            }
                            data={settings?.gSTTaxesSettings}
                            label={t("normal")}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "gSTTaxesSettings",
                                "purchaseNormalType",
                                data.purchaseNormalType
                              )
                            }
                          />
                          <ERPCheckbox
                            id="purchaseInterstateType"
                            checked={
                              settings?.gSTTaxesSettings?.purchaseInterstateType
                            }
                            data={settings?.gSTTaxesSettings}
                            label={t("inter_state")}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "gSTTaxesSettings",
                                "purchaseInterstateType",
                                data.purchaseInterstateType
                              )
                            }
                          />
                          <ERPCheckbox
                            id="purchaseForm62"
                            checked={settings?.gSTTaxesSettings?.purchaseForm62}
                            data={settings?.gSTTaxesSettings}
                            label={t("form_6(2)")}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "gSTTaxesSettings",
                                "purchaseForm62",
                                data.purchaseForm62
                              )
                            }
                          />
                        </>
                      )}
                    </div>
                    <ERPDisableEnable targetCount={5}>
                      {(hasPermitted) => (
                        <div
                          className={`grid ${isCompactView
                              ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                              : `${gridClass ||
                              "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                              } gap-4 items-center justify-center border border-solid border-[#e3e3e3] p-4 rounded-lg`
                            }`}
                        >
                          {filterComponent(
                            [t("input_cst_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputCSTAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.inputCSTAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("input_cst_account")}
                                field={{
                                  id: "inputCSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputCSTAccount",
                                    data.inputCSTAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("output_cst_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputCSTAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.outputCSTAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("output_cst_account")}
                                field={{
                                  id: "outputCSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputCSTAccount",
                                    data.outputCSTAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("input_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputCessAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.inputCessAccount
                                  )
                                }
                                field={{
                                  id: "inputCessAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                data={settings?.gSTTaxesSettings}
                                label={t("input_cess_account")}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputCessAccount",
                                    data.inputCessAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("output_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputCessAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.outputCessAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("output_cess_account")}
                                field={{
                                  id: "outputCessAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputCessAccount",
                                    data.outputCessAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("input_add_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputAddCessAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.inputAddCessAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("input_add_cess_account")}
                                field={{
                                  id: "inputAddCessAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputAddCessAccount",
                                    data.inputAddCessAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("output_add_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputAddCessAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.outputAddCessAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("output_add_cess_account")}
                                field={{
                                  id: "outputAddCessAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputAddCessAccount",
                                    data.outputAddCessAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("expenses_tax_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="expensesTaxAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.expensesTaxAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("expenses_tax_account")}
                                field={{
                                  id: "expensesTaxAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "expensesTaxAccount",
                                    data.expensesTaxAccount
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("income_tax_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="incomeTaxAccount"
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.incomeTaxAccount
                                  )
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("income_tax_account")}
                                field={{
                                  id: "incomeTaxAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "incomeTaxAccount",
                                    data.incomeTaxAccount
                                  )
                                }
                              />
                            )}
                        </div>
                      )}
                    </ERPDisableEnable>
                    <ERPDisableEnable targetCount={5}>
                      {(hasPermitted) => (
                        <div
                          className={`grid ${isCompactView
                              ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                              : `${gridClass ||
                              "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                              } gap-4 items-center justify-center border border-solid border-[#e3e3e3] p-4 rounded-lg`
                            }`}
                        >
                          {filterComponent(
                            [t("input_SGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputSGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.inputSGSTAccount
                                  )
                                }
                                label={t("input_SGST_account")}
                                field={{
                                  id: "inputSGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputSGSTAccount",
                                    data.inputSGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("output_SGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputSGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.outputSGSTAccount
                                  )
                                }
                                label={t("output_SGST_account")}
                                field={{
                                  id: "outputSGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputSGSTAccount",
                                    data.outputSGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("input_CGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputCGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.inputCGSTAccount
                                  )
                                }
                                label={t("input_CGST_account")}
                                field={{
                                  id: "inputCGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputCGSTAccount",
                                    data.inputCGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("output_CGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputCGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.outputCGSTAccount
                                  )
                                }
                                label={t("output_CGST_account")}
                                field={{
                                  id: "outputCGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputCGSTAccount",
                                    data.outputCGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("input_IGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputIGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.inputIGSTAccount
                                  )
                                }
                                label={t("input_IGST_account")}
                                field={{
                                  id: "inputIGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputIGSTAccount",
                                    data.inputIGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("output_IGST_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputIGSTAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings?.outputIGSTAccount
                                  )
                                }
                                label={t("output_IGST_account")}
                                field={{
                                  id: "outputIGSTAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputIGSTAccount",
                                    data.outputIGSTAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("TCS_paid_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputTCSPaidAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.outputTCSPaidAccount
                                  )
                                }
                                label={t("TCS_paid_account")}
                                field={{
                                  id: "outputTCSPaidAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputTCSPaidAccount",
                                    data.outputTCSPaidAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("TCS_payable_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputTCSPayableAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.outputTCSPayableAccount
                                  )
                                }
                                label={t("TCS_payable_account")}
                                field={{
                                  id: "outputTCSPayableAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputTCSPayableAccount",
                                    data.outputTCSPayableAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("input_calamity_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="inputCalamityCessAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.inputCalamityCessAccount
                                  )
                                }
                                label={t("input_calamity_cess_account")}
                                field={{
                                  id: "inputCalamityCessAccount",
                                  getListUrl: Urls.data_InputCalamity,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "inputCalamityCessAccount",
                                    data.inputCalamityCessAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("output_calamity_cess_account")],
                            filterText
                          ) && (
                              <ERPDataCombobox
                                id="outputSalesCalamityCessAccount"
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.outputSalesCalamityCessAccount
                                  )
                                }
                                label={t("output_calamity_cess_account")}
                                field={{
                                  id: "outputSalesCalamityCessAccount",
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "outputSalesCalamityCessAccount",
                                    data.outputSalesCalamityCessAccount
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("consider_sales_price_as_calamity_included")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="considerSalesPriceasCalamityIncluded"
                                checked={
                                  settings?.gSTTaxesSettings
                                    ?.considerSalesPriceasCalamityIncluded
                                }
                                data={settings?.gSTTaxesSettings}
                                disabled={
                                  !hasPermitted &&
                                  !isNullOrUndefinedOrEmpty(
                                    settings?.gSTTaxesSettings
                                      ?.considerSalesPriceasCalamityIncluded
                                  )
                                }
                                label={t(
                                  "consider_sales_price_as_calamity_included"
                                )}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "considerSalesPriceasCalamityIncluded",
                                    data.considerSalesPriceasCalamityIncluded
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("enable_karnataka_tax_report_format")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="enableKarnatakaTaxReportFormat"
                                checked={
                                  settings?.gSTTaxesSettings
                                    ?.enableKarnatakaTaxReportFormat
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("enable_karnataka_tax_report_format")}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "enableKarnatakaTaxReportFormat",
                                    data.enableKarnatakaTaxReportFormat
                                  )
                                }
                              />
                            )}
                          {filterComponent(
                            [t("show_prev._forms")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="showPrevForms"
                                checked={
                                  settings?.gSTTaxesSettings?.showPrevForms
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("show_prev._forms")}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "showPrevForms",
                                    data.showPrevForms
                                  )
                                }
                              />
                            )}
                        </div>
                      )}
                    </ERPDisableEnable>
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center border border-solid border-[#e3e3e3] p-4 rounded-lg`
                        }`}
                    >
                      <div className="flex gap-4 items-center">
                        {filterComponent([t("enable_ewb")], filterText) && (
                          <>
                            <ERPCheckbox
                              id="enableEWB"
                              checked={settings?.gSTTaxesSettings?.enableEWB}
                              data={settings?.gSTTaxesSettings}
                              label={t("enable_ewb")}
                              onChangeData={(data: any) =>
                                handleFieldChange(
                                  "gSTTaxesSettings",
                                  "enableEWB",
                                  data.enableEWB
                                )
                              }
                            />
                            <ERPButton
                              title={t("ewb_taxPro")}
                              onClick={() => handleShowComponent("ewb")}
                              disabled={!settings?.gSTTaxesSettings?.enableEWB}
                            />
                          </>
                        )}
                      </div>

                      <div className="flex gap-4 items-center">
                        {filterComponent(
                          [t("enable_e-invoice")],
                          filterText
                        ) && (
                            <>
                              <ERPCheckbox
                                id="enableEInvoiceIndia"
                                checked={
                                  settings?.gSTTaxesSettings?.enableEInvoiceIndia
                                }
                                data={settings?.gSTTaxesSettings}
                                label={t("enable_e-invoice")}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "gSTTaxesSettings",
                                    "enableEInvoiceIndia",
                                    data.enableEInvoiceIndia
                                  )
                                }
                              />
                              <ERPButton
                                title={t("EInvoiceTaxPro")}
                                onClick={() => handleShowComponent("eInvoice")}
                                disabled={
                                  !settings?.gSTTaxesSettings?.enableEInvoiceIndia
                                }
                              />
                            </>
                          )}
                      </div>
                    </div>
                    <PopupComponent
                      isOpen={showEInvoicePopup}
                      onClose={() => setShowEInvoicePopup(false)}
                    >
                      <EInvoiceTaxPro />
                    </PopupComponent>

                    <PopupComponent
                      isOpen={showEWBPopup}
                      onClose={() => setShowEWBPopup(false)}
                    >
                      <EWBTaxPro />
                    </PopupComponent>
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 mt-5 border border-solid border-[#e3e3e3] p-4 rounded-lg`
                        }`}
                    >
                      {filterComponent(
                        [t("e-invoice_provider_type")],
                        filterText
                      ) && (
                          <ERPDataCombobox
                            field={{
                              id: "einvoiceProvider",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            id="einvoiceProvider"
                            label={t("e-invoice_provider_type")}
                            data={settings?.gSTTaxesSettings}
                            onChangeData={(data) => {
                              handleFieldChange(
                                "gSTTaxesSettings",
                                "einvoiceProvider",
                                data.einvoiceProvider
                              );
                            }}
                            options={[
                              { value: "Clear Tax", label: "Clear Tax" },
                              { value: "Tax Pro", label: "Tax Pro" },
                            ]}
                          />
                        )}
                      {filterComponent([t("clear_tax_token")], filterText) && (
                        <ERPInput
                          id="eInvoiceAuthToken"
                          value={settings?.gSTTaxesSettings?.eInvoiceAuthToken}
                          data={settings?.gSTTaxesSettings}
                          label={t("clear_tax_token")}
                          onChangeData={(data: any) =>
                            handleFieldChange(
                              "gSTTaxesSettings",
                              "eInvoiceAuthToken",
                              data.eInvoiceAuthToken
                            )
                          }
                        />
                      )}
                      {filterComponent([t("clear_tax_id")], filterText) && (
                        <ERPInput
                          id="eInvoiceOwnerID"
                          value={settings?.gSTTaxesSettings?.eInvoiceOwnerID}
                          data={settings?.gSTTaxesSettings}
                          label={t("clear_tax_id")}
                          onChangeData={(data: any) =>
                            handleFieldChange(
                              "gSTTaxesSettings",
                              "eInvoiceOwnerID",
                              data.eInvoiceOwnerID
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userSession.countryId === Countries.Saudi && (
              <div
                key="inventoryTaxSettings"
                ref={(el) => (subItemsRef.current["inventoryTaxSettings"] = el)}
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventoryTaxSettings"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("tax_settings")}
                </h1>
                <div className="border border-solid border-[#e3e3e3] p-4 rounded-lg">
                  <div key="inventoryTaxSettings" className="space-y-4">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4`
                        }`}
                    >
                      {filterComponent([t("default_purchase")], filterText) && (
                        <>
                          <ERPDataCombobox
                            id="purchaseFormType"
                            data={settings?.taxSettings}
                            field={{
                              id: "purchaseFormType",

                              getListUrl: Urls.data_FormTypeByPI,
                              valueKey: "FormType",
                              labelKey: "FormType",
                            }}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "taxSettings",
                                "purchaseFormType",
                                data.purchaseFormType
                              )
                            }
                            label={t("default_purchase")}
                          />

                          <ERPDataCombobox
                            id="salesFormType"
                            data={settings?.taxSettings}
                            field={{
                              id: "salesFormType",

                              getListUrl: Urls.data_FormTypeBySI,
                              valueKey: "FormType",
                              labelKey: "FormType",
                            }}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "taxSettings",
                                "salesFormType",
                                data.salesFormType
                              )
                            }
                            label={t("sales_form_type")}
                          />
                          <ERPDataCombobox
                            id="purchaseTaxAccount"
                            data={settings?.taxSettings}
                            field={{
                              id: "purchaseTaxAccount",
                              required: false,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "taxSettings",
                                "purchaseTaxAccount",
                                data.purchaseTaxAccount
                              )
                            }
                            label={t("purchase_tax_ledger")}
                          />
                          <ERPDataCombobox
                            id="salesTaxAccount"
                            data={settings?.taxSettings}
                            field={{
                              id: "salesTaxAccount",
                              required: false,
                              getListUrl: Urls.data_duties_taxes,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "taxSettings",
                                "salesTaxAccount",
                                data.salesTaxAccount
                              )
                            }
                            label={t("sales_tax_ledger")}
                          />
                          {1 != 1 && (
                            <>
                              <ERPDataCombobox
                                id="purchaseCSTAccount"
                                data={settings?.taxSettings}
                                disabled
                                field={{
                                  id: "purchaseCSTAccount",
                                  required: false,
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "taxSettings",
                                    "purchaseCSTAccount",
                                    data.purchaseCSTAccount
                                  )
                                }
                                label={t("purchase_cst_account")}
                              />
                              <ERPDataCombobox
                                id="salesCSTAccount"
                                disabled
                                data={settings?.taxSettings}
                                field={{
                                  id: "salesCSTAccount",
                                  required: false,
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "taxSettings",
                                    "salesCSTAccount",
                                    data.salesCSTAccount
                                  )
                                }
                                label={t("sales_cst_account")}
                              />
                              <ERPDataCombobox
                                id="expensesTaxAccount"
                                disabled
                                data={settings?.taxSettings}
                                field={{
                                  id: "expensesTaxAccount",
                                  required: false,
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "taxSettings",
                                    "expensesTaxAccount",
                                    data.expensesTaxAccount
                                  )
                                }
                                label={t("expenses_tax_account")}
                              />
                              <ERPDataCombobox
                                id="incomeTaxAccount"
                                disabled
                                data={settings?.taxSettings}
                                field={{
                                  id: "incomeTaxAccount",
                                  required: false,
                                  getListUrl: Urls.data_duties_taxes,
                                  valueKey: "id",
                                  labelKey: "name",
                                }}
                                onChangeData={(data: any) =>
                                  handleFieldChange(
                                    "taxSettings",
                                    "incomeTaxAccount",
                                    data.incomeTaxAccount
                                  )
                                }
                                label={t("income_tax_account")}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div
                key="inventoryPurchase"
                ref={(el) => (subItemsRef.current["inventoryPurchase"] = el)}
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventoryPurchase"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
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
                        }`}
                    >
                      {filterComponent(
                        [t("default_purchase_account")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("default_purchase_return_account")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("bill_discount_given_ledger")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("unit_price_decimal_points")],
                        filterText
                      ) && (
                          <ERPDataCombobox
                            field={{
                              id: "unitPrice_decimalPoint",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            id="unitPrice_decimalPoint"
                            label={t("unit_price_decimal_points")}
                            data={settings?.mainSettings}
                            defaultData={
                              settings?.mainSettings?.unitPrice_decimalPoint
                            }
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
                        )}

                      {filterComponent(
                        [t("default_purchase_assets_account")],
                        filterText
                      ) && (
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
                              {
                                value: "SuspenseAccount",
                                label: "Suspense Account",
                              },
                              {
                                value: "CustomerAndSupplier",
                                label: "Customer and Supplier",
                              },
                              { value: "Cash_Bank", label: "Cash & Bank" },
                              {
                                value: "Cash_Bank_Suppliers",
                                label: "Cash & Bank - Suppliers",
                              },
                              {
                                value: "Cash_Bank_Customers",
                                label: "Cash & Bank - Customers",
                              },
                              {
                                value: "Cash_Bank_Suppliers_Customers",
                                label: "Cash & Bank - Suppliers & Customers",
                              },
                              { value: "Sales_Account", label: "Sales Account" },
                              {
                                value: "Purchase_Account",
                                label: "Purchase Account",
                              },
                              { value: "Salaries", label: "Salaries" },
                              {
                                value: "Discount_Received",
                                label: "Discount Received",
                              },
                              {
                                value: "Discount_Given",
                                label: "Discount Given",
                              },
                              {
                                value: "Incentive_Given",
                                label: "Incentive Given",
                              },
                              {
                                value: "Salary_Account",
                                label: "Salary Account",
                              },
                              { value: "Job_Works", label: "Job Works" },
                              {
                                value: "Branch_Receivable",
                                label: "Branch Receivable",
                              },
                              {
                                value: "SalesAndDirectIncome",
                                label: "Sales and Direct Income",
                              },
                              {
                                value: "PurchaseAndDirectExpense",
                                label: "Purchase and Direct Expense",
                              },
                              {
                                value: "Cash_Bank_Suppliers_Customers_Employees",
                                label:
                                  "Cash & Bank - Suppliers, Customers & Employees",
                              },
                              {
                                value: "Cash_Bank_Customers_Employees",
                                label: "Cash & Bank - Customers & Employees",
                              },
                              {
                                value: "Branch_Payable",
                                label: "Branch Payable",
                              },
                              {
                                value: "Branch_Recv_Payable",
                                label: "Branch Receivable & Payable",
                              },
                              { value: "Expenses", label: "Expenses" },
                              { value: "Incomes", label: "Incomes" },
                              {
                                value: "Credit_Note_Ledgers",
                                label: "Credit Note Ledgers",
                              },
                              {
                                value: "DebitNote_Note_Ledgers",
                                label: "Debit Note Ledgers",
                              },
                              {
                                value:
                                  "Liabilities_Expenses_All_Without_Salaries",
                                label: "Liabilities & Expenses (Excl. Salaries)",
                              },
                              {
                                value: "Current_Assets",
                                label: "Current Assets",
                              },
                              { value: "Fixed_Assets", label: "Fixed Assets" },
                              {
                                value: "Indirect_Expenses",
                                label: "Indirect Expenses",
                              },
                              {
                                value: "Indirect_Income",
                                label: "Indirect Income",
                              },
                            ]}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "accountsSettings",
                                "defaultPurchaseAssetsAccount",
                                data.defaultPurchaseAssetsAccount
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("carry_forward_purchase")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="carryForwardPurchaseOrderQtyToPurchase"
                            checked={
                              settings?.inventorySettings
                                ?.carryForwardPurchaseOrderQtyToPurchase
                            }
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
                        )}

                      {filterComponent(
                        [t("set_product_cost_as_purchase_price")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setProductCostasPurchasePrice"
                            checked={
                              settings?.inventorySettings
                                ?.setProductCostasPurchasePrice
                            }
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
                        )}

                      {filterComponent(
                        [t("set_last_purchase")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setLastPurchaseRateAsProctRate"
                            checked={
                              settings?.inventorySettings
                                ?.setLastPurchaseRateAsProctRate
                            }
                            data={settings?.inventorySettings}
                            label={t("set_last_purchase")}
                            onChangeData={(data: any) => {
                              const newValue =
                                data.setLastPurchaseRateAsProctRate;
                              if (
                                !newValue &&
                                settings?.inventorySettings
                                  ?.setProductCostasPurchasePrice
                              ) {
                                handleFieldChange(
                                  "inventorySettings",
                                  "setProductCostasPurchasePrice",
                                  false
                                );
                              }
                              handleFieldChange(
                                "inventorySettings",
                                "setLastPurchaseRateAsProctRate",
                                newValue
                              );
                            }}
                          />
                        )}

                      {filterComponent(
                        [t("is_reference_number")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="isReferenceNumberMandatoryInPurchase"
                            checked={
                              settings?.inventorySettings
                                ?.isReferenceNumberMandatoryInPurchase
                            }
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
                        )}

                      {filterComponent([t("set_avg_purchase")], filterText) && (
                        <ERPCheckbox
                          id="setAvgPurchaseCostWithStdPurRate"
                          checked={
                            settings?.inventorySettings
                              ?.setAvgPurchaseCostWithStdPurRate
                          }
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
                      )}

                      {filterComponent(
                        [t("update_purchase_price")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="updatePurhasePriceUpdateOnPurchaseBT"
                            checked={
                              settings?.inventorySettings
                                ?.updatePurhasePriceUpdateOnPurchaseBT
                            }
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
                        )}

                      {filterComponent(
                        [t("need_PO_approval_for_printout")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="needPOApprovalForPrintout"
                            checked={
                              settings?.inventorySettings
                                ?.needPOApprovalForPrintout
                            }
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
                        )}

                      {filterComponent(
                        [t("show_account_receivable_in_purchase")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showAccountReceivableInPurchase"
                            checked={
                              settings?.inventorySettings
                                ?.showAccountReceivableInPurchase
                            }
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
                        )}

                      {filterComponent(
                        [t("check_listed_product_prices_in_purchase_invoice")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="loadListedProductPrices"
                            label={t(
                              "check_listed_product_prices_in_purchase_invoice"
                            )}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.loadListedProductPrices
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "loadListedProductPrices",
                                data.loadListedProductPrices
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("show_purchase_cost_change_warning")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showPurchaseCostChangeWarning"
                            label={t("show_purchase_cost_change_warning")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.showPurchaseCostChangeWarning
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "showPurchaseCostChangeWarning",
                                data.showPurchaseCostChangeWarning
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("enable_import_purchase")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableImportPurchase"
                            disabled
                            label={t("enable_import_purchase")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.enableImportPurchase
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "enableImportPurchase",
                                data.enableImportPurchase
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("maintain_untallied_bills")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="maintainUntalliedBills"
                            checked={
                              settings?.miscellaneousSettings
                                ?.maintainUntalliedBills
                            }
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
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* sales */}
            <div>
              <div
                key="inventorySales"
                ref={(el) => (subItemsRef.current["inventorySales"] = el)}
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventorySales"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("sales")}
                </h1>
                <div key="inventorySales" className="space-y-4">
                  <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent(
                        [t("default_sales_account")],
                        filterText
                      ) && (
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
                              handleFieldChange(
                                "inventorySettings",
                                "defaultSalesAcc",
                                data.defaultSalesAcc
                              )
                            }
                            label={t("default_sales_account")}
                          />
                        )}

                      {filterComponent(
                        [t("default_sales_return_account")],
                        filterText
                      ) && (
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
                              handleFieldChange(
                                "inventorySettings",
                                "defaultSalesReturnAcc",
                                data.defaultSalesReturnAcc
                              )
                            }
                            label={t("default_sales_return_account")}
                          />
                        )}

                      <div>
                        {filterComponent(
                          [t("service_warranty_inv_accounts")],
                          filterText
                        ) && (
                            <>
                              <ERPCheckbox
                                id="serviceWarrantyInvAccounts"
                                checked={
                                  settings?.inventorySettings
                                    ?.serviceWarrantyInvAccounts
                                }
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
                                disabled={
                                  settings?.inventorySettings
                                    ?.serviceWarrantyInvAccounts !== true
                                }
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
                            </>
                          )}
                      </div>

                      <div>
                        {filterComponent(
                          [t("service_non_warranty_inv_accounts")],
                          filterText
                        ) && (
                            <>
                              <ERPCheckbox
                                id="serviceNonWarrantyInvAccounts"
                                checked={
                                  settings?.inventorySettings
                                    ?.serviceNonWarrantyInvAccounts
                                }
                                data={settings?.inventorySettings}
                                // noLabel={true}
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
                                disabled={
                                  settings?.inventorySettings
                                    ?.serviceNonWarrantyInvAccounts !== true
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
                                  handleFieldChange(
                                    "inventorySettings",
                                    "serviceNONWarrantyInvLedgerID",
                                    data.serviceWarrantyInvLedgerID
                                  )
                                }
                                label={t(
                                  "service_non_warranty_inv_accounts_info"
                                )}
                                noLabel={true}
                              />
                            </>
                          )}
                      </div>

                      {filterComponent(
                        [t("block_bill_discount")],
                        filterText
                      ) && (
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
                              {
                                value: "On Standard Sales",
                                label: "On Standard Sales",
                              },
                              { value: "On Both", label: "On Both" },
                              {
                                value: "If Authentication Fails",
                                label: "If Authentication Fails",
                              },
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
                        )}

                      {filterComponent(
                        [t("discount_authorization_if_discount_above")],
                        filterText
                      ) && (
                          <ERPInput
                            id="discontAuthorizationIfDiscountAbove"
                            value={
                              settings?.inventorySettings
                                ?.discontAuthorizationIfDiscountAbove
                            }
                            data={settings?.inventorySettings}
                            label={t("discount_authorization_if_discount_above")}
                            placeholder={t("enter_discount_threshold")}
                            type="number"
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "inventorySettings",
                                "discontAuthorizationIfDiscountAbove",
                                parseFloat(
                                  data.discontAuthorizationIfDiscountAbove
                                )
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("if_less_sales_rate")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent([t("credit_limit")], filterText) && (
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
                            {
                              value: "Allow Cash Sales",
                              label: "Allow Cash Sales",
                            },
                          ]}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "accountsSettings",
                              "blockOnCreditLimit",
                              data.blockOnCreditLimit
                            )
                          }
                        />
                      )}

                      {filterComponent(
                        [t("sales_rounding_method")],
                        filterText
                      ) && (
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
                              {
                                value: "Floor Round to 0.50",
                                label: "Floor Round to 0.50",
                              },
                              {
                                value: "Floor Round to 0.25",
                                label: "Floor Round to 0.25",
                              },
                              {
                                value: "Floor Round to 0.10",
                                label: "Floor Round to 0.10",
                              },
                              { value: "Not Set", label: "Not Set" },
                              {
                                value: "Round to 0.010",
                                label: "Round to 0.010",
                              },
                            ]}
                          />
                        )}

                      {filterComponent(
                        [t("default_sales_return_payable_acc")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("bill_discount_given_ledger")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("default_opening_stock_ledger")],
                        filterText
                      ) && (
                          <ERPDataCombobox
                            id="defaultOpeningStockValueAcc"
                            data={settings?.accountsSettings}
                            label={t("default_opening_stock_ledger")}
                            field={{
                              id: "defaultOpeningStockValueAcc",
                              getListUrl: Urls.data_acc_ledgers,
                              params: `ledgerID=0&ledgerType=${LedgerType.Current_Assets}`,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "accountsSettings",
                                "defaultOpeningStockValueAcc",
                                data.defaultOpeningStockValueAcc
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("default_PDC_receivable_account")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent(
                        [t("default_PDC_payable_account")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent([t("default_customer")], filterText) && (
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
                          disabled={
                            !settings?.accountsSettings
                              ?.setDefaultCustomerInSales
                          }
                        />
                      )}

                      {filterComponent(
                        [t("set_default_customer_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setDefaultCustomerInSales"
                            checked={
                              settings?.accountsSettings
                                ?.setDefaultCustomerInSales
                            }
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
                        )}

                      {filterComponent(
                        [t("set_authorization_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="setAuthorizationinSales"
                            checked={
                              settings?.inventorySettings?.setAuthorizationinSales
                            }
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
                        )}

                      {filterComponent(
                        [t("block_non_stock_serial_selling")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="blockNonStockSerialSelling"
                            checked={
                              settings?.inventorySettings
                                ?.blockNonStockSerialSelling
                            }
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
                        )}

                      {filterComponent(
                        [t("show_transit_mode")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showTransitModeStockTransferAlert"
                            checked={
                              settings?.inventorySettings
                                ?.showTransitModeStockTransferAlert
                            }
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
                        )}

                      {filterComponent(
                        [t("show_account_payable_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showAccountPayableInSales"
                            checked={
                              settings?.inventorySettings
                                ?.showAccountPayableInSales
                            }
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
                        )}

                      {filterComponent([t("hold_sales_man")], filterText) && (
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
                      )}

                      {filterComponent(
                        [t("show_non_stock_items_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showNonStockItemsinSales"
                            checked={
                              settings?.inventorySettings
                                ?.showNonStockItemsinSales
                            }
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
                        )}

                      {filterComponent(
                        [t("mobile_number_mandatory_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="mobileNumberMandotryInSales"
                            checked={
                              settings?.inventorySettings
                                ?.mobileNumberMandotryInSales
                            }
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
                        )}

                      {filterComponent(
                        [t("show_tender_window_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showTenderDialogInSales"
                            checked={
                              settings?.accountsSettings?.showTenderDialogInSales
                            }
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
                        )}

                      {filterComponent(
                        [t("allow_multipayment_mode")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="allowMultiPayments"
                            checked={
                              settings?.accountsSettings?.allowMultiPayments
                            }
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
                        )}

                      {filterComponent(
                        [t("allow_sales_route/area")],
                        filterText
                      ) && (
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
                        )}

                      {filterComponent([t("maintain_sales")], filterText) && (
                        <ERPCheckbox
                          id="maintainSalesRouteCreditLimit"
                          label={t("maintain_sales")}
                          data={settings?.mainSettings}
                          disabled={
                            !settings?.mainSettings?.allowSalesRouteArea
                          }
                          checked={
                            settings?.mainSettings
                              ?.maintainSalesRouteCreditLimit
                          }
                          onChangeData={(data) =>
                            handleFieldChange(
                              "mainSettings",
                              "maintainSalesRouteCreditLimit",
                              data.maintainSalesRouteCreditLimit
                            )
                          }
                        />
                      )}

                      {filterComponent(
                        [t("show_employees_in_sales")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showEmployeesInSales"
                            checked={
                              settings?.accountsSettings?.showEmployeesInSales
                            }
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
                        )}

                      {filterComponent(
                        [t("stop_scanning_(Sales)")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="stopScanningOnWrongBarcodeInSales"
                            label={t("stop_scanning_(Sales)")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.stopScanningOnWrongBarcodeInSales
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "stopScanningOnWrongBarcodeInSales",
                                data.stopScanningOnWrongBarcodeInSales
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("load_customer_last_sales_rate")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="loadCustomerLastRate"
                            label={t("load_customer_last_sales_rate")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.loadCustomerLastRate
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "loadCustomerLastRate",
                                data.loadCustomerLastRate
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("allow_manual_product")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="allowMannualProductSelectionInSales"
                            label={t("allow_manual_product")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.allowMannualProductSelectionInSales
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "allowMannualProductSelectionInSales",
                                data.allowMannualProductSelectionInSales
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("show_rate_(tax_inclusive)")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="showRateBeforeTax"
                            label={t("show_rate_(tax_inclusive)")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.showRateBeforeTax
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "showRateBeforeTax",
                                data.showRateBeforeTax
                              )
                            }
                          />
                        )}

                      {userSession.countryId == Countries.India &&
                        filterComponent(
                          [t("enable_order_management")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="enableOrderMangment"
                            disabled
                            label={t("enable_order_management")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings?.enableOrderMangment
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "enableOrderMangment",
                                data.enableOrderMangment
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("enable_multi_warehouse_billing")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableMultiWarehouseBilling"
                            label={t("enable_multi_warehouse_billing")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.enableMultiWarehouseBilling
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "enableMultiWarehouseBilling",
                                data.enableMultiWarehouseBilling
                              )
                            }
                          />
                        )}

                      <ERPDisableEnable targetCount={15}>
                        {(hasPermitted = false) => (
                          <>
                            {hasPermitted == true &&
                              filterComponent(
                                [t("allow_sales_detailed_edit")],
                                filterText
                              ) && (
                                <ERPCheckbox
                                  id="allowSalesDetailedEdit"
                                  checked={
                                    settings?.miscellaneousSettings
                                      ?.allowSalesDetailedEdit
                                  }
                                  data={settings?.miscellaneousSettings}
                                  label={t("allow_sales_detailed_edit")}
                                  onChangeData={(data) =>
                                    handleFieldChange(
                                      "miscellaneousSettings",
                                      "allowSalesDetailedEdit",
                                      data.allowSalesDetailedEdit
                                    )
                                  }
                                />
                              )}
                          </>
                        )}
                      </ERPDisableEnable>

                      {userSession.countryId != Countries.India &&
                        filterComponent(
                          [t("enable_sales_invoice_draft_option")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="enableSalesInvoiceDraftOption"
                            checked={
                              settings?.inventorySettings
                                ?.enableSalesInvoiceDraftOption
                            }
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
                        )}

                      {userSession.countryId != Countries.India &&
                        filterComponent(
                          [t("show_cash_sales_separate_menu")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="showCashSalesSeperateMenu"
                            checked={
                              settings?.inventorySettings
                                ?.showCashSalesSeperateMenu
                            }
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
                        )}

                      {filterComponent(
                        [t("enable_tax_on_bill_discount")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableTaxOnBillDiscount"
                            label={t("enable_tax_on_bill_discount")}
                            data={settings?.branchSettings}
                            checked={
                              settings?.branchSettings?.enableTaxOnBillDiscount
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "branchSettings",
                                "enableTaxOnBillDiscount",
                                data.enableTaxOnBillDiscount
                              )
                            }
                          />
                        )}

                      {applicationSettings != undefined &&
                        (applicationSettings?.mainSettings
                          ?.maintainBusinessType == BusinessType.Hypermarket ||
                          applicationSettings?.mainSettings
                            ?.maintainBusinessType ==
                          BusinessType.Supermarket) &&
                        filterComponent(
                          [t("show_party_balance_in_sales")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="showPartyBalanceInSales"
                            checked={
                              settings?.accountsSettings
                                ?.showPartyBalanceInSales
                            }
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
                        )}

                      {userSession.countryId != Countries.India &&
                        filterComponent(
                          [t("block_hold_items")],
                          filterText
                        ) && (
                          <ERPCheckbox
                            id="blockHoldItems"
                            checked={
                              settings?.inventorySettings?.blockHoldItems
                            }
                            data={settings?.inventorySettings}
                            label={t("block_hold_items")}
                            onChangeData={(data: any) =>
                              handleFieldChange(
                                "inventorySettings",
                                "blockHoldItems",
                                data.blockHoldItems
                              )
                            }
                          />
                        )}

                      {filterComponent([t("barcode_label")], filterText) && (
                        <ERPDataCombobox
                          id="defaultBarcodeLabel"
                          disabled
                          data={settings?.inventorySettings}
                          field={{
                            id: "defaultBarcodeLabel",
                            required: false,
                            valueKey: "id",
                            labelKey: "label",
                          }}
                          options={[
                            { value: "Default.lba", label: "Default.lba" },
                          ]}
                          onChangeData={(data: any) =>
                            handleFieldChange(
                              "inventorySettings",
                              "defaultBarcodeLabel",
                              data.defaultBarcodeLabel
                            )
                          }
                          label={t("barcode_label")}
                        />
                      )}

                      {filterComponent([t("default_brand")], filterText) && (
                        <ERPDataCombobox
                          id="defaultBrand"
                          disabled
                          data={settings?.inventorySettings}
                          field={{
                            id: "defaultBrand",
                            required: false,
                            valueKey: "id",
                            labelKey: "label",
                          }}
                          options={[
                            { value: "Default.lba", label: "Default.lba" },
                          ]}
                          onChangeData={(data: any) =>
                            handleFieldChange(
                              "inventorySettings",
                              "defaultBrand",
                              data.defaultBrand
                            )
                          }
                          label={t("default_brand")}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* POS */}
            <MainSalesPOSFilterableComponents
              key="inventorySalesPOS"
              subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
              handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
              blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
              sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
            </MainSalesPOSFilterableComponents>

            {/* counter */}
            <div>
              <div
                key="inventorySalesCounter"
                ref={(el) =>
                  (subItemsCatRef.current["inventorySalesCounter"] = el)
                }
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventorySalesCounter"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("Counter")}
                </h1>
                <div key="inventorySalesCounter" className="space-y-4">
                  <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent(
                        [t("allow_sales_counter")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="allowSalesCounter"
                            checked={
                              settings?.accountsSettings?.allowSalesCounter
                            }
                            data={settings?.accountsSettings}
                            label={t("allow_sales_counter")}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "accountsSettings",
                                "allowSalesCounter",
                                data.allowSalesCounter
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("enable_authorization_for_shift_close")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableAuthorizationforShiftClose"
                            disabled={
                              !settings?.accountsSettings?.allowSalesCounter
                            }
                            checked={
                              settings?.accountsSettings
                                ?.enableAuthorizationforShiftClose
                            }
                            data={settings?.accountsSettings}
                            label={t("enable_authorization_for_shift_close")}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "accountsSettings",
                                "enableAuthorizationforShiftClose",
                                data.enableAuthorizationforShiftClose
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("allow_user_wise_counter")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="allowUserwiseCounter"
                            disabled={
                              !settings?.accountsSettings?.allowSalesCounter
                            }
                            checked={
                              settings?.accountsSettings?.allowUserwiseCounter
                            }
                            data={settings?.accountsSettings}
                            label={t("allow_user_wise_counter")}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "accountsSettings",
                                "allowUserwiseCounter",
                                data.allowUserwiseCounter
                              )
                            }
                          />
                        )}

                      {filterComponent(
                        [t("maintain_counter_wise_prefix_for_transaction")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="maintainCounterWisePrefixForTransaction"
                            label={t(
                              "maintain_counter_wise_prefix_for_transaction"
                            )}
                            data={settings?.branchSettings}
                            checked={
                              settings?.branchSettings
                                ?.maintainCounterWisePrefixForTransaction
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "branchSettings",
                                "maintainCounterWisePrefixForTransaction",
                                data.maintainCounterWisePrefixForTransaction
                              )
                            }
                          />
                        )}
                    </div>
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-1 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent(
                        [t("minimum_shift_duration")],
                        filterText
                      ) && (
                          <>
                            <div className="flex items-center gap-1">
                              <ERPCheckbox
                                id="allowMinimumShiftDuration"
                                checked={
                                  settings?.accountsSettings
                                    ?.allowMinimumShiftDuration
                                }
                                data={settings?.accountsSettings}
                                label={t("minimum_shift_duration")}
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "accountsSettings",
                                    "allowMinimumShiftDuration",
                                    data.allowMinimumShiftDuration
                                  )
                                }
                              />
                              <ERPInput
                                id="minimumShiftDuration"
                                value={
                                  settings?.accountsSettings?.minimumShiftDuration
                                }
                                label=" "
                                data={settings?.accountsSettings}
                                type="number"
                                disabled={
                                  !settings?.accountsSettings
                                    ?.allowMinimumShiftDuration
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "accountsSettings",
                                    "minimumShiftDuration",
                                    data.minimumShiftDuration
                                  )
                                }
                              />
                              &nbsp;Hours
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PPOS */}
            <div>
              <div
                key="inventoryPPOS"
                ref={(el) => (subItemsRef.current["inventoryPPOS"] = el)}
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventoryPPOS"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("ppos")}
                </h1>
                <div key="inventoryPPOS" className="space-y-4">
                  <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      {filterComponent(
                        [t("enable_PPOS_integration")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="enableVanSale"
                            label={t("enable_PPOS_integration")}
                            data={settings?.branchSettings}
                            className="h-9 translate-y-[20px]"
                            checked={settings?.branchSettings?.enableVanSale}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "branchSettings",
                                "enableVanSale",
                                data.enableVanSale
                              )
                            }
                          />
                        )}

                      <div className="flex justify-start space-x-3 align-center">
                        {filterComponent([t("PPOS_branchid")], filterText) && (
                          <>
                            <ERPInput
                              id="clientPPOSBranchID"
                              label={t("PPOS_branchid")}
                              disabled={
                                settings?.branchSettings?.enableVanSale ===
                                false
                              }
                              className="w-2/3"
                              value={
                                settings?.branchSettings?.clientPPOSBranchID
                              }
                              data={settings?.branchSettings}
                              onChangeData={(data) =>
                                handleFieldChange(
                                  "branchSettings",
                                  "clientPPOSBranchID",
                                  data.clientPPOSBranchID
                                )
                              }
                            />
                            <ERPButton
                              title={t("verify")}
                              disabled={
                                settings?.branchSettings?.enableVanSale ===
                                false
                              }
                              variant="secondary"
                              className="h-8 translate-y-[20px]"
                            />
                          </>
                        )}
                      </div>

                      {filterComponent(
                        [t("PPOS_productSerial")],
                        filterText
                      ) && (
                          <ERPInput
                            id="vanSaleProductSerial"
                            label={t("PPOS_productSerial")}
                            disabled={
                              settings?.branchSettings?.enableVanSale === false
                            }
                            className="w-full"
                            value={settings?.branchSettings?.vanSaleProductSerial}
                            data={settings?.branchSettings}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "branchSettings",
                                "vanSaleProductSerial",
                                data.vanSaleProductSerial
                              )
                            }
                          />
                        )}

                      {filterComponent([t("PPOS_email")], filterText) && (
                        <ERPInput
                          id="pPOSEmail"
                          label={t("PPOS_email")}
                          disabled={
                            settings?.branchSettings?.enableVanSale === false
                          }
                          className="w-full"
                          value={settings?.branchSettings?.pPOSEmail}
                          data={settings?.branchSettings}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "branchSettings",
                              "pPOSEmail",
                              data.pPOSEmail
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*Schemes & Promotions*/}
            <div>
              <div
                key="inventorySchemesPromotions"
                ref={(el) =>
                  (subItemsRef.current["inventorySchemesPromotions"] = el)
                }
              >
                <h1
                  className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "inventorySchemesPromotions"
                      ? "blink-animation bg-[#f1f1f1]"
                      : "bg-[#f1f1f1]"
                    }`}
                >
                  {t("schemes_&_promotions")}
                </h1>
                <div key="inventorySchemesPromotions" className="space-y-4">
                  <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                    <div
                      className={`grid ${isCompactView
                          ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                          : `${gridClass ||
                          "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                          } gap-4 items-center justify-center`
                        }`}
                    >
                      <div className="flex items-center gap-6">
                        {filterComponent(
                          [t("gift_on_billing")],
                          filterText
                        ) && (
                            <>
                              <ERPCheckbox
                                id="giftOnBilling"
                                data={settings?.productsSettings}
                                label={t("gift_on_billing")}
                                checked={
                                  settings?.productsSettings?.giftOnBilling
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "giftOnBilling",
                                    data.giftOnBilling
                                  )
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
                                  handleFieldChange(
                                    "productsSettings",
                                    "giftOnBillingAs",
                                    data.giftOnBillingAs
                                  );
                                }}
                                options={[
                                  { value: 0, label: "CashCoupons" },
                                  { value: 1, label: "Products" },
                                  { value: 2, label: "Special Price" },
                                ]}
                                disabled={
                                  !settings?.productsSettings?.giftOnBilling
                                }
                                label=" "
                              />
                            </>
                          )}
                      </div>

                      {filterComponent([t("maintain_schemes")], filterText) && (
                        <ERPCheckbox
                          id="maintainSchemes"
                          label={t("maintain_schemes")}
                          data={settings?.productsSettings}
                          checked={settings?.productsSettings?.maintainSchemes}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "productsSettings",
                              "maintainSchemes",
                              data.maintainSchemes
                            )
                          }
                        />
                      )}

                      {filterComponent(
                        [t("exclude_scheme_product")],
                        filterText
                      ) && (
                          <ERPCheckbox
                            id="excludeSchemeProductAmountFromPrivilegeCard"
                            label={t("exclude_scheme_product")}
                            data={settings?.productsSettings}
                            checked={
                              settings?.productsSettings
                                ?.excludeSchemeProductAmountFromPrivilegeCard
                            }
                            onChangeData={(data) =>
                              handleFieldChange(
                                "productsSettings",
                                "excludeSchemeProductAmountFromPrivilegeCard",
                                data.excludeSchemeProductAmountFromPrivilegeCard
                              )
                            }
                          />
                        )}

                      {userSession.countryId == Countries.India && (
                        <>
                          {filterComponent(
                            [t("enable_qty_slab_offer")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="enableQtySlabOffer"
                                label={t("enable_qty_slab_offer")}
                                data={settings?.productsSettings}
                                checked={
                                  settings?.productsSettings?.enableQtySlabOffer
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "enableQtySlabOffer",
                                    data.enableQtySlabOffer
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("set_product_qty_limit_in_sales")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="setProductQtyLimitinSales"
                                label={t("set_product_qty_limit_in_sales")}
                                data={settings?.productsSettings}
                                checked={
                                  settings?.productsSettings
                                    ?.setProductQtyLimitinSales
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "setProductQtyLimitinSales",
                                    data.setProductQtyLimitinSales
                                  )
                                }
                              />
                            )}

                          {filterComponent(
                            [t("enable_multi_FOC")],
                            filterText
                          ) && (
                              <ERPCheckbox
                                id="enableMultiFOC"
                                label={t("enable_multi_FOC")}
                                data={settings?.productsSettings}
                                checked={
                                  settings?.productsSettings?.enableMultiFOC
                                }
                                onChangeData={(data) =>
                                  handleFieldChange(
                                    "productsSettings",
                                    "enableMultiFOC",
                                    data.enableMultiFOC
                                  )
                                }
                              />
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div>
            <section
              key="miscellaneous"
              ref={(el) => (sectionsRef.current["miscellaneous"] = el)}
              className="mb-8 last:mb-0 h-screen"
            >
              <h1
                className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2
                       ${blinkSection === "miscellaneous"
                    ? "blink-animation bg-[#f1f1f1]"
                    : "bg-[#f1f1f1]"
                  }`}
              >
                {t("miscellaneous")}
              </h1>
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                      ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                      : `${gridClass ||
                      "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                      } gap-4 items-center justify-center`
                    }`}
                >
                  <div>
                    {filterComponent([t("send_sms")], filterText) && (
                      <>
                        <ERPCheckbox
                          id="sendSMS"
                          checked={settings?.miscellaneousSettings?.sendSMS}
                          data={settings?.miscellaneousSettings}
                          label={t("send_sms_URL")}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "miscellaneousSettings",
                              "sendSMS",
                              data.sendSMS
                            )
                          }
                        />
                        <ERPInput
                          id="sMSURL"
                          value={settings?.miscellaneousSettings?.sMSURL}
                          data={settings?.miscellaneousSettings}
                          label=" "
                          disabled={!settings?.miscellaneousSettings?.sendSMS}
                          onChangeData={(data) =>
                            handleFieldChange(
                              "miscellaneousSettings",
                              "sMSURL",
                              data.sMSURL
                            )
                          }
                        />
                      </>
                    )}
                  </div>

                  {filterComponent([t("supervisor_password")], filterText) && (
                    <ERPInput
                      id="supervisorPassword"
                      value={settings?.accountsSettings?.supervisorPassword}
                      data={settings?.accountsSettings}
                      label={t("supervisor_password")}
                      onChangeData={(data) =>
                        handleFieldChange(
                          "accountsSettings",
                          "supervisorPassword",
                          data.supervisorPassword
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          type="button"
          loading={isSaving}
          disabled={isSaving}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
