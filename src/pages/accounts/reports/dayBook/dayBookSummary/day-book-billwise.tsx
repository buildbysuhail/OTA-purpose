import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../../utilities/Utils";

interface DayBookBillwiseProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
}

const DayBookBillWise: FC<DayBookBillwiseProps> = ({ postData, contentProps, rowData }) => {

// const DayBookBillWise = ({contentProps, enablefilter = false}:DayBookBillwiseProps) => {
  const dispatch = useAppDispatch();
  const { getFormattedValue} = useNumberFormat()
  const { t } = useTranslation();
  // const [filter, setFilter] =useState<DayBookBillWise>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "vchNo",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.particulars}
  </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.debit}
  </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.credit}
  </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
 {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1* cellElement.data.balance) : getFormattedValue(cellElement.data.balance)} ${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data?.balance >= 0 ? 'Dr' : 'Cr' }`}

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
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  heightToAdjustOnWindows={window.innerHeight-649}
                  columns={columns}
                  rowData={rowData}
                  // postData = {contentProps}
                  gridHeader={t("daybook_billwise")}
                  dataUrl= {Urls.acc_reports_day_book_billwise}
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

export default DayBookBillWise;