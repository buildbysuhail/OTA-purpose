import React, { useCallback, useMemo, useState } from "react";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import { APIClient } from "../../../../helpers/api-client";
import { handleResponse } from "../../../../utilities/HandleResponse";
import Urls from "../../../../redux/urls";
import ERPFileUploadButton from "../../../../components/ERPComponents/erp-file-upload-button";

const api = new APIClient();


const ExcelImport = () => {
    const dispatch = useAppDispatch();
    // const rootState = useRootState();
      const [totalCount, setTotalCount] = useState(0);
      const [succeededCount, setSucceededCount] = useState(0);
      const [failedCount, setFailedCount] = useState(0);
      const [store, setStore] = useState<any[]>([]);
      const [loading, setLoading] = useState(false);
      const rootState = useRootState();
      const onSubmit = useCallback(async () => {
        try {
          
          const res = await api.postAsync(Urls.import_parties, failedCount > 0 && succeededCount > 0 ? store.filter((row: any) => row.isValid === true) : store);
          handleResponse(res, () => { }, () => { });
        } catch (error) {
          console.error(error);
          // setShowValidation(true);
        } finally {
          setLoading(false);
        }
        setLoading(true);
    
      }, [store]);
    
      const onChooseTemplate = async () => {
        try {
          const res = await api.postAsync(Urls.download_party_format, null, {
            responseType: 'arraybuffer'
          });
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "mjv.xlsx";
    
          // Trigger download
          document.body.appendChild(link);
          link.click();
    
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        } catch (error) {
          console.error('Download failed:', error);
          // Handle error appropriately
        }
      };
    
      const onSelectExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          let formData = new FormData();
          formData.append('file', event.target.files[0], event.target.files[0].name);
          setLoading(true);
          const res = await api.post(Urls.import_parties_excel, formData, {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          });
          
          setStore(res.items);
          setTotalCount(res.items.length);
          setFailedCount(res.items?.filter((row: any) => row.isValid != true).length || 0);
          setSucceededCount(res.items?.filter((row: any) => row.isValid === true).length || 0);
          setLoading(false);
          handleResponse(res, () => { }, () => { })
        };
      };
      
    
      const onCellPrepared = (e: any) => {
        if (e.rowType === 'data' && e.column.dataField === "siNo" && (e.data.isValid === false || e.data.IsValid === false)) {
          e.cellElement.style.cssText = "background-color:#ffd0d0";
          e.cellElement.title = "Validation failed, Please check entire row.";
          //e.cellElement.style.backgroundColor = 'red';
        }
      }
      const onFocusedCellChanging = (e: { isHighlighted: boolean; }) => {
        e.isHighlighted = true;
      };
    
        // const [gridHeighttwo, setgridHeighttwo] = useState<{
        //   mobile: number;
        //   windows: number;
        // }>({ mobile: 500, windows: 500 });
    
        //  useEffect(() => {
        //     let gridHeighttwoMobile = modalHeight - 50; 
        //     let gridHeighttwoWindows = isMaximized ? modalHeight - 230 : modalHeight - 250; 
        //     setGridHeight({ mobile: gridHeightMobile, windows: gridHeighttwoWindows });
        //   }, [isMaximized,modalHeight]);
    
    
    
      const renderCell = (cellData: any, validation: string) => {
        return (
          <div
            className={validation ? 'grid-error-cell' : ''}
            title={validation ? validation : ''} // Add validation message as tooltip
          >
            {cellData.value}
          </div>
        );
      };
    
    const columnstwo: DevGridColumn[] = useMemo (
      () => [
        {
          dataField: "siNo",
          caption: "",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 50,
        },
        {
          dataField: "ledgerID",
          caption: "LedgerID",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 50,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.ledgerID_Validation),
        },
        {
          dataField: "partyCode",
          caption: "Party Code",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 80,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.partyCode_Validation),
        },
        {
          dataField: "partyName",
          caption: "Party Name",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.partyName_Validation),
        },
        {
          dataField: "displayName",
          caption: "Display Name",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.displayName_Validation),
        },
        {
          dataField: "address1",
          caption: "Address 1",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.address1_Validation),
        },
        {
          dataField: "address2",
          caption: "Address 2",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.address2_Validation),
        },
        {
          dataField: "address3",
          caption: "Address 3",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.address3_Validation),
        },
        {
          dataField: "address4",
          caption: "Address 4",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.address4_Validation),
        },
        {
          dataField: "officePhone",
          caption: "Office Phone",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.officePhone_Validation),
        },
        {
          dataField: "mobilePhone",
          caption: "Mobile Phone",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.mobilePhone_Validation),
        },
        {
          dataField: "faxNumber",
          caption: "Fax Number",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.faxNumber_Validation),
        },
        {
          dataField: "email",
          caption: "Email",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.email_Validation),
        },
        {
          dataField: "billwiseBillApplicable",
          caption: "Billwise Bill Applicable",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 80,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.billwiseBillApplicable_Validation),
        },
        {
          dataField: "creditDays",
          caption: "Credit Days",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 80,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.creditDays_Validation),
        },
        {
          dataField: "creditAmount",
          caption: "Credit Amount",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.creditAmount_Validation),
        },
        {
          dataField: "taxNumber",
          caption: "Tax Number",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.taxNumber_Validation),
        },
        {
          dataField: "cstNumber",
          caption: "CST Number",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.cstNumber_Validation),
        },
        {
          dataField: "partyType",
          caption: "Party Type",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.partyType_Validation),
        },
        {
          dataField: "startDate",
          caption: "Start Date",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.startDate_Validation),
        },
        {
          dataField: "expiryDate",
          caption: "Expiry Date",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.expiryDate_Validation),
        },
        {
          dataField: "isActive",
          caption: "Is Active",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.isActive_Validation),
        },
        {
          dataField: "opBalance",
          caption: "Op Balance",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.opBalance_Validation),
        },
        {
          dataField: "drCr",
          caption: "Dr Cr",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.drCr_Validation),
        },
        {
          dataField: "obDate",
          caption: "Ob Date",
          dataType: "string",
          allowSorting: true,
          allowSearch: true,
          allowFiltering: true,
          allowEditing: true,
          minWidth: 100,
          cellRender: (cellData: any ) => renderCell(cellData, cellData.data.obDate_Validation),
        },
      ], []);


  return (
    <>
      <div className="flex items-center justify-between gap-4 py-1 px-6 dark:bg-dark-bg bg-gray-50 rounded-t-lg w-full mb-0">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                <div className="text-2xl font-bold text-blue">{totalCount}</div>
                <span className="text-sm font-medium text-gray">Total Count</span>
              </div>
              <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                <div className="text-2xl font-bold text-green">{succeededCount}</div>
                <span className="text-sm font-medium text-gray">Succeed</span>
              </div>
              <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                <div className="text-2xl font-bold text-red">{failedCount}</div>
                <span className="text-sm font-medium text-gray">Failure</span>
              </div>
              <ERPButton
                type="button"
                variant="primary"
                disabled={succeededCount == 0}
                onClick={onSubmit}
                title={succeededCount == totalCount ? "Save": "Ignore and Save" }
              />
            </div>
            {/* Buttons Section */}
            <div>
              <ERPButton
                type="button"
                variant="secondary"
                onClick={onChooseTemplate}
                title="Choose Template"
                className="me-3"
              />
              <ERPFileUploadButton
                buttonText="Select Excel"
                handleFileChange={onSelectExcel}
              ></ERPFileUploadButton>
            </div>
          </div>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columnstwo}
                  hideGridAddButton={true}
                  // height={gridHeight}
                  // height="500"
                  // height={"485px"}
                  // style={{ height: "485px !important" }}
                  // columnChooser={{ enabled: false }} // Removes the column chooser button
                  export={{ enabled: false }}       // Removes the export button
                  enableScrollButton={false}
                  ShowGridPreferenceChooser={false}
                  toolbar={{ visible: false }}
                  // showColumnHeaders={false} // Removes the entire header
                  // enablefilter={true}
                  // gridHeader="Account Group test"
                  dataUrl={Urls.account_group}
                  gridId="grd_acc_group"
                  // popupAction={toggleAccountGroupPopup}
                  // gridAddButtonType="popup"
                  reload={rootState?.PopupData?.accountGroup?.reload}
                  // gridAddButtonIcon="ri-add-line"
                  pageSize={40}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>

    </>
  );
};

export default ExcelImport;
