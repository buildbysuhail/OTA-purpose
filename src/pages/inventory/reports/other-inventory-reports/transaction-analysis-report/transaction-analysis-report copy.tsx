import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import moment from "moment";
import { isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";

const TransactionAnalysis = () => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "branch",
        caption: t("branch"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
      },
      {
        dataField: "year",
        caption: t("year"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
      },
      {
        dataField: "month",
        caption: t("month"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
      },
      {
        dataField: "sales",
        caption: t("sales"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 153,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.sales == null
                ? ""
                : getFormattedValue(cellElement.data.sales);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.sales == null
              ? ""
              : getFormattedValue(cellElement.data.sales);
          }
        },
      },
      {
        dataField: "purchase",
        caption: t("purchase"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.purchase == null
                ? ""
                : getFormattedValue(cellElement.data.purchase);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.purchase == null
              ? ""
              : getFormattedValue(cellElement.data.purchase);
          }
        },
      },
      {
        dataField: "expense",
        caption: t("expense"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 70,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.expense == null
                ? ""
                : getFormattedValue(cellElement.data.expense);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.expense == null
              ? ""
              : getFormattedValue(cellElement.data.expense);
          }
        },
      },
      {
        dataField: "income",
        caption: t("income"),
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
              cellElement.data?.income == null
                ? ""
                : getFormattedValue(cellElement.data.income);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.income == null
              ? ""
              : getFormattedValue(cellElement.data.income);
          }
        },
      },
      {
        dataField: "accountsPayable",
        caption: t("ac_payable"),
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
              cellElement.data?.accountsPayable == null
                ? ""
                : getFormattedValue(cellElement.data.accountsPayable);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.accountsPayable == null
              ? ""
              : getFormattedValue(cellElement.data.accountsPayable);
          }
        },
      },
      {
        dataField: "accountsReceivable",
        caption: t("ac_receivable"),
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
              cellElement.data?.accountsReceivable == null
                ? ""
                : getFormattedValue(cellElement.data.accountsReceivable);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.accountsReceivable == null
              ? ""
              : getFormattedValue(cellElement.data.accountsReceivable);
          }
        },
      },
      {
        dataField: "intMonth",
        caption: t("intMonth"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        visible: false,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "branchID",
        caption: t("branchID"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        visible: false,
        width: 100,
      },
    ];
    return (
      baseColumns
        // .filter((column) => {
        //   return true;
        // })
        .map((column) => {
          if (column.dataField == "branch") {
            return {
              ...column,
              visible: userSession.userTypeCode == "CA" ? true : false,
            };
          }
          return column;
        })
    );
  }, [t, userSession.userTypeCode]);
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
      return getFormattedValue(value, false, 2) || "0";
    };
  }, [getFormattedValue]);
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "month",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "sales",
      summaryType: "custom",
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
            2
          ) || "0"
        );
      },
      cellSummaryAction:(value: number) => {
          return value.toFixed(2);
        },
    },
    {
      column: "purchase",
      summaryType: "custom",
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
            2
          ) || "0"
        );
      },
    },
    {
      column: "expense",
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
            2
          ) || "0"
        );
      },
    },
    {
      column: "income",
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
            2
          ) || "0"
        );
      },
    },
    {
      column: "accountsPayable",
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
            2
          ) || "0"
        );
      },
    },
    {
      column: "accountsReceivable",
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
            2
          ) || "0"
        );
      },
    },
  ];

 


  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                filterText={`Report As On ${
                  userSession.userTypeCode != "CA"
                    ? moment(userSession.finTo).local().format("DD/MMM/YYYY")
                    : moment(clientSession.softwareDate, "DD/MM/YYYY")
                        .local()
                        .format("DD/MMM/YYYY")
                }`}
                //  "
                //       // {userSession.userTypeCode == 'CA' && [userSession.finTo]}
                //       // {userSession.userTypeCode != 'CA' && [clientSession.softwareDate]}
                columns={columns}
                moreOption={false}
                gridHeader={t("transaction_analysis")}
                // dataUrl={Urls.transaction_analysis}
                                data={[
                  {
                    "branch": null,
                    "year": 2021,
                    "month": "January",
                    "sales": 12.3456,
                    "purchase": 14187403.7824,
                    "expense": 14875159.0154,
                    "income": 14867712.1195,
                    "accountsPayable": 578490.73,
                    "accountsReceivable": 522435.767,
                    "intMonth": 1,
                    "branchID": 1
                  },
                  {
                    "branch": null,
                    "year": 2021,
                    "month": "February",
                    "sales": 7.89123,
                    "purchase": 11900940.3618,
                    "expense": 12557650.0338,
                    "income": 12809228.7,
                    "accountsPayable": 30212.27,
                    "accountsReceivable": 20331.01,
                    "intMonth": 2,
                    "branchID": 1
                  },
                  {
                    "branch": null,
                    "year": 2021,
                    "month": "March",
                    "sales": 45.6789,
                    "purchase": 14324396.6502,
                    "expense": 14822318.0202,
                    "income": 16014681.933,
                    "accountsPayable": 324441.85,
                    "accountsReceivable": 794062.95,
                    "intMonth": 3,
                    "branchID": 1
                  },
                  {
                    "branch": null,
                    "year": 2021,
                    "month": "March",
                    "sales": 3.45678,
                    "purchase": 14324396.6502,
                    "expense": 14822318.0202,
                    "income": 16014681.933,
                    "accountsPayable": 324441.85,
                    "accountsReceivable": 794062.95,
                    "intMonth": 3,
                    "branchID": 1
                  },
                ]}
                hideGridAddButton={true}
                // handleCalculateSummary={handleCalculateSummary}
                enablefilter={false}
                method={ActionType.GET}
                reload={true}
                gridId="grd_transaction_analysis"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TransactionAnalysis;
