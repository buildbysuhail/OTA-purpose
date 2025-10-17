import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useLocation } from "react-router-dom";
import RegisterFilter, {
  RegisterFilterInitialState,
} from "./register-report-filter";
import { isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";
import { DataGrid } from "devextreme-react";
import { Summary, TotalItem } from "devextreme-react/cjs/data-grid";

interface RegisterProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}

const RegisterReport: FC<RegisterProps> = ({ gridHeader, dataUrl, gridId }) => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(RegisterFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const onApplyFilter = useCallback((_filter: any) => {
    setFilter({ ..._filter });
  }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
     
      {
        dataField: "grossValue",
        caption: t("gross_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.grossValue == null
                ? ""
                : getFormattedValue(cellElement.data.grossValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.grossValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.grossValue));
          }
        },
      },
      {
        dataField: "gstin",
        caption: t("gstin"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "vatNumber",
        caption: t("vat_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "mannualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
      },

      // {
      //   dataField: "avgPrice",
      //   caption: t("AvgPrice"),
      //   dataType: "number",
      //   allowSearch: true,
      //   allowFiltering: true,
      //   width: 100,
      //   cellRender: (
      //     cellElement: any,
      //     cellInfo: any,
      //     filter: any,
      //     exportCell: any
      //   ) => {
      //     if (exportCell != undefined) {
      //       const value =
      //         cellElement.data?.avgPrice == null
      //           ? ""
      //           : getFormattedValue(cellElement.data.avgPrice);
      //       return {
      //         ...exportCell,
      //         text: value,
      //         alignment: "right",
      //         alignmentExcel: { horizontal: "right" },
      //       };
      //     } else {
      //       return cellElement.data?.avgPrice == null
      //         ? ""
      //         : getFormattedValue(parseFloat(cellElement.data.avgPrice));
      //     }
      //   },
      // },
      {
        dataField: "referenceNumber",
        caption: t("reference_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "baseUnitQuantity",
        caption: t("base_unit_quantity"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.baseUnitQuantity == null
                ? ""
                : getFormattedValue(cellElement.data.baseUnitQuantity);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.baseUnitQuantity == null
              ? ""
              : getFormattedValue(
                  parseFloat(cellElement.data.baseUnitQuantity)
                );
          }
        },
      },
      {
        dataField: "taxableValue",
        caption: t("taxable_value"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.taxableValue == null
                ? ""
                : getFormattedValue(cellElement.data.taxableValue);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.taxableValue == null
              ? ""
              : getFormattedValue(parseFloat(cellElement.data.taxableValue));
          }
        },
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns
      .filter((column) => {
        // if (column.dataField == "xRate") {
        //   return filter.voucherForm == "Import";
        // }
        if (column.dataField == "baseUnitQuantity") {
          return userSession.dbIdValue == "543140180640";
        }
        if (
          column.dataField == "vat" ||
          column.dataField == "baseUnitQuantity" ||
          column.dataField == "partyCode" ||
          // column.dataField == "referenceNumber" ||
          // column.dataField == "salesPrice" ||
          column.dataField == "vatNumber" ||
          column.dataField == "exciseTax"
        ) {
          return !clientSession.isAppGlobal;
        }
        if (["referenceNumber"].includes(column.dataField ?? "")) {
          //only for nahla
          return userSession.dbIdValue == "543140180640";
        }
        if (
          [
            "cgstPerc",
            "cgst",
            "sgstPerc",
            "sgst",
            "igstPerc",
            "igst",
            "gstPercent",
            "gstAmt",
            "hsnCode",
            "gstin",
            "vNUM",
            "remarks",
            "cessPerc",
            "cessAmt",
            "additionalCessPerc",
            "additionalCess",
            "gstNo",
            "priceCategoryID",
            "taxableValue",
          ].includes(column.dataField ?? "")
        ) {
          return clientSession.isAppGlobal;
        }
        return true;
      })
      .map((column) => {
        if (column.dataField == "uPI" && !clientSession.isAppGlobal) {
          return {
            ...column,
            caption: t("qr_pay"),
          };
        }
        if (column.dataField == "xRate") {
          return {
            ...column,
            visible: filter.voucherForm == "Import",
          };
        }
        return column;
      });
  }, [t, filter, userSession.dbIdValue]);
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
      return getFormattedValue(parseFloat(value)) || "0";
    };
  }, [getFormattedValue]);
  const customizeSummaryRowString = useMemo(() => {
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
      return value.toString() || "0";
    };
  }, [getFormattedValue]);

  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = useMemo(() => {
    const _summaryItems: SummaryConfig[] = [
      {
        column: "party",
        summaryType: "max",
        customizeText: customizeDate,
      },
      {
        column: "totalProfit",
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
        column: "additionalExpenses",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //is not is appglobal + 4 decimal
      {
        column: "vat",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: (itemInfo: { value: any }) => {
          return (
            getFormattedValue(
              parseFloat(
                getFormattedValue(
                  isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
                ).replace(/,/g, "") || "0"
              ),
              false,
              4
            ) || "0"
          );
        },
      },
      {
        column: "stdPurchasePrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "stdSalesPrice",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "quantity",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "free",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "freeValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "freeCost",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "qtyNos",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "xRate",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRowString,
      },
      {
        column: "additionalExpense",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      //.DBID_VALUE == "543140180640"
      {
        column: "baseUnitQuantity",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "totalDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "grossValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "netValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "schemeDisc",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "exciseTax",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
      {
        column: "taxableValue",
        summaryType: "sum",
        valueFormat: "currency",
        customizeText: customizeSummaryRow,
      },
    ];
    return _summaryItems.filter((column) => {
      return true;
    });
  }, [t, filter, userSession.dbIdValue]);
  const location = useLocation();
  const [key, setKey] = useState(1);
  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <DataGrid
                key={key}
                // filterText=" From : {fromDate} - {toDate} {productID > 0 && , Product Name : [productName]} {productGroupID > 0 && , Group Name : [groupName]}{brandID > 0 && , Brand : [brand]}{salesRouteID > 0 && , Route Name : [routeName]}  {salesmanID > 0 && , Sales Man : [salesMan]}  {warehouseID > 0 && ,  Warehouse : [warehouse]} {supplierID > 0 && , Supplier :[supplier]} "
               
          allowColumnReordering={true}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                // gridHeader={t(gridHeader)}
                // dataUrl={dataUrl}
                dataSource={
                  [
                    {
            "masterID": 600001078054,
            "date": "17-10-2024",
            "vchNo": " 611680",
            "vnum": "",
            "form": "SI VAT",
            "partyCode": "8323",
            "party": "مؤسسة مدن السواحل التجارية",
            "address1": "",
            "address2": "",
            "detailID": 600007436495,
            "unitPrice": 31,
            "batchNo": "",
            "productCode": "10349",
            "product": "SHOPPING BAG 18X1500 NASIM",
            "productGroup": "SHOPPING BAG",
            "brand": "1x1",
            "categoryCode": "PL",
            "category": "PLASTIC",
            "quantity": 2,
            "free": 0,
            "unitCode": "CTN",
            "vat": 9.3,
            "netAmount": 71.3,
            "freeValue": 0,
            "cost": 30,
            "freeCost": 0,
            "totalProfit": 2,
            "mrp": 31,
            "specification": "",
            "counterName": "SAMA  PLASTIC",
            "routeName": "SAMA MAHJAR",
            "financialYearID": 1,
            "xRate": 0,
            "autoBarcode": "6610349",
            "additionalExpense": 0,
            "branchName": "SAMA UNITED TRADING COMPANY",
            "productDescription": "",
            "colour": "",
            "warranty": "",
            "qtyNos": 0,
            "groupCategoryName": "BAG",
            "sectionName": "PLASTICS",
            "employeeName": "SALIM MAMPATTA",
            "totalDiscount": 0,
            "netValue": 62,
            "grossValue": 62,
            "vatNumber": "310101529800003",
            "mannualBarcode": "",
            "purchaseInvoiceNumber": "0",
            "schemeDisc": 0,
            "exciseTax": 0,
            "stdPurchasePrice": 30,
            "stdSalesPrice": 31,
            "expiryDate": "2099-12-31T00:00:00",
            "costCentreName": "SAMA PLASTICS",
            "cgstPerc": 0,
            "cgst": null,
            "sgstPerc": 0,
            "sgst": null,
            "igstPerc": 0,
            "igst": null,
            "additionalCessPerc": 0,
            "additionalCess": null,
            "gstPercent": 0,
            "gstAmt": 0,
            "hsnCode": "",
            "gstin": "",
            "salesPrice": 0,
            "remarks": "",
            "cessPerc": 0,
            "cessAmt": 0,
            "taxNo": "",
            "gstNo": "",
            "sl": 0,
            "unitName": "",
            "priceCategoryID": 0,
            "referenceNumber": "",
            "baseUnitQuantity": 0,
            "taxableValue": 0
        },
        {
            "masterID": 600001078054,
            "date": "17-10-2024",
            "vchNo": " 611680",
            "vnum": "",
            "form": "SI VAT",
            "partyCode": "8323",
            "party": "مؤسسة مدن السواحل التجارية",
            "address1": "",
            "address2": "",
            "detailID": 600007436496,
            "unitPrice": 27,
            "batchNo": "",
            "productCode": "10351",
            "product": "SHOPPING BAG 22X800 NASIM",
            "productGroup": "SHOPPING BAG",
            "brand": "1x1",
            "categoryCode": "PL",
            "category": "PLASTIC",
            "quantity": 2,
            "free": 0,
            "unitCode": "CTN",
            "vat": 8.1,
            "netAmount": 62.1,
            "freeValue": 0,
            "cost": 25,
            "freeCost": 0,
            "totalProfit": 4,
            "mrp": 26,
            "specification": "",
            "counterName": "SAMA  PLASTIC",
            "routeName": "SAMA MAHJAR",
            "financialYearID": 1,
            "xRate": 0,
            "autoBarcode": "6610351",
            "additionalExpense": 0,
            "branchName": "SAMA UNITED TRADING COMPANY",
            "productDescription": "",
            "colour": "",
            "warranty": "",
            "qtyNos": 0,
            "groupCategoryName": "BAG",
            "sectionName": "PLASTICS",
            "employeeName": "SALIM MAMPATTA",
            "totalDiscount": 0,
            "netValue": 54,
            "grossValue": 54,
            "vatNumber": "310101529800003",
            "mannualBarcode": "",
            "purchaseInvoiceNumber": "0",
            "schemeDisc": 0,
            "exciseTax": 0,
            "stdPurchasePrice": 25,
            "stdSalesPrice": 27,
            "expiryDate": "2099-12-31T00:00:00",
            "costCentreName": "SAMA PLASTICS",
            "cgstPerc": 0,
            "cgst": null,
            "sgstPerc": 0,
            "sgst": null,
            "igstPerc": 0,
            "igst": null,
            "additionalCessPerc": 0,
            "additionalCess": null,
            "gstPercent": 0,
            "gstAmt": 0,
            "hsnCode": "",
            "gstin": "",
            "salesPrice": 0,
            "remarks": "",
            "cessPerc": 0,
            "cessAmt": 0,
            "taxNo": "",
            "gstNo": "",
            "sl": 0,
            "unitName": "",
            "priceCategoryID": 0,
            "referenceNumber": "",
            "baseUnitQuantity": 0,
            "taxableValue": 0
        },
        {
            "masterID": 600001078054,
            "date": "17-10-2024",
            "vchNo": " 611680",
            "vnum": "",
            "form": "SI VAT",
            "partyCode": "8323",
            "party": "مؤسسة مدن السواحل التجارية",
            "address1": "",
            "address2": "",
            "detailID": 600007436489,
            "unitPrice": 69,
            "batchNo": "",
            "productCode": "10440",
            "product": "SUFRA 3X20 MAHA 3IN1 (100X120)",
            "productGroup": "SUFRA ROLL",
            "brand": "3x20",
            "categoryCode": "PL",
            "category": "PLASTIC",
            "quantity": 1,
            "free": 0,
            "unitCode": "CTN",
            "vat": 10.35,
            "netAmount": 79.35,
            "freeValue": 0,
            "cost": 62.25,
            "freeCost": 0,
            "totalProfit": 6.75,
            "mrp": 67,
            "specification": "",
            "counterName": "SAMA  PLASTIC",
            "routeName": "SAMA MAHJAR",
            "financialYearID": 1,
            "xRate": 0,
            "autoBarcode": "6610440",
            "additionalExpense": 0,
            "branchName": "SAMA UNITED TRADING COMPANY",
            "productDescription": "",
            "colour": "",
            "warranty": "",
            "qtyNos": 0,
            "groupCategoryName": "SUFRA",
            "sectionName": "PLASTICS",
            "employeeName": "SALIM MAMPATTA",
            "totalDiscount": 0,
            "netValue": 69,
            "grossValue": 69,
            "vatNumber": "310101529800003",
            "mannualBarcode": "",
            "purchaseInvoiceNumber": "0",
            "schemeDisc": 0,
            "exciseTax": 0,
            "stdPurchasePrice": 62.25,
            "stdSalesPrice": 69,
            "expiryDate": "2099-12-31T00:00:00",
            "costCentreName": "SAMA PLASTICS",
            "cgstPerc": 0,
            "cgst": null,
            "sgstPerc": 0,
            "sgst": null,
            "igstPerc": 0,
            "igst": null,
            "additionalCessPerc": 0,
            "additionalCess": null,
            "gstPercent": 0,
            "gstAmt": 0,
            "hsnCode": "",
            "gstin": "",
            "salesPrice": 0,
            "remarks": "",
            "cessPerc": 0,
            "cessAmt": 0,
            "taxNo": "",
            "gstNo": "",
            "sl": 0,
            "unitName": "",
            "priceCategoryID": 0,
            "referenceNumber": "",
            "baseUnitQuantity": 0,
            "taxableValue": 0
        },
        {
            "masterID": 600001078054,
            "date": "17-10-2024",
            "vchNo": " 611680",
            "vnum": "",
            "form": "SI VAT",
            "partyCode": "8323",
            "party": "مؤسسة مدن السواحل التجارية",
            "address1": "",
            "address2": "",
            "detailID": 600007436494,
            "unitPrice": 44,
            "batchNo": "",
            "productCode": "13022",
            "product": "GLOVES VINYL CLEAR MEDIUM YASHFEEN (PG-02) 70 PS",
            "productGroup": "GLOVES",
            "brand": "1x10",
            "categoryCode": "PL",
            "category": "PLASTIC",
            "quantity": 1,
            "free": 0,
            "unitCode": "CTN",
            "vat": 6.6,
            "netAmount": 50.6,
            "freeValue": 0,
            "cost": 37,
            "freeCost": 0,
            "totalProfit": 7,
            "mrp": 40,
            "specification": "",
            "counterName": "SAMA  PLASTIC",
            "routeName": "SAMA MAHJAR",
            "financialYearID": 1,
            "xRate": 0,
            "autoBarcode": "6613022",
            "additionalExpense": 0,
            "branchName": "SAMA UNITED TRADING COMPANY",
            "productDescription": "",
            "colour": "",
            "warranty": "",
            "qtyNos": 0,
            "groupCategoryName": "WEARING",
            "sectionName": "PLASTICS",
            "employeeName": "SALIM MAMPATTA",
            "totalDiscount": 0,
            "netValue": 44,
            "grossValue": 44,
            "vatNumber": "310101529800003",
            "mannualBarcode": "100013022",
            "purchaseInvoiceNumber": "0",
            "schemeDisc": 0,
            "exciseTax": 0,
            "stdPurchasePrice": 37,
            "stdSalesPrice": 42,
            "expiryDate": "2099-12-31T00:00:00",
            "costCentreName": "SAMA PLASTICS",
            "cgstPerc": 0,
            "cgst": null,
            "sgstPerc": 0,
            "sgst": null,
            "igstPerc": 0,
            "igst": null,
            "additionalCessPerc": 0,
            "additionalCess": null,
            "gstPercent": 0,
            "gstAmt": 0,
            "hsnCode": "",
            "gstin": "",
            "salesPrice": 0,
            "remarks": "",
            "cessPerc": 0,
            "cessAmt": 0,
            "taxNo": "",
            "gstNo": "",
            "sl": 0,
            "unitName": "",
            "priceCategoryID": 0,
            "referenceNumber": "",
            "baseUnitQuantity": 0,
            "taxableValue": 0
        },
                    
                     ]
                }
                // hideGridAddButton={true}
                // enablefilter={false}
                // showFilterInitially={true}
                // method={ActionType.POST}
                // filterContent={<RegisterFilter />}
                // filterHeight={460}
                // filterWidth={700}
                // filterInitialData={{
                //   ...RegisterFilterInitialState,
                //   fromDate: moment(
                //     clientSession.softwareDate,
                //     "DD/MM/YYYY"
                //   ).local(),
                // }}
                // onFilterChanged={(f: any) => setFilter(f)}
                // reload={true}
                // gridId={gridId}
                // childPopupProps={{
                //   content: null,
                //   title: "",
                //   isForm: false,
                //   isTransactionScreen: true,
                //   drillDownCells: "vchNo,",
                // }}
              >
                 <Summary
          recalculateWhileEditing={true}
          skipEmptyValues={false}
          
          
        >
          {summaryItems?.map((config: SummaryConfig, index: number) => {
            return  (
              <TotalItem
                key={`summaryItem_${index}`}
                column={config.column}
                name={config.column}
                summaryType={config.summaryType}
                valueFormat={config.valueFormat}
                showInColumn={config.showInColumn}
                alignment={config.alignment}
                customizeText={config.customizeText}
                skipEmptyValues={false}
              />
            );
          })}
        </Summary>
                </DataGrid>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterReport;
