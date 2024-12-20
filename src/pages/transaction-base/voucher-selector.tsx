import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../components/types/dev-grid-column";
import ErpDevGrid from "../../components/ERPComponents/erp-dev-grid";
import Urls from "../../redux/urls";
import { ActionType } from "../../redux/types";
import { toggleCostCentrePopup } from "../../redux/slices/popup-reducer";

interface VoucherSelectorProps {
  voucherType: string;      
}
const VoucherSelector: React.FC<VoucherSelectorProps> = ({ voucherType }) => {
  const { t } = useTranslation();
  const columns: DevGridColumn[] = [
    {
      dataField: "formType",
      caption: t('form_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "lastPrefix",
      caption: t("last_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "lastVNo",
      caption: t('last_vNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "isDefault",
      caption: t("is_default"),
      dataType: "boolean",
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
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("account_payable_aging_report")}
                  dataUrl= {`${Urls.voucher_selector}${voucherType}`}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  remoteOperations={{paging: false,filtering: false,  sorting: false}}
                  hideGridAddButton={true}
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

export default VoucherSelector;