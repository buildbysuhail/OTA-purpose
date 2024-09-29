import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ItemTableState, TemplateState } from "./interfaces";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";

interface ItemTableDesignerProps {
  itemTableState?: ItemTableState;
  onChange?: (state: ItemTableState) => void;
  template?: TemplateState;
}

const LayoutEditor = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");

  return (
    <div className="flex flex-col gap-4">
      <ERPCheckbox
        id="showTableBorder"
        label="Table Border"
        onChange={(e) => onChange?.({ ...itemTableState, showTableBorder: e.target.checked })}
        checked={itemTableState?.showTableBorder}
      />
      {itemTableState?.showTableBorder && (
        <ERPInput
          id="tableBorderColor"
          label="Border Color"
          type="color"
          value={itemTableState?.tableBorderColor}
          onChange={(e) => onChange?.({ ...itemTableState, tableBorderColor: e.target.value })}
        />
      )}
      <h1>Table Header</h1>

      <ERPStepInput
        value={itemTableState?.headerFontSize}
        onChange={(headerFontSize) => onChange?.({ ...itemTableState, headerFontSize })}
        label="Size (8-28)"
        id="headerFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPCheckbox
        id="showTableHeaderBg"
        label="Background"
        onChange={(e) => {
          onChange?.({ ...itemTableState, showTableHeaderBg: e.target.checked });
        }}
        checked={itemTableState?.showTableHeaderBg}
      />
      {itemTableState?.showTableHeaderBg && (
        <ERPInput
          id="tableHeaderBgColor"
          label="Background Color"
          type="color"
          value={itemTableState?.tableHeaderBgColor}
          onChange={(e) => {
            onChange?.({ ...itemTableState, tableHeaderBgColor: e.target.value });
          }}
        />
      )}

      <ERPInput
        id="headerFontColor"
        label="Font Color"
        type="color"
        value={itemTableState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, headerFontColor: e.target.value });
        }}
      />

      <h1>Item Row</h1>
      <ERPStepInput
        value={itemTableState?.itemRowFontSize}
        onChange={(itemRowFontSize) => onChange?.({ ...itemTableState, itemRowFontSize })}
        label="Size (8-28)"
        id="itemRowFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPCheckbox
        id="showRowBg"
        label="Background"
        onChange={(e) => {
          onChange?.({ ...itemTableState, showRowBg: e.target.checked });
        }}
        checked={itemTableState?.showRowBg}
      />

      <ERPInput
        id="itemRowBgColor"
        label="Background Color"
        type="color"
        value={itemTableState?.itemRowBgColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, itemRowBgColor: e.target.value });
        }}
      />
      <ERPInput
        id="itemRowFontColor"
        label="Font Color"
        type="color"
        value={itemTableState?.itemRowFontColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, itemRowFontColor: e.target.value });
        }}
      />

      {!["customer", "vendor"]?.includes(templateGroup!) && <>
        <h1>Item Description</h1>
        <ERPStepInput
          value={itemTableState?.itemDescriptionFontSize}
          onChange={(itemDescriptionFontSize) => onChange?.({ ...itemTableState, itemDescriptionFontSize })}
          label="Font Size (8-28)"
          id="itemDescriptionFontSize"
          placeholder=" "
          defaultValue={10}
          min={8}
          max={28}
          step={1}
        />
        <ERPInput
          id="itemDescriptionFontColor"
          label="Font Color"
          type="color"
          value={itemTableState?.itemDescriptionFontColor}
          onChange={(e) => onChange?.({ ...itemTableState, itemDescriptionFontColor: e.target.value })}
        />
      </>}
    </div>
  );
};

const LabelsEditor = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();

  const templateGroup = searchParams?.get("template_group");

  return (
    <>
      {itemTableState?.statementTable?.showStatementTable && <StatementTableController itemTableState={itemTableState} onChange={onChange} />}
      {!["journal_entry", "customer", "vendor"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showLineItemNumber"
          label="Line Item Number"
          checked={itemTableState?.showLineItemNumber}
          onChange={(e) => onChange?.({ ...itemTableState, showLineItemNumber: e.target.checked })}
        />
      }

      {itemTableState?.showLineItemNumber && (
        <div className=" flex gap-2">
          <ERPInput
            id="lineItemNumberWidth"
            label="Width"
            className="w-20"
            value={itemTableState?.lineItemNumberWidth}
            onChange={(e) => onChange?.({ ...itemTableState, lineItemNumberWidth: e.target.value })}
          />
          <ERPInput
            id="lineItemNumberLabel"
            label="Line Item Number"
            value={itemTableState?.lineItemNumberLabel}
            onChange={(e) => onChange?.({ ...itemTableState, lineItemNumberLabel: e.target.value })}
          />
        </div>
      )}

      {!["customer", "vendor", "retainer_invoice"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showLineItem"
          label={["journal_entry"]?.includes(templateGroup!) ? "Account Details" : "Item"}
          checked={itemTableState?.showLineItem}
          disabled={templateGroup === "journal_entry"}
          onChange={(e) => onChange?.({ ...itemTableState, showLineItem: e.target.checked })}
        />
      }


      {itemTableState?.showLineItem && (
        <div className=" flex gap-2">
          <ERPInput
            id="lineItemWidth"
            label="Width"
            className="w-20"
            value={itemTableState?.lineItemWidth}
            onChange={(e) => onChange?.({ ...itemTableState, lineItemWidth: e.target.value })}
          />
          <ERPInput
            id="lineItemLabel"
            label="Item"
            value={itemTableState?.lineItemLabel}
            onChange={(e) => onChange?.({ ...itemTableState, lineItemLabel: e.target.value })}
          />
        </div>
      )}

      {!["customer", "vendor"]?.includes(templateGroup!) &&
        <ERPCheckbox
          disabled={itemTableState?.statementTable?.showStatementTable}
          id="showDescription"
          label="Description"
          checked={itemTableState?.showDiscription}
          onChange={(e) => onChange?.({ ...itemTableState, showDiscription: e.target.checked })}
        />
      }

      {itemTableState?.showDiscription && (
        <div className=" flex gap-2">
          {!itemTableState?.showLineItem && (
            <ERPInput
              label="Width"
              id="lineItemWidth"
              className="w-20"
              value={itemTableState?.lineItemWidth}
              onChange={(e) => onChange?.({ ...itemTableState, lineItemWidth: e.target.value })}
            />
          )}
          <ERPInput
            label="Description"
            id="descriptionLabel"
            className=" w-full"
            value={itemTableState?.discriptionLabel}
            onChange={(e) => {
              onChange?.({ ...itemTableState, discriptionLabel: e.target.value });
            }}
          />
        </div>
      )}

      {["purchase_invoice"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showAccountDetails"
          label="Account Details"
          checked={itemTableState?.showAccountDetails}
          onChange={(e) => {
            onChange?.({ ...itemTableState, showAccountDetails: e.target.checked });
          }}
        />
      }

      {itemTableState?.showAccountDetails && (
        <div className=" flex gap-2">
          <ERPInput
            id="accountDetailsWidth"
            label="Width"
            className="w-20"
            value={itemTableState?.accountDetailsWidth}
            onChange={(e) => {
              onChange?.({ ...itemTableState, accountDetailsWidth: e.target.value });
            }}
          />
          <ERPInput
            id="accountDetailsLabel"
            label="Account Details"
            value={itemTableState?.accountDetailsLabel ?? "Account"}
            onChange={(e) => {
              onChange?.({ ...itemTableState, accountDetailsLabel: e.target.value });
            }}
          />
        </div>
      )}

      {templateGroup !== "journal_entry" &&
        templateGroup !== "qty_adjustment" &&
        templateGroup !== "value_adjustment" && (
          <>

            {!["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showQuantity"
                label="Quantity"
                checked={itemTableState?.showQuantity}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showQuantity: e.target.checked });
                }}
              />
            }
            {itemTableState?.showQuantity && (
              <div className=" flex gap-2">
                <ERPInput
                  id="quantityWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.quantityWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, quantityWidth: e.target.value });
                  }}
                />
                <div className="space-y-2">
                  <ERPInput
                    id="quantityLabel"
                    label="Quantity"
                    value={itemTableState?.quantityLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, quantityLabel: e.target.value });
                    }}
                  />
                  {![""]?.includes(templateGroup!) &&
                    <div>
                      <ERPCheckbox
                        id="showQtyUnit"
                        label="Show Unit"
                        checked={itemTableState?.showQtyUnit}
                        onChange={(e) => onChange?.({ ...itemTableState, showQtyUnit: e.target.checked })}
                      />
                    </div>
                  }
                </div>
              </div>
            )}

            {["purchase_invoice"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showCustomerDetails"
                label="Customer Details"
                checked={itemTableState?.showCustomerDetails}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showCustomerDetails: e.target.checked });
                }}
              />
            }

            {!["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showRate"
                label="Rate"
                checked={itemTableState?.showRate}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showRate: e.target.checked });
                }}
              />
            }
            {itemTableState?.showRate && (
              <div className=" flex gap-2">
                <ERPInput
                  id="rateWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.rateWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, rateWidth: e.target.value });
                  }}
                />
                <ERPInput
                  id="rateLabel"
                  label="Rate"
                  value={itemTableState?.rateLabel}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, rateLabel: e.target.value });
                  }}
                />
              </div>
            )}

            {/* {!["retainer_invoice", "sales_order",
              "delivery_challan", "purchase_invoice",
              "purchase_order", "vendor_credit", "customer",
              "vendor", "sales_return"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showTax"
                label="Taxable Amount"
                checked={itemTableState?.showTax}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showTax: e.target.checked });
                }}
              />
            }

            {itemTableState?.showTax && !["retainer_invoice", "sales_order",
              "delivery_challan", "purchase_invoice",
              "purchase_order", "vendor_credit", "customer",
              "vendor", "sales_return"]?.includes(templateGroup!) &&
              (
                <div className=" flex gap-2">
                  <ERPInput
                    id="taxWidth"
                    label="Width"
                    className="w-20"
                    value={itemTableState?.taxWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxWidth: e.target.value });
                    }}
                  />
                  <ERPInput
                    id="taxLabel"
                    label="Taxable Amount"
                    value={itemTableState?.taxLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxLabel: e.target.value });
                    }}
                  />
                </div>
              )} */}

            {!["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showTaxPercentage"
                label="Tax (%)"
                checked={itemTableState?.showTaxPercentage}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showTaxPercentage: e.target.checked });
                }}
              />
            }

            {itemTableState?.showTaxPercentage && (
              <div className=" flex gap-2">
                <ERPInput
                  id="taxPercentageWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.taxPercentageWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, taxPercentageWidth: e.target.value });
                  }}
                />
                <ERPInput
                  id="taxPercentageLabel"
                  label="Tax (%)"
                  value={itemTableState?.taxPercentageLabel ?? "Tax (%)"}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, taxPercentageLabel: e.target.value });
                  }}
                />
              </div>
            )}

            {!["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showTaxAmount"
                label="Tax Amount"
                checked={itemTableState?.showTaxAmount}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showTaxAmount: e.target.checked });
                }}
              />
            }

            {itemTableState?.showTaxAmount && (
              <div className=" flex gap-2">
                <ERPInput
                  id="taxAmountWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.taxAmountWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, taxAmountWidth: e.target.value });
                  }}
                />
                <ERPInput
                  id="taxAmountLabel"
                  label="Tax Amount"
                  value={itemTableState?.taxAmountLabel ?? "Tax Amount"}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, taxAmountLabel: e.target.value });
                  }}
                />
              </div>
            )}

            {!["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showDiscount"
                label="Discount"
                checked={itemTableState?.showDiscount}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showDiscount: e.target.checked });
                }}
              />
            }
            {itemTableState?.showDiscount && !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) && (
              <div className=" flex gap-2">
                <ERPInput
                  id="discountWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.discountWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, discountWidth: e.target.value });
                  }}
                />
                <ERPInput
                  id="discountLabel"
                  label="Discount"
                  value={itemTableState?.discountLabel}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, discountLabel: e.target.value });
                  }}
                />
              </div>
            )}


            {!["customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showAmount"
                label="Amount"
                checked={itemTableState?.showAmount}
                onChange={(e) => onChange?.({ ...itemTableState, showAmount: e.target.checked })}
              />
            }

            {itemTableState?.showAmount && (
              <div className=" flex gap-2">
                <ERPInput
                  id="amountWidth"
                  label="Width"
                  className="w-20"
                  value={itemTableState?.amountWidth}
                  onChange={(e) => {
                    onChange?.({ ...itemTableState, amountWidth: e.target.value });
                  }}
                />
                <div className="space-y-1">
                  <ERPInput
                    id="amountLabel"
                    label="Label"
                    value={itemTableState?.amountLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, amountLabel: e.target.value });
                    }}
                  />
                  {!["sales_order", "retainer_invoice"]?.includes(templateGroup!) &&
                    <div className="border-b border-dashed py-1">
                      <ERPCheckbox
                        id="addTaxToAmount"
                        label="Add tax to amount"
                        checked={itemTableState?.addTaxToAmount}
                        onChange={(e) => onChange?.({ ...itemTableState, addTaxToAmount: e.target.checked })}
                      />
                    </div>
                  }
                </div>
              </div>
            )}

            <div className="h-[20%]"></div>
          </>
        )}

      {/* Journal table columns */}
      {templateGroup === "journal_entry" && (
        <>
          <ERPCheckbox
            id="showAccount"
            label="Show Account Code"
            checked={itemTableState?.showAccountCode}
            onChange={(e) => onChange?.({ ...itemTableState, showAccountCode: e.target.checked })}
          />
          <ERPCheckbox
            id="showContact"
            label="Show Contact Details"
            checked={itemTableState?.showContactDetails}
            onChange={(e) => onChange?.({ ...itemTableState, showContactDetails: e.target.checked })}
          />
        </>
      )}

      {/* Qty Adjustment columns */}
      {templateGroup === "qty_adjustment" && (
        <>
          <ERPCheckbox
            id="showQtyAdj"
            label="Quantity Adjusted"
            checked={itemTableState?.showQtyAdjustment}
            onChange={(e) => onChange?.({ ...itemTableState, showQtyAdjustment: e.target.checked })}
          />
          {itemTableState?.showQtyAdjustment && (
            <div className=" flex gap-2">
              <ERPInput
                id="qtyAdjWidth"
                label="Width"
                className="w-20"
                value={itemTableState?.qtyAdjustmentWidth}
                onChange={(e) => onChange?.({ ...itemTableState, qtyAdjustmentWidth: e.target.value })}
              />
              <div className="space-y-2">
                <ERPInput
                  id="qtyAdjLabel"
                  label="Label"
                  value={itemTableState?.qtyAdjustmentLabel}
                  onChange={(e) => onChange?.({ ...itemTableState, qtyAdjustmentLabel: e.target.value })}
                />
                {![""]?.includes(templateGroup!) &&
                  <div>
                    <ERPCheckbox
                      id="showQtyUnit"
                      label="Show Unit"
                      checked={itemTableState?.showQtyUnit}
                      onChange={(e) => onChange?.({ ...itemTableState, showQtyUnit: e.target.checked })}
                    />
                  </div>
                }
              </div>
            </div>
          )}
        </>
      )}

      {/* Qty Adjustment columns */}
      {templateGroup === "value_adjustment" && (
        <>
          <ERPCheckbox
            id="showValueAdj"
            label="Value Adjusted"
            checked={itemTableState?.showValueAdjustment}
            onChange={(e) => onChange?.({ ...itemTableState, showValueAdjustment: e.target.checked })}
          />
          {itemTableState?.showValueAdjustment && (
            <div className=" flex gap-2">
              <ERPInput
                id="valueAdjWidth"
                label="Width"
                className="w-20"
                value={itemTableState?.valueAdjustmentWidth}
                onChange={(e) => onChange?.({ ...itemTableState, valueAdjustmentWidth: e.target.value })}
              />
              <ERPInput
                id="valueAdjLabel"
                label="Label"
                value={itemTableState?.valueAdjustmentLabel}
                onChange={(e) => onChange?.({ ...itemTableState, valueAdjustmentLabel: e.target.value })}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

const StatementTableController = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  return (
    <>
      <div>Statement Table</div>
      <ERPCheckbox
        id="showDate"
        label="Date"
        checked={itemTableState?.statementTable?.showDateField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showDateField: e.target.checked } })}
      />
      {itemTableState?.statementTable?.showDateField && (
        <div className="flex gap-2">
          <ERPInput
            id="dateLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.dateFieldLabel}
            onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, dateFieldLabel: e.target.value } })}
          />
        </div>
      )}
      {/** */}
      <ERPCheckbox
        id="showTransaction"
        label="Transaction Type"
        checked={itemTableState?.statementTable?.showTransactionTypeField}
        onChange={(e) =>
          onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showTransactionTypeField: e.target.checked } })
        }
      />
      {itemTableState?.statementTable?.showTransactionTypeField && (
        <div className="flex gap-2">
          <ERPInput
            id="showTransactionLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.transactionTypeFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, transactionTypeFieldLabel: e.target.value } })
            }
          />
        </div>
      )}
      {/** */}
      <ERPCheckbox
        id="showTransactionDetails"
        label="Transaction Details"
        checked={itemTableState?.statementTable?.showTransactionDetailsField}
        onChange={(e) =>
          onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showTransactionDetailsField: e.target.checked } })
        }
      />
      {itemTableState?.statementTable?.showTransactionDetailsField && (
        <div className="flex gap-2">
          <ERPInput
            id="transactionDetailsLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.transactionDetailsFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, transactionDetailsFieldLabel: e.target.value } })
            }
          />
        </div>
      )}{" "}
      {/** */}
      <ERPCheckbox
        id="showStatementAmount"
        label="Amount"
        checked={itemTableState?.statementTable?.showAmountField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showAmountField: e.target.checked } })}
      />
      {itemTableState?.statementTable?.showAmountField && (
        <div className="flex gap-2">
          <ERPInput
            id="amountLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.amountFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, amountFieldLabel: e.target.value } })
            }
          />
        </div>
      )}
      {/** */}
      <ERPCheckbox
        id="showPayments"
        label="Payments"
        checked={itemTableState?.statementTable?.showPaymentField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showPaymentField: e.target.checked } })}
      />
      {itemTableState?.statementTable?.showPaymentField && (
        <div className="flex gap-2">
          <ERPInput
            id="paymentsLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.paymentFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, paymentFieldLabel: e.target.value } })
            }
          />
        </div>
      )}
      {/** */}
      <ERPCheckbox
        id="showRefund"
        label="Refund"
        checked={itemTableState?.statementTable?.showRefundField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showRefundField: e.target.checked } })}
      />
      {itemTableState?.statementTable?.showRefundField && (
        <div className="flex gap-2">
          <ERPInput
            id="refundLabel"
            noLabel
            className="w-full"
            value={itemTableState?.statementTable?.refundFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, refundFieldLabel: e.target.value } })
            }
          />
        </div>
      )}
      {/** */}
      <ERPCheckbox
        id="showBalance"
        label="Balance"
        checked={itemTableState?.statementTable?.showBalanceField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showBalanceField: e.target.checked } })}
      />
      {itemTableState?.statementTable?.showBalanceField && (
        <div className="flex gap-2">
          <ERPInput
            id="balaceLabel"
            className="w-full"
            noLabel
            value={itemTableState?.statementTable?.balanceFieldLabel}
            onChange={(e) =>
              onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, balanceFieldLabel: e.target.value } })
            }
          />
        </div>
      )}
    </>
  );
};

const ItemTableDesigner = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <ERPTab tabs={["Labels", "Layout"]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
      </div>
      {activeTab === 0 && <LabelsEditor itemTableState={itemTableState} onChange={onChange} />}
      {activeTab === 1 && <LayoutEditor itemTableState={itemTableState} onChange={onChange} />}
    </div>
  );
};

export default ItemTableDesigner;
