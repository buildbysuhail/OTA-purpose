import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import Urls from "../../../../../redux/urls";
import KsaEInvoiceReportFilter, { KsaEInvoiceReportFilterInitialState } from "./ksa-e-invoice-filter";
import { useCallback, useRef, useState } from "react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../../../helpers/api-client";

interface XmlPayloadData {
  invTransactionMasterId: number;
  voucherType: string;
  voucherForm: string;
  voucherPrefix: string;
  voucherNumber: string;
  customerType: string;
}

interface ZatCaPayloadData {
  invTransactionMasterId: number;
  sentCount: number;
  result: string;
}

const api = new APIClient();
const KsaEInvoiceReportDetailed = () => {
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");
  const [showHeaderButtons, setShowHeaderButtons] = useState(false)
  const [xmlPayloadData, setXmlPayloadData] = useState<XmlPayloadData>({
    invTransactionMasterId: 0,
    voucherType: "",
    voucherForm: "",
    voucherPrefix: "",
    voucherNumber: "",
    customerType: "",
  });

  // Set Za-tca  data
  const [zatPayloadData, setZatPayloadData] = useState<ZatCaPayloadData>({
    invTransactionMasterId: 0,
    sentCount: 0,
    result: "",
  });

  // Row Click Function definition
  const handleRowClick = useCallback((rowData: any) => {
   setShowHeaderButtons(true);
    setXmlPayloadData({
      invTransactionMasterId: rowData.data.invTransactionMasterID,
      voucherType: rowData.data.voucherType,
      voucherForm: rowData.data.voucherForm,
      voucherPrefix: rowData.data.voucherPrefix,
      voucherNumber: rowData.data.voucherNumber,
      customerType: rowData.data.customerType,
    });
    setZatPayloadData({
      invTransactionMasterId: rowData.data.invTransactionMasterID,
      sentCount: rowData.data.sentCount,
      result: rowData.data.result,
    });
    }, []);

    // Row Click Function definition
    // const handleRowClick = (rowData: any) => {
    // setShowHeaderButtons(true);
    // setXmlPayloadData({
    //   invTransactionMasterId: rowData.invTransactionMasterID,
    //   voucherType: rowData.voucherType,
    //   voucherForm: rowData.voucherForm,
    //   voucherPrefix: rowData.voucherPrefix,
    //   voucherNumber: rowData.voucherNumber,
    //   customerType: rowData.customerType,
    // });
    // };

  // It will save into selected folder, but default it shows a verifying alert box, if that fails, it will download
  // Also need to check is there any other methods available for this -  CheckIt
  const saveXmlFile = async (
      fileContent: string,
      suggestedFileName: string,
      contentType: string,
    ): Promise<void> => {
      // Decode base64
      const decodedData = atob(fileContent);
      const byteNumbers = new Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        byteNumbers[i] = decodedData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      // Check if the modern File System Access API is supported
      if ("showSaveFilePicker" in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: suggestedFileName,
            types: [
              {
                description: "XML Files",
                accept: { [contentType]: [".xml"] },
              },
            ],
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();

          console.log("File saved successfully at user-chosen location!");
          return;
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.error("Error saving file:", err);
          }
        }
      }
      // Otherwise Download Option
      console.warn("File System Access API not supported – falling back to download");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };


  // Handle SaveXml button click
  const handleSaveXMLClick = async () => {
    if (!xmlPayloadData.invTransactionMasterId) return;

    try {
      const response = await api.postAsync(
        Urls.ksa_eInvoice_saveXml,
        xmlPayloadData
      );
      saveXmlFile(response.fileContents, response.fileDownloadName, response.contentType);
    } catch (error) {
      console.error("SaveXML API error", error);
    }
  };

  const handleInvoiceToZatCa = async () => {
    if (!xmlPayloadData.invTransactionMasterId) return;

    try {
      
      const response = await api.postAsync(
        Urls.eInvoice_to_zatCa,
        zatPayloadData
      );
    } catch (error) {
      console.error("SaveXML API error", error);
    }
  };

  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      format: "dd-MMM-yyyy",
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "voucherForm",
      caption: t("voucher_form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "counterName",
      caption: t("counter_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
    },
    {
      dataField: "employeeName",
      caption: t("employee_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(cellElement.data.grandTotal, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? ""
            : getFormattedValue(cellElement.data.grandTotal, false, 4);
        }
      },
    },
    {
      dataField: "totalGross",
      caption: t("total_gross"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totalGross == null
              ? ""
              : getFormattedValue(cellElement.data.totalGross, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalGross == null
            ? ""
            : getFormattedValue(cellElement.data.totalGross, false, 4);
        }
      },
    },
    {
      dataField: "vatAmount",
      caption: t("vat_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.vatAmount == null
              ? ""
              : getFormattedValue(cellElement.data.vatAmount, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.vatAmount == null
            ? ""
            : getFormattedValue(cellElement.data.vatAmount, false, 4);
        }
      },
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billDiscount == null
              ? ""
              : getFormattedValue(cellElement.data.billDiscount, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billDiscount == null
            ? ""
            : getFormattedValue(cellElement.data.billDiscount, false, 2);
        }
      },
    },
    {
      dataField: "taxOnDiscount",
      caption: t("tax_on_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.taxOnDiscount == null
              ? ""
              : getFormattedValue(cellElement.data.taxOnDiscount, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.taxOnDiscount == null
            ? ""
            : getFormattedValue(cellElement.data.taxOnDiscount, false, 4);
        }
      },
    },
    {
      dataField: "systemDateTime",
      caption: t("system_date_time"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      format: "dd-MMM-yyyy",
      width: 150,
      showInPdf: true,
    },
    {
      dataField: "customerType",
      caption: t("customer_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "result",
      caption: t("result"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
    },
    {
      dataField: "isReported",
      caption: t("is_reported"),
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 80,
      showInPdf: true,
      dataType: "boolean",
      // cellRender: (
      //   cellElement: any,
      //   cellInfo: any,
      //   filter: any,
      //   exportCell: any
      // ) => <> {cellElement.data.isReported == true || cellElement.data.isReported == 1 ? 'Yes' : "No"}</>
    },
    {
      dataField: "clearanceReceived",
      caption: t("clearance_received"),
      dataType: "boolean",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "responseMsg",
      caption: t("response_msg"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
      visible: false,
      showInPdf: true,
    },
    {
      dataField: "eInvoiceTime",
      caption: t("e_invoice_time"),
      dataType: "datetime",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      format: "dd-MMM-yyyy",
      showInPdf: true,
    },
    // {
    //   dataField: "sentCount",
    //   caption: t("sent_count"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   allowSorting: true,
    //   width: 80,
    // },
    // {
    //   dataField: "invTransactionMasterID",
    //   caption: t("inv_transaction_master_id"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   allowSorting: true,
    //   visible: false,
    //   width: 120,
    // },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={false}
                gridHeader={t("ksa_e_invoice_report_detailed")}
                filterText=" From :{fromDate} - {toDate}"
                dataUrl={Urls.ksa_e_invoice_detailed}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<KsaEInvoiceReportFilter />}
                filterWidth={790}
                filterHeight={280}
                filterInitialData={KsaEInvoiceReportFilterInitialState}
                reload={true}
                gridId="grd_ksa_e_invoice_report_detailed"
                onRowClick={handleRowClick}
                customToolbarItems={[
                  {
                    location: 'before',
                    item: (
                      <>
                      {showHeaderButtons && (
                      <div className="flex gap-1 px-2">
                          <ERPButton title={t("save_xml")} variant="secondary" onClick={()=> handleSaveXMLClick()}/>
                          {/* This button is fix and send again*/}
                          <ERPButton title={t("fix&send_again")} variant="secondary" onClick={()=> handleInvoiceToZatCa()}/>
                    </div>
                    )}
                    </>
                    )
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default KsaEInvoiceReportDetailed;
