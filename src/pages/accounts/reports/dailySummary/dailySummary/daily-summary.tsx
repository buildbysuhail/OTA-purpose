import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useCallback, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";

interface DailySummary {

    transactionDate: Date;
    counterID: number;
    costCentreID: number;
    counterShiftId: number;
    employeeID: number;

}
const DailySummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<DailySummary>({transactionDate: new Date(), counterID: 0,costCentreID: 0,counterShiftId: 0,employeeID: 0});
  const [voucherType, setVoucherType] =useState<string>("");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "cType",
      caption: t('c_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      width: 300,
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    
    },
    {
      dataField: "amount",
      caption:  t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      
    },
  ];
  const detailsColumns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "vrType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "voucherPrefix",
      caption:  t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cashAmount",
      caption: t("cash_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "creditAmount",
      caption: t('credit_amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "bankAmount",
      caption: t("bank_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "salesMan",
      caption: t("sales_man"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
  ];
  const handleCellClick = useCallback((event: any) => {
    setVoucherType(event.data?.cType);
  }, []);
  return (
    <Fragment>
     <div className="grid grid-cols-12 gap-x-6">
  <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
    <div className="p-4">
      <div className="grid grid-cols-1 gap-3">
        <ErpDevGrid
          columns={columns}
          showSerialNo={true}
          gridHeader={t("daily_summary_report")}
          dataUrl={Urls.acc_reports_daily_summary}
          postData={filter}
          method={ActionType.POST}
          gridId="grd_cost_centre"
          popupAction={toggleCostCentrePopup}
          onCellClick={handleCellClick}
          remoteOperations={{ filtering: false, paging: false, sorting: false }}
          hideGridAddButton={true}
          childPopupProps={{
            content: null,
            title: '',
            isForm: false,
            width: "mw-100",
            drillDownCells: "description",
          }}
          reload={true}
        ></ErpDevGrid>
      </div>
    </div>
  </div>

  <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
    <div className="p-4">
      <div className="grid grid-cols-1 gap-3">
        <ErpDevGrid
          columns={columns}
          gridHeader={t("daily_summary_detailed")}
          dataUrl={Urls.acc_reports_daily_summary_detailed}
          postData={{... filter,
            voucherType: voucherType}}
          method={ActionType.POST}
          gridId="grd_cost_centre"
          popupAction={toggleCostCentrePopup}
          hideGridAddButton={true}
          reload={true}
        ></ErpDevGrid>
      </div>
    </div>
  </div>
</div>

      
    </Fragment>
  );
};

export default DailySummary;