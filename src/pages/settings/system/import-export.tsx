import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleImportExportPopup,} from "../../../redux/slices/popup-reducer";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";

interface ImportExportForm {
  filePath: string;
  product: boolean;
  parties: boolean;
}
export const initialImportExportData = {
  data: {
    filePath: "",
    product: false,
    parties: false,
  },
  validations: {
    filePath: "",
    product: "",
    parties: "",
  },
};
const api = new APIClient();
const ImportExportManage: React.FC = React.memo(() => {
  const initialData = {
    data: {
      filePath: "",
    },
    validations: {
      filePath: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [formFile, setFormFile] = useState<FormData>();
  const dispatch = useDispatch();

  const onSubmit = async() => {
    const res = await api.post(Urls.import_parties, {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    handleResponse(res, () => {}, () => {}) 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filePath = event.target.files[0].name;
      let formData = new FormData();

        formData.append('file', event.target.files[0], event.target.files[0].name);
      setFormFile(formData);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700"
          >
            {t("file_path")}
          </label>
          <input
            type="file"
            id="fileInput"
            className="mt-1 w-full border border-gray-300 p-2 rounded-md"
            onChange={handleFileChange}
          />
        </div>
       <div className="flex justify-around">
        <ERPCheckbox
          {...getFieldProps("product")}
          label={t("product")}
          onChangeData={(data: any) => handleFieldChange("product", data)}
        />

        <ERPCheckbox
          {...getFieldProps("parties")}
          label={t("parties")}
          onChangeData={(data: any) => handleFieldChange("parties", data)}
        />
        </div>
      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default ImportExportManage;
