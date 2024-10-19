import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../../../components/ERPComponents/erp-grid-actions";
import { toggleAccountGroupPopup } from "../../../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../../redux/urls";
import ERPRadio from "../../../../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import { DataGrid, LoadPanel, Toolbar } from "devextreme-react";
import {
  Column,
  ColumnFixing,
  Editing,
  FilterRow,
  Item,
  Paging,
  Scrolling,
  SearchPanel,
} from "devextreme-react/cjs/tree-list";
import { APIClient } from "../../../../../../helpers/api-client";
import { handleResponse } from "../../../../../../utilities/HandleResponse";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";

interface LedgerInf {
  customer: boolean;
  supplier: boolean;
}

const initialState: LedgerInf = {
  customer: false,
  supplier: false,
};
const api = new APIClient();

const CustomerSupplierLedger = () => {
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 260;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const [gridType, setGridType] = useState<LedgerInf>(initialState);
  const [store, setStore] = useState<any>([]);
  const [storePrev, setStorePrev] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    debugger;
    const partyType = gridType.customer ? "Cust" : "Supp";
    const result: any = await api.get(
      `${Urls.cust_supp_ledger}?PartyType=${partyType}`
    );
    setStore(result);
    setStorePrev([...result]);
    setLoading(false);
  };

  const handleCheckboxChange = (rowIndex: number) => {
    console.log("Current1 change Store:", store[rowIndex].show);
    console.log("Previous1 change Store:", storePrev[rowIndex].show);
    setStore((prevStore: any[]) => {
      const updatedStore = [...prevStore];
      updatedStore[rowIndex].show = !updatedStore[rowIndex].show;
      return updatedStore;
    });
    console.log("Current change Store:", store[rowIndex].show);
    console.log("Previous change Store:", storePrev[rowIndex].show);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    console.log("Current Store:", store);
    console.log("Previous Store:", storePrev);
    const changedData = store.filter((item: any, index: number) => {
      const prevItem = storePrev[index];
      return item.show !== prevItem.show;
    });

    const payload = changedData.map((item: any) => ({
      ledgerID: item.ledgerID,
      showInCustomers: gridType.customer ? item.show : false,
      showInSuppliers: gridType.supplier ? item.show : false,
    }));
    console.log("Payload to be submitted:", payload);
    if (payload.length > 0) {
      try {
        const response: any = await api.post(
          `${Urls.cust_supp_ledger}`,
          payload
        );
        handleResponse(response);
        console.log("API Response:", response);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    } else {
      console.log("No changes detected.");
    }
    setIsSaving(false);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="flex justify-around items-center mb-5">
                <div className="flex space-x-5">
                  <ERPRadio
                    id="customer"
                    name="customer"
                    data={gridType}
                    checked={gridType.customer}
                    onChange={() => {
                      setGridType({ customer: true, supplier: false });
                    }}
                    label="Customer"
                  />
                  <ERPRadio
                    id="supplier"
                    name="supplier"
                    data={gridType}
                    checked={gridType.supplier}
                    onChange={() => {
                      setGridType({ customer: false, supplier: true });
                    }}
                    label="supplier"
                  />
                </div>

                <ERPButton
                  title="Show"
                  variant="primary"
                  disabled={loading}
                  loading={loading}
                  onClick={handleLoad}
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
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                >
                  <FilterRow visible={true} />
                  <SearchPanel visible={false} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  <Paging defaultPageSize={100} />
                  <LoadPanel visible={loading} />

                  {/* Ledger Name Column */}
                  <Column
                    allowSearch={true}
                    allowEditing={false}
                    allowFiltering={true}
                    dataField="ledgerName"
                    caption="Name"
                    dataType="string"
                    minWidth={200}
                  />

                  {/* Address Column */}
                  <Column
                    minWidth={200}
                    allowSearch={true}
                    allowEditing={false}
                    allowFiltering={true}
                    dataField="address1"
                    caption="Address"
                    dataType="string"
                  />

                  {/* Show Field (Checkbox for boolean) */}
                  <Column
                    width={200}
                    allowSearch={true}
                    allowEditing={true}
                    allowFiltering={true}
                    dataField="show"
                    caption={
                      gridType.customer
                        ? "Show In Suppliers"
                        : "Show In Customers"
                    }
                    dataType="boolean"
                    cellRender={(cellData) => (
                      <ERPCheckbox
                        id="show"
                        checked={cellData.data.show}
                        data={cellData.data}
                        noLabel={true}
                        onChange={() => handleCheckboxChange(cellData.rowIndex)}
                      />
                    )}
                  />

                  <Toolbar></Toolbar>
                  <Editing mode="cell" allowUpdating={true} />
                </DataGrid>
                <div className="flex justify-end items-center m-3">
                  <ERPButton
                    title="Close"
                    variant="secondary"
                    // disabled={loading}
                    // loading={loading}
                    // onClick={handleLoad}
                    type="button"
                  />
                  <ERPButton
                    title="Save"
                    variant="primary"
                    disabled={isSaving}
                    loading={isSaving}
                    onClick={handleSubmit}
                    type="button"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerSupplierLedger;
