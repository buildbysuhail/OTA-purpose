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
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";
import DataGrid, {
  Toolbar,
  Item,
  Editing,
  Column,
  Scrolling,
  RemoteOperations,
  Paging,
  KeyboardNavigation,
} from "devextreme-react/cjs/data-grid";

interface PartiesProps {
  type: string;
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

const Parties: React.FC<PartiesProps> = ({ type = 'Cust' }) => {
  const MemoizedPartiesManage = useMemo(() => React.memo(PartiesManage), []);
  const [totalCount, setTotalCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [formFile, setFormFile] = useState<FormData>();
  const [importExport, setImportExport] = useState<any>(() => getInitialImportExportData(type));
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [gridHeight, setGridHeight] = useState(500);

  useEffect(() => {
    const initialData = Array.from({ length: 30 }, () => ({
      a: null,
      b: null,
      c: null,
      d: null,
      e: null,
    }));
    setStore(initialData);

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

  const onClose = useCallback(() => {
    setShowPopup(false);
    setShowValidation(false);
  }, []);

  const onSubmit = async () => {
    if (!formFile) {
      setShowValidation(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(Urls.import_parties, formFile, {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      });
      handleResponse(res, () => { }, () => setShowValidation(true));
    } catch (error) {
      console.error(error);
      setShowValidation(true);
    } finally {
      setLoading(false);
    }
  };

  const onFocusedCellChanging = (e: { isHighlighted: boolean; }) => {
    e.isHighlighted = true;
  };

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("SiNo"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      isLocked: true,
    },
    {
      dataField: "id",
      caption: t('id'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
    },
    {
      dataField: "party",
      caption: type == 'Cust' ? t("customer") : t("supplier"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "address",
      caption: t("address1"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "ifsc",
      caption: t("ifsc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "officePhone",
      caption: t("office_phone"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "workPhone",
      caption: t("work_phone"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "faxNumber",
      caption: t("care_of_party"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "webURL",
      caption: t("web_URL"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "email",
      caption: t("email"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "startDate",
      caption: t("start_date"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "expiryDate",
      caption: t("expiry_date"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "creditDays",
      caption: t("credit_days"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "creditAmount",
      caption: t("credit_amount"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "priceCategoryName",
      caption: t("price_category_name"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "cstNumber",
      caption: t("cst_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "userName",
      caption: t("user_name"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "buildingNumber",
      caption: t("building_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "plotIdentificationNumber",
      caption: t("plot_identification_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "postalCode",
      caption: t("postal_code"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "citySubDivision",
      caption: t("city_sub_division"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "country",
      caption: t("country"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "countrySubEntity",
      caption: t("country_sub_entity"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "idType",
      caption: t("id_type"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "idNumber",
      caption: t("id_number"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "parentRoute",
      caption: t("parent_route"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.id }) }}
          edit={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.id }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.parties, key: cellElement?.data?.partyID
          }}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={type === 'Cust' ? t("customers") : t("suppliers")}
                  dataUrl={`${Urls.parties}type/${type}`}
                  gridId="grd_parties"
                  popupAction={toggleParties}
                  gridAddButtonType="popup"
                  customToolbarItems={[{
                    location: 'after', item: (
                      <button
                        onClick={() => setShowValidation(true)}
                        className="w-[33px] h-[33px] leading-[33px] rounded-full shadow-[0_0.2rem_0.4rem_#0005] text-center hover:bg-gray-100 text-lg">
                        <i className="ri-upload-line text-sm"></i>
                      </button>)
                  }]}
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
          dispatch(toggleParties({ isOpen: false, key: null }));
        }}
        content={
          <div className="h-[700px] overflow-y-auto">
            <MemoizedPartiesManage type={type} />
          </div>
        }
      />

      {/* Validation Error Popup */}
      {showValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[1000px] relative">
            <div className="flex flex-col">
              {/* Toolbar Section */}
              <div className="flex items-center justify-between gap-4 py-4 px-6 bg-gray-50 rounded-t-lg w-full mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                    <div className="text-2xl font-bold text-blue">{totalCount}</div>
                    <span className="text-sm font-medium text-gray">Total Count</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                    <div className="text-2xl font-bold text-green">{totalCount}</div>
                    <span className="text-sm font-medium text-gray">Succeed</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow w-28">
                    <div className="text-2xl font-bold text-red">{totalCount}</div>
                    <span className="text-sm font-medium text-gray">Failure</span>
                  </div>
                </div>
                {/* Buttons Section */}
                <div>
                  <ERPButton
                    type="reset"
                    title={t("close")}
                    variant="secondary"
                    onClick={onClose}
                  />
                  <ERPButton
                    type="button"
                    variant="primary"
                    onClick={onSubmit}
                    title="Ignore and Save"
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
                  onFocusedCellChanging={onFocusedCellChanging}
                >
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
                    dataField="ledgerID"
                    caption="LedgerID"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={50}
                  />
                  <Column
                    dataField="partyCode"
                    caption="Party Code"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={80}
                  />
                  <Column
                    dataField="partyName"
                    caption="Party Name"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="displayName"
                    caption="Display Name"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="address1"
                    caption="Address 1"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="address2"
                    caption="Address 2"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="address3"
                    caption="Address 3"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="address4"
                    caption="Address 4"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="officePhone"
                    caption="Office Phone"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="mobilePhone"
                    caption="Mobile Phone"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="faxNumber"
                    caption="Fax Number"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="email"
                    caption="Email"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="billwiseBillApplicable"
                    caption="Billwise Bill Applicable"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={80}
                  />
                  <Column
                    dataField="creditDays"
                    caption="Credit Days"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={80}
                  />
                  <Column
                    dataField="creditAmount"
                    caption="Credit Amount"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="taxNumber"
                    caption="Tax Number"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="cstNumber"
                    caption="CST Number"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="partyType"
                    caption="Party Type"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="startDate"
                    caption="Start Date"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="expiryDate"
                    caption="Expiry Date"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="isActive"
                    caption="Is Active"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="opBalance"
                    caption="Op Balance"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="drCr"
                    caption="Dr Cr"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Column
                    dataField="obDate"
                    caption="Ob Date"
                    dataType="string"
                    allowSorting={true}
                    allowSearch={true}
                    allowFiltering={true}
                    allowEditing={true}
                    minWidth={100}
                  />
                  <Editing
                    allowUpdating={true}
                    allowAdding={false}
                    allowDeleting={false}
                    mode="cell"
                  />
                </DataGrid>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Parties;