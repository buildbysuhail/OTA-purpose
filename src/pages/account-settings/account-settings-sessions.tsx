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
import AccountSettingsApis from "./account-settings-apis";
import Pageheader from "../../components/common/pageheader/pageheader";

interface AccountSettingsProps {}

const AccountSettingsSessions: FC<AccountSettingsProps> = (props) => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 180;
    setGridHeight(gridHeight);
  }, []);

  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }

  let isInitial = true;
  const store = new CustomStore({
    key: "Id",
    async load(loadOptions: any) {
      const paramNames = [
        "skip",
        "take",
        "requireTotalCount",
        "sort",
        "filter",
      ];

      const queryString = paramNames
        .filter((paramName) => isNotEmpty(loadOptions[paramName]))
        .map(
          (paramName) =>
            `${paramName}=${JSON.stringify(loadOptions[paramName])}`
        )
        .join("&");

      try {
        const response = await AccountSettingsApis.getSessions("");

        const result = response;

        return result !== undefined && result != null
          ? {
              data: result,
              totalCount: result.length,
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
                      store
                      // "https://localhost:7213/api/Core/LoginSessions/GetAllAsync"
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
                      dataField="branchName"
                      caption={"BranchName"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="browser"
                      caption={"browser"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="ipAddress"
                      caption={"ipAddress"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="device"
                      caption={"device"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="location"
                      caption={"location"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="latitude"
                      caption={"latitude"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="longitude"
                      caption={"Longitude"}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="recentActivity"
                      caption={"RecentActivity"}
                      dataType="datetime"
                    />
                    {/* <Column allowSearch={true} allowFiltering={true} dataField="IsActive" caption={'isActive'} dataType="boolean" /> */}
                    {/* <Column dataField="isDefault" caption={'Is Default'} cellRender={({ data }) => (
                data.isDefault === true ? 
                (<span className="badge bg-default" id="payment-status">Default</span>) : 
                null
              )} 
              dataType="boolean" 
            /> */}
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

export default AccountSettingsSessions;
