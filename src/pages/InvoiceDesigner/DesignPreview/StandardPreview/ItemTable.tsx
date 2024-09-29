import { StyleSheet } from "@react-pdf/renderer";
import { StandardPreviewProps } from ".";
import { dateTrimmer } from "../../../../utilities/Utils";

const ItemTable = ({ template, data, templateGroupId, preferences, currency }: StandardPreviewProps) => {
  //   /// Font
  //   const fontSize = template?.itemTableState?.headerFontSize || 12;
  //   const fontColor = template?.itemTableState?.headerFontColor || "#000";

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;

  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.showTableHeaderBg ? itemTableState?.tableHeaderBgColor : "#fff";

  /// Items
  const backgroundColor = itemTableState?.showRowBg ? itemTableState?.itemRowBgColor : "#fff";
  const color = itemTableState?.itemRowFontColor || "#000";
  const borderColor = itemTableState?.tableBorderColor || "#000";
  const fontSize = itemTableState?.itemRowFontSize;

  const itemDescrFontColor = itemTableState?.itemDescriptionFontColor || "#000"
  const itemDescrFontSize = itemTableState?.itemDescriptionFontSize || 12

  const styles = StyleSheet.create({
    theadStyle: {
      backgroundColor: headerBgColor,
      color: headerFontColor,
      fontSize: headerFontSize,
    },
    tdStyle: {
      borderColor,
      backgroundColor,
      color,
      fontSize,
    }
  })

  return (
    <div style={{ paddingLeft, paddingRight }}>
      <table className="w-full">
        <thead>
          <tr style={styles?.theadStyle} className="bg-slate-100 text-xs">

            {itemTableState?.showLineItemNumber && <th className=" border-b border-gray-50 p-1">#</th>}
            {(itemTableState?.showLineItem || itemTableState?.showDiscription) && (
              <th className=" border-b border-gray-50 p-1">
                {itemTableState?.showLineItem && (itemTableState?.lineItemLabel || "Item")}
                {itemTableState?.showLineItem && itemTableState?.showDiscription && " & "}
                {itemTableState?.showDiscription && (itemTableState?.discriptionLabel || "Description")}
              </th>
            )}

            {itemTableState?.showHsnSac && <th className=" border-b border-gray-50 p-1">{itemTableState?.hsnSacLabel}</th>}
            {itemTableState?.showQuantity && <th className=" border-b border-gray-50 p-1">{itemTableState?.quantityLabel}</th>}
            {itemTableState?.showRate && <th className=" border-b border-gray-50 p-1">{itemTableState?.rateLabel}</th>}

            {itemTableState?.showDiscount && <th className=" border-b border-gray-50 p-1">{itemTableState?.discountLabel ?? "Discount"}</th>}
            {itemTableState?.showTaxPercentage && <th className=" border-b border-gray-50 p-1">{itemTableState?.taxPercentageLabel ?? "Tax %"}</th>}
            {itemTableState?.showTaxAmount && <th className=" border-b border-gray-50 p-1">{itemTableState?.taxAmountLabel ?? "Tax Amount"}</th>}

            {itemTableState?.showAmount && <th className=" border-b border-gray-50 p-1">{itemTableState?.amountLabel}</th>}

            {/** Journal Fields */}
            {itemTableState?.showContactDetails && <th className=" border-b border-gray-50 p-1 text-left">Contact</th>}
            {templateGroupId === "journal_entry" && <th className=" border-b border-gray-50 p-1">Debit</th>}
            {templateGroupId === "journal_entry" && <th className=" border-b border-gray-50 p-1">Credit</th>}

            {/* Inventory Adjustments */}
            {itemTableState?.showQtyAdjustment && <th className="border-b border-gray-50 text-right p-1">{itemTableState?.qtyAdjustmentLabel}</th>}
            {itemTableState?.showValueAdjustment && <th className="border-b border-gray-50 text-right p-1">{itemTableState?.valueAdjustmentLabel}</th>}
          </tr>
        </thead>
        <tbody className=" text-xs">
          {data?.items
            ?.filter((item: any) => {
              // Hiding Zero value items in the list : Invoice Preference controlled
              if (preferences?.invoicePreference?.can_hide_zero_value_line_items && data?.voucher_code === "SI" && data?.total_price !== "0.00")
                return item?.item_rate !== "0.00";
              else return item;
            })
            ?.map((val: any, index: number) => (
              <tr key={`tbr${index} `}>
                {itemTableState?.showLineItemNumber && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.lineItemNumberWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                  >
                    {index + 1}
                  </td>
                )}
                {(itemTableState?.showLineItem || itemTableState?.showDiscription) && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.lineItemWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"}  p-1`}
                  >
                    {itemTableState?.showLineItem && templateGroupId !== "journal_entry" && val?.item_name}
                    {templateGroupId === "journal_entry" && itemTableState?.showLineItem && val?.account_name}
                    {itemTableState?.showAccountCode && <br />}
                    {templateGroupId === "journal_entry" && itemTableState?.showAccountCode && val?.account}
                    {itemTableState?.showLineItem && itemTableState?.showDiscription && <br />}
                    {itemTableState?.showDiscription && <span
                      style={{ color: itemDescrFontColor, fontSize: itemDescrFontSize }}
                      className="text-[10px] text-grey">{val?.description}
                    </span>}
                  </td>
                )}
                {itemTableState?.showHsnSac && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.hsnSacWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                  >
                    {val?.hsn_code}
                  </td>
                )}
                {itemTableState?.showQuantity && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.quantityWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                  >
                    {val?.qty} {itemTableState.showQtyUnit && val?.item_unit?.name}
                  </td>
                )}
                {itemTableState?.showRate && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.rateWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                  >
                    {val?.item_rate}
                  </td>
                )}

                {itemTableState?.showDiscount && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.discountWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                  >
                    {val?.discount_price}
                  </td>
                )}

                {itemTableState?.showTaxPercentage && <td
                  style={{ ...styles.tdStyle, width: itemTableState?.taxPercentageWidth }}
                  className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                >
                  {val?.item_tax_category?.total_percentage}
                </td>}

                {itemTableState?.showTaxAmount && <td
                  style={{ ...styles.tdStyle, width: itemTableState?.taxAmountWidth }}
                  className={`${itemTableState.showTableBorder && "border-b"} text-center p-1`}
                >
                  {(parseFloat(val?.item_rate) * (parseFloat(val?.item_tax_category?.total_percentage) / 100)).toFixed(2)}
                </td>}


                {itemTableState?.showAmount && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.amountWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-right p-1`}
                  >
                    {templateGroupId === "retainer_invoice" ? val?.amount : val?.total_price}
                  </td>
                )}
                {itemTableState?.showContactDetails && (
                  <td
                    style={styles.tdStyle}
                    className={`${itemTableState.showTableBorder && "border-b"} text-left p-1`}
                  >
                    {val?.contact?.name}
                  </td>
                )}
                {templateGroupId === "journal_entry" && (
                  <td
                    style={styles.tdStyle}
                    className={`${itemTableState?.showTableBorder && "border-b"} text-right p-1`}
                  >
                    {val?.debit}
                  </td>
                )}
                {templateGroupId === "journal_entry" && (
                  <td
                    style={styles.tdStyle}
                    className={`${itemTableState?.showTableBorder && "border-b"} text-right p-1`}
                  >
                    {val?.credit}
                  </td>
                )}
                {itemTableState?.showQtyAdjustment && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.qtyAdjustmentWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-right p-1`}
                  >
                    {val?.quantity_adjusted}
                  </td>
                )}
                {itemTableState?.showValueAdjustment && (
                  <td
                    style={{ ...styles.tdStyle, width: itemTableState?.valueAdjustmentWidth }}
                    className={`${itemTableState.showTableBorder && "border-b"} text-right p-1`}
                  >
                    {val?.adjusted_value}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {itemTableState?.statementTable?.showStatementTable && <StatementTableView data={data} template={template} currency={currency} />}
    </div>
  );
};

export default ItemTable;

const StatementTableView = ({ template, data, templateGroupId, currency }: StandardPreviewProps) => {
  const itemTableState = template?.itemTableState;

  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.showTableHeaderBg ? itemTableState?.tableHeaderBgColor : "#fff";

  /// Items
  const backgroundColor = itemTableState?.itemRowBgColor || "#fff";
  const color = itemTableState?.itemRowFontColor || "#000";
  const fontSize = itemTableState?.itemRowFontSize;
  const borderColor = itemTableState?.tableBorderColor;

  const styles = StyleSheet.create({
    theadStyle: {
      backgroundColor: headerBgColor,
      color: headerFontColor,
      fontSize: headerFontSize,
    },
    tdStyle: {
      borderColor,
      backgroundColor,
      color,
      fontSize,
    }
  })

  return (
    <>
      <table className="w-full">
        <thead>
          <tr
            style={styles?.theadStyle}
            className="bg-slate-100 text-xs"
          >
            {itemTableState?.statementTable?.showDateField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.dateFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showTransactionTypeField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.transactionTypeFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showTransactionDetailsField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.transactionDetailsFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showAmountField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.amountFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showPaymentField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.paymentFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showRefundField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.refundFieldLabel}</th>
            )}
            {itemTableState?.statementTable?.showBalanceField && (
              <th className=" border-b border-gray-50 p-1">{itemTableState?.statementTable?.balanceFieldLabel}</th>
            )}
          </tr>
        </thead>
        <tbody className="text-xs w-full">
          {data?.statementData &&
            data?.statementData[3]?.transactions?.map((transaction: any, index: number) => {
              return (
                <tr key={`ITMTABLE${index} `}>
                  {itemTableState?.statementTable?.showDateField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="">{dateTrimmer(transaction?.date)}</div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showTransactionTypeField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2 `}
                    >
                      <div className="break-words max-w-[80px]"> {transaction?.voucher_code}</div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showTransactionDetailsField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="break-words max-w-[100px]"> </div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showAmountField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="break-words max-w-[50px]"> {transaction?.amount}</div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showPaymentField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="break-words max-w-[50px]"> {isNaN(transaction?.payments) ? "" : parseFloat(transaction?.payments)}</div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showRefundField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="break-words max-w-[50px]"> -- </div>
                    </td>
                  )}
                  {itemTableState?.statementTable?.showBalanceField && (
                    <td
                      style={styles?.tdStyle}
                      className={`${itemTableState.showTableBorder && "border-b"} p-1 px-2`}
                    >
                      <div className="break-words max-w-[50px]"> {transaction?.balance}</div>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {itemTableState?.statementTable?.showBalanceField && (
        <div className="py-1 w-full text-xs text-right pr-5">
          Balance : {currency} {data?.statementData?.[4]?.balance_due || "0.00"}{" "}
        </div>
      )}
    </>
  );
};
