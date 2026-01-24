import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { toggleEmpDesignations, toggleLeavetype } from "../../../../redux/slices/popup-reducer";
import { initialLeaveType, LeaveType } from "./Leavetype-types";

export const LeavetypeManage: React.FC = React.memo(() => {
    const rootState = useRootState();
    const dispatch = useDispatch();
    const {
        isEdit,
        handleClear,
        handleSubmit,
        handleFieldChange,
        getFieldProps,
        formState,
        isLoading,
        handleClose
    } = useFormManager<LeaveType>({
        url: Urls.leave_type,
        onSuccess: useCallback(() => dispatch(toggleLeavetype({ isOpen: false, key: null, reload: true })), [dispatch]),
        onClose: useCallback(() => dispatch(toggleLeavetype({ isOpen: false, key: null, reload: false })), [dispatch]),
        key: rootState.PopupData.Leavetype.key,
        useApiClient: true,
        initialData: initialLeaveType,
    });
    const { t } = useTranslation("hr");
    return (
        <div className="w-full modal-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-3">

                <ERPInput
                    {...getFieldProps("leaveTypeName")}
                    label={t("leave_type_name")}
                    placeholder={t("leave_type_name")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("leaveTypeName", data.leaveTypeName)}
                    readOnly={rootState.PopupData.Leavetype.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("leaveDescription")}
                    label={t("leave_description")}
                    placeholder={t("leave_description")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("leaveDescription", data.leaveDescription)}
                    readOnly={rootState.PopupData.Leavetype.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPCheckbox
                    {...getFieldProps("affectOnBasic")}
                    label={t("affect_on_basic")}
                    onChangeData={(data: any) => handleFieldChange("affectOnBasic", data.affectOnBasic)}
                    disabled={rootState.PopupData.Leavetype.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />

            </div>
            <ERPFormButtons
                    onClear={rootState.PopupData.Leavetype.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleClear}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    onCancel={handleClose}
                    onSubmit={rootState.PopupData.Leavetype.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleSubmit}
                  />
                </div>
    );
});
