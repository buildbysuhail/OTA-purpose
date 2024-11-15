import {
  Fragment,
  useEffect,
  useState,
} from "react";
import Urls from "../../../../../../redux/urls";
import ERPRadio from "../../../../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import { DataGrid, LoadPanel, Toolbar } from "devextreme-react";
import {
  Column,
  ColumnFixing,
  FilterRow,
  Paging,
  Scrolling,
  SearchPanel,
} from "devextreme-react/cjs/tree-list";
import { APIClient } from "../../../../../../helpers/api-client";
import { handleResponse } from "../../../../../../utilities/HandleResponse";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ERPToast from "../../../../../../components/ERPComponents/erp-toast";
import { useNavigate } from "react-router-dom";

interface LedgerInf {
  customer: boolean;
  supplier: boolean;
}

const initialState: LedgerInf = {
  customer: true,
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
  const navigate = useNavigate();
  const handleLoad = async () => {
    setLoading(true);
    
    const partyType = gridType.customer ? "Cust" : "Supp";
    const result: any = await api.get(`${Urls.cust_supp_ledger}?PartyType=${partyType}`);
    setStore(result);
    setStorePrev([...result]);
    setLoading(false);
  };
  const handleCheckboxChange = (rowIndex: number) => {
    setStore((prevStore: any[]) => {
      const updatedStore = [...prevStore];
      updatedStore[rowIndex] = {
        ...updatedStore[rowIndex],
        show: !updatedStore[rowIndex].show, 
      };
      return updatedStore;
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    console.log("Current Store:", store);
    console.log("Previous Store:", storePrev);
    // const changedData = store.filter((item: any, index: number) => {
    //   const prevItem = storePrev[index];
    //   return item.show !== prevItem.show;
    // });

    const payload = store?.filter((x: any) => x.show == true)?.map((item: any) => ({
      ledgerID: item.ledgerID,
      showInCustomers: gridType.customer,
      showInSuppliers: gridType.supplier,
    }));
    console.log("Payload to be submitted:", payload);
    try {
      const response: any = await api.post(
        `${Urls.cust_supp_ledger}`,
        {showInCustomers: gridType.customer,
          showInSuppliers: gridType.supplier,
          custSuppLedgerInputItems: payload}
      );
      handleResponse(response);
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
    setIsSaving(false);
  };
  const handleClose = () => {
    navigate("/settings"); 
  };
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
                  // hoverStateEnabled={true}
                >
                  <FilterRow visible={true} />
                  <SearchPanel visible={false} />
                  <ColumnFixing enabled={true} />
                 
                  <Scrolling mode="virtual"/>
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
                    allowEditing={false}
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
                        id={`show-${cellData.rowIndex}`}
                        checked={cellData.data.show}
                        data={cellData.data}
                        noLabel={true}
                        onChange={() => handleCheckboxChange(cellData.rowIndex)}
                      />
                    )}
                  />

                  <Toolbar></Toolbar>
                </DataGrid>
                <div className="flex justify-end items-center m-3">
                  <ERPButton
                    title="Close"
                    variant="secondary"
                    onClick={handleClose}
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
