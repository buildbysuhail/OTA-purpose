import { Fragment, useState } from "react";
import PriceListReportFilter, { PriceListReportFilterInitialState } from "./price-list-report-filter";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";

interface CashSummary {
  from: Date
}

const PriceList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "code",
      caption: t('code'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 100,
    },
    {
      dataField: "name",
      caption: t("name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
    },
    {
      dataField: "group",
      caption: t("group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "groupCode",
      caption: t("groupCode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "brandNO",
      caption: t("brandNO"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "taxCategory",
      caption: t("taxCategory"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "sVAT",
      caption: t("sVAT"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "pVAT",
      caption: t("pVAT"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 150,
    },
    {
      dataField: "stdSprice",
      caption: t("stdSprice"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 150,
    },
    {
      dataField: "stdPprice",
      caption: t("stdPprice"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 150,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 150,
    },
    // {
    //   dataField: "actions",
    //   caption: t("actions"),
    //   allowSearch: false,
    //   allowFiltering: false,
    //   fixed: true,
    //   fixedPosition: "right",
    //   width: 180,
    //   cellRender: (cellElement: any, cellInfo: any) => (
    //     <ERPGridActions
    //       view={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       edit={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       delete={{
    //         confirmationRequired: true,
    //         confirmationMessage: "Are you sure you want to delete this item?",
    //         // action: () => handleDelete(cellInfo?.data?.id),
    //       }}
    //     />
    //   ),
    // },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("ledger_report")}
                  dataUrl={Urls.inv_reports_price_list}
                  hideGridAddButton={true}
                  enablefilter={true}
                  filterWidth={600}
                  filterHeight={250}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<PriceListReportFilter />}
                  filterInitialData={PriceListReportFilterInitialState}
                  reload={true}
                  gridId="grd_cost_centre"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PriceList;