import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import PrintDetailsFilter, { PrintDetailsFilterInitialState } from "./print-details-filter";

interface PrintDetails {
  partyName: string;
  voucherNumber: string;
  voucherType: string;
  voucherForm: string;
  grandTotal: number;
  userName: string;
  systemName: string;
  printTime: Date;
}

const PrintDetails = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "voucherForm",
      caption: t("voucher_form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "userName",
      caption: t("user_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "systemName",
      caption: t("system_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    },
    {
      dataField: "printTime",
      caption: t("print_time"),
      dataType: "datetime",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: true,
      showInPdf: true,
    }
  ];
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("print_details_report")}
                dataUrl={Urls.print_details}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<PrintDetailsFilter />}
                filterWidth={500}
                filterHeight={220}
                filterInitialData={PrintDetailsFilterInitialState}
                reload={true}
                gridId="grd_print_details"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default PrintDetails;