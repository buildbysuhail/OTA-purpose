import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleImportExportPopup,} from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";

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
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<ImportExportForm>({
      url: Urls.deleteInactiveTransactions,
      onSuccess: useCallback(
        () =>
          dispatch(
            toggleImportExportPopup({ isOpen: false, key: null })
          ),
        [dispatch]
      ),
      method: ActionType.POST,
    });

  const onClose = useCallback(() => {
    dispatch(
      toggleImportExportPopup({ isOpen: false, key: null })
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filePath = e.target.files[0].name;
      setPostData((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          filePath,
        },
      }));
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
