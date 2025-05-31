import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adviceTableState, ItemTableState, TemplateState } from "../../interfaces";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../../../components/ERPComponents/erp-tab";
import VoucherType from "../../../../../enums/voucher-types";
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
        id="showDate"
        label={t("date")}
        checked={adviceTableState?.showDate}
        onChange={(e) => onChange?.({ ...adviceTableState, showDate: e.target.checked })}
      />

      {adviceTableState?.showDate && (
        <div className=" flex gap-2">
          <ERPInput
            id="DateWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.DateWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, DateWidth: e.target?.value })}
          />
          <ERPInput
            id="DateLabel"
            label={t("date")}
            placeholder={t("date")}
            value={adviceTableState?.DateLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, DateLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showAmount"
        label={t("amount")}
        checked={adviceTableState?.showAmount}
        onChange={(e) => onChange?.({ ...adviceTableState, showAmount: e.target.checked })}
      />

      {adviceTableState?.showAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="AmountWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.AmountWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, AmountWidth: e.target?.value })}
          />
          <ERPInput
            id="AmountLabel"
            label={t("amount")}
            placeholder={t("amount")}
            value={adviceTableState?.AmountLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, AmountLabel: e.target?.value })}
          />
        </div>
      )}
      <ERPCheckbox
        id="showDueAmount"
        label={t("due_Amount")}
        checked={adviceTableState?.showDueAmount}
        onChange={(e) => onChange?.({ ...adviceTableState, showDueAmount: e.target.checked })}
      />

      {adviceTableState?.showDueAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="DueAmountWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.DueAmountWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, DueAmountWidth: e.target?.value })}
          />
          <ERPInput
            id="DueAmountLabel"
            label={t("due_amount_label")}
            placeholder={t("due_amount_label")}
            value={adviceTableState?.DueAmountLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, DueAmountLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showBalance"
        label={t("balance")}
        checked={adviceTableState?.showBalance}
        onChange={(e) => onChange?.({ ...adviceTableState, showBalance: e.target.checked })}
      />

      {adviceTableState?.showBalance && (
        <div className=" flex gap-2">
          <ERPInput
            id="BalanceWidth"
            label={t("width")}
            className="w-20"
            value={adviceTableState?.BalanceWidth}
            onChange={(e) => onChange?.({ ...adviceTableState, BalanceWidth: e.target?.value })}
          />
          <ERPInput
            id="BalanceLabel"
            label={t("balance_label")}
            placeholder={t("balance_label")}
            value={adviceTableState?.BalanceLabel}
            onChange={(e) => onChange?.({ ...adviceTableState, BalanceLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showPayment"
        label={t("payment")}
        checked={adviceTableState?.showPayment}
        onChange={(e) => onChange?.({ ...adviceTableState, showPayment: e.target.checked })}
      />

      {adviceTableState?.showPayment && (
      
          <div className=" flex gap-2">
            <ERPInput
              id="PaymentWidth"
              label={t("width")}
              className="w-20"
              value={adviceTableState?.PaymentWidth}
              onChange={(e) => onChange?.({ ...adviceTableState, PaymentWidth: e.target?.value })}
            />
            <ERPInput
              id="PaymentLabel"
              label={t("payment_label")}
              placeholder={t("payment_label")}
              value={adviceTableState?.PaymentLabel}
              onChange={(e) => onChange?.({ ...adviceTableState, PaymentLabel: e.target?.value })}
            />
          </div>
        
  
      )}

     <ERPCheckbox
        id="showPaidStatement"
        label={t("statement")}
        checked={adviceTableState?.showPaidStatement}
        onChange={(e) => onChange?.({ ...adviceTableState, showPaidStatement: e.target.checked })}
      />

      {adviceTableState?.showPaidStatement && (
      
          <div className=" flex gap-2">
            <ERPInput
              id="PaidStatementWidth"
              label={t("width")}
              className="w-20"
              value={adviceTableState?.PaidStatementWidth}
              onChange={(e) => onChange?.({ ...adviceTableState, PaidStatementWidth: e.target?.value })}
            />
            <ERPInput
              id="PaidStatementLabel"
              label={t("paid_statement_label")}
              placeholder={t("paid_statement_label")}
              value={adviceTableState?.PaidStatementLabel}
              onChange={(e) => onChange?.({ ...adviceTableState, PaidStatementLabel: e.target?.value })}
            />
          </div>
        
  
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
