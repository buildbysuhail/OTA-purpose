import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import { useSearchParams } from "react-router-dom";
import PaymentReportFilter, { PaymentReportFilterInitialState } from "./payment-report-filter";
import CollectionReportFilter, { CollectionReportFilterInitialState } from "./collection-report-filter";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";

interface CollectionReport {

  from: Date
}
const CollectionReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
      const { getFormattedValue} = useNumberFormat()
  const { t } = useTranslation();
  const [filter, setFilter] =useState<CollectionReport>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
  
    {
      dataField: "vchNo",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    // {
    //   dataField: "ledger",
    //   caption: t("account"),
    //   dataType: "string",
    //   allowSearch: true, 
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.particulars}
  </span>
      ),
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "amount",
      caption: t('amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
   {`${cellElement.data?.amount == 0 || cellElement.data?.amount == null ? '' : cellElement.data.amount < 0 ? getFormattedValue(-1* cellElement.data.amount) : getFormattedValue(cellElement.data.amount)} ${cellElement.data?.amount == 0 || cellElement.data?.amount == null ? '' : cellElement.data?.amount >= 0 ? 'Dr' : 'Cr' }`}

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
                allowGrouping ={true}
                grop
                  columns={columns}
                  gridHeader={t("collection_report")}
                  dataUrl= {Urls.acc_reports_collection}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<CollectionReportFilter/>}
                  filterInitialData={CollectionReportFilterInitialState}
                  hideGridAddButton={true}
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

export default CollectionReport;