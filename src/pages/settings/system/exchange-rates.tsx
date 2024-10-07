import { Fragment, useState } from "react";
import Urls from "../../../redux/urls";

import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleCurrencyExchangePopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { CurrencyExchangeManage } from "./exchange-rates-manage";
import { useTranslation } from "react-i18next";

const ExchangeRates = () => {
  const {t}=useTranslation()
  const initialUserTypeData = {
    data: { baseCurrency: 0 },
    validations: { baseCurrency: "" },
  };
  const [postData, setPostData] = useState(initialUserTypeData);
  const [postDataLoading, setPostDataLoading] = useState(false)
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "exchRateID",
      caption: t("SiNo"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "toCurrency",
      caption: t("to_currency"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      allowEditing: true
    },
    {
      dataField: "rate",
      caption: t("rate"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
      allowEditing: true
    },
    {
      dataField: "rateDate",
      caption: t("rate_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "cStatus",
      caption: t("active"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
  ];
  const handleLoad = async() => {

  }
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader="Currency  Exchange"
                  dataUrl={Urls.currencyExchange}
                  gridId="grd_currency-exchange"
                  popupAction={toggleCurrencyExchangePopup}
                  hideGridAddButton={true}
                  hideDefaultExportButton={true}
                  hideGridHeader={true}
                  hideDefaultSearchPanel={true}
                  allowExport={false}
                  allowEditing={true}
                  className="w-[300px] mb-[13px]"
                  customToolbarItems={[
                    { item:  <ERPDataCombobox
                      className="w-[250px]"
                      id="baseCurrency"
                      field={{
                        id: "baseCurrency",
                        required: true,
                        getListUrl: Urls. data_base_currency,
                        valueKey: "currencyID",
                        labelKey: "currencyName",
                      }}
                      onChangeData={(data: any) => {
                        setPostData((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                      validation={postData.validations.baseCurrency} // If validation is needed
                      data={postData?.data}
                      defaultData={postData?.data}
                      value={postData?.data.baseCurrency}
                      label={t("base_currency")}
    
                    />, location: 'before' }, // Add this item before
                    { item:  <ERPButton
                      type="button"
                      disabled={postDataLoading}
                      variant="primary"
                        onClick={handleLoad}
                      loading={postDataLoading}
                      title={t("load")}
                    ></ERPButton>, location: 'before' } // Add this item after
                  ]}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.currencyExchange.isOpen||false}
        title={t("currencies")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCurrencyExchangePopup({ isOpen: false }));
        }}
        content={<CurrencyExchangeManage />}
      />
    </Fragment>
  );
};

export default ExchangeRates;
