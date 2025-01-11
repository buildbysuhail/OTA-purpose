import { useEffect, useState } from "react";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { AccountPreviewProps } from "./index";

const Header = ({
  template,
  data,
  docTitle,
  docIDKey,
  templateGroupId,
  currency,
}: AccountPreviewProps) => {
  const logoWidthRatio = template?.headerState?.logoSize
    ? template.headerState?.logoSize / 100
    : 0.5;
  const headerState = template?.headerState;
  const  totalState = template?.totalState;
  const footerState = template?.footerState;
  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingTop = template?.propertiesState?.padding?.top || 10;

  const titleColor = template?.headerState?.docTitleFontColor || "#000";
  const titleFontSize = headerState?.docTitleFontSize || 16;

  /// font size and color
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle =template?.propertiesState?.label_font_style || "normal";

  /// Header background color
  const backgroundColor = template?.headerState?.bgColor || "#ffff";

  const orgNameFontColor = headerState?.OrganizationFontColor || "#000";
  const orgNameFontSize = headerState?.OrganizationFontSize || 12;
  const billingAddress = data?.addresses?.find(
    (val: any) => val?.address?.address_type?.is_for == "customer"
  );

  const custNameFontColor = headerState?.customerNameFontColor;
  const custNameFontSize = headerState?.customerNameFontSize || 12;

  const docTitleVal = docTitle || headerState?.docTitle;
  const numberField = docTitle && headerState?.numberField;
  const docID = data?.[docIDKey || "sales_invoice_no"] || "";
  const currentBranch = useCurrentBranch();

  /* ######################################################################################### */

  const [generalHeaderBGStyle, setGeneralHeaderBGStyle] = useState<any>({
    height: paddingTop,
    backgroundColor,
    backgroundPosition: "top left",
  });

  useEffect(() => {
    setGeneralHeaderBGStyle((previous: any) => ({
      ...previous,
      backgroundColor: backgroundColor,
      height: paddingTop,
      backgroundImage: `url(${template?.background_image_header})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition:
        template?.headerState?.bg_image_header_position ?? "top left",
      backgroundSize: "cover",
    }));
  }, [template, template?.headerState?.bg_image_header_position]);
  /* ######################################################################################### */

  const styles = {
    labelStyles: {
      color: labelColor,
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
      fontStyle: labelFontStyle,
      fontFamily: fontFamily,
    },
    fontStyles: {
      color,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
    },
  };

  /* ######################################################################################### */

  return (
    <div className="flex flex-col items-center justify-center  w-full border-b border-slate-300 mb-[30px]">
      {/* invoice header bg image  */}
      <div
        style={generalHeaderBGStyle}
        className="top-0 left-0 h-[50px] w-full overflow-hidden"
      ></div>
      {/* Company Info */}
      <div
        style={{ paddingLeft, paddingRight }}
        className=" relative flex w-full z-10 flex-wrap "
      >
        <div className="flex-1 flex flex-col  text-xs ">
          {headerState?.showLogo && (
            <img
              src={currentBranch?.logo}
              style={{ width: 80 * logoWidthRatio }}
              className="my-1"
              draggable={false}
            />
          )}
          {headerState?.showOrgName && (
            <a
              style={{ color: orgNameFontColor, fontSize: orgNameFontSize }}
              className="capitalize font-semibold "
            >
              {currentBranch?.name}
            </a>
          )}
        </div>
        {headerState?.showOrgAddress && (
          <div style={styles.labelStyles} className="flex flex-col">
            {currentBranch.address?.map((org: any, idx: number) => (
              <p key={`ADDK_${idx}`}>{org}</p>
            ))}
          </div>
        )}
        <div className="w-full border-t my-4" />
      </div>
     {/* doc Title */}
      {headerState?.showDocTitle && (
        <a
          style={{ color: titleColor, fontSize: titleFontSize }}
          className="text-[18px] font-medium mb-2 flex items-center border-b border-gray-400"
        >
          {docTitleVal}
        </a>
      )}
      {/* Amount Info */}
      <div
        style={{ paddingLeft, paddingRight }}
        className="relative flex flex-wrap w-full z-10  space-x-10 my-[40px] "
      >
        <div className="flex-1 flex-col space-y-4 basis-2/3">
          {headerState?.showDateField && (
            <div className="flex justify-between items-start">
              <span style={styles.labelStyles}>
                {headerState?.dateField || "Payment Date"}
              </span>
              <span
                style={styles.fontStyles}
                className="border-b border-gray-500 w-2/3"
              >
                {dateTrimmer(data.master?.dueDate)}
              </span>
            </div>
          )}

          {headerState?.showReference && (
            <div className="flex justify-between items-start">
              <span style={styles.labelStyles}>
                {headerState?.reference || "Reference Number"}
              </span>
              <span
                style={styles.fontStyles}
                className="border-b border-gray-500 w-2/3"
              >
                {data.master?.referenceNumber}
              </span>
            </div>
          )}

          {headerState?.showTransactionType && (
            <div className="flex justify-between items-start">
              <span style={styles.labelStyles}>
                {headerState?.transactionType || "Payment Mode"}
              </span>
              <span
                style={styles.fontStyles}
                className="border-b border-gray-500 w-2/3"
              >
               {data?.master.transaction_type ?? "Cash"}
              </span>
            </div>
          )}

          {totalState?.showAmoutInWords && (
            <div className="flex justify-between items-start">
              <span style={styles.labelStyles}>
                Total In Words
              </span>
              <span
                style={styles.fontStyles}
                className="border-b border-gray-500 w-2/3"
              >
               {getAmountInWords(Number(data.master?.totalDebit), currency)}
              </span>
              
            </div>
          )}
        </div>

        <div style={{fontFamily:styles.fontStyles.fontFamily}} className="h-32 w-40 bg-[#65a30d] p-4  opacity-80 flex flex-col items-center justify-center text-white text-sm font-light">
          <p>Amount Received</p>
          <span>{data.master?.totalDebit}</span>
        </div>
      </div>

     <div style={{ paddingLeft, paddingRight }} className="flex justify-between my-[40px] w-full">
     {headerState?.hasBillTo && (
            <div className="flex flex-col w-full ">

                <div style={styles.fontStyles} className="flex-1 flex flex-col space-y-1 items-start ">
                  <a style={styles.labelStyles} >{headerState?.billTo ?? "Received From"}</a>
                  <a style={{ color: custNameFontColor, fontSize: custNameFontSize }} className="">"Nizam Karippali"</a>
                  <a>Dubai</a>
                  <a>Karama 123ft</a>
                  <a>Ho No:1223</a>
                </div>
              
            </div>
      )}
    {footerState?.showSignature && (
       <div className=" flex flex-col w-full justify-start items-end  border-b border-gray-500">
         
         <a
           style={styles.fontStyles}
         >
           {footerState?.signatureLabel ?? "Authority Signature"}
         </a>
  
       {headerState?.showLogo && (
         <img
           src={currentBranch?.logo}
           style={{ width: 80 * logoWidthRatio }}
           draggable={false}
         />
       )}
      
     </div>
    )}

     </div>
    <div style={{ paddingLeft, paddingRight }} className="flex flex-col space-y-1 justify-start my-[40px] w-full">
    {template?.footerState?.showNotesLabel && (
          <>
            <div
              style={styles.labelStyles}
            >
              <a className="">{template?.footerState?.notesLabel || "Notes"} </a>
            </div>
            <a style={{ 
               ...styles.fontStyles,
              fontSize: template?.footerState?.noteFontSize 
              }}>
              { data?.master?.notes ?? "Payment has been received by cash" }
            </a>
          </>
        )}
    </div>
    </div>
  );
};

export default Header;
{
  /* {headerState?.hasBillTo && (
            <div className="flex flex-col w-full flex-wrap">
             
              {data?.customer?.billing_address && (
                <div style={styles.fontStyles} className="flex-1 flex flex-col">
                  <a style={styles.labelStyles} className=" text-[10px] font-bold">Bill To </a>
                  <a style={{ color: custNameFontColor, fontSize: custNameFontSize }} className="">{data?.customer?.name}</a>
                  <a>{data?.customer?.billing_address?.address}</a>
                  <a>{data?.customer?.billing_address?.city}</a>
                  <a>{data?.customer?.billing_address?.country}</a>
                </div>
              )}
            </div>
          )}
     
          {headerState?.hasShipTo && (
            <div className="flex relative w-full z-10 flex-wrap">
              {billingAddress && (
                <div style={styles.fontStyles} className="flex-1 flex flex-col">
                  <a style={styles.labelStyles} className=" text-[10px] font-bold">Ship To</a>
                  <a className="capitalize">{data?.customer?.name},</a>
                  {billingAddress?.address?.address_1 && <a>{billingAddress?.address?.address_1},</a>}
                  {billingAddress?.address?.address_2 && <a>{billingAddress?.address?.address_2},</a>}
                  {billingAddress?.address?.address_3 && <a>{billingAddress?.address?.address_3},</a>}
                  <a>{billingAddress?.address?.zip_code}</a>
                </div>
              )}
            </div>
          )} */
}

{
  /* <div style={styles.fontStyles} className="flex-1 flex flex-col basis-2/3">
          <table>
            <tbody>
              {headerState?.showDateField && (
                <tr>
                  <td style={styles.labelStyles} className="text-[17px] font-bold">
                    {headerState?.dateField || "Payment Date"} 
                  </td>
                  <td className="border-b">{dateTrimmer(data.master?.dueDate)}</td>
                </tr>
              )}

              {headerState?.showReference && data?.ref_number && (
                <tr>
                  <td style={styles.labelStyles} className=" text-[10px] font-bold flex justify-end">
                    {headerState?.reference || "Ref #"} :
                  </td>
                  <td>{data?.ref_number}</td>
                </tr>
              )}

              {headerState?.showDueDate && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    {headerState?.due_date || "Due Date"} :
                  </td>
                  <td>{dateTrimmer(data?.due_date)}</td>
                </tr>
              )}

              {headerState?.showTerms && data?.payment_terms?.name && (
                <tr>
                  <td style={styles.labelStyles} className=" text-[10px] font-bold">
                    {headerState?.terms || "Payment Terms"} :
                  </td>
                  <td>{data?.payment_terms?.name}</td>
                </tr>
              )}

              {data?.project_name && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    Project Name :
                  </td>
                  <td>{data?.project_name}</td>
                </tr>
              )}


              {headerState?.showReasonField && data?.reason?.name && (
                <tr>
                  <td style={styles.labelStyles} className=" text-[10px] font-bold flex justify-end">
                    {headerState?.reasonLabel || "Reason"} :
                  </td>
                  <td>{data?.reason?.name}</td>
                </tr>
              )}
              {headerState?.showAccountField && data?.account_name && (
                <tr>
                  <td style={styles.labelStyles} className=" text-[10px] font-bold flex justify-end">
                    {headerState?.accountLabel || "Account"} :
                  </td>
                  <td>{data?.account_name}</td>
                </tr>
              )}
              {headerState?.showAdjTypeField && data?.mode_adjustment && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold whitespace-nowrap">
                    {headerState?.adjTypeLabel || "Adjustment Type"} :
                  </td>
                  <td>{data?.mode_adjustment}</td>
                </tr>
              )}
              {headerState?.showCreateUserField && data?.created_by && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    {headerState?.createUserLabel || "Created By"} :
                  </td>
                  <td>{data?.created_by?.name}</td>
                </tr>
              )}

              {headerState?.showTransactionType && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    {headerState?.transactionType || "Transaction Type"} :
                  </td>
                  <td>{data?.transaction_type}</td>
                </tr>
              )}

              {headerState?.showAssociatedInvNo && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    {"Invoice #"} :
                  </td>
                  <td>{data?.invoice?.name}</td>
                </tr>
              )}

              {headerState?.showAssociatedInvDate && (
                <tr>
                  <td style={styles.labelStyles} className="text-[10px] font-bold">
                    {"Invoice Date"} :
                  </td>
                  <td>{dateTrimmer(data?.invoice?.date)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */
}

{
  /** */
}
{
  /* {headerState?.recieptInfo?.showReceiptTable && <RecieptTablePreview data={data} template={template} currency={currency} />}
      {headerState?.accountSummary?.showAccountSummary && <AccountSummaryPreview data={data} template={template} currency={currency} />} */
}
{
  /** */
}

// const RecieptTablePreview = ({ data, template, currency }: AccountPreviewProps) => {
//   const headerState = template?.headerState;
//   // const currencySymbol = getCurrentCurrencySymbol();

//   /// Padings
//   const paddingLeft = template?.propertiesState?.padding?.left;
//   const paddingRight = template?.propertiesState?.padding?.right;

//   return (
//     <div
//       style={{
//         paddingLeft,
//         paddingRight,
//       }}
//       className="w-full"
//     >
//       <div className="border-t py-5 flex w-full">
//         <div className=" grid grid-cols-4 py-3 w-full">
//           <div className=" col-span-3 flex flex-col gap-2">
//             {headerState?.recieptInfo?.showReceiptNumber && (
//               <div className=" col-span-1 flex justify-between">
//                 <div className="text-slate-500 w-1/3 text-xs">{headerState?.recieptInfo?.receiptNumberLabel || "Payment #"}</div>
//                 <div className=" border-b w-2/3 text-left text-xs">{data?.voucher_number}</div>
//               </div>
//             )}
//             {headerState?.recieptInfo?.showReceiptDate && (
//               <div className=" col-span-1 flex justify-between">
//                 <div className="text-slate-500 w-1/3 text-xs">{headerState?.recieptInfo?.receiptDateLabel || "Payment Date"}</div>
//                 <div className=" border-b w-2/3 text-left text-xs">{data?.created_at && dateTrimmer(data?.created_at)}</div>
//               </div>
//             )}
//             {headerState?.recieptInfo?.showReceiptReference && (
//               <div className=" col-span-1 flex justify-between">
//                 <div className="text-slate-500 w-1/3 text-xs">{headerState?.recieptInfo?.receiptReferenceLabel || "Reference Number"}</div>
//                 <div className=" border-b w-2/3 text-left text-xs truncate">{data?.reference_number}</div>
//               </div>
//             )}
//             {headerState?.recieptInfo?.showReceiptMode && (
//               <div className=" col-span-1 flex justify-between">
//                 <div className="text-slate-500 w-1/3 text-xs">{headerState?.recieptInfo?.receiptModeLabel || "Payment Mode"}</div>
//                 <div className=" border-b w-2/3 text-left text-xs">{data?.payment_mode?.name}</div>
//               </div>
//             )}
//             {headerState?.recieptInfo?.showReceiptAmount && (
//               <div className=" col-span-1 flex justify-between">
//                 <div className="text-slate-500 w-1/3 text-xs">{"Amount In Words"}</div>
//                 <div className=" border-b w-2/3 text-left text-xs">{getAmountInWords(Number(data?.total_amount), currency)}{ }</div>
//               </div>
//             )}
//           </div>
//           <div className=" col-span-1 px-2">
//             <div
//               style={{
//                 backgroundColor: headerState?.recieptInfo?.amtReceivedBgColor,
//               }}
//               className=" flex flex-col text-xs h-full w-full items-center justify-center"
//             >
//               <div
//                 style={{
//                   fontSize: headerState?.recieptInfo?.amtReceivedFontSize,
//                   color: headerState?.recieptInfo?.amtReceivedFontColor,
//                 }}
//                 className="text-center w-full px-3"
//               >
//                 {headerState?.recieptInfo?.amtReceivedLabel}
//               </div>
//               <div
//                 style={{
//                   fontSize: headerState?.recieptInfo?.amtReceivedFontSize,
//                   color: headerState?.recieptInfo?.amtReceivedFontColor,
//                 }}
//               >
//                 {headerState?.recieptInfo?.currencySymbolPosition !== "after" && currency}
//                 {" "}{data?.total_amount}{" "}
//                 {headerState?.recieptInfo?.currencySymbolPosition === "after" && currency}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const AccountSummaryPreview = ({ data, template, currency }: AccountPreviewProps) => {
//   const headerState = template?.headerState;

//   /// Padings
//   const paddingLeft = template?.propertiesState?.padding?.left;
//   const paddingRight = template?.propertiesState?.padding?.right;

//   return (
//     <div
//       style={{
//         paddingLeft,
//         paddingRight,
//       }}
//       className="flex w-full"
//     >
//       <div className="w-1/2"></div>
//       <div className="w-1/2 flex flex-col text-xs">
//         <div className="border-t border-b py-1 text-right">
//           {data?.customDate
//             ? `From ${data?.customDate?.split("&")[0]?.split("=")[1]}`
//             : `From ${data?.date?.split("&")[0]?.split("=")[1] ?? " 2020-01-01"}`}
//           <span className="px-3">|</span>
//           {data?.customDate
//             ? `To ${data?.customDate?.split("&")[1]?.split("=")[1]}`
//             : `To ${data?.date?.split("&")[1]?.split("=")[1] ?? "2030-12-31"}`}
//         </div>
//         <div className="py-2 my-1 bg-gray-200 px-2">{headerState?.accountSummary?.accountSummaryLabel || "Account Summary"}</div>
//         <div className="flex flex-col gap-1">
//           {headerState?.accountSummary?.showOpeningBalance && (
//             <div className="flex px-2">
//               <div className="w-1/2 ">{headerState?.accountSummary?.openingBalanceLabel || "Opening Balance"}</div>
//               <div className="flex  w-1/2  justify-end">
//                 {(data && data?.statementData?.[0] && `${currency} ${data?.statementData?.[0]?.opening_balance ?? "0.00"}`) ?? "0.00"}
//               </div>
//             </div>
//           )}

//           {headerState?.accountSummary?.showInvoicedAmount && (
//             <div className="flex px-2">
//               <div className="w-1/2 ">{headerState?.accountSummary?.invoicedAmountLabel || "Invoiced Amount"}</div>
//               <div className="flex  w-1/2  justify-end">
//                 {/* {data &&
//                   data?.statementData?.[1] &&
//                   (`${currency} ${data?.statementData?.[1]?.invoice_amount ?? "0.00"}` ??
//                     `${currency} ${data?.statementData?.[1]?.billed_amount ?? "0.00"}` ??
//                     "0.00")} */}
//               </div>
//             </div>
//           )}

//           {headerState?.accountSummary?.showAmountPaid && (
//             <div className="flex px-2">
//               <div className="w-1/2 ">{headerState?.accountSummary?.amountPaidLabel || "Amount Paid"}</div>
//               <div className="flex  w-1/2  justify-end">
//                 {/* {data && data?.statementData?.[2] && (`${currency} ${data?.statementData?.[2]?.payment_received ?? "0.00"}` ?? "0.00")} */}
//               </div>
//             </div>
//           )}
//           {headerState?.accountSummary?.showBalanceDue && (
//             <div className="flex border-t pt-2 mt-1 px-2">
//               <div className="w-1/2 ">{headerState?.accountSummary?.balanceDueLabel || "Balance Due"} </div>
//               <div className="flex  w-1/2  justify-end">
//                 {(data && data?.statementData?.[4] && ` ${currency} ${data?.statementData?.[4]?.balance_due ?? "0.00"}`) || "0.00"}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
