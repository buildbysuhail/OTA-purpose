import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { accTableState, ItemTableState, TemplateState } from "./interfaces";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";
import VoucherType from "../../../enums/voucher-types";
import { useTranslation } from "react-i18next";

interface ItemTableDesignerProps {
  accTableState?: accTableState;
  onChange?: (state: accTableState) => void;
  template?: TemplateState;
}

const LabelsEditor = ({ accTableState, onChange }: ItemTableDesignerProps) => {
  const { t } = useTranslation('system');

  return (
    <>
      <ERPCheckbox
        id="showLineItemNumber"
        label={t("sino")}
        checked={accTableState
          ?.showLineItemNumber}
        onChange={(e) => onChange?.({
          ...accTableState
          , showLineItemNumber: e.target.checked
        })}
      />

      {accTableState
        ?.showLineItemNumber && (
          <div className=" flex gap-2">
            <ERPInput
              id="SiNoWidth"
              label={t("width")}
              className="w-20"
              value={accTableState
                ?.lineItemNumberWidth}
              onChange={(e) => onChange?.({
                ...accTableState
                , lineItemNumberWidth: e.target?.value
              })}
            />
            <ERPInput
              id="SiNoLabel"
              label={t("sino_number")}
              value={accTableState
                ?.lineItemNumberLabel}
              onChange={(e) => onChange?.({
                ...accTableState
                , lineItemNumberLabel: e.target?.value
              })}
            />
          </div>
        )}

 

      <ERPCheckbox
        id="showLedgerCode"
        label={t("ledger_code")}
        checked={accTableState?.showLedgerCode}
        onChange={(e) => onChange?.({ ...accTableState, showLedgerCode: e.target.checked })}
      />

      {accTableState?.showLedgerCode && (
        <div className=" flex gap-2">
          <ERPInput
            id="ledgerCodeWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.ledgerCodeWidth}
            onChange={(e) => onChange?.({ ...accTableState, ledgerCodeWidth: e.target?.value })}
          />
          <ERPInput
            id="ledgerCodeLabel"
            label={t("ledger_code")}
            placeholder={t("ledger_code")}
            value={accTableState?.ledgerCodeLabel}
            onChange={(e) => onChange?.({ ...accTableState, ledgerCodeLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showLedger"
        label={t("ledger")}
        checked={accTableState?.showLedger}
        onChange={(e) => onChange?.({ ...accTableState, showLedger: e.target.checked })}
      />

      {accTableState?.showLedger && (
        <div className=" flex gap-2">
          <ERPInput
            id="ledgerWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.ledgerWidth}
            onChange={(e) => onChange?.({ ...accTableState, ledgerWidth: e.target?.value })}
          />
          <ERPInput
            id="ledgerLabel"
            label={t("ledger")}
            placeholder={t("ledger")}
            value={accTableState?.ledgerLabel}
            onChange={(e) => onChange?.({ ...accTableState, ledgerLabel: e.target?.value })}
          />
        </div>
      )}
      <ERPCheckbox
        id="showAmount"
        label={t("amount")}
        checked={accTableState?.showAmount}
        onChange={(e) => onChange?.({ ...accTableState, showAmount: e.target.checked })}
      />

      {accTableState?.showAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="amountWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.amountWidth}
            onChange={(e) => onChange?.({ ...accTableState, amountWidth: e.target?.value })}
          />
          <ERPInput
            id="amountLabel"
            label={t("amount")}
            placeholder={t("amount")}
            value={accTableState?.amountLabel}
            onChange={(e) => onChange?.({ ...accTableState, amountLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showNarration"
        label={t("narration")}
        checked={accTableState?.showNarration}
        onChange={(e) => onChange?.({ ...accTableState, showNarration: e.target.checked })}
      />

      {accTableState?.showNarration && (
        <div className=" flex gap-2">
          <ERPInput
            id="narrationWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.narrationWidth}
            onChange={(e) => onChange?.({ ...accTableState, narrationWidth: e.target?.value })}
          />
          <ERPInput
            id="narrationLabel"
            label={t("narration")}
            placeholder={t("narration")}
            value={accTableState?.narrationLabel}
            onChange={(e) => onChange?.({ ...accTableState, narrationLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showBillwiseDetails"
        label={t("bill_wise_details")}
        checked={accTableState?.showBillwiseDetails}
        onChange={(e) => onChange?.({ ...accTableState, showBillwiseDetails: e.target.checked })}
      />

      {accTableState?.showBillwiseDetails && (
     
          <div className=" flex gap-2">
            <ERPInput
              id="billwiseDetailsWidth"
              label={t("width")}
              className="w-20"
              value={accTableState?.billwiseDetailsWidth}
              onChange={(e) => onChange?.({ ...accTableState, billwiseDetailsWidth: e.target?.value })}
            />
            <ERPInput
              id="billwiseDetailsLabel"
              label={t("bill_wise_details")}
              placeholder={t("bill_wise_details")}
              value={accTableState?.billwiseDetailsLabel}
              onChange={(e) => onChange?.({ ...accTableState, billwiseDetailsLabel: e.target?.value })}
            />
          </div>
     
      )}

        <ERPCheckbox
        id="showDiscount"
        label={t("discount")}
        checked={accTableState?.showDiscount}
        onChange={(e) => onChange?.({ ...accTableState, showDiscount: e.target.checked })}
      />

      {accTableState?.showDiscount && (
        <div className=" flex gap-2">
          <ERPInput
            id="discountWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.discountWidth}
            onChange={(e) => onChange?.({ ...accTableState, discountWidth: e.target?.value })}
          />
          <ERPInput
            id="discountLabel"
            label={t("discount")}
            placeholder={t("discount")}
            value={accTableState?.discountLabel}
            onChange={(e) => onChange?.({ ...accTableState, discountLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showCostCenter"
        label={t("cost_center")}
        checked={accTableState?.showCostCenter}
        onChange={(e) => onChange?.({ ...accTableState, showCostCenter: e.target.checked })}
      />

      {accTableState?.showCostCenter && (
        <div className=" flex gap-2">
          <ERPInput
            id="costCenterWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.costCenterWidth}
            onChange={(e) => onChange?.({ ...accTableState, costCenterWidth: e.target?.value })}
          />
          <ERPInput
            id="costCenterLabel"
            label={t("cost_center")}
            placeholder={t("cost_center")}
            value={accTableState?.costCenterLabel}
            onChange={(e) => onChange?.({ ...accTableState, costCenterLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showAmountFc"
        label={t("amount_fc")}
        checked={accTableState?.showAmountFc}
        onChange={(e) => onChange?.({ ...accTableState, showAmountFc: e.target.checked })}
      />

      {accTableState?.showAmountFc && (
        <div className=" flex gap-2">
          <ERPInput
            id="amountFcWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.amountFcWidth}
            onChange={(e) => onChange?.({ ...accTableState, amountFcWidth: e.target?.value })}
          />
          <ERPInput
            id="amountFcLabel"
            label={t("amount_fc")}
            placeholder={t("amount_fc")}
            value={accTableState?.amountFcLabel}
            onChange={(e) => onChange?.({ ...accTableState, amountFcLabel: e.target?.value })}
          />
        </div>
      )}

      <ERPCheckbox
        id="showBankCharge"
        label={t("bank_charge")}
        checked={accTableState?.showBankCharge}
        onChange={(e) => onChange?.({ ...accTableState, showBankCharge: e.target.checked })}
      />

      {accTableState?.showBankCharge && (
        <div className=" flex gap-2">
          <ERPInput
            id="bankChargeWidth"
            label={t("width")}
            className="w-20"
            value={accTableState?.bankChargeWidth}
            onChange={(e) => onChange?.({ ...accTableState, bankChargeWidth: e.target?.value })}
          />
          <ERPInput
            id="bankChargeLabel"
            label={t("bank_charge")}
            placeholder={t("bank_charge")}
            value={accTableState?.bankChargeLabel}
            onChange={(e) => onChange?.({ ...accTableState, bankChargeLabel: e.target?.value })}
          />
        </div>
      )}
    </>
  );
};

const LayoutEditor = ({ accTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');

  return (
    <div className="flex flex-col gap-4">
      <ERPCheckbox
        id="showTableBorder"
        label={t("table_border")}
        onChange={(e) => onChange?.({ ...accTableState, showTableBorder: e.target.checked })}
        checked={accTableState?.showTableBorder}
      />

      {accTableState?.showTableBorder && (
        <ERPInput
          id="tableBorderColor"
          label={t("border_color")}
          type="color"
          value={accTableState?.tableBorderColor}
          onChange={(e) => onChange?.({ ...accTableState, tableBorderColor: e.target?.value })}
        />
      )}

      <h3>{t("table_header")}</h3>
      <ERPCheckbox
        id="headerRepeatOnPage"
        label={t("header_repeat_on_each_page")}
        onChange={(e) => onChange?.({ ...accTableState, headerRepeatOnPage: e.target.checked })}
        checked={accTableState?.headerRepeatOnPage}
      />
      <ERPStepInput
        value={accTableState?.headerFontSize}
        onChange={(headerFontSize) => onChange?.({ ...accTableState, headerFontSize })}
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
          onChange?.({ ...accTableState, showTableHeaderBg: e.target.checked });
        }}
        checked={accTableState?.showTableHeaderBg}
      />

      {accTableState?.showTableHeaderBg && (
        <ERPInput
          id="tableHeaderBgColor"
          label={t("background_color")}
          type="color"
          value={accTableState?.tableHeaderBgColor}
          onChange={(e) => {
            onChange?.({ ...accTableState, tableHeaderBgColor: e.target?.value });
          }}
        />
      )}

      <ERPInput
        id="headerFontColor"
        label={t("font_color")}
        type="color"
        value={accTableState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...accTableState, headerFontColor: e.target?.value });
        }}
      />

      <h3>{t("item_row")}</h3>

      <ERPStepInput
        value={accTableState?.itemRowFontSize}
        onChange={(itemRowFontSize) => onChange?.({ ...accTableState, itemRowFontSize })}
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
        value={accTableState?.itemRowFontColor}
        onChange={(e) => {
          onChange?.({ ...accTableState, itemRowFontColor: e.target?.value });
        }}
      />

      <ERPCheckbox
        id="showRowBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...accTableState, showRowBg: e.target.checked });
        }}
        checked={accTableState?.showRowBg}
      />

      {accTableState?.showRowBg && (
        <ERPInput
          id="itemRowBgColor"
          label={t("background_color")}
          type="color"
          value={accTableState?.itemRowBgColor}
          onChange={(e) => {
            onChange?.({ ...accTableState, itemRowBgColor: e.target?.value });
          }}
        />
      )}
    </div>
  );
};

const AccTableDesigner = ({ accTableState, onChange }: ItemTableDesignerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation('system')
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
      </div>
      {activeTab === 0 && <LabelsEditor accTableState={accTableState} onChange={onChange} />}
      {activeTab === 1 && <LayoutEditor accTableState={accTableState} onChange={onChange} />}
    </div>
  );
};

export default AccTableDesigner;
