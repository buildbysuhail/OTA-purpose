import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import FOCRegisterReportFilter, { FOCRegisterReportFilterInitialState } from "./foc-register-report-filter";
import GridId from "../../../../redux/gridId";

interface FOCRegisterReportInterface {
  masterID: number;
  date: string;
  vchNo: number;
  form: string;
  party: string;
  address1: string;
  address2: string;
  detailID: number;
  unitPrice: number;
  batchNo: string;
  productCode: string;
  product: string;
  productGroup: string;
  brand: string;
  categoryCode: string;
  category: string;
  quantity: number;
  free: number;
  unitCode: string;
  netAmount: number;
  freeValue: number;
  cost: number;
  freeCost: number;
  totalProfit: number;
  mrp: number;
  specification: string;
  counterName: string;
  routeName: string;
}

const FOCRegisterReport = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "masterID",
      caption: t("master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "vchNo",
      caption: t("vch_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "detailID",
      caption: t("detail_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "batchNo",
      caption: t("batch_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "productGroup",
      caption: t("product_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "categoryCode",
      caption: t("category_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "free",
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 60,
    },
    {
      dataField: "unitCode",
      caption: t("unit_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "unitPrice",
      caption: t("unit_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "netAmount",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "freeValue",
      caption: t("free_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "freeCost",
      caption: t("free_cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "totalProfit",
      caption: t("total_profit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "specification",
      caption: t("specification"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "counterName",
      caption: t("counter_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
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
    // Add summary items if needed
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
                gridHeader={t("foc_register_report")}
                dataUrl={Urls.foc_register_report}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<FOCRegisterReportFilter />}
                filterWidth={700}
                filterHeight={400}
                filterInitialData={FOCRegisterReportFilterInitialState}
                reload={true}
                gridId={GridId.foc_register_report}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default FOCRegisterReport;
