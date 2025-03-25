import { Fragment, useCallback, useMemo, useState } from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ItemWisePurchaseReturnSummaryFilter, { ItemWisePurchaseReturnSummaryFilterInitialState } from "./itemwise-purchase-return-summary-filter";

interface ItemWisePurchaseReturnSummary {
  siNo: number;
  productCode: string;
  productID: number;
  productName: string;
  groupName: string;
  totQty: number;
  totFree: number;
  unitCode: string;
  totGross: number;
  totDisc: number;
  totNetValue: number;
  totVat: number;
  totNetAmount: number;
  warehouseName: string;
  branchName: string;
  qtyDetails: string;
  groupCategoryName: string;
  sectionName: string;
}

const ItemWisePurchaseReturnSummary = () => {
  const { t } = useTranslation("accountsReport");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(ItemWisePurchaseReturnSummaryFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const onApplyFilter = useCallback((_filter: any) => { setFilter({ ..._filter }); }, []);
  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "totQty",
      caption: t("total_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "totGross",
      caption: t("total_gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "totDisc",
      caption: t("total_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "totNetValue",
      caption: t("total_net_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "totVat",
      caption: t("total_vat"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 85,
    },
    {
      dataField: "totNetAmount",
      caption: t("total_net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 85,
    },
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitCode",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "totFree",
      caption: t("free"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "productCode",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 70,
    },
    {
      dataField: "qtyDetails",
      caption: t("qty_details"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "groupCategoryName",
      caption: t("group_category_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "sectionName",
      caption: t("section_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
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
      column: "totNetValue",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "totNetAmount",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption
                gridHeader={t("item_wise_purchase_return_summary")}
                dataUrl={Urls.item_wise_purchase_return_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<ItemWisePurchaseReturnSummaryFilter />}
                filterHeight={550}
                filterWidth={700}
                filterInitialData={ItemWisePurchaseReturnSummaryFilterInitialState}
                onFilterChanged={(f: any) => setFilter(f)}
                reload={true}
                gridId="grd_item_wise_purchase_return_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ItemWisePurchaseReturnSummary;