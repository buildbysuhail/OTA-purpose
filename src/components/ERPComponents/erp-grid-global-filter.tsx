import React, { FC, useCallback, useEffect, useState } from "react";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { t } from "i18next";
import { getFieldPropsGlobal, handleFieldChangeGlobal } from "../../utilities/form-utils";
import { FormField } from "../../utilities/form-types";
import { useTranslation } from "react-i18next";

interface ErpGridGlobalFilterProps {
  gridId: string;
  width?: string;
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
  const [_show, setShow] = useState(false);
  const handleClose = () => setShow(false);


  // Fetch props for fields dynamically
  const getFieldProps = useCallback(
    (fieldId: string): FormField => {
      
      console.log('getFieldProps called');
      
      return getFieldPropsGlobal(fieldId, formState);
    },
    [formState]
  );

  // Handle field value changes
  // const handleFieldChange = useCallback(
  //   (fields: { [fieldId: string]: any } | string, value?: any) => {
      
      
  //     // Convert single field updates to multi-field format
  //     const updatedData = handleFieldChangeGlobal({fields: fields, value: value, formState: formState})
  //     setFormState(updatedData);
  //   },
  //   [formState]
  // );
  const handleFieldChange = useCallback(
    (
      fields: { [fieldId: string]: any } | string,
      value?: any
    ) => {
      // Normalize fields into an object for single or multiple field updates
      const fieldsToUpdate =
        typeof fields === "string" ? { [fields]: value } : fields;
  
      // Merge the updates into the current form state
      const updatedData = {
        ...formState,
        ...fieldsToUpdate,
      };
  
      // Update the state and trigger global change handler if needed
      setFormState(updatedData);
      handleFieldChangeGlobal({ fields: fieldsToUpdate, formState });
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
  console.log('ErpGridGlobalFilter');
  
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
            t,
            formState
          })
        }
        footer={
          <div className="flex gap-10 justify-between py-3 border-t mt-5">
            <ERPSubmitButton variant="primary" onClick={handleApply}>
              {t("apply")}
            </ERPSubmitButton>
            <ERPSubmitButton
              type="button"
              // onClick={onClose}
              onClick={() => setIsOpen(false)}
              className="w-28 bg-[#e5e7eb] text-[#000000]"
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