import { dateTrimmer } from "../../../../utilities/Utils";
import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const ItemTablePreview = ({ template, data, templateGroupId }: DownloadPreviewProps) => {
  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || 12;
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.tableHeaderBgColor || "#fff";

  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingTop = template?.propertiesState?.padding?.top || 10;

  /// Items
  const ItemsfontSize = itemTableState?.itemRowFontSize;
  const ItemsborderColor = itemTableState?.tableBorderColor;
  const Itemscolor = itemTableState?.itemRowFontColor || "#000";
  const ItemsBackgroundColor = itemTableState?.showRowBg ? itemTableState?.itemRowBgColor : "#fff";

  const itemDescriptionColor = itemTableState?.itemDescriptionFontColor || "#000";
  const itemDescriptionFontSize = itemTableState?.itemDescriptionFontSize || 10;

  const styles = StyleSheet?.create({
    theadStyle: {
      display: "flex",
      flexDirection: "row",
      color: headerFontColor,
      fontSize: headerFontSize,
      backgroundColor: headerBgColor,
    },
    thStyle: {
      height: "30px",
      padding: "5pt",
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      flexDirection: "column",
      justifyContent: "center",
    },
    trStyle: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around"
    }

  })

  return (
    <View style={{ paddingLeft, paddingRight }}>
      <View style={styles?.theadStyle}>
        {itemTableState?.showLineItemNumber && (
          <View style={[styles?.thStyle, { flex: "0.5" }]}><Text>#</Text></View>
        )}

        {(itemTableState?.showLineItem || itemTableState?.showDiscription) && (
          <View style={[styles?.thStyle, { flex: "3" }]}>
            <Text>
              {itemTableState?.showLineItem && (itemTableState?.lineItemLabel || "Item")}
              {itemTableState?.showLineItem && itemTableState?.showDiscription && " & "}
              {itemTableState?.showDiscription && (itemTableState?.discriptionLabel || "Description")}
            </Text>
          </View>
        )}

        {itemTableState?.showHsnSac && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.hsnSacLabel}</Text>
          </View>
        )}
        {itemTableState?.showQuantity && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.quantityLabel}</Text>
          </View>
        )}
        {itemTableState?.showRate && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.rateLabel}</Text>
          </View>
        )}

        {itemTableState?.showDiscount && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.discountLabel}</Text>
          </View>
        )}

        {itemTableState?.showTaxPercentage && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.taxPercentageLabel ?? "Tax %"}</Text>
          </View>
        )}

        {itemTableState?.showTaxAmount && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.taxAmountLabel ?? "Tax Amount"}</Text>
          </View>
        )}

        {itemTableState?.showAmount && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.amountLabel}</Text>
          </View>
        )}

        {/** Journal Fields */}
        {itemTableState?.showContactDetails && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>Contact</Text>
          </View>
        )}

        {templateGroupId === "journal_entry" && (
          <>
            <View style={[styles?.thStyle, { flex: "2" }]}>
              <Text>Debit</Text>
            </View>
            <View style={[styles?.thStyle, { flex: "2" }]}>
              <Text>Credit</Text>
            </View>
          </>
        )}

        {/* Inventory Adjustments */}
        {itemTableState?.showQtyAdjustment && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.qtyAdjustmentLabel}</Text>
          </View>
        )}

        {itemTableState?.showValueAdjustment && (
          <View style={[styles?.thStyle, { flex: "2" }]}>
            <Text>{itemTableState?.valueAdjustmentLabel}</Text>
          </View>
        )}
      </View>
      <View>
        {data?.items
          ?.filter((item: any) => {
            // Hiding Zero value items in the list : Invoice Preference controlled
            // if (preferences?.invoicePreference?.can_hide_zero_value_line_items && data?.voucher_code === "SI" && data?.total_price !== "0.00")
            //   return item?.item_rate !== "0.00";
            // else 
            return item;
          })
          ?.map((val: any, index: number) => (
            <View key={index} style={styles?.trStyle} wrap={false}>
              {itemTableState?.showLineItemNumber && (
                <View
                  style={{
                    flex: "0.5",
                    height: "auto",
                    padding: "5pt",
                    display: "flex",
                    color: Itemscolor, 
                    flexDirection: "row",
                    fontSize: ItemsfontSize,
                    justifyContent: "center",
                    borderColor: ItemsborderColor,
                    backgroundColor: ItemsBackgroundColor,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                  }}
                >
                  <Text>{index + 1}</Text>
                </View>
              )}
              {(itemTableState?.showLineItem || itemTableState?.showDiscription) && (
                <View
                  style={{
                    flex: "3",
                    padding: "5pt",
                    display: "flex",
                    color: Itemscolor,
                    flexDirection: "column",
                    fontSize: ItemsfontSize,
                    justifyContent: "center",
                    borderColor: ItemsborderColor,
                    backgroundColor: ItemsBackgroundColor,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                  }}
                >
                  {itemTableState?.showLineItem && templateGroupId !== "journal_entry" && <Text>{val?.item_name}</Text>}

                  {templateGroupId === "journal_entry" && itemTableState?.showLineItem && <Text>{val?.account_name}</Text>}
                  {itemTableState?.showAccountCode && <View style={{ display: "flex" }}></View>}
                  {templateGroupId === "journal_entry" && itemTableState?.showAccountCode && <Text>({val?.account})</Text>}

                  {itemTableState?.showLineItem && itemTableState?.showDiscription && <View />}
                  {itemTableState?.showDiscription && <Text
                    style={{
                      color: itemDescriptionColor,
                      fontSize: itemDescriptionFontSize,
                      marginTop: "5px"
                    }}>
                    {val?.description}
                  </Text>}
                </View>
              )}

              {itemTableState?.showHsnSac && (
                <View
                  style={{
                    flex: "2",
                    padding: "5pt",
                    display: "flex",
                    color: Itemscolor,
                    flexDirection: "row",
                    fontSize: ItemsfontSize,
                    justifyContent: "center",
                    borderColor: ItemsborderColor,
                    backgroundColor: ItemsBackgroundColor,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                  }}
                >
                  <Text> {val?.hsn_code}</Text>
                </View>
              )}

              {itemTableState?.showQuantity && (
                <View
                  style={{
                    flex: "2",
                    padding: "5pt",
                    display: "flex",
                    color: Itemscolor,
                    flexDirection: "row",
                    fontSize: ItemsfontSize,
                    justifyContent: "center",
                    borderColor: ItemsborderColor,
                    backgroundColor: ItemsBackgroundColor,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                  }}
                >
                  <Text> {val?.qty} {itemTableState?.showQtyUnit && val?.item_unit?.name}</Text>
                </View>
              )}

              {itemTableState?.showRate && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.item_rate}</Text>
                </View>
              )}

              {itemTableState?.showDiscount && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.discount_price}</Text>
                </View>
              )}

              {itemTableState?.showTaxPercentage && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.item_tax_category?.total_percentage}</Text>
                </View>
              )}

              {itemTableState?.showTaxAmount && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>
                    {(parseFloat(val?.item_rate) * (parseFloat(val?.item_tax_category?.total_percentage) / 100)).toFixed(2)}
                  </Text>
                </View>
              )}

              {itemTableState?.showAmount && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{templateGroupId === "balance_sheet" ? val?.amount : val?.total_price}</Text>
                </View>
              )}
              {itemTableState?.showContactDetails && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.contact?.name}</Text>
                </View>
              )}

              {templateGroupId === "journal_entry" && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.debit}</Text>
                </View>
              )}

              {templateGroupId === "journal_entry" && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.credit}</Text>
                </View>
              )}

              {itemTableState?.showQtyAdjustment && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.quantity_adjusted}</Text>
                </View>
              )}

              {itemTableState?.showValueAdjustment && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: ItemsBackgroundColor,
                    borderColor: ItemsborderColor,
                    color: Itemscolor,
                    fontSize: ItemsfontSize,
                    borderBottomWidth: itemTableState?.showTableBorder ? "2px" : "0px",
                    flex: "2",
                    padding: "5pt",
                  }}
                >
                  <Text>{val?.adjusted_value}</Text>
                </View>
              )}
            </View>
          ))}
      </View>

      {itemTableState?.statementTable?.showStatementTable && <StatementTablePrintView data={data} template={template} />}
    </View>
  );
};

export default ItemTablePreview;

const StatementTablePrintView = ({ data, template }: DownloadPreviewProps) => {
  const itemTableState = template?.itemTableState;

  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.showTableHeaderBg ? itemTableState?.tableHeaderBgColor : "#fff";

  /// Items
  const ItemsfontSize = itemTableState?.itemRowFontSize;
  const ItemsborderColor = itemTableState?.tableBorderColor;
  const Itemscolor = itemTableState?.itemRowFontColor || "#000";
  const ItemsBackgroundColor = itemTableState?.itemRowBgColor || "#fff";

  return (
    <View>
      <View
        style={{
          backgroundColor: headerBgColor,
          color: headerFontColor,
          fontSize: headerFontSize,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {itemTableState?.statementTable?.showDateField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.dateFieldLabel || "Date"}</Text>
          </View>
        )}

        {itemTableState?.statementTable?.showTransactionTypeField && (
          <View
            style={{
              flex: "3",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.transactionTypeFieldLabel || "Transaction Type"}</Text>
          </View>
        )}

        {itemTableState?.statementTable?.showTransactionDetailsField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.transactionDetailsFieldLabel || "Details"}</Text>
          </View>
        )}
        {itemTableState?.statementTable?.showAmountField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.amountFieldLabel || "Amount"}</Text>
          </View>
        )}
        {itemTableState?.statementTable?.showPaymentField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.paymentFieldLabel || "Payment"}</Text>
          </View>
        )}
        {itemTableState?.statementTable?.showRefundField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.refundFieldLabel || "Refund"}</Text>
          </View>
        )}

        {/** Journal Fields */}
        {itemTableState?.statementTable?.showBalanceField && (
          <View
            style={{
              flex: "2",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              padding: "5pt",
            }}
          >
            <Text>{itemTableState?.statementTable?.balanceFieldLabel || "Balance"}</Text>
          </View>
        )}
      </View>
      <View>
        {data?.statementData &&
          data?.statementData[3]?.transactions?.map((transaction: any, index: number) => {
            return (
              <View key={index} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around" }} wrap={false}>
                {itemTableState?.statementTable?.showDateField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",
                    }}
                  >
                    <Text>{dateTrimmer(transaction?.date)}</Text>
                  </View>
                )}

                {itemTableState?.statementTable?.showTransactionTypeField && (
                  <View
                    style={{
                      flex: "3",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text>{transaction?.voucher_code}</Text>
                  </View>
                )}

                {itemTableState?.statementTable?.showTransactionDetailsField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text></Text>
                  </View>
                )}

                {itemTableState?.statementTable?.showAmountField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text> {transaction?.amount}</Text>
                  </View>
                )}
                {itemTableState?.statementTable?.showPaymentField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text> {parseFloat(transaction?.amount) - transaction?.balance}</Text>
                  </View>
                )}

                {itemTableState?.statementTable?.showRefundField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text>-</Text>
                  </View>
                )}

                {itemTableState?.statementTable?.showBalanceField && (
                  <View
                    style={{
                      flex: "2",
                      padding: "5pt",
                      height: "auto",
                      color: Itemscolor,
                      fontSize: ItemsfontSize,
                      borderColor: ItemsborderColor,
                      backgroundColor: ItemsBackgroundColor,
                      borderBottomWidth: itemTableState.showTableBorder ? "2px" : "0px",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text>{transaction?.balance}</Text>
                  </View>
                )}
              </View>
            );
          })}
        {itemTableState?.statementTable?.showBalanceField && (
          <View
            style={{
              display: "flex",
              paddingRight: "10px",
              paddingVertical: "10px",
              flexDirection: "column",
              fontSize: ItemsfontSize,
              alignItems: "flex-end",
              alignContent: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text>Balance : {data?.statementData?.[4]?.balance_due || "0.00"}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
