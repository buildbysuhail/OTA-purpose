import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { PartiesManage } from "./parties-manage";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";
import DataGrid, { Column, Scrolling, RemoteOperations, Paging, KeyboardNavigation, } from "devextreme-react/cjs/data-grid";
import ERPFileUploadButton from "../../../../components/ERPComponents/erp-file-upload-button";
interface PartiesProps {
  type: string;
  gridId: string;
}
export const getInitialImportExportData = (type: string) => ({
  data: {
    filePath: "",
    customers: type === 'Cust',
    suppliers: type === 'Supp',
  },
  validations: {
    filePath: "",
    customers: "",
    suppliers: "",
  },
});
interface PartiesForImport {
  ledgerID: number;
  partyCode: string;
  partyName: string;
  displayName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  officePhone: string;
  mobilePhone: string;
  faxNumber: string;
  email: string;
  billwiseBillApplicable: boolean;
  creditDays: number;
  creditAmount: number;
  taxNumber: string;
  cstNumber: string;
  partyType: string;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  opBalance: number;
  drCr: string;
  obDate?: Date | null;
}
const api = new APIClient();
const Parties: React.FC<PartiesProps> = ({ type = 'Cust', gridId = 'grd_cust' }) => {
  const MemoizedPartiesManage = useMemo(() => React.memo(PartiesManage), []);
  const [totalCount, setTotalCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [succeededCount, setSucceededCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [formFile, setFormFile] = useState<FormData>();
  const [importExport, setImportExport] = useState<any>(() => getInitialImportExportData(type));
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [gridHeight, setGridHeight] = useState(500);

  useEffect(() => {
    const wh = window.innerHeight;
    setGridHeight(wh - 400);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validFileTypes = ['application/vnd.ms-excel', 'application/pdf'];
      if (!validFileTypes.includes(file.type)) {
        setShowValidation(true);
        return;
      }
      let formData = new FormData();
      formData.append('file', file, file.name);
      setFormFile(formData);
    }
  };

  const onCellPrepared = (e: any) => {
    if (e.rowType === 'data' && e.column.dataField === "siNo" && (e.data.isValid === false || e.data.IsValid === false)) {
      e.cellElement.style.cssText = "background-color:#ffd0d0";
      e.cellElement.title = "Validation failed, Please check entire row.";
      //e.cellElement.style.backgroundColor = 'red';
    }
  }

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
      link.download = "Parties.xlsx";
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

  const onFocusedCellChanging = (e: { isHighlighted: boolean; }) => {
    e.isHighlighted = true;
  };

  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const renderCell = (cellData: any, validation: string) => {
    return (
      <div className={validation ? 'grid-error-cell' : ''} title={validation ? validation : ''} >
        {cellData.value}
      </div>
    );
  };
  const columns: DevGridColumn[] = ([
    {
      dataField: "siNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      isLocked: true,
      showInPdf: true,
    },
    {
      dataField: "id",
      caption: t('id'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "code",
      caption: t("code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "party",
      caption: type == 'Cust' ? t("customer") : t("supplier"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 250,
      showInPdf: true,
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 250,
      visible: false,
    },
    {
      dataField: "address",
      caption: t("address"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf: true,
    },
    // {
    //   dataField: "ifsc",
    //   caption: t("ifsc"),
    //   dataType: "number",
    //   allowSorting: true,
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    // },
    {
      dataField: "officePhone",
      caption: t("office_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "workPhone",
      caption: t("work_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false
    },
    {
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "faxNumber",
      caption: t("care_of_party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "webURL",
      caption: t("web_URL"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "email",
      caption: t("email"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "startDate",
      caption: t("start_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "creditDays",
      caption: t("credit_days"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "creditAmount",
      caption: t("credit_amount"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "priceCategoryName",
      caption: t("price_category_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "cstNumber",
      caption: t("cst_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "userName",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true
    },
    {
      dataField: "buildingNumber",
      caption: t("building_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false
    },
    {
      dataField: "plotIdentificationNumber",
      caption: t("plot_identification_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "postalCode",
      caption: t("postal_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "citySubDivision",
      caption: t("city_sub_division"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "country",
      caption: t("country"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "countrySubEntity",
      caption: t("country_sub_entity"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "idType",
      caption: t("id_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "idNumber",
      caption: t("id_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "parentRoute",
      caption: t("parent_route"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      isLocked: true,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
          edit={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
          delete={{
            onSuccess: () => {
              dispatch(
                toggleParties({
                  isOpen: false,
                  key: null,
                  reload: true,
                })
              );
            },
            confirmationRequired: true,
            confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
            url: Urls?.parties, key: cellElement?.data?.id
          }}
        />
      ),
    },
  ]);
  // .filter(x=> x.dataField !== "routeName" ) as DevGridColumn[]??new Array<DevGridColumn>();
  useEffect(() => {
    dispatch(toggleParties({ ...rootState, reload: true }));
  }, []);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={type === "Cust" ? [...columns] : [...columns,
                  {
                    dataField: "routeName",
                    caption: t("route_name"),
                    dataType: "string",
                    allowSorting: true,
                    allowSearch: true,
                    allowFiltering: true,
                    width: 100,
                    showInPdf: true,
                  }]}
                  gridHeader={type === 'Cust' ? t("customers") : t("suppliers")}
                  dataUrl={`${Urls.parties}type/${type}`}
                  gridId={gridId}
                  popupAction={toggleParties}
                  gridAddButtonType="popup"
                  customToolbarItems={[{
                    location: 'after', item: (
                      <button
                        onClick={() => setShowValidation(true)}
                        className="w-[33px] h-[33px] leading-[33px] rounded-full shadow-[0_0.2rem_0.4rem_#0005] text-center dark:bg-dark-bg-header dark:text-dark-text hover:bg-gray-100 text-lg">
                        <i className="ri-upload-line text-sm"></i>
                      </button>)
                  }]}
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleParties({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.parties?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Popup */}
      <ERPModal
        isOpen={rootState.PopupData.parties.isOpen || false}
        title={type === 'Cust' ? t("customer") : t("supplier")}
        width="w-full max-w-[1400px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleParties({ isOpen: false, key: null, reload: false }));
        }}
        content={
          <div className="h-[700px] overflow-y-auto">
            <MemoizedPartiesManage type={type} />
          </div>
        }
      />
      <ERPModal
        isForm={true}
        isOpen={showValidation}
        closeButton="LeftArrow"
        hasSubmit={false}
        closeTitle={t("close")}
        title={t("add_items")}
        width="w-full"
        isFullHeight={true}
        closeModal={() => setShowValidation(false)}
        content={
          <>
            <div className="flex items-center justify-between gap-4 py-4 px-6 dark:bg-dark-bg bg-gray-50 rounded-t-lg w-full mb-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                  <div className="text-2xl font-bold text-blue">{totalCount}</div>
                  <span className="text-sm font-medium text-gray">{t("total_count")}</span>
                </div>
                <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                  <div className="text-2xl font-bold text-green">{succeededCount}</div>
                  <span className="text-sm font-medium text-gray">{t("succeed")}</span>
                </div>
                <div className="flex flex-col items-center p-3 dark:bg-dark-bg-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                  <div className="text-2xl font-bold text-red">{failedCount}</div>
                  <span className="text-sm font-medium text-gray">{t("failure")}</span>
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
                  title={t("choose_template")}
                  className="me-3"
                />
                <ERPFileUploadButton
                  buttonText={t("select_excel")}
                  handleFileChange={onSelectExcel}
                />
              </div>
            </div>

            {/* Grid Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <DataGrid
                dataSource={store}
                height={500}
                showBorders={true}
                showRowLines={true}
                onCellPrepared={onCellPrepared}
                onFocusedCellChanging={onFocusedCellChanging}>
                <KeyboardNavigation
                  editOnKeyPress={true}
                  enterKeyAction="startEdit"
                  enterKeyDirection="row"
                />
                <Paging pageSize={100} />
                <Scrolling mode="standard" />
                <RemoteOperations
                  filtering={false}
                  sorting={false}
                  paging={false}
                />
                <Column
                  dataField="siNo"
                  caption={t("SiNo")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={50}
                />
                <Column
                  dataField="ledgerID"
                  caption={t("ledger_ID")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={50}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.ledgerID_Validation)}
                />
                <Column
                  dataField="partyCode"
                  caption={t("party_code")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={80}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.partyCode_Validation)}
                />
                <Column
                  dataField="partyName"
                  caption={t("party_name")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.partyName_Validation)}
                />
                <Column
                  dataField="displayName"
                  caption={t("display_name")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.displayName_Validation)}
                />
                <Column
                  dataField="address1"
                  caption={t("address_1")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.address1_Validation)}
                />
                <Column
                  dataField="address2"
                  caption={t("address_2")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.address2_Validation)}
                />
                <Column
                  dataField="address3"
                  caption={t("address_3")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.address3_Validation)}
                />
                <Column
                  dataField="address4"
                  caption={t("address_4")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.address4_Validation)}
                />
                <Column
                  dataField="officePhone"
                  caption={t("office_phone")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.officePhone_Validation)}
                />
                <Column
                  dataField="mobilePhone"
                  caption={t("mobile_phone")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.mobilePhone_Validation)}
                />
                <Column
                  dataField="faxNumber"
                  caption={t("fax_number")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.faxNumber_Validation)}
                />
                <Column
                  dataField="email"
                  caption={t("email")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.email_Validation)}
                />
                <Column
                  dataField="billwiseBillApplicable"
                  caption={t("billwise_bill_applicable")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={80}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.billwiseBillApplicable_Validation)}
                />
                <Column
                  dataField="creditDays"
                  caption={t("credit_days")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={80}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.creditDays_Validation)}
                />
                <Column
                  dataField="creditAmount"
                  caption={t("credit_amount")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.creditAmount_Validation)}
                />
                <Column
                  dataField="taxNumber"
                  caption={t("tax_number")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.taxNumber_Validation)}
                />
                <Column
                  dataField="cstNumber"
                  caption={t("cst_number")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.cstNumber_Validation)}
                />
                <Column
                  dataField="partyType"
                  caption={t("party_type")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.partyType_Validation)}
                />
                <Column
                  dataField="startDate"
                  caption={t("start_date")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.startDate_Validation)}
                />
                <Column
                  dataField="expiryDate"
                  caption={t("expiry_date")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.expiryDate_Validation)}
                />
                <Column
                  dataField="isActive"
                  caption={t("is_active")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.isActive_Validation)}
                />
                <Column
                  dataField="opBalance"
                  caption={t("op_balance")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.opBalance_Validation)}
                />
                <Column
                  dataField="drCr"
                  caption={t("drcr")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.drCr_Validation)}
                />
                <Column
                  dataField="obDate"
                  caption={t("ob_date")}
                  dataType="string"
                  allowSorting={true}
                  allowSearch={true}
                  allowFiltering={true}
                  allowEditing={true}
                  minWidth={100}
                  cellRender={(cellData) => renderCell(cellData, cellData.data.obDate_Validation)}
                />
              </DataGrid>
            </div>
          </>
        }
      />
    </Fragment>
  );
};
export default Parties;