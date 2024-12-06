import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
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

const InventorySalesPOSFilterableComponents: React.FC<ApplicationSettingsProps> = ({
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
      condition: filterComponent([t("default_SI_form_type_for_POS")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultFormTypeForPOS"
          field={{
            id: "defaultFormTypeForPOS",
            getListUrl: Urls.data_FormTypeBySI,
            valueKey: "FormType",
            labelKey: "FormType",
          }}
          data={settings?.gSTTaxesSettings}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "defaultFormTypeForPOS",
              data.defaultFormTypeForPOS
            )
          }
          label={t("default_SI_form_type_for_POS")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_SI_prefix_for_POS")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultPrefixForPOS"
          field={{
            id: "defaultPrefixForPOS",
            getListUrl: Urls.data_VPrefixForSI,
            valueKey: "LastVoucherPrefix",
            labelKey: "LastVoucherPrefix",
          }}
          data={settings?.gSTTaxesSettings}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "defaultPrefixForPOS",
              data.defaultPrefixForPOS
            )
          }
          label={t("default_SI_prefix_for_POS")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_SR_form_type_for_POS")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSRFormTypeForPOS"
          data={settings?.gSTTaxesSettings}
          label={t("default_SR_form_type_for_POS")}
          field={{
            id: "defaultSRFormTypeForPOS",
            getListUrl: Urls.data_FormTypeBySR,
            valueKey: "FormType",
            labelKey: "FormType",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "defaultSRFormTypeForPOS",
              data.defaultSRFormTypeForPOS
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("default_SR_prefix_for_POS")], filterText),
      element: (
        <ERPDataCombobox
          id="defaultSRPrefixForPOS"
          data={settings?.gSTTaxesSettings}
          label={t("default_SR_prefix_for_POS")}
          field={{
            id: "defaultSRPrefixForPOS",
            getListUrl: Urls.data_VPrefixForSR,
            valueKey: "LastVoucherPrefix",
            labelKey: "LastVoucherPrefix",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "defaultSRPrefixForPOS",
              data.defaultSRPrefixForPOS
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("second_display_images_path")], filterText),
      element: (
        <ERPInput
          id="secondDisplayImagesPath"
          value={settings?.miscellaneousSettings?.secondDisplayImagesPath}
          data={settings?.miscellaneousSettings}
          label={t("second_display_images_path")}
          type="text"
          placeholder={t("second_display_images_path")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "secondDisplayImagesPath",
              data.secondDisplayImagesPath
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("block_qty_POS")], filterText),
      element: (
        <ERPCheckbox
          id="blockQtyChangeOptionInPOS"
          label={t("block_qty_POS")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.blockQtyChangeOptionInPOS}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "blockQtyChangeOptionInPOS",
              data.blockQtyChangeOptionInPOS
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("list_barcode_items_in_item_lookup")], filterText),
      element: (
        <ERPCheckbox
          id="listBarcodeItemsInItemLookup"
          label={t("list_barcode_items_in_item_lookup")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.listBarcodeItemsInItemLookup}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "listBarcodeItemsInItemLookup",
              data.listBarcodeItemsInItemLookup
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("stop_scanning_(POS)")], filterText),
      element: (
        <ERPCheckbox
          id="stopScanningOnWrongBarcode"
          label={t("stop_scanning_(POS)")}
          data={settings?.productsSettings}
          checked={settings?.productsSettings?.stopScanningOnWrongBarcode}
          onChangeData={(data) =>
            handleFieldChange(
              "productsSettings",
              "stopScanningOnWrongBarcode",
              data.stopScanningOnWrongBarcode
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
            ref={(el) => (subItemsCatRef.current["inventorySalesPOS"] = el)}
          >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventorySalesPOS"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}
            >
              {t("pos")}
            </h1>
            <div key="inventorySalesPOS" className="space-y-4">
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
export default InventorySalesPOSFilterableComponents;