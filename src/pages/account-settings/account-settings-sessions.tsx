import { FC, Fragment, useEffect, useState } from "react";
import Urls from "../../redux/urls";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { useLocation } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import { DataGrid } from "devextreme-react";
import {
  Column,
  Paging,
  Scrolling,
  DataGridTypes,
  ColumnFixing,
  LoadPanel
} from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";
import AccountSettingsApis from "./account-settings-apis";
import chrome from '../../assets/images/browser-logos/chrome.png';
import firefox from '../../assets/images/browser-logos/firefox.png';
import microsoft from '../../assets/images/browser-logos/microsoft.png';
import safari from '../../assets/images/browser-logos/safari.png';
import { postAction } from "../../redux/slices/app-thunks";
// import { deviceLogos } from "../../assets/images/device-logos";

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
    // key: "Id",
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
  const [loadingLogout, setLoadingLogout] = useState<{loading:boolean, deviceId: string}>({loading:false, deviceId: ''});

 
  const dispatch = useDispatch();

  const handleLogout = async (deviceId:string) => {
    setLoadingLogout({loading: true, deviceId: deviceId});
    // 
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.logoutUserSession,
        data: {
           deviceId: deviceId
           },
      }) as any
    ).unwrap();
    // 
    setLoadingLogout({loading: false, deviceId: deviceId});
    handleResponse(response, () => {
      store.load();
    });
  };

  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route

// ======================================cellRender===================================================

  const renderBrowserCell = (data: DataGridTypes.ColumnCellTemplateData) => {
    let browserImage = '';
    
    switch (data.data.browser) {
      case 'Chrome':
        browserImage = chrome;
        break;
      case 'Firefox':
        browserImage = firefox;
        break;
      case 'Edge':
        browserImage = microsoft;
        break;
      case 'Safari':
        browserImage = safari;
        break;
      default:
        browserImage = ''; // You can add a default image or leave it empty
    }
  
    return (
      <div className="flex justify-start items-center  gap-1">
        {browserImage && <img src={browserImage} alt={data.data.browser} className=" hover:brightness-150 drop-shadow-md" style={{ width: '15px', height: '15px' }} />}
        <span className=".dx-row">{data.data.browser}{" "}
        {data.data.isActive && <i className="ri-checkbox-blank-circle-fill drop-shadow-sm " style={{ color:'#22c55e',fontSize: '7px' }}></i>}
        </span>
      </div>
    );
  };

 const renderCountryCell = (data: DataGridTypes.ColumnCellTemplateData)=>(
  <div className="flex justify-start items-center  gap-1">
   <img
      src={data.data.country_flag ? data.data.country_flag : ""}
      alt={``}
      className="aspect-square  rounded-full drop-shadow-md hover:brightness-150"
      style={{ width: '15px', height: '15px',}} 
    />
    <span className=".dx-row">{`${data.data.country},${data.data.state}`}</span>
</div>
 )

 const renderDeviceCell = (data: DataGridTypes.ColumnCellTemplateData)=>{
  // let deviceImage = '';
  let iconclass = "";
 
  switch (data.data.device) {
    case 'Windows':
    //  deviceImage = deviceLogos.windows;
    iconclass = "ri-windows-fill"
      break;
    case 'Linux':
    //  deviceImage = deviceLogos.linux;
  
     iconclass = "ri-ubuntu-fill"
      break;
    case 'Android':
    //  deviceImage = deviceLogos.android;
    iconclass ="ri-android-fill"
      break;
    case 'macOS':
    //  deviceImage = deviceLogos.mac;
    iconclass = "ri-mac-fill"
      break;
      case 'iOS':
    //  deviceImage = deviceLogos.ios;
    iconclass ="ri-apple-fill"
    
      break; 
    default:
    //  deviceImage = ''; // You can add a default image or leave it empty
  };

  return (
    <div className="flex justify-start items-center  gap-1">
      {/* {deviceImage && <img src={deviceImage} alt={data.data.device} className="aspect-square object-contain" style={{ width: '17px', height: '17px' }} />} */}
      <div className="w-[16px] h-[16px]  flex justify-center items-start">
      {iconclass  && <i className={`${iconclass} object-contain text-[16px] text-sky-400`} ></i>}
      </div>
      <span className=".dx-row">{data.data.device} </span>
      
    </div>
  );
 }



//  ==========================================================================================
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
                    }
                    className="custom-data-grid"
                    showBorders={true}
                    columnAutoWidth={true}
                    // columnMinWidth={100}
                    // remoteOperations={true}
                    showColumnLines={false}
                    showRowLines={true}
                
                  >
                    <ColumnFixing enabled={true}/>
                    <Scrolling  mode="standard" 
                      // scrollByContent={true}
                     
                    // rowRenderingMode="virtual" 
                    />
                    <LoadPanel enabled={false} />
                    <Paging defaultPageSize={100} />
                    {/* <FilterRow visible={true} applyFilter="auto" />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} width={240} placeholder={'Search...'} /> */}
                    {/* <Column dataField="branchName" caption={'branchName'} dataType="string" /> */}

                     <Column
                      
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="branchName"
                     
                      caption="  Branch Name"
                      dataType="string"
                    /> 
                     <Column
                    
                      width={140}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="browser"
                      cellRender={renderBrowserCell}
                      // calculateSortValue={(rowData) => (
                      //  rowData.isActive ? 0 : 1 
                      // )}
                      // sortOrder="asc"
                      caption={"Browser"}
                      
                      dataType="string"
                    /> 
                    <Column
                    width={140}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="ipAddress"
                      caption={"IP Address"}
                      
                      dataType="string"
                    />
                    <Column
                    width={140}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="device"
                      cellRender={renderDeviceCell}
                      caption={"Device"}
                      
                      dataType="string"
                    />
                    <Column
                    width={200}
                      allowSearch={true}
                      allowFiltering={true}
                      cellRender={renderCountryCell}
                      dataField="location"
                      caption={"Location"}
                      
                      dataType="string"
                    />

                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="recentActivity"
                      caption={"Recent Activity"}
                      width={200}
                      dataType="datetime"
                    />
                     <Column
                      dataField="actions"
                      caption={' '}
                      fixed={true} fixedPosition="right"
                      cellRender={({ data }) => (
                    
                        <>
                         {/* {data.isActive &&  */}
                    <ERPButton 
                     variant="primary"
                     className= {`p-[1px] m-[0px] h-7 w-7`}
                     onClick={() => {
                       handleLogout(data?.deviceId ?? '');
                     }}
                     startIcon={loadingLogout.loading == false ? 'ri-logout-box-r-line' : ''}
                     disabled={(loadingLogout.loading && loadingLogout.deviceId === data.deviceId) || data.isActive === false}
                     loading={loadingLogout.loading && loadingLogout.deviceId == data.deviceId}
                     >

                     </ERPButton>
                      
                        </>
                       )
                         }
                      
                   
                     width={50} 
                    
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
