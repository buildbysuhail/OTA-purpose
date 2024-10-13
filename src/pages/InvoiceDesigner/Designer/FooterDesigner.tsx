import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction, useRef } from "react";

import { FooterState } from "./interfaces";
import { isFile } from "../../../utilities/Utils";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";

interface FooterDesignerProps {
  onChange: (state: FooterState) => void;
  footerState?: FooterState;
  tempImages: {
    setTemplateImages: Dispatch<SetStateAction<TemplateImagesTypes>>,
    templateImages: TemplateImagesTypes,
  }
}

const FooterDesigner = ({ onChange, footerState, tempImages }: FooterDesignerProps) => {
  const [searchParams] = useSearchParams();
  const inputSignatureFile = useRef<any>(null);
  const templateGroup = searchParams?.get("template_group");
  const { templateImages, setTemplateImages } = tempImages

  const signatureImage = templateImages?.signature_image;
  let signatureThumbnail = signatureImage && isFile(signatureImage) && signatureImage?.size < 1e6 ? URL.createObjectURL(signatureImage) : null

  return (
    <div className="flex h-full overflow-auto flex-col gap-5 p-4">
      {!["customer", "vendor"]?.includes(templateGroup!) && <>
        <h6 className="bg-[#80808012] p-[2px]">Notes</h6>
        <ERPCheckbox
          checked={footerState?.showNotesLabel}
          id="showNotes"
          label="Show Notes"
          onChange={(e) => onChange({ ...footerState, showNotesLabel: e.target.checked })}
        />
      </>}
      {footerState?.showNotesLabel && (
        <>
          <ERPInput
            id="notesLabel"
            label="Notes Label"
            value={footerState?.notesLabel}
            onChange={(e) => onChange({ ...footerState, notesLabel: e.target.value })}
          />

          <ERPStepInput
            min={8}
            max={28}
            step={1}
            placeholder=" "
            defaultValue={9}
            id="noteFontSize"
            label="Font Size (8-28)"
            value={footerState?.noteFontSize}
            onChange={(noteFontSize) => onChange?.({ ...footerState, noteFontSize })}
          />
        </>
      )}
      {/** */}
      {!["sales_order", "delivery_challan",
        "credit_note", "purchase_order",
        "purchase_invoice", "payment_receipts",
        "vendor_credit", "retainer_payment_receipts",
        "customer", "vendor",
        "qty_adjustment", "value_adjustment",
        "sales_return", "payment_made"].includes(templateGroup!) && <>
          <h6 className="bg-[#80808012] p-[2px]">Payment Options</h6>
          <ERPCheckbox
            checked={footerState?.showOnlinePaymentLink}
            id="showOnlinePaymentLink"
            label="Show Online Payment Link"
            onChange={(e) => onChange({ ...footerState, showOnlinePaymentLink: e.target.checked })}
          />
        </>
      }
      {footerState?.showOnlinePaymentLink && (
        <ERPInput
          id="onlinePaymentLink"
          label="Online Payment Link"
          value={footerState?.onlinePaymentLink}
          onChange={(e) => onChange({ ...footerState, onlinePaymentLink: e.target.value })}
        />
      )}

      {!["sales_estimate", "sales_order",
        "delivery_challan", "retainer_invoice",
        "credit_note", "purchase_order",
        "purchase_invoice", "payment_receipts",
        "vendor_credit", "retainer_payment_receipts",
        "customer", "vendor",
        "qty_adjustment", "value_adjustment",
        "sales_return", "payment_made"].includes(templateGroup!) &&
        <>
          <h6 className="bg-[#80808012] p-[2px]">Invoice QR Code</h6>
          <ERPCheckbox
            checked={footerState?.showInvoiceQRCode}
            id="showInvoiceQRCode"
            label="Show Invoice QR Code"
            onChange={(e) => onChange({ ...footerState, showInvoiceQRCode: e.target.checked })}
          />
          <div className="text-[10px] -mt-2">
            To configure the QR code, <br />
            go to Settings {">"} Preferences {">"} Invoices.
          </div>
        </>
      }

      {!["purchase_invoice", "payment_receipts",
        "retainer_payment_receipts",
        "customer", "vendor",
        "qty_adjustment", "value_adjustment",
        "payment_made"].includes(templateGroup!) && <>
          <h6 className="bg-[#80808012] p-[2px]">Terms and Conditions</h6>
          <ERPCheckbox
            checked={footerState?.showTermsAndConditions}
            id="showTermsAndConditions"
            label="Show Terms and Conditions"
            onChange={(e) => onChange({ ...footerState, showTermsAndConditions: e.target.checked })}
          />
          {footerState?.showTermsAndConditions && (
            <>
              <ERPInput
                id="termsLabel"
                label="Label"
                value={footerState?.termsLabel ?? "Terms And Conditions"}
                onChange={(e) => onChange({ ...footerState, termsLabel: e.target.value })}
              />
              <ERPStepInput
                min={8}
                max={28}
                step={1}
                placeholder=" "
                defaultValue={9}
                id="noteFontSize"
                label="Font Size (8-28)"
                value={footerState?.termsFontSize}
                onChange={(termsFontSize) => onChange?.({ ...footerState, termsFontSize })}
              />
            </>
          )}
        </>
      }

      {!["sales_estimate", "sales_order",
        "delivery_challan", "retainer_invoice",
        "credit_note", "purchase_order",
        "purchase_invoice", "vendor_credit",
        "customer", "vendor",
        "qty_adjustment", "value_adjustment", "sales_return"].includes(templateGroup!) && <>

          <h6 className="bg-[#80808012] p-[2px]">Signature</h6>
          <ERPCheckbox
            checked={footerState?.showSignature}
            id="showSignature"
            label="Show Signature"
            onChange={(e) => onChange({ ...footerState, showSignature: e.target.checked })}
          />

          {footerState?.showSignature && (
            <>
              <ERPInput
                id="signatureLabel"
                label="Label"
                value={footerState?.signatureLabel}
                onChange={(e) => onChange({ ...footerState, signatureLabel: e.target.value })}
              />

              <div className="text-xs ">Signature image</div>
              <ERPInput
                type="file"
                ref={inputSignatureFile}
                onChange={(e: any) => {
                  if (e.target.files[0].size > 2097152) {
                    ERPToast.showWith("Maximum file size allowed is 2 MB, please try with different file.", "warning");
                  } else {
                    setTemplateImages((prevData) => ({ ...prevData, signature_image: e.target.files[0] }))
                  }
                }}
                className={"hidden"}
                accept="image/png,image/jpeg"
                label="Image"
                id="background_image "
                placeholder=" "
              />
              <label htmlFor="background_image">
                <div
                  onClick={() => inputSignatureFile?.current?.click()}
                  className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${signatureImage ? "hidden" : ""}`}
                >
                  Choose from Desktop</div>
              </label>

              {
                signatureImage ?
                  <>
                    {signatureThumbnail && <img
                      draggable={false}
                      src={signatureThumbnail}
                      alt="background_image"
                      height={100} width={200}
                      className="h-10"
                    />
                    }
                    <div
                      className="text-accent text-xs cursor-pointer  max-w-min"
                      onClick={() => setTemplateImages((prevData) => ({ ...prevData, signature_image: null }))}
                    >
                      Remove
                    </div>
                  </> : <></>
              }


              <ERPInput
                label="Name"
                id="signatureName"
                value={footerState?.signatureName}
                onChange={(e) => onChange({ ...footerState, signatureName: e.target.value })}
              />
              {/** */}
              {!["payment_receipts", "payment_made"]?.includes(templateGroup!) && <>
                <ERPCheckbox
                  checked={footerState?.showAdditionalSignature}
                  id="showAdditionalSignature"
                  label="Show Additional Signature"
                  onChange={(e) => onChange({ ...footerState, showAdditionalSignature: e.target.checked })}
                />
              </>}
              {footerState?.showAdditionalSignature && (
                <>
                  <ERPInput
                    label="Label"
                    id="additionalSignatureLabel"
                    value={footerState?.additionalSignatureLabel}
                    onChange={(e) => onChange({ ...footerState, additionalSignatureLabel: e.target.value })}
                  />
                  <ERPInput
                    label="Name"
                    id="additionalSignatureName"
                    value={footerState?.additionalSignatureName}
                    onChange={(e) => onChange({ ...footerState, additionalSignatureName: e.target.value })}
                  />
                </>
              )}
            </>
          )}

        </>
      }
    </div>
  );
};

export default FooterDesigner;
