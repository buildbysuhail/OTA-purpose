import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import { useDispatch, useSelector } from "react-redux";
import { LoadAndSetTransVoucherFn, resolveWayBillPromise } from "./use-transaction";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { RootState } from "../../../../redux/store";

interface EWayBillDetailsProps {
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  closeModal: () => void;
  formState: TransactionFormState;
  t: any;
}

interface CompanyProfile {
  companyId: number;
  companyName: string;
  pinCode: string;
  tradeTradeName: string;
  address1: string;
  address2: string;
  city: string;
  tax1_Reg_No: string;
  stateName: string;
  stateCode: string;
  dispatchState: string;
}

const api = new APIClient();
const EWayBillDetails: React.FC<EWayBillDetailsProps> = ({
  loadAndSetTransVoucher,
  closeModal,
  t,
  formState,
}) => {
  let ewbInput = "";
  let jsonLoad = false;
  const [initialEWayData, setInitialEWayData] = useState<any>(null);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "si",
        caption: t("sl"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        showInPdf: true,
      },
      {
        dataField: "productName",
        caption: t("productName"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "barCode",
        caption: t("barCode"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
      {
        dataField: "address1",
        caption: t("address_1"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf: true,
      },
    ],
    [t]
  );

  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );

  useEffect(() => {
    const fetchLoadData = async () => {
      if (
        formState.userConfig?.autoEwayBill &&
        applicationSettings.gSTTaxesSettings.enableEWB
      ) {
        ewbInput = "taxproewb";
        jsonLoad = false;
      } else {
        ewbInput = "";
        jsonLoad = true;
      }
      try {
        const initialData = await api.getAsync(
          `${Urls.inv_transaction_base}${formState.transactionType}/Eway?MasterId=${formState?.eWayBillMasterId}&IsJson=${jsonLoad}`
        );
        if (initialData) {
          setInitialEWayData(initialData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLoadData();
  }, [formState?.eWayBillMasterId]);

  const getDocTypeOptions = (supplyType?: string, subSupplyType?: string) => {
    if (supplyType === "O") {
      switch (subSupplyType) {
        case "1":
        case "3":
          return [
            { value: "INV", label: "Tax Invoice" },
            { value: "BIL", label: "Bill of Supply" },
          ];

        case "4":
        case "5":
        case "10":
        case "12":
          return [{ value: "CHL", label: "Delivery Challan" }];

        case "8":
        case "11":
          return [
            { value: "CHL", label: "Delivery Challan" },
            { value: "OTH", label: "Others" },
          ];

        case "9":
          return [
            { value: "INV", label: "Tax Invoice" },
            { value: "BIL", label: "Bill of Supply" },
            { value: "CHL", label: "Delivery Challan" },
          ];

        default:
          return [];
      }
    }

    if (supplyType === "I") {
      switch (subSupplyType) {
        case "1":
          return [
            { value: "INV", label: "Tax Invoice" },
            { value: "BIL", label: "Bill of Supply" },
          ];

        case "2":
          return [{ value: "BOE", label: "Bill of Entry" }];

        case "5":
        case "6":
        case "7":
        case "12":
          return [{ value: "CHL", label: "Delivery Challan" }];

        case "8":
          return [
            { value: "CHL", label: "Delivery Challan" },
            { value: "OTH", label: "Others" },
          ];

        case "9":
          return [
            { value: "BOE", label: "Bill of Entry" },
            { value: "INV", label: "Tax Invoice" },
            { value: "BIL", label: "Bill of Supply" },
            { value: "CHL", label: "Delivery Challan" },
          ];

        default:
          return [];
      }
    }

    return [];
  };
  const [isUsingTaxPro, setIsUsingTaxPro] = useState(false);
  // const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile | null>(
  //   null
  // );
  // useEffect(() => {
  //   const loadCompanyProfiles = async () => {
  //     try {
  //       const responseData = await api.getAsync(Urls.CompanyProfileIndia);
  //       setCompanyProfiles(responseData ?? null);
  //     } catch (error) {
  //       console.error("Failed to load company profiles:", error);
  //       setCompanyProfiles(null);
  //     }
  //   };

  //   loadCompanyProfiles();
  // }, []);

  // const [gridData, setGridData] = useState<any[]>([]);
  // useEffect(() => {
  //   if (formState?.transaction?.details) {
  //     setGridData(formState.transaction.details);
  //   }
  // }, []);

  const statesList = [
    { display: "ANDAMAN AND NICOBAR", value: 35 },
    { display: "ANDHRA PRADESH", value: 37 },
    { display: "ARUNACHAL PRADESH", value: 12 },
    { display: "ASSAM", value: 18 },
    { display: "BIHAR", value: 10 },
    { display: "CHANDIGARH", value: 4 },
    { display: "CHHATTISGARH", value: 22 },
    { display: "DADRA AND NAGAR HAVELI", value: 26 },
    { display: "DAMAN AND DIU", value: 25 },
    { display: "DELHI", value: 7 },
    { display: "GOA", value: 30 },
    { display: "GUJARAT", value: 24 },
    { display: "HARYANA", value: 6 },
    { display: "HIMACHAL PRADESH", value: 2 },
    { display: "JAMMU AND KASHMIR", value: 1 },
    { display: "JHARKHAND", value: 20 },
    { display: "KARNATAKA", value: 29 },
    { display: "KERALA", value: 32 },
    { display: "LAKSHADWEEP", value: 31 },
    { display: "MADHYA PRADESH", value: 23 },
    { display: "MAHARASHTRA", value: 27 },
    { display: "MANIPUR", value: 14 },
    { display: "MEGHALAYA", value: 17 },
    { display: "MIZORAM", value: 15 },
    { display: "NAGALAND", value: 13 },
    { display: "ODISHA", value: 21 },
    { display: "OTHER COUNTRIES", value: 99 },
    { display: "OTHER TERRITORY", value: 97 },
    { display: "PUDUCHERRY", value: 34 },
    { display: "PUNJAB", value: 3 },
    { display: "RAJASTHAN", value: 8 },
    { display: "SIKKIM", value: 11 },
    { display: "TAMIL NADU", value: 33 },
    { display: "TELANGANA", value: 36 },
    { display: "TRIPURA", value: 16 },
    { display: "UTTAR PRADESH", value: 9 },
    { display: "UTTARAKHAND", value: 5 },
    { display: "WEST BENGAL", value: 19 },
  ];

  const subSupplyTypeOutward = [
    { value: 1, label: "Supply" },
    { value: 3, label: "Export" },
    { value: 4, label: "Job Work" },
    { value: 5, label: "For Own Use" },
    { value: 8, label: "Others" },
    { value: 9, label: "SKD/CKD/Lots" },
    { value: 10, label: "Line Sales" },
    { value: 11, label: "Recipient Not Known" },
    { value: 12, label: "Exhibition or Fairs" },
  ];

  const subSupplyTypeInward = [
    { value: 1, label: "Supply" },
    { value: 2, label: "Import" },
    { value: 5, label: "For Own Use" },
    { value: 6, label: "Job work Returns" },
    { value: 7, label: "Sales Return" },
    { value: 8, label: "Others" },
    { value: 9, label: "SKD/CKD/Lots" },
    { value: 12, label: "Exhibition or Fairs" },
  ];

  const transactionTypeOptions = [
    { value: 1, label: "Regular" },
    { value: 2, label: "Bill To - Ship To" },
    { value: 3, label: "Bill From - Dispatch From" },
    { value: 4, label: "Combination of 2 and 3" },
  ];

  const transportationModes = [
    { Display: "Road", Value: "1" },
    { Display: "Rail", Value: "2" },
    { Display: "Air", Value: "3" },
    { Display: "Ship", Value: "4" },
    { Display: "InTransit", Value: "5" },
  ];

  const vehicleTypes = [
    { Display: "Regular", Value: "R" },
    { Display: "ODC(Over Dimentional Cargo)", Value: "O" },
  ];

  const getSubSupplyOptions = () => {
    if (initialEWayData?.master?.supplyType === "O")
      return subSupplyTypeOutward;
    if (initialEWayData?.master?.supplyType === "I") return subSupplyTypeInward;
    return [];
  };

  const [taxData, setTaxDataDetails] = useState({
    otherValue: "",
    totalValue: "",
    cgst: "",
    sgst: "",
    igst: "",
    cess: "",
    cessNonAdValorem: "",
    totalInvoiceValue: "",
  });
  const handleTaxFieldChange = (field: string, value: any) => {
    setTaxDataDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const docTypeOptions = useMemo(() => {
    return getDocTypeOptions(
      initialEWayData?.master?.supplyType,
      initialEWayData?.master?.subSupplyType
    );
  }, [
    initialEWayData?.master?.supplyType,
    initialEWayData?.master?.subSupplyType,
  ]);

  const validate = async (): Promise<boolean> => {
    const { voucherPrefix, transactionDate } = formState.transaction.master;

    if (!voucherPrefix || voucherPrefix.trim() === "") {
      alert("Document Number is required");
      return false;
    }

    if (!transactionDate) {
      alert("Date is required");
      return false;
    }

    return true;
  };

  // Check the two condition generate function
  const handleClickGenerate = async () => {
    if (ewbInput === "taxproewb" && isUsingTaxPro) {
      const validateResult = await validate();
      if (validateResult) {
        // The end point contains an extra a at the end
        // const response = await api.postAsync(
        //   `${Urls.inv_transaction_base}${formState.transactionType}/Eway`,
        //   initialEWayData
        // );
         // Manage this after api response analyzed
          resolveWayBillPromise(true)
          closeModal()
      }
    } else {
      const validateResult = await validate();
      if (validateResult) {
        // const response = await api.postAsync(
        //   `${Urls.inv_transaction_base}${formState.transactionType}/Eway`,
        //   initialEWayData
        // );
        // Manage this after api response analyzed
          resolveWayBillPromise(true)
          closeModal()
      }
    }
  };

  const formatToInputDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-2 p-2 pb-16">
        {/* LEFT HALF */}
        <div className="col-span-6 grid gap-2 auto-rows-min">
          {/* Document Details */}
          <div className="border p-1.5">
            <h3 className="font-semibold text-xs mb-1">
              {t("document_details")}
            </h3>
            {/* initialEWayData */}
            {/* setInitialEWayData */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <ERPInput
                id="docNo"
                label={t("doc_number")}
                type="string"
                value={initialEWayData?.master?.docNo}
                readOnly={true}
                required={true}
              />
              <ERPDateInput
                id="date"
                label={t("date")}
                value={formatToInputDate(initialEWayData?.master?.docDate)}
                readonly={true}
                required={true}
              />
              <ERPDataCombobox
                id="supplyType"
                label={t("supply_type")}
                field={{
                  id: "supplyType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                options={[
                  { value: "O", label: "Outward" },
                  { value: "I", label: "Inward" },
                ]}
                value={initialEWayData?.master?.supplyType ?? ""}
                onChange={(selected: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      supplyType: selected?.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPDataCombobox
                id="subSupplyType"
                label={t("sub_supply_type")}
                value={
                  initialEWayData?.master?.subSupplyType
                    ? Number(initialEWayData.master.subSupplyType)
                    : null
                }
                options={getSubSupplyOptions()}
                field={{
                  id: "subSupplyType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      subSupplyType: e?.value, // already number
                    },
                  }))
                }
                required={true}
              />

              <ERPDataCombobox
                id="docType"
                label={t("doc_type")}
                value={initialEWayData?.master?.docType ?? ""}
                options={docTypeOptions}
                field={{
                  id: "docType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      docType: e?.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPDataCombobox
                id="transactionType"
                label={t("transaction_type")}
                value={initialEWayData?.master?.transactionType ?? ""}
                options={transactionTypeOptions}
                field={{
                  id: "transactionType",
                  valueKey: "value",
                  labelKey: "label",
                }}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      transactionType: e?.value,
                    },
                  }))
                }
                required={true}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="border p-1.5">
            <h3 className="font-semibold text-xs mb-1">
              {t("company_details")}
            </h3>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <ERPInput
                id="sellerTrdNm"
                label={t("trade_name")}
                value={initialEWayData?.master?.sellerTrdNm ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerTrdNm: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="sellerPIN"
                label={t("pin")}
                type="string"
                value={initialEWayData?.master?.sellerPIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerPIN: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="sellerGSTIN"
                label={t("gstin")}
                value={initialEWayData?.master?.sellerGSTIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerGSTIN: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="sellerLoc"
                label={t("place")}
                value={initialEWayData?.master?.sellerLoc ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerLoc: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="sellerAddr1"
                label={t("address_1")}
                value={initialEWayData?.master?.sellerAddr1 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerAddr1: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />

              <ERPInput
                id="sellerAddr2"
                label={t("address_2")}
                value={initialEWayData?.master?.sellerAddr2 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerAddr2: e.target.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPDataCombobox
                id="sellerStCd"
                label={t("company_state")}
                field={{
                  id: "sellerStCd",
                  valueKey: "value",
                  labelKey: "display",
                }}
                options={statesList}
                value={initialEWayData?.master?.sellerStCd ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      sellerStCd: e?.value, // ✅ correct mapping
                    },
                  }))
                }
                required={true}
              />
              <ERPDataCombobox
                id="actualFromStateCode"
                label={t("dispatch_state")}
                field={{
                  id: "actualFromStateCode",
                  valueKey: "value",
                  labelKey: "display",
                }}
                options={statesList}
                value={
                  initialEWayData?.master?.actualFromStateCode ??
                  initialEWayData?.master?.sellerStCd ??
                  ""
                }
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      actualFromStateCode: e?.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Customer Details */}
          <div className="border p-1.5">
            <h3 className="font-semibold text-xs mb-1">
              {t("customer_details")}
            </h3>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <ERPInput
                id="buyerTrdNm"
                label={t("trade_name")}
                value={initialEWayData?.master?.buyerTrdNm ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerTrdNm: e.target.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="buyerPIN"
                label={t("pin")}
                type="string"
                value={initialEWayData?.master?.buyerPIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerPIN: e.target.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="buyerGSTIN"
                label={t("gstin")}
                value={initialEWayData?.master?.buyerGSTIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerGSTIN: e.target.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="buyerLoc"
                label={t("place")}
                value={initialEWayData?.master?.buyerLoc ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerLoc: e.target.value,
                    },
                  }))
                }
                required={true}
              />
              <ERPInput
                id="buyerAddr1"
                label={t("address_1")}
                value={initialEWayData?.master?.buyerAddr1 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerAddr1: e.target.value,
                    },
                  }))
                }
                required={true}
              />

              <ERPInput
                id="buyerAddr2"
                label={t("address_2")}
                value={initialEWayData?.master?.buyerAddr2 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerAddr2: e.target.value,
                    },
                  }))
                }
                required={true}
              />

              <ERPDataCombobox
                id="buyerStCd"
                label={t("customer_state")}
                field={{
                  id: "buyerStCd",
                  valueKey: "value",
                  labelKey: "display",
                }}
                options={statesList}
                value={initialEWayData?.master?.buyerStCd ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      buyerStCd: e?.value,
                    },
                  }))
                }
                required={true}
              />

              <ERPDataCombobox
                id="actualToStateCode"
                label={t("ship_to_state")}
                field={{
                  id: "actualToStateCode",
                  valueKey: "value",
                  labelKey: "display",
                }}
                options={statesList}
                value={
                  initialEWayData?.master?.actualToStateCode ??
                  initialEWayData?.master?.buyerStCd ??
                  ""
                }
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      actualToStateCode: e?.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Grid */}
          <div className="border h-full p-1.5">
            <ErpDevGrid
              height={250}
              columns={columns}
              data={initialEWayData?.details}
              keyExpr="si"
              gridId="grd_eWay_details"
              hideGridAddButton
              columnHidingEnabled
              hideDefaultExportButton
              hideDefaultSearchPanel
              allowSearching={false}
              allowExport={false}
              enablefilter={false}
              hideToolbar
              remoteOperations={false}
              enableScrollButton={false}
              ShowGridPreferenceChooser={false}
              showPrintButton={false}
              focusedRowEnabled
              selectionMode="single"
            />
          </div>
        </div>
        {/* RIGHT HALF */}
        <div className="col-span-6 grid gap-2 auto-rows-min">
          {/* Despatch Details */}
          <div className="border p-1.5">
            <h3 className="font-semibold text-xs mb-1">
              {t("despatch_details")}
            </h3>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <ERPInput
                id="dispNm"
                label={t("trade_name")}
                value={initialEWayData?.master?.dispNm ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispNm: e.target.value,
                    },
                  }))
                }
              />

              <ERPDataCombobox
                id="dispStCd"
                label={t("state_code")}
                field={{
                  id: "dispStCd",
                  valueKey: "value",
                  labelKey: "display",
                }}
                options={statesList}
                value={initialEWayData?.master?.dispStCd ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispStCd: e?.value,
                    },
                  }))
                }
              />

              <ERPInput
                id="dispAddr1"
                label={t("address_1")}
                className="col-span-2"
                value={initialEWayData?.master?.dispAddr1 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispAddr1: e.target.value,
                    },
                  }))
                }
              />

              <ERPInput
                id="dispAddr2"
                label={t("address_2")}
                value={initialEWayData?.master?.dispAddr2 ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispAddr2: e.target.value,
                    },
                  }))
                }
              />

              <ERPInput
                id="dispLoc"
                label={t("location")}
                value={initialEWayData?.master?.dispLoc ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispLoc: e.target.value,
                    },
                  }))
                }
              />

              <ERPInput
                id="dispGSTIN"
                label={t("gstin")}
                value={initialEWayData?.master?.dispGSTIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispGSTIN: e.target.value,
                    },
                  }))
                }
              />

              <ERPInput
                id="dispPIN"
                label={t("pin_code")}
                value={initialEWayData?.master?.dispPIN ?? ""}
                onChange={(e: any) =>
                  setInitialEWayData((prev: any) => ({
                    ...prev,
                    master: {
                      ...prev.master,
                      dispPIN: e.target.value,
                    },
                  }))
                }
              />
            </div>

            {/* Ship To */}
            <div className="border p-1.5">
              <h3 className="font-semibold text-xs mb-1">
                {t("ship_to_details")}
              </h3>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <ERPInput
                  id="shipTrdNm"
                  label={t("trade_name")}
                  value={initialEWayData?.master?.shipTrdNm ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipTrdNm: e.target.value,
                      },
                    }))
                  }
                />

                <ERPDataCombobox
                  id="shipStCd"
                  label={t("state_code")}
                  field={{
                    id: "shipStCd",
                    valueKey: "value",
                    labelKey: "display",
                  }}
                  options={statesList}
                  value={initialEWayData?.master?.shipStCd ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipStCd: e?.value,
                      },
                    }))
                  }
                />

                <ERPInput
                  id="shipAddr1"
                  label={t("address_1")}
                  className="col-span-2"
                  value={initialEWayData?.master?.shipAddr1 ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipAddr1: e.target.value,
                      },
                    }))
                  }
                />
                <ERPInput
                  id="shipAdd2"
                  label={t("address_2")}
                  value={initialEWayData?.master?.shipAdd2 ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipAdd2: e.target.value,
                      },
                    }))
                  }
                />

                <ERPInput
                  id="shipLoc"
                  label={t("location")}
                  value={initialEWayData?.master?.shipLoc ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipLoc: e.target.value,
                      },
                    }))
                  }
                />

                <ERPInput
                  id="shipGSTIN"
                  label={t("gstin")}
                  value={initialEWayData?.master?.shipGSTIN ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipGSTIN: e.target.value,
                      },
                    }))
                  }
                />

                <ERPInput
                  id="shipPIN"
                  label={t("pin_code")}
                  value={initialEWayData?.master?.shipPIN ?? ""}
                  onChange={(e: any) =>
                    setInitialEWayData((prev: any) => ({
                      ...prev,
                      master: {
                        ...prev.master,
                        shipPIN: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            {/* Transport + Tax */}
            <div className="border p-1.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Transport */}
                <div>
                  <h3 className="font-semibold text-xs mb-1">
                    {t("transport_details")}
                  </h3>

                  <div className="grid gap-1">
                    <ERPDataCombobox
                      id="transMode"
                      label={t("transport_mode")}
                      field={{
                        id: "transMode",
                        valueKey: "Value",
                        labelKey: "Display",
                      }}
                      options={transportationModes}
                      value={initialEWayData?.master?.transMode ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transMode: e?.value,
                          },
                        }))
                      }
                    />

                    <ERPInput
                      id="transDistance"
                      label={t("distance_km")}
                      type="number"
                      value={initialEWayData?.master?.transDistance ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transDistance: Number(e.target.value),
                          },
                        }))
                      }
                      required={true}
                    />

                    <ERPInput
                      id="transporterName"
                      label={t("transport_name")}
                      value={initialEWayData?.master?.transporterName ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transporterName: e.target.value,
                          },
                        }))
                      }
                    />

                    <ERPInput
                      id="transporterId"
                      label={t("transport_id")}
                      value={initialEWayData?.master?.transporterId ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transporterId: e.target.value,
                          },
                        }))
                      }
                    />

                    <ERPInput
                      id="vehicleNo"
                      label={t("vehicle_number")}
                      value={initialEWayData?.master?.vehicleNo ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            vehicleNo: e.target.value,
                          },
                        }))
                      }
                      required={true}
                    />

                    <ERPDataCombobox
                      id="vehicleType"
                      label={t("vehicle_type")}
                      field={{
                        id: "vehicleType",
                        valueKey: "Value",
                        labelKey: "Display",
                      }}
                      options={vehicleTypes}
                      value={initialEWayData?.master?.vehicleType ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            vehicleType: e?.value,
                          },
                        }))
                      }
                    />

                    <ERPDateInput
                      id="transDocDate"
                      label={t("transport_doc_date")}
                      value={
                        initialEWayData?.master?.transDocDate &&
                        initialEWayData.master.transDocDate !== ""
                          ? initialEWayData.master.transDocDate
                          : new Date().toISOString().split("T")[0]
                      }
                      onChange={(value: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transDocDate: value,
                          },
                        }))
                      }
                      disabled={true}
                    />

                    <ERPInput
                      id="transDocNo"
                      label={t("transport_doc_number")}
                      value={initialEWayData?.master?.transDocNo ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            transDocNo: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Tax */}
                <div>
                  <h3 className="font-semibold text-xs mb-1">
                    {t("tax_details")}
                  </h3>

                  <div className="grid grid-cols-2 gap-1">
                    <ERPInput
                      id="othValue"
                      label={t("other_value")}
                      value={initialEWayData?.master?.othValue ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            othValue: Number(e.target.value) || 0,
                          },
                        }))
                      }
                    />

                    <ERPInput
                      id="totValue"
                      label={t("total_value")}
                      value={initialEWayData?.master?.totValue ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totValue: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={true}
                    />

                    <ERPInput
                      id="totCgstAmt"
                      label="CGST"
                      value={initialEWayData?.master?.totCgstAmt ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totCgstAmt: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={true}
                    />

                    <ERPInput
                      id="totSgstAmt"
                      label="SGST"
                      value={initialEWayData?.master?.totSgstAmt ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totSgstAmt: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={true}
                    />

                    <ERPInput
                      id="totIgstAmt"
                      label="IGST"
                      value={initialEWayData?.master?.totIgstAmt ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totIgstAmt: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={true}
                    />

                    <ERPInput
                      id="totCesAmt"
                      label="CESS"
                      value={initialEWayData?.master?.totCesAmt ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totCesAmt: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      readOnly={true}
                    />

                    <ERPInput
                      id="totNonAdvolVal"
                      label={t("cess_non_ad_valorem")}
                      value={initialEWayData?.master?.totNonAdvolVal ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totNonAdvolVal: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      readOnly={true}
                    />

                    <ERPInput
                      id="totInvVal"
                      label={t("total_invoice_value")}
                      value={initialEWayData?.master?.totInvVal ?? ""}
                      onChange={(e: any) =>
                        setInitialEWayData((prev: any) => ({
                          ...prev,
                          master: {
                            ...prev.master,
                            totInvVal: Number(e.target.value) || 0,
                          },
                        }))
                      }
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 flex items-center justify-between z-50">
        <ERPCheckbox
          id="usingTaxPro"
          label={t("using_taxpro")}
          checked={isUsingTaxPro}
          onChange={(e: any) => setIsUsingTaxPro(e.target.checked)}
        />

        <div className="flex gap-1">
          <ERPButton
            title={t("close")}
            variant="secondary"
            className=" text-xs"
            onClick={closeModal}
          />
          <ERPButton
            title={t("generate")}
            className=" text-xs"
            onClick={handleClickGenerate}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(EWayBillDetails);
