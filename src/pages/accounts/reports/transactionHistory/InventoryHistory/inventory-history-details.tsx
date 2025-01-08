import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";

interface InventoryHistoryDetailsProps {
  contentProps?: any
  enablefilter?: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}
const InventoryHistoryDetails = ({contentProps,isMaximized,modalHeight}:InventoryHistoryDetailsProps) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();

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
      dataField: "productName",
      caption: t('product_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "autoBarcode",
      caption:  t("auto_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "free",
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "salesPrice",
      caption: t("sales_price"),
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
            <div className="">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 heightToAdjustOnWindowsInModal={gridHeight.windows}
                  columns={columns}
                  postData ={contentProps}
                  gridHeader={t("inventory_transaction_history_details")}
                  dataUrl= {Urls.acc_reports_inventory_history_details}
                  method={ActionType.POST}
                  gridId="grd_inventory_history_details"
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

export default InventoryHistoryDetails;