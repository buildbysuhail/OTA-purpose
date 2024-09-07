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
import { Column, FilterRow, HeaderFilter, Paging, Scrolling, SearchPanel } from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";
import AccountSettingsApis from "./account-settings-apis";

interface AccountSettingsProps {}

const AccountSettingsSessions: FC<AccountSettingsProps> = (props) => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh-180;
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
        console.log('Load function called', loadOptions);
        debugger;
        try {
          const response = await AccountSettingsApis.getAvailableSessionsForDxGrid(
            ""
          );
  
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
      }
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
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div> </div>
      </div>
      <DataGrid
      
                            height={gridHeight}
                            dataSource={"https://localhost:7213/api/Core/LoginSessions/GetAllAsync"}
                            showBorders={true}
                            // remoteOperations={true}
                            showColumnLines={false}
                            showRowLines={true}
                            onRowPrepared={(e) => {
                              if (e.rowType === 'data' && e.data.isActive) {
                                  e.rowElement.style.backgroundColor = '#90ee90';  // Apply green background for active rows
                              }
                          }}
                        >
                          {/* <Scrolling mode="virtual" rowRenderingMode="virtual" /> */}
                          <Paging defaultPageSize={100} />
                            {/* <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <SearchPanel visible={true} width={240} placeholder={'Search...'} /> */}
                            {/* <Column dataField="branchName" caption={'branchName'} dataType="string" /> */}

                            <Column allowSearch={true} allowFiltering={true} dataField="branchName" caption={'BranchName'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="browser" caption={'browser'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="ipAddress" caption={'ipAddress'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="device" caption={'device'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="location" caption={'location'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="latitude" caption={'latitude'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="longitude" caption={'Longitude'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="recentActivity" caption={'RecentActivity'} dataType="datetime" />
                            {/* <Column allowSearch={true} allowFiltering={true} dataField="IsActive" caption={'isActive'} dataType="boolean" /> */}
                            {/* <Column dataField="isDefault" caption={'Is Default'} cellRender={({ data }) => (
                                      data.isDefault === true ? 
                                      (<span className="badge bg-default" id="payment-status">Default</span>) : 
                                      null
                                    )} 
                                    dataType="boolean" 
                                  /> */}
                        </DataGrid>
      
    </Fragment>
  );
};

export default AccountSettingsSessions;
