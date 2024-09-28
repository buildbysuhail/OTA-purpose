import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { Button, TextField } from "@mui/material";
import ERPModal from "../../components/ERPComponents/erp-modal";
import ERPButton from "../../components/ERPComponents/erp-button";

interface BilledItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  tax: number;
}

interface FormData {
  itemName: string;
  quantity: string;
  unit: string; 
  rate: string;
  taxOption: "Without Tax" | "With Tax";
}
const InvTransaction = () => {
  const [activeButton, setActiveButton] = useState("credit");
  const [items, setItems] = useState<BilledItem[]>([
    { id: 1, name: "Apple", price: 100, quantity: 2, discount: 0, tax: 0 },
    { id: 2, name: "Banana", price: 50, quantity: 3, discount: 0, tax: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  // const [invoiceNo, setInvoiceNo] = useState<number>(3); // Default Invoice No.
  // const [date, setDate] = useState<string>("2024-09-23"); // Default Date

  const addItem = () => {
    const newItem: BilledItem = {
      id: items.length + 1,
      name: "New Item",
      price: 0,
      quantity: 1,
      discount: 0,
      tax: 0,
    };
    setItems([...items, newItem]);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    quantity: "",
    unit: "",
    rate: "",
    taxOption: "Without Tax",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to a server or perform other actions
  };

  return (
    <div className="flex fixed top-0 left-0 z-50 flex-col max-h-full overflow-scroll bg-gray-100 w-screen h-screen font-sans">
      {/* Sale Header */}
      <div className="flex items-center bg-white shadow-sm p-4 border-b-2">
        {/* <ArrowLeft className="mr-4 text-zinc-800" size={24} />*/}
        <i className="ri-arrow-left-linemr-4 text-zinc "></i>
        <h1 className="flex-grow font-semibold text-xl text-zinc-800">Sale</h1>
        <div className="flex bg-gray-200 mr-4 p-0.5 rounded-full">
          <button
            className={`px-4 py-2 text-sm transition-colors duration-200 ${
              activeButton === "credit"
                ? " bg-red text-white rounded-full"
                : "bg-transparent text-zinc"
            }`}
            onClick={() => setActiveButton("credit")}
          >
            Credit
          </button>
          <button
            className={`px-4 py-2 text-sm transition-colors duration-200 ${
              activeButton === "cash"
                ? "bg-green text-white rounded-full"
                : "bg-transparent text-zinc"
            }`}
            onClick={() => setActiveButton("cash")}
          >
            Cash
          </button>
        </div>
        {/* <Settings className="text-zinc-800" size={24} /> */}
        <i className="ri-settings-3-line"></i>
      </div>

      {/* Invoice and Date Section */}
      <div className="flex items-center space-x-0 bg-white mb-0 p-0 rounded-lg text-gray-600">
        <div className="flex-1 border-gray-300 p-0 border-none rounded-md">
          <label className="block mb-1 font-medium text-center text-sm">
            Invoice No.
          </label>
          <div className="relative mt-0">
            <input
              type="text"
              defaultValue="3"
              className="bg-transparent px-3 py-0 w-full text-center focus:outline-none"
            />
            {/* <ChevronDown
              className="top-1/2 right-3 absolute text-gray-400 transform -translate-y-1/2"
              size={20}
            /> */}
            <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>

        {/* Centered divider */}
        <div className="border-gray-300 border-l h-6"></div>

        <div className="flex-1 border-gray-300 p-2 border-none rounded-md">
          <label className="block mb-1 font-medium text-center text-sm">
            Date
          </label>
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DatePicker
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true, // Disable underline if needed
                    }}
                    className="border-none"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Removes the border
                        },
                      },
                    }}
                  />
                )}
              /> */}
            </LocalizationProvider>

            {/* <ChevronDown
              className="top-1/2 right-3 absolute text-gray-400 transform -translate-y-1/2"
              size={20}
            /> */}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="bg-white mb-4 p-4 rounded-lg text-zinc-800">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Customer *"
              className="bg-white p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Phone Number"
              className="bg-white p-2 border rounded w-full"
            />
          </div>

          {/* Billed Items Section */}
          <div className="bg-blue-400 text-white p-1 rounded-lg mb-1">
            <h2 className="text-sm font-light">Billed Items</h2>
          </div>
          <div className="pt-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#f3f3f3] rounded-lg shadow-md mb-3 p-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">#{item.id}</span>
                  <span className="font-bold text-sm">
                    ₹ {item.price * item.quantity}
                  </span>
                </div>
                <h3 className="text-x font-bold mb-2">{item.name}</h3>
                <p className="text-sm text-gray  mb-2">
                  Item Subtotal: {item.quantity} x ₹{item.price} = ₹
                  {item.price * item.quantity}
                </p>
                <p className="text-yellow  info mb-1">
                  Discount (%): {item.discount}
                </p>
                <p className="text-sm text-gray-600">Tax: {item.tax}%</p>
              </div>
            ))}

            {/* Total Summary */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Total Disc:{" "}
                  {items
                    .reduce((total, item) => total + item.discount, 0)
                    .toFixed(1)}
                </span>
                <span>
                  Total Tax Amt:{" "}
                  {items
                    .reduce((total, item) => total + item.tax, 0)
                    .toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Qty: {calculateTotalQuantity().toFixed(1)}</span>
                <span>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Add Items Button */}
            <button
              // onClick={addItem}
              onClick={() => setIsOpen(true)}
              className="flex justify-center items-center border-2 border-gray-400 bg-white mb-4 p-2 rounded w-full text-blue-500"
            >
              {/* <Plus className="mr-2 text-blue-500" size={16} /> Add Items{" "} */}
              <i className="ri-add-circle-fill"></i>
              <div className="pl-1 text-gray-500">(Optional)</div>
            </button>
          </div>

          {/* Footer Buttons */}  
          <div className="flex bg-white mt-auto p-2">
          <ERPButton
                      title="Save & New"
                      onClick={() => {
                        // deleteWorkspacePopup();
                      }}
                      variant="primary"
                    ></ERPButton>
            
            <button className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvTransaction;
