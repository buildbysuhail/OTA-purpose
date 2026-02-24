import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { APIClient } from "../../../../../helpers/api-client";

export interface StockSummarySerialsProps {
  id: any;
  autobarcode: any;
}
const api = new APIClient();
  const StockSummarySerials = ({ id,autobarcode }: StockSummarySerialsProps ) => {
  const { getFormattedValue } = useNumberFormat();
    // const [gridDataSource, setGridDataSource] = useState<any[]>([]);
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "branchID",
      caption: t("branchId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 40,
      showInPdf: true,
      visible: false,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "serialNumber",
      caption: t("serial_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 70,
      showInPdf: true,
    },
    {
      dataField: "barcode",
      caption: t("barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 60,
      visible: false,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stock == null
              ? ""
              : getFormattedValue(cellElement.data.stock, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stock == null
            ? ""
            : getFormattedValue(cellElement.data.stock, false, 4);
        }
      },
    },
  ];
  //  useEffect(() => {
  //     const fetchGridData = async () => {
  //         try {
  //             const serialData = await api.getAsync(`${Urls.stock_summary_serials}${id}`);
  //             setGridDataSource(serialData.data);
  //         } catch (error) {
  //             console.error("Error fetching price categories:", error);
  //         }
  //     };
  //     fetchGridData();
  // }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                filterText="{**** (productName)}"
                columns={columns}
                dataUrl={Urls.stock_summary_serials}
                hideGridAddButton={true}
                method={ActionType.POST}
                postData={{id:id,autoBarcode:autobarcode}}
                reload={true}
                gridId="grd_stock_summary_serials"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default StockSummarySerials;
