import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import SBModel from "./SBModel";
import ERPCloseBt from "../../ERPComponents/ERPCloseBt";
import ERPForm from "../../ERPComponents/erp-form";
import ERPSubmitButton from "../../ERPComponents/erp-submit-button";

interface SBModelFormProps {
  title?: string;
  hintTitle?: string;
  hint?: string;
  children?: React.ReactNode;
  show: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  formFields?: any[];
  data: any;
  onChangeData?: (data: any) => void;
  loading?: boolean;
  submitTitle?: string;
  showChildrenFirst?: boolean;
  overflow?: "overflow-hidden" | "overflow-visible";
  endpointUrl?: string;
}

const SBModelForm = ({
  title,
  hintTitle,
  hint,
  children,
  show,
  formFields,
  data,
  loading,
  onChangeData,
  onClose,
  onSubmit,
  submitTitle = "Submit",
  showChildrenFirst = false,
  overflow = "overflow-visible",
  endpointUrl,
}: SBModelFormProps) => {
  //   let formRef = useRef();

  const onSubmitForm = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    onSubmit && onSubmit();
  };

  return (
    <SBModel isOpen={show} overflow={overflow} endpointUrl={endpointUrl}>
      {/* Header */}
      <div className="flex justify-between px-5 py-3 border-b">
        <a>{title}</a>
        <ERPCloseBt type="reset" onClick={onClose} />
      </div>
      <form onSubmit={onSubmitForm}>
        {/* Body */}
        {showChildrenFirst && children}
        <div className=" w-full flex flex-col gap-2 px-5 py-3 mb-4">
          {formFields?.map((field: any, idx: any) => (
            <ERPForm
              loading={loading}
              fieldClass={field?.fieldClass}
              fields={field?.fieldItems}
              key={`BM_${idx}`}
              data={data}
              onChangeData={onChangeData}
            />
          ))}
        </div>
        {!showChildrenFirst && children}
        {hint && (
          <div className="flex text-xs flex-col bg-gray-50 border gap-2 rounded-md m-4 mb-8 p-4">
            {hintTitle && <a className="text-gray-500 capitalize">{hintTitle}</a>}
            {hint && <a>{hint}</a>}
          </div>
        )}
        {/* Footer */}
        <div className="flex gap-10 justify-between px-5 py-3 border-t">
          <ERPSubmitButton type="reset" onClick={onClose} className=" w-28" varient="outline">
            Cancel
          </ERPSubmitButton>
          <ERPSubmitButton loading={loading} type="submit">
            {submitTitle}
          </ERPSubmitButton>
        </div>
      </form>
    </SBModel>
  );
};

export default SBModelForm;
