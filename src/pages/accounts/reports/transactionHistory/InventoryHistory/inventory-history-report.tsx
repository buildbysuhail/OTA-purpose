import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import TransactrionHistoryReportFilter, { TransactrionHistoryReportFilterInitialState } from "../transaction-history-report-filter";


const InventoryHistoryReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('transaction_date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "timeStamp",
      caption: t("time"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      caption:  t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "actionStatus",
      caption: t("action"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "userName",
      caption: t('user_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
                  columns={columns}
                  gridHeader={t("inventory_transaction_history")}
                  dataUrl= {Urls.acc_reports_inventory_history}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  // popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TransactrionHistoryReportFilter/>}
                  filterInitialData={TransactrionHistoryReportFilterInitialState}
                  filterWidth="150"
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

export default InventoryHistoryReport;