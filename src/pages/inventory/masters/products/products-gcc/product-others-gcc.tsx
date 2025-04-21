import React, { useEffect } from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import initialProductData from "../products-data";
import { PathValue, productDto, ProductFieldPath } from "../products-type";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../../../utilities/HandleResponse";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { customJsonParse } from "../../../../../utilities/jsonConverter";
import { t } from "i18next";
import { FormField } from "../../../../../utilities/form-types";
import { accFormStateHandleFieldChange } from "../../../../accounts/transactions/reducer";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";

const api = new APIClient();
const ProductOthersGcc: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleDataChange: (value: any) => void;
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
  }) => {
    const handleFieldChangeAndResetSettings = async (
        fieldId: string,
        value: any
      ) => {
        debugger;
        const prev = getFieldProps("*");
        const pay = {...prev.config
            , [fieldId]: value
        }
        const res = await api.postAsync(Urls.update_product_config, pay);
        const _data = {
            ...prev}
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
    return (
        <div className="grid grid-cols-2 gap-4 border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex items-center gap-4">
                <ERPButton
                    title={t("change_autobarcode")}
                    variant="secondary"
                />
                <ERPButton
                    title={t("pos_fast_moving_items")}
                    variant="secondary"
                    className="whitespace-nowrap"
                />
                <ERPButton
                    title={t("price_list_editor")}
                    variant="secondary"
                />
            </div>
            <div className="flex flex-wrap gap-4">
                <ERPCheckbox
                    {...getFieldProps("config.showProductDuplicateWarning")}
                    label={t("show_product_duplicate_warning_message")}
                    onChange={(data) => handleFieldChangeAndResetSettings("showProductDuplicateWarning", data.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showProductDetailesAfterSave")}
                    label={t("show_product_details_after_save")}
                    onChange={(data) => handleFieldChangeAndResetSettings("showProductDetailesAfterSave", data.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.blockConvertProductNameToUpperCase")}
                    label={t("block_convert_product_name_to_upper_case")}
                    onChange={(data) => handleFieldChangeAndResetSettings("blockConvertProductNameToUpperCase", data.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.calculateMarkUpValue")}
                    label={t("calculate_markup_value")}
                    onChange={(data) => handleFieldChangeAndResetSettings("calculateMarkUpValue", data.target.checked)}
                />
                <ERPCheckbox
                    {...getFieldProps("config.showDisplayCost")}
                    label={t("show_display_cost")}
                    onChange={(data) => handleFieldChangeAndResetSettings("showDisplayCost", data.target.checked)}
                />
            </div>
        </div>
    );
});

export default ProductOthersGcc;