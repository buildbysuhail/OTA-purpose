import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { getAction, postAction } from "../../redux/app-actions";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import { useLocation } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import { DataGrid } from "devextreme-react";
import {
  Column,
  FilterRow,
  HeaderFilter,
  Paging,
  Scrolling,
  SearchPanel,
} from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";
import WorkspaceSettingsApis from "./workspace-settings-apis";

interface AccountSettingsMembersProps {}

const AccountSettingsMembers: FC<AccountSettingsMembersProps> = (props) => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 180;
    setGridHeight(gridHeight);
    loadDxGrid(); // Load initial data
  }, []);
  let store: any = {};

  let isInitial = true;
  const loadDxGrid = () => {
    debugger;
    store = new CustomStore({
      key: "id",
      async load(loadOptions: { [key: string]: any }) {
        console.log("Load function called", loadOptions);
        debugger;
        try {
          const response =
            await WorkspaceSettingsApis.getAvailableSessionsForDxGrid("");

          const result = response;

          return result !== undefined && result != null
            ? {
                data: result.data,
                totalCount: result.totalCount,
                summary: result.summary,
                groupCount: result.groupCount,
              }
            : {
                data: [],
                totalCount: 0,
                summary: {},
                groupCount: 0,
              };
        } catch (err) {
          throw new Error("Data Loading Error");
        }
      },
    });
  };
  let api = new APIClient();
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();

  const resetPassword = async () => {
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.updatePassword,
        data: { password: password },
      }) as any
    ).unwrap();

    handleResponse(response, () => {
      setPassword("");
    });
  };

  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  return (
    <Fragment>
      
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div
            id="phone-number"
            className={`xxl:col-span-12 xl:col-span-12 ${
              path === "Password" ? "blink" : ""
            } col-span-12`}
          >
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  Sessions{" "}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                  View and manage devices where you're currently logged in
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <DataGrid
                    height={gridHeight}
                    dataSource={
                      "https://localhost:7213/api/Subscription/WorkSpace/GetMembers"
                    }
                    showBorders={true}
                    // remoteOperations={true}
                    showColumnLines={false}
                    showRowLines={true}
                    onRowPrepared={(e) => {
                      if (e.rowType === "data" && e.data.isActive) {
                        e.rowElement.style.backgroundColor = "#90ee90"; // Apply green background for active rows
                      }
                    }}
                  >
                    {/* <Scrolling mode="virtual" rowRenderingMode="virtual" /> */}
                    <Paging defaultPageSize={100} />
                    {/* <FilterRow visible={true} applyFilter="auto" />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} width={240} placeholder={'Search...'} /> */}
                    {/* <Column dataField="branchName" caption={'branchName'} dataType="string" /> */}

                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="displayName"
                      caption={"Name"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="email"
                      caption={"Email"}
                      dataType="string"
                    />
                    <Column dataField="active" caption={'Status'} cellRender={({ data }) => (
                data.active === true ? 
                (<span className="badge bg-default" id="status">Active</span>) : 
                (<span className="badge bg-danger" id="status">Inactive</span>)
              )} 
              dataType="boolean" 
            />
                  </DataGrid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountSettingsMembers;
