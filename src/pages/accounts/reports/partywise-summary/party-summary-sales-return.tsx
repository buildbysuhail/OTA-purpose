import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { PartySummaryFilter } from "./party-summary-master";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const PartySummarySalesReturn: React.FC<PartySummaryFilter> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
      const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "vNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "vPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "ledgerName",
      caption: t('ledger_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.particulars;
          const isDebit = balance >= 0;
          // const value =
          //   balance == null
          //     ? ""
          //     : balance < 0
          //       ? getFormattedValue(-1 * balance)
          //       : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.ledgerName === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgerName === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return ( <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.ledgerName}`}
        </span>)
}}
    },
    {
      dataField: "partyName",
      caption: t('party_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t('address1'),
      dataType: "string",
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
      width:100
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.quantity;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(-1 * balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
                : cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.ledgerName === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgerName === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(cellElement.data.quantity, false, 2) : getFormattedValue(cellElement.data.quantity, false, 4)}`}
          </span>)
        }
      }
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
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
      showInPdf:true,
    },
    {
      dataField: "grossValue",
      caption: t('gross_value'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "rateWithTax",
      caption: t("rate_with_tax"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "netValue",
      caption: t("net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.netValue;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(-1 * balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
                : cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.ledgerName === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgerName === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(cellElement.data.netValue, false, 2) : getFormattedValue(cellElement.data.netValue, false, 4)}`}
          </span>)
        }
      }
    },
    {
      dataField: "totalVatAmount",
      caption: t("total_vat_amount"),
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
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.netAmount;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(-1 * balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
                : cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(balance, false, 2) : getFormattedValue(-1 * balance, false, 4)
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.ledgerName === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.ledgerName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgerName === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgerName === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data.ledgerName === "TOTAL" ? getFormattedValue(cellElement.data.netAmount, false, 2) : getFormattedValue(cellElement.data.netAmount, false, 4)}`}
          </span>)
        }
      }
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">

              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 heightToAdjustOnWindows={280}
                 remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  gridHeader={t("party_summary_sales_return")}
                  dataUrl={Urls.acc_reports_party_summary_sales_return}
                  method={ActionType.POST}
                  gridId="grd_party_summary_sales_return"
                  popupAction={toggleCostCentrePopup}
                  postData={filter}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>

    </Fragment>
  );
};
export default PartySummarySalesReturn;