import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleImportExportPopup, } from "../../../redux/slices/popup-reducer";
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
  const [postData, setPostData] = useState<any>(initialData);
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    isLoading,
  } = useFormManager<ImportExportForm>({
    url: Urls.import_parties,
    onSuccess: useCallback(() => dispatch(toggleImportExportPopup({ isOpen: false })), [dispatch]),
    method: ActionType.POST,
    useApiClient: true
  });

  const onClose = useCallback(() => {
    dispatch(
      toggleImportExportPopup({ isOpen: false, key: null })
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    if (e.target.files && e.target.files.length > 0) {
      const filePath = e.target.files[0].name;
      setPostData((prevState: { data: any; }) => ({
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
            label={t("product")}
            id="product"
            data={postData.data}
            checked={postData.data.product}
            validation={postData?.validations?.product}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  product: data,
                  parties: !data ? prev.data.parties : false,
                },
              }));
            }}
            disabled={true}
          />

          <ERPCheckbox
            label={t("parties")}
            id="parties"
            data={postData.data}
            checked={postData.data.parties}
            validation={postData?.validations?.parties}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  parties: data,
                  product: !data ? prev.data.product : false,
                },
              }));
            }}
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
