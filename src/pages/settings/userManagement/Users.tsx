// import React, { Fragment, useEffect, useState } from 'react'
// import UserManagementApis from './User-Management-api';
// import Urls from '../../../redux/urls'
// import { Link } from 'react-router-dom';
// import { DevGridColumn } from '../../../components/types/dev-grid-column';
// import ERPDevGrid from '../../../components/ERPComponents/erp-dev-grid';
// import { toggleUserPopup, toggleUserTypePopup } from '../../../redux/slices/popup-reducer';
// import ERPModal from '../../../components/ERPComponents/erp-modal';
// import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
// import { useRootState } from '../../../utilities/hooks/useRootState';
// import { PopUpModalAddUserTypes } from './userManagement-manage';
// import { UserTypeManage } from './user-type-manage';



// const Users = () => {
//   const dispatch = useAppDispatch();
//     const rootState = useRootState();
//     const columns: DevGridColumn[] = [
//           {
//           dataField:"siNo",
//           caption:"SiNo",
//           dataType:"number",
//           allowSorting:true,
//           allowSearch:true,
//           allowFiltering:true,
//           width:60
//           },
//           {
//             dataField: "user",
//             caption: "User",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             minWidth: 200
//           },
//           {
//             dataField: "password",
//             caption: "Password",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 140
//           },
//           {
//             dataField: "counterID",
//             caption: "Counter ID",
//             dataType: "number",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true
//           },
//           {
//             dataField: "counter",
//             caption: "Counter",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 100
//           },
//           {
//             dataField: "userType",
//             caption: "User Type",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 100
//           },
//           {
//             dataField: "createdUser",
//             caption: "Created User",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 130
//           },
//           {
//             dataField: "createdDate",
//             caption: "Created Date",
//             dataType: "date",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 100
//           },
//           {
//             dataField: "modifiedUser",
//             caption: "Modified User",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 130
//           },
//           {
//             dataField: "modifiedDate",
//             caption: "Modified Date",
//             dataType: "date",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 130
//           },
//           {
//             dataField: "id",
//             caption: "Id",
//             dataType: "number",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 60
//           },
//           {
//             dataField: "employeeID",
//             caption: "Employee ID",
//             dataType: "number",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 100
//           },
//           {
//             dataField: "employeeName",
//             caption: "Employee Name",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 120
//           },
//           {
//             dataField: "maxDiscPercAllowed",
//             caption: "Max Discount Percentage Allowed",
//             dataType: "number",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 150
//           },
//           {
//             dataField: "passkey",
//             caption: "Passkey",
//             dataType: "string",
//             allowSorting:true,
//             allowSearch: true,
//             allowFiltering: true,
//             width: 100
//           },
//         {
//           dataField: 'actions',
//           caption: 'Actions',
//           allowSearch: false,
//           allowFiltering: false,
//           fixed: true,
//           fixedPosition: 'right',
//           width: 100,
//           cellRender: (cellElement: any, cellInfo: any) => (
//             <div className="action-field">
//               <Link to="#">
//                 <i className="ri-eye-2-line view-icon" title="View"></i>
//               </Link>
//               <Link to="#">
//                 <i className="ri-edit-line edit-icon" title="Edit"></i>
//               </Link>
//               <Link to="#">
//                 <i className="ri-delete-bin-5-line delete-icon" title="Delete"></i>
//               </Link>
//             </div>
//           ),
//         }
//     ];

//     return (
//           <Fragment>
            
//           <div className="grid grid-cols-12 gap-x-6">
//             <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              
//                 <div className="box custom-box">
//                   <div className="box-body">
//                     <div className="grid grid-cols-1 gap-3">
//                       <ERPDevGrid columns={columns} gridHeader="User" dataUrl= {Urls. getUserSubscriped} gridId='grd_user' popupAction={toggleUserPopup} gridAddButtonType='popup' gridAddButtonIcon=''></ERPDevGrid>               
//                     </div>
//                   </div>
//                 </div>
           
//             </div>
//           </div>
//           <ERPModal
//             isOpen={rootState.PopupData.user}
//             title={"Add New User"}
//             isForm={true}
//             closeModal={() => {
//               dispatch(toggleUserPopup(false))
//             }}
//             content={<UserTypeManage/>}
//           />
//          </Fragment>
//         )
//   }

// export default Users


