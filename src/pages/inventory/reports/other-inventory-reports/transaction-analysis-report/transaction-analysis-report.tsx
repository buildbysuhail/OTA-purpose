import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig, } from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import moment from "moment";
import { erpParseFloat, isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";

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
        caption: t("acc_payable"),
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
        caption: t("acc_receivable"),
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
        caption: t("int_month"),
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
        caption: t("branch_id"),
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
  // const customizeSummaryRow = useMemo(() => {
  //   return (itemInfo: { value: any }) => {
  //     const value = itemInfo.value;
  //     if (
  //       value === null ||
  //       value === undefined ||
  //       value === "" ||
  //       isNaN(value)
  //     ) {
  //       return "0";
  //     }
  //     return getFormattedValue(value, false, 2) || "0";
  //   };
  // }, [getFormattedValue]);
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
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
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
      // cellSummaryAction(value: any) {
      //      getFormattedValue(value);
      // },
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "expense",
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
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "income",
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
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "accountsPayable",
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
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
    {
      column: "accountsReceivable",
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
      cellSummaryAction: (value: number) => {
        return erpParseFloat(getFormattedValue(value));
      },
    },
  ];

  const handleCalculateSummary = (options: any) => {
    // if (options.name === "sales") {
    switch (options.summaryProcess) {
      case "start":
        options.totalValue = 0;
        break;

      case "calculate":
        if (options.value != null) {
          const roundedSaleAmount = parseFloat(getFormattedValue(isNullOrUndefinedOrEmpty(options.value) ? 0 : options.value) || "0")
          options.totalValue += roundedSaleAmount;
        }
        break;

      case "finalize":
        options.totalValue = Number(options.totalValue);
        // console.log(options.totalValue, "TOTAL");
        break;
    }
    // }
  };

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
                filterText={`${t('report_as_on')} ${userSession.userTypeCode != "CA"
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
                dataUrl={Urls.transaction_analysis}
                hideGridAddButton={true}
                handleCalculateSummary={handleCalculateSummary}
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
