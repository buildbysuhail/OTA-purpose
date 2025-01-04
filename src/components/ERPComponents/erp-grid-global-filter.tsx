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
}) => {
  
  debugger;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({
    data: initialData,
    validations: validations,
  });
  const { t } = useTranslation();
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
      debugger;
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
    debugger;
    if (onApplyFilters) onApplyFilters(formState.data ?? {});
    setIsOpen(false);
  };
  useEffect(() => {
    debugger;
    if (toogleFilter == true) {
      setIsOpen(true);
    }
  }, [toogleFilter]);
  useEffect(() => {
    setFormState((prev: any) => ({
      ...prev,
      validations: validations
    }))
  }, [validations]);
  console.log("ErpGridGlobalFilter");

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
        title={title}
        closeModal={() => setIsOpen(false)}
        content={
          <ContentWrapper
            content={content}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
            t={t}
            formState={formState}
          />
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
              className="w-28 bg-[#e5e7eb] text-[black]"
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

const ContentWrapper = ({
  content,
  getFieldProps,
  handleFieldChange,
  t,
  formState,
}: {
  content: React.ReactNode;
  getFieldProps: any;
  handleFieldChange: any;
  t: any;
  formState: any;
}) => {
  return React.cloneElement(content as React.ReactElement, {
    getFieldProps,
    handleFieldChange,
    t,
    formState,
  });
};