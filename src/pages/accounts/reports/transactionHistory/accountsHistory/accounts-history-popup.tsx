import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";

interface AccountsHistoryPopupProps {
  contentProps?: any;
  enablefilter?: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}
const AccountsHistoryPopup = ({
  contentProps,
  isMaximized,
  modalHeight,
}: AccountsHistoryPopupProps) => {
  const { t } = useTranslation("accountsReport");
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 180;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("SiNo"),
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
      width: 150,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => {
        debugger;
        return (
          cellElement.data.oldAccTransactionMasterID > 0 ? <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate> : cellElement.value
          
        )
      },
    },
    {
      dataField: "accountName",
      caption: t("account_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "oldAccTransactionMasterID",
      caption: t("oldAccTransactionMasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "accTransactionMasterID",
      caption: t("accTransactionMasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  columns={columns}
                  gridHeader={t("accounts_transaction_history_popup")}
                  dataUrl={Urls.acc_reports_accounts_history_popup}
                  method={ActionType.POST}
                  postData={
                    contentProps.oldAccTransactionMasterID != 0
                      ? contentProps
                      : null
                  }
                  gridId="grd_accounts_history_popup"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <AccountsHistoryPopup />,
                    title: t("accounts_transaction_history_popup"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "vchNo",
                    bodyProps: "oldAccTransactionMasterID",
                    enableFn: (data: any) => data.oldAccTransactionMasterID > 0
                  }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountsHistoryPopup;