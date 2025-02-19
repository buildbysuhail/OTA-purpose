import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TotalState } from "./interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";

interface TotalDesignerProps {
  totalState?: TotalState;
  onChange?: (totalState: TotalState) => void;
}

const LayoutEditor = ({ totalState, onChange }: TotalDesignerProps) => {
  const { t } = useTranslation('system');

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>{t("total_(subtotal_tax)")}</h1>

      <ERPStepInput
        value={totalState?.totalFontSize}
        onChange={(totalFontSize) => onChange?.({ ...totalState, totalFontSize })}
        label={t("size_(8-28)")}
        id="totalFontSize"
        placeholder=" "
        defaultValue={9}
        min={8}
        max={28}
        step={1}
      />

      <ERPInput
        id="totalFontColor"
        label={t("font_color")}
        type="color"
        value={totalState?.totalFontColor}
        onChange={(e) => onChange?.({ ...totalState, totalFontColor: e.target?.value })}
      />

      <ERPCheckbox
        checked={totalState?.showTotalBgColor}
        id="showTotalBgColor"
        label={t("show_background_color")}
        onChange={(e) => onChange?.({ ...totalState, showTotalBgColor: e.target.checked })}
      />

      {
        totalState?.showTotalBgColor && (
          <ERPInput
            id="totalBgColor"
            label={t("background_color")}
            type="color"
            value={totalState?.totalBgColor}
            onChange={(e) => onChange?.({ ...totalState, totalBgColor: e.target?.value })}
          />
        )
      }

      <h1>{t("balance_due")}</h1>

      <ERPStepInput
        value={totalState?.balanceFontSize}
        onChange={(balanceFontSize) => onChange?.({ ...totalState, balanceFontSize })}
        label={t("font_size_(8-28)")}
        id="balanceFontSize"
        placeholder=" "
        defaultValue={9}
        min={8}
        max={28}
        step={1}
      />

      <ERPInput
        id="balanceFontColor"
        label={t("font_color")}
        type="color"
        value={totalState?.balanceFontColor}
        onChange={(e) => onChange?.({ ...totalState, balanceFontColor: e.target?.value })}
      />

      <ERPCheckbox
        checked={totalState?.showBalanceBgColor}
        id="showBalanceBgColor"
        label={t("show_background_color")}
        onChange={(e) => onChange?.({ ...totalState, showBalanceBgColor: e.target.checked })}
      />

      {
        totalState?.showBalanceBgColor && (
          <ERPInput
            id="balanceBgColor"
            label={t("background_color")}
            type="color"
            value={totalState?.balanceBgColor}
            onChange={(e) => onChange?.({ ...totalState, balanceBgColor: e.target?.value })}
          />
        )
      }
    </div>
  );
};

const LabelsEditor = ({ totalState, onChange }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system')

  return (
    <div className="p-4 flex flex-col gap-4">
      {
        !["payment_receipts"].includes(templateGroup!) &&
        <ERPCheckbox
          disabled={templateGroup === "journal_entry" || templateGroup === "qty_adjustment" || templateGroup === "value_adjustment"}
          checked={totalState?.showTotalSection}
          id="showTotalSection"
          label={t("show_total_section")}
          onChange={(e) => onChange?.({ ...totalState, showTotalSection: e.target.checked })}
        />
      }

      {
        totalState?.showTotalSection && (
          <>
            {
              !["retainer_invoice"].includes(templateGroup!) &&
              <ERPCheckbox
                checked={totalState?.showSubTotalLabel}
                id="showSubTotalLabel"
                label={t("sub_total")}
                onChange={(e) => onChange?.({ ...totalState, showSubTotalLabel: e.target.checked })}
              />
            }

            {
              totalState?.showSubTotalLabel && (
                <ERPInput
                  id="subTotalLabel"
                  noLabel
                  type="text"
                  value={totalState?.subTotalLabel}
                  onChange={(e) => onChange?.({ ...totalState, subTotalLabel: e.target?.value })}
                />
              )
            }

            {
              !["delivery_challan", "retainer_invoice", "purchase_invoice", "vendor_credit"].includes(templateGroup!) &&
              <ERPInput
                id="shippingLabel"
                label={t("shipping_charges")}
                type="text"
                value={totalState?.shippingLabel}
                onChange={(e) => onChange?.({ ...totalState, shippingLabel: e.target?.value })}
              />
            }

            {
              !["retainer_invoice"].includes(templateGroup!) &&
              <ERPCheckbox
                checked={totalState?.showDicount}
                id="showDicount"
                label={t("discount")}
                onChange={(e) => onChange?.({ ...totalState, showDicount: e.target.checked })}
              />
            }

            {
              !["retainer_invoice", "sales_order"].includes(templateGroup!) &&
              <ERPCheckbox
                checked={totalState?.showTotalTaxableAmount}
                id="showTax"
                label={t("total_taxable_amount")}
                onChange={(e) => onChange?.({ ...totalState, showTotalTaxableAmount: e.target.checked })}
              />
            }

            {
              totalState?.showTotalTaxableAmount && (
                <ERPInput
                  noLabel
                  type="text"
                  id="totalTaxableAmountlabel"
                  disabled={!totalState?.showTotalTaxableAmount}
                  value={totalState?.totalTaxableAmountlabel ?? "Total Taxable Amount"}
                  onChange={(e) => onChange?.({ ...totalState, totalTaxableAmountlabel: e.target?.value })}
                />
              )
            }

            {
              !["retainer_invoice"].includes(templateGroup!) &&
              <ERPCheckbox
                id="showTax"
                label={t("show_tax_details")}
                checked={totalState?.showTax}
                onChange={(e) => onChange?.({ ...totalState, showTax: e.target.checked })}
              />
            }

            <ERPCheckbox
              disabled
              label={t("total")}
              id="showTotal"
              checked={totalState?.showTotal}
              onChange={(e) => onChange?.({ ...totalState, showTotal: e.target.checked })}
            />

            {
              totalState?.showTotal && (
                <ERPInput
                  noLabel
                  type="text"
                  id="paymentDueLabel"
                  value={totalState?.totalInfoLabel ?? "Total"}
                  onChange={(e) => onChange?.({ ...totalState, totalInfoLabel: e.target?.value })}
                />
              )
            }

            <ERPDataCombobox
              defaultValue={totalState?.currencyPosition?.value ?? "Before"}
              handleChange={(id, value) => onChange?.({ ...totalState, currencyPosition: value })}
              id="pos_currency"
              label={t("currency_symbol")}
              options={[
                { label: "Before Amount", value: "Before" },
                { label: "After Amount", value: "After" },
              ]}
            />

            {
              !["retainer_invoice"].includes(templateGroup!) &&
              <ERPCheckbox
                checked={totalState?.showQuantity}
                id="showQuantity"
                label={t("quantity")}
                onChange={(e) => onChange?.({ ...totalState, showQuantity: e.target.checked })}
              />
            }

            {
              totalState?.showQuantity && (
                <ERPInput
                  type="text"
                  label={t("items_in_total")}
                  id="quantityInfoLabel"
                  value={totalState?.quantityInfoLabel ?? "Total"}
                  onChange={(e) => onChange?.({ ...totalState, quantityInfoLabel: e.target?.value })}
                />
              )
            }

            {
              !["sales_estimate", "sales_order", "delivery_challan", "purchase_order", "vendor_credit",].includes(templateGroup!) &&
              <ERPCheckbox
                checked={totalState?.showPaymentDetail}
                id="showPaymentDetail"
                label={t("show_payment_detail")}
                onChange={(e) => onChange?.({ ...totalState, showPaymentDetail: e.target.checked })}
              />
            }

            {
              totalState?.showPaymentDetail && (
                <>
                  {["sales_invoice", "credit_note", "purchase_invoice", "retainer_invoice"]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("payment_made")}
                      id="paymentDetailLabel"
                      value={totalState?.paymentMadeLabel ?? "Payment Made"}
                      onChange={(e) => onChange?.({ ...totalState, paymentMadeLabel: e.target?.value })}
                    />
                  }

                  {
                    ["sales_invoice", "purchase_invoice", "credit_note", "sales_return"]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("credits_applied")}
                      id="creditsAppliedLabel"
                      value={totalState?.creditsAppliedLabel ?? "Credits Applied"}
                      onChange={(e) => onChange?.({ ...totalState, creditsAppliedLabel: e.target?.value })}
                    />
                  }

                  {
                    ["sales_return",]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("refund")}
                      id="creditsAppliedLabel"
                      value={totalState?.refundLabel ?? "Refund"}
                      onChange={(e) => onChange?.({ ...totalState, refundLabel: e.target?.value })}
                    />
                  }

                  {
                    ["sales_return",]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("credits_remaining")}
                      id="creditsRemainingLabel"
                      value={totalState?.creditsRemainingLabel ?? "Credits Remaining"}
                      onChange={(e) => onChange?.({ ...totalState, creditsRemainingLabel: e.target?.value })}
                    />
                  }

                  {
                    ["sales_invoice",]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("write_off_amount")}
                      id="creditsAppliedLabel"
                      value={totalState?.writeOffAmountLabel ?? "Write Off Amount"}
                      onChange={(e) => onChange?.({ ...totalState, writeOffAmountLabel: e.target?.value })}
                    />
                  }

                  {
                    ["sales_invoice", "credit_note", "purchase_invoice", "retainer_invoice"]?.includes(templateGroup!) &&
                    <ERPInput
                      type="text"
                      label={t("balance_due")}
                      id="paymentDueLabel"
                      value={totalState?.balanceAmountLabel ?? "Balance Due"}
                      onChange={(e) => onChange?.({ ...totalState, balanceAmountLabel: e.target?.value })}
                    />
                  }
                </>
              )
            }
          </>
        )
      }

      {
        !["sales_order", "credit_note", "purchase_order", "purchase_invoice", "payment_receipts", "vendor_credit", "sales_return"]?.includes(templateGroup!) &&
        <ERPCheckbox
          disabled={templateGroup === "journal_entry" || templateGroup === "qty_adjustment" || templateGroup === "value_adjustment"}
          checked={totalState?.showAmoutInWords}
          id="showAmoutInWords"
          label={t("show_amount_in_words")}
          onChange={(e) => onChange?.({ ...totalState, showAmoutInWords: e.target.checked })}
        />
      }
    </div>
  );
};

const TaxesTableManager = ({ totalState, onChange }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('transaction')

  return <div className="bg-white p-4 flex flex-col gap-4">
    <ERPCheckbox
      id="showTaxSummaryTable"
      label={t("show_tax_summary_table")}
      checked={totalState?.showTaxSummaryTable}
      onChange={(e) => onChange?.({ ...totalState, showTaxSummaryTable: e.target.checked })}
    />

    <ERPInput
      type="text"
      id="taxSummaryTitle"
      label={t("tax_summary_title")}
      disabled={!totalState?.showTaxSummaryTable}
      value={totalState?.taxSummaryTitle ?? "Tax Summary"}
      onChange={(e) => onChange?.({ ...totalState, taxSummaryTitle: e.target?.value })}
    />

    <ERPInput
      type="text"
      label={t("tax_details")}
      id="taxDetailsLabel"
      disabled={!totalState?.showTaxSummaryTable}
      value={totalState?.taxDetailsLabel ?? "Tax Details"}
      onChange={(e) => onChange?.({ ...totalState, taxDetailsLabel: e.target?.value })}
    />

    <ERPCheckbox
      label={t("taxable_amount")}
      id="showTaxableAmountLabel"
      disabled={!totalState?.showTaxSummaryTable}
      checked={totalState?.showTaxableAmountLabel}
      onChange={(e) => onChange?.({ ...totalState, showTaxableAmountLabel: e.target.checked })}
    />

    <ERPInput
      noLabel
      type="text"
      id="taxableAmountLabel"
      value={totalState?.taxableAmountLabel ?? "Taxable Amount"}
      disabled={!totalState?.showTaxSummaryTable || !totalState?.showTaxableAmountLabel}
      onChange={(e) => onChange?.({ ...totalState, taxableAmountLabel: e.target?.value })}
    />

    <ERPCheckbox
      label={t("tax_amount")}
      id="showTaxAmountLabel"
      checked={totalState?.showTaxAmountLabel}
      disabled={!totalState?.showTaxSummaryTable}
      onChange={(e) => onChange?.({ ...totalState, showTaxAmountLabel: e.target.checked })}
    />

    <ERPInput
      noLabel
      type="text"
      id="taxAmountLabel"
      value={totalState?.taxAmountLabel ?? "Tax Amount"}
      disabled={!totalState?.showTaxSummaryTable || !totalState?.showTaxAmountLabel}
      onChange={(e) => onChange?.({ ...totalState, taxAmountLabel: e.target?.value })}
    />

    <ERPCheckbox
      label={t("total_amount")}
      id="showTotalAmountLabel"
      disabled={!totalState?.showTaxSummaryTable}
      checked={totalState?.showTotalAmountLabel}
      onChange={(e) => onChange?.({ ...totalState, showTotalAmountLabel: e.target.checked })}
    />

    <ERPInput
      noLabel
      type="text"
      id="totalAmountLabel"
      value={totalState?.totalAmountLabel ?? "Total Amount"}
      disabled={!totalState?.showTaxSummaryTable || !totalState?.showTotalAmountLabel}
      onChange={(e) => onChange?.({ ...totalState, totalAmountLabel: e.target?.value })}
    />

    <ERPInput
      type="text"
      label={t("total")}
      id="totalLabel"
      disabled={!totalState?.showTaxSummaryTable}
      value={totalState?.totalLabel ?? "Total"}
      onChange={(e) => onChange?.({ ...totalState, totalLabel: e.target?.value })}
    />
  </div>
}

const TotalDesigner = ({ totalState, onChange }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const [activeTab, setActiveTab] = useState(0);
  const [currentTab, setTab] = useState<"total_section" | "taxes" | "">("total_section");
  const { t } = useTranslation("system")

  return (
    <div className="flex flex-col gap-1 h-[calc(100vh-180px)] overflow-auto bg-[#F9F9FB]">
      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4" onClick={() => setTab(currentTab === "total_section" ? "" : "total_section")}>
        <div>{t("total_section")}</div>
        <div><ChevronDownIcon className={`h-5  ${currentTab === "total_section" ? "" : "-rotate-90"} transition-all`} /></div>
      </div>

      {
        currentTab === "total_section" &&
        <div className="bg-white">
          <div className="p-4">
            <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
          </div>
          {activeTab === 0 && <LabelsEditor totalState={totalState} onChange={onChange} />}
          {activeTab === 1 && <LayoutEditor totalState={totalState} onChange={onChange} />}
        </div>
      }

      <div className={`${["sales_invoice", "sales_estimate", "sales_order", "delivery_challan", "credit_note", "sales_return"]?.includes(templateGroup!) ? "flex" : "hidden"}   justify-between items-center pb-4 border-b cursor-pointer bg-white p-4 `}
        onClick={() => setTab(currentTab === "taxes" ? "" : "taxes")}>
        <div>{t("taxes")}</div>
        <div>  <ChevronDownIcon className={`h-5  ${currentTab === "taxes" ? "" : "-rotate-90"} transition-all`} />  </div>
      </div>
      {currentTab === "taxes" && <TaxesTableManager totalState={totalState} onChange={onChange} />}
    </div>
  );
};

export default TotalDesigner;