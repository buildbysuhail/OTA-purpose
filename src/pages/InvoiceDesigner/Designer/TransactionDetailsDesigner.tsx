import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { HeaderState, TemplateState } from "./interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPSelect from "../../../components/ERPComponents/erp-select";
import ERPSlider from "../../../components/ERPComponents/erp-slider";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";


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

  const comapanies = useSelector((state: any) => state?.GetUserCompanies);
  const activeBranch = comapanies?.data?.find((item: any) => item?.is_active);

  const isCustomer = !["purchase_order", "vendor", "payment_made"]?.includes(templateGroup!)

  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">

      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "org_detail" ? "" : "org_detail")}
      >
        Organization Details<ChevronDownIcon className={`h-5  ${currentTab === "org_detail" ? "" : "-rotate-90"} transition-all`} />
      </div>

      {currentTab === "org_detail" && <div className={"transition-all  flex flex-col gap-5 bg-white p-4"}>
        <ERPCheckbox
          id="showLogo"
          label="Show Organization Logo"
          checked={headerState?.showLogo}
          onChange={(e) => onChange({ ...headerState, showLogo: e.target.checked })}
        />
        {headerState?.showLogo && (
          <div className="flex flex-col gap-2">
            <img src={activeBranch?.company?.image} className="border border-dashed mb-2 h-16 w-full object-contain" />
            <ERPSlider
              id="logoSize"
              label="Logo Size"
              defaultValue={headerState?.logoSize}
              onChange={(e) => {
                onChange({ ...headerState, logoSize: e.target.valueAsNumber });
              }}
            />
          </div>
        )}
        {/* */}
        {!["qty_adjustment", "value_adjustment"].includes(templateGroup!) &&
          <>
            <ERPCheckbox
              id="showOrgName"
              checked={headerState?.showOrgName}
              label="Show Organization Name"
              onChange={(e) => onChange({ ...headerState, showOrgName: e.target.checked })}
            />
            <ERPInput
              value={headerState?.OrganizationFontColor}
              onChange={(e) => onChange?.({ ...headerState, OrganizationFontColor: e.target.value })}
              label="Font Color"
              id="bg_color"
              type="color"
              placeholder=""
            />
            <ERPStepInput
              value={headerState?.OrganizationFontSize ?? 12}
              onChange={(font_size) => onChange?.({ ...headerState, OrganizationFontSize: font_size })}
              label="Font Size (pts)"
              id="font_size"
              placeholder=" "
              min={8}
              max={28}
              step={1}
            />
          </>
        }

        {!["qty_adjustment", "value_adjustment"].includes(templateGroup!) &&
          <ERPCheckbox
            id="showOrgAddress"
            checked={headerState?.showOrgAddress}
            label="Show Organization Address"
            onChange={(e) => onChange({ ...headerState, showOrgAddress: e.target.checked })}
          />
        }


        {/* */}

      </div>}
      {/* */}


      {!["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
        <div
          className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
          onClick={() => setTab(currentTab === "cust_detail" ? "" : "cust_detail")}
        >
          {isCustomer ? "Customer Details" : "Vendor Details"}
          <ChevronDownIcon className={`h-5  ${currentTab === "cust_detail" ? "" : "-rotate-90"} transition-all`} />
        </div>
      }

      {currentTab === "cust_detail" && <div className="flex flex-col gap-3 bg-white p-4">

        <div className="text-sm">{isCustomer ? "Customer" : "Vendor"} name</div>

        {["payment_receipts", "retainer_payment_receipts", "payment_made"]?.includes(templateGroup!) &&
          <>
            <ERPCheckbox
              id="showReceivedFrom"
              label={["payment_made"]?.includes(templateGroup!) ? "Paid To" : "Received From"}
              checked={headerState?.showReceivedFrom}
              onChange={(e) => onChange({ ...headerState, showReceivedFrom: e.target.checked })}
            />

            <ERPInput
              noLabel
              id="receivedFromLabel"
              value={headerState?.receivedFromLabel}
              onChange={(e) => onChange({ ...headerState, receivedFromLabel: e.target.value })}
            />
          </>
        }

        <ERPInput
          type="color"
          id="bg_color"
          placeholder=""
          label="Font Color"
          value={headerState?.customerNameFontColor}
          onChange={(e) => onChange?.({ ...headerState, customerNameFontColor: e.target.value })}
        />

        <ERPStepInput
          min={8}
          step={1}
          max={28}
          placeholder=" "
          id="font_size"
          label="Font Size (pts)"
          value={headerState?.customerNameFontSize ?? 12}
          onChange={(font_size) => onChange?.({ ...headerState, customerNameFontSize: font_size })}
        />

        {!["delivery_challan", "payment_receipts", "payment_made", "retainer_payment_receipts"]?.includes(templateGroup!) && <>
          <ERPCheckbox
            id="hasBillTo"
            label="Bill To"
            checked={headerState?.hasBillTo}
            onChange={(e) => onChange({ ...headerState, hasBillTo: e.target.checked })}
          />

          <ERPInput
            noLabel
            id="billTo"
            label="Bill To"
            value={headerState?.billTo ?? "Bill To"}
            onChange={(e) => onChange({ ...headerState, billTo: e.target.value })}
          />
        </>
        }

        {!["retainer_invoice", "payment_receipts", "payment_made", "retainer_payment_receipts", "vendor", "sales_return"]?.includes(templateGroup!) && <>
          <ERPCheckbox
            id="hasShipTo"
            label="Ship To"
            checked={headerState?.hasShipTo}
            onChange={(e) => onChange({ ...headerState, hasShipTo: e.target.checked })}
          />

          <ERPInput
            noLabel
            id="ship_to"
            label="Ship To"
            value={headerState?.shipTo ?? "Ship To"}
            onChange={(e) => onChange({ ...headerState, shipTo: e.target.value })}
          />
        </>}

      </div>
      }

      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "document_detail" ? "" : "document_detail")}
      >
        Document Details<ChevronDownIcon className={`h-5  ${currentTab === "document_detail" ? "" : "-rotate-90"} transition-all`} />
      </div>
      {/* */}

      {currentTab === "document_detail" &&
        <div className="flex flex-col gap-5 bg-white p-4">

          <div className="text-sm">Document Title</div>

          {!["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                checked={headerState?.showDocTitle}
                id="showDocTitle" label="Document Title"
                onChange={(e) => onChange({ ...headerState, showDocTitle: e.target.checked })}
              />
              {headerState?.showDocTitle && (
                <ERPInput
                  id="docTitle"
                  noLabel
                  value={headerState?.docTitle}
                  onChange={(e) => onChange({ ...headerState, docTitle: e.target.value })}
                />
              )}
            </div>
          }

          <ERPInput
            value={headerState?.docTitleFontColor}
            onChange={(e) => onChange?.({ ...headerState, docTitleFontColor: e.target.value })}
            label="Font Color"
            id="bg_color"
            type="color"
            placeholder=""
          />

          <ERPStepInput
            value={headerState?.docTitleFontSize ?? 16}
            onChange={(font_size) => onChange?.({ ...headerState, docTitleFontSize: font_size })}
            label="Font Size (pts)"
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />



          {/*  */}

          {!["qty_adjustment", "value_adjustment",
            "sales_estimate", "sales_order",
            "delivery_challan", "purchase_order",
            "journal_entry", "customer", "vendor"]?.includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <ERPCheckbox
              id="showBalanceDue"
              label="Balance Due"
              checked={headerState?.showBalanceDue}
              onChange={(e) => onChange({ ...headerState, showBalanceDue: e.target.checked })}
            />
          }

          <ERPInput
            id="phone"
            label="Phone"
            value={headerState?.phoneLabel}
            onChange={(e) => onChange({ ...headerState, phoneLabel: e.target.value })}
          />

          <ERPInput
            id="fax"
            label="Fax Number"
            value={headerState?.faxLabel}
            onChange={(e) => onChange({ ...headerState, faxLabel: e.target.value })}
          />

          {headerState?.recieptInfo?.showReceiptTable && <ReceiptHeaderDesigner template={template} headerState={headerState} onChange={onChange} />}


          {/*  */}

          {!["qty_adjustment", "value_adjustment"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Number Field"
                checked={headerState?.showNumberField}
                onChange={(e) => onChange({ ...headerState, showNumberField: e.target.checked })}
              />
              {headerState?.showNumberField && (
                <ERPInput
                  noLabel
                  id="numberField"
                  label="Invoice #"
                  value={headerState?.numberField}
                  onChange={(e) => onChange({ ...headerState, numberField: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">

              <ERPCheckbox
                label="Reason"
                checked={headerState?.showReasonField}
                onChange={(e) => onChange({ ...headerState, showReasonField: e.target.checked })}
              />

              {headerState?.showReasonField && (
                <ERPInput
                  noLabel
                  id="reasonId"
                  value={headerState?.reasonLabel}
                  onChange={(e) => onChange({ ...headerState, reasonLabel: e.target.value })}
                />
              )}
            </div>
          }

          {["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Account"
                checked={headerState?.showAccountField}
                onChange={(e) => onChange({ ...headerState, showAccountField: e.target.checked })}
              />
              {headerState?.showAccountField && (
                <ERPInput
                  noLabel
                  id="accountId"
                  value={headerState?.accountLabel}
                  onChange={(e) => onChange({ ...headerState, accountLabel: e.target.value })}
                />
              )}
            </div>
          }

          {["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Adjustment Type"
                checked={headerState?.showAdjTypeField}
                onChange={(e) => onChange({ ...headerState, showAdjTypeField: e.target.checked })}
              />
              {headerState?.showAdjTypeField && (
                <ERPInput
                  noLabel
                  id="adjTypeId"
                  value={headerState?.adjTypeLabel}
                  onChange={(e) => onChange({ ...headerState, adjTypeLabel: e.target.value })}
                />
              )}
            </div>
          }

          {["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Branch"
                checked={headerState?.showBranchField}
                onChange={(e) => onChange({ ...headerState, showBranchField: e.target.checked })}
              />
              {headerState?.showBranchField && (
                <ERPInput
                  noLabel
                  id="branchLabel"
                  value={headerState?.branchLabel ?? "Branch"}
                  onChange={(e) => onChange({ ...headerState, branchLabel: e.target.value })}
                />
              )}
            </div>
          }

          {["qty_adjustment", "value_adjustment"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Created By"
                checked={headerState?.showCreateUserField}
                onChange={(e) => onChange({ ...headerState, showCreateUserField: e.target.checked })}
              />
              {headerState?.showCreateUserField && (
                <ERPInput
                  noLabel
                  id="userCreateId"
                  value={headerState?.createUserLabel}
                  onChange={(e) => onChange({ ...headerState, createUserLabel: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {!["customer", "vendor"]?.includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Date Field"
                checked={headerState?.showDateField}
                onChange={(e) => onChange({ ...headerState, showDateField: e.target.checked })}
              />
              {headerState?.showDateField && (
                <ERPInput
                  noLabel
                  label="Date"
                  id="dateField"
                  value={headerState?.dateField}
                  onChange={(e) => onChange({ ...headerState, dateField: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_order", "delivery_challan",
            "retainer_invoice", "credit_note",
            "vendor_credit", "journal_entry",
            "customer", "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Due Date"
                checked={headerState?.showDueDate}
                onChange={(e) => onChange({ ...headerState, showDueDate: e.target.checked })}
              />
              {headerState?.showDueDate && (
                <ERPInput
                  id="due_date"
                  label="Due Date"
                  value={headerState?.due_date}
                  noLabel
                  onChange={(e) => onChange({ ...headerState, due_date: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_estimate", "retainer_invoice",
            "credit_note", "vendor_credit",
            "journal_entry", "customer",
            "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Terms"
                checked={headerState?.showTerms}
                onChange={(e) => onChange({ ...headerState, showTerms: e.target.checked })}
              />
              {headerState?.showTerms && (
                <ERPInput
                  noLabel
                  id="terms"
                  label="Terms"
                  value={headerState?.terms}
                  onChange={(e) => onChange({ ...headerState, terms: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {["sales_order",].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Shipment Date"
                checked={headerState?.showShipmentDate}
                onChange={(e) => onChange({ ...headerState, showShipmentDate: e.target.checked })}
              />
              {headerState?.showTerms && (
                <ERPInput
                  noLabel
                  id="shipmentDateLabel"
                  label="Shipment Date"
                  value={headerState?.shipmentDateLabel ?? "Shipment Date"}
                  onChange={(e) => onChange({ ...headerState, shipmentDateLabel: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          <div className="flex flex-col gap-2">
            {!headerState?.recieptInfo?.showReceiptTable &&
              <ERPCheckbox
                label="Reference"
                checked={headerState?.showReference}
                onChange={(e) => onChange({ ...headerState, showReference: e.target.checked })}
              />
            }
            {headerState?.showReference && (
              <ERPInput
                noLabel
                id="reference"
                label="Reference"
                value={headerState?.reference}
                onChange={(e) => onChange({ ...headerState, reference: e.target.value })}
              />
            )}
          </div>
          {/* */}

          {["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="showNotesLabel" label="Notes"
                checked={headerState?.showNotesLabel}
                onChange={(e) => onChange({ ...headerState, showNotesLabel: e.target.checked })}
              />
              {headerState?.showNotesLabel && (
                <ERPInput
                  noLabel
                  id="notesLabel"
                  value={headerState?.notesLabel ?? "Notes"}
                  onChange={(e) => onChange({ ...headerState, notesLabel: e.target.value })}
                />
              )}
            </div>
          }

          {["journal_entry"].includes(templateGroup!) &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                id="showAmount" label="Amount"
                checked={headerState?.showAmount}
                onChange={(e) => onChange({ ...headerState, showAmount: e.target.checked })}
              />
              {headerState?.showAmount && (
                <ERPInput
                  noLabel
                  id="amountLabel"
                  value={headerState?.amountLabel ?? "Amount"}
                  onChange={(e) => onChange({ ...headerState, amountLabel: e.target.value })}
                />
              )}
            </div>
          }

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "delivery_challan", "retainer_invoice",
            "purchase_order", "purchase_invoice",
            "vendor_credit", "journal_entry",
            "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Sales Person"
                checked={headerState?.showSalesPerson}
                onChange={(e) => onChange({ ...headerState, showSalesPerson: e.target.checked })}
              />
              {headerState?.showSalesPerson && (
                <ERPInput
                  noLabel
                  id="salesPerson"
                  label="Sales Person"
                  value={headerState?.salesPerson}
                  onChange={(e) => onChange({ ...headerState, salesPerson: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_estimate", "sales_order",
            "delivery_challan", "journal_entry",
            "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Transaction Type"
                checked={headerState?.showTransactionType}
                onChange={(e) => onChange({ ...headerState, showTransactionType: e.target.checked })}
              />
              {headerState?.showTransactionType && (
                <ERPInput
                  noLabel
                  id="transactionType"
                  label="Transaction Type"
                  value={headerState?.transactionType ?? "Transaction Type"}
                  onChange={(e) => onChange({ ...headerState, transactionType: e.target.value })}
                />
              )}
            </div>}
          {/* */}

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_order", "delivery_challan",
            "retainer_invoice", "purchase_order",
            "journal_entry", "customer", "vendor"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox

                label="Subject"
                checked={headerState?.showSubject}
                onChange={(e) => onChange({ ...headerState, showSubject: e.target.checked })}
              />
              {headerState?.showSubject && (
                <ERPInput
                  noLabel
                  id="subject"
                  label="Subject"
                  value={headerState?.subject}
                  onChange={(e) => onChange({ ...headerState, subject: e.target.value })}
                />
              )}
            </div>
          }
          {/* */}
          {["sales_return", "credit_note"]?.includes(templateGroup!) &&
            <div className="flex flex-col gap-2 mb-5">
              <ERPCheckbox
                label="Associated Invoice Number"
                checked={headerState?.showAssociatedInvNo}
                onChange={(e) => onChange({ ...headerState, showAssociatedInvNo: e.target.checked })}
              />
              <ERPCheckbox
                label="Associated Invoice Date"
                checked={headerState?.showAssociatedInvDate}
                onChange={(e) => onChange({ ...headerState, showAssociatedInvDate: e.target.checked })}
              />
            </div>
          }

          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_estimate", "sales_order",
            "delivery_challan", "retainer_invoice",
            "credit_note", "purchase_order", "journal_entry",
            "customer", "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                label="Supply Date"
                checked={headerState?.showSupplyDate}
                onChange={(e) => onChange({ ...headerState, showSupplyDate: e.target.checked })}
              />
              {headerState?.showSupplyDate && (
                <ERPInput
                  noLabel
                  id="supplyDate"
                  value={headerState?.supplyDate}
                  label="Supply Date"
                  onChange={(e) => onChange({ ...headerState, supplyDate: e.target.value })}
                />
              )}
            </div>}
          {/* */}
          {!["qty_adjustment", "value_adjustment",
            "sales_estimate", "sales_order",
            "delivery_challan", "credit_note",
            "purchase_order", "purchase_invoice",
            "vendor_credit", "journal_entry", "customer",
            "vendor", "sales_return"].includes(templateGroup!) &&
            !headerState?.recieptInfo?.showReceiptTable &&
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                disabled={
                  templateGroup === "qty_adjustment" ||
                  templateGroup === "value_adjustment" ||
                  headerState?.recieptInfo?.showReceiptTable
                }
                label="Status Stamp"
                checked={headerState?.showStatusStamp}
                onChange={(e) => onChange({ ...headerState, showStatusStamp: e.target.checked })}
              />
            </div>
          }

          {["customer", "vendor"]?.includes(templateGroup!) &&
            <ERPCheckbox
              label="Total Account Summary"
              checked={headerState?.accountSummary?.showAccountSummary}
              onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showAccountSummary: e.target.checked } })}
            />
          }

          {headerState?.accountSummary?.showAccountSummary && (
            <AccountSummaryInformation template={template} headerState={headerState} onChange={onChange} />
          )}

        </div>}


    </div>
  );
};

export default TransactionDetailsDesigner;

const ReceiptHeaderDesigner = ({ template, headerState, onChange }: HeaderDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");

  return (
    <>
      <h1 className="py-1">Reciept Information</h1>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Number field"
          checked={headerState?.recieptInfo?.showReceiptNumber}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptNumber: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptNumber && (
          <ERPInput
            noLabel
            maxLength={20}
            id="voucherNumber"
            value={headerState?.recieptInfo?.receiptNumberLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptNumberLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Payment Date"
          checked={headerState?.recieptInfo?.showReceiptDate}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptDate: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptDate && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptDateLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptDateLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Reference Number"
          checked={headerState?.recieptInfo?.showReceiptReference}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptReference: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptReference && (
          <ERPInput
            noLabel
            id="referenceNo"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptReferenceLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptReferenceLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Payment Mode"
          checked={headerState?.recieptInfo?.showReceiptMode}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptMode: e.target.checked } })}
        />
        {headerState?.recieptInfo?.showReceiptMode && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptModeLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptModeLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Amount in Words"
          checked={headerState?.recieptInfo?.showReceiptAmount}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, showReceiptAmount: e.target.checked } })}
        />
        {/* {headerState?.recieptInfo?.showReceiptAmount && (
          <ERPInput
            noLabel
            id="voucherMode"
            maxLength={20}
            value={headerState?.recieptInfo?.receiptAmountLabel}
            onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, receiptAmountLabel: e.target.value } })}
          />
        )} */}
      </div>
      <h1 className="py-1">{["payment_made"]?.includes(templateGroup!) ? "Amount Made" : "Amount Received"}</h1>
      {/* */}
      <div className="flex flex-col gap-2">
        <ERPInput
          type="text"
          label={["payment_made"]?.includes(templateGroup!) ? "Amount Made Label" : "Amount Received Label"}
          id="amtReceivedLabel"
          maxLength={25}
          value={headerState?.recieptInfo?.amtReceivedLabel}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedLabel: e.target.value } })}
        />
      </div>

      <ERPSelect
        label="Currency Symbol"
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
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedFontSize: e.target.valueAsNumber } })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <ERPInput
          type="color"
          id="font_color"
          value={headerState?.recieptInfo?.amtReceivedFontColor}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedFontColor: e.target.value } })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <ERPInput
          type="color"
          id="background_color"
          value={headerState?.recieptInfo?.amtReceivedBgColor}
          onChange={(e) => onChange({ ...headerState, recieptInfo: { ...headerState?.recieptInfo, amtReceivedBgColor: e.target.value } })}
        />
      </div>
      <div className="h-20"></div>
    </>
  );
};

const AccountSummaryInformation = ({ template, headerState, onChange }: HeaderDesignerProps) => {
  return (
    <>
      {/* <h1 className="py-1">Total Account Summary</h1> */}
      <div className="flex flex-col gap-2">
        <ERPInput
          label="Account Summary label"
          id="accountSummaryLabel"
          value={headerState?.accountSummary?.accountSummaryLabel}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, accountSummaryLabel: e.target.value } })}
        />
      </div>
      {/* */}

      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Opening Balance"
          checked={headerState?.accountSummary?.showOpeningBalance}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showOpeningBalance: e.target.checked } })}
        />
        {headerState?.accountSummary?.showOpeningBalance && (
          <ERPInput
            noLabel
            id="openBalance"
            value={headerState?.accountSummary?.openingBalanceLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, openingBalanceLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}

      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Invoiced Amount"
          checked={headerState?.accountSummary?.showInvoicedAmount}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showInvoicedAmount: e.target.checked } })}
        />
        {headerState?.accountSummary?.showInvoicedAmount && (
          <ERPInput
            noLabel
            id="invoicedAmount"
            value={headerState?.accountSummary?.invoicedAmountLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, invoicedAmountLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}

      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Amount Paid"
          checked={headerState?.accountSummary?.showAmountPaid}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showAmountPaid: e.target.checked } })}
        />
        {headerState?.accountSummary?.showAmountPaid && (
          <ERPInput
            noLabel
            id="amtPaidLbl"
            value={headerState?.accountSummary?.amountPaidLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, amountPaidLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}

      {/* */}
      <div className="flex flex-col gap-2">
        <ERPCheckbox
          label="Balance Due"
          checked={headerState?.accountSummary?.showBalanceDue}
          onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, showBalanceDue: e.target.checked } })}
        />
        {headerState?.accountSummary?.showBalanceDue && (
          <ERPInput
            noLabel
            id="balanceDue"
            value={headerState?.accountSummary?.balanceDueLabel}
            onChange={(e) => onChange({ ...headerState, accountSummary: { ...headerState?.accountSummary, balanceDueLabel: e.target.value } })}
          />
        )}
      </div>
      {/* */}
    </>
  );
};
