import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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
import { DataGrid } from "devextreme-react";
import {
  Toolbar,
  Item,
  Editing,
  Column,
  Lookup,
  Scrolling,
  RemoteOperations,
  Paging,
  KeyboardNavigation,
  DataGridTypes,
} from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../../helpers/api-client";
import CustomStore from "devextreme/data/custom_store";
import "./exchange-rates.css";
import { handleResponse } from "../../../utilities/HandleResponse";
import { CheckBoxTypes } from "devextreme-react/cjs/check-box";
import { SelectBoxTypes } from "devextreme-react/cjs/select-box";
const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();

const ExchangeRates = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [postData, setPostData] = useState<{ baseCurrency: number }>({
    baseCurrency: 0,
  });
  const [store, setStore] = useState<any>([]);
  const [currencies, setCurrencies] = useState<any>([]);
  const [postDataLoading, setPostDataLoading] = useState(false);
  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }
  const loadCurrencies = useCallback(async () => {
    const result: any = await api.getAsync(`${Urls.data_currencies}`);
    setCurrencies(result);
  }, []);
  const load = async (baseCurrency?: number) => {
    const result: any = await api.getAsync(
      `${Urls.currencyExchange}${baseCurrency ? baseCurrency : "0"}`
    );
    debugger;
    updateStore(result?.data);
  };
  const updateStore = (inputData: any) => {
    let data = inputData;
    const length = data?.length ?? 0;
    if (length < 30) {
      const remain = 30 - length;
      for (let index = 0; index < remain; index++) {
        data.push({
          cStatus: false,
          exchRateID: 0,
          rate: null,
          rateDate: null,
          toCurrency: null,
        });
      }
    }
    setStore(data);
  };
  const handleSubmit = async () => {
    setPostDataLoading(true);
    debugger;
    const dataToSubmit = store.filter(
      (row: any) => row.toCurrency !== null && row.rate !== null
    );

    debugger;
    const result: any = await api.post(`${Urls.currencyExchange}`, {
      currencyId: postData.baseCurrency,

      data: dataToSubmit,
    });

    setStore(result?.data);
    setPostDataLoading(false);
  };
  useEffect(() => {
    try {
      load();
      loadCurrencies();
    } catch (error) {
      setStore([]);
    }
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - 400; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  const handleDelete = async (id: any, rowIndex: number) => {
    if (id === 0 || id === null) {
      // If exchRateID is null or 0, remove the row from the store
      const newStore = [...store];
      newStore.splice(rowIndex, 1);
      setStore(newStore);
    } else {
      // If exchRateID exists, proceed with API call for deletion

      try {
        const Delete: any = await api.delete(`${Urls.currencyExchange}${id}`);
        handleResponse(Delete);
        // Reload the data after deletion
        load(postData.baseCurrency);
      } catch (error) {
        console.error("Error deleting the currency exchange:", error);
      }
    }
  };
  const ChartCell = (cellData: any) => {
    debugger;
    return (
      <div className="chart-cell">
        <i
          className="ri-delete-bin-5-line delete-icon cursor-pointer"
          onClick={() =>
            handleDelete(cellData.data.exchRateID, cellData.rowIndex)
          }
        ></i>
      </div>
    );
  };
  
  const [enterKeyAction, setEnterKeyAction] =
    useState<DataGridTypes.EnterKeyAction>("startEdit");
  const [enterKeyDirection, setEnterKeyDirection] =
    useState<DataGridTypes.EnterKeyDirection>("row");

  const enterKeyActionChanged = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      setEnterKeyAction(e.value);
    },
    []
  );

  const enterKeyDirectionChanged = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      setEnterKeyDirection(e.value);
    },
    []
  );

  const onFocusedCellChanging = (e: { isHighlighted: boolean; }) => {
    e.isHighlighted = true;
  };
  
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <DataGrid
                  dataSource={store}
                  height={gridHeight.windows}
                  key="exchRateID"
                  showBorders={true}
                  showRowLines={true}
                  onRowUpdating={(e) => {
                    // Check if 'rate' is being updated
                    if (e.newData.rate !== undefined) {
                      // Set 'rateDate' to current date and 'cStatus' to 'true'
                      e.newData.rateDate = new Date(); 
                      e.newData.cStatus = "true"; 
                    }
                  }}
                  onFocusedCellChanging={onFocusedCellChanging}
                >
                  <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"startEdit"}
                    enterKeyDirection={"row"}
                  />
                  <Paging pageSize={100}></Paging>
                  <Scrolling mode="standard" />
                  <RemoteOperations
                    filtering={false}
                    sorting={false}
                    paging={false}
                  ></RemoteOperations>
                  <Column
                    dataField="exchRateID"
                    caption={t("SiNo")}
                    dataType="number"
                    allowSorting={true}
                    allowSearch={true}
                    allowEditing={false}
                    allowFiltering={true}
                    minWidth={150}
                  />
                  <Column
                    dataField="toCurrency"
                    caption={t("to_currency")}
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={150}
                    allowEditing={true}
                  >
                    <Lookup
                      dataSource={currencies}
                      valueExpr="name"
                      displayExpr="name"
                    />
                  </Column>
                  <Column
                    dataField="rate"
                    caption={t("rate")}
                    dataType="number"
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={150}
                    allowEditing={true}
                  />
                  <Column
                    dataField="rateDate"
                    caption={t("rate_date")}
                    dataType="date"
                    allowEditing={true}
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="cStatus"
                    caption={t("active")}
                    dataType="string"
                    allowEditing={true}
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={150}
                  />
                  <Column 
                    allowEditing={false} caption="Action" width={80} cellRender={ChartCell} />
                  <Editing
                    allowUpdating={true}
                    allowAdding={false}
                    allowDeleting={false}
                    mode="cell" 
                  />
                  <Toolbar>
                    <Item location="before" cssClass="mb-4">
                      <ERPDataCombobox
                        className="w-[300px] mb-[13px]"
                        id="baseCurrency"
                        field={{
                          id: "baseCurrency",
                          required: true,
                          getListUrl: Urls.data_base_currency,
                          valueKey: "currencyID",
                          labelKey: "currencyName",
                        }}
                        onChangeData={(data: any) => {
                          setPostData((prev: any) => ({
                            ...prev,
                            baseCurrency: data.baseCurrency,
                          }));
                          load(data?.baseCurrency);
                        }}
                        data={postData}
                        defaultData={postData}
                        value={postData?.baseCurrency}
                        label={t("base_currency")}
                      />
                    </Item>
                    {/* <Item location="before">
                      <ERPButton
                        type="button"
                        disabled={postDataLoading}
                        variant="primary"
                        onClick={handleLoad}
                        loading={postDataLoading}
                        title={t("load")}
                      ></ERPButton>
                    </Item> */}
                  </Toolbar>
                </DataGrid>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <ERPButton
                  className="justify-self-end"
                  type="button"
                  disabled={postDataLoading}
                  variant="primary"
                  onClick={handleSubmit}
                  loading={postDataLoading}
                  title={t("save")}
                ></ERPButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        closeButton="Button"
        isOpen={rootState.PopupData.currencyExchange.isOpen || false}
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
