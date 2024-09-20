// import React, { Fragment, useEffect, useState } from 'react'
// import UserManagementApis from './User-Management-api';
// import Urls from '../../../redux/urls'
// import ERPGridpreference from '../../../components/ERPComponents/erp-gridpreference';
// import { DataGrid } from "devextreme-react";
// import {
//   Column,
//   FilterRow,
//   HeaderFilter,
//   Paging,
//   Scrolling,
//   SearchPanel,
//   DataGridTypes,
//   ColumnFixing,
//   ColumnChooser,
//   Selection,
//   Grouping,
//   Toolbar,
//   Item,
//   LoadPanel,
//   Export,
// } from "devextreme-react/cjs/data-grid";
// import Button from 'devextreme-react/button';
// import CustomStore from "devextreme/data/custom_store";
// import { jsPDF } from 'jspdf';
// import { Workbook } from 'exceljs';
// import { saveAs } from 'file-saver';
// import { exportDataGrid as exportToPdf } from 'devextreme/pdf_exporter';
// import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
// import { Link } from 'react-router-dom';

// const UserTypes = () => {
//     const [gridHeight, setGridHeight] = useState<number>(500);
//     const [showGridPreference,setShowGridPreference] = useState<boolean>(false)
//     useEffect(() => {
//       let wh = window.innerHeight;
//       let gridHeight = wh - 180;
//       setGridHeight(gridHeight);
//     }, []);
  
//     // function isNotEmpty(value: any) {
//     //   return value !== undefined && value !== null && value !== "";
//     // }
  
//   const store: any = {};
//     // const store = new CustomStore({
//     //   // key: "Id",
//     //   async load(loadOptions: any) {
//     //     const paramNames = [
//     //       "skip",
//     //       "take",
//     //       "requireTotalCount",
//     //       "sort",
//     //       "filter",
//     //     ];
  
//     //     // const queryString = paramNames
//     //     //   .filter((paramName) => isNotEmpty(loadOptions[paramName]))
//     //     //   .map(
//     //     //     (paramName) =>
//     //     //       `${paramName}=${JSON.stringify(loadOptions[paramName])}`
//     //     //   )
//     //     //   .join("&");
  
//     //     try {
//     //       const response = await  UserManagementApis.getUserTypeSessions({});
  
//     //       const result = response;
  
//     //       return result !== undefined && result != null
//     //         ? {
//     //             data: result,
//     //             totalCount: result.length,
//     //           }
//     //         : {
//     //             data: [],
//     //             totalCount: 0,
//     //             summary: {},
//     //             groupCount: 0,
//     //           };
//     //     } catch (err) {
//     //       throw new Error("Data Loading Error");
//     //     }
//     //   },
//     // });
//     const exportFormats = ['pdf','excel'];
//     const onExporting = (e: DataGridTypes.ExportingEvent) => {
  
//       if(e.format === 'pdf'){
//         const doc = new jsPDF();
    
//         exportToPdf({
//         jsPDFDocument: doc,
//         component: e.component,
    
//         customizeCell({ gridCell, pdfCell }) {
         
//         },
       
//       }).then(() => {
//         doc.save('Users.pdf');
//       });
//       }else if (e.format === 'excel') {
//         const workbook = new Workbook();
//         const worksheet = workbook.addWorksheet('Users');
      
//         exportToExcel({
//           component: e.component,
//           worksheet,
//           autoFilterEnabled: true,
//         }).then(() => {
//           workbook.xlsx.writeBuffer().then((buffer) => {
//             saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
//           });
//         });
//       }
      
//     };
//    const allowedPageSizes =  [10, 20, 50, 100];
//    return (
//     <Fragment>
      
//     <div className="grid grid-cols-12 gap-x-6">
//       <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        
//           <div className="box custom-box">
//             {/* <div className="box-header justify-between">
//               <div className="box-title">
//                 UserType{" "}
              
                
//               </div>
//               <div>
//                 <Link to="#" className='ti-btn-primary-full ti-btn ti-btn-full '>
//                  usertype <i className="ri-user-add-line"></i>
//                 </Link>
                
//               </div>
//             </div> */}
//             <div className="box-body">
//               <div className="grid grid-cols-1 gap-3">

//                 <DataGrid
//                   height={gridHeight}
//                   dataSource={
//                     store
                  
//                   }
//                  className="custom-data-grid"
//                   showBorders={true}
//                   remoteOperations={true}
//                   showColumnLines={false}
//                   showRowLines={true}
//                 //  columnAutoWidth={true}
//                  allowColumnReordering={true}
//                  onExporting={onExporting}
//                  allowColumnResizing ={true}
//                 >
//                   <ColumnFixing enabled={true}/>
//                   <Scrolling  mode="standard" />
//                   <FilterRow visible={true} />
//                   <SearchPanel visible={true} />
//                   {/* <HeaderFilter visible={true} /> */}
//                   <Paging defaultPageSize={100} />
//                   <ColumnChooser enabled={true} />
//                   <LoadPanel enabled={false} />
//                   <ColumnFixing enabled={true} />
//                   <Selection mode="single" />
//                   <Export enabled={true} formats={exportFormats} allowExportSelectedData={false} />
                  
//                   <Column
//                     allowSorting={true}
//                     allowSearch={true}
//                     allowFiltering={true}
//                     dataField="userTypeName"
//                     caption="userTypeName"
//                     dataType="string"
//                     minWidth={200}
//                   />
//                   <Column
                  
//                     allowSearch={true}
//                     allowFiltering={true}
//                     dataField= "userTypeCode"
                   
                  
//                     caption={"userTypeCode"}
                    
//                     minWidth={100}
//                     dataType="string"
//                   />
                  
            
                 
//                   <Column
//                     allowSearch={true}
//                     allowFiltering={true}
//                     dataField="remarks"
                   
//                     caption={"remarks"}
//                     minWidth={100}
//                     dataType="string"
//                   />
                  
//                   <Column
//                       allowSearch={false}
//                       allowFiltering={false}
//                      fixed={true} fixedPosition='right'
//                      dataField="actions"
//                      caption="Actions"
//                      width={100}
//                    cellRender={(cellElement, cellInfo) => {
//                    return (
//                   <div className="action-field">
                 
//                   <Link to="#">
//                     <i className="ri-eye-2-line  view-icon" title="View"></i>
//                   </Link>
                 
//                   <Link to="#">
//                   <i className="ri-edit-line edit-icon" title="Edit"></i>
//                   </Link>

//                   <Link to="#">
//                   <i className="ri-delete-bin-5-line delete-icon" title="Edit"></i>
//                   </Link>
                  
//                   </div>
//                     );
//                     }}
//                 />
//                  <Toolbar>
//                  <Item location="before">
//                     <div className='flex  flex-col'>
//                    <div>
//                     <button onClick={()=>setShowGridPreference(true)} className='ti-btn-primary-full rounded-[2px] '>
//                         <i className="ri-arrow-right-s-fill  "></i>
//                     </button>
//                     </div>
//                    <div className="box-title">
//                     UserType{" "}
//                    </div>
                  
//                    </div>
//                 </Item>
//                       <Item name="exportButton" />
//                       <Item name="searchPanel" /> 
//                       {/* <Item name="exportButton" /> */}
//                       <Item name="columnChooserButton" />
//                 <Item >
//                 <div>
//                 <Link to="#" className='ti-btn-primary-full ti-btn ti-btn-full '>
//                  Add<i className="ri-user-add-line"></i>
//                 </Link>
                
//               </div>
//                 </Item>   
//                 </Toolbar>
//                 </DataGrid>
//               </div>
//             </div>
//           </div>
     
//       </div>
//     </div>
//        {/* Render ERPGridpreference modal if showGridPreference is true */}
//        {showGridPreference && <ERPGridpreference onClose={() => setShowGridPreference(false)} />}
//   </Fragment>
//   )
// }

// export default UserTypes
