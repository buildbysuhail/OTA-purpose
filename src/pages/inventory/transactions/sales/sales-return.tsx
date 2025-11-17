import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";

const SalesReturn: React.FC = () => {
  const [formType, setFormType] = useState<string>("");
  const [vPrefix, setVPrefix] = useState<string>("");
  const [vNumber, setVNumber] = useState<number>(0);

  const formTypeOptions = [
    { value: "credit_note", label: "Credit Note" },
    { value: "debit_note", label: "Debit Note" },
    { value: "return", label: "Return" },
  ];

  const vPrefixOptions = [
    { value: "SR", label: "SR" },
    { value: "CN", label: "CN" },
    { value: "DN", label: "DN" },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          Sales Return Amount
        </h1>
        <form className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Form Type</label>
            <ERPDataCombobox
              id="form_type"
              options={formTypeOptions}
              value={formType}
              onChange={(value: any) => setFormType(value.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">V Prefix</label>
            <ERPDataCombobox
              id="v_prefix"
              options={vPrefixOptions}
              value={vPrefix}
              onChange={(value: any) => setVPrefix(value.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">V Number</label>
            <ERPInput
              id="v_number"
              type="number"
              value={vNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVNumber(parseInt(e.target.value) || 0)
              }
              placeholder="Enter Number"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <ERPButton
              title="CLOSE"
              variant="secondary"
              onClick={() => console.log("Close clicked")}
            />
            <ERPButton
              title="LOAD"
              variant="primary"
              onClick={() => console.log("Load clicked")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesReturn;
