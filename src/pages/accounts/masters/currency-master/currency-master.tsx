import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import {toggleCurrencyMasterPopup} from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { PartyCategoryManage } from "./currency-master-manage";


const  CurrencyMaster = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
        dataField: "currencyId",
        caption: "Currency ID", 
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "currencyCode",
        caption: "Currency Code", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "currencyName",
        caption: "Currency Name", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "currencySymbol",
        caption: "Currency Symbol", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "subUnit",
        caption: "Sub Unit", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "subUnitSymbol",
        caption: "Sub Unit Symbol", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "countryId",
        caption: "Country ID", 
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "countryName",
        caption: "Country Name", 
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
    },
    {
      dataField: "actions",
      caption: "Actions",
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleCurrencyMasterPopup({ isOpen: true, key: cellElement?.data?.countryId }) }}
          edit={{ type: "popup", action: () => toggleCurrencyMasterPopup({ isOpen: true, key: cellElement?.data?.countryId }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url:Urls?.account_currency_master,key: cellElement?.data?.countryId
          }}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader="Currency Master"
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
        content={<PartyCategoryManage/>}
      />
    </Fragment>
  );
};

export default CurrencyMaster
