import React, { Fragment, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleLeavetype } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { LeavetypeManage } from "./Leavetype-manage";
const Leavetype = () => {
    const MemoizedLeavetype = useMemo(() => React.memo(LeavetypeManage), []);
    const dispatch = useAppDispatch();
    const { t } = useTranslation("hr");
    const rootState = useRootState();
    const _rootState = useAppSelector((state: RootState) => state.PopupData);
    const columns: DevGridColumn[] = [
                {
                    dataField: "leaveTypeID",
                    caption: t("leaveType_ID"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 50,
                    visible: false,
                },
                {
                    dataField: "leaveTypeName",
                    caption: t("leave_type_name"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    showInPdf: true,
                },
                {
                    dataField: "leaveDescription",
                    caption: t("leave_description"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 150,
                },
                {
                    dataField: "affectOnBasic",
                    caption: t("affect_on_basic"),
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
                            view={{ type: "popup", action: () => toggleLeavetype({ isOpen: true, key: cellElement?.data?.leaveTypeID, reload: false, mode: "view" }), }}
                            edit={{ type: "popup", action: () => toggleLeavetype({ isOpen: true, key: cellElement?.data?.leaveTypeID, reload: false, mode: "edit" }), }}
                            delete={{
                                onSuccess: () => { dispatch(toggleLeavetype({ isOpen: false, key: null, reload: true, })); },
                                confirmationRequired: true,
                                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                                url: Urls?.leave_type,
                                key: cellElement?.data?.leaveTypeID,
                            }}
                        />
                    ),
                },
            ];
    useEffect(() => { dispatch(toggleLeavetype({ ...rootState, reload: true })); }, []);
    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                columns={columns}
                                gridHeader={t("Leave_type")}
                                dataUrl={Urls.leave_type}
                                gridId="grd_leave_types"
                                popupAction={toggleLeavetype}

                                gridAddButtonType="popup"
                                changeReload={(reload: any) => { dispatch(toggleLeavetype({ ...rootState, reload: reload })) }}
                                reload={rootState?.PopupData?.Leavetype?.reload}
                                gridAddButtonIcon="ri-add-line"
                                pageSize={40}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ERPModal
                isOpen={rootState.PopupData.Leavetype.isOpen || false}
                title={t("Leave_type")}
                width={600}
                height={250}
                isForm={true}
                closeModal={() => { dispatch(toggleLeavetype({ isOpen: false, key: null, reload: false })); }}
                content={<MemoizedLeavetype />}
            />
        </Fragment>
    );
};

export default React.memo(Leavetype);
