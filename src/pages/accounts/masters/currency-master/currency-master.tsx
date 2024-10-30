import React, { Fragment, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCurrencyMasterPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { PartyCategoryManage } from "./currency-master-manage";


const CurrencyMaster = () => {
  const MemoizedCurrencyMasterManage = useMemo(() => React.memo(PartyCategoryManage), []);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "currencyid",
    //   caption: "Currency ID", 
    //   dataType: "number",
    //   allowSorting: true,
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    // },
    {
      dataField: "currencyCode",
      caption: t("currency_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "currencyName",
      caption: t("currency_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "currencySymbol",
      caption: t("currency_symbol"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "subUnit",
      caption: t("sub_unit"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "subUnitSymbol",
      caption: t("sub_unit_symbol"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "countryName",
      caption: t("country_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "countryId",
      caption: t("country_ID"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleCurrencyMasterPopup({ isOpen: true, key: cellElement?.data?.currencyId }) }}
          edit={{ type: "popup", action: () => toggleCurrencyMasterPopup({ isOpen: true, key: cellElement?.data?.currencyId }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.account_currency_master, key: cellElement?.data?.currencyId
          }}
        />
      ),
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
                  gridHeader={t("currency_master")}
                  dataUrl={Urls.account_currency_master}
                  gridId="grd_currency_master"
                  popupAction={toggleCurrencyMasterPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.currencyMaster?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.currencyMaster.isOpen || false}
        title={t("currency")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null }));
        }}
        content={<MemoizedCurrencyMasterManage />}
      />
    </Fragment>
  );
};

export default React.memo(CurrencyMaster);

