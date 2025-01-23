import React, { FC, useCallback, useEffect, useState } from "react";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { t } from "i18next";
import {
  getFieldPropsGlobal,
  handleFieldChangeGlobal,
} from "../../utilities/form-utils";
import { FormField } from "../../utilities/form-types";
import { useTranslation } from "react-i18next";

interface ErpGridGlobalFilterProps {
  gridId: string;
  width?: string;
  initialData: any;
  validations: any;
  title: string
  content: React.ReactNode; // Pass pre-defined JSX for content
  onApplyFilters?: (filters: any) => void;
  toogleFilter?: boolean;
  onClose?: () => void;
  onOpened?: ( status : boolean) => void;
}

const ErpGridGlobalFilter: FC<ErpGridGlobalFilterProps> = ({
  gridId,
  width = "w-full max-w-[1000px] min-w-[300px]",
  content,
  initialData,
  validations,
  onApplyFilters,
  title,
  toogleFilter = false,
  onClose,
  onOpened
}) => {
  
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({
    data: initialData,
    validations: validations,
  });
  const { t } = useTranslation("main");
  const [_show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Fetch props for fields dynamically
  const getFieldProps = useCallback(
    (fieldId: string): FormField => {
      console.log("getFieldProps called");
      return getFieldPropsGlobal(fieldId, formState);
    },
    [formState]
  );
  const getFormState = useCallback(() => {
      console.log("getFieldProps called");
      return  formState;
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
    (fields: { [fieldId: string]: any } | string, value?: any) => {
      
      // Normalize fields into an object for single or multiple field updates
      const fieldsToUpdate =
        typeof fields === "string" ? { [fields]: value } : fields;

      // Merge the updates into the current form state
      const updatedData = {
        ...formState,
        data: {
          ...formState.data,
          ...fieldsToUpdate,
        }
      };

      // Update the state and trigger global change handler if needed
      setFormState(updatedData);
      // handleFieldChangeGlobal({ fields: fieldsToUpdate, formState });
    },
    [formState]
  );
  // Apply filters callback
  const handleApply = () => {
    
    // setIsOpen(false);
    if (onApplyFilters) onApplyFilters(formState.data ?? {});
  };
  useEffect(() => {
    
    if (toogleFilter == true) {
      setIsOpen(true);
    }
    else {
      setIsOpen(false);
    }
  }, [toogleFilter]);
  useEffect(() => {
    
    if(isOpen) {
      onOpened && onOpened(true);
    }
  }, [isOpen]);
  useEffect(() => {
    setFormState((prev: any) => ({
      ...prev,
      validations: validations
    }))
  }, [validations]);
  console.log("ErpGridGlobalFilter");

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="ti-btn rounded-[2px] dark:bg-dark-bg-header dark:text-dark-text ">
        <i className="ri-filter-line"></i>
      </button>
      <ERPModal
        isForm
        isFullHeight
        isOpen={isOpen}
        hasSubmit={false}
        width={width}
        closeTitle={t("close")}
        title={title}
        closeModal={() => setIsOpen(false)}
        content={
          // Pass down required handlers to the content
          React.cloneElement(content as React.ReactElement, {
            getFieldProps,
            handleFieldChange,
            t,
            formState,
            getFormState
          })
        }
        footer={
          <div className=" flex justify-end space-x-2 gap-4 py-5 dark:!border-dark-border border-t ">
           
            <ERPSubmitButton
              type="button"
              // onClick={onClose}
              onClick={() => setIsOpen(false)}
              className="bg-[#e5e7eb] dark:text-dark-hover-black text-[black] max-w-[115px]"
            >
              {t("cancel")}
            </ERPSubmitButton>
             <ERPSubmitButton variant="primary" onClick={handleApply}
            className="max-w-[115px]">
              {t("apply")}
            </ERPSubmitButton>
          </div>
        }
      />
    </>
  );
};

export default React.memo(ErpGridGlobalFilter);
