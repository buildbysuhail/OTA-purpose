import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AccVoucherElementProps } from "../acc-transaction-types";
import { accFormStateHandleFieldChange, accFormStateRowHandleFieldChange } from "../reducer";
import { Search } from "lucide-react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import PartySelectionModal from "../party-selection-modal";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import React, { useRef } from "react";


interface AccTaxDetailsProps extends AccVoucherElementProps { }

const AccTaxDetails = React.forwardRef<HTMLInputElement, AccTaxDetailsProps>(({
  formState,
  dispatch,
  handleKeyDown,
  t,
}, ref) => {

  const partyNameRef = useRef<HTMLInputElement>(null);
  const taxNoRef = useRef<HTMLInputElement>(null);
  const taxableAmountRef = useRef<HTMLInputElement>(null);

  const focusTaxNoField = () => {
    setTimeout(() => {
      if (taxNoRef.current) {
        taxNoRef.current.select();
        taxNoRef.current.focus();
      }
    }, 0);
  };

  return (
    <>
      {["TXP"].includes(formState.transaction.master.voucherType) && (
        <>
          <div className="flex items-center gap-1">
            <ERPInput
              ref={partyNameRef}
              localInputBox={formState?.userConfig?.inputBoxStyle}
              id="partyName"
              label={t("party_name")}
              value={formState.row.partyName}
              onChange={(e) => dispatch(accFormStateRowHandleFieldChange({ fields: { partyName: e.target?.value }, }))}
              disabled={formState.formElements.pnlMasters?.disabled}
            />

            <button
              data-skip={true}
              onClick={() => { dispatch(accFormStateHandleFieldChange({ fields: { showPartySelection: true }, })); }}
              className="flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-transparent border border-gray-100 p-[8px] mt-[4px] rounded-md hover:bg-gray-200 transition-colors">
              <Search className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors" />
            </button>

            {
              formState.showPartySelection && (
                <ERPModal
                  isOpen={formState.showPartySelection}
                  closeModal={() => dispatch(accFormStateHandleFieldChange({ fields: { showPartySelection: false }, }))}
                  width={600}
                  height={700}
                  title="Party Selection"
                  content={<PartySelectionModal focusTaxNoField={focusTaxNoField} />}
                />
              )
            }
          </div>

          <ERPInput
            ref={taxNoRef}
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="taxNo"
            label={t("tax_no")}
            className="max-w-[150px]"
            value={formState.row.taxNo}
            onChange={(e) => dispatch(accFormStateRowHandleFieldChange({ fields: { taxNo: e.target?.value }, }))}
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="taxInvoiceNo"
            label={t("tax_invoice_no")}
            className="max-w-[150px]"
            value={formState.row.taxInvoiceNo}
            onChange={(e) => dispatch(accFormStateRowHandleFieldChange({ fields: { taxInvoiceNo: e.target?.value }, }))}
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPDateInput
            localInputBox={formState.userConfig?.inputBoxStyle}
            id="invoiceDate"
            label={t("invoice_date")}
            value={new Date(formState.row.invoiceDate)}
            onChange={(e) => dispatch(accFormStateRowHandleFieldChange({ fields: { invoiceDate: e.target?.value }, }))}
            disabled={formState.formElements.pnlMasters?.disabled}
            disableEnterNavigation
            onKeyDown={(e) => { handleKeyDown(e, "invoiceDate"); }}
          />
          <ERPInput
            ref={taxableAmountRef}
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="taxableAmount"
            className="max-w-[150px]"
            type="number"
            label={t("taxable_amount")}
            value={formState.row.taxableAmount}
            onChange={(e) => {
              {
                const sd = e.target?.value != ""
                  ? parseFloat(e.target?.value)
                  : 0
                dispatch(
                  accFormStateRowHandleFieldChange({
                    fields: {
                      taxableAmount:
                        e.target?.value != ""
                          ? parseFloat(e.target?.value)
                          : "",
                      taxAmount:
                        sd *
                        ((formState.row.taxPerc ?? 0) / 100)
                    },
                  })
                )
              }

            }
            }
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="taxPerc"
            type="number"
            label={t("tax%")}
            className="max-w-[65px]"
            value={formState.row.taxPerc}
            onChange={(e) => {
              const taxPerc =
                e.target?.value != ""
                  ? parseFloat(e.target?.value)
                  : 0;
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: {
                    taxPerc:
                      e.target?.value != ""
                        ? parseFloat(e.target?.value)
                        : "",
                    taxAmount:
                      (formState.row.taxableAmount ?? 0) *
                      (taxPerc / 100),
                  },
                })
              );
            }}
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="taxAmount"
            type="number"
            label={t("tax_amount")}
            className="max-w-[100px]"
            value={formState.row.taxAmount}
            onChange={(e) =>
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: {
                    taxAmount:
                      e.target?.value != ""
                        ? parseFloat(e.target?.value)
                        : "",
                  },
                })
              )
            }
            disabled={formState.formElements.pnlMasters?.disabled}
          />
        </>
      )}

    </>
  );
});

export default React.memo(AccTaxDetails);