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
  DataGridTypes,
  ColumnFixing
} from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";
import AccountSettingsApis from "./account-settings-apis";
import Pageheader from "../../components/common/pageheader/pageheader";
import chrome from '../../assets/images/browser-logos/chrome.png';
import firefox from '../../assets/images/browser-logos/firefox.png';
import microsoft from '../../assets/images/browser-logos/microsoft.png';
import safari from '../../assets/images/browser-logos/safari.png';
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
    // debugger;
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.logoutUserSession,
        data: {
           deviceId: deviceId
           },
      }) as any
    ).unwrap();
    // debugger;
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
        <span className="text-[14px] font-[200] text-black font-sans">{data.data.browser}</span>
       
        {data.data.isActive && <i className="ri-checkbox-blank-circle-fill drop-shadow-sm self-center" style={{ color:'#22c55e',fontSize: '7px' }}></i>}
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
    <span className="text-[14px] font-[200] text-black font-sans">{`${data.data.country},${data.data.state}`}</span>
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
      <div className="w-[16px] h-[16px]  flex justify-center ">
      {iconclass  && <i className={`${iconclass} object-contain text-[16px] text-sky-400`} ></i>}
      </div>
      <span className="text-black font-sans font-[200] text-[14px]">{data.data.device} </span>
      
    </div>
  );
 }


 const renderCellHeader = (data:any) => {
 return  <div className=" font-medium font-sans text-black text-[16px] ">
  {data.column.caption}
</div>
 }
 
 const cellPrepared = (e:any) => {

     e.cellElement.style.cssText = " color: #000000; font-size:14px; font-weight:200;  ";
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
                      // "https://localhost:7213/api/Core/LoginSessions/GetAllAsync"
                    }
                  
                    showBorders={true}
                    // columnAutoWidth={true}
                    // remoteOperations={true}
                    showColumnLines={false}
                    showRowLines={true}
                    onCellPrepared={cellPrepared}
                    // onScroll={handleScroll}
                    // onRowPrepared={(e: any) => {
                    //   if (e.rowType === "data" && e.data.isActive) {
                    //     e.rowElement.style.backgroundColor = "#90ee90"; // Apply green background for active rows
                    //   }
                    // }}
                  >
                    <ColumnFixing enabled={true}/>
                    <Scrolling  mode="virtual" 
                      scrollByContent={false}
                     
                    rowRenderingMode="virtual" 
                    />
                    <Paging defaultPageSize={100} />
                    {/* <FilterRow visible={true} applyFilter="auto" />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} width={240} placeholder={'Search...'} /> */}
                    {/* <Column dataField="branchName" caption={'branchName'} dataType="string" /> */}

                    <Column
                      
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="branchName"
                      headerCellRender={renderCellHeader}
                      caption="  Branch Name"
                      dataType="string"
                    />
                    <Column
                      // width={110}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="browser"
                      cellRender={renderBrowserCell}
                      // calculateSortValue={(rowData) => (
                      //  rowData.isActive ? 0 : 1 
                      // )}
                      // sortOrder="asc"
                      caption={"Browser"}
                      headerCellRender={renderCellHeader}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="ipAddress"
                      caption={"IP Address"}
                      headerCellRender={renderCellHeader}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="device"
                      cellRender={renderDeviceCell}
                      caption={"Device"}
                      headerCellRender={renderCellHeader}
                      dataType="string"
                    />
                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      cellRender={renderCountryCell}
                      dataField="location"
                      caption={"Location"}
                      headerCellRender={renderCellHeader}
                      dataType="string"
                    />

                    <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="recentActivity"
                      caption={"Recent Activity"}
                      headerCellRender={renderCellHeader}
                      dataType="datetime"
                    />
                     <Column
                       
                      fixed={true} fixedPosition="right"
                      cellRender={({ data }) => (
                    
                        <>
                         {/* {data.isActive &&  */}
                         <ERPButton 
                        //  title= {loadingLogout.loading == false ?  "Logout" : "..."}
                          
                    onClick={()=>
                    {
                      // debugger;
                      // if(data.isActive){
                        handleLogout(data?.deviceId??"")
                      // }
                    
                    }
                    } 
                    startIcon= {loadingLogout.loading == false ?  "ri-logout-box-r-line" : ""}
                    className="p-[2px] m-[0px] h-8 "
                     type="button"
                     variant="primary"
                    disabled={(loadingLogout.loading && loadingLogout.deviceId === data.deviceId) || data.isActive === false} 
                    loading={loadingLogout.loading && loadingLogout.deviceId ==data.deviceId}
                   
                     >

                     </ERPButton>
                      
                        </>
                       )
                         }
                      
                    caption="" 
                     width={60} 
                    
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
