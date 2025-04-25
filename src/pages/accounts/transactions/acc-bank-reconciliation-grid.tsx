import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import React from "react";
import { modelToBase64Unicode } from "../../../utilities/jsonConverter";

type BankReconciliationGridProps = {
  data: any[];
  onRowUpdating: (e: any) => void;
  dateChangeStateRef: React.MutableRefObject<string>;
};

const BankReconciliationGrid = forwardRef(({ data }: any, ref) => {
  const { t } = useTranslation();
  const { getFormattedValue } = useNumberFormat();
  const dataGridRef = useRef<any>(null);

  // Expose the instance() method via the ref
  useImperativeHandle(ref, () => ({
    instance: () => dataGridRef.current?.instance?.(),
  }));

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "selected",
        caption: "",
        dataType: "boolean",
        allowEditing: true,
        width: 100,
        visible: true,
      },
      {
        dataField: "id",
        caption: t("slNo"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowEditing: true,
        allowFiltering: true,
        width: 30,
        visible: true,
        cellRender: (cellInfo: any) => (
          <span>{cellInfo.data.isSummary ? "" : cellInfo.data.id}</span>
        ),
      },
      {
        dataField: "transactionDate",
        caption: t("date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      {
        dataField: "voucherNumber",
        caption: t("v_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherType",
        caption: t("v_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "particulars",
        caption: t("particulars"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span className={cellInfo.data.isSummary ? "text-red font-bold" : ""}>
            {cellInfo.data.particulars}
          </span>
        ),
      },
      {
        dataField: "bankDate",
        caption: t("bank_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        allowEditing: true,
        format: "dd/MM/yyyy",
      },
      {
        dataField: "debit",
        caption: t("debit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span className={cellInfo.data.isSummary ? "text-red font-bold text-right" : "text-right"}>
            {getFormattedValue(cellInfo.data.debit, !cellInfo.data.isSummary, 4)}
          </span>
        ),
      },
      {
        dataField: "credit",
        caption: t("credit"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        cellRender: (cellInfo: any) => (
          <span className={cellInfo.data.isSummary ? "text-red font-bold text-right" : "text-right"}>
            {getFormattedValue(cellInfo.data.credit, !cellInfo.data.isSummary, 4)}
          </span>
        ),
      },
      {
        dataField: "narration",
        caption: t("narration"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "voucherPrefix",
        caption: t("v_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "referenceNumber",
        caption: t("ref_num"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "referenceDate",
        caption: t("refer_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      {
        dataField: "chequeNumber",
        caption: t("cheque_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "checkStatus",
        caption: t("status"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "chequeDate",
        caption: t("cheque_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        format: "dd/MMM/yyyy",
      },
      {
        dataField: "clicked",
        caption: "",
        dataType: "string",
        allowEditing: false,
        width: 100,
        visible: true,
        cellRender: (cellInfo: any) => {
          if (
            !cellInfo.data.isSummary &&
            (cellInfo.data.checkStatus !== "p" &&
              cellInfo.data.checkStatus !== "P") || cellInfo.data.clicked
          ) {
            return (
              <input
                type="checkbox"
                checked={cellInfo.data.clicked}
                onChange={() => {
                  const gridInstance = dataGridRef.current?.instance();
                  if (gridInstance) {
                    const dataSource = gridInstance.getDataSource();
                    const store = dataSource.store();
                    let bankDate = cellInfo.data.bankDate;
                    if (!cellInfo.data.clicked && !bankDate) {
                      // bankDate =
                      //   dateChangeStateRef.current === "today"
                      //     ? moment().format("DD/MM/YYYY")
                      //     : cellInfo.data.chequeDate;
                    }
                    store
                      .update(cellInfo.data.id, {
                        clicked: !cellInfo.data.clicked,
                        bankDate,
                      })
                      .then(() => dataSource.reload());
                  }
                }}
              />
            );
          }
          return null;
        },
      },
    ],
    [t, getFormattedValue]
  );

  return (
    <ErpDevGrid
      showTotalCount={false}
      // onRowUpdating={onRowUpdating}
      ref={dataGridRef}
      gridHeader=" "
      scrollingMode="virtual"
      columns={columns}
      gridId="grid_bank_reconciliation"
      hideGridAddButton={true}
      hideDefaultExportButton={false}
      showPrintButton={true}
      heightToAdjustOnWindows={300}
      data={data}
      keyExpr="id"
      keyboardNavigation={{
        editOnKeyPress: true,
        enterKeyAction: "startEdit",
        enterKeyDirection: "column",
      }}
      allowEditing={{
        allow: true,
        config: {
          add: false,
          edit: true,
          delete: false,
        },
      }}
      remoteOperations={{
        filtering: false,
        paging: false,
        sorting: false,
      }}
      editMode="cell"
      pageSize={40}
      loadPanelEnabled={false}
    />
  );
});
function areEqual(prevProps: any, nextProps: any) {
  try {
    const _prevProps = prevProps.data == undefined ? "" : modelToBase64UnicodeWithoutCircular(prevProps.data);
    const _nextProps = nextProps.data == undefined ? "" : modelToBase64UnicodeWithoutCircular(nextProps.data);
    return _prevProps === _nextProps;
  } catch (error) {
    console.error("Error comparing props:", error);
    return false;
  }
}
export default React.memo(BankReconciliationGrid);
function modelToBase64UnicodeWithoutCircular(data: any) {
  throw new Error("Function not implemented.");
}

