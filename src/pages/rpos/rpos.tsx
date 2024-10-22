import React, { useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface POSProps {
  initialItems?: OrderItem[];
}

const POS: React.FC<POSProps> = ({ initialItems = [] }) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [selectedPayment, setSelectedPayment] = useState<
    "cash" | "card" | "due" | "other" | "part" | "upi"
  >("cash");
  const [isPaid, setIsPaid] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePaymentChange = (
    method: "cash" | "card" | "due" | "other" | "part" | "upi"
  ) => {
    setSelectedPayment(method);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-52 bg-gray-800 text-white">
        {/* Logo Section */}
        <div className="p-3 bg-gray-900 flex items-center space-x-2">
          <i className="ri-menu-line text-xl"></i>
          {/* <span className="text-xl font-bold text-red-500">polosys</span> */}
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <div className="px-3 py-2 bg-white text-gray-800">Sample</div>
          <div className="px-3 py-2">Beverages</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white h-14 px-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1.5 bg-red-600 text-white text-sm rounded">
              New Order
            </button>
            <div className="flex">
              <input
                type="text"
                placeholder="Bill No"
                className="px-3 py-1 border rounded-l text-sm w-32"
              />
              <input
                type="text"
                placeholder="KOT No"
                className="px-3 py-1 border-t border-b border-r rounded-r text-sm w-32"
              />
            </div>
          </div>

          <div className="flex items-center">
            {/* Right side icons */}
            <div className="flex space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-printer-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-bank-card-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-apps-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-cloud-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-file-list-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-time-line text-lg text-gray-600"></i>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-notification-line text-lg text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-question-line text-lg text-gray-600"></i>
              </button>
              <div className="flex items-center bg-red-50 rounded-full px-3 py-1 text-sm text-red-600">
                <i className="ri-customer-service-line mr-1"></i>
                <span>07969 223344</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-logout-box-line text-lg text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Order Section */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded h-full flex flex-col">
            {/* Order Header */}
            <div className="px-4 py-2 border-b flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="flex items-center space-x-1">
                  <div className="bg-gray-100 p-2 rounded">
                    <i className="ri-restaurant-line text-lg text-gray-600"></i>
                  </div>
                  <span className="font-semibold">AC1</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="hover:bg-gray-100 p-2 rounded">
                    <i className="ri-user-line text-lg text-gray-600"></i>
                  </button>
                  <button className="hover:bg-gray-100 p-2 rounded">
                    <i className="ri-group-line text-lg text-gray-600"></i>
                  </button>
                  <button className="hover:bg-gray-100 p-2 rounded">
                    <i className="ri-edit-line text-lg text-gray-600"></i>
                  </button>
                </div>
              </div>
              <div className="bg-yellow-500 px-3 py-1 rounded text-white font-medium">
                AC
              </div>
            </div>

            {/* Order Content */}
            <div className="flex-1 flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-12 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600 border-b">
                <div className="col-span-6">ITEMS</div>
                <div className="col-span-3 text-center">CHECK ITEMS</div>
                <div className="col-span-1 text-center">QTY.</div>
                <div className="col-span-2 text-right">PRICE</div>
              </div>

              {/* Empty State */}
              {items.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 mb-4">
                    <i className="ri-restaurant-line text-5xl"></i>
                  </div>
                  <p className="text-lg font-medium">No Item Selected</p>
                  <p className="text-sm">
                    Please Select Item from Left Menu Item
                  </p>
                </div>
              )}
            </div>

            {/* Order Footer */}
            <div className="border-t bg-slate-400">
              {/* Split and Total */}
              <div className="px-4 py-2 flex justify-between items-center bg-gray-50">
                <button className="px-4 py-1.5 bg-red-600 text-white text-sm rounded">
                  Split
                </button>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="flex space-x-6">
                  {["Cash", "Card", "Due", "Other", "Part", "UPI"].map(
                    (method) => (
                      <label
                        key={method}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          className="form-radio text-red-600"
                          checked={selectedPayment === method.toLowerCase()}
                          onChange={() =>
                            handlePaymentChange(method.toLowerCase() as any)
                          }
                        />
                        <span className="text-sm font-medium">{method}</span>
                      </label>
                    )
                  )}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox text-red-600"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                    />
                    <span className="text-sm font-medium">It's Paid</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-6 gap-2 p-4 bg-gray-100">
                <button className="px-4 py-2 bg-[#f93005] text-white rounded text-sm font-medium hover:bg-red-700">
                  Save
                </button>
                <button className="px-4 py-2 bg-[#f93005] text-white rounded text-sm font-medium hover:bg-red-700">
                  Save & Print
                </button>
                <button className="px-4 py-2 bg-[#f93005] text-white rounded text-sm font-medium hover:bg-red-700">
                  Save & eBill
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700">
                  KOT
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700">
                  KOT & Print
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700">
                  Hold
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
