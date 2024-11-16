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
import DownloadPreview from "../../LabelDesigner/download-preview";
import { APIClient } from "../../../helpers/api-client";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";

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

const api = new APIClient();
const BarcodePrint: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();

  const [barcodeFormLoading, setBarcodeFormLoading] = useState<boolean>(false);
  const [voucherFormLoading, setVoucherFormLoading] = useState<boolean>(false);
  const [standardBarcodeLoading, setStandardBarcodeLoading] = useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);
  const [barcodeForm, setBarcodeForm] = useState<any>(initialBarcodeFormData);
  const [voucherForm, setVoucherForm] = useState<any>(initialVoucherFormData);
  const [barcodeDesc, setBarcodeDesc] = useState<any>(initialBarcodeDescData);
  const [standardBarcode, setStandardBarcode] = useState<any>(initialStandardBarcodeData);
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);
  const [template, setTemplate] = useState<TemplateState>();
  const [printing, setPrinting] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [columnsPerRow, setColumnsPerRow] = useState<number>(1);

  const handleBarcodeStateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  };

  const handleVoucherStateChange = (e: any) => {

    const { name, value } = e.target ? e.target : e;
    if (["si", "pi", "bti", "bto", "os"].includes(value)) {
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

  const handleComboboxChange = async (id: string, data: any) => {

    switch (id) {
      case 'labelDesign':
        setLoadingTemplate(true);
        setBarcodeDesc((prev: any) => ({ ...prev, data: { ...prev.data, labelDesign: data?.labelDesign } }));
        const res = data?.labelDesign != undefined ? await api.getAsync(`${Urls.templates}${data?.labelDesign}`) : [];

        setTemplate(res);
        setLoadingTemplate(false);
        break;
      case 'standardLabelDesign':
        setStandardBarcode((prev: any) => ({ ...prev, standardLabelDesign: data.standardLabelDesign }));
        break;
      case 'printer':
        setStandardBarcode((prev: any) => ({ ...prev, printer: data.standardLabelDesign }));
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const barcodeFormSubmit = useCallback(async () => {
    debugger;
    setBarcodeFormLoading(true);
    const response =
      await SystemSettingsApi.postBarcodePrint(barcodeForm?.data);
    setBarcodeFormLoading(false);

    setData(response);
  }, [barcodeForm.data]);


  const voucherFormSubmit = useCallback(async () => {
    setVoucherFormLoading(true);
    const response =
      await SystemSettingsApi.postVoucherPrint(voucherForm?.data);
    setVoucherFormLoading(false);

    setData(response);
  }, [voucherForm]);


  const barcodeDescSubmit = useCallback(() => {

    setShowPrint(true);
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
      setBarcodeDesc((prevData: any) => ({
        ...prevData,
        validations: {
          ...prevData.validations,
        },
      }));
    }, 1000);
  }, [barcodeDesc?.data]);



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
              <div className="flex-1 border p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <ERPInput
                      useMUI
                      autoFocus={true}
                      variant="outlined"
                      id="formBcode"
                      label={t("barcode_form")}
                      type="text"
                      customSize="sm"
                      className="w-full"
                      value={barcodeForm.data?.formBcode}
                      data={barcodeForm.data}
                      validation={barcodeForm?.validations?.formBcode}
                      onChangeData={(data: any) => {
                        debugger;
                        setBarcodeForm((prev: any) => ({
                          ...prev,
                          data: data,
                        }));
                      }}
                      placeholder={t("form")}
                    />
                    <ERPInput
                      useMUI
                      variant="outlined"
                      id="toBcode"
                      label={t("to")}
                      type="text"
                      value={barcodeForm.data?.toBcode}
                      customSize="sm"
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
                    useMUI
                    variant="outlined"
                    id="barCodes"
                    label={t("barcode_comma_seperated")}
                    type="text"
                    value={barcodeForm.data?.barCodes}
                    customSize="sm"
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
                      checked={barcodeForm.data?.isFormTo}
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
              <div className="flex-1 border p-4 rounded-lg">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[{ key: "si", label: t("sales") }, { key: "pi", label: t("purchase") }, { key: "bti", label: t("bti") }, { key: "bto", label: t("bto") }, { key: "os", label: t("os") }].map((_item, index) => (
                          <div
                            key={`type-${_item.key.toLowerCase()}-${index}`}
                            className="flex items-center space-x-2"
                          >
                            <ERPRadio
                              id={`type-${_item.key.toLowerCase()}-${index}`}
                              name="vType"
                              value={_item.key.toLowerCase()}
                              checked={!isOther && voucherForm.data?.vType === _item.key.toLowerCase()}
                              onChange={handleVoucherStateChange}
                              label={_item.label}
                            />
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <ERPRadio
                            id="type-other"
                            name="vType"
                            checked={isOther}
                            onChange={() => { setIsOther(!isOther); handleVoucherStateChange({ value: "" }) }}
                            label={t("other")}
                          />
                        </div>
                      </div>

                      {isOther && (
                        <div className="flex items-center space-x-2 mt-4">
                          <ERPInput
                            useMUI
                            variant="outlined"
                            id="vType_"
                            type="text"
                            inputClassName="w-[100px]"
                            value={voucherForm.data?.vType}
                            customSize="sm"
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
                      <div className="flex items-center space-x-2">
                        <ERPInput
                          useMUI
                          variant="outlined"
                          id="vPrefix"
                          label={t("VPrefix")}
                          type="text"
                          value={voucherForm.data?.vPrefix}
                          customSize="sm"
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
                          // value={voucherForm.data?.formType}
                          validation={voucherForm?.validations?.formType}
                          onChangeData={(data: any) => {
                            setVoucherForm((prev: any) => ({
                              ...prev,
                              data: data,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <ERPInput
                          useMUI
                          variant="outlined"
                          id="vchNo"
                          label={t("bill_no")}
                          type="text"
                          value={voucherForm.data?.vchNo}
                          customSize="sm"
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
                        <ERPButton
                          title={t("show")}
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

              {/* Fourth div - Notes Grid */}
              <div className="flex-1 border p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <ERPDateInput
                    useMUI
                    customSize="sm"
                    variant="outlined"
                    id="packDate"
                    type="date"
                    label={t("packed_date")}
                    value={barcodeDesc?.data?.packDate}
                    data={barcodeDesc?.data}
                    validation={barcodeDesc?.validations?.packDate}
                    onChangeData={(data: any) => {
                      setBarcodeDesc((prev: any) => ({
                        ...prev,
                        data: data,
                      }));
                    }}
                  />
                  <ERPInput
                    useMUI
                    variant="outlined"
                    id="expDesc"
                    label={t("expiry_description")}
                    type="text"
                    value={barcodeDesc?.data?.expDesc}
                    customSize="sm"
                    className="w-full"
                    name="expDesc"
                    data={barcodeDesc?.data}
                    validation={barcodeDesc?.validations?.expDesc}
                    onChangeData={(data: any) => {
                      setBarcodeDesc((prev: any) => ({
                        ...prev,
                        data: data,
                      }));
                    }}
                    placeholder={t("expiry_description")}
                  />
                  {[1, 2, 3, 4].map((num: number) => (
                    <ERPInput
                      useMUI
                      variant="outlined"
                      key={num}
                      id={`note${num}`}
                      label={`Note ${num}`}
                      type="text"
                      value={barcodeDesc?.data ? barcodeDesc?.data[`note${num}` as any] : null}
                      customSize="sm"
                      className="w-full"
                      name={`note${num}`}
                      data={barcodeDesc?.data}
                      validation={barcodeDesc?.validations ? barcodeDesc?.validations[`note${num}` as any] : null}
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
                            params: `TemplateType=barcode`,
                            id: "labelDesign",
                            required: true,
                            getListUrl: Urls.data_templates,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          label={t("label_design")}
                          required={true}
                          data={barcodeDesc?.data}
                          defaultData={barcodeDesc?.data}
                          // value={barcodeDesc?.data?.labelDesign}
                          validation={barcodeDesc?.validations?.labelDesign}
                          onChangeData={(data: any) => { handleComboboxChange("labelDesign", data) }}
                        />

                      </div>
                      <div className="flex flex-col">
                        <ERPInput
                          useMUI
                          variant="outlined"
                          id="startRow"
                          label={t("start_row")}
                          type="text"
                          value={barcodeDesc?.data?.startRow}
                          customSize="sm"
                          className="w-full"
                          name="startRow"
                          data={barcodeDesc?.data}
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
                          useMUI
                          variant="outlined"
                          id="endRow"
                          label={t("end_row")}
                          type="text"
                          value={barcodeDesc?.data?.endRow}
                          customSize="sm"
                          className="w-full"
                          name="endRow"
                          data={barcodeDesc?.data}
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
                        label={t("inSearch")}
                        id="inSearch"
                        data={barcodeDesc?.data}
                        validation={barcodeDesc?.validations?.inSearch}
                        onChangeData={(data: any) => {
                          setBarcodeDesc((prev: any) => ({
                            ...prev,
                            data: data,
                          }));
                        }}
                      />
                      <ERPButton
                        title={t("print")}
                        className="px-3 py-1 w-24"
                        variant="secondary"
                        disabled={printing || loadingTemplate}
                        loading={printing || loadingTemplate}
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
      {template && data &&
        <ERPModal
          isOpen={showPrint}
          title={t("barcode_print")}
          isForm={true}
          closeModal={() => {
            setShowPrint(false);
          }}
          content={<DownloadPreview template={template} data={data} />}
        >

        </ERPModal>
      }
    </Fragment>
  );
};

export default BarcodePrint;