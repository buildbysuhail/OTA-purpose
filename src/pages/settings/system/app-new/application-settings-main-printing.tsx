import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
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

const MainPrintingFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
  const items = [
    {
      condition: filterComponent([t("default_printer")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPrinter"
          data={settings?.printerSettings}
          field={{
            id: "defaultPrinter",
            valueKey: "value",
            labelKey: "label",
          }}
          disabled
          onChangeData={(data: any) =>
            handleFieldChange(
              "printerSettings",
              "defaultPrinter",
              data.defaultPrinter
            )
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
      ),
    },
    {
      condition: userSession.countryId == Countries.India && filterComponent([t("print_gatePass")], filterText),
      element: (
        <ERPCheckbox
          id="printGatePass"
          checked={settings?.printerSettings?.printGatePass}
          data={settings?.printerSettings}
          label={t("print_gatePass")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "printerSettings",
              "printGatePass",
              data.printGatePass
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("printing_style")], filterText),
      element: (
        <ERPDataCombobox
          id="invoicePrintingStyle"
          field={{
            id: "invoicePrintingStyle",
            valueKey: "value",
            labelKey: "label",
          }}
          data={settings?.branchSettings}
          label={t("printing_style")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "invoicePrintingStyle",
              data.invoicePrintingStyle
            )
          }
          options={[
            { value: "Default", label: "Default" },
            { value: "Standard", label: "Standard" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("show_reprint_authorisation")], filterText),
      element: (
        <ERPCheckbox
          id="showReprintAuthorisation"
          checked={settings?.printerSettings?.showReprintAuthorisation}
          data={settings?.printerSettings}
          label={t("show_reprint_authorisation")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "printerSettings",
              "showReprintAuthorisation",
              data.showReprintAuthorisation
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("use_template_selection_for_printing")], filterText),
      element: (
        <ERPCheckbox
          id="useTemplateSelectionForPrinting"
          data={settings?.branchSettings}
          label={t("use_template_selection_for_printing")}
          checked={settings?.branchSettings?.useTemplateSelectionForPrinting}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "useTemplateSelectionForPrinting",
              data.useTemplateSelectionForPrinting
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
          <div key={key} ref={(el) => (subItemsRef.current["mainPrinting"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "mainPrinting"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}  >
              {t("printing")}
            </h1>
            <div key="mainPrinting" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
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
export default MainPrintingFilterableComponents;