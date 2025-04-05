import React, { useState } from "react";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../../helpers/api-client";
import { useTranslation } from "react-i18next";

const api = new APIClient();

interface FormData {
  currentBarcode: string;
  newBarcode: string;
}

const ChangeBarcode: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    currentBarcode: "",
    newBarcode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    const apiData = {
      "@CurrentBarcode": formData.currentBarcode,
      "@NewBarcode": formData.newBarcode,
    };

    console.log("Data to send to API:", apiData);
    // try {
    //   const response = await api.post(Urls.change_barcode, apiData);
    //   if (response && response.data) {
    //     console.log("Success:", response.data);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };
  const { t } = useTranslation('inventory')
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 rounded-md p-4">
          <ERPInput
            label={t("barcode_(to_be_replaced)")}
            className="w-full"
            type="text"
            name="currentBarcode"
            value={formData.currentBarcode}
            onChange={handleInputChange}
            id="currentBarcode"
          />

          <ERPInput
            label={t("new_barcode")}
            className="w-full"
            type="text"
            name="newBarcode"
            value={formData.newBarcode}
            onChange={handleInputChange}
            id="newBarcode"
          />

          <div className="flex justify-end mt-4">
            <ERPButton
              title={t("update")}
              onClick={handleUpdate}
              className="w-full md:w-auto"
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeBarcode;