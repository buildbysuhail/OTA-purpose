import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ItemTableState, TemplateState } from "./interfaces";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";
import { useTranslation } from "react-i18next";

interface ItemTableDesignerProps {
  itemTableState?: ItemTableState;
  onChange?: (state: ItemTableState) => void;
  template?: TemplateState;
}

const LayoutEditor = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');
  return (
    <div className="flex flex-col gap-4">
      <ERPCheckbox
        id="showTableBorder"
        label={t("table_border")}
        onChange={(e) => onChange?.({ ...itemTableState, showTableBorder: e.target.checked })}
        checked={itemTableState?.showTableBorder}
      />

      {
        itemTableState?.showTableBorder && (
          <ERPInput
            id="tableBorderColor"
            label={t("border_color")}
            type="color"
            value={itemTableState?.tableBorderColor}
            onChange={(e) => onChange?.({ ...itemTableState, tableBorderColor: e.target?.value })}
          />
        )
      }

      <h1>{t("table_header")}</h1>

      <ERPStepInput
        value={itemTableState?.headerFontSize}
        onChange={(headerFontSize) => onChange?.({ ...itemTableState, headerFontSize })}
        label={t("size_(8-28)")}
        id="headerFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPCheckbox
        id="showTableHeaderBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...itemTableState, showTableHeaderBg: e.target.checked });
        }}
        checked={itemTableState?.showTableHeaderBg}
      />

      {
        itemTableState?.showTableHeaderBg && (
          <ERPInput
            id="tableHeaderBgColor"
            label={t("background_color")}
            type="color"
            value={itemTableState?.tableHeaderBgColor}
            onChange={(e) => {
              onChange?.({ ...itemTableState, tableHeaderBgColor: e.target?.value });
            }}
          />
        )
      }

      <ERPInput
        id="headerFontColor"
        label={t("font_color")}
        type="color"
        value={itemTableState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, headerFontColor: e.target?.value });
        }}
      />

      <h1>{t("item_row")}</h1>

      <ERPStepInput
        value={itemTableState?.itemRowFontSize}
        onChange={(itemRowFontSize) => onChange?.({ ...itemTableState, itemRowFontSize })}
        label={t("size_(8-28)")}
        id="itemRowFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPCheckbox
        id="showRowBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...itemTableState, showRowBg: e.target.checked });
        }}
        checked={itemTableState?.showRowBg}
      />

      <ERPInput
        id="itemRowBgColor"
        label={t("background_color")}
        type="color"
        value={itemTableState?.itemRowBgColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, itemRowBgColor: e.target?.value });
        }}
      />

      <ERPInput
        id="itemRowFontColor"
        label={t("font_color")}
        type="color"
        value={itemTableState?.itemRowFontColor}
        onChange={(e) => {
          onChange?.({ ...itemTableState, itemRowFontColor: e.target?.value });
        }}
      />

      {
        !["customer", "vendor"]?.includes(templateGroup!) && <>
          <h1>{t("item_description")}</h1>
          <ERPStepInput
            value={itemTableState?.itemDescriptionFontSize}
            onChange={(itemDescriptionFontSize) => onChange?.({ ...itemTableState, itemDescriptionFontSize })}
            label={t("font_size_(8-28)")}
            id="itemDescriptionFontSize"
            placeholder=" "
            defaultValue={10}
            min={8}
            max={28}
            step={1}
          />

          <ERPInput
            id="itemDescriptionFontColor"
            label={t("font_color")}
            type="color"
            value={itemTableState?.itemDescriptionFontColor}
            onChange={(e) => onChange?.({ ...itemTableState, itemDescriptionFontColor: e.target?.value })}
          />
        </>
      }
    </div>
  );
};

const LabelsEditor = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');
  return (
    <>
      {itemTableState?.statementTable?.showStatementTable && <StatementTableController itemTableState={itemTableState} onChange={onChange} />}
      {
        !["journal_entry", "customer", "vendor"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showLineItemNumber"
          label={t("line_item_number")}
          checked={itemTableState?.showLineItemNumber}
          onChange={(e) => onChange?.({ ...itemTableState, showLineItemNumber: e.target.checked })}
        />
      }

      {
        itemTableState?.showLineItemNumber && (
          <div className=" flex gap-2">
            <ERPInput
              id="lineItemNumberWidth"
              label={t("width")}
              className="w-20"
              value={itemTableState?.lineItemNumberWidth}
              onChange={(e) => onChange?.({ ...itemTableState, lineItemNumberWidth: e.target?.value })}
            />

            <ERPInput
              id="lineItemNumberLabel"
              label={t("line_item_number")}
              value={itemTableState?.lineItemNumberLabel}
              onChange={(e) => onChange?.({ ...itemTableState, lineItemNumberLabel: e.target?.value })}
            />
          </div>
        )
      }

      {
        !["customer", "vendor", "retainer_invoice"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showLineItem"
          label={["journal_entry"]?.includes(templateGroup!) ? t("account_details") : t("item")}
          checked={itemTableState?.showLineItem}
          disabled={templateGroup === "journal_entry"}
          onChange={(e) => onChange?.({ ...itemTableState, showLineItem: e.target.checked })}
        />
      }

      {
        itemTableState?.showLineItem && (
          <div className=" flex gap-2">
            <ERPInput
              id="lineItemWidth"
              label={t("width")}
              className="w-20"
              value={itemTableState?.lineItemWidth}
              onChange={(e) => onChange?.({ ...itemTableState, lineItemWidth: e.target?.value })}
            />
            <ERPInput
              id="lineItemLabel"
              label={t("item")}
              value={itemTableState?.lineItemLabel}
              onChange={(e) => onChange?.({ ...itemTableState, lineItemLabel: e.target?.value })}
            />
          </div>
        )
      }

      {
        !["customer", "vendor"]?.includes(templateGroup!) &&
        <ERPCheckbox
          disabled={itemTableState?.statementTable?.showStatementTable}
          id="showDescription"
          label={t("description")}
          checked={itemTableState?.showDiscription}
          onChange={(e) => onChange?.({ ...itemTableState, showDiscription: e.target.checked })}
        />
      }

      {
        itemTableState?.showDiscription && (
          <div className=" flex gap-2">
            {
              !itemTableState?.showLineItem && (
                <ERPInput
                  label={t("width")}
                  id="lineItemWidth"
                  className="w-20"
                  value={itemTableState?.lineItemWidth}
                  onChange={(e) => onChange?.({ ...itemTableState, lineItemWidth: e.target?.value })}
                />
              )
            }

            <ERPInput
              label={t("description")}
              id="descriptionLabel"
              className=" w-full"
              value={itemTableState?.discriptionLabel}
              onChange={(e) => {
                onChange?.({ ...itemTableState, discriptionLabel: e.target?.value });
              }}
            />
          </div>
        )
      }

      {
        ["purchase_invoice"]?.includes(templateGroup!) &&
        <ERPCheckbox
          id="showAccountDetails"
          label={t("account_details")}
          checked={itemTableState?.showAccountDetails}
          onChange={(e) => {
            onChange?.({ ...itemTableState, showAccountDetails: e.target.checked });
          }}
        />
      }

      {
        itemTableState?.showAccountDetails && (
          <div className=" flex gap-2">
            <ERPInput
              id="accountDetailsWidth"
              label={t("width")}
              className="w-20"
              value={itemTableState?.accountDetailsWidth}
              onChange={(e) => {
                onChange?.({ ...itemTableState, accountDetailsWidth: e.target?.value });
              }}
            />

            <ERPInput
              id="accountDetailsLabel"
              label={t("account_details")}
              value={itemTableState?.accountDetailsLabel ?? "Account"}
              onChange={(e) => {
                onChange?.({ ...itemTableState, accountDetailsLabel: e.target?.value });
              }}
            />
          </div>
        )
      }

      {
        templateGroup !== "journal_entry" &&
        templateGroup !== "qty_adjustment" &&
        templateGroup !== "value_adjustment" && (
          <>
            {
              !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showQuantity"
                label={t("quantity")}
                checked={itemTableState?.showQuantity}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showQuantity: e.target.checked });
                }}
              />
            }
            {
              itemTableState?.showQuantity && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="quantityWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.quantityWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, quantityWidth: e.target?.value });
                    }}
                  />

                  <div className="space-y-2">
                    <ERPInput
                      id="quantityLabel"
                      label={t("quantity")}
                      value={itemTableState?.quantityLabel}
                      onChange={(e) => {
                        onChange?.({ ...itemTableState, quantityLabel: e.target?.value });
                      }}
                    />

                    {
                      ![""]?.includes(templateGroup!) &&
                      <div>
                        <ERPCheckbox
                          id="showQtyUnit"
                          label={t("show_unit")}
                          checked={itemTableState?.showQtyUnit}
                          onChange={(e) => onChange?.({ ...itemTableState, showQtyUnit: e.target.checked })}
                        />
                      </div>
                    }
                  </div>
                </div>
              )
            }

            {
              ["purchase_invoice"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showCustomerDetails"
                label={t("customer_details")}
                checked={itemTableState?.showCustomerDetails}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showCustomerDetails: e.target.checked });
                }}
              />
            }

            {
              !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showRate"
                label={t("rate")}
                checked={itemTableState?.showRate}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showRate: e.target.checked });
                }}
              />
            }
            {
              itemTableState?.showRate && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="rateWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.rateWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, rateWidth: e.target?.value });
                    }}
                  />

                  <ERPInput
                    id="rateLabel"
                    label={t("rate")}
                    value={itemTableState?.rateLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, rateLabel: e.target?.value });
                    }}
                  />
                </div>
              )
            }

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
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.taxWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxWidth: e.target?.value });
                    }}
                  />
                  <ERPInput
                    id="taxLabel"
                    label="Taxable Amount"
                    value={itemTableState?.taxLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxLabel: e.target?.value });
                    }}
                  />
                </div>
              )} */}

            {
              !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showTaxPercentage"
                label={t("tax_(%)")}
                checked={itemTableState?.showTaxPercentage}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showTaxPercentage: e.target.checked });
                }}
              />
            }

            {
              itemTableState?.showTaxPercentage && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="taxPercentageWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.taxPercentageWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxPercentageWidth: e.target?.value });
                    }}
                  />

                  <ERPInput
                    id="taxPercentageLabel"
                    label={t("tax_(%)")}
                    value={itemTableState?.taxPercentageLabel ?? "Tax (%)"}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxPercentageLabel: e.target?.value });
                    }}
                  />
                </div>
              )
            }

            {
              !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showTaxAmount"
                label={t("tax_amount")}
                checked={itemTableState?.showTaxAmount}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showTaxAmount: e.target.checked });
                }}
              />
            }

            {
              itemTableState?.showTaxAmount && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="taxAmountWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.taxAmountWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxAmountWidth: e.target?.value });
                    }}
                  />

                  <ERPInput
                    id="taxAmountLabel"
                    label={t("tax_amount")}
                    value={itemTableState?.taxAmountLabel ?? "Tax Amount"}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, taxAmountLabel: e.target?.value });
                    }}
                  />
                </div>
              )
            }

            {
              !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showDiscount"
                label={t("discount")}
                checked={itemTableState?.showDiscount}
                onChange={(e) => {
                  onChange?.({ ...itemTableState, showDiscount: e.target.checked });
                }}
              />
            }

            {
              itemTableState?.showDiscount && !["retainer_invoice", "customer", "vendor"]?.includes(templateGroup!) && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="discountWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.discountWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, discountWidth: e.target?.value });
                    }}
                  />

                  <ERPInput
                    id="discountLabel"
                    label={t("discount")}
                    value={itemTableState?.discountLabel}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, discountLabel: e.target?.value });
                    }}
                  />
                </div>
              )
            }

            {
              !["customer", "vendor"]?.includes(templateGroup!) &&
              <ERPCheckbox
                id="showAmount"
                label={t("amount")}
                checked={itemTableState?.showAmount}
                onChange={(e) => onChange?.({ ...itemTableState, showAmount: e.target.checked })}
              />
            }

            {
              itemTableState?.showAmount && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="amountWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.amountWidth}
                    onChange={(e) => {
                      onChange?.({ ...itemTableState, amountWidth: e.target?.value });
                    }}
                  />

                  <div className="space-y-1">
                    <ERPInput
                      id="amountLabel"
                      label={t("label")}
                      value={itemTableState?.amountLabel}
                      onChange={(e) => {
                        onChange?.({ ...itemTableState, amountLabel: e.target?.value });
                      }}
                    />
                    {
                      !["sales_order", "retainer_invoice"]?.includes(templateGroup!) &&
                      <div className="border-b border-dashed py-1">
                        <ERPCheckbox
                          id="addTaxToAmount"
                          label={t("add_tax_to_amount")}
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
        )
      }

      {/* Journal table columns */}
      {
        templateGroup === "journal_entry" && (
          <>
            <ERPCheckbox
              id="showAccount"
              label={t("show_account_code")}
              checked={itemTableState?.showAccountCode}
              onChange={(e) => onChange?.({ ...itemTableState, showAccountCode: e.target.checked })}
            />

            <ERPCheckbox
              id="showContact"
              label={t("show_contact_details")}
              checked={itemTableState?.showContactDetails}
              onChange={(e) => onChange?.({ ...itemTableState, showContactDetails: e.target.checked })}
            />
          </>
        )
      }

      {/* Qty Adjustment columns */}
      {
        templateGroup === "qty_adjustment" && (
          <>
            <ERPCheckbox
              id="showQtyAdj"
              label={t("quantity_adjusted")}
              checked={itemTableState?.showQtyAdjustment}
              onChange={(e) => onChange?.({ ...itemTableState, showQtyAdjustment: e.target.checked })}
            />
            {
              itemTableState?.showQtyAdjustment && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="qtyAdjWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.qtyAdjustmentWidth}
                    onChange={(e) => onChange?.({ ...itemTableState, qtyAdjustmentWidth: e.target?.value })}
                  />

                  <div className="space-y-2">
                    <ERPInput
                      id="qtyAdjLabel"
                      label={t("label")}
                      value={itemTableState?.qtyAdjustmentLabel}
                      onChange={(e) => onChange?.({ ...itemTableState, qtyAdjustmentLabel: e.target?.value })}
                    />

                    {
                      ![""]?.includes(templateGroup!) &&
                      <div>
                        <ERPCheckbox
                          id="showQtyUnit"
                          label={t("show_unit")}
                          checked={itemTableState?.showQtyUnit}
                          onChange={(e) => onChange?.({ ...itemTableState, showQtyUnit: e.target.checked })}
                        />
                      </div>
                    }
                  </div>
                </div>
              )
            }
          </>
        )
      }

      {/* Qty Adjustment columns */}
      {
        templateGroup === "value_adjustment" && (
          <>
            <ERPCheckbox
              id="showValueAdj"
              label={t("value_adjusted")}
              checked={itemTableState?.showValueAdjustment}
              onChange={(e) => onChange?.({ ...itemTableState, showValueAdjustment: e.target.checked })}
            />
            {
              itemTableState?.showValueAdjustment && (
                <div className=" flex gap-2">
                  <ERPInput
                    id="valueAdjWidth"
                    label={t("width")}
                    className="w-20"
                    value={itemTableState?.valueAdjustmentWidth}
                    onChange={(e) => onChange?.({ ...itemTableState, valueAdjustmentWidth: e.target?.value })}
                  />
                  <ERPInput
                    id="valueAdjLabel"
                    label={t("label")}
                    value={itemTableState?.valueAdjustmentLabel}
                    onChange={(e) => onChange?.({ ...itemTableState, valueAdjustmentLabel: e.target?.value })}
                  />
                </div>
              )
            }
          </>
        )
      }
    </>
  );
};

const StatementTableController = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const { t } = useTranslation('system')
  return (
    <>
      <div>{t("statement_table")}</div>

      <ERPCheckbox
        id="showDate"
        label={t("date")}
        checked={itemTableState?.statementTable?.showDateField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showDateField: e.target.checked } })}
      />
      {
        itemTableState?.statementTable?.showDateField && (
          <div className="flex gap-2">
            <ERPInput
              id="dateLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.dateFieldLabel}
              onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, dateFieldLabel: e.target?.value } })}
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showTransaction"
        label={t("transaction_type")}
        checked={itemTableState?.statementTable?.showTransactionTypeField}
        onChange={(e) =>
          onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showTransactionTypeField: e.target.checked } })
        }
      />
      {
        itemTableState?.statementTable?.showTransactionTypeField && (
          <div className="flex gap-2">
            <ERPInput
              id="showTransactionLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.transactionTypeFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, transactionTypeFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showTransactionDetails"
        label="Transaction Details"
        checked={itemTableState?.statementTable?.showTransactionDetailsField}
        onChange={(e) =>
          onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showTransactionDetailsField: e.target.checked } })
        }
      />

      {
        itemTableState?.statementTable?.showTransactionDetailsField && (
          <div className="flex gap-2">
            <ERPInput
              id="transactionDetailsLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.transactionDetailsFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, transactionDetailsFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showStatementAmount"
        label={t("amount")}
        checked={itemTableState?.statementTable?.showAmountField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showAmountField: e.target.checked } })}
      />

      {
        itemTableState?.statementTable?.showAmountField && (
          <div className="flex gap-2">
            <ERPInput
              id="amountLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.amountFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, amountFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showPayments"
        label={t("payments")}
        checked={itemTableState?.statementTable?.showPaymentField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showPaymentField: e.target.checked } })}
      />

      {
        itemTableState?.statementTable?.showPaymentField && (
          <div className="flex gap-2">
            <ERPInput
              id="paymentsLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.paymentFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, paymentFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showRefund"
        label={t("refund")}
        checked={itemTableState?.statementTable?.showRefundField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showRefundField: e.target.checked } })}
      />

      {
        itemTableState?.statementTable?.showRefundField && (
          <div className="flex gap-2">
            <ERPInput
              id="refundLabel"
              noLabel
              className="w-full"
              value={itemTableState?.statementTable?.refundFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, refundFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }

      <ERPCheckbox
        id="showBalance"
        label={t("balance")}
        checked={itemTableState?.statementTable?.showBalanceField}
        onChange={(e) => onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, showBalanceField: e.target.checked } })}
      />

      {
        itemTableState?.statementTable?.showBalanceField && (
          <div className="flex gap-2">
            <ERPInput
              id="balaceLabel"
              className="w-full"
              noLabel
              value={itemTableState?.statementTable?.balanceFieldLabel}
              onChange={(e) =>
                onChange?.({ ...itemTableState, statementTable: { ...itemTableState?.statementTable, balanceFieldLabel: e.target?.value } })
              }
            />
          </div>
        )
      }
    </>
  );
};

const ItemTableDesigner = ({ itemTableState, onChange }: ItemTableDesignerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation('system');
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
      </div>
      {activeTab === 0 && <LabelsEditor itemTableState={itemTableState} onChange={onChange} />}
      {activeTab === 1 && <LayoutEditor itemTableState={itemTableState} onChange={onChange} />}
    </div>
  );
};

export default ItemTableDesigner;