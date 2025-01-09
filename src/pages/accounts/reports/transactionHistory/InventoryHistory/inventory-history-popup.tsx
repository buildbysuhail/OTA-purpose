import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import InventoryHistoryDetails from "./inventory-history-details";

interface InventoryHistoryPopupProps {
  contentProps?: any
  enablefilter?: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}
const InventoryHistoryPopup = ({contentProps,isMaximized, modalHeight,}:InventoryHistoryPopupProps) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
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
      showInPdf:true,
    },
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "vchNo",
      caption:  t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        
        return (
          cellElement.data.oldInvTransactionID > 0 ? <DrillDownCellTemplate data={cellElement} field="vchNo"></DrillDownCellTemplate> : cellElement.value
          
        )
      },
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "cashReceived",
      caption: t("cash_received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
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
      dataField: "oldInvTransactionID",
      caption: t("old_invTransaction_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "invTransactionMasterID",
      caption: t('invTransaction_master_id'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
    },
    {
      dataField: "details",
      caption: t("details"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement} field="details"></DrillDownCellTemplate>
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  postData ={contentProps}
                  gridHeader={t("inventory_transaction_history_popup")}
                  dataUrl= {Urls.acc_reports_inventory_history_popup}
                  method={ActionType.POST}
                  gridId="grd_inventory_history_popup"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title: dataField == "vchNo" ? t(`inventory_transaction_history_popup`) : t(`productsDetailedReportTransaction`),
                    width: "700px",
                    isForm: false,
                    content: dataField == "vchNo" ? <InventoryHistoryPopup/> : dataField == "details" ?<InventoryHistoryDetails/>: null,
                    drillDownCells: dataField == "vchNo" ? "vchNo" : "details",
                    bodyProps: dataField == "vchNo" ?"oldInvTransactionID":"invTransactionMasterID",
                    enableFn: (data: any) => dataField == "vchNo" ?  data.oldInvTransactionID > 0 : true
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

export default InventoryHistoryPopup;