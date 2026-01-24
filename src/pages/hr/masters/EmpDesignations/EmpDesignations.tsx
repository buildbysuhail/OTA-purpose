import React, { Fragment, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleEmpDesignations, togglePartyCategoryPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { EmpDesignationsManage } from "./EmpDesignations-manage";
const EmpDesignations = () => {
    const MemoizedEmpDesignations = useMemo(() => React.memo(EmpDesignationsManage), []);
    const dispatch = useAppDispatch();
    const { t } = useTranslation("hr");
    const rootState = useRootState();
    const _rootState = useAppSelector((state: RootState) => state.PopupData);
    const columns: DevGridColumn[] = [
                {
                    dataField: "designationID",
                    caption: t("designation_ID"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 50,
                    visible: false,
                },
                {
                    dataField: "designationName",
                    caption: t("designation_Name"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    showInPdf: true,
                },
                {
                    dataField: "shortName",
                    caption: t("short_name"),
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
                    dataField: "isEditable",
                    caption: t("is_editable"),
                    dataType: "boolean",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
                    showInPdf: true,
                },
                {
                    dataField: "isDeletable",
                    caption: t("is_deletable"),
                    dataType: "boolean",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
                    showInPdf: true,
                },


                {
                    dataField: "createdUser",
                    caption: t("created_user"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 150,
                },
                {
                    dataField: "createdDate",
                    caption: t("created_date"),
                    dataType: "date",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
                },
                {
                    dataField: "modifiedUser",
                    caption: t("modified_user"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 150,
                },
                {
                    dataField: "modifiedDate",
                    caption: t("modified_date"),
                    dataType: "date",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
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
                            view={{ type: "popup", action: () => toggleEmpDesignations({ isOpen: true, key: cellElement?.data?.designationID, reload: false, mode: "view" }), }}
                            edit={{ type: "popup", action: () => toggleEmpDesignations({ isOpen: true, key: cellElement?.data?.designationID, reload: false, mode: "edit" }), }}
                            delete={{
                                onSuccess: () => { dispatch(toggleEmpDesignations({ isOpen: false, key: null, reload: true, })); },
                                confirmationRequired: true,
                                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                                url: Urls?.emp_designations,
                                key: cellElement?.data?.designationID,
                            }}
                        />
                    ),
                },
            ];
    useEffect(() => { dispatch(toggleEmpDesignations({reload: true })); }, []);
    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                columns={columns}
                                gridHeader={t("Emp_designations")}
                                dataUrl={Urls.emp_designations}
                                gridId="grd_emp_designations"
                                popupAction={toggleEmpDesignations}

                                gridAddButtonType="popup"
                                changeReload={(reload: any) => { dispatch(toggleEmpDesignations({ ...rootState, reload: reload })) }}
                                reload={rootState?.PopupData?.EmpDesignations?.reload}
                                gridAddButtonIcon="ri-add-line"
                                pageSize={40}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ERPModal
                isOpen={rootState.PopupData.EmpDesignations.isOpen || false}
                title={t("Emp_designations")}
                width={600}
                height={250}
                isForm={true}
                closeModal={() => { dispatch(toggleEmpDesignations({ isOpen: false, key: null, reload: false })); }}
                content={<MemoizedEmpDesignations />}
            />
        </Fragment>
    );
};

export default React.memo(EmpDesignations);
