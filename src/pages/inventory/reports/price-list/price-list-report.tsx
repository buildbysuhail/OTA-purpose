import { Fragment, useMemo, useState } from "react";
import PriceListReportFilter, {
  PriceListReportFilterInitialState,
} from "./price-list-report-filter";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PriceList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "code",
        caption: t("code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 100,
        showInPdf: true,
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 200,
        showInPdf: true,
      },
      {
        dataField: "name",
        caption: t("name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 200,
        showInPdf: true,
      },
      {
        dataField: "group",
        caption: t("group"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "category",
        caption: t("category"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "brand",
        caption: t("brand"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "batchNo",
        caption: t("batch_no"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 150,
        visible: false,
      },
      {
        dataField: "pPrice",
        caption: t("p_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.pPrice == null
                ? ""
                : getFormattedValue(cellElement.data.pPrice,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.pPrice == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.pPrice),false,4);
          }
        },
      },
      {
        dataField: "sPrice",
        caption: t("s_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.sPrice == null
                ? ""
                : getFormattedValue(cellElement.data.sPrice,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sPrice == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.sPrice),false,4);
          }
        },
      },
      {
        dataField: "msp",
        caption: t("msp"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.msp == null
                ? ""
                : getFormattedValue(cellElement.data.msp,false,3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.msp == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.msp),false,3);
          }
        },
      },
      {
        dataField: "specification",
        caption: t("specification"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
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
                : getFormattedValue(cellElement.data.stock,false,4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stock == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.stock),false,4);
          }
        },
      },
      {
        dataField: "mannualBarcode",
        caption: t("mannual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        minWidth: 150,
        showInPdf: true,
      },
    ];
    return baseColumns.filter((column) => {
      if (column.dataField == "arabicName") {
        return !clientSession.isAppGlobal;
      }
      return true;
    });
  }, [t, clientSession]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                   remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                summaryItems={[]}
                  gridHeader={t("price_list")}
                  dataUrl={Urls.inv_reports_price_list}
                  hideGridAddButton={true}
                  enablefilter={true}
                  filterWidth={600}
                  filterHeight={200}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<PriceListReportFilter />}
                  filterInitialData={PriceListReportFilterInitialState}
                  reload={true}
                  gridId="grd_price_list"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PriceList;
