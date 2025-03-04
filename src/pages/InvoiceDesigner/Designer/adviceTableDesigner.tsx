import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adviceTableState, ItemTableState, TemplateState } from "./interfaces";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";
import VoucherType from "../../../enums/voucher-types";
import { useTranslation } from "react-i18next";

interface ItemTableDesignerProps {
  adviceTableState?: adviceTableState;
  onChange?: (state: adviceTableState) => void;
  template?: TemplateState;
}

const LabelsEditor = ({ adviceTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('system');
  const templateGroup = searchParams?.get("template_group")! as VoucherType | string
  return (
    <>
  

      <ERPCheckbox
        id="showLineItemNumber"
        label={t("invoice_number")}
        checked={adviceTableState?.showLineItemNumber}
        onChange={(e) => onChange?.({ ...adviceTableState, showLineItemNumber: e.target.checked })}
      />

      {adviceTableState?.showLineItemNumber && (
        <div className=" flex gap-2">
          <ERPInput
            id="lineItemNumberWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.lineItemNumberWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, lineItemNumberWidth: e.target?.value })}
          />
          <ERPInput
            id="lineItemNumberLabel"
            label={t("invoice_number")}
            placeholder={t("invoice_number")}
            value={adviceTableState?.lineItemNumberLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, lineItemNumberLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showInvoiceDate"
        label={t("invoice_date")}
        checked={adviceTableState?.showInvoiceDate}
        onChange={(e) => onChange?.({ ...adviceTableState, showInvoiceDate: e.target.checked })}
      />

      {adviceTableState?.showInvoiceDate && (
        <div className=" flex gap-2">
          <ERPInput
            id="InvoiceDateWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.InvoiceDateWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, InvoiceDateWidth: e.target?.value })}
          />
          <ERPInput
            id="InvoiceDateLabel"
            label={t("invoice_date")}
            placeholder={t("invoice_date")}
            value={adviceTableState?.InvoiceDateLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, InvoiceDateLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showInvoiceAmount"
        label={t("invoice_amount")}
        checked={adviceTableState?.showInvoiceAmount}
        onChange={(e) => onChange?.({ ...adviceTableState, showInvoiceAmount: e.target.checked })}
      />

      {adviceTableState?.showInvoiceAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="InvoiceAmountWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.InvoiceAmountWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, InvoiceAmountWidth: e.target?.value })}
          />
          <ERPInput
            id="InvoiceAmountLabel"
            label={t("invoice_amount")}
            placeholder={t("invoice_amount")}
            value={adviceTableState?.InvoiceAmountLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, InvoiceAmountLabel: e.target?.value })}
          />
        </div>
      )}
      <ERPCheckbox
        id="showWithholdingTax"
        label={t("withholding_tax")}
        checked={adviceTableState?.showWithholdingTax}
        onChange={(e) => onChange?.({ ...adviceTableState, showWithholdingTax: e.target.checked })}
      />

      {adviceTableState?.showWithholdingTax && (
        <div className=" flex gap-2">
          <ERPInput
            id="WithholdingTaxWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.WithholdingTaxWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, WithholdingTaxWidth: e.target?.value })}
          />
          <ERPInput
            id="WithholdingTaxLabel"
            label={t("withholding_tax")}
            placeholder={t("withholding_tax")}
            value={adviceTableState?.WithholdingTaxLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, WithholdingTaxLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showPaymentAmount"
        label={t("payment_amount")}
        checked={adviceTableState?.showPaymentAmount}
        onChange={(e) => onChange?.({ ...adviceTableState, showPaymentAmount: e.target.checked })}
      />

      {adviceTableState?.showPaymentAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="PaymentAmountWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.PaymentAmountWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, PaymentAmountWidth: e.target?.value })}
          />
          <ERPInput
            id="PaymentAmountLabel"
            label={t("payment_amount")}
            placeholder={t("payment_amount")}
            value={adviceTableState?.PaymentAmountLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, PaymentAmountLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showTCSAmount"
        label={t("tcs_amount")}
        checked={adviceTableState?.showTCSAmount}
        onChange={(e) => onChange?.({ ...adviceTableState, showTCSAmount: e.target.checked })}
      />

      {adviceTableState?.showTCSAmount && (
        <>
          <div className=" flex gap-2">
            <ERPInput
              id="TCSAmountWidth"
              label={t("width")}
              className="w-20"
              value={adviceTableState?.TCSAmountWidth}
              onChange={(e) => onChange?.({ ...adviceTableState, TCSAmountWidth: e.target?.value })}
            />
            <ERPInput
              id="TCSAmountLabel"
              label={t("tcs_amount")}
              placeholder={t("tcs_amount")}
              value={adviceTableState?.TCSAmountLabel}
              onChange={(e) => onChange?.({ ...adviceTableState, TCSAmountLabel: e.target?.value })}
            />
          </div>
          <ERPCheckbox
            id="showTCSSection"
            label={t("tcs_section")}
            checked={adviceTableState?.showTCSSection}
            onChange={(e) => onChange?.({ ...adviceTableState, showTCSSection: e.target.checked })}
          />
        </>
      )}
    </>
  );
};

const LayoutEditor = ({ adviceTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');

  return (
    <div className="flex flex-col gap-4">
      <ERPCheckbox
        id="showTableBorder"
        label={t("table_border")}
        onChange={(e) => onChange?.({ ...adviceTableState, showTableBorder: e.target.checked })}
        checked={adviceTableState?.showTableBorder}
      />

      {adviceTableState?.showTableBorder && (
        <ERPInput
          id="tableBorderColor"
          label={t("border_color")}
          type="color"
          value={adviceTableState?.tableBorderColor}
          onChange={(e) => onChange?.({ ...adviceTableState, tableBorderColor: e.target?.value })}
        />
      )}

      <h3>{t("table_header")}</h3>
      <ERPCheckbox
        id="headerRepeatOnPage"
        label={t("header_repeat_on_each_page")}
        onChange={(e) => onChange?.({ ...adviceTableState, headerRepeatOnPage: e.target.checked })}
        checked={adviceTableState?.headerRepeatOnPage}
      />
      <ERPStepInput
        value={adviceTableState?.headerFontSize}
        onChange={(headerFontSize) => onChange?.({ ...adviceTableState, headerFontSize })}
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
          onChange?.({ ...adviceTableState, showTableHeaderBg: e.target.checked });
        }}
        checked={adviceTableState?.showTableHeaderBg}
      />

      {adviceTableState?.showTableHeaderBg && (
        <ERPInput
          id="tableHeaderBgColor"
          label={t("background_color")}
          type="color"
          value={adviceTableState?.tableHeaderBgColor}
          onChange={(e) => {
            onChange?.({ ...adviceTableState, tableHeaderBgColor: e.target?.value });
          }}
        />
      )}

      <ERPInput
        id="headerFontColor"
        label={t("font_color")}
        type="color"
        value={adviceTableState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...adviceTableState, headerFontColor: e.target?.value });
        }}
      />

      <h3>{t("item_row")}</h3>

      <ERPStepInput
        value={adviceTableState?.itemRowFontSize}
        onChange={(itemRowFontSize) => onChange?.({ ...adviceTableState, itemRowFontSize })}
        label={t("size_(8-28)")}
        id="itemRowFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPInput
        id="itemRowFontColor"
        label={t("font_color")}
        type="color"
        value={adviceTableState?.itemRowFontColor}
        onChange={(e) => {
          onChange?.({ ...adviceTableState, itemRowFontColor: e.target?.value });
        }}
      />

      <ERPCheckbox
        id="showRowBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...adviceTableState, showRowBg: e.target.checked });
        }}
        checked={adviceTableState?.showRowBg}
      />

      {adviceTableState?.showRowBg && (
        <ERPInput
          id="itemRowBgColor"
          label={t("background_color")}
          type="color"
          value={adviceTableState?.itemRowBgColor}
          onChange={(e) => {
            onChange?.({ ...adviceTableState, itemRowBgColor: e.target?.value });
          }}
        />
      )}
    </div>
  );
};

const AdviceTableDesigner = ({ adviceTableState, onChange }: ItemTableDesignerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation('system')
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
      </div>
      {activeTab === 0 && <LabelsEditor adviceTableState={adviceTableState} onChange={onChange} />}
      {activeTab === 1 && <LayoutEditor adviceTableState={adviceTableState} onChange={onChange} />}
    </div>
  );
};

export default AdviceTableDesigner;
