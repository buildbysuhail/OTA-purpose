import { Fragment, useCallback, useEffect, useState } from "react";
import { DataGrid, RemoteOperations } from "devextreme-react/data-grid";
import { Column, FilterRow, Paging, Scrolling, SearchPanel, Toolbar, Item, } from "devextreme-react/data-grid";
//   import ERPToast from "../../../../../../components/ERPComponents/erp-toast";
import { useNavigate } from "react-router-dom";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";

interface LedgerInf {
  hideLedgerID: number;
  userTypeCode: string;
  ledgerId: number;
  groupId: number;
  isGroup: boolean;
}

const initialState: LedgerInf = {
  hideLedgerID: 1,
  userTypeCode: "",
  ledgerId: 0,
  groupId: 0,
  isGroup: false,
};
const api = new APIClient();

const HideAccountLedger = () => {
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [postData, setPostData] = useState<LedgerInf>(initialState);
  const [store, setStore] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorLedger, setErrorLedger] = useState("");
  const [errorGroup, setErrorGroup] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 300;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const { t } = useTranslation("masters");
  const handleSubmit = async (isGroup: boolean) => {
    setErrorLedger("");
    setIsSaving(true);
    try {
      if(isGroup)
      {
        if (postData.groupId && postData.groupId > 0) {
          const response: any = await api.post(`${Urls.hide_Ledger}`, {
            isGroup: isGroup,
            ledgerGroupId: postData.groupId,
            userTypeCode: postData.userTypeCode,
          });
          if (response.isOk != true) {
            setErrorGroup(response.messages[0]);
          }
          handleResponse(response);

        }
        else{
          ERPToast.show("Please choose Group", "warning")
        }
      }
      else
      {
        if (postData.ledgerId && postData.ledgerId > 0) {
          const response: any = await api.post(`${Urls.hide_Ledger}`, {
            isGroup: isGroup,
            ledgerGroupId: postData.groupId,
            userTypeCode: postData.userTypeCode,
          });
          if (response.isOk != true) {
            setErrorGroup(response.messages[0]);
          }
          handleResponse(response);

        }
        else{
          ERPToast.show("Please choose Group", "warning")
        }
      }
    } catch (error) { }

    setIsSaving(false);
  };

  const renderToolbarContent = () => (
    <div className="flex flex-col lg:flex-row space-x-3 items-center mb-3">
      <ERPDataCombobox
        //   className="w-[200px]"
        id="userTypeCode"
        field={{
          id: "userTypeCode",
          required: true,
          getListUrl: Urls.data_user_types,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={handleUserTypeChange}
        data={postData}
        defaultData={postData}
        label={t("user_type_code")}
      />
      <ERPDataCombobox
        //   className="w-[200px]"
        id="groupId"
        field={{
          id: "groupId",
          required: true,
          getListUrl: Urls.data_acc_groups,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => {
          setPostData((prev) => ({
            ...prev,
            groupId: data.groupId,
          }));
        }}
        data={postData}
        defaultData={postData}
        label={t("account_group")}
      />
       <ERPButton
                      title={t("add")}
                      variant="primary"
                      disabled={isSaving}
                      loading={isSaving}
                      type="button"
                      onClick={() => handleSubmit(true)}
                    />
      <ERPDataCombobox
        //   className="w-[200px]"
        id="ledgerId"
        field={{
          id: "ledgerId",
          required: true,
          getListUrl: Urls.data_acc_ledgers,
          valueKey: "id",
          labelKey: "name",
        }}
        onChangeData={(data: any) => {
          setPostData((prev) => ({
            ...prev,
            ledgerId: data.ledgerId,
          }));
        }}
        data={postData}
        defaultData={postData}
        label={t("ledger")}
      />
       <ERPButton
                      title={t("add")}
                      variant="primary"
                      disabled={isSaving}
                      loading={isSaving}
                      type="button"
                      onClick={() => handleSubmit(false)}
                    />
    </div>
  );

  const initialLoadGrid = useCallback(async (userTypeCode: string) => {
    debugger;
    if (userTypeCode != undefined && userTypeCode != null && userTypeCode != '') {
      setLoading(true);
      try {
        const response = await api.getAsync(`${Urls.hide_Ledger}${userTypeCode}`);
        setStore(response);
        handleResponse(response);
        console.log("API Response:", response);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleUserTypeChange = useCallback(
    async (data: any) => {
      setPostData((prev) => ({
        ...prev,
        userTypeCode: data.userTypeCode,
      }));
      debugger;
      await initialLoadGrid(data.userTypeCode);
    },
    [initialLoadGrid]
  );

  const handleDelete = async (id: any) => {
    try {
      const Delete: any = await api.delete(`${Urls.hide_Ledger}${id}`);
      handleResponse(Delete);
      initialLoadGrid(postData.userTypeCode);
      // load(postData.baseCurrency);
    } catch (error) {
      console.error("Error deleting the currency exchange:", error);
    }
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {
                <div>
                  {errorGroup && errorGroup != "" &&
                  <div className="bg-[#f78181] text-white border border-[#f54444] px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Holy smokes!</strong>
                  <span className="block sm:inline">{errorGroup}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => {setErrorGroup("")}}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </span>
                </div>
                  }
                </div>
              }
              <DataGrid
                height={gridHeight.windows}
                dataSource={store}
                showBorders={true}
                columnAutoWidth={true}
                showColumnLines={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
                key="hideLedgerId"
              >
                <FilterRow visible={true} />
                <SearchPanel visible={false} />
                <Scrolling mode="standard" />
                <Paging defaultPageSize={100} />
                {/* <RemoteOperations
                    filtering={false}
                    sorting={false}
                    paging={false}
                  ></RemoteOperations> */}

                <Column
                  dataField="hideLedgerID"
                  caption={t("hideLedgerID")}
                  dataType="number"
                  width={120}
                  allowSorting={true}
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  visible={false}
                />
                <Column
                  dataField="ledgerID"
                  caption={t("ledger_id")}
                  dataType="number"
                  width={120}
                  allowSorting={true}
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                  visible={false}
                />
                <Column
                  dataField="particulars"
                  caption={t("particulars")}
                  dataType="string"
                  minWidth={200}
                  allowSorting={true}
                  allowSearch={true}
                  allowEditing={false}
                  allowFiltering={true}
                />
                <Column
                  dataField={t("isGroup")}
                  caption={t("is_group")}
                  dataType="boolean"
                  width={100}
                  cellRender={(cellData) => (
                    <ERPCheckbox
                      id={`show-${cellData.rowIndex}`}
                      checked={cellData.data.isGroup}
                      data={cellData.data}
                      noLabel={true}
                    />
                  )}
                />
                <Column
                  caption={t("actions")}
                  width={80}
                  cellRender={(cellData) => (
                    <div className="chart-cell">
                      <i
                        onClick={() => handleDelete(cellData.data.hideLedgerID)}
                        className="ri-delete-bin-5-line delete-icon cursor-pointer"
                      ></i>
                    </div>
                  )}
                />
                <Toolbar>
                  <Item location="before">{renderToolbarContent()}</Item>
                  <Item location="after">
                   
                  </Item>
                </Toolbar>
              </DataGrid>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HideAccountLedger;
