import React, { Fragment, useCallback, useEffect, useMemo, useState, } from "react";
import Urls from "../../../redux/urls";
import { toggleCurrencyMasterPopup, } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import { Toolbar, Item, Editing, Column, Lookup, Scrolling, RemoteOperations, Paging, KeyboardNavigation, DataGridTypes } from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../../helpers/api-client";
import "./exchange-rates.css";
import { handleResponse } from "../../../utilities/HandleResponse";
import { SelectBoxTypes } from "devextreme-react/cjs/select-box";
import { CurrencyMasterManage } from "../../accounts/masters/currency-master/currency-master-manage";

const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();
interface ExchangeRatesProps {
  isMaximized?: boolean;
  modalHeight?: any
}
const ExchangeRates = ({ modalHeight, isMaximized }: ExchangeRatesProps) => {
  const { t } = useTranslation("system");
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
  const [postData, setPostData] = useState<{ baseCurrency: number }>({ baseCurrency: 0, });
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
    const result: any = await api.getAsync(`${Urls.currencyExchange}${baseCurrency ? baseCurrency : "0"}`);
    updateStore(result?.data);
  };

  const updateStore = (inputData: any) => {
    let data = inputData;
    const length = data?.length ?? 0;
    if (length < 30) {
      const remain = 30 - length;
      for (let index = 0; index < remain; index++) {
        data.push({
          cStatus: null,
          exchRateID: null,
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
    try {
      const dataToSubmit = store.filter(
        (row: any) => row.toCurrency !== null && row.rate !== null
      );
      const result: any = await api.post(`${Urls.currencyExchange}`, {
        currencyId: postData.baseCurrency,
        data: dataToSubmit,
      });
      setStore(result?.data);
      setPostDataLoading(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setPostDataLoading(false);
    }
  };

  useEffect(() => {
    try {
      load();
      loadCurrencies();
    } catch (error) {
      setStore([]);
    }
  }, []);

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 150;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

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
    return (
      <div className="chart-cell">
        <i className="ri-delete-bin-5-line delete-icon cursor-pointer"
          onClick={() => handleDelete(cellData.data.exchRateID, cellData.rowIndex)}>
        </i>
      </div>
    );
  };

  const [enterKeyAction, setEnterKeyAction] = useState<DataGridTypes.EnterKeyAction>("startEdit");
  const [enterKeyDirection, setEnterKeyDirection] = useState<DataGridTypes.EnterKeyDirection>("row");
  const enterKeyActionChanged = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      setEnterKeyAction(e.value);
    }, []
  );

  const enterKeyDirectionChanged = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      setEnterKeyDirection(e.value);
    }, []
  );

  const onFocusedCellChanging = (e: { isHighlighted: boolean }) => {
    e.isHighlighted = true;
  };

  const MemoizedCurrencyMasterManage = useMemo(
    () => React.memo(CurrencyMasterManage),
    []
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-wrap items-center justify-between">
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
                onChangeData={(data: any) => { setPostData((prev: any) => ({ ...prev, baseCurrency: data?.baseCurrency, })); load(data?.baseCurrency); }}
                data={postData}
                defaultData={postData}
                // value={postData?.baseCurrency}
                reload={rootState?.PopupData?.currencyMaster?.reload}
                label={t("base_currency")}
              />
              <a href="#" onClick={(e) => { e.preventDefault(); dispatch(toggleCurrencyMasterPopup({ isOpen: true, key: null })) }}
                className="text-[#27272a] text-sm  font-semibold  hover:underline   hover:decoration-[#3b82f6] sm:mt-2">
                {t("add_currency")}
              </a>
            </div>
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
                  e.newData.cStatus = true;
                }
              }}
              onFocusedCellChanging={onFocusedCellChanging}>
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
              />
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
                allowEditing={true}>
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
                allowEditing={false}
                caption={t("action")}
                width={80}
                cellRender={ChartCell}
              />
              <Editing
                allowUpdating={true}
                allowAdding={false}
                allowDeleting={false}
                mode="cell"
              />
            </DataGrid>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-4">
            <ERPButton
              className="justify-self-end"
              type="button"
              disabled={postDataLoading}
              variant="primary"
              onClick={handleSubmit}
              loading={postDataLoading}
              title={t("save")}
            />
          </div>
        </div>
      </div>

      <ERPModal
        isOpen={rootState.PopupData.currencyMaster.isOpen || false}
        title={t("currency")}
        width={700}
        height={300}
        isForm={true}
        closeModal={() => { dispatch(toggleCurrencyMasterPopup({ isOpen: false, key: null, reload: false })); }}
        content={<MemoizedCurrencyMasterManage />}
      />
    </Fragment>
  );
};

export default ExchangeRates;