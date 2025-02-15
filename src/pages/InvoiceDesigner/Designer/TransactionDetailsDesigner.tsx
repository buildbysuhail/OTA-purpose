import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HeaderState, TemplateState } from "./interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";


interface HeaderDesignerProps {
  onChange: (state: HeaderState) => void;
  headerState?: HeaderState;
  template?: TemplateState;
}

const TransactionDetailsDesigner = ({ template, onChange }: HeaderDesignerProps) => {
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"org_detail" | "cust_detail" | "document_detail" | "">("org_detail");
  const templateGroup = searchParams?.get("template_group");
  const headerState = template?.headerState;
  const isCustomer = !["purchase_order", "vendor", "payment_made"]?.includes(templateGroup!)
  const { t } = useTranslation('system')
  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">
      {
        !["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
        <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4" onClick={() => setTab(currentTab === "cust_detail" ? "" : "cust_detail")}>
          {isCustomer ? t("customer_details") : t("vendor_details")}
          <ChevronDownIcon className={`h-5  ${currentTab === "cust_detail" ? "" : "-rotate-90"} transition-all`} />
        </div>
      }

      {currentTab === "cust_detail" && <div className="flex flex-col gap-3 bg-white p-4">
        <div className="text-sm">{isCustomer ? t("customer") : t("vendor")}{t("name")}</div>
        {
          ["payment_receipts", "retainer_payment_receipts", "payment_made"]?.includes(templateGroup!) &&
          <>
            <ERPCheckbox
              id="showReceivedFrom"
              label={["payment_made"]?.includes(templateGroup!) ? t("paid_to") : t("received_from")}
              checked={headerState?.showReceivedFrom}
              onChange={(e) => onChange({ ...headerState, showReceivedFrom: e.target.checked })}
            />
            <ERPInput
              noLabel
              id="receivedFromLabel"
              value={headerState?.receivedFromLabel}
              onChange={(e) => onChange({ ...headerState, receivedFromLabel: e.target?.value })}
            />
          </>
        }
        <ERPInput
          type="color"
          id="bg_color"
          placeholder=""
          label={t("font_color")}
          value={headerState?.customerNameFontColor}
          onChange={(e) => onChange?.({ ...headerState, customerNameFontColor: e.target?.value })}
        />
        <ERPStepInput
          min={8}
          step={1}
          max={28}
          placeholder=" "
          id="font_size"
          label={t("font_size_(pts)")}
          value={headerState?.customerNameFontSize ?? 12}
          onChange={(font_size) => onChange?.({ ...headerState, customerNameFontSize: font_size })}
        />
        {
          !["delivery_challan", "payment_receipts", "payment_made", "retainer_payment_receipts"]?.includes(templateGroup!) && <>
            <ERPCheckbox
              id="hasBillTo"
              label={t("bill_to")}
              checked={headerState?.hasBillTo}
              onChange={(e) => onChange({ ...headerState, hasBillTo: e.target.checked })}
            />
            <ERPInput
              noLabel
              id="billTo"
              label={t("bill_to")}
              value={headerState?.billTo ?? "Bill To"}
              onChange={(e) => onChange({ ...headerState, billTo: e.target?.value })}
            />
          </>
        }

        {
          !["retainer_invoice", "payment_receipts", "payment_made", "retainer_payment_receipts", "vendor", "sales_return"]?.includes(templateGroup!) && <>
            <ERPCheckbox
              id="hasShipTo"
              label={t("ship_to")}
              checked={headerState?.hasShipTo}
              onChange={(e) => onChange({ ...headerState, hasShipTo: e.target.checked })}
            />
            <ERPInput
              noLabel
              id="ship_to"
              label={t("ship_to")}
              value={headerState?.shipTo ?? "Ship To"}
              onChange={(e) => onChange({ ...headerState, shipTo: e.target?.value })}
            />
          </>
        }
      </div>
      }

      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4" onClick={() => setTab(currentTab === "document_detail" ? "" : "document_detail")}>
        {t("document_details")}<ChevronDownIcon className={`h-5  ${currentTab === "document_detail" ? "" : "-rotate-90"} transition-all`} />
      </div>

      {currentTab === "document_detail" &&
        <div className="flex flex-col gap-5 bg-white p-4">
          <div className="text-sm">{t("document_title")}</div>
          {
            !["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                checked={headerState?.showDocTitle}
                id="showDocTitle"
                label={t("document_title")}
                onChange={(e) => onChange({ ...headerState, showDocTitle: e.target.checked })}
              />
              {headerState?.showDocTitle && (
                <ERPInput
                  id="docTitle"
                  noLabel
                  value={headerState?.docTitle}
                  onChange={(e) => onChange({ ...headerState, docTitle: e.target?.value })}
                />
              )}
            </div>
          }

          <ERPInput
            value={headerState?.docTitleFontColor}
            onChange={(e) => onChange?.({ ...headerState, docTitleFontColor: e.target?.value })}
            label={t("font_color")}
            id="bg_color"
            type="color"
            placeholder=""
          />
          <ERPStepInput
            value={headerState?.docTitleFontSize ?? 16}
            onChange={(font_size) => onChange?.({ ...headerState, docTitleFontSize: font_size })}
            label={t("font_size_(pts)")}
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />

          {
            !["qty_adjustment", "value_adjustment",
              "sales_estimate", "sales_order",
              "delivery_challan", "purchase_order",
              "journal_entry", "customer", "vendor"]?.includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <ERPCheckbox
              id="showBalanceDue"
              label={t("balance_due")}
              checked={headerState?.showBalanceDue}
              onChange={(e) => onChange({ ...headerState, showBalanceDue: e.target.checked })}
            />
          }

          <ERPInput
            id="phone"
            label={t("phone")}
            value={headerState?.phoneLabel}
            onChange={(e) => onChange({ ...headerState, phoneLabel: e.target?.value })}
          />
          <ERPInput
            id="fax"
            label={t("fax_number")}
            value={headerState?.faxLabel}
            onChange={(e) => onChange({ ...headerState, faxLabel: e.target?.value })}
          />

          {headerState?.recieptInfo?.showReceiptTable && <ReceiptHeaderDesigner template={template} headerState={headerState} onChange={onChange} />}

          {
            !["qty_adjustment", "value_adjustment"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateNumberField"
                label={t("number_field")}
                checked={headerState?.showNumberField}
                onChange={(e) => onChange({ ...headerState, showNumberField: e.target.checked })}
              />
              {headerState?.showNumberField && (
                <ERPInput
                  noLabel
                  id="numberField"
                  label={t("invoice_#")}
                  value={headerState?.numberField}
                  onChange={(e) => onChange({ ...headerState, numberField: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowReasonField"
                label={t("reason")}
                checked={headerState?.showReasonField}
                onChange={(e) => onChange({ ...headerState, showReasonField: e.target.checked })}
              />
              {headerState?.showReasonField && (
                <ERPInput
                  noLabel
                  id="reasonId"
                  value={headerState?.reasonLabel}
                  onChange={(e) => onChange({ ...headerState, reasonLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowAccountField"
                label={t("account")}
                checked={headerState?.showAccountField}
                onChange={(e) => onChange({ ...headerState, showAccountField: e.target.checked })}
              />
              {headerState?.showAccountField && (
                <ERPInput
                  noLabel
                  id="accountId"
                  value={headerState?.accountLabel}
                  onChange={(e) => onChange({ ...headerState, accountLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowAdjTypeField"
                label={t("adjustment_type")}
                checked={headerState?.showAdjTypeField}
                onChange={(e) => onChange({ ...headerState, showAdjTypeField: e.target.checked })}
              />
              {headerState?.showAdjTypeField && (
                <ERPInput
                  noLabel
                  id="adjTypeId"
                  value={headerState?.adjTypeLabel}
                  onChange={(e) => onChange({ ...headerState, adjTypeLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowBranchField"
                label={t("branch")}
                checked={headerState?.showBranchField}
                onChange={(e) => onChange({ ...headerState, showBranchField: e.target.checked })}
              />
              {headerState?.showBranchField && (
                <ERPInput
                  noLabel
                  id="branchLabel"
                  value={headerState?.branchLabel ?? "Branch"}
                  onChange={(e) => onChange({ ...headerState, branchLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowCreateUserField"
                label={t("created_by")}
                checked={headerState?.showCreateUserField}
                onChange={(e) => onChange({ ...headerState, showCreateUserField: e.target.checked })}
              />
              {headerState?.showCreateUserField && (
                <ERPInput
                  noLabel
                  id="userCreateId"
                  value={headerState?.createUserLabel}
                  onChange={(e) => onChange({ ...headerState, createUserLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["customer", "vendor"]?.includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowDateField"
                label={t("date_field")}
                checked={headerState?.showDateField}
                onChange={(e) => onChange({ ...headerState, showDateField: e.target.checked })}
              />
              {headerState?.showDateField && (
                <ERPInput
                  noLabel
                  label={t("date")}
                  id="dateField"
                  value={headerState?.dateField}
                  onChange={(e) => onChange({ ...headerState, dateField: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_order", "delivery_challan",
              "retainer_invoice", "credit_note",
              "vendor_credit", "journal_entry",
              "customer", "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowDueDate"
                label={t("due_date")}
                checked={headerState?.showDueDate}
                onChange={(e) => onChange({ ...headerState, showDueDate: e.target.checked })}
              />
              {headerState?.showDueDate && (
                <ERPInput
                  id="due_date"
                  label={t("due_date")}
                  value={headerState?.due_date}
                  noLabel
                  onChange={(e) => onChange({ ...headerState, due_date: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_estimate", "retainer_invoice",
              "credit_note", "vendor_credit",
              "journal_entry", "customer",
              "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowTerms"
                label={t("terms")}
                checked={headerState?.showTerms}
                onChange={(e) => onChange({ ...headerState, showTerms: e.target.checked })}
              />
              {headerState?.showTerms && (
                <ERPInput
                  noLabel
                  id="terms"
                  label={t("terms")}
                  value={headerState?.terms}
                  onChange={(e) => onChange({ ...headerState, terms: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["sales_order",].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowShipmentDate"
                label={t("shipment_date")}
                checked={headerState?.showShipmentDate}
                onChange={(e) => onChange({ ...headerState, showShipmentDate: e.target.checked })}
              />
              {headerState?.showTerms && (
                <ERPInput
                  noLabel
                  id="shipmentDateLabel"
                  label={t("shipment_date")}
                  value={headerState?.shipmentDateLabel ?? "Shipment Date"}
                  onChange={(e) => onChange({ ...headerState, shipmentDateLabel: e.target?.value })}
                />
              )}
            </div>
          }

          <div className="flex flex-col gap-2">
            {
              !headerState?.recieptInfo?.showReceiptTable &&
              <ERPCheckbox
                id="headerStateShowReference"
                label={t("reference")}
                checked={headerState?.showReference}
                onChange={(e) => onChange({ ...headerState, showReference: e.target.checked })}
              />
            }

            {
              headerState?.showReference && (
                <ERPInput
                  noLabel
                  id="reference"
                  label={t("reference")}
                  value={headerState?.reference}
                  onChange={(e) => onChange({ ...headerState, reference: e.target?.value })}
                />
              )
            }
          </div>

          {
            ["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="showNotesLabel"
                label={t("notes")}
                checked={headerState?.showNotesLabel}
                onChange={(e) => onChange({ ...headerState, showNotesLabel: e.target.checked })}
              />
              {headerState?.showNotesLabel && (
                <ERPInput
                  noLabel
                  id="notesLabel"
                  value={headerState?.notesLabel ?? "Notes"}
                  onChange={(e) => onChange({ ...headerState, notesLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="showAmount"
                label={t("amount")}
                checked={headerState?.showAmount}
                onChange={(e) => onChange({ ...headerState, showAmount: e.target.checked })}
              />
              {headerState?.showAmount && (
                <ERPInput
                  noLabel
                  id="amountLabel"
                  value={headerState?.amountLabel ?? "Amount"}
                  onChange={(e) => onChange({ ...headerState, amountLabel: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "delivery_challan", "retainer_invoice",
              "purchase_order", "purchase_invoice",
              "vendor_credit", "journal_entry",
              "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowSalesPerson"
                label={t("sales_person")}
                checked={headerState?.showSalesPerson}
                onChange={(e) => onChange({ ...headerState, showSalesPerson: e.target.checked })}
              />
              {headerState?.showSalesPerson && (
                <ERPInput
                  noLabel
                  id="salesPerson"
                  label={t("sales_person")}
                  value={headerState?.salesPerson}
                  onChange={(e) => onChange({ ...headerState, salesPerson: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_estimate", "sales_order",
              "delivery_challan", "journal_entry",
              "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowTransactionType"
                label={t("transaction_type")}
                checked={headerState?.showTransactionType}
                onChange={(e) => onChange({ ...headerState, showTransactionType: e.target.checked })}
              />
              {headerState?.showTransactionType && (
                <ERPInput
                  noLabel
                  id="transactionType"
                  label={t("transaction_type")}
                  value={headerState?.transactionType ?? "Transaction Type"}
                  onChange={(e) => onChange({ ...headerState, transactionType: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_order", "delivery_challan",
              "retainer_invoice", "purchase_order",
              "journal_entry", "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowSubject"
                label={t("subject")}
                checked={headerState?.showSubject}
                onChange={(e) => onChange({ ...headerState, showSubject: e.target.checked })}
              />
              {headerState?.showSubject && (
                <ERPInput
                  noLabel
                  id="subject"
                  label={t("subject")}
                  value={headerState?.subject}
                  onChange={(e) => onChange({ ...headerState, subject: e.target?.value })}
                />
              )}
            </div>
          }

          {
            ["sales_return", "credit_note"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2 mb-5">
              <ERPCheckbox
                id="headerStateShowAssociatedInvNo"
                label={t("associated_invoice_number")}
                checked={headerState?.showAssociatedInvNo}
                onChange={(e) => onChange({ ...headerState, showAssociatedInvNo: e.target.checked })}
              />
              <ERPCheckbox
                id="headerStateShowAssociatedInvDate"
                label={t("associated_invoice_date")}
                checked={headerState?.showAssociatedInvDate}
                onChange={(e) => onChange({ ...headerState, showAssociatedInvDate: e.target.checked })}
              />
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_estimate", "sales_order",
              "delivery_challan", "retainer_invoice",
              "credit_note", "purchase_order", "journal_entry",
              "customer", "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowSupplyDate"
                label={t("supply_date")}
                checked={headerState?.showSupplyDate}
                onChange={(e) => onChange({ ...headerState, showSupplyDate: e.target.checked })}
              />
              {headerState?.showSupplyDate && (
                <ERPInput
                  noLabel
                  id="supplyDate"
                  value={headerState?.supplyDate}
                  label={t("supply_date")}
                  onChange={(e) => onChange({ ...headerState, supplyDate: e.target?.value })}
                />
              )}
            </div>
          }

          {
            !["qty_adjustment", "value_adjustment",
              "sales_estimate", "sales_order",
              "delivery_challan", "credit_note",
              "purchase_order", "purchase_invoice",
              "vendor_credit", "journal_entry", "customer",
              "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="headerStateShowStatusStamp"
                disabled={
                  templateGroup === "qty_adjustment" ||
                  templateGroup === "value_adjustment" ||
                  headerState?.recieptInfo?.showReceiptTable
                }
                label={t("status_stamp")}
                checked={headerState?.showStatusStamp}
                onChange={(e) => onChange({ ...headerState, showStatusStamp: e.target.checked })}
              />
            </div>
          }

          {
            ["customer", "vendor"]?.includes(templateGroup!) &&
            <ERPCheckbox
              id="headerStateAccountSummaryShowAccountSummary"
              label={t("total_account_summary")}
              checked={headerState?.accountSummary?.showAccountSummary}
              onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showAccountSummary: e.target.checked } })}
            />
          }

          {
            headerState?.accountSummary?.showAccountSummary && (
              <AccountSummaryInformation template={template} headerState={headerState} onChange={onChange} />
            )
          }
        </div>
      }
    </div>
  );
};

export default TransactionDetailsDesigner;

const ReceiptHeaderDesigner = ({ template, headerState, onChange }: HeaderDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');

  return (
    <>
      <h1 className="py-1">{t("receipt_information")}</h1>
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateRecieptInfoShowReceiptNumber"
          label={t("number_field")}
          checked={headerState?.recieptInfo?.showReceiptNumber}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptNumber: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptNumber && (
          <ERPInput
            noLabel
            maxLength={20}
            id="voucherNumber"
            value={headerState?.recieptInfo?.receiptNumberLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptNumberLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateRecieptInfoShowReceiptDate"
          label={t("payment_date")}
          checked={headerState?.recieptInfo?.showReceiptDate}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptDate: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptDate && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptDateLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptDateLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateRecieptInfoShowReceiptReference"
          label={t("reference_number")}
          checked={headerState?.recieptInfo?.showReceiptReference}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptReference: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptReference && (
          <ERPInput
            noLabel
            id="referenceNo"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptReferenceLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptReferenceLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateRecieptInfoShowReceiptMode"
          label={t("payment_mode")}
          checked={headerState?.recieptInfo?.showReceiptMode}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptMode: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptMode && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptModeLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptModeLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateRecieptInfoShowReceiptAmount"
          label={t("amount_in_words")}
          checked={headerState?.recieptInfo?.showReceiptAmount}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptAmount: e.target.checked } })}
        />
        {/* {headerState?.recieptInfo?.showReceiptAmount && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptAmountLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptAmountLabel: e.target?.value } })}
          />
        )} */}
      </div>

      <h1 className="py-1">{["payment_made"]?.includes(templateGroup!) ? t("amount_made") : t("amount_received")}</h1>
      <div className="flex flex-col gap-2">
        <ERPInput
          type="text"
          label={["payment_made"]?.includes(templateGroup!) ? t("amount_made_label") : t("amount_received_label")}
          id="amtReceivedLabel"
          maxLength={25}
          value={headerState?.recieptInfo?.amtReceivedLabel}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedLabel: e.target?.value } })}
        />
      </div>

      <ERPDataCombobox
        label={t("currency_symbol")}
        id="font"
        defaultValue={headerState?.recieptInfo?.currencySymbolPosition ?? "before"}
        handleChange={(id, value) => onChange?.({
          ...headerState,
          recieptInfo: { ...headerState?.recieptInfo, currencySymbolPosition: value.value }
        })}
        options={[
          { label: "Before Amount", value: "before" },
          { label: "After Amount", value: "after" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <ERPInput
          type="number"
          id="font_Size"
          value={headerState?.recieptInfo?.amtReceivedFontSize}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedFontSize: e.target?.valueAsNumber } })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <ERPInput
          type="color"
          id="font_color"
          value={headerState?.recieptInfo?.amtReceivedFontColor}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedFontColor: e.target?.value } })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <ERPInput
          type="color"
          id="background_color"
          value={headerState?.recieptInfo?.amtReceivedBgColor}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedBgColor: e.target?.value } })}
        />
      </div>
      <div className="h-20"></div>
    </>
  );
};

const AccountSummaryInformation = ({ template, headerState, onChange }: HeaderDesignerProps) => {
  const { t } = useTranslation('system');
  return (
    <>
      {/* <h1 className="py-1">Total Account Summary</h1> */}
      <div className="flex flex-col gap-2">
        <ERPInput
          label={t("account_summary_label")}
          id="accountSummaryLabel"
          value={headerState?.accountSummary?.accountSummaryLabel}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, accountSummaryLabel: e.target?.value } })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateAccountSummaryShowOpeningBalance"
          label={t("opening_balance")}
          checked={headerState?.accountSummary?.showOpeningBalance}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showOpeningBalance: e.target.checked } })}
        />
        {headerState?.accountSummary?.showOpeningBalance && (
          <ERPInput
            noLabel
            id="openBalance"
            value={headerState?.accountSummary?.openingBalanceLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, openingBalanceLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateAccountSummaryShowInvoicedAmount"
          label={t("invoiced_amount")}
          checked={headerState?.accountSummary?.showInvoicedAmount}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showInvoicedAmount: e.target.checked } })}
        />
        {headerState?.accountSummary?.showInvoicedAmount && (
          <ERPInput
            noLabel
            id="invoicedAmount"
            value={headerState?.accountSummary?.invoicedAmountLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, invoicedAmountLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateAccountSummaryShowAmountPaid"
          label={t("amount_paid")}
          checked={headerState?.accountSummary?.showAmountPaid}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showAmountPaid: e.target.checked } })}
        />
        {headerState?.accountSummary?.showAmountPaid && (
          <ERPInput
            noLabel
            id="amtPaidLbl"
            value={headerState?.accountSummary?.amountPaidLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, amountPaidLabel: e.target?.value } })}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <ERPCheckbox
          id="headerStateAccountSummaryShowBalanceDue"
          label={t("balance_due")}
          checked={headerState?.accountSummary?.showBalanceDue}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showBalanceDue: e.target.checked } })}
        />
        {headerState?.accountSummary?.showBalanceDue && (
          <ERPInput
            noLabel
            id="balanceDue"
            value={headerState?.accountSummary?.balanceDueLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, balanceDueLabel: e.target?.value } })}
          />
        )}
      </div>
    </>
  );
};
