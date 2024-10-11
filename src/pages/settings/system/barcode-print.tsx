import React, { Fragment, useMemo, useState, ChangeEvent, FormEvent } from "react";
import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleCounterPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import { CounterManage } from "./counters-manage";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";

interface BarcodeFormData {
  formBcode: number;
  toBcode: number;
  barCodes: string;
  isFormTo: boolean;
}

interface VoucherFormData {
  vPrefix: string;
  formType: string;
  vType: string;
  vchNo: number;
}

interface BarcodeDescData {
  packDate: string;
  note3: string;
  expDesc: string;
  note4: string;
  note1: string;
  note2: string;
  labelDesign: string;
  startRow: string;
  endRow: string;
  inSearch: boolean;
}

interface StandardBarcodeData {
  standardPreview: boolean;
  standardLabelDesign: string;
  printer: string;
}

const BarcodePrint: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  const [barcodeForm, setBarcodeForm] = useState<BarcodeFormData>({
    formBcode: 0,
    toBcode: 0,
    barCodes: "",
    isFormTo: false,
  });

  const [voucherForm, setVoucherForm] = useState<VoucherFormData>({
    vPrefix: "",
    formType: "",
    vType: "",
    vchNo: 0,
  });

  const [barcodeDesc, setBarcodeDesc] = useState<BarcodeDescData>({
    packDate: "",
    expDesc: "",
    note1: "",
    note2: "",
    note3: "",
    note4: "",
    labelDesign: "",
    startRow: "",
    endRow: "",
    inSearch: false,
  });

  const [standardBarcode, setStandardBarcode] = useState<StandardBarcodeData>({
    standardPreview: false,
    standardLabelDesign: "",
    printer: "",
  });

  const handleBarcodeStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setBarcodeForm(prevData => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleVoucherStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVoucherForm(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDescStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setBarcodeDesc(prevData => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleDateChange = (id: string, data: any) => {
    if (id === 'formType') {
      setVoucherForm(prev => ({ ...prev, formType: data }));
    }
  };

  const handleStandardBarcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setStandardBarcode(prevData => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleComboboxChange = (id: string, data: any) => {
    switch (id) {
      case 'labelDesign':
        setBarcodeDesc(prev => ({ ...prev, labelDesign: data }));
        break;
      case 'standardLabelDesign':
        setStandardBarcode(prev => ({ ...prev, standardLabelDesign: data }));
        break;
      case 'printer':
        setStandardBarcode(prev => ({ ...prev, printer: data }));
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { barcodeForm, voucherForm, barcodeDesc, standardBarcode });
  };

  // Define columns for the Counters grid
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "counter",
        caption: t("counter"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "descriptions",
        caption: t("descriptions"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "maintainShift",
        caption: t("maintain_shift"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 60,
      },
      {
        dataField: "createdUser",
        caption: t("created_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "cashLedgerID",
        caption: "Cash Ledger ID",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "ledgerName",
        caption: t("ledger_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "vrPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleCounterPopup({
                      isOpen: true,
                      key: cellElement?.data?.id,
                    })
                  ),
              }}
              edit={{
                type: "popup",
                action: () =>
                  dispatch(
                    toggleCounterPopup({
                      isOpen: true,
                      key: cellElement?.data?.id,
                    })
                  ),
              }}
              delete={{
                confirmationRequired: true,
                confirmationMessage:
                  "Are you sure you want to delete this item?",
                url: `${Urls.Counter}/${cellElement?.data?.id}`,
              }}
            />
          );
        },
      },
    ],
    [t, dispatch]
  );

  return (
    <Fragment>
      <div className="p-0 bg-gray-100 min-h-screen">
        {/* BarcodePrint Form */}
        <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md mx-auto my-0">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:space-x-2 mb-2">
              {/* First div - Barcode Inputs */}
              <div className="flex-1 border p-4 rounded-lg min-h-[200px]">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <ERPInput
                      id="formBcode"
                      label={t("barcode_form")}
                      type="text"
                      value={barcodeForm.formBcode}
                      customSize="md"
                      className="w-full"
                      name="formBcode"
                      onChange={handleBarcodeStateChange}
                      placeholder={t("form")}
                    />
                    <ERPInput
                      id="toBcode"
                      label={t("to")}
                      type="text"
                      value={barcodeForm.toBcode}
                      customSize="md"
                      className="w-full"
                      name="toBcode"
                      onChange={handleBarcodeStateChange}
                      placeholder={t("to")}
                    />
                  </div>
                  <ERPInput
                    id="barCodes"
                    label={t("barcode_comma_seperated")}
                    type="text"
                    value={barcodeForm.barCodes}
                    customSize="md"
                    className="w-full"
                    name="barCodes"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("comma_separated")}
                  />
                  <div className="flex items-center justify-between">
                    <ERPCheckbox
                      label={t("preview")}
                      id="isFormTo"
                      data={barcodeForm.isFormTo}
                      onChange={handleBarcodeStateChange}
                    />
                    <ERPButton
                      title={t("show")}
                      className="px-3 py-1"
                      variant="secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Parent div containing Radio Options and VPrefix/Dates */}
              <div className="flex-1 border p-4 rounded-lg min-h-[200px]">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[t("sales"), t("purchase"), t("bto"), t("bti"), t("os"), t("other")].map((label, index) => (
                        <div
                          key={`type-${label.toLowerCase()}-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <ERPRadio
                            id={`type-${label.toLowerCase()}-${index}`}
                            name="vType"
                            value={label.toLowerCase()}
                            checked={voucherForm.vType === label.toLowerCase()}
                            onChange={handleVoucherStateChange}
                            label={label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <ERPInput
                        id="vPrefix"
                        label={t("VPrefix")}
                        type="text"
                        value={voucherForm.vPrefix}
                        customSize="md"
                        className="w-full"
                        name="vPrefix"
                        onChange={handleVoucherStateChange}
                        placeholder={t("VPrefix")}
                      />
                      <ERPDataCombobox
                        id="formType"
                        field={{
                          id: "formType",
                          required: true,
                          getListUrl: Urls.barcodePrintTransaction,
                          valueKey: "id",
                          labelKey: "name",
                        }}
                        label={t("form_type")}
                        required={true}
                        onChangeData={(data: any) => handleDateChange("formType", data)}
                      />
                      <div className="flex justify-between gap-4">
                        <ERPInput
                          id="vchNo"
                          label={t("bill_no")}
                          type="text"
                          value={voucherForm.vchNo}
                          customSize="md"
                          className="w-full"
                          name="vchNo"
                          onChange={handleVoucherStateChange}
                          placeholder={t("bill_no")}
                        />
                        <div className="mt-[11px]">
                          <ERPButton
                            title={t("show")}
                            className="px-3 py-1"
                            variant="secondary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fourth div - Notes Grid */}
              <div className="flex-1 border p-4 rounded-lg min-h-[200px]">
                <div className="grid grid-cols-2 gap-2">
                  <ERPDateInput
                    id="packDate"
                    type="date"
                    label={t("packed_date")}
                    value={barcodeDesc.packDate}
                    onChange={(e) => handleDescStateChange(e)}
                    // name="packDate"
                  />
                  <ERPInput
                    id="expDesc"
                    label={t("expiry_description")}
                    type="text"
                    value={barcodeDesc.expDesc}
                    customSize="md"
                    className="w-full"
                    name="expDesc"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("exp_desc")}
                  />
                  <ERPInput
                    id="note1"
                    label={t("note_1")}
                    type="text"
                    value={barcodeDesc.note1}
                    customSize="md"
                    className="w-full"
                    name="note1"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("note_1")}
                  />
                  <ERPInput
                    id="note2"
                    label={t("note_2")}
                    type="text"
                    value={barcodeDesc.note2}
                    customSize="md"
                    className="w-full"
                    name="note2"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("note_2")}
                  />
                  <ERPInput
                    id="note3"
                    label={t("note_3")}
                    type="text"
                    value={barcodeDesc.note3}
                    customSize="md"
                    className="w-full"
                    name="note3"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("note_3")}
                  />
                  <ERPInput
                    id="note4"
                    label={t("note_4")}
                    type="text"
                    value={barcodeDesc.note4}
                    customSize="md"
                    className="w-full"
                    name="note4"
                    onChange={handleBarcodeStateChange}
                    placeholder={t("note_4")}
                  />
                </div>
              </div>
            </div>

            {/* Label Design and Row Inputs */}
            <div className="flex gap-4 mb-4 ">
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* Left side */}
                <div className="border p-4 rounded-lg ">
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col">
                        <ERPDataCombobox
                          id="labelDesign"
                          field={{
                            id: "labelDesign",
                            required: true,
                            getListUrl: Urls.data_formtype,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          label={t("label_design")}
                          required={true}
                          onChangeData={(data: any) => handleComboboxChange("labelDesign", data)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <ERPInput
                          id="startRow"
                          label={t("start_row")}
                          type="text"
                          value={barcodeDesc.startRow}
                          customSize="md"
                          className="w-full"
                          name="startRow"
                          onChange={handleBarcodeStateChange}
                          validation=""
                        />
                      </div>
                      <div className="flex flex-col">
                        <ERPInput
                          id="endRow"
                          label={t("end_row")}
                          type="text"
                          value={barcodeDesc.endRow}
                          customSize="md"
                          className="w-full"
                          name="endRow"
                          onChange={handleBarcodeStateChange}
                          validation=""
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <ERPCheckbox
                        label={t("inSearch")}
                        id="inSearch"
                        data={barcodeDesc.inSearch}
                        onChange={handleBarcodeStateChange}
                        validation=""
                      />
                      <ERPButton
                        title={t("print")}
                        className="px-3 py-1 w-24"
                        variant="secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="border p-4 rounded-lg">
                  <div className="w-full">
                    <div className="flex gap-6 justify-between">
                      <div className="flex flex-col space-y-2 ml-4 flex-grow">
                        {/* <ERPSelect
                          id="labelDesign"
                          label="Label Design"
                          options={options}
                          value={selectedFromType}
                          handleChange={handleChange}
                          className="w-full"
                          required={true}
                        /> */}
                        <ERPDataCombobox
                          id="standardLabelDesign"
                          field={{
                            id: "standardLabelDesign",
                            required: true,
                            getListUrl: Urls.data_formtype,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          label={t("label_design")}
                          required={true}
                          onChangeData={(data: any) => handleComboboxChange("standardLabelDesign", data)}
                        />
                        {/* <ERPSelect
                          id="printer"
                          label="Printer"
                          options={options}
                          value={selectedFromType}
                          handleChange={handleChange}
                          className="w-full"
                          required={true}
                        /> */}
                        <ERPDataCombobox
                          id="printer"
                          field={{
                            id: "printer",
                            required: true,
                            getListUrl: Urls.data_formtype,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          label={t("printer")}
                          required={true}
                          onChangeData={(data: any) => handleComboboxChange("printer", data)}
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-9 h-full">
                        <div className="flex flex-start mt-5">
                          <ERPCheckbox
                            id="standardPreview"
                            label={t("preview")}
                            data={standardBarcode.standardPreview}
                            onChange={handleStandardBarcodeChange}
                          />
                        </div>
                        <ERPButton
                          title={t("print")}
                          className="px-3 py-1 w-24"
                          variant="secondary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("barcode_print")}
                  hideGridAddButton={true}
                  hideDefaultSearchPanel={true}
                  hideDefaultExportButton={true}
                  dataUrl={Urls.Counter}
                  gridId="grd_counter"
                  popupAction={toggleCounterPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.barcodeprint?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>

        <ERPModal
          isOpen={rootState.PopupData.counter.isOpen || false}
          title={t("barcode_print")}
          width="w-full max-w-[600px]"
          isForm={true}
          closeModal={() => dispatch(toggleCounterPopup({ isOpen: false }))}
          content={<CounterManage />}
        />
      </div>
    </Fragment>
  );
};

export default BarcodePrint;