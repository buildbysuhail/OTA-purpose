import { Fragment, useCallback, useMemo, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleRemainderPopup, toggleUserActionPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";
import React from "react";
import { ActionType } from "../../../redux/types";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { RemainderManage } from "./remainder-manage";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";


const UserActionReport: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] =useMemo( () => [
    {
      dataField: "userName",
      caption: t("user"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "counterName",
      caption: t("counter"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "actionPerformed",
      caption: t("action"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "dateTimeOfAction",
      caption: t("date_time_of_action"),
      dataType: "date", // or "datetime" depending on your use case
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "actionName",
      caption: t("action"), 
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "actionForm",
      caption: t("action_form"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "systemName",
      caption: t("system_name"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },
    {
      dataField: "branchName",
      caption: t("branch"),
      dataType: "string",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: false,
    },

  ],[]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("user_actions")}
                  dataUrl={Urls.userActionReport}
                  gridId="user_action_report"
                  hideGridAddButton={true}
                  initialFilters={[
                    { field: 'dateTimeOfAction', value: new Date("4/12/2024"), operation: '=' }
                  ]}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

export default UserActionReport;
