import { Fragment, useCallback, useEffect, useState } from "react";
import { DataGrid, RemoteOperations } from "devextreme-react/data-grid";
import {
  Column,
  FilterRow,
  Paging,
  Scrolling,
  SearchPanel,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";

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
  const navigate = useNavigate();

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 200;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const { t } = useTranslation();
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      if ((postData.groupId && postData.groupId) || (postData.ledgerId && postData.ledgerId > 0)) {
        if (postData.groupId && postData.groupId > 0) {
          const response: any = await api.post(`${Urls.hide_Ledger}`, {
            isGroup: true,
            ledgerGroupId: postData.groupId,
            userTypeCode: postData.userTypeCode,
          });
          handleResponse(response);

        }
        if (postData.ledgerId && postData.ledgerId > 0) {
          const response: any = await api.post(
            `${Urls.hide_Ledger}`,
            {
              isGroup: false,
              ledgerGroupId: postData.ledgerId,
              userTypeCode: postData.userTypeCode,
            }
          );
          handleResponse(response);
        }
        initialLoadGrid(postData.userTypeCode)
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
        value={postData?.userTypeCode}
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
        value={postData?.groupId}
        label={t("account_group")}
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
        value={postData?.ledgerId}
        label={t("ledger")}
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
                  caption="Is Group"
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
                    <ERPButton
                      title={t("add")}
                      variant="primary"
                      disabled={isSaving}
                      loading={isSaving}
                      type="button"
                      onClick={handleSubmit}
                    />
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
