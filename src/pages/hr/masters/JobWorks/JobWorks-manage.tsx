import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { initialJobWorks, JobWorks } from "./JobWorks-types";
import { toggleJobWorks } from "../../../../redux/slices/popup-reducer";

export const JobWorksManage: React.FC = React.memo(() => {
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
    } = useFormManager<JobWorks>({
        url: Urls.job_works,
        onSuccess: useCallback(() => dispatch(toggleJobWorks({ isOpen: false, key: null, reload: true })), [dispatch]),
        onClose: useCallback(() => dispatch(toggleJobWorks({ isOpen: false, key: null, reload: false })), [dispatch]),
        key: rootState.PopupData.JobWorks.key,
        useApiClient: true,
        initialData: initialJobWorks,
    });
    const { t } = useTranslation("hr");
    return (
        <div className="w-full modal-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-3 gap-3">

                <ERPInput
                    {...getFieldProps("jobCode")}
                    label={t("job_code")}
                    placeholder={t("job_code")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("jobCode", data.jobCode)}
                    readOnly={rootState.PopupData.JobWorks.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("jobName")}
                    label={t("job_name")}
                    placeholder={t("job_name")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("jobName", data.jobName)}
                    readOnly={rootState.PopupData.JobWorks.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("unitRate")}
                    label={t("unit_rate")}
                    placeholder={t("unit_rate")}
                    required={true}
                    onChangeData={(data: any) => handleFieldChange("unitRate", data.unitRate)}
                    readOnly={rootState.PopupData.JobWorks.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />
                <ERPInput
                    {...getFieldProps("remarks")}
                    label={t("remarks")}
                    placeholder={t("remarks")}
                    onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
                    readOnly={rootState.PopupData.JobWorks.mode == "view"}
                    fetching={formState?.loading !== false ? true : false}
                />

            </div>
            <ERPFormButtons
                    onClear={rootState.PopupData.JobWorks.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleClear}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    onCancel={handleClose}
                    onSubmit={rootState.PopupData.JobWorks.mode == "view" ? undefined : formState?.loading !== false ? undefined : handleSubmit}
                  />
                </div>
    );
});
