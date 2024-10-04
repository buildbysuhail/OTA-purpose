import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { BankPoseData } from "../Administration/administration-types";

const Barcodeprint: React.FC = React.memo(() => {
  const rootState = useRootState();
  const{t} = useTranslation();
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<BankPoseData>({
      url: Urls.BankPosSettings,
      onSuccess: useCallback(
        () => dispatch(toggleBankPosPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.reminder.key,
    });

  const onClose = useCallback(() => {
    dispatch(toggleBankPosPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <ERPDataCombobox
          {...getFieldProps("barcodeform")}
          id="barcodeform"
          field={{
            id: "barcodeform",
            required: true,
            getListUrl: Urls.data_languages,
            valueKey: "id",
            labelKey: "name",
          }}
          label="barcodeform"
          onChangeData={(data: any) => handleFieldChange("machineBrand", data)}
        />

        <ERPDataCombobox
          {...getFieldProps("barcodecommaseperated")}
          id="barcodecommaseperated"
          field={{
            id: "barcodecommaseperated",
            required: true,
            getListUrl: Urls.data_languages,
            valueKey: "id",
            labelKey: "name",
          }}
          label="barcodecommaseperated"
          onChangeData={(data: any) => handleFieldChange("model", data)}
        />

        <ERPDataCombobox
          {...getFieldProps("to")}
          id="to"
          field={{
            id: "to",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "id",
            labelKey: "name",
          }}
          label="to"
          onChangeData={(data: any) => handleFieldChange("comPort", data)}
        />

        {/* <ERPInput
          {...getFieldProps("geldeaWsPort")}
          label={t("geldea_ws_port")}
          placeholder={t("geldea_ws_port")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("geldeaWsPort", data)}
        /> */}

        {/* <ERPInput
          {...getFieldProps("gediaService")}
          label={t("gedia_service")}
          placeholder={t("gedia_service")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("gediaService", data)}
        /> */}
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
export default Barcodeprint;
