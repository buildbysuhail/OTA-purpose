
import React, { Fragment, useEffect, useState } from 'react'

import Urls from '../../../redux/urls'
import { DevGridColumn } from '../../../components/types/dev-grid-column';
import ERPDevGrid from '../../../components/ERPComponents/erp-dev-grid';
import { toggleCounterPopup } from '../../../redux/slices/popup-reducer';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../utilities/hooks/useRootState';
import ERPGridActions from '../../../components/ERPComponents/erp-grid-actions';

const Counters = () => {
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
      dataField: "counter",
      caption: "Counter",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: "descriptions",
      caption: "Descriptions",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: "maintainShift",
      caption: "Maintain Shift",
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 60
    },
    {
      dataField: "createdUser",
      caption: "Created User",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
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
      dataField: "cashLedgerID",
      caption: "Cash Ledger ID",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: "ledgerName",
      caption: "Ledger Name",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: "vrPrefix",
      caption: "Voucher Prefix",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: "actions",
      caption: "Actions",
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "link", path: `/view/${cellInfo?.data?.id}` }}
          edit={{ type: "popup", action: () => toggleCounterPopup(cellInfo?.data?.id) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            // action: () => handleDelete(cellInfo?.data?.id),
          }}
        />
      ),
    },
  ];

  return (
    <Fragment>

      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">

          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid columns={columns} gridHeader="Counter" dataUrl={Urls.Counter} gridId='grd_counter' popupAction={toggleCounterPopup} gridAddButtonType='popup' gridAddButtonIcon='ri-add-line'></ERPDevGrid>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.counter.isOpen || false}
        title={"Add New Counter"}
        isForm={true}
        closeModal={() => {
          dispatch(toggleCounterPopup({ isOpen: false }))
        }}
        // content={<UserTypeManage/>}
        content={"nixsgj"}
      />
    </Fragment>
  )
}

export default Counters







