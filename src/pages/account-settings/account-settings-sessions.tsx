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
      <div className="flex justify-start items-center gap-1">
        {browserImage && <img src={browserImage} alt={data.data.browser} style={{ width: '18px', height: '18px' }} />}
        <span>{data.data.browser}</span>
        <i className="ri-checkbox-blank-circle-fill drop-shadow-md" style={{ color: data.data.isActive ? '#22c55e' : '#57534e',fontSize: '7px' }}></i>
      </div>
    );
  };

 const renderCountryCell = (data: DataGridTypes.ColumnCellTemplateData)=>(
  <div className="flex justify-start items-center gap-1">
   <img
      src={data.data.country_flag ? data.data.country_flag : ""}
      alt={``}
      className="aspect-square  rounded-full"
      style={{ width: '18px', height: '18px',}} 
    />
    <span>{`${data.data.country},${data.data.state}`}</span>
</div>
 )

 const renderDeviceCell = (data: DataGridTypes.ColumnCellTemplateData)=>{
  // let deviceImage = '';
  let iconclass = "";
  // <i className="ri-windows-fill"></i>
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
      break;
    case 'Mac':
    //  deviceImage = deviceLogos.mac;
      break;
      case 'Ios':
    //  deviceImage = deviceLogos.ios;
      break; 
    default:
    //  deviceImage = ''; // You can add a default image or leave it empty
  };

  return (
    <div className="flex justify-start items-center gap-1">
      {/* {deviceImage && <img src={deviceImage} alt={data.data.device} className="aspect-square object-contain" style={{ width: '17px', height: '17px' }} />} */}
      {iconclass  && <i className={`${iconclass}  text-[20px] text-sky-600`} ></i>}
      <span className="">{data.data.device} </span>
      
    </div>
  );
 }


 const renderCellHeader = (data:any) => {
 return  <span className="font-semibold text-black font-sans text-[13px] py-2">
  {data.column.caption}
</span>
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
                   
                    // onRowPrepared={(e: any) => {
                    //   if (e.rowType === "data" && e.data.isActive) {
                    //     e.rowElement.style.backgroundColor = "#90ee90"; // Apply green background for active rows
                    //   }
                    // }}
                  >
                    <ColumnFixing enabled={true}/>
                    {/* <Scrolling  mode="standard" 
                      scrollByContent={true}
                      useNative={false}
                      scrollByThumb={true}
                      showScrollbar="always"
                    rowRenderingMode="virtual" /> */}
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
                      calculateSortValue={(rowData) => (
                       rowData.isActive ? 0 : 1 
                      )}
                      sortOrder="asc"
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
                    {/* <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="latitude"
                      caption={"latitude"}
                      dataType="string"
                    /> */}
                    {/* <Column
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="longitude"
                      caption={"Longitude"}
                      dataType="string"
                    /> */}
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
                   
                      // onClick={() => handleLogout(data)} 
                     
                      // <i className="ri-logout-box-r-fill text-sky-800  text-[23px] ml-2"></i>
                     <i className="ri-logout-box-r-line text-sky-800 text-center  text-[20px]  pl-1" ></i>
                     
                       )}
                    caption="" 
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
