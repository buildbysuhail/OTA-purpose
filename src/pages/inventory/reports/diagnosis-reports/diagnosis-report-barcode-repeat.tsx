import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useLocation } from "react-router-dom";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
interface DiagnosisBarcodeRepeatProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const DiagnosisReportBarcodeRepeat: FC<DiagnosisBarcodeRepeatProps> = ({ gridHeader, dataUrl, gridId, }) => {
  const { t } = useTranslation("accountsReport");
  const location = useLocation();
  const [key, setKey] = useState(1);
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "barcode",
        caption: t("barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "productBarcode",
        caption: t("product_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "productBarcodeProduct",
        caption: t("product_barcode_product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "multiUnitsBarcode",
        caption: t("multi_units_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "multiUnitProduct",
        caption: t("multi_unit_product"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "mannualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
    ];
    // Filter columns based on the `visible` property
    return baseColumns.filter((column) => {
      if (column.dataField == "multiUnitsBarcode" || column.dataField == "multiUnitProduct") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_of_barcode_repeat_multi_units"
          )
        );
      }

      if (column.dataField == "productBarcode" || column.dataField == "productBarcodeProduct") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_of_barcode_repeat_multi_barcodes"
          )
        );
      }

      if (column.dataField == "mannualBarcode") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_of_barcode_repeat_multi_units"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_of_barcode_repeat_multi_barcodes"
          )
        );
      }
      return true;
    });
  }, [t, key]);

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
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                method={ActionType.POST}
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

export default DiagnosisReportBarcodeRepeat;
