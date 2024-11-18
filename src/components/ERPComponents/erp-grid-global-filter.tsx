import React, { FC, useCallback, useEffect, useState } from "react";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { t } from "i18next";
import { getFieldPropsGlobal, handleFieldChangeGlobal } from "../../utilities/form-utils";
import { FormField } from "../../utilities/form-types";
import { useTranslation } from "react-i18next";

interface ErpGridGlobalFilterProps {
  gridId: string;
  width: string;
  initialData: any;
  content: React.ReactNode; // Pass pre-defined JSX for content
  onApplyFilters?: (filters: any) => void;
  toogleFilter?: boolean;
  onClose?: () => void;
}

const ErpGridGlobalFilter: FC<ErpGridGlobalFilterProps> = ({
  gridId,
  width="w-full max-w-[1000px]",
  content,
  initialData,
  onApplyFilters,
  toogleFilter = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>(initialData);
  const {t} = useTranslation();

  // Fetch props for fields dynamically
  const getFieldProps = useCallback(
    (fieldId: string): FormField => {
      debugger;
      console.log('getFieldProps called');
      
      return getFieldPropsGlobal(fieldId, formState);
    },
    [formState]
  );

  // Handle field value changes
  const handleFieldChange = useCallback(
    (fields: { [fieldId: string]: any } | string, value?: any) => {
      
      debugger;
      // Convert single field updates to multi-field format
      const updatedData = handleFieldChangeGlobal({fields: fields, value: value, formState: formState})
      setFormState(updatedData);
    },
    [formState]
  );

  // Apply filters callback
  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(formState??{});
    setIsOpen(false);
  };
  useEffect(() => {
    if(toogleFilter == true)
    {
      setIsOpen(true)
    }
  },[toogleFilter])
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="ti-btn rounded-[2px]">
        <i className="ri-filter-line"></i>
      </button>
      <ERPModal
        isForm
        isFullHeight
        isOpen={isOpen}
        hasSubmit={false}
        width={width}
        closeTitle={t("close")}
        title={t("filters")}
        closeModal={() => setIsOpen(false)}
        content={
          // Pass down required handlers to the content
          React.cloneElement(content as React.ReactElement, {
            getFieldProps,
            handleFieldChange,
            t
          })
        }
        footer={
          <div className="flex gap-10 justify-between py-3 border-t mt-5">
            <ERPSubmitButton variant="primary" onClick={handleApply}>
              {t("apply")}
            </ERPSubmitButton>
            <ERPSubmitButton
              type="button"
              onClick={onClose}
              className="w-28 bg-[#e5e7eb] text-[#404040]"
            >
              {t("cancel")}
            </ERPSubmitButton>
          </div>
        }
      />
    </>
  );
};

export default React.memo(ErpGridGlobalFilter);