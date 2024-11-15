import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Urls from "../../../redux/urls";

import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import {
  toggleCurrencyExchangePopup,
  toggleCurrencyMasterPopup,
} from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
// import { CurrencyExchangeManage } from "./exchange-rates-manage";
import { useTranslation } from "react-i18next";
import { DataGrid, LoadPanel } from "devextreme-react";
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
  FilterRow,
  SearchPanel,
  ColumnFixing,
} from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../../helpers/api-client";
import CustomStore from "devextreme/data/custom_store";
import "./exchange-rates.css";
import { handleResponse } from "../../../utilities/HandleResponse";
import { CheckBoxTypes } from "devextreme-react/cjs/check-box";
import { SelectBoxTypes } from "devextreme-react/cjs/select-box";
import { CurrencyMasterManage } from "../../accounts/masters/currency-master/currency-master-manage";
import { Link } from "react-router-dom";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";

const api = new APIClient();
interface postData {
  pCname: string;
  systemCode: string;
  counterID: number;
}

const CounterSettings = () => {
  const initData = {
    pCname: "",
    systemCode: "",
    counterID: 0,
  };
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [store, setStore] = useState<any>([]);
  const [postData, setPostData] = useState<postData>(initData);
  const [postDataLoading, setPostDataLoading] = useState(false);

  const loadStore = async () => {
    const result: any = await api.getAsync(`${Urls.counter_settings}`);
    setStore(result);
  };

  //   const handleSubmit = async () => {
  //     setPostDataLoading(true);
  //     try {
  //       const dataToSubmit = store.filter(
  //         (row: any) => row.toCurrency !== null && row.rate !== null
  //       );

  //       const result: any = await api.post(`${Urls.currencyExchange}`, {
  //         currencyId: postData.baseCurrency,

  //         data: dataToSubmit,
  //       });

  //       setStore(result?.data);
  //       setPostDataLoading(false);
  //     } catch (error) {
  //       console.error("Error saving settings:", error);
  //     } finally {
  //       setPostDataLoading(false);
  //     }
  //   };
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 300;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
            <div className="flex justify-end items-center mb-5">
                <div className="flex space-x-5 pr-5">
                  <ERPRadio
                    id="customer"
                    name="customer"
                    // data={gridType}
                    // checked={gridType.customer}
                    // onChange={() => {
                    //   setGridType({ customer: true, supplier: false });
                    // }}
                    label="Customer"
                  />
                  <ERPRadio
                    id="supplier"
                    name="supplier"
                    // data={gridType}
                    // checked={gridType.supplier}
                    // onChange={() => {
                    //   setGridType({ customer: false, supplier: true });
                    // }}
                    label="supplier"
                  />
                </div>

                <ERPButton
                  title="Show"
                  variant="primary"
                //   disabled={loading}
                //   loading={loading}
                //   onClick={handleLoad}
                  type="button"
                  startIcon="ri-eye-line"
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <DataGrid
                  height={gridHeight.windows}
                  dataSource={store}
                  className="custom-data-grid"
                  showBorders={true}
                  key="counter_settings"
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  // hoverStateEnabled={true}
                >
                  <FilterRow visible={true} />
                  <SearchPanel visible={false} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="virtual" />
                  <Paging defaultPageSize={100} />
                  {/* <LoadPanel visible='false' /> */}
                  {/* <RemoteOperations
                    filtering={false}
                    sorting={false}
                    paging={false}
                  ></RemoteOperations> */}
                 
                  <Column
                    dataField="pCname"
                    caption="PC Name"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={150}
                    allowEditing={true}
                  />
                  <Column
                    dataField="systemCode"
                    caption="System Code"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    minWidth={150}
                    allowEditing={true}
                  />
                   <Column
                    dataField="counterName"
                    caption="Counter"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    width={150}
                    allowEditing={true}
                  />

                  <Column
                    dataField="lastLoggedDate"
                    caption="Last Logged Date"
                    dataType="date"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    width={150}
                    allowEditing={true}
                  />

                  <Editing
                    allowUpdating={true}
                    allowAdding={false}
                    allowDeleting={false}
                    mode="cell"
                  />
                  {/* <Toolbar>
                    <Item location="before" cssClass="mb-4">
                     <div className="flex justify-start items-center space-x-3 ">
                      <ERPInput
                        id="autoUpdateReleaseUpTo"
                        label={t("auto_update_release_up_to")}
                        type="number"
                        // data={settings}
                        // value={settings.autoUpdateReleaseUpTo}
                        // disabled={!settings.autoChangeTransactionDateByMidnight}
                      
                      />{" "}
                      <ERPInput
                        id="autoUpdateReleaseUpTo"
                        label={t("auto_update_release_up_to")}
                        type="number"
                        // data={settings}
                        // value={settings.autoUpdateReleaseUpTo}
                        // disabled={!settings.autoChangeTransactionDateByMidnight}
                      
                      />
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
                        //   onChangeData={(data: any) => {
                        //     setPostData((prev: any) => ({
                        //       ...prev,
                        //       baseCurrency: data?.baseCurrency,
                        //     }));
                        //     load(data?.baseCurrency);
                        //   }}
                        data={postData}
                        defaultData={postData}
                        //   value={postData?.baseCurrency}
                        //   reload={rootState?.PopupData?.currencyMaster?.reload}
                        label={t("base_currency")}
                      />
                      </div>
                    </Item>
                    <Item location="after">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            toggleCurrencyMasterPopup({
                              isOpen: true,
                              key: null,
                            })
                          );
                        }}
                        className="text-[#27272a] text-sm  font-semibold  hover:underline   hover:decoration-[#3b82f6]"
                      >
                        {t("add_currency")}
                      </a>
                    </Item>
                  </Toolbar> */}
                </DataGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CounterSettings;
