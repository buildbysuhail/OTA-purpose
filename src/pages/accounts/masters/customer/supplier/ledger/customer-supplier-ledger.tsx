import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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
  Item,
  Paging,
  Scrolling,
} from "devextreme-react/cjs/tree-list";
import { APIClient } from "../../../../../../helpers/api-client";

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
  const [postDataLoading, setPostDataLoading] = useState(false);

  const handleSubmit = async () => {
    setPostDataLoading(true);
    debugger;
    const partyType = gridType.customer ? 'Cust' : 'Supp'; 
    const result: any = await api.get(`${Urls.cust_supp_ledger}?PartyType=${partyType}`);
    setStore(result?.data);
    setPostDataLoading(false);
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
                    setGridType({
                      customer: true,
                      supplier: false,
                    });
                  }}
                  label="Customer"
                />
                <ERPRadio
                  id="supplier"
                  name="supplier"
                  data={gridType}
                  checked={gridType.supplier}
                  onChange={() => {
                    setGridType({
                      customer: false,
                      supplier: true,
                    });
                  }}
                  label="supplier"
                />
                </div>
               
                <ERPButton
                  title="Show"
                  variant="primary"
                  //   loading={isSaving}
                  //   disabled={isSaving}
                  onClick={handleSubmit}
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
              
                  
                >
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  
                  <Paging defaultPageSize={100} />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="branchName"
                    caption="  Branch Name"
                    dataType="string"
                    minWidth={200}
                  />
                  <Column
                    minWidth={200}
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="browser"
                    caption={"Browser"}
                    dataType="string"
                  />
                  <Column
                    minWidth={200}
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="ipAddress"
                    caption={"IP Address"}
                    dataType="string"
                  />
                  <Toolbar>
                    <Item location="before" cssClass="mb-4"></Item>
                  </Toolbar>
                </DataGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(CustomerSupplierLedger);
