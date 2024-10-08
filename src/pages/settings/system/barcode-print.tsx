import React, {
  Fragment,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

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
import { SelectChangeEvent, TextField } from "@mui/material";
import ERPMUIInput from "../../../components/ERPComponents/erp-mui-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPSelect from "../../../components/ERPComponents/erp-select";
import ERPDatePicker from "../../../components/ERPComponents/erp-date-picker";
import dayjs, { Dayjs } from "dayjs";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPMUISelect from "../../../components/ERPComponents/erp-mui-select";
import SelectSmall from "../../../components/ERPComponents/erp-mui-select";
import ERPMUIDatePicker from "../../../components/ERPComponents/erp-mui-date-picker";

// Define the FormData interface
interface FormData {
  barcodeFrom: string;
  barcodeTo: string;
  barcodeComma: string;
  preview: boolean;
  type: string;
  otherType:string;
  vPrefix: string;
  formType: string;
  billNo: string;
  btiValue: string;
  other: string;
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
  standardPreview: boolean;
  standardLabelDesign: string;
  printer: string;
}

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const BarcodePrint: React.FC = () => {
  // Translation hook
  const { t } = useTranslation();

  // Redux dispatch and state
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  // State for the BarcodePrint form
  const [formData, setFormData] = useState<FormData>({
    barcodeFrom: "",
    barcodeTo: "",
    barcodeComma: "",
    preview: false,
    type: "sales",
    otherType:"",
    vPrefix: "",
    formType: "",
    billNo: "",
    btiValue: "",
    other: "",
    packDate: "",
    note3: "",
    expDesc: "",
    note4: "",
    note1: "",
    note2: "",
    labelDesign: "BARCODE.lba",
    startRow: "0",
    endRow: "0",
    inSearch: false,
    standardPreview: false,
    standardLabelDesign: "Barcode Label1.repx",
    printer: "",
  });

  // const [selectedFromType, setSelectedFromType] = useState();
  const [selectedFromType, setSelectedFromType] = useState<string | number>(""); // Use an empty string as the initial value

  const options = [
    { value: "volvo", label: "Volvo" },
    { value: "saab", label: "Saab" },
    { value: "opel", label: "Opel" },
    { value: "audi", label: "Audi" },
  ];

  const newOptions = [
    { value: "adc1", label: "ADC1" },
    { value: "adc2", label: "ADC2" },
    { value: "adc3", label: "ADC3" },
  ];
  const handleChange = (
    event: SelectChangeEvent<string | number> | { id: string; date: string }
  ) => {
    if ("target" in event) {
      // Handle SelectChangeEvent
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      // Handle Date change
      const { id, date } = event;
      setFormData((prevData) => ({
        ...prevData,
        [id]: date,
      }));
    }
  };
  const combinedOptions = [...options, ...newOptions];

  const [date, setDate] = useState(null);

  const handleDateChange = (id: string, date: string) => {
    setFormData((prev) => ({ ...prev, [id]: date }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Optional: Validate the input before updating the state
    if (value.trim() === "") {
      console.warn(`The value for ${name} is empty.`);
    }

    // Update the state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "", // Ensure value is never undefined
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Implement form submission logic here (e.g., API call)
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
        <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto my-0">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4  h-[170px]">
              {/* 1 div */}
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                {/* Barcode Inputs */}

                {/* <div className="lex flex-col sm:flex-row sm:items-center gap-2"> */}
                <div className="w-3/10">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Barcode
                      </label>
                      <div className="flex space-x-2">
                        
                        <ERPMUIInput
                          id="barcodeForm"
                          label="Form"
                          type="text"
                          value={formData.barcodeFrom}
                          customSize="sm"
                          customWidth="100%"
                          name="barcodeFrom"
                          onChange={handleInputChange}
                          placeholder="Form"
                          validation=""
                        />

                        <ERPMUIInput
                          id="barcodeTo"    
                          // label="To"
                          type="text"
                          value={formData.barcodeTo}
                          customSize="sm"
                          customWidth="100%"
                          name="barcodeTo"
                          onChange={handleInputChange}
                          placeholder="To"
                          validation=""
                        />
                      </div>
                    </div>

                    <div>
                      <ERPMUIInput
                        id="barcodeComma"
                        type="text"
                        value={formData.barcodeComma}
                        customSize="sm"
                        customWidth="100%"
                        name="barcodeComma"
                        onChange={handleInputChange}
                        placeholder="Comma Separated"
                        validation=""
                      />
                      <div className="flex flex-col pt-2">
                        <ERPCheckbox
                          id="preview"
                          data={formData} // You might want to pass this if necessary for onChangeData
                          onChange={handleInputChange}
                          validation=""
                        />
                        <div className="flex-1 space-y-2">
                          <ERPButton
                            title="Show"
                            className="px-3 py-1"
                            variant="secondary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 1 barcode form end */}
              </div>
             
              <div className="w-1/6 space-y-0">
                <label className="block text-sm font-semibold text-gray-700">
                  Type
                </label>
                {["Sales", "Purchase", "BTO", "BTI", "OS", "Other"].map(
                  (label, index) => (
                    <div
                      key={`type-${label.toLowerCase()}-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <ERPRadio
                        id={`type-${label.toLowerCase()}-${index}`} // Unique ID for each radio button
                        name="type"
                        value={label.toLowerCase()}
                        checked={formData.type === label.toLowerCase()}
                        onChange={handleInputChange}
                        label={label}
                      />
                      {label === "Other" && (
                        <ERPMUIInput
                          id="Othertype"
                          label=""
                          type="text"
                          value={formData.otherType} // Adjust this value as needed for the form state
                          customSize="sm"
                          customWidth="50%" // Limit the width of the input field
                          name="Othertype"
                          onChange={handleInputChange}
                          placeholder="other type"
                          validation=""
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              {/* 2 div */}
              {/* <div className="flex flex-col lg:flex-row lg:space-x-4"> */}
              <div className="w-3/10 space-y-2">
                <ERPMUIInput
                  id="vPrefix"
                  label="VPrefix"
                  type="text"
                  value={formData.vPrefix}
                  customSize="sm"
                  customWidth="100%"
                  name="vPrefix"
                  onChange={handleInputChange}
                  placeholder="VPrefix"
                  validation=""
                />

                <ERPMUISelect
                  id="FormType"
                  label="Form Type"
                  options={options}
                  value={selectedFromType}
                  handleChange={handleChange}
                  customSize="sm" // You can set it to "sm", "md", "lg", or "auto"
                  customWidth="200px" // Set a custom width
                  required={true}
                />

                <ERPMUIInput
                  id="billNo"
                  label="Bill No"
                  type="text"
                  value={formData.billNo}
                  customSize="sm"
                  customWidth="100%"
                  name="billNo"
                  onChange={handleInputChange}
                  placeholder="Bill No"
                  validation=""
                />

                <div>
                  <div className="flex justify-end space-y-2">
                    <ERPButton
                      title="Show"
                      className="px-3 py-1"
                      variant="secondary" // Choose the appropriate variant if needed
                    />
                  </div>
                </div>
              </div>
              {/* <div className="flex-1 space-y-2"></div> */}
              {/* </div> */}
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2   gap-4">
                  {/* <ERPDateInput
                    type="date"
                    id="begin"
                    // label="Select Date"
                    onChangeData={(data: any) =>
                      handleInputChange("begin", data)
                    }
                  /> */}

                  <ERPMUIDatePicker
                    id="dateField"
                    label="Pack. Date" // Set the label for the date picker
                    data={formData}
                    field={{ id: "dateField" }}
                    defaultData={{ dateField: null }}
                    handleChange={handleChange}
                    onChange={(newValue) =>
                      console.log("Selected date:", newValue)
                    }
                    customSize="sm" // Set size as needed
                    validation="" // Pass any validation message here
                  />

                  <ERPMUIInput
                    id="expDesc"
                    label="Exp Desc"
                    type="text"
                    value={formData.expDesc}
                    customSize="sm"
                    customWidth="100%"
                    name="expDesc"
                    onChange={handleInputChange}
                    placeholder="Exp Desc"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note1"
                    label="Note 1"
                    type="text"
                    value={formData.note1}
                    customSize="sm"
                    customWidth="100%"
                    name="note1"
                    onChange={handleInputChange}
                    placeholder="Note 1"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note2"
                    label="Note 2"
                    type="text"
                    value={formData.note2}
                    customSize="sm"
                    customWidth="100%"
                    name="note2"
                    onChange={handleInputChange}
                    placeholder="Note 2"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note3"
                    label="Note 3"
                    type="text"
                    value={formData.note3}
                    customSize="sm"
                    customWidth="100%"
                    name="note3"
                    onChange={handleInputChange}
                    placeholder="Note 3"
                    validation=""
                  />
                  <ERPMUIInput
                    id="note4"
                    label="Note 4"
                    type="text"
                    value={formData.note4}
                    customSize="sm"
                    customWidth="100%"
                    name="note4"
                    onChange={handleInputChange}
                    placeholder="Note 4"
                    validation=""
                  />
                </div>
              </div>
            </div>
            {/* 3 input end  */}

            {/* Label Design and Row Inputs */}
            <div className="flex gap-4 mb-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left 50% - First Block */}
                <div>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="flex flex-col">
                      <div className="">
                        <ERPMUISelect
                          id="labelDesign"
                          label="Label Design"
                          options={options}
                          value={selectedFromType}
                          handleChange={handleChange}
                          customSize="sm" // You can set it to "sm", "md", "lg", or "auto"
                          customWidth="100%" // Set a custom width
                          required={true}
                          // className= ""
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <ERPMUIInput
                        id="startRow"
                        label="Start Row"
                        type="text"
                        value={formData.startRow}
                        customSize="sm"
                        customWidth="100%"
                        name="startRow"
                        onChange={handleInputChange}
                        validation=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <ERPMUIInput
                        id="endRow"
                        label="End Row"
                        type="text"
                        value={formData.endRow}
                        customSize="sm"
                        customWidth="100%"
                        name="endRow"
                        onChange={handleInputChange}
                        validation=""
                      />
                      <ERPCheckbox
                        id="inSearch"
                        data={formData.inSearch}
                        onChange={handleInputChange}
                        validation=""
                      />
                    </div>
                  </div>
                </div>

                {/* Right 50% - Second Block */}
                <div>
                  <div className="grid grid-cols-4 gap-6">
                    <ERPMUISelect
                      id="labelDesign"
                      label="Label Design"
                      options={options}
                      value={selectedFromType}
                      handleChange={handleChange}
                      customSize="sm" // You can set it to "sm", "md", "lg", or "auto"
                      customWidth="100%" // Set a custom width
                      required={true}
                    />

                    <ERPMUISelect
                      id="printer"
                      label="Printer"
                      options={options}
                      value={selectedFromType}
                      handleChange={handleChange}
                      customSize="sm" // You can set it to "sm", "md", "lg", or "auto"
                      customWidth="100%" // Set a custom width
                      required={true}
                    />
                    <ERPCheckbox
                      id="Standard Preview"
                      data={formData.inSearch}
                      onChange={handleInputChange}
                      validation=""
                    />
                    <div className="flex-1 space-y-2">
                      <ERPButton
                        title="Print"
                        className="px-3 py-1"
                        variant="secondary" // Choose the appropriate variant if needed
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 div  */}
          </form>
        </div>
        {/* Counters Data Grid */}
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPDevGrid
                    columns={columns}
                    // gridHeader={t("counter")}
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
        </div>

        {/* Modal for Counter Management */}
        <ERPModal
          isOpen={rootState.PopupData.counter.isOpen || false}
          title="add_new_counter"
          // title={t("add_new_counter")}
          width="w-full max-w-[600px]"
          isForm={true}
          closeModal={() => {
            dispatch(toggleCounterPopup({ isOpen: false }));
          }}
          content={<CounterManage />}
        />
      </div>
    </Fragment>
  );
};

export default BarcodePrint;
