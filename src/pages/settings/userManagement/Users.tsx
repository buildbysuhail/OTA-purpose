import React, { Fragment, useEffect, useState } from 'react'
import UserManagementApis from './User-Management-api';
import Urls from '../../../redux/urls'
import { DataGrid } from "devextreme-react";
import {
  Column,
  FilterRow,
  HeaderFilter,
  Paging,
  Scrolling,
  SearchPanel,
  DataGridTypes,
  ColumnFixing,
  ColumnChooser,
  Selection,
  Grouping,
  Toolbar,
  Item,
  LoadPanel
} from "devextreme-react/cjs/data-grid";
import Button from 'devextreme-react/button';
import CustomStore from "devextreme/data/custom_store";
import { Link } from 'react-router-dom';


const Users = () => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 180;
    setGridHeight(gridHeight);
  }, []);

  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }


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
        const response = await  UserManagementApis.getSessions(queryString);

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
  
 const allowedPageSizes =  [10, 20, 50, 100];

  return (
    <Fragment>
      
    <div className="grid grid-cols-12 gap-x-6">
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        
          <div className="box custom-box">
            <div className="box-header justify-between">
              <div className="box-title">
                Users{" "}
                {/* <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                View and manage users where you're currently logged in
                </p> */}
                
              </div>
              <div>
                <button className='ti-btn-primary-full ti-btn ti-btn-full '>
                  Add
                </button>
              </div>
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
                  remoteOperations={true}
                  showColumnLines={false}
                  showRowLines={true}
                 columnAutoWidth={true}
                 allowColumnReordering={true}
                //  allowColumnResizing ={true}
                >
                  <ColumnFixing enabled={true}/>
                  <Scrolling  mode="standard" />
                  {/* <FilterRow visible={true} /> */}
                  <SearchPanel visible={true} />
                  {/* <HeaderFilter visible={true} /> */}
                  <Paging defaultPageSize={100} />
                  <ColumnChooser enabled={true} />
                  {/* <LoadPanel enabled={true} /> */}
                  <ColumnFixing enabled={true} />
                  <Selection mode="single" />
                  
                  <Column
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="siNo"
                    caption="SiNo"
                    dataType="number"
                    width={60}
                  />
                  <Column
                  
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="user"
                   
                  
                    caption={"User"}
                    width={60}
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="password"
                    caption={"Password"}
                    width={140}
                    dataType="string"
                  />
                  {/* <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="counterID"
                   
                    caption={"Counter ID"}
                    
                    dataType="number"
                  /> */}
                 
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="counter"
                   
                    caption={"Counter"}
                    width={100}
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    
                    dataField="userType"
                    caption={"User Type"}
                    width={100}
                    dataType="string"
                  />

                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="createdUser"
                    caption={"Created User"}
                    width={130}
                    dataType="string"
                  />
                   
                   <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="createdDate"
                    caption={"Created Date"}
                    width={100}
                    dataType="date"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="modifiedUser"
                    caption={"Modified User"}
                    width={130}
                    dataType="string"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="modifiedDate"
                    caption={"Modified Date"}
                    width={130}
                    dataType="date"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="id"
                    caption={"Id"}
                    width={60}
                    dataType="number"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="employeeID"
                    caption={"Employee ID"}
                    width={100}
                    dataType="number"
                  />
                   <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="employeeName"
                    caption={"Employee Name"}
                    width={120}
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="maxDiscPercAllowed"
                    caption={"maxDiscPercAllowed"}
                    width={150}
                    dataType="number"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField=  "passkey"
                    caption={  "Passkey"}
                    visible={false}
                    dataType='string'
                    width={100}
                  />
                  <Column
                     fixed={true} fixedPosition='right'
                     dataField="actions"
                     caption="Actions"
                     width={100}
                   cellRender={(cellElement, cellInfo) => {
                   return (
                  <div className="action-field">
                 
                  <Link to="#">
                    <i className="ri-eye-2-line  view-icon" title="View"></i>
                  </Link>
                 
                  <Link to="#">
                  <i className="ri-edit-line edit-icon" title="Edit"></i>
                  </Link>

                  <Link to="#">
                  <i className="ri-delete-bin-5-line delete-icon" title="Edit"></i>
                  </Link>
                  
                  </div>
                    );
                    }}
                />
                 <Toolbar>
                   
                      <Item name="searchPanel" /> 
                      {/* <Item name="exportButton" /> */}
                      <Item name="columnChooserButton" />
                    
                </Toolbar>
                </DataGrid>
              </div>
            </div>
          </div>
     
      </div>
    </div>
  </Fragment>
  )
}

export default Users
