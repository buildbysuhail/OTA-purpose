import React from 'react'
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';

const DeleteInactiveTransactions = () => {


interface BasicInfo {
  data: {
    date: string;
  };
  validations: {
    date: string | null;
  };
}


  const [basicInfo, setBasicInfo] = React.useState<BasicInfo>({
    data: {
      date: "",
    },
    validations: {
      date: null,
    },
  });

  const handleChange = (id: string, value: any) => {
    setBasicInfo((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [id]: value,
      },
    }));
  };

  const handleDelete = () => {
    console.log("Deleting inactive transactions...");
    // Implement your delete logic here
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Delete Inactive Transactions
      </h2>

      {/* Till Date Input */}
      <div className="mb-4">
        
        <ERPDateInput
          id="date"
          field={{ type: "date", id: "date", required: true }}
          label="Till Date"
          data={basicInfo.data}
          handleChange={handleChange}
          validation={basicInfo.validations.date}
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-center mb-4">
        <input
          id="agreement"
          type="checkbox"
          className="mr-2"
          required
        />
        <label htmlFor="agreement" className="text-gray-700">
          I Agree to remove all inactive transactions till the selected date
        </label>
      </div>

      {/* Delete Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50"
          disabled={!basicInfo.data.date} // Disable if no date is selected
        >
          Delete All
        </button>
      </div>
    </div>
  </div>

  )
}

export default DeleteInactiveTransactions
