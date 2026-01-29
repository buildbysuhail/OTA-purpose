import React, { Fragment, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleEmployee } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { EmployeeManage } from "./Employee-manage";
const Employee = () => {
  const MemoizedEmployeeManage = useMemo(() => React.memo(EmployeeManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("hr");
  const rootState = useRootState();
  const _rootState = useAppSelector((state: RootState) => state.PopupData);
  const columns: DevGridColumn[] = 
      [
        {
          dataField: "employeeID",
          caption: t("employee_ID"),
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 50,
          visible: true,
        },
        {
          dataField: "employeeCode",
          caption: t("employee_code"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "employeeName",
          caption: t("employee_name"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 150,
        },
        {
          dataField: "shortName",
          caption: t("short_Name"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 150,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "gender",
          caption: t("gender"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "designationID",
          caption: t("designationID"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "accLedgerID",
          caption: t("accLedgerID"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false

        },
        {
          dataField: "doj",
          caption: t("doj"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "probotion_Period",
          caption: t("probotion_Period"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "isActive",
          caption: t("is_active"),
          dataType: "boolean",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "isNameChanged",
          caption: t("is_Name_Changed"),
          dataType: "boolean",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "address1",
          caption: t("address1"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "address2",
          caption: t("address2"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "address3",
          caption: t("address3"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "stateName",
          caption: t("state_Name"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "pin",
          caption: t("pin"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "phone",
          caption: t("phone"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "mobile",
          caption: t("mobile"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "email",
          caption: t("email"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "nationality",
          caption: t("nationality"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "bloodGroup",
          caption: t("blood_group"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
        },
        {
          dataField: "passportNo",
          caption: t("passport_No"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "passportExpDate",
          caption: t("passport_Exp_Date"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "visaDetails",
          caption: t("visa_Details"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "visaExpDate",
          caption: t("visa_Exp_Date"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "dob",
          caption: t("dob"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,

        },
        {
          dataField: "isResign",
          caption: t("is_resign"),
          dataType: "boolean",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          visible: false,

        },
        {
          dataField: "resignDate",
          caption: t("resign_Date"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "qualification",
          caption: t("qualification"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "notes",
          caption: t("notes"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
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
          visible: false
        },
        {
          dataField: "windowsEmpImage",
          caption: t("windows_Emp_Image"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "wageType",
          caption: t("wage_Type"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "wageAmt",
          caption: t("wage_Amt"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "cl",
          caption: t("cl"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "da",
          caption: t("da"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "pf",
          caption: t("pf"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "incentivePerc",
          caption: t("incentive_Perc"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "otAmount",
          caption: t("ot_Amount"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "totalWorkingHrs",
          caption: t("total_Working_Hrs"),
          dataType: "number",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "costCentreID",
          caption: t("cost_Centre_ID"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "salesTarget",
          caption: t("sales_Target"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "designationName",
          caption: t("designation_Name"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
          visible: false
        },
        {
          dataField: "costCentre",
          caption: t("cost_center"),
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          width: 100,
          showInPdf: true,
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
          cellRender: (cellElement: any) => (
            <ERPGridActions
              view={{ type: "popup", action: () => toggleEmployee({ isOpen: true, key: cellElement?.data?.id, reload: false, mode: "view" }), }}
              edit={{ type: "popup", action: () => toggleEmployee({ isOpen: true, key: cellElement?.data?.id, reload: false, mode: "edit" }), }}
              delete={{
                onSuccess: () => { dispatch(toggleEmployee({ isOpen: false, key: null, reload: true, })); },
                confirmationRequired: true,
                confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                url: Urls?.employee,
                key: cellElement?.data?.id,
              }}
            />
          ),
        },
      ];
  useEffect(() => { dispatch(toggleEmployee({ ...rootState, reload: true })); }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("employee")}
                dataUrl={Urls.employee}
                gridId="employee"
                popupAction={toggleEmployee}

                gridAddButtonType="popup"
                changeReload={(reload: any) => { dispatch(toggleEmployee({ ...rootState, reload: reload })) }}
                reload={rootState?.PopupData?.employee?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
              />
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.employee.isOpen || false}
        title={t("employee")}
        width={1000}
        height={200}
        isForm={true}
        closeModal={() => { dispatch(toggleEmployee({ isOpen: false, key: null, reload: false })); }}
        content={<MemoizedEmployeeManage />}
      />
    </Fragment>
  );
};

export default React.memo(Employee);  