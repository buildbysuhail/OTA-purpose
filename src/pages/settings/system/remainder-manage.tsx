import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleRemainderPopup, } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { RemainderData } from "./remainder-manage-type";

export const RemainderManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
 
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<RemainderData>({
    url:Urls.Remainder,
    onSuccess: useCallback(() => dispatch(toggleRemainderPopup({ isOpen: false, key: null })), [dispatch]),
    key: rootState.PopupData.reminder.key
  });

  const onClose = useCallback(() => {
    dispatch(toggleRemainderPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("remainderName")}
          label="Remainder Name"
          placeholder="Remainder Name"
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("remainderName", data);
          }}
        />
         <ERPInput
          {...getFieldProps("descriptions")}
          label="Descriptions"
          placeholder="Descriptions"
          required={true}
          onChangeData={(data: any) => handleFieldChange("descriptions", data)}
        />
        <ERPDateInput
          {...getFieldProps("remaindingDate")}
          field={{ type: "date", id: "remaindingDate", required: true }}
          label="Date of Remainds"
          required={true}
          onChangeData={(data: any) => handleFieldChange("remaindingDate", data)}
        />
       
          <ERPInput
          {...getFieldProps("noOfDays")}
          label="NoOf Days"
          placeholder="noOfDays"
          required={true}
          onChangeData={(data: any) => handleFieldChange("noOfDays", data)}
        />
       
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
