import { Fragment } from 'react'
import Urls from '../../../redux/urls'

import { Link } from 'react-router-dom';
import { DevGridColumn } from '../../../components/types/dev-grid-column';
import ERPDevGrid from '../../../components/ERPComponents/erp-dev-grid';
import { toggleFinancialYearPopup } from '../../../redux/slices/popup-reducer';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { FinancialYearManage } from './financial-year-manage';

// import { UserTypeManage } from './user-type-manage';

const FinancialYear = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: 'siNo',
      caption: 'Serial Number',
      dataType: 'number',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      isLocked: true
    },
    {
      dataField: 'fromDate',
      caption: 'From Date',
      dataType: 'date',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'toDate',
      caption: 'To Date',
      dataType: 'date',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'status',
      caption: 'Status',
      dataType: 'string',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: 'remarks',
      caption: 'Remarks',
      dataType: 'string',
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200
    },
    {
      dataField: 'visibleOnStartup',
      caption: 'Visible on Startup',
      dataType: 'boolean',
      allowSorting: true,
      allowSearch: false,
      allowFiltering: true,
      minWidth: 100
    },
    {
      dataField: 'createdUser',
      caption: 'Created By',
      dataType: 'string',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'createdDate',
      caption: 'Created Date',
      dataType: 'date',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'modifiedUser',
      caption: 'Modified By',
      dataType: 'string',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'modifiedDate',
      caption: 'Modified Date',
      dataType: 'date',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
    },
    {
      dataField: 'id',
      caption: 'ID',
      dataType: 'number',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
      isLocked: true
    },
    {
      dataField: 'openingStockValue',
      caption: 'Opening Stock Value',
      dataType: 'number',
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150
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
                <ERPDevGrid columns={columns} gridHeader="Financial Year" dataUrl={Urls.FinancialYear} gridId='grd_financial_year' popupAction={toggleFinancialYearPopup} gridAddButtonType='popup' gridAddButtonIcon="ri-add-line"></ERPDevGrid>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.financialYear.isOpen || false}
        title={"Financial Year"}
        width='w-full max-w-[60rem]'
        isForm={true}
        closeModal={() => {
          dispatch(toggleFinancialYearPopup({ isOpen: false }))
        }}
        content={<FinancialYearManage />}
      />
    </Fragment>
  )
}


export default FinancialYear



