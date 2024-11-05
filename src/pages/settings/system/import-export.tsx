import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleImportExportPopup, } from "../../../redux/slices/popup-reducer";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPButton from "../../../components/ERPComponents/erp-button";

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
    privilegeCard: false,
  },
  validations: {
    filePath: "",
    product: "",
    parties: "",
    privilegeCard: "",
  },
};
const api = new APIClient();
const ImportExportManage: React.FC = React.memo(() => {
  const initialData = {
    data: {
      file: "",

    },
    validations: {
      filePath: "",
    },
  };
  const [loading, setLoading] = useState(false);
  const [formFile, setFormFile] = useState<FormData>();
  const [importExport, setImportExport] = useState<any>(initialImportExportData);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    setLoading(true);
    const res = await api.post(Urls.import_privilegeCards_Excel, formFile, {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    });
    setLoading(false);
    handleResponse(res, () => { }, () => { })
  };
  const onClose = useCallback(async () => {
    dispatch(toggleImportExportPopup({ isOpen: false }));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
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
            label={t("product")}
            id="product"
            data={importExport.data}
            checked={importExport.data.product}
            validation={importExport?.validations?.product}
            onChangeData={(data: any) => {
              setImportExport((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  product: !prev.data?.product,
                },
              }));
            }}
            disabled={true}
          />

          <ERPCheckbox
            label={t("parties")}
            id="parties"
            data={importExport.data}
            checked={importExport.data.parties}
            validation={importExport?.validations?.parties}
            onChangeData={(data: any) => {
              setImportExport((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  parties: !prev.data.parties
                },
              }));
            }}
          />

          <ERPCheckbox
            label={t("privilege_card")}
            id="privilegeCard"
            data={importExport.data}
            checked={importExport.data.privilegeCard}
            validation={importExport?.validations?.privilegeCard}
            onChangeData={(data: any) => {
              setImportExport((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  privilegeCard: !prev.data.privilegeCard,
                },
              }));
            }}
          />
        </div>
      </div>
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title={t("cancel")}
          variant="secondary"
          onClick={onClose}
        // disabled={emailLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={loading}
          variant="primary"
          onClick={onSubmit}
          loading={loading}
          title={t("import")}
        ></ERPButton>
      </div>
    </div>
  );
});

export default ImportExportManage;
