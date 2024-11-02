import React, { useState } from "react";
import RPosHeader from "../../components/common/header/rpos-header";
import RPosDropdownPanel from "./rpos-DropdownPanel";
import { useTranslation } from "react-i18next";
// import 'remixicon/fonts/remixicon.css';

interface MenuItem {
  name: string;
  price: number;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const menuCategories = ["Chinese", "Main Courses", "Sample", "Beverages"];

const menuItems: Record<string, MenuItem[]> = {
  Chinese: [{ name: "Test Item", price: 100 }],
  "Main Courses": [
    { name: "Khoya Kaju (Full)", price: 80 },
    { name: "Paneer Labadar", price: 100 },
  ],
  Sample: [],
  Beverages: [],
};

export default function Component() {
  const {t} = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("Chinese");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: "Test Item", price: 100, quantity: 1 },
    { name: "Khoya Kaju (Full)", price: 80, quantity: 1 },
    { name: "Paneer Labadar", price: 100, quantity: 1 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderType, setOrderType] = useState("Dine in");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const updateQuantity = (itemName: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) =>
          item.name === itemName
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [showInputBox, setShowInputBox] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const handleOptionChange = (option: any) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Dine In"]);

  
  const [dineInSelection, setDineInSelection] = useState<string[]>(["Dine In"]);

  // Function to handle button text based on order type
  const getButtonText = () => {
    switch (orderType) {
      case "Dine in":
        return dineInSelection.length === 0
          ? "Dine In"
          : dineInSelection.join(", ");
      case "Delivery":
        return "Delivery";
      case "Pick Up":
        return "Pick Up";
      default:
        return "Dine In";
    }
  };

  // const handleOrderTypeChange = (type: string) => {
  //   setOrderType(type);
  //   // Reset selected options when switching to Delivery or Pick Up
  //   if (type !== "Dine in") {
  //     setSelectedOptions([type]);
  //   }
  // };

  const handleOrderTypeChange = (type: string) => {
    setOrderType(type);
    if (type === "Dine in") {
      // Restore previous dine in selection when switching back to Dine in
      setSelectedOptions(dineInSelection);
    }
  };

  // Handle option selection in popup
  const handleOptionSelection = (option: string) => {
    const newSelection = [option];
    setSelectedOptions(newSelection);
    setDineInSelection(newSelection); // Update dine in selection storage
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleTableSelect = (tableNumber: string) => {
    setSelectedTable(tableNumber);
  };

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [ispersonDropdownOpen, setIspersonDropdownOpen] = useState(false);
  const [isCommentsDropdownOpen, setIsCommentsDropdownOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(option === "table" ? !isOpen : isOpen);
    setIsUserDropdownOpen(
      option === "user" ? !isUserDropdownOpen : isUserDropdownOpen
    );
    setIspersonDropdownOpen(
      option === "user" ? !ispersonDropdownOpen : ispersonDropdownOpen
    );
    setIsCommentsDropdownOpen(
      option === "user" ? !isCommentsDropdownOpen : isCommentsDropdownOpen
    );
  };

  const toggleTableDropdown = () => {
    setIsOpen((prev) => !prev);
    setIsUserDropdownOpen(false); 
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
    setIsOpen(false); 
  };
  const togglepersonDropdown = () => {
    setIspersonDropdownOpen((prev) => !prev);
    setIsOpen(false);
  };
  const toggleCommentsDropdown = () => {
    setIsCommentsDropdownOpen((prev) => !prev);
    setIsOpen(false);
  };

  const renderOrderTypeButtons = () => {
    const getVisibleButtons = () => {
      switch (orderType) {
        case "Dine in":
          return (
            <>
              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "table"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("table");
                    toggleTableDropdown();
                  }}
                >
                  <i className="ri-restaurant-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title="Table No"
                  content={
                    <div className="p-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedTable}
                          onChange={(e) => setSelectedTable(e.target.value)}
                          placeholder="1"
                          className="w-20 p-2 border rounded-md text-center"
                        />
                        <button
                          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                          onClick={() => setIsOpen(false)}
                        >
                          View KOT
                        </button>
                      </div>

                      {/* Quick Select Buttons */}
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleTableSelect(num.toString())}
                            className="p-2 border rounded-md hover:bg-gray-100 text-center"
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      {/* Table Status Section */}
                      <div className="p-4 bg-gray-50 rounded-b-md mt-[10px]">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#32d62e] rounded-full"></div>
                            <span className="text-gray-600 !mr-[6px]">
                              Available
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#f01717] rounded-full"></div>
                            <span className="text-gray-600 !mr-[6px]">
                              Occupied
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#f8e618] rounded-full"></div>
                            <span className="text-gray-600 !mr-[6px]">
                              Reserved
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "user"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("user");
                    toggleUserDropdown();
                  }}
                >
                  <i className="ri-user-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isUserDropdownOpen}
                  setIsOpen={setIsUserDropdownOpen}
                  title="customer details"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Mobile:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Name:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Add:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Locality:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "group"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("group");
                    togglepersonDropdown();
                  }}
                >
                  <i className="ri-group-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={ispersonDropdownOpen}
                  setIsOpen={setIspersonDropdownOpen}
                  title="No Of persons"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            No Of persons:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "edit"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("edit");
                    toggleCommentsDropdown();
                  }}
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCommentsDropdownOpen}
                  setIsOpen={setIsCommentsDropdownOpen}
                  title="Comments"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Comments:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500 w-[158px]"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>
            </>
          );

        case "Delivery":
          return (
            <>
              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "user"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("user");
                    toggleUserDropdown();
                  }}
                >
                  <i className="ri-user-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isUserDropdownOpen}
                  setIsOpen={setIsUserDropdownOpen}
                  title="customer details"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Mobile:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Name:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Add:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Locality:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "edit"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("edit");
                    toggleCommentsDropdown();
                  }}
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCommentsDropdownOpen}
                  setIsOpen={setIsCommentsDropdownOpen}
                  title="Comments"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Comments:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500 w-[158px]"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>
            </>
          );
        case "Pick Up":
          return (
            <>
              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "user"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("user");
                    toggleUserDropdown();
                  }}
                >
                  <i className="ri-user-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isUserDropdownOpen}
                  setIsOpen={setIsUserDropdownOpen}
                  title="customer details"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Mobile:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Name:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Add:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Locality:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>

              <div className="relative flex-1 min-w-[100px]">
                <button
                  className={`w-full p-3 flex justify-center items-center border-r ${
                    selectedOption === "edit"
                      ? "border-t-2 border-[#f90303]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption("edit");
                    toggleCommentsDropdown();
                  }}
                >
                  <i className="ri-edit-line text-xl"></i>
                </button>
                <RPosDropdownPanel
                  isOpen={isCommentsDropdownOpen}
                  setIsOpen={setIsCommentsDropdownOpen}
                  title="Comments"
                  content={
                    <div>
                      <form className="space-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-right mr-4 font-bold">
                            Comments:
                          </label>
                          <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500 w-[158px]"
                          />
                        </div>
                      </form>
                    </div>
                  }
                />
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div className="flex border border-gray-300 flex-wrap">
        {getVisibleButtons()}
        <button
          className="flex-1 w-full p-3 flex justify-center items-center bg-[#ff7800] text-white"
          // onClick={() => setIsPopupOpen(true)}
          onClick={() => orderType === "Dine in" && setIsPopupOpen(true)}
        >
          {getButtonText()}
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-[94vh] bg-gray-200 text-gray-800 font-sans">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}

        {/* Order Type and Search Bar */}
        <div className="bg-gray-300 p-2 flex justify-between items-center">
          <div className="w-[59%]">
            <input
              type="text"
              placeholder="Search item..."
              className="w-full p-2 rounded rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-[40%] flex space-x-2">
            {["dine_in"].map((type: any) => (
              <button
                key={type}
                className={`px-4 py-2 rounded rounded-md ${
                  orderType === type ? "bg-primary text-white" : "bg-white"
                } flex-1`}
                onClick={() => handleOrderTypeChange(type)}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>
        {/* Popup for Dine in options */}
        {isPopupOpen && orderType === "Dine in" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Select Options</h2>
                {["Dine In", "AC", "Dining"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <span>{option}</span>
                    <input
                      type="radio"
                      name="diningOption"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelection(option)}
                      className="form-radio text-red-600"
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#f90303] text-white rounded-md"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu and Order Summary */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-gray-800 text-white flex flex-col">
            <nav className="flex-1 overflow-y-auto">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  className={`w-full text-left p-3 hover:bg-gray-700 ${
                    selectedCategory === category ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
          {/* Menu Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {menuItems[selectedCategory].map((item) => (
                <button
                  key={item.name}
                  className="p-4 bg-white shadow rounded rounded-md text-center"
                  onClick={() => updateQuantity(item.name, 1)}
                >
                  {item.name}
                  <br />₹{item.price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-[40%] bg-white shadow-md overflow-y-auto flex flex-col">
            {renderOrderTypeButtons()}

            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>ITEMS</th>
                    <th className="text-center">QTY.</th>
                    <th className="text-right">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.name} className="border-b">
                      <td className="py-2 flex items-center">
                        <i className="ri-close-circle-line text-[#f90303] mr-2"></i>
                        {item.name}
                      </td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="px-2 text-gray-500"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, 1)}
                          className="px-2 text-gray-500"
                        >
                          +
                        </button>
                      </td>
                      <td className="py-2 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="relative">
              <button
                // onClick={togglePopup}
                onClick={() => setShowInputBox(!showInputBox)}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-3 py-1 rounded rounded-full hover:bg-gray-600 transition-colors"
              >
                
                {showInputBox ? <i className="ri-arrow-down-s-line"></i> :  <i className="ri-arrow-up-s-line"></i>}
              </button>
              {showInputBox && (
                <div className="w-[100%] absolute bottom-full mb-0 bg-gray-700 p-4 border border-gray-700 rounded-none shadow-lg">
                  {/* <h1>mj</h1> */}
                  {/* <p>test</p> */}
                  <div className="bg-gray-700 p-4 text-white rounded-md">
                    <div className="flex justify-between mb-4">
                      <span>Sub Total</span>
                      <span>3</span>
                      <span>181.00</span>
                    </div>

                    <div className="flex justify-between mb-4">
                      <span>Discount</span>
                      <button
                        onClick={() => setPopupVisible(!popupVisible)}
                        className="flex items-center space-x-1"
                      >
                        <span>More</span>{" "}
                        <i className="ri-arrow-down-s-line"></i>
                      </button>
                      <span>(0.00)</span>
                    </div>

                    {popupVisible && (
                      <div className="bg-gray-600 p-3 rounded mb-4">
                        {/* Popup content */}
                        <button
                          onClick={() => setPopupVisible(false)}
                          className="flex items-center space-x-1"
                        >
                          <i className="ri-close-line"></i>
                          <span>Close</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Delivery Charge</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Container Charge</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <span>Tax</span>
                      <button className="flex items-center space-x-1">
                        <span>More</span>{" "}
                        <i className="ri-arrow-down-s-line"></i>
                      </button>
                      <span>0.00</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2">Round Off</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Customer Paid</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Return to Customer</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Tip</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full px-2 py-1 bg-gray-800 rounded border-none text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-800 flex justify-between items-center font-bold">
              <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
                Split
              </button>
              <span className="text-white">Total:₹{total.toFixed(2)}</span>
            </div>
            <div className="bg-gray-600 p-2 flex justify-center items-center">
              <div className="flex space-x-2">
                <div className="flex items-center space-x-4">
                  {["Cash", "Card", "Due", "Other"].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.toLowerCase()}
                        checked={paymentMethod === method.toLowerCase()}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-radio text-[#f90303]"
                      />
                      <span className="text-white">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-2 flex justify-center items-center">
              <div className="flex space-x-2">
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2" /> It's Paid
                </label>
              </div>
            </div>
            <div className="flex space-x-2 p-4 ml-1">
              <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
                Save
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
                Save & Print
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
                Save & eBill
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded rounded-md">
                KOT
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded rounded-md">
                KOT & Print
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded rounded-md">
                Hold
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
