import React, { useState, memo } from "react";
import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import ERPButton from "../../../../components/ERPComponents/erp-button";

interface DocumentPropertiesProps {
  closeModal: () => void;
  t: any;
}

export const LoadMulti: React.FC<DocumentPropertiesProps> = memo(({ closeModal, t }) => {
  const [voucherType, setVoucherType] = useState<string | null>(null);
  const [formType, setFormType] = useState<string | null>(null);
  const [vPrefix, setVPrefix] = useState<string | null>(null);
  const [vNumber, setVNumber] = useState<string | null>(null);

  const voucherOptions = [
    { id: "PO", name: "Purchase Order" },
    { id: "GRN", name: "Goods Note" },
    { id: "PQ", name: "Purchase Quotation" },
    { id: "PI", name: "Purchase Invoice" }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      <ERPDataCombobox
        field={{
          id: "voucherType",
          valueKey: "id",
          labelKey: "name",
        }}
        options={voucherOptions}
        label={t('voucher_type')}
        id="voucherType"
        data={{ voucherType }}
        value={voucherType}
        onChange={(e) => {
          setVoucherType(e?.value ?? null);
        }}
      />
      <ERPDataCombobox
        field={{
          id: "formType",
          valueKey: "id",
          labelKey: "name",
        }}
        label={t('form_type')}
        id="formType"
        data={{ formType }}
        value={formType}
        onChange={(e) => {
          setFormType(e?.value ?? null);
        }}
      />
      <ERPDataCombobox
        field={{
          id: "vPrefix",
          valueKey: "id",
          labelKey: "name",
        }}
        label={t('v_prefix')}
        id="vPrefix"
        data={{ vPrefix }}
        value={vPrefix}
        onChange={(e) => {
          setVPrefix(e?.value ?? null);
        }}
      />
      <ERPInput
        id="vNumber"
        label={t('v_number')}
        value={vNumber || ''}
        onChange={(e) => {
          setVNumber(e.target.value);
        }}
        placeholder={t('v_number')}
      />
    </div>
  );
});

export const LoadMultiFooter: React.FC = React.memo(() => {

  return (
    <div className="flex items-end gap-2 justify-end  border-t dark:!border-dark-border mt-0 p-2">
      <ERPButton
              title="load"
              variant="primary"
            />
            <ERPButton
              title="clear"
              variant="secondary"
            />
            <ERPButton
              title="close"
              variant="secondary"
            />
    </div>
  );
});