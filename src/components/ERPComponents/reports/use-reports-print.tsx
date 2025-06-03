import { useDispatch } from "react-redux";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { pdf, BlobProvider } from "@react-pdf/renderer";
import { renderReportSelectedTemplate } from "./Download-report-pdf/report-renderSelected-template";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import moment from "moment";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";

interface printStatement {
    orientation:"portrait"|"landscape";
    data?:any;
    clickedItem?:string;
  }

export const useReportPrint = () => {
    const currentBranch = useCurrentBranch();
    const userSession = useAppSelector((state: RootState) => state.UserSession);
    const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
    const clientSession = useAppSelector(
      (state: RootState) => state.ClientSession
    );

   const { getFormattedValue } = useNumberFormat()
  const handleDirectPrint = async ({orientation,data,clickedItem}:printStatement) => {
    let pdfDocument;
  console.log("data on ledger",data);
  
    pdfDocument =  renderReportSelectedTemplate({
        orientation:orientation,
        data: data,
        currentBranch: currentBranch,
        userSession: userSession,
        printCase:clickedItem,
        getFormattedValue
      });
    try {
      // Create a PDF blob
      const blob = await pdf(pdfDocument).toBlob();
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);
  
      // Open the PDF in a new tab for printing
      const printWindow = window.open(pdfUrl);
      if (!printWindow) {
        console.error("Failed to open print window. Please check your browser settings.");
        alert("Failed to open print window. Please allow popups and try again.");
        return;
      }
      // Wait for the PDF to load in the new tab
      printWindow.onload = () => {
        printWindow.print(); // Trigger print
      };
  
      // Log user action
    //   logUserAction({
    //     action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.formType}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
    //     module: "Voucher Print",
    //     voucherType: formState.transaction.master.voucherType,
    //     voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
    //   });
    } catch (error) {
      console.error("Error printing voucher:", error);
    }
  };
  

  
    const printStatement = async ({orientation,data,clickedItem}:printStatement) => {
      await handleDirectPrint({orientation,data,clickedItem});
    };
    const printCB = async ({orientation,data ,clickedItem}:printStatement) => {
      const api = new APIClient();
      const rpt = await api.postAsync(Urls.get_customer_balance,{LedgerID: data, AsOnDate: moment().local().toDate() })
      await handleDirectPrint({orientation,data: rpt,clickedItem});
    };
    return {
     printStatement,
     printCB
    };
  };