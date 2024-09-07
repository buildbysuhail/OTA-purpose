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
import AccountSettingsApis from "./workspace-settings-apis";

interface WorkSpaceSettingsProps {}

const WorkspaceSettingsSessions: FC<WorkSpaceSettingsProps> = (props) => {
 
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 305;
    setGridHeight(gridHeight);
    debugger;
    loadDxGrid(); // Load initial data
  }, []);
  let store: any = {};

let isInitial = true;
  const loadDxGrid = () => {
    debugger;
    store = new CustomStore({
      key: "id",
      async load(loadOptions: { [key: string]: any }) {
        let params: any = {};
        [
          "filter",
          "requireTotalCount",
          "sort",
          "skip",
          "take",
          "userData",
        ].forEach((i: string) => {
          if (
            loadOptions[i] !== undefined 
          ) {
            params = { ...params, [i]: JSON.stringify(loadOptions[i]) };
          }
        });
        
        if (isInitial) {
          params.sort = JSON.stringify([{ selector: "id", desc: true }]);
          isInitial = false;
      }
  debugger;
        let queryString = Object.entries(params)
      .map(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          } else {
              // Handle other types or unexpected types if needed
              return ''; // Or some other default behavior
          }
      })
      .join('&');
      debugger;
        try {
          debugger;
          const response = await AccountSettingsApis.getAvailableSessionsForDxGrid(
            queryString
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
          debugger;
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
        <div></div>
      </div>
      <DataGrid
                            height={gridHeight}
                            dataSource={store}
                            showBorders={true}
                            remoteOperations={true}
                            showColumnLines={false}
                            showRowLines={true}
                        >
                          <Scrolling mode="virtual" rowRenderingMode="virtual" />
                          <Paging defaultPageSize={100} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <SearchPanel visible={true} width={240} placeholder={'Search...'} />
                            <Column dataField="name" caption={'Name'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="email" caption={'Email'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="country" caption={'Country'} dataType="string" />
                            <Column allowSearch={true} allowFiltering={true} dataField="contactNumber" caption={'Contact Number'} dataType="string" />
                            <Column dataField="isDefault" caption={'Is Default'} cellRender={({ data }) => (
                                      data.isDefault === true ? 
                                      (<span className="badge bg-default" id="payment-status">Default</span>) : 
                                      null
                                    )} 
                                    dataType="boolean" 
                                  />
                        </DataGrid>
      
    </Fragment>
  );
};

export default WorkspaceSettingsSessions;
