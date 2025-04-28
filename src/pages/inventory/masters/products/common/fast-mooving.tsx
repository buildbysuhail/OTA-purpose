import React, { useEffect, useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../../../helpers/api-client";
import Urls from "../../../../../redux/urls";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../../utilities/Utils";
import { handleResponse } from "../../../../../utilities/HandleResponse";

interface ButtonData {
  id: number;
  text: string;
  productShortName: string;
}

export interface FastMovingProductsDto {
  productName: string;
  arabicName: string;
  autoBarcode?: number;
  barcode: string;
  stdSalesPrice: number;
  productBatchID: number;
  displayOrder: number;
  productShortName: string;
  keypadGroup: number;
}
const api = new APIClient();
const POSFastMovingItems: React.FC = () => {
  const defaultItem = {
    keypadGroup: 0,
    displayOrder: 0,
    barcode: "",
    autoBarcode: undefined,
    productShortName: "",
    arabicName: "",
    stdSalesPrice: 0,
    productBatchID: 0,
    productName: "",
  };
  const [buttons, setButtons] = useState<FastMovingProductsDto[]>([]);
  const [formData, setFormData] = useState<FastMovingProductsDto>(defaultItem);
  useEffect(() => {
    const changeBarcode = async () => {
      try {
        const response = await api.getAsync(
          `${Urls.fast_moving_products}ByGroup/${formData?.keypadGroup}`
        );
        const responseData: FastMovingProductsDto[] = response || [];

        const buttonData: FastMovingProductsDto[] = [];
debugger;
        for (let i = 1; i <= 12; i++) {
          if (Array.isArray(responseData)) {
            const match = responseData.find((item) => item.displayOrder === i);
            if (match) {
              buttonData.push(match);
            } else {
              buttonData.push({
                ...defaultItem,
                displayOrder: i,
              });
            }
          } else {
            console.error('Expected array, got:', responseData);
            // You can also decide what to do here. Maybe fallback to default?
            buttonData.push({
              ...defaultItem,
              displayOrder: i,
            });
          }
        }

        setButtons(buttonData);
      } catch (error) {
        console.error("Error changing barcode:", error);
      }
    };

    changeBarcode();
  }, [formData.keypadGroup]);

  // Handle button click
  const handleButtonClick = (buttonId: number) => {
    const button = buttons.find((b) => b.displayOrder === buttonId);
    if (button) {
      if (!isNullOrUndefinedOrEmpty(button.barcode)) {
        handleShow(buttonId);
      } else {
        setFormData({
          ...formData,
          productShortName: button.productShortName,
          displayOrder: buttonId,
        });
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Handle Show button click
  const handleShow = async (displayOrder?: number) => {
    if (
      formData?.barcode == undefined ||
      formData?.barcode == null ||
      formData?.barcode == ""
    ) {
      return;
    }
    try {
      const response = await api.getAsync(
        `${Urls.fast_moving_products}ByBarcode/${formData?.barcode}`
      );
      debugger;
      if (response) {
        setFormData((prev) => ({
          ...response,
          autoBarcode: prev.barcode,
          displayOrder: displayOrder ?? prev.displayOrder,
          keypadGroup: prev.keypadGroup,
        }));
      }
    } catch (error) {
      console.error("Error changing barcode:", error);
    }
  };

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      ...formData,
      autoBarcode: undefined,
      arabicName: "",
      productName: "",
      stdSalesPrice: 0,
      productShortName: "",
    });
  };

  const handleSet = async () => {
    debugger;
    if (
      !isNullOrUndefinedOrZero(formData.displayOrder) &&
      !isNullOrUndefinedOrZero(formData.keypadGroup)
    ) {
      const apiData = {
        keypadGroup: formData.keypadGroup.toString(),
        displayOrder: formData.displayOrder,
        autoBarcode: formData.autoBarcode,
        productShortName: formData.productShortName,
      };
      const response = await api.postAsync(
        `${Urls.fast_moving_products}`,
        apiData
      );
      handleResponse(response, () => {
        const updatedButtons = buttons.map((button) => {
          if (button.displayOrder === formData.displayOrder) {
            return {
              ...button,
              autoBarcode: formData.autoBarcode,
              productShortName: formData.productShortName,
            };
          }
          return button;
        });

        setButtons(updatedButtons);
      });
    }
  };
  const { t } = useTranslation("inventory");
  const options = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
  return (
    <div>
      {/* Content Area */}
      <div className="flex p-5 bg-gray-100 rounded-md">
        {/* Left side - 12 buttons in 3x4 grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 w-[350px] text-white">
          {buttons.map((button) => (
            <ERPButton
            className={`${button.displayOrder === formData.displayOrder
              ? "text-white"
              : "text-black"}`}
              backgroundColor={
                button.displayOrder === formData.displayOrder
                  ? "bg-blue"
                  : undefined
              }
              key={button.displayOrder}
              onClick={() => handleButtonClick(button.displayOrder)}
              title={button.productShortName}
            />
          ))}
        </div>

        {/* Right side - Form */}
        <div className="flex flex-col gap-2 rounded-md p-4">
          <div className="flex items-end gap-2">
            <ERPDataCombobox
              label={t("group")}
              name="keypadGroup"
              id="keypadGroup"
              className="min-w-[250px]"
              value={formData.keypadGroup}
              onChange={(e: any) => {
                debugger;
                handleInputChange({
                  ...e,
                  target: { ...e.target, value: e.value, name: "keypadGroup" },
                });
              }}
              options={options}
            />
            <span className="font-medium text-[14px] text-[#333]">
              {/* {formData.displayOrder} */}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <ERPInput
              label={t("barcode")}
              className="min-w-[250px]"
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              id={"barcode"}
            />
            <ERPButton
              onClick={() => handleShow()}
              title={t("show")}
              variant="secondary"
            />
          </div>

          <ERPInput
            label={t("autoBarcode")}
            className="min-w-[250px]"
            type="text"
            disabled
            name="autoBarcode"
            value={formData.autoBarcode}
            onChange={handleInputChange}
            id={"autoBarcode"}
          />
          <ERPInput
            type="text"
            name="name"
            disabled
            className="max-w-[250px]"
            value={formData.productName}
            onChange={handleInputChange}
            label={t("productName")}
            id={""}
          />

          <ERPInput
            type="text"
            name="arabicName"
            disabled
            className="max-w-[250px]"
            value={formData.arabicName}
            onChange={handleInputChange}
            label={t("foreign_language")}
            id={""}
          />

          <div className="flex items-end gap-2">
            <ERPInput
            disabled
              type="number"
              name="stdSalesPrice"
              className="min-w-[250px]"
              value={formData.stdSalesPrice}
              onChange={handleInputChange}
              label={t("stdSalesPrice")}
              id={"stdSalesPrice"}
            />
            <ERPButton
              title={t("reset")}
              variant="secondary"
              onClick={handleReset}
            />
          </div>

          <div className="flex items-end gap-2">
            <ERPInput
              type="text"
              name="productShortName"
              className="min-w-[250px]"
              value={formData.productShortName}
              onChange={handleInputChange}
              label={t("short_name")}
              id={""}
            />
            <ERPButton title={t("set")} onClick={handleSet} variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSFastMovingItems;
