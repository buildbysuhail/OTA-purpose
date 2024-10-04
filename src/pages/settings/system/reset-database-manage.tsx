import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleResetDataBasePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";

export interface ResetDB {
  from: string;
  to: string;
  password: string;
}

export const initialResetDbData = {
  data: {
    from: "",
    to: "",
    password: "",
  },
  validations: {
    from: "",
    to: "",
    password: "",
  },
};

const ResetDbManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,

  } = useFormManager<ResetDB>({
    url: Urls.reset_data_base,
    onSuccess: useCallback(
      () => dispatch(toggleResetDataBasePopup({ isOpen: false, key: null })),
      [dispatch]
    ),
    method: ActionType.POST,
  });

  const onClose = useCallback(() => {
    dispatch(toggleResetDataBasePopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-start items-center gap-5 ">
          <ERPDateInput
            {...getFieldProps("from")}
            type="date"
            id="from"
            label="from"
            onChangeData={(data: any) => handleFieldChange("from", data)}
          />
          <ERPDateInput
            {...getFieldProps("to")}
            type="date"
            id="to"
            label="to"
            onChangeData={(data: any) => handleFieldChange("to", data)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label="password"
            placeholder="password"
            required={true}
            onChangeData={(data: any) =>
              handleFieldChange("password", data)
            }
          />
        </div>

        <div className="flex justify-start items-center gap-5 ">
          <ERPDateInput
            {...getFieldProps("from")}
            type="date"
            id="from"
            label="from"
            onChangeData={(data: any) => handleFieldChange("from", data)}
          />
          <ERPDateInput
            {...getFieldProps("to")}
            type="date"
            id="to"
            label="to"
            onChangeData={(data: any) => handleFieldChange("to", data)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label="password"
            placeholder="password"
            required={true}
            onChangeData={(data: any) =>
              handleFieldChange("password", data)
            }
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

export default ResetDbManage;
