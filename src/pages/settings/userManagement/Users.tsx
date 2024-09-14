import React, { Fragment, useEffect, useState } from 'react'

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
  ColumnFixing
} from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";

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
        const response = await fetch(`https://polosys-001-site1.ctempurl.com/api/Subscription/User/GetUsersForGrid`);
      
        console.log("Response status: ", response.status);

        // Check if status is 204 (No Content)
        if (response.status === 204) {
            return {
                data: [],
                totalCount: 0,
                summary: {},
                groupCount: 0,
            };
        }
    
        const result = await response.json();
        console.log("Fetched data: ", result);
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
      } catch (err ) {
        console.error("Data Loading Error: ", err);
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
                <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                View and manage users where you're currently logged in
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
                  // remoteOperations={true}
                  showColumnLines={false}
                  showRowLines={true}
                 columnAutoWidth={true}
                >
                  <ColumnFixing enabled={true}/>
                  <Scrolling  mode="standard" 
           
                  />
                  {/* <Paging defaultPageSize={100} /> */}
     

                  <Column
                    
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="siNo"
                 
                    caption="SiNo"
                    dataType="number"
                  />
                  <Column
                    // width={110}
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="user"
                   
                  
                    caption={"User"}
                    
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="password"
                    caption={"Password"}
                    
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="counterID"
                   
                    caption={"Counter ID"}
                    
                    dataType="number"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    
                    dataField="userType"
                    caption={"User Type"}
                    
                    dataType="string"
                  />

                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="createdUser"
                    caption={"Created User"}
                    
                    dataType="string"
                  />
                   
                   <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="createdDate"
                    caption={"Created Date"}
                    
                    dataType="string"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="modifiedUser"
                    caption={"Modified User"}
                    
                    dataType="string"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="modifiedDate"
                    caption={"Modified Date"}
                    
                    dataType="string"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="id"
                    caption={"Id"}
                    
                    dataType="number"
                  />
                    <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="employeeID"
                    caption={"Employee ID"}
                    
                    dataType="number"
                  />
                   <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="employeeName"
                    caption={"Employee Name"}
                    
                    dataType="string"
                  />
                  <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField="maxDiscPercAllowed"
                    caption={"maxDiscPercAllowed"}
                    
                    dataType="number"
                  />
                  {/* <Column
                    allowSearch={true}
                    allowFiltering={true}
                    dataField=  "passkey"
                    caption={  "Passkey"}
                    
                    dataType="string"

                  /> */}

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
