import { FC, Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useSearchParams } from "react-router-dom";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";

interface OutstandingAccountAgingAnalysisProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
}
const OutstandingAccountAgingAnalysis: FC<OutstandingAccountAgingAnalysisProps> = ({ postData, contentProps, rowData }) => {
// const OutstandingAccountAgingAnalysis =  ({contentProps, enablefilter = false}:OutstandingAccountAgingAnalysisProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
    const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<OutstandingAccountAgingAnalysis>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('si_no'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "form",
      caption:  t("form"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.form==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.form}
  </span>
      ),
    },
     {
      dataField: "voucherNumber",
      caption:  t("voucher_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "billTotal",
      caption: t('bill_total'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.form==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.billTotal}
  </span>
      ),
    },
    {
      dataField: "period",
      caption: t("period"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.form==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
  </span>
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  heightToAdjustOnWindows={window.innerHeight-649}
                  columns={columns}
                  filterText="{___(ledgername)}{**** As On Date : (asonDate)}"
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridHeader={t("account_aging_analysis")}
                  dataUrl= {Urls.acc_reports_aging_analysis}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default OutstandingAccountAgingAnalysis;