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

const PartySummaryPurchaseReturn: React.FC<PartySummaryFilter> = ({ filter }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] =useState<PartySummaryPurchaseReturn>({from: new Date()});
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
      width: 50,
      showInPdf:true,
    },
    {
      dataField: "ledgerName",
      caption: t('ledger_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf:true,
    },
    {
      dataField: "partyName",
      caption: t('party_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "address1",
      caption: t('address1'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  gridHeader={t("party_summary_purchase_return")}
                  dataUrl={Urls.acc_reports_party_summary_purchase_return}
                  method={ActionType.POST}
                  gridId="grd_party_summary_purchase_return"
                  popupAction={toggleCostCentrePopup}
                  postData={filter}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
};

export default PartySummaryPurchaseReturn;