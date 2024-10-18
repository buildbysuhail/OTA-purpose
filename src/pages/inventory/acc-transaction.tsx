import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ERPModal from "../../components/ERPComponents/erp-modal";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import Urls from "../../redux/urls";
import ERPPreviousUrlButton from "../../components/ERPComponents/erp-previous-uirl-button";

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

const AccTransaction = () => {
  const [activeButton, setActiveButton] = useState("credit");
  const [items, setItems] = useState<BilledItem[]>([
    { id: 1, name: "Apple", price: 100, quantity: 2, discount: 0, tax: 0 },
    { id: 2, name: "Banana", price: 50, quantity: 3, discount: 0, tax: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

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

  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef && !popupRef.contains(event.target as Node)) {
        setShowPopup(false);
        setIsHovered(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const [showTotalsPopup, setShowTotalsPopup] = useState(false); // State for showing totals popup

  // const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to a server or perform other actions
  };

  const [isPageVisible, setIsPageVisible] = useState(true);

  const closePage = () => {
    setIsPageVisible(false);
  };

  if (!isPageVisible) {
    return null; // Don't render anything if the page is hidden
  }

  return (
    <div className="top-0 left-0 z-50 fixed flex flex-col bg-gray-100 w-screen h-screen max-h-full font-sans overflow-scroll">
      {/* Sale Header */}
      <div className="flex items-center bg-white shadow-sm p-4 border-b-2">
       <ERPPreviousUrlButton></ERPPreviousUrlButton>
        <h1 className="flex-grow font-semibold text-xl text-zinc-800">Sale</h1>
        <div className="flex bg-gray-200 mr-4 p-0.5 rounded-full">
          <button
            className={`px-4 py-2 text-sm transition-colors duration-200 ${
              activeButton === "credit"
                ? " bg-green text-white rounded-full"
                : "bg-transparent text-zinc rounded-full"
            }`}
            onClick={() => setActiveButton("credit")}
          >
            Credit
          </button>
          <button
            className={`px-4 py-2 text-sm transition-colors duration-200 ${
              activeButton === "cash"
                ? "bg-green text-white rounded-full"
                : "bg-transparent text-zinc rounded-full"
            }`}
            onClick={() => setActiveButton("cash")}
          >
            Cash
          </button>
        </div>
        <i className="ri-settings-3-line" style={{ fontSize: "23px" }}></i>
      </div>

      {/* Invoice and Date Section */}
      <div className="flex items-center space-x-0 bg-white mb-0 p-0 rounded-lg text-gray-600">
        <div className="flex-1 border-gray-300 p-0 border-none rounded-md">
          <label className="block mb-1 font-medium text-center text-sm">
            Invoice No.
          </label>
          <div className="relative mt-2">
            <input
              type="text"
              defaultValue="3"
              className="bg-transparent px-3 py-0 w-full text-center border-none focus:outline-none"
            />
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
            <input type="date" name="" id="" className="border-none" />
          </div>
        </div>
      </div>

      <div className="pt-1 pb-20">
        <div className="bg-white mb-0 p-4 rounded-lg text-zinc-800 ">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Customer *"
              // className="bg-white p-2 border rounded w-full"
              className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Phone Number"
              className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
              // className="bg-white p-2 border rounded w-full"
            />
          </div>

          {/* Billed Items Section */}
          <div className="bg-custom-blue mb-1 p-1 rounded-lg text-white">
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
                <h3 className="mb-2 font-bold text-[20px]">{item.name}</h3>
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
              <i
                className="ri-add-circle-fill pr-2"
                style={{ fontSize: "18px" }}
              ></i>
              <div
                className="mr-2 text-amber-700"
                // size={16}
              >
                {" "}
                Add Items{" "}
              </div>
              <div className="pl-1 text-gray-500">(Optional)</div>
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex bg-white mt-auto p-2 fixed bottom-0 w-full z-10 pr-[29px]">
            <ERPButton
              title="Save & New"
              onClick={() => {
                // deleteWorkspacePopup({isOpen: false});
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
                // deleteWorkspacePopup({isOpen: false});
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
              closeButton="LeftArrow"
              hasSubmit={false}
              closeTitle="Close"
              title="Add Items"
              width="w-full"
              isFullHeight={true}
              closeModal={() => setIsOpen(false)}
              content={
                <div
                  className="flex flex-col gap-0 px-0 py-0 pb-[60px]   "
                  style={{}} // Inline styles for full screen
                >
                  <div className="mx-auto max-w-md flex-grow h-full">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-gray-600"></div>

                      <div className="text-gray-600"></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <ERPDataCombobox
                          id="counterID"
                          field={{
                            id: "counterID",
                            required: true,
                            getListUrl: Urls.data_countries,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          // onChangeData={(data: any) => {
                          //   setPostData((prev: any) => ({
                          //     ...prev,
                          //     data: {
                          //       ...data,
                          //       counterID: data.counterID,
                          //     },
                          //   }));
                          // }}
                          // validation={postData.validations.counterID}
                          // data={postData?.data}
                          // defaultData={postData?.data}
                          // value={
                          //   postData != undefined &&
                          //     postData?.data != undefined &&
                          //     postData?.data?.counterID != undefined
                          //     ? postData?.data?.counterID
                          //     : 0
                          // }
                          label="counterID"
                        />
                        <div className="relative">
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
                            onClick={() => setShowPopup(true)}
                            onMouseEnter={() => setIsHovered(true)} // Show popup on hover
                            onMouseLeave={() => {
                              if (!showPopup) setIsHovered(false); // Only hide if popup is not shown
                            }}
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                            // className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                          />
                          {(showPopup || isHovered) && (
                            <div
                              ref={setPopupRef}
                              className="absolute bg-white shadow-md rounded-lg p-4 mt-0 w-full border border-gray-300 border-t-0 rounded-tr-none rounded-tl-none"
                              // style={{ top: "calc(100% + 8px)", zIndex: 10 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 font-medium">
                                  Showing Saved Items
                                </span>
                                <a href="#" className="text-blue font-medium">
                                  Add New Item
                                </a>
                              </div>
                              <hr className="mb-2" />
                              <div className="flex justify-between items-center">
                                <div onClick={() => setShowTotalsPopup(true)}>
                                  {" "}
                                  {/* Trigger Totals Popup */}
                                  <div className="text-gray-800 font-medium">
                                    Apple
                                  </div>
                                  <div className="text-gray-600 flex justify-between">
                                    <span>Purchase Price: 80.00</span>
                                    <span className="text-red-600 ml-5">
                                      In Stock:{" "}
                                      <span className="text-red">-1</span>
                                    </span>
                                  </div>
                                  {/* <div className="text-gray-600 ">
                                    In Stock:{" "}
                                    <span className="text-red-600">-1</span>
                                  </div> */}
                                </div>
                                <div>
                                  <i className="fas fa-chevron-right text-gray-400"></i>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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
                    </form>
                  </div>
                  <div className=" flex space-x-4 fixed bottom-0 w-full z-10 p-2 pr-[52px]">
                    <ERPButton
                      title="Save &amp; New"
                      onClick={() => {
                        // Handle Save & New
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
                        // deleteWorkspacePopup({isOpen: false});
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
                  </div>

                  {/* Close button */}
                  {/* <button
                    onClick={() => setIsOpen(false)}
                    className="bg-red-500 mt-auto p-2 rounded text-white"
                  >
                    Close
                  </button> */}
                  <div>
                    {/* Totals & Taxes Popup */}
                    {showTotalsPopup && (
                      <div className="max-w-md mx-auto mt-10 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">
                          Totals & Taxes
                        </h2>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">
                              Subtotal{" "}
                              <span className="text-sm text-gray-500">
                                (Rate x Qty)
                              </span>
                            </span>
                            <span className="text-gray-600">₹</span>
                            <span className="text-gray-600">200.00</span>
                          </div>

                          {/* Discount Section */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Discount</span>
                            {/* <div className="flex items-center">
                              <button className="px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none">
                                0
                              </button>
                              <button className="px-4 py-2 border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                                %
                              </button>
                              <button className="ml-1 px-4 py-2 border border-gray-300 rounded-r-md text-gray-600 focus:outline-none">
                                ₹ 0.00
                              </button>
                            </div> */}
                            <div className="flex items-center">
                              <input
                                type="number"
                                defaultValue="0"
                                className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                              />
                              <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                                %
                              </button>
                              {/* <button className="ml-1 px-4 py-2 border border-gray-300 rounded-r-md text-gray-600 focus:outline-none">
                                ₹ 0.00
                              </button> */}
                              <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                                ₹
                              </button>
                              <input
                                type="number"
                                defaultValue="0"
                                className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                              />
                            </div>
                          </div>

                          {/* Tax Section */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Tax %</span>
                            <div className="flex items-center">
                              <select className="pr-[50px] mr-2 border border-gray-400 rounded-md px-4 py-2 focus:outline-none">
                                <option>None</option>
                              </select>
                              <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                                ₹
                              </button>
                              <input
                                type="number"
                                defaultValue="0"
                                className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <span className="text-lg font-semibold">
                              Total Amount:
                            </span>
                            <span className="ml-[206px] text-lg font-semibold">
                              ₹
                            </span>
                            <span className="text-lg font-semibold">
                              200.00
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccTransaction;
