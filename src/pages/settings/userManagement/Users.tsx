import React, { Fragment, useEffect, useState } from 'react'
import UserManagementApis from './User-Management-api';
import Urls from '../../../redux/urls'
import ERPGridpreference from '../../../components/ERPComponents/erp-gridpreference';
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
  LoadPanel,
  Export,
} from "devextreme-react/cjs/data-grid";
import Button from 'devextreme-react/button';
import CustomStore from "devextreme/data/custom_store";
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid as exportToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { PopUpModalAddUser, PopUpModalEditUser } from './userManagement-manage';



const Users = () => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  const {t} = useTranslation();
  const [gridpreference,setGridpreference] = useState<boolean>(false)
  const [isOpenAddUser,setIsOpenAddUser] =useState<boolean>(false)
  const [isOpenEditUser,setIsOpenEditUser] =useState<boolean>(false)
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
        "search",
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
  const exportFormats = ['pdf','excel'];
  const onExporting = (e: DataGridTypes.ExportingEvent) => {

    if(e.format === 'pdf'){
      const doc = new jsPDF();
  
      exportToPdf({
      jsPDFDocument: doc,
      component: e.component,
     columnWidths:[15,20,20,20,20,25,25,25,25,15,25,30,30,0],
      customizeCell({ gridCell, pdfCell }) {
       
      },
     
    }).then(() => {
      doc.save('Users.pdf');
    });
    }else if (e.format === 'excel') {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Users');
    
      exportToExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        });
      });
    }
    
  };
 const allowedPageSizes =  [10, 20, 50, 100];

  return (
    <Fragment>
      
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
                 onExporting={onExporting}
                 allowColumnResizing ={true}
                >
                  <ColumnFixing enabled={true}/>
                  <Scrolling  mode="standard" />
                  <FilterRow visible={true} />
                  <SearchPanel visible={true} />
                  {/* <HeaderFilter visible={true} /> */}
                  <Paging defaultPageSize={100} />
                  <ColumnChooser enabled={true} />
                  <LoadPanel enabled={false} />
                  <ColumnFixing enabled={true} />
                  <Selection mode="single" />
                  <Export enabled={true} formats={exportFormats} allowExportSelectedData={false} />
                  
                  <Column
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={false}
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
                    
                    minWidth={200}
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
                      allowSearch={false}
                      allowFiltering={false}
                     fixed={true} fixedPosition='right'
                     dataField="actions"
                     caption="Actions"
                     width={100}
                   cellRender={(cellElement, cellInfo) => {
                   return (
                  <div className="action-field">
                 
                  <span >
                    <i className="ri-eye-2-line  view-icon" title="View"></i>
                  </span>
                 
                  <span onClick={()=>setIsOpenEditUser(!isOpenEditUser)}>
                  <i className="ri-edit-line edit-icon" title="Edit"></i>
                  </span>

                  <span >
                  <i className="ri-delete-bin-5-line delete-icon" title="Edit"></i>
                  </span>
                  
                  </div>
                    );
                    }}
                />
                 <Toolbar>
                 <Item location="before">
                    <div className='flex  flex-col'>
                   <div className="box-title !text-xl !font-medium">
                    User{" "}
                   </div>
                  
                   </div>
                </Item>
                      <Item name="exportButton" />
                      <Item name="searchPanel" /> 
                      {/* <Item name="exportButton" /> */}
                      <Item name="columnChooserButton" />
                <Item >
                <div>
                <span onClick={()=>setIsOpenAddUser(!isOpenAddUser)}
                 className='ti-btn-primary-full ti-btn ti-btn-full '>
                {t('Add')}<i className="ri-user-add-line"></i>
                </span>
              </div>
                </Item>  
                </Toolbar>
                </DataGrid>

                <ERPModal
                isOpen={isOpenAddUser}
                title={"Add Users"}

                isForm={true}
                closeModal={() => {
                  // setPostDataEmail(initialEmailData);
                  setIsOpenAddUser(false);
                }}
                 content={
                  <PopUpModalAddUser setIsOpenAddUser={setIsOpenAddUser} />
                }
              />

                <ERPModal
                isOpen={isOpenEditUser}
                title={"Add Users"}
                width="!max-w-[80rem]"
                isForm={true}
                closeTitle="Close"
                closeModal={() => {
                  // setPostDataEmail(initialEmailData);
                  setIsOpenEditUser(false);
                }}
                 content={
                  <PopUpModalEditUser setIsOpenEditUser={setIsOpenEditUser} />
                }
              />
  </Fragment>
  )
}

export default Users
