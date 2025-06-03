import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { BranchTransferFilterInitialState } from "./branch-transfer-filter";
import { useLocation } from "react-router-dom";
import BranchTransferFilter from "./branch-transfer-filter";
interface BranchTransferInOutProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const BranchTransferOutIn: FC<BranchTransferInOutProps> = ({
  gridHeader,
  dataUrl,
  gridId,
}) => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "voucherNumber",
    //   caption: t("voucher_number"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   allowSorting: true,
    //   width: 90,
    //   showInPdf:true,
    //         groupIndex:0
    // },
    {
      dataField: "vNo",
      caption: t("v_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 75,
      showInPdf: true,
      groupIndex: 0,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
      format: "dd-MMM-yyyy",
      groupIndex: 1,
    },
    {
      dataField: "fromBranch",
      caption: t("from_branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
      groupIndex: 2,
    },
    {
      dataField: "toBranch",
      caption: t("to_branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
      groupIndex: 3,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      sortIndex: 0,
      sortOrder: "asc",
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 75,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.quantity == null
              ? ""
              : getFormattedValue(cellElement.data.quantity);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.quantity == null
            ? ""
            : getFormattedValue(cellElement.data.quantity);
        }
      },
    },
    {
      dataField: "unitPrice",
      caption: t("price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 90,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.unitPrice == null
              ? ""
              : getFormattedValue(cellElement.data.unitPrice);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.unitPrice == null
            ? ""
            : getFormattedValue(cellElement.data.unitPrice);
        }
      },
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.netAmount == null
              ? ""
              : getFormattedValue(cellElement.data.netAmount);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.netAmount == null
            ? ""
            : getFormattedValue(cellElement.data.netAmount);
        }
      },
    },
    {
      dataField: "invTransactionMasterID",
      caption: t("inv_transaction_master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "itemAlias",
      caption: t("alias_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);
  const customizeTotal = (itemInfo: any) => `Net Total`;
  const customizeTotalGroup = (itemInfo: any) => `Sub Total`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "quantity",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "netAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "productName",
      summaryType: "max",
      customizeText: customizeTotalGroup,
      isGroupItem: true,
      showInGroupFooter: true,
    },

    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "quantity",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      isGroupItem: true,
      showInGroupFooter: true,
      column: "netAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
  ];
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={key}
                filterText=" From : {fromDate} - {toDate}"
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={true}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<BranchTransferFilter />}
                filterWidth={360}
                filterHeight={260}
                filterInitialData={BranchTransferFilterInitialState}
                reload={true}
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BranchTransferOutIn;
