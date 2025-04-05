import React, { useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";

interface ButtonData {
  id: number
  text: string
  productShortName: string
}

interface FormData {
  branchId: string
  keypadGroup: string
  displayOrder: string
  autoBarcode: boolean
  productShortName: string
  barcode: string
  name: string
  foreignLanguage: string
  price: string
}

const POSFastMovingItems: React.FC = () => {
  const [buttons, setButtons] = useState<ButtonData[]>(
    Array(12)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        text: index === 0 ? "TEST" : index === 5 ? "GILLETTE FOAM SENSITIVE" : "",
        productShortName: "",
      }))
  );

  // State for the form on the right
  const [formData, setFormData] = useState<FormData>({
    branchId: "",
    keypadGroup: "1",
    displayOrder: "",
    autoBarcode: false,
    productShortName: "",
    barcode: "",
    name: "",
    foreignLanguage: "",
    price: "",
  });

  // Currently selected button
  const [selectedButton, setSelectedButton] = useState<number | null>(3);

  // Handle button click
  const handleButtonClick = (buttonId: number) => {
    setSelectedButton(buttonId);
    // Find the button data
    const button = buttons.find((b) => b.id === buttonId);
    if (button) {
      // Update form with button data
      setFormData({
        ...formData,
        productShortName: button.productShortName,
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Handle Show button click
  const handleShow = () => {
    // Implement show functionality
    console.log("Show button clicked", formData);
  };

  // Handle Reset button click
  const handleReset = () => {
    setFormData({
      ...formData,
      barcode: "",
      name: "",
      foreignLanguage: "",
      price: "",
      productShortName: "",
    });
  };

  // Handle Set button click
  const handleSet = () => {
    if (selectedButton !== null) {
      // Update the selected button with form data
      const updatedButtons = buttons.map((button) => {
        if (button.id === selectedButton) {
          return {
            ...button,
            text: formData.name,
            productShortName: formData.productShortName,
          };
        }
        return button;
      });

      setButtons(updatedButtons);

      // Prepare data for API call
      const apiData = {
        "@BranchID": formData.branchId,
        "@KeypadGroup": formData.keypadGroup,
        "@DisplayOrder": formData.displayOrder,
        "@AutoBarcode": formData.autoBarcode,
        "@ProductShortName": formData.productShortName,
      };

      console.log("Data to send:", apiData);
    }
  };
  const { t } = useTranslation('inventory');
  return (
    <div>
      {/* Content Area */}
      <div className="flex p-5 bg-gray-100 rounded-md">
        {/* Left side - 12 buttons in 3x4 grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 w-[350px]">
          {buttons.map((button) => (
            <ERPButton
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              title={button.text}
            />
          ))}
        </div>

        {/* Right side - Form */}
        <div className="flex flex-col gap-2 rounded-md p-4">
          <div className="flex items-end gap-2">
            <ERPDataCombobox
              label={t("group")}
              id="keypadGroup"
              className="min-w-[250px]"
              value={formData.keypadGroup}
              onChange={handleInputChange}
              options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" }]}
            />
            <span className="font-medium text-[14px] text-[#333]">
              {t("button:")} {selectedButton}
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
              id={""}
            />
            <ERPButton
              onClick={handleShow}
              title={t("show")}
              variant="secondary"
            />
          </div>

          <ERPCheckbox
            name="autoBarcode"
            label={t("auto_barcode")}
            checked={formData.autoBarcode}
            onChange={handleInputChange}
            id={""}
          />
          <ERPInput
            type="text"
            name="name"
            className="max-w-[250px]"
            value={formData.name}
            onChange={handleInputChange}
            label={t("name")}
            id={""}
          />

          <ERPInput
            type="text"
            name="foreignLanguage"
            className="max-w-[250px]"
            value={formData.foreignLanguage}
            onChange={handleInputChange}
            label={t("foreign_language")}
            id={""}
          />

          <div className="flex items-end gap-2">
            <ERPInput
              type="text"
              name="price"
              className="min-w-[250px]"
              value={formData.price}
              onChange={handleInputChange}
              label={t("price")}
              id={""}
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
            <ERPButton
              title={t("set")}
              onClick={handleSet}
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSFastMovingItems;
