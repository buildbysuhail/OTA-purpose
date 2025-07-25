import React, { useCallback, useMemo, useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { APIClient } from "../../../../helpers/api-client";
import { handleResponse } from "../../../../utilities/HandleResponse";
import Urls from "../../../../redux/urls";
import ERPFileUploadButton from "../../../../components/ERPComponents/erp-file-upload-button";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const api = new APIClient();
interface HeaderProps {
  downloadImportTemplateHeadersOnly: any;
  importFromExcel: any;
}

const ExcelImport = React.forwardRef<HTMLInputElement, HeaderProps>(
  ({ downloadImportTemplateHeadersOnly, importFromExcel }, ref) => {
     const dispatch = useAppDispatch();
  const { t } = useTranslation("transaction");
  // const rootState = useRootState();
  const [totalCount, setTotalCount] = useState(0);
  const [succeededCount, setSucceededCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [store, setStore] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const rootState = useRootState();
  const onSubmit = useCallback(async () => {
    try {
      const res = await api.postAsync(Urls.import_purchase_excel, failedCount > 0 && succeededCount > 0 ? store.filter((row: any) => row.isValid === true) : store);
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
    debugger;
      downloadImportTemplateHeadersOnly && downloadImportTemplateHeadersOnly()
  }

  const onSelectExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    importFromExcel && importFromExcel(event)
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
      <div className={validation ? 'grid-error-cell' : ''} title={validation ? validation : ''} >
        {cellData.value}
      </div>
    );
  };

const purchaseGridColImport: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "barCode",
        caption: t("barcode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        minWidth: 100,
        alignment: "left",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.barcode_Validation),
      },
      {
        dataField: "quantity",
        caption: t("quantity"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        minWidth: 150,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.quantity_Validation),
      },
      {
        dataField: "discPerc",
        caption: t("disc_perc"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        minWidth: 150,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.discPerc_Validation),
      },
      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        minWidth: 150,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.discount_Validation),
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        minWidth: 200,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.mrp_Validation),
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        minWidth: 200,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.salesPrice_Validation),
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        minWidth: 100,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.purchasePrice_Validation),
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        minWidth: 150,
        alignment: "right",
        cellRender: (cellData: any) => renderCell(cellData, cellData.data.partyName_Validation),
      },
    ], []
  );


  return (
    <>
      <div className="flex items-center justify-between gap-4 py-1 px-6 dark:bg-dark-bg bg-gray-50 rounded-t-lg w-full mb-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
            <div className="text-2xl font-bold text-blue">{totalCount}</div>
            <span className="text-sm font-medium text-gray">{t('total_count')}</span>
          </div>

          <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
            <div className="text-2xl font-bold text-green">{succeededCount}</div>
            <span className="text-sm font-medium text-gray">{t('succeed')}</span>
          </div>

          <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
            <div className="text-2xl font-bold text-red">{failedCount}</div>
            <span className="text-sm font-medium text-gray">{t('failure')}</span>
          </div>
          <ERPButton
            type="button"
            variant="primary"
            disabled={succeededCount == 0}
            onClick={onSubmit}
            title={succeededCount == totalCount ? t("save") : t("ignore_and_save")}
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
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                dataUrl=""
                columns={purchaseGridColImport}
                height={500}
                hideGridAddButton={true}
                export={{ enabled: false }}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                toolbar={{ visible: false }}
                gridId="grd_import_excel"
                pageSize={40}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
  }
);

export default ExcelImport;
