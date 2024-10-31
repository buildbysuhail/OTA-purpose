import { Fragment, useEffect, useState } from "react";
//   import Urls from "../../../../../../redux/urls";
//   import ERPRadio from "../../../../../../components/ERPComponents/erp-radio";
//   import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import { DataGrid } from "devextreme-react/data-grid";
import {
  Column,
  FilterRow,
  Paging,
  Scrolling,
  SearchPanel,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
//   import { APIClient } from "../../../../../../helpers/api-client";
//   import { handleResponse } from "../../../../../../utilities/HandleResponse";
//   import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
//   import ERPToast from "../../../../../../components/ERPComponents/erp-toast";
import { useNavigate } from "react-router-dom";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../helpers/api-client";

import Urls from "../../../../redux/urls";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

//   {
//     "hideLedgerID": 0,
//     "userTypeCode": "string",
//     "ledgerGroupId": 0,
//     "isGroup": true
//   }
interface LedgerInf {
  hideLedgerID: number;
  userTypeCode: string;
  ledgerGroupId: number;
  isGroup: boolean;
}

const initialState: LedgerInf = {
  hideLedgerID: 0,
  userTypeCode: "",
  ledgerGroupId: 0,
  isGroup: false,
};
const api = new APIClient();

const HideAccountLedger = () => {
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200; 
    let gridHeightWindows = wh - 400; 
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  const [postData, setPostDate] = useState<LedgerInf>(initialState);
  const [store, setStore] = useState<any>([]);
  const [storePrev, setStorePrev] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // const handleLoad = async () => {
  //   setLoading(true);
  //   const partyType = gridType.customer ? "Cust" : "Supp";
  //   const result: any = await api.get(`${Urls.cust_supp_ledger}?PartyType=${partyType}`);
  //   setStore(result);
  //   setStorePrev([...result]);
  //   setLoading(false);
  // };

  // const handleCheckboxChange = (rowIndex: number) => {
  //   setStore((prevStore: any[]) => {
  //     const updatedStore = [...prevStore];
  //     updatedStore[rowIndex] = {
  //       ...updatedStore[rowIndex],
  //       show: !updatedStore[rowIndex].show,
  //     };
  //     return updatedStore;
  //   });
  // };

  const handleSubmit = async () => {
    setIsSaving(true);
    const updatedPostData = {
      ...postData,
      isGroup: Boolean(postData.ledgerGroupId && postData.ledgerGroupId > 0),
    };
    try {
      const response: any = await api.post(
        `${Urls.hide_Ledger}`,
        updatedPostData
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

  const ChartCell = (cellData: any) => {
    
    return (
      <div className="chart-cell">
        <i
          className="ri-delete-bin-5-line delete-icon cursor-pointer"
        //   onClick={() =>
        //     handleDelete(cellData.data.exchRateID, cellData.rowIndex)
        //   }
        ></i>
      </div>
    );
  };
  const renderToolbarContent = () => (
    <div className="flex flex-col lg:flex-row space-x-3 items-center mb-3">
      <ERPDataCombobox
        id="userTypeCode"
        field={{
          id: "userTypeCode",
          required: true,
          getListUrl: Urls.data_user_types,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => {
          setPostDate((prev: any) => ({
            ...prev,
            userTypeCode: data.userTypeCode,
          }));
        }}
        data={postData}
        defaultData={postData}
        value={postData?.userTypeCode}
        label="User Type"
      />
      <ERPDataCombobox
        id="ledgerGroupId"
        field={{
          id: "ledgerGroupId",
          required: true,
          getListUrl: Urls.data_acc_groups,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => {
            setPostDate((prev: any) => ({
            ...prev,
            ledgerGroupId: data.ledgerGroupId,
          }));
        }}
        data={postData}
        defaultData={postData}
        value={postData?.ledgerGroupId}
        label="Ledger Group"
      />
      <ERPDataCombobox
        id="hideLedgerID"
        field={{
          id: "hideLedgerID",
          required: true,
          getListUrl: Urls.data_acc_ledgers,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => {
            setPostDate((prev: any) => ({
            ...prev,
            hideLedgerID: data.hideLedgerID,
          }));
        }}
        data={postData}
        defaultData={postData}
        value={postData?.hideLedgerID}
        label="Account Ledger"
      />
    </div>
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
            <DataGrid
                dataSource={store}
                showBorders={true}
                columnAutoWidth={true}
                showColumnLines={false}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
              >
                <FilterRow visible={true} />
                <SearchPanel visible={false} />
                <Scrolling mode="standard" />
                <Paging defaultPageSize={100} />

                <Toolbar>
                  <Item location="before">
                    {renderToolbarContent()}
                  </Item>
                  <Item
                    location="after">
                    <ERPButton
                    title="Add"
                    variant="primary"
                    disabled={isSaving}
                    loading={isSaving}
                    type="button"
                    onClick={handleSubmit}
                  />
                </Item>
                </Toolbar>

                <Column
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  dataField="HideLedgerID "
                  caption="Hide Ledger ID "
                  dataType="number"
                  width={200}
                />

                <Column
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  dataField="LedgerID  "
                  caption="Ledger ID "
                  dataType="number"
                  width={200}
                />

                <Column
                  width={200}
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  dataField="Particulars "
                  caption="Particulars "
                  dataType="string"
                />
                <Column
                  minWidth={200}
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  dataField="IsGroup "
                  caption="IsGroup "
                  dataType="boolean"
                  cellRender={(cellData) => (
                    <ERPCheckbox
                      id={`show-${cellData.rowIndex}`}
                      checked={cellData.data.IsGroup }
                      data={cellData.data}
                      noLabel={true}
                    //   onChange={() => handleCheckboxChange(cellData.rowIndex)}
                    />
                  )}
                />
                 <Column 
                    allowEditing={false} caption="Action" width={80} cellRender={ChartCell} 
                />
               

              </DataGrid>

              {/* <div className="flex justify-end items-center m-3">
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
                  </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HideAccountLedger;
