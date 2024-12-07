"use client";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { settingGroups } from "./application-settings-virtual-data";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import Urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { APIClient } from "../../../../helpers/api-client";
import { useApplicationMainSettings } from "../../../../utilities/hooks/use-application-main-settings";
import { useApplicationGstSettings } from "../../../../utilities/hooks/use-application-gst-settings";
import {
  useApplicationMiscSettings,
} from "../../../../utilities/hooks/use-application-misc-settings";
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
import InventoryGeneralFilterableComponents from "./application-settings-inventory-general";
import AccountsEinvoiceFilterableComponents from "./application-settings-accounts-ksa-einvoice";
import MainMultiBranchFilterableComponents from "./application-settings-main-multi-branch";
import InventoryProductsFilterableComponents from "./application-settings-inventory-products";
import InventoryGSTSettingsFilterableComponents from "./application-settings-inventory-gst";
import InventoryPurchaseFilterableComponents from "./application-settings-inventory-purchase";
import InventorySalesFilterableComponents from "./application-settings-inventory-sales";
import InventorySalesCounterFilterableComponents from "./application-settings-inventory-sales-counter";
import InventoryPPOSFilterableComponents from "./application-settings-inventory-ppos";
import InventorySchemeAndPromotionFilterableComponents from "./application-settings-inventory-scheme-and-promotion";
import ApplicationMiscellaneousComponents from "./application-settings-miscellaneous";
import InventoryTAXFilterableComponents from "./application-settings-inventory-tax";

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
        <span className="mr-2 text-sm">  {" "}
          {isCompactView ? "Compact View" : "Expanded View"}{" "}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isCompactView}
            onChange={handleToggle} />
          <div className={`w-10 h-4 rounded-full shadow-inner transition-colors ${isCompactView ? "bg-blue-500" : "bg-gray-300"}`}  ></div>
          <div className={`dot absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow transition-transform ${isCompactView ? "translate-x-full" : ""}`} ></div>
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
  const { t } = useTranslation("applicationSettings");
  const [isLastSystemGeneratedBarcode, setIsLastSystemGeneratedBarcode] = useState(false);
  const [activeSection, setActiveSection] = useState(settingGroups[0]?.id || 0);
  const [activeSubItem, setActiveSubItem] = useState(
    settingGroups[0]?.settings?.[0]?.key || ""
  );
  const [activeSubCatItem, setActiveSubCatItem] = useState(settingGroups[0]?.settings?.[0]?.subSettings?.[0]?.key || "");
  const { isSaving, handleSubmit, handleFieldChange, filterComponent, filterText, onFilterChange, } = useApplicationSetting();
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const subItemsRef = useRef<Record<string, HTMLElement | null>>({});
  const subItemsCatRef = useRef<Record<string, HTMLElement | null>>({});
  const { verifyOtp, sendOtp, otpSending, otpVerifying } = useApplicationMainSettings();
  const { PopupComponent, showEInvoicePopup, setShowEInvoicePopup, setShowEWBPopup, handleShowComponent, showEWBPopup, } = useApplicationGstSettings();
  const settings = useAppSelector((state: RootState) => state.ApplicationSettings);
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
                (x.key !== "accountsEInvoiceGCC" || userSession.countryId === Countries.Saudi) &&
                (x.key !== "inventoryTaxSettings" || userSession.countryId !== Countries.India) &&
                (x.key !== "inventoryGSTSettings" || userSession.countryId === Countries.India)
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
    businessType: "Select the primary type of business to help customize settings and reports for your specific industry sector.",
    currency: "Choose the primary currency used in your financial transactions and reporting.",
    currencyFormat: "Select how large numbers are displayed - in Millions or Lakhs (hundred thousands).",
    decimalPoints: "Set the number of decimal places to display for monetary and numeric values.",
    country: "Select the primary country for your business to apply region-specific settings and compliance.",
    roundingMethod: "Determine how numerical values are rounded in calculations and financial reports.",
  };

  return (
    <div className="flex overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark">
      <button className="md:hidden fixed top-4 left-4 z-30 bg-gray-100 p-2 rounded-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? (<i className="ri-close-circle-line"></i>) : (<i className="ri-menu-line"></i>)}
      </button>
      <aside className={`fixed z-20 bg-[#fafafa] h-screen w-[250px] md:w-[200px] lg:w-[300px] transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ltr:border-r rtl:border-l `}  >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
            <i className="ri-close-circle-line"></i>
          </button>
        </div>
        <h1 className="font-medium text-xl p-5 mb-5 sm:hidden lg:block">{t("settings")}</h1>
        <div className="flex flex-col overflow-y-auto pb-24 h-full mt-4">
          {settingGroups.map((item) => (
            <div key={item.id}>
              <button
                className={`  relative flex items-center w-full px-3 md:px-4 py-1.5 mt-1 md:mt-2 duration-200 border-r-4 text-left
                  ${item.id === activeSection
                    ? "bg-gray-300 border-primary text-primary"
                    : "border-transparent hover:bg-gray-200 hover:border-gray-400"
                  }`}
                onClick={() => scrollToSection(item.id)}>
                <span className="mx-4 md:mx-2 text-sm">{item.label}</span>
              </button>
              {item.id === activeSection && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.settings
                    ?.filter(
                      (x) =>
                        (x.key !== "accountsEInvoiceGCC" ||
                          userSession.countryId === Countries.Saudi) &&
                        (x.key !== "inventoryTaxSettings" ||
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
                          onClick={() => scrollToSection(item.id, set.key)}>
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
                                }>
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
      <main className="flex-1 md:ml-[200px] lg:ml-[300px] relative transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-track-gray scrollbar-thumb-gray hover:scrollbar-thumb-gray dark:scrollbar-track-gray dark:scrollbar-thumb-gray dark:hover:scrollbar-thumb-gray scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <div className="flex items-center justify-between z-10 fixed bg-white shadow w-[-webkit-fill-available] p-2">
          <button className="md:hidden mr-2 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
          <style>{`@keyframes blink {0%, 100% { background-color: #f1f1f1; }50% { background-color: #e0e0e0; }  }.blink-animation {animation: blink 2s ease-in-out;}`}</style>
          <section key="main" ref={(el) => (sectionsRef.current["main"] = el)} className="mb-8 last:mb-0 pt-12">
            <div className="space-y-6">
              {inputValueVisibility && (
                <div className="mb-4">
                  <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter grid classes (e.g., xl:grid-cols-4 lg:grid-cols-2)" className="border px-2 py-1 mr-2 w-1/3" />
                  <button onClick={handleUpdateGridClass} className="bg-blue text-white px-4 py-1 rounded">
                    {t("apply")}
                  </button>
                  <p className="text-danger mt-2">  For Example : xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2  md:grid-cols-2 sm:grid-cols-1 gap-3</p>
                </div>
              )}
            </div>
            <div>
              {/* Main Settings */}
              {/* General */}
              <MainGeneralFilterableComponents
                key="mainGeneral"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainGeneralFilterableComponents>

              {/* Backup */}
              <MainBackupFilterableComponents
                key="mainBackup"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></MainBackupFilterableComponents>

              {/* Printing */}
              <MainPrintingFilterableComponents
                key="mainPrinting"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </MainPrintingFilterableComponents>


              {/* Multi Branch */}
              <MainMultiBranchFilterableComponents
                key="mainMultiBranch"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </MainMultiBranchFilterableComponents>

              {/* CRM */}
              <MainCRMFilterableComponents
                key="mainCRM"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </MainCRMFilterableComponents>
            </div>
          </section>

          {/* Accounts Settings */}
          <section key="accounts" ref={(el) => (sectionsRef.current["accounts"] = el)} className="mb-8 last:mb-0 pt-12">
            <div className="space-y-6">
            </div>
            <div>
              {/* General */}
              <AccountsGeneralFilterableComponents
                key="accountsGeneral"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </AccountsGeneralFilterableComponents>

              {/* HR */}
              <AccountsHrFilterableComponents
                key="accountsHR"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} ></AccountsHrFilterableComponents>

              {/* KSA E-invoice  */}
              {userSession.countryId === Countries.Saudi && (
                <AccountsEinvoiceFilterableComponents
                  key="accountsEInvoiceGCC"
                  subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                  handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                  blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                  sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
                </AccountsEinvoiceFilterableComponents>
              )}
            </div>
          </section>

          {/* Inventory Settings */}
          <section key="inventory" ref={(el) => (sectionsRef.current["inventory"] = el)} className="mb-8 last:mb-0 pt-12">
            <div className="space-y-6">
            </div>
            <div>
              {/* General */}
              <InventoryGeneralFilterableComponents
                key="inventoryGeneral"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventoryGeneralFilterableComponents>

              {/* products */}
              <InventoryProductsFilterableComponents
                key="inventoryProducts"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventoryProductsFilterableComponents>

              {/* GST settings */}
              {userSession.countryId === Countries.India && (
                <InventoryGSTSettingsFilterableComponents
                  key="inventoryGSTSettings"
                  subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                  handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                  blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                  sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
                </InventoryGSTSettingsFilterableComponents>
              )}
              {/* Tax Settings */}
              {userSession.countryId === Countries.Saudi && (
                <InventoryTAXFilterableComponents
                  key="inventoryTaxSettings"
                  subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                  handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                  blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                  sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
                </InventoryTAXFilterableComponents>
              )}

              {/* purchase */}
              <InventoryPurchaseFilterableComponents
                key="inventoryPurchase"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventoryPurchaseFilterableComponents>

              {/* sales */}
              <InventorySalesFilterableComponents
                key="inventorySales"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventorySalesFilterableComponents>

              {/* POS */}
              <MainSalesPOSFilterableComponents
                key="inventorySalesPOS"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </MainSalesPOSFilterableComponents>

              {/* counter */}
              <InventorySalesCounterFilterableComponents
                key="inventorySalesCounter"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventorySalesCounterFilterableComponents>

              {/* PPOS */}
              <InventoryPPOSFilterableComponents
                key="inventoryPPOS"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventoryPPOSFilterableComponents>

              {/*Schemes & Promotions*/}
              <InventorySchemeAndPromotionFilterableComponents
                key="inventorySchemesPromotions"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </InventorySchemeAndPromotionFilterableComponents>
            </div>
          </section>

          {/*miscellaneous*/}
          <section key="miscellaneous" ref={(el) => (sectionsRef.current["miscellaneous"] = el)}>
            <div className="h-screen">
              <ApplicationMiscellaneousComponents
                key="miscellaneous"
                subItemsRef={subItemsRef} filterComponent={filterComponent} filterText={filterText} gridClass={gridClass}
                handleFieldChange={handleFieldChange} isCompactView={isCompactView} settings={settings} userSession={userSession}
                blinkSection={blinkSection} handleGeneralHeaderClick={handleGeneralHeaderClick}
                sectionsRef={sectionsRef} subItemsCatRef={subItemsCatRef} >
              </ApplicationMiscellaneousComponents>
            </div>
          </section>
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
