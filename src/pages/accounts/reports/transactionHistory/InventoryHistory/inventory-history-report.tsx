import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import TransactrionHistoryReportFilter, {
  TransactrionHistoryReportFilterInitialState,
} from "../transaction-history-report-filter";
import InventoryHistoryDetails from "./inventory-history-details";
import InventoryHistoryPopup from "./inventory-history-popup";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import moment from "moment";

const InventoryHistoryReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
        cellRender: (
                          cellElement: any,
                          cellInfo: any,
                          filter: any,
                          exportCell: any
                        ) => {
                           return  (cellElement.data.date==null||cellElement.data.date==""?"":moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")) ; // Ensures proper formatting
                        }
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "timeStamp",
      caption: t("time"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.oldInvTransactionID > 0 ? (
          <DrillDownCellTemplate
            data={cellElement}
            field="vchNo"
          ></DrillDownCellTemplate>
        ) : (
          cellElement.value
        );
      },
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.grandTotal;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.grandTotal == null 
              ? '':getFormattedValue(cellElement.data.grandTotal,false,4) }`}
          </span>)
        }
      }
    },
    {
      dataField: "actionStatus",
      caption: t("action"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cashReceived;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.cashReceived == null 
              ? '':getFormattedValue(cellElement.data.cashReceived,false,4) }`}
          </span>)
        }
      }
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
      caption: t("user_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "oldInvTransactionID",
      caption: t("old_invTransaction_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      showInPdf:false,
      width: 200,
    },
    {
      dataField: "details",
      caption: t("details"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <DrillDownCellTemplate
          data={cellElement}
          field="details"
        ></DrillDownCellTemplate>
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("inventory_transaction_history")}
                  dataUrl={Urls.acc_reports_inventory_history}
                  method={ActionType.POST}
                  gridId="grd_inventory_history_report"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TransactrionHistoryReportFilter />}
                  filterInitialData={
                    TransactrionHistoryReportFilterInitialState
                  }
                  filterWidth="150"
                  hideGridAddButton={true}
                  reload={true}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title:
                      dataField == "vchNo"
                        ? t(`inventory_transaction_history_popup`)
                        : t(`productsDetailedReportTransaction`),
                    width: "max-w-[1500px]",
                    isForm: false,
                    content:
                      dataField == "vchNo" ? (
                        <InventoryHistoryPopup />
                      ) : dataField == "details" ? (
                        <InventoryHistoryDetails />
                      ) : null,
                    drillDownCells: dataField == "vchNo" ? "vchNo" : "details",
                    bodyProps:
                      dataField == "vchNo"
                        ? "oldInvTransactionID"
                        : "invTransactionMasterID",
                  })}
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
