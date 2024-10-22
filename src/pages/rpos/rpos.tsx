import React, { useState } from "react";
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

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex h-[92vh] bg-gray-200 text-gray-800 font-sans">
      {/* Sidebar */}
      {/* <div className="w-48 bg-gray-800 text-white flex flex-col">
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
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-md p-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="ri-menu-line text-2xl mr-2"></i>
            <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md ">
              New Order
            </button>
            <input
              type="text"
              placeholder="Bill No"
              className="border p-1 rounded w-24 rounded-md"
            />
            <input
              type="text"
              placeholder="KOT No."
              className="border p-1 rounded w-24 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <i className="ri-file-list-line text-xl"></i>
            <i className="ri-printer-line text-xl"></i>
            <i className="ri-layout-grid-line text-xl"></i>
            <i className="ri-image-line text-xl"></i>
            <i className="ri-file-list-3-line text-xl"></i>
            <i className="ri-time-line text-xl"></i>
            <i className="ri-notification-3-line text-xl"></i>
            <i className="ri-question-line text-xl"></i>
            <i className="ri-shut-down-line text-xl"></i>
          </div>
        </header>

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
            {["Dine in", "Delivery", "Pick Up"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded rounded-md ${
                  orderType === type ? "bg-[#f90303] text-white" : "bg-white"
                } flex-1`}
                onClick={() => setOrderType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Menu and Order Summary */}
        <div className="flex-1 flex overflow-hidden">
          {/* Menu Items */}
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
            {/* <div className="p-2 bg-gray-200 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-300 rounded rounded-md">
                  A C 1
                </button>
                <button className="px-3 py-1 bg-white rounded rounded-md">
                  <i className="ri-user-line"></i>
                </button>
                <button className="px-3 py-1 bg-white rounded rounded-md">
                  <i className="ri-group-line"></i>
                </button>
              </div>
              <button className="px-3 py-1 bg-white rounded rounded-md">
                <i className="ri-edit-box-line"></i>
              </button>
            </div> */}
            <div className="flex border border-gray-300">
              <button
                className={`flex-1 p-3 flex justify-center items-center border-r ${
                  selectedOption === "table" ? "border-t-2 border-[#f90303]" : ""
                }`}
                onClick={() => handleOptionClick("table")}
              >
                <i className="ri-restaurant-line text-xl"></i>
              </button>

              <button
                className={`flex-1 p-3 flex justify-center items-center border-r ${
                  selectedOption === "user" ? "border-t-2 border-[#f90303]" : ""
                }`}
                onClick={() => handleOptionClick("user")}
              >
                <i className="ri-user-line text-xl"></i>
              </button>

              <button
                className={`flex-1 p-3 flex justify-center items-center border-r ${
                  selectedOption === "group" ? "border-t-2 border-[#f90303]" : ""
                }`}
                onClick={() => handleOptionClick("group")}
              >
                <i className="ri-group-line text-xl"></i>
              </button>

              <button
                className={`flex-1 p-3 flex justify-center items-center border-r ${
                  selectedOption === "edit" ? "border-t-2 border-[#f90303]" : ""
                }`}
                onClick={() => handleOptionClick("edit")}
              >
                <i className="ri-edit-line text-xl"></i>
              </button>

              <button
                className={`flex-1 p-3 flex justify-center items-center ${
                  selectedOption === "dineIn" ? "bg-[#ff7800] text-white" : ""
                }`}
                onClick={() => handleOptionClick("dineIn")}
              >
                Dine In
              </button>
            </div>
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
            {/* <div className="flex justify-center mb-2">
              <button
                className="w-full border border-gray-300 px-4 py-2  text-gray-600 focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200  focus:border-b-0 "
                onClick={() => setShowInputBox(!showInputBox)}
              >
                {showInputBox ? "View Less" : "View More"}
              </button>
            </div>
            {showInputBox && (
              <div>
                <h1>mj</h1>
              </div>
            )} */}
            {/* <div className="flex justify-center mb-2 relative"> */}
            {/* <button
                className="w-full border border-gray-300 px-4 py-2 text-gray-600 focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 focus:border-b-0"
                onClick={() => setShowInputBox(!showInputBox)}
              >
                {showInputBox ? "View Less" : "View More"}
              </button> */}

            {/* {showInputBox && (
                <div className="absolute bottom-full mb-2 bg-white p-4 border border-gray-300 rounded-md shadow-lg">
                  <h1>mj</h1>
                </div>
              )} */}
            {/* </div> */}

            <div className="relative">
              <button
                // onClick={togglePopup}
                onClick={() => setShowInputBox(!showInputBox)}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded rounded-full"
              >
                <i className="ri-arrow-up-s-line"></i> {/* Up Icon */}
              </button>
              {showInputBox && (
                <div className="w-[100%] absolute bottom-full mb-0 bg-gray-600 p-4 border border-gray-300 rounded-none shadow-lg">
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
              <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
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
              <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
                Save
              </button>
              <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
                Save & Print
              </button>
              <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
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

        {/* Bottom Action Bar */}
        {/* <div className="bg-gray-800 p-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
              Split
            </button>
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
            <label className="flex items-center text-white">
              <input type="checkbox" className="mr-2" /> It's Paid
            </label>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
              Save
            </button>
            <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
              Save & Print
            </button>
            <button className="px-4 py-2 bg-[#f90303] text-white rounded rounded-md">
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
        </div> */}
      </div>
    </div>
  );
}
