import React, { useCallback, useEffect, useState } from 'react'
import CustomStore from "devextreme/data/custom_store";
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid as exportToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportToExcel } from 'devextreme/excel_exporter';
import { Link } from 'react-router-dom';
import GridPreferenceChooser from '../../../components/ERPComponents/erp-gridpreference';
import { applyGridColumnPreferences, getInitialPreference } from '../../../utilities/dx-grid-preference-updater';
import { DevGridColumn, GridPreference } from '../../../components/types/dev-grid-column';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import UserManagementApis from '../userManagement/User-Management-api';
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
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

const SystemVoucher = () => {
    const [gridHeight, setGridHeight] = useState<number>(500);
    const {t} = useTranslation();
    const [gridId, setGridId] = useState<string>('userTypes');
    const [isOpenAddPop,setIsOpenAddPop] = useState<boolean>(false)
    useEffect(() => {
      let wh = window.innerHeight;
      let gridHeight = wh - 180;
      setGridHeight(gridHeight);
    }, []);
  
    function isNotEmpty(value: any) {
      return value !== undefined && value !== null && value !== "";
    }
    const columns: DevGridColumn[] = [
      {
        dataField: 'userTypeName',
        caption: 'User Type',
        dataType: 'string',
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200, 
        isLocked : true
      },
      {
        dataField: 'userTypeCode',
        caption: 'Code',
        dataType: 'string',
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: 'remarks',
        caption: 'Remarks',
        dataType: 'string',
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
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
    
    const [gridCols, setGridCols] = useState<DevGridColumn[]>();
    const [preferences, setPreferences] = useState<GridPreference>();
    useEffect(() => {
      debugger;
      if(gridId != '' && columns != undefined && columns != null)
      {
        onApplyPreferences(getInitialPreference(gridId,columns));
      }
    },[gridId])
    const onApplyPreferences = useCallback((pref: GridPreference) => {
      debugger;
      // Your logic to handle preference changes
      // For example:
      setPreferences(pref);
      const updatedColumns = applyGridColumnPreferences(columns, pref);
      setGridCols(updatedColumns);
    }, [columns]); // Add any other dependencies here

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
          const response = await  UserManagementApis.getUserTypeSessions({});
  
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
    return (
        <>
          
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            
              <div className="box custom-box">
               
                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
    
                    <DataGrid
                       height={gridHeight}
                       dataSource={store}
                       className="custom-data-grid"
                       showBorders={true}
                       remoteOperations={true}
                       showColumnLines={false}
                       showRowLines={true}
                       allowColumnReordering={true}
                       onExporting={onExporting}
                       allowColumnResizing={true}
                       columns={gridCols}
                    >
                      
                      <Scrolling  mode="standard" />
                      <FilterRow visible={true} />
                      <SearchPanel visible={true} />
                      {/* <HeaderFilter visible={true} /> */}
                      <Paging defaultPageSize={100} />
                      <ColumnChooser enabled={true} />
                      {/* <LoadPanel enabled={false} /> */}
                      <ColumnFixing enabled={true} />
                      <Selection mode="single" />
                      <Export enabled={true} formats={exportFormats} allowExportSelectedData={false} />
                      
                     <Toolbar>
                     <Item location="before">
                        <div className='flex  flex-col'>
                       <div className="box-title !text-xl !font-medium">
                       {t('Voucher')}{" "}
                       </div>
                      
                       </div>
                    </Item>
                          <Item name="exportButton" />
                          <Item name="searchPanel" /> 
                          {/* <Item name="exportButton" /> */}
                          <Item>
                        <div className='flex  flex-col'>
                       <div>
                       <GridPreferenceChooser columns={columns} gridId={gridId} onApplyPreferences={(pref: any) => {onApplyPreferences(pref)}}></GridPreferenceChooser>
                        </div>
                        </div>
                    </Item>
                    <Item >
                      
                    <div>
                    <span  onClick={()=>setIsOpenAddPop(!isOpenAddPop)}
                    className='ti-btn-primary-full ti-btn ti-btn-full '>
                      {t('Add')}<i className="ri-user-add-line"></i>
                    </span>
                    
                  </div>
                    </Item>   
                    </Toolbar>
                    </DataGrid>
                  </div>
                </div>
              </div>
         
          </div>
        </div>
                 <ERPModal
                    isOpen={isOpenAddPop}
                    title={"Add UserType"}
                    width='max-w-[800px]'
                    isForm={true}
                    closeModal={() => {
                      
                      setIsOpenAddPop(false);
                    }}
                     content={'hello'
                    //   <PopUpModalAddUserTypes setIsOpenAddPop={setIsOpenAddPop} />
                    }
                  />
      </>
      )
}

export default SystemVoucher
