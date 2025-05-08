import React, { useEffect, useState } from "react";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import { FormField } from "../../../../../utilities/form-types";
import POSFastMovingItems from "../common/fast-mooving";
import ChangeBarcode from "../common/change-barcode";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { customJsonParse } from "../../../../../utilities/jsonConverter";

const api = new APIClient();
const ProductOthersIndia: React.FC<{
  formState: any;
  handleDataChange: (value: any) => void;
  handleFieldChange: (
    fields: string | { [fieldId: string]: any },
    value?: any
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField | any;
}> = React.memo(
  ({ formState, handleFieldChange, getFieldProps, handleDataChange }) => {
    const { t } = useTranslation("inventory");
    const handleFieldChangeAndResetSettings = async (
      fieldId: string,
      value: any
    ) => {
      debugger;
      const prev = getFieldProps("*");
      const pay = { ...prev.config, [fieldId]: value };
      const res = await api.postAsync(Urls.update_product_config, pay);
      const _data = {
        ...prev,
      };
      _data.config = pay;

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
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const openPopup = (popupType: string) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);

    return (
      <div className="flex flex-col w-full border border-gray-300 rounded-md p-4">
        <div className="flex flex-wrap gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2 min-w-[250px] md:flex-1">
            <ERPButton
              title={t("pos_fast_moving_items")}
              variant="secondary"
              onClick={() => openPopup("fastMoving")}
              className="flex-grow min-w-[180px] sm:flex-grow-0"
            />
            <ERPButton
              title={t("change_autobarcode")}
              variant="secondary"
              onClick={() => openPopup("autoBarcode")}
              className="flex-grow min-w-[180px] sm:flex-grow-0"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[250px] gap-2">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <ERPCheckbox
                {...getFieldProps("config.blockConvertProductNameToUpperCase")}
                label={t("block_convert_product_name_to_upper_case")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "blockConvertProductNameToUpperCase",
                    e.target.checked
                  )
                }
                className="min-w-[300px] flex-1"
              />
              <ERPCheckbox
                {...getFieldProps("config.calculateMarkUpValue")}
                label={t("calculate_markup_value")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "calculateMarkUpValue",
                    e.target.checked
                  )
                }
                className="min-w-[250px] flex-1"
              />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <ERPCheckbox
                {...getFieldProps("config.showDisplayCost")}
                label={t("show_display_cost")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "showDisplayCost",
                    e.target.checked
                  )
                }
                className="min-w-[250px] flex-1"
              />
              <ERPCheckbox
                {...getFieldProps("config.showProductDuplicateWarning")}
                label={t("show_product_duplicate_warning_message")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "showProductDuplicateWarning",
                    e.target.checked
                  )
                }
                className="min-w-[300px] flex-1"
              />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <ERPCheckbox
                {...getFieldProps("config.showProductDetailesAfterSave")}
                label={t("show_product_details_after_save")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "showProductDetailesAfterSave",
                    e.target.checked
                  )
                }
                className="min-w-[250px] flex-1"
              />
              {/* <ERPCheckbox
                {...getFieldProps("config.showOpeningStock")}
                label={t("show_opening_stock")}
                onChange={(e) =>
                  handleFieldChangeAndResetSettings(
                    "showOpeningStock",
                    e.target.checked
                  )
                }
                className="min-w-[250px] flex-1"
              /> */}
            </div>
          </div>
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
  }
);

export default ProductOthersIndia;
