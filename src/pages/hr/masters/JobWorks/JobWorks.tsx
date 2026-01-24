import React, { Fragment, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleJobWorks } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { JobWorksManage } from "./JobWorks-manage";
const JobWorks = () => {
    const MemoizedJobWorks = useMemo(() => React.memo(JobWorksManage), []);
    const dispatch = useAppDispatch();
    const { t } = useTranslation("hr");
    const rootState = useRootState();
    const _rootState = useAppSelector((state: RootState) => state.PopupData);
    const columns: DevGridColumn[] = [
                {
                    dataField: "jobCode",
                    caption: t("job_code"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 50,
                    visible: false,
                },
                {
                    dataField: "jobName",
                    caption: t("job_name"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    showInPdf: true,
                },
                {
                    dataField: "unitRate",
                    caption: t("unit_rate"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 150,
                },
                {
                    dataField: "remarks",
                    caption: t("remarks"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
                    showInPdf: true,
                },
                {
                    dataField: "jobID",
                    caption: t("job_id"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 150,
                },

                {
                    dataField: "actions",
                    caption: t("actions"),
                    isLocked: true,
                    allowSearch: false,
                    allowFiltering: false,
                    fixed: true,
                    fixedPosition: document?.dir === "rtl" ? "left" : "right",
                    width: 100,
                    cellRender: (cellElement: any, cellInfo: any) => (
                        <ERPGridActions
                            view={{ type: "popup", action: () => toggleJobWorks({ isOpen: true, key: cellElement?.data?.leaveTypeID, reload: false, mode: "view" }), }}
                            edit={{ type: "popup", action: () => toggleJobWorks({ isOpen: true, key: cellElement?.data?.leaveTypeID, reload: false, mode: "edit" }), }}
                            delete={{
                                onSuccess: () => { dispatch(toggleJobWorks({ isOpen: false, key: null, reload: true, })); },
                                confirmationRequired: true,
                                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                                url: Urls?.job_works,
                                key: cellElement?.data?.jobID,
                            }}
                        />
                    ),
                },
            ];
    useEffect(() => { dispatch(toggleJobWorks({ ...rootState, reload: true })); }, []);
    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                columns={columns}
                                gridHeader={t("Job_Works")}
                                dataUrl={Urls.job_works}
                                gridId="grd_job_works"
                                popupAction={toggleJobWorks}

                                gridAddButtonType="popup"
                                changeReload={(reload: any) => { dispatch(toggleJobWorks({ ...rootState, reload: reload })) }}
                                reload={rootState?.PopupData?.JobWorks?.reload}
                                gridAddButtonIcon="ri-add-line"
                                pageSize={40}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ERPModal
                isOpen={rootState.PopupData.JobWorks.isOpen || false}
                title={t("Job_Works")}
                width={600}
                height={250}
                isForm={true}
                closeModal={() => { dispatch(toggleJobWorks({ isOpen: false, key: null, reload: false })); }}
                content={<MemoizedJobWorks />}
            />
        </Fragment>
    );
};

export default React.memo(JobWorks);
