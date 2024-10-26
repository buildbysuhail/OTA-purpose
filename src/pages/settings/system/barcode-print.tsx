import React, { Fragment, useMemo, useState, ChangeEvent, FormEvent, useCallback } from "react";
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
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import SystemSettingsApi from "./system-apis";

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

const initialBarcodeFormData = {
  data: {
    formBcode: 0,
    toBcode: 0,
    barCodes: "",
    isFormTo: false,
  },
  validations: {
    formBcode: "",
    toBcode: "",
    barCodes: "",
    isFormTo: "",
  },
}

const initialVoucherFormData = {
  data: {
    vPrefix: "",
    formType: "",
    vType: "si",
    vchNo: 0,
  },
  validations: {
    vPrefix: "",
    formType: "",
    vType: "",
    vchNo: "",
  },
}

const initialBarcodeDescData = {
  data: {
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
  },
  validations: {
    packDate: "",
    expDesc: "",
    note1: "",
    note2: "",
    note3: "",
    note4: "",
    labelDesign: "",
    startRow: "",
    endRow: "",
    inSearch: "",
  },
}

const initialStandardBarcodeData = {
  data: {
    standardPreview: false,
    standardLabelDesign: "",
    printer: "",
  },
  validations: {
    standardPreview: "",
    standardLabelDesign: "",
    printer: "",
  },
}

const BarcodePrint: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  const [barcodeFormLoading, setBarcodeFormLoading] = useState<boolean>(false);
  const [voucherFormLoading, setVoucherFormLoading] = useState<boolean>(false);
  const [barcodeDescLoading, setBarcodeDescLoading] = useState<boolean>(false);
  const [standardBarcodeLoading, setStandardBarcodeLoading] = useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);
  const [barcodeForm, setBarcodeForm] = useState<any>(initialBarcodeFormData);
  const [voucherForm, setVoucherForm] = useState<any>(initialVoucherFormData);
  const [barcodeDesc, setBarcodeDesc] = useState<any>(initialBarcodeDescData);
  const [standardBarcode, setStandardBarcode] = useState<any>(initialStandardBarcodeData);
  const [data, setData] = useState<any>();

  const handleBarcodeStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  };

  const handleVoucherStateChange = (e: any) => {
    debugger;
    const { name, value } = e.target ? e.target : e;
    if(["si","pi","bti","bto","os"].includes(value)) {
      setIsOther(false);
    }
    setVoucherForm((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        vType: value,
      },
    }));
  };

  const handleDescStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setBarcodeDesc((prevData: any) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleDateChange = (id: string, data: any) => {
    if (id === 'formType') {
      setVoucherForm((prev: any) => ({ ...prev, formType: data }));
    }
  };

  const handleStandardBarcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setStandardBarcode((prevData: any) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleComboboxChange = (id: string, data: any) => {
    switch (id) {
      case 'labelDesign':
        setBarcodeDesc((prev: any) => ({ ...prev, labelDesign: data }));
        break;
      case 'standardLabelDesign':
        setStandardBarcode((prev: any) => ({ ...prev, standardLabelDesign: data }));
        break;
      case 'printer':
        setStandardBarcode((prev: any) => ({ ...prev, printer: data }));
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { barcodeForm, voucherForm, barcodeDesc, standardBarcode });
  };

  const barcodeFormSubmit = useCallback(async () => {
    setBarcodeFormLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postBarcodePrint(barcodeForm?.data);
    setBarcodeFormLoading(false);
    debugger;
    setData(response);
  }, []);


  const voucherFormSubmit = useCallback(async () => {
    setVoucherFormLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postVoucherPrint(voucherForm?.data);
    setVoucherFormLoading(false);
    debugger;
    setData(response);
  }, []);


  const barcodeDescSubmit = useCallback(() => {
    setBarcodeDescLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', barcodeDesc.data);
      setBarcodeDescLoading(false);
      setBarcodeDesc((prevData: any) => ({
        ...prevData,
        validations: {
          ...prevData.validations,
        },
      }));
    }, 1000);
  }, [barcodeDesc?.data]);

  const handleStandardBarcodeSubmit = () => {
    setStandardBarcodeLoading(true);
    setTimeout(() => {
      console.log('Standard Barcode Form submitted:', standardBarcode.data);
      setStandardBarcodeLoading(false);
    }, 1000);
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
        dataField: "autoBarcode",
        caption: t("barcode"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "brandName",
        caption: t("brand_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "productBatchID",
        caption: t("batch_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "specification",
        caption: t("specification"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "unitID",
        caption: t("unit_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 100,
      }
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
                      customSize="md"
                      className="w-full"
                      value={barcodeForm.data.formBcode}
                      data={barcodeForm.data}
                      validation={barcodeForm?.validations?.formBcode}
                      onChangeData={(data: any) => {
                        setBarcodeForm((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                      placeholder={t("form")}
                    />
                    <ERPInput
                      id="toBcode"
                      label={t("to")}
                      type="text"
                      value={barcodeForm.data.toBcode}
                      customSize="md"
                      className="w-full"
                      data={barcodeForm.data}
                      validation={barcodeForm?.validations?.toBcode}
                      onChangeData={(data: any) => {
                        setBarcodeForm((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                      placeholder={t("to")}
                    />
                  </div>
                  <ERPInput
                    id="barCodes"
                    label={t("barcode_comma_seperated")}
                    type="text"
                    value={barcodeForm.data.barCodes}
                    customSize="md"
                    className="w-full"
                    data={barcodeForm.data}
                    validation={barcodeForm?.validations?.barCodes}
                    onChangeData={(data: any) => {
                      setBarcodeForm((prev: any) => ({
                        ...prev,
                        data: data,
                      }));
                    }}
                    placeholder={t("comma_separated")}
                  />
                  <div className="flex items-center justify-between">
                    <ERPCheckbox
                      label={t("preview")}
                      id="isFormTo"
                      data={barcodeForm.data}
                      checked={barcodeForm.data.isFormTo}
                      validation={barcodeForm?.validations?.isFormTo}
                      onChangeData={(data: any) => {
                        setBarcodeForm((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                    />
                    <ERPButton
                      title={t("show")}
                      className="px-3 py-1"
                      variant="secondary"
                      disabled={barcodeFormLoading}
                      loading={barcodeFormLoading}
                      onClick={barcodeFormSubmit}
                    />
                  </div>
                </div>
              </div>

              {/* Parent div containing Radio Options and VPrefix/Dates */}
              <div className="flex-1 border p-4 rounded-lg min-h-[200px]">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="space-y-2">
                      
                      {[{key:"si", label: t("sales")},{key:"pi", label: t("purchase")},{key:"bti", label: t("bti")},{key:"bto", label: t("bto")},{key:"os", label: t("os")}].map((_item, index) => (
                      
                        <div
                          key={`type-${_item.key.toLowerCase()}-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <ERPRadio
                            id={`type-${_item.key.toLowerCase()}-${index}`}
                            name="vType"
                            value={_item.key.toLowerCase()}

                            checked={!isOther && voucherForm.data.vType === _item.key.toLowerCase()}
                            onChange={handleVoucherStateChange}

                            label={_item.label}
                          />
                        </div>
                      ))}
                      <div  className="flex items-center space-x-2"
                        >
                          <ERPRadio
                            id=""
                            name="vType"
                            checked={isOther}
                            onChange={() =>{setIsOther(!isOther); handleVoucherStateChange({value: ""})}}

                            label={t("other")}
                          />
                        </div>
                      {isOther && (
                        <div className="flex items-center space-x-2">
                        <ERPInput
                        id="vType_"
                        type="text"
                        inputClassName="w-[100px]"
                        value={voucherForm.data.vType}
                        customSize="md"
                        className="w-full"
                        placeholder={t("voucher_type")}
                        onChange={handleVoucherStateChange}
                      />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <ERPInput
                        id="vPrefix"
                        label={t("VPrefix")}
                        type="text"
                        value={voucherForm.data.vPrefix}
                        customSize="md"
                        className="w-full"
                        placeholder={t("VPrefix")}
                        data={voucherForm.data}
                        validation={voucherForm?.validations?.vPrefix}
                        onChangeData={(data: any) => {
                          setVoucherForm((prev: any) => ({
                            ...prev,
                            data: data,
                          }));
                        }}
                      />
                      <ERPDataCombobox
                        id="formType"
                        field={{
                          id: "formType",
                          required: true,
                          getListUrl: Urls.data_form_type,
                          valueKey: "name",
                          labelKey: "name",
                        }}
                        label={t("form_type")}
                        required={true}
                        data={voucherForm.data}
                        defaultData={voucherForm?.data}
                        value={voucherForm.data.formType}
                        validation={voucherForm?.validations?.formType}
                        onChangeData={(data: any) => {
                          setVoucherForm((prev: any) => ({
                            ...prev,
                            data: data,
                          }));
                        }}
                      />
                      <div className="flex justify-between gap-4">
                        <ERPInput
                          id="vchNo"
                          label={t("bill_no")}
                          type="text"
                          value={voucherForm.data.vchNo}
                          customSize="md"
                          className="w-full"
                          data={voucherForm.data}
                          validation={voucherForm?.validations?.vchNo}
                          onChangeData={(data: any) => {
                            setVoucherForm((prev: any) => ({
                              ...prev,
                              data: data,
                            }));
                          }}
                          placeholder={t("bill_no")}
                        />
                        <div className="mt-[11px]">
                          <ERPButton
                            title={t("show")}
                            className="px-3 py-1"
                            variant="secondary"
                            disabled={voucherFormLoading}
                            loading={voucherFormLoading}
                            onClick={voucherFormSubmit}
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
                    label="Packed Date"
                    value={barcodeDesc.data.packDate}
                    data={barcodeDesc.data}
                    validation={barcodeDesc?.validations?.packDate}
                    onChangeData={(data: any) => {
                      setBarcodeDesc((prev: any) => ({
                        ...prev,
                        data: data,
                      }));
                    }}
                  />
                  <ERPInput
                    id="expDesc"
                    label="Expiry Description"
                    type="text"
                    value={barcodeDesc.data.expDesc}
                    customSize="md"
                    className="w-full"
                    name="expDesc"
                    data={barcodeDesc.data}
                    validation={barcodeDesc?.validations?.expDesc}
                    onChangeData={(data: any) => {
                      setBarcodeDesc((prev: any) => ({
                        ...prev,
                        data: data,
                      }));
                    }}
                    placeholder="Expiry Description"
                  />
                  {[1, 2, 3, 4].map((num) => (
                    <ERPInput
                      key={num}
                      id={`note${num}`}
                      label={`Note ${num}`}
                      type="text"
                      value={barcodeDesc.data[`note${num}` as keyof typeof barcodeDesc.data]}
                      customSize="md"
                      className="w-full"
                      name={`note${num}`}
                      data={barcodeDesc.data}
                      validation={barcodeDesc?.validations[`note${num}` as keyof typeof barcodeDesc.validations]}
                      onChangeData={(data: any) => {
                        setBarcodeDesc((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                      placeholder={`Note ${num}`}
                    />
                  ))}
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
                            getListUrl: Urls.data_form_type,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          label="Label Design"
                          required={true}
                          data={barcodeDesc.data}
                          defaultData={barcodeDesc?.data}
                          value={barcodeDesc.data.labelDesign}
                          validation={barcodeDesc?.validations?.labelDesign}
                          onChangeData={(data: any) => handleComboboxChange("labelDesign", data)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <ERPInput
                          id="startRow"
                          label="Start Row"
                          type="text"
                          value={barcodeDesc.data.startRow}
                          customSize="md"
                          className="w-full"
                          name="startRow"
                          data={barcodeDesc.data}
                          validation={barcodeDesc?.validations?.startRow}
                          onChangeData={(data: any) => {
                            setBarcodeDesc((prev: any) => ({
                              ...prev,
                              data: data,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <ERPInput
                          id="endRow"
                          label="End Row"
                          type="text"
                          value={barcodeDesc.data.endRow}
                          customSize="md"
                          className="w-full"
                          name="endRow"
                          data={barcodeDesc.data}
                          validation={barcodeDesc?.validations?.endRow}
                          onChangeData={(data: any) => {
                            setBarcodeDesc((prev: any) => ({
                              ...prev,
                              data: data,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <ERPCheckbox
                        label="In Search"
                        id="inSearch"
                        data={barcodeDesc.data}
                        validation={barcodeDesc?.validations?.inSearch}
                        onChangeData={(data: any) => {
                          setBarcodeDesc((prev: any) => ({
                            ...prev,
                            data: data,
                          }));
                        }}
                      />
                      <ERPButton
                        title="Print"
                        className="px-3 py-1 w-24"
                        variant="secondary"
                        disabled={barcodeDescLoading}
                        loading={barcodeDescLoading}
                        onClick={barcodeDescSubmit}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side */}
                

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
                  data={data}
                  
                  gridId="grd_barcode_print"
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
    </Fragment>
  );
};

export default BarcodePrint;