import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";

export interface BankPoseData {
  machineBrand?: string;
  model?: string;
  comPort?: string;
  geldeaWsPort?: string;
  gediaService?: string;
}

const initialBankPosData = {
  data: {
    machineBrand: "",
    model: "",
    comPort: "",
    geldeaWsPort: "",
    gediaService: "",
  },
  validations: {
    machineBrand: "",
    model: "",
    comPort: "",
    geldeaWsPort: "",
    gediaService: "",
  },
};

const BankPosSettingsManage: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<BankPoseData>({
    url: Urls.BankPosSettings,
    onClose:useCallback(() => dispatch(toggleBankPosPopup({ isOpen: false, key: null,})), [dispatch]),
    onSuccess: useCallback(
      () => dispatch(toggleBankPosPopup({ isOpen: false })),
      [dispatch]
    ),
    method: ActionType.POST,
    useApiClient: true,
    loadDataRequired: false,
    initialData: initialBankPosData
  });

;

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("machineBrand")}
          id="machineBrand"
          field={{
            id: "machineBrand",
            required: true,
            getListUrl: Urls.data_languages,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("machine_brand")}
          onChangeData={(data: any) =>
            handleFieldChange("machineBrand", data.machineBrand)
          }
        />

        <ERPDataCombobox
          {...getFieldProps("model")}
          id="model"
          field={{
            id: "model",
            required: true,
            getListUrl: Urls.data_languages,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("model")}
          onChangeData={(data: any) => handleFieldChange("model", data.model)}
        />

        <ERPDataCombobox
          {...getFieldProps("comPort")}
          id="comPort"
          field={{
            id: "comPort",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("com_port")}
          onChangeData={(data: any) =>
            handleFieldChange("comPort", data.comPort)
          }
        />

        <ERPInput
          {...getFieldProps("geldeaWsPort")}
          label={t("geldea_ws_port")}
          placeholder={t("geldea_ws_port")}
          onChangeData={(data: any) =>
            handleFieldChange("geldeaWsPort", data.geldeaWsPort)
          }
        />
        <ERPInput
          {...getFieldProps("gediaService")}
          label={t("gedia_service")}
          placeholder={t("gedia_service")}
          onChangeData={(data: any) =>
            handleFieldChange("gediaService", data.gediaService)
          }
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
export default BankPosSettingsManage;
