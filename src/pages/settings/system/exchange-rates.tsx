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
      dataField: "ExchRateID",
      caption: "SINo",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "ToCurrency",
      caption: "To Currency",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "Rate",
      caption: "Rate",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "RateDate",
      caption: "Rate Date",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "CStatus",
      caption: "Active",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        debugger;
        return (
          <ERPGridActions
            view={{ type: "popup", action:toggleCurrencyExchangePopup}}
            edit={{ type: "popup", action: toggleCurrencyExchangePopup}}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
            itemId={cellElement?.data?.userTypeCode || ""}
          />
        )
      }
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 justify-start items-center gap-4 my-4">
                <div>
                <ERPDataCombobox
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
                  label="Base Currency"

                />
                </div>
                <div className="translate-y-2">
                  <ERPButton
                    type="button"
                    disabled={postDataLoading}
                    variant="primary"
                    //   onClick={handleSubmit}
                    loading={postDataLoading}
                    title={"Load"}
                  ></ERPButton>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {/* <ERPDevGrid
                  columns={columns}
                  gridHeader="Currency  Exchange"
                  dataUrl={Urls.currencyExchange}
                  gridId="grd_currency-exchange"
                  popupAction={toggleCurrencyExchangePopup}
                  // hideGridAddButton={true}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.currencyExchange.isOpen||false}
        title={"Currencies"}
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
