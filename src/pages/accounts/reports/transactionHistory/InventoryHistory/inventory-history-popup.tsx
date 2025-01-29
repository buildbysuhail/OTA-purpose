import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import InventoryHistoryDetails from "./inventory-history-details";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";

interface InventoryHistoryPopupProps {
  contentProps?: any;
  enablefilter?: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}
const InventoryHistoryPopup = ({
  contentProps,
  isMaximized,
  modalHeight,
}: InventoryHistoryPopupProps) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
    const { getFormattedValue } = useNumberFormat()
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 180;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);
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
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      width:100
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      width:150,
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
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 110,
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
    
    },
    {
      dataField: "oldInvTransactionID",
      caption: t("old_invTransaction_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      showInPdf:false,
      width: 180,
    },
    {
      dataField: "invTransactionMasterID",
      caption: t("invTransaction_master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false,
    },
    {
      dataField: "details",
      caption: t("details"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
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
        
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  postData={contentProps}
                  gridHeader={t("inventory_transaction_history_popup")}
                  dataUrl={Urls.acc_reports_inventory_history_popup}
                  method={ActionType.POST}
                  gridId="grd_inventory_history_popup"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title:
                      dataField == "vchNo"
                        ? t(`inventory_transaction_history_popup`)
                        : t(`productsDetailedReportTransaction`),
                    width: "max-w-[1100px]",
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
                    enableFn: (data: any) =>
                      dataField == "vchNo"
                        ? data.oldInvTransactionID > 0
                        : true,
                  })}
                ></ErpDevGrid>
              </div>
            </div>
          </div>

    </Fragment>
  );
};

export default InventoryHistoryPopup;
