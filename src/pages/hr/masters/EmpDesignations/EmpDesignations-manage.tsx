import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { toggleEmpDesignations } from "../../../../redux/slices/popup-reducer";
import { EmpDesignation, initialEmpDesignation } from "./EmpDesignations-types";

export const EmpDesignationsManage: React.FC = React.memo(() => {
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
    } = useFormManager<EmpDesignation>({
        url: Urls.emp_designations,
        onSuccess: useCallback(() => dispatch(toggleEmpDesignations({ isOpen: false, key: null, reload: true })), [dispatch]),
        onClose: useCallback(() => dispatch(toggleEmpDesignations({ isOpen: false, key: null, reload: false })), [dispatch]),
        key: rootState.PopupData.EmpDesignations.key,
        useApiClient: true,
        initialData: initialEmpDesignation,
    });
    const { t } = useTranslation("hr");
    return (
        <div className="w-full modal-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-3">

                <ERPInput
                    {...getFieldProps("designationName")}
                    label={t("designation_Name")}
                    placeholder={t("designation_Name")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("designationName", data.designationName)}
                    readOnly={rootState.PopupData.EmpDesignations.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("shortName")}
                    label={t("short_Name")}
                    placeholder={t("short_Name")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
                    readOnly={rootState.PopupData.EmpDesignations.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("remarks")}
                    label={t("remarks")}
                    placeholder={t("remarks")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
                    readOnly={rootState.PopupData.EmpDesignations.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />

                <ERPCheckbox
                    {...getFieldProps("isEditable")}
                    label={t("is_editable")}
                    onChangeData={(data: any) => handleFieldChange("isEditable", data.isEditable)}
                    disabled={rootState.PopupData.EmpDesignations.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />

                <ERPCheckbox
                    {...getFieldProps("isDeletable")}
                    label={t("is_deletable")}
                    onChangeData={(data: any) => handleFieldChange("isDeletable", data.isDeletable)}
                    disabled={rootState.PopupData.EmpDesignations.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />

            </div>
            <ERPFormButtons
                    onClear={rootState.PopupData.EmpDesignations.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleClear}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    onCancel={handleClose}
                    onSubmit={rootState.PopupData.EmpDesignations.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleSubmit}
                  />
                </div>
    );
});
