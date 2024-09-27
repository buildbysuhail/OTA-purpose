import React, { Fragment, useEffect, useState } from 'react'
// import UserManagementApis from './User-Management-api';
import Urls from '../../../redux/urls'
import { Link } from 'react-router-dom';
import { DevGridColumn } from '../../../components/types/dev-grid-column';
import ERPDevGrid from '../../../components/ERPComponents/erp-dev-grid';
import { toggleCounterPopup, toggleVoucherPopup} from '../../../redux/slices/popup-reducer';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../utilities/hooks/useRootState';
// import { PopUpModalAddUserTypes } from './userManagement-manage';
// import { UserTypeManage } from './user-type-manage';


const SystemVoucher = () => {
  const dispatch = useAppDispatch();
      const rootState = useRootState();
      const columns: DevGridColumn[] = [
      {
        dataField: "siNo",
        caption: "Serial No",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "voucherType",
        caption: "Voucher Type",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "formType",
        caption: "Form Type",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "lastVoucherPrefix",
        caption: "LastVoucher Prefix",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150
      },
      {
        dataField: "lastVoucherNumber",
        caption: "LastVoucher Number",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150
      },
      {
        dataField: "descriptions",
        caption: "Descriptions",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150
      },
      {
        dataField: "id",
        caption: "Id",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "printDesignFileName",
        caption: "PrintDesign FileName",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150
      },
      {
        dataField: "createdUser",
        caption: "CreatedUser",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150
      },
      {
        dataField: "createdDate",
        caption: "Created Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "modifiedUser",
        caption: "Modified User",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
      {
        dataField: "modifiedDate",
        caption: "Modified Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
     
      {
        dataField: "defaultVoucher",
        caption: "default Voucher",
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100
      },
    
      {
        dataField: 'actions',
        caption: 'Actions',
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: 'right',
        width: 100,
        cellRender: (cellElement: any, cellInfo: any) => (
          <div className="action-field">
            <Link to="#">
              <i className="ri-eye-2-line view-icon" title="View"></i>
            </Link>
            <Link to="#">
              <i className="ri-edit-line edit-icon" title="Edit"></i>
            </Link>
            <Link to="#">
              <i className="ri-delete-bin-5-line delete-icon" title="Delete"></i>
            </Link>
          </div>
        ),
      }
      ];
  
      return (
            <Fragment>
              
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                
                  <div className="box custom-box">
                    <div className="box-body">
                      <div className="grid grid-cols-1 gap-3">
                        <ERPDevGrid columns={columns} gridHeader="Voucher" dataUrl= {Urls.getSystemVoucher} gridId='grd_voucher' popupAction={toggleVoucherPopup} gridAddButtonType='popup' gridAddButtonIcon='ri-add-line'></ERPDevGrid>               
                      </div>
                    </div>
                  </div>
             
              </div>
            </div>
            <ERPModal
              isOpen={rootState.PopupData.voucher}
              title={"Add New Voucher"}
              isForm={true}
              closeModal={() => {
                dispatch(toggleVoucherPopup(false))
              }}
              // content={<UserTypeManage/>}
            />
           </Fragment>
          )   
}

export default SystemVoucher
