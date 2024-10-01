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
    <div className="top-0 left-0 z-50 fixed flex flex-col bg-gray-100 w-screen h-screen max-h-full font-sans overflow-scroll">
      {/* Sale Header */}
      <div className="flex items-center bg-white shadow-sm p-4 border-b-2">
        {/* <ArrowLeft className="mr-4 text-zinc-800" size={24} />*/}
        <i className="ri-arrow-left-linemr-4 text-zinc"></i>
        {/* <i className="ri-arrow-left-line"></i> */}
        <i className="ri-arrow-left-line mr-2" style={{ fontSize: '23px' }}></i>
        <h1 className="flex-grow font-semibold text-xl text-zinc-800">Sale</h1>
        <div className="flex bg-gray-200 mr-4 p-0.5 rounded-full">
          <button
            className={`px-4 py-2 text-sm transition-colors duration-200 ${
              activeButton === "credit"
                ? " bg-green text-white rounded-full"
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
        <i className="ri-settings-3-line" style={{ fontSize: '23px' }}></i>
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
          <div className="bg-blue-400 mb-1 p-1 rounded-lg text-white">
            <h2 className="font-light text-sm">Billed Items</h2>
          </div>
          <div className="pt-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#f3f3f3] shadow-md mb-3 p-2 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">#{item.id}</span>
                  <span className="font-bold text-sm">
                    ₹ {item.price * item.quantity}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-x">{item.name}</h3>
                <p className="mb-2 text-gray text-sm">
                  Item Subtotal: {item.quantity} x ₹{item.price} = ₹
                  {item.price * item.quantity}
                </p>
                <p className="mb-1 text-yellow info">
                  Discount (%): {item.discount}
                </p>
                <p className="text-gray-600 text-sm">Tax: {item.tax}%</p>
              </div>
            ))}

            {/* Total Summary */}
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
              <div className="flex justify-between mb-2 text-gray-600 text-sm">
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
              <div className="flex justify-between font-semibold text-sm">
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
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
            
            {/* <button className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white">
              Save
            </button> */}
            <ERPButton
                      title="Save"
                      onClick={() => {
                        // deleteWorkspacePopup();
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
          </div>
          {/* ======= */}
          <div>
            {/* The ERPModal component */}
            <ERPModal
              isForm={true}
              isOpen={isOpen}
              hasSubmit={false}
              closeTitle="Close"
              title="Add Items"
              width = "w-full"
              isFullHeight={true}
              closeModal={() => setIsOpen(false)}
              content={
                <div
                  className="flex flex-col gap-0 px-0 py-0"
                  style={{  }} // Inline styles for full screen
                >
                  {/* Add your column customization content here */}
                  {/* <div>
                    <h1 className="text-gray-600">test</h1>
                  </div> */}

                  {/* Close button */}
                  {/* <button
                    onClick={() => setIsOpen(false)}
                    className="bg-red-500 mt-auto p-2 rounded text-white"
                  >
                    Close
                  </button> */}

                  <div className="mx-auto max-w-md">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-gray-600">
                        {/* <ArrowLeft size={24} onClick={() => setIsOpen(false)} /> */}
                      </div>
                     
                      <div className="text-gray-600">
                        {/* <Settings size={24} /> */}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="itemName"
                          className="block font-medium text-gray-700 text-sm"
                        >
                          Item Name
                        </label>
                        <input
                          type="text"
                          id="itemName"
                          name="itemName"
                          value={formData.itemName}
                          onChange={handleInputChange}
                          placeholder="e.g. Chocolate Cake"
                          className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                        />
                      </div>

                      <div className="gap-4 grid grid-cols-2 mb-4">
                        <div>
                          <label
                            htmlFor="quantity"
                            className="block font-medium text-gray-700 text-sm"
                          >
                            Quantity
                          </label>
                          <input
                            type="text"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="unit"
                            className="block font-medium text-gray-700 text-sm"
                          >
                            Unit
                          </label>
                          <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                          >
                            <option value="">Select Unit</option>
                            <option value="piece">Piece</option>
                            <option value="kg">Kg</option>
                            <option value="liter">Liter</option>
                          </select>
                        </div>
                      </div>

                      <div className="gap-4 grid grid-cols-2 mb-6">
                        <div>
                          <label
                            htmlFor="rate"
                            className="block font-medium text-gray-700 text-sm"
                          >
                            Rate (Price/Unit)
                          </label>
                          <input
                            type="text"
                            id="rate"
                            name="rate"
                            value={formData.rate}
                            onChange={handleInputChange}
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="taxOption"
                            className="block font-medium text-gray-700 text-sm"
                          >
                            Tax Option
                          </label>
                          <select
                            id="taxOption"
                            name="taxOption"
                            value={formData.taxOption}
                            onChange={handleInputChange}
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                          >
                            <option value="Without Tax">Without Tax</option>
                            <option value="With Tax">With Tax</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        {/* <button
                          type="submit"
                          className="flex-1 bg-gray-200 hover:bg-gray-300 focus:ring-opacity-50 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-500 text-gray-800 focus:outline-none"
                        >
                          Save &amp; New
                        </button> */}
                        <ERPButton
                      title="Save"
                      onClick={() => {
                        // deleteWorkspacePopup();
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
                        {/* <button
                          type="submit"
                          className="flex-1 bg-red-500 hover:bg-red-600 focus:ring-opacity-50 px-4 py-2 rounded-md focus:ring-2 focus:ring-red-500 text-white focus:outline-none"
                        >
                          Save
                        </button> */}
                        <ERPButton
                      title="Save"
                      onClick={() => {
                        // deleteWorkspacePopup();
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
                      </div>
                    </form>
                  </div>

                  {/* Close button */}
                  {/* <button
                    onClick={() => setIsOpen(false)}
                    className="bg-red-500 mt-auto p-2 rounded text-white"
                  >
                    Close
                  </button> */}
                </div>
              }
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvTransaction;
