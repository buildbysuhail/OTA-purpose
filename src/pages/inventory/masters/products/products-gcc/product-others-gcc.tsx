import React, { useEffect, useState } from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { customJsonParse, modelToBase64Unicode } from "../../../../../utilities/jsonConverter";
import { FormField } from "../../../../../utilities/form-types";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ChangeBarcode from "../common/change-barcode";
import POSFastMovingItems from "../common/fast-mooving";

const api = new APIClient();
const ProductOthersGcc: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleDataChange: (value: any) => void;
  isView: boolean;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField | any;
}> = React.memo(
  ({
    formState,
    handleFieldChange,
    getFieldProps,
    appSettings,
    handleDataChange,
    isView
  }) => {
    const handleFieldChangeAndResetSettings = async (
      fieldId: string,
      value: any
    ) => {
      const prev = getFieldProps("*");
      const pay = modelToBase64Unicode({ ...prev.config, [fieldId]: value })
      const res = await api.postAsync(Urls.update_product_config, pay);
      const _data = { ...prev }
      _data.config = pay
      handleDataChange(_data);
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const prev = getFieldProps("*");
          const base64 = await api.getAsync(Urls.get_product_config);
          const _userConfig = atob(base64);
          const userConfig: any = customJsonParse(_userConfig);
          const _data = {
            ...prev,
          };
          _data.config = userConfig;
          handleDataChange(_data);
        } catch (error) {
          console.error("Failed to fetch product config", error);
        }
      };
      fetchData();
    }, []);

    const { t } = useTranslation("inventory");
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const openPopup = (popupType: string) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border border-[#ccc] rounded-md p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <ERPButton
            title={t("pos_fast_moving_items")}
            variant="secondary"
            onClick={() => openPopup("fastMoving")}
            disabled={isView}
            className="w-full sm:w-auto min-w-[180px]"
          />
          <ERPButton
            title={t("change_autobarcode")}
            variant="secondary"
            disabled={isView}
            onClick={() => openPopup("autoBarcode")}
            className="w-full sm:w-auto min-w-[180px]"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.showProductDuplicateWarning")}
            label={t("show_product_duplicate_warning_message")}
            onChange={(data) => handleFieldChangeAndResetSettings("showProductDuplicateWarning", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.showProductDetailesAfterSave")}
            label={t("show_product_details_after_save")}
            onChange={(data) => handleFieldChangeAndResetSettings("showProductDetailesAfterSave", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.blockConvertProductNameToUpperCase")}
            label={t("block_convert_product_name_to_upper_case")}
            onChange={(data) => handleFieldChangeAndResetSettings("blockConvertProductNameToUpperCase", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.calculateMarkUpValue")}
            label={t("calculate_markup_value")}
            onChange={(data) => handleFieldChangeAndResetSettings("calculateMarkUpValue", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.showDisplayCost")}
            label={t("show_display_cost")}
            onChange={(data) => handleFieldChangeAndResetSettings("showDisplayCost", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.showMultiBarcodeOnSave")}
            label={t("show_multibacode_onsave")}
            onChange={(data) => handleFieldChangeAndResetSettings("showMultiBarcodeOnSave", data.target.checked)}
          />
          <ERPCheckbox
            disabled={isView}
            {...getFieldProps("config.showFlavourOnSave")}
            label={t("show_flavour_onsave")}
            onChange={(data) => handleFieldChangeAndResetSettings("showFlavourOnSave", data.target.checked)}
          />
        </div>
        {activePopup === "fastMoving" && (
          <ERPModal
            isOpen={true}
            closeModal={(reload: boolean) => closePopup()}
            title={t("pos_fast_moving_items")}
            content={<POSFastMovingItems />}
            width={780}
            height={570}
            disableOutsideClickClose={false}
          />
        )}

        {activePopup === "autoBarcode" && (
          <ERPModal
            isOpen={true}
            closeModal={(reload: boolean) => closePopup()}
            title={t("change_autobarcode")}
            content={<ChangeBarcode />}
            width={400}
            height={300}
            disableOutsideClickClose={false}
          />
        )}
      </div>
    );
  });

export default ProductOthersGcc;