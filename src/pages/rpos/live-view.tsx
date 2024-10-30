import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface OrderItem {
  quantity: number;
  name: string;
  variant?: string;
}

interface OrderCardProps {
  cafeName: string;
  billNumber: string;
  time: string;
  orderType: "Pick Up" | "Delivery" | "Dine In" | "Online" | "Other";
  status: string;
  items: string[];
  total?: string;
  bgColor?: string;
  paymentType?: string;
  phoneNumber?: string;
  table?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  cafeName,
  billNumber,
  time,
  orderType,
  status,
  items,
  total,
  bgColor = "bg-[#3b82f6]",
  paymentType = "COD",
  phoneNumber,
  table,
}) => {
  const getStatusColor = (type: OrderCardProps["orderType"]): string => {
    switch (type) {
      case "Pick Up":
        return "bg-[#dbeafe] text-[#3b82f6]";
      case "Delivery":
        return "bg-[#ede9fe] text-[#8b5cf6]";
      case "Dine In":
        return "bg-[#dcfce7] text-[#22c55e]";
      default:
        return "bg-[#f3f4f6] text-[#6b7280]";
    }
  };
  // const navigate = useNavigate();


  // const handleClick = () => {
  //   navigator(-1);
  // };

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#e5e7eb] p-4">
      <div className="h-[223px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#374151] font-semibold">{cafeName}</span>
          <span
            className={`${getStatusColor(
              orderType
            )} px-2 py-1 rounded rounded-md`}
          >
            {orderType}
          </span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-[#374151]">BILL: {billNumber}</span>
          <span className="text-[#374151]">{time}</span>
        </div>

        {table && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#374151]">TABLE: {table}</span>
          </div>
        )}

        <div className="text-[#374151] mb-2">{status}</div>

        {phoneNumber && (
          <div className="text-[#374151] mb-2">{phoneNumber}</div>
        )}

        {items.map((item, index) => (
          <div key={index} className="text-[#374151] mb-2">
            {item}
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center">
        <button className="bg-[#e5e7eb] text-[#374151] px-4 py-2 rounded rounded-md mr-[6px]">
          <i className="ri-printer-line"></i>
        </button>
        <button className="bg-[#e5e7eb] text-[#374151] px-4 py-2 rounded rounded-md mr-[6px]">
          Info
        </button>
        {orderType === "Dine In" ? (
          <button className="bg-[#1f2937] text-white px-4 py-2 rounded rounded-md mr-[6px]">
            Save & Print
          </button>
        ) : (
          <button className="bg-[#f97316] text-white px-4 py-2 rounded rounded-md mr-[6px]">
            Food Is Ready
          </button>
        )}
      </div>
    </div>
  );
};

interface Order extends Omit<OrderCardProps, "bgColor" | "total"> {
  id: string;
}

interface RPosLiveViewProps {
  initialView?: "order" | "kot";
}

const RPosLiveView: React.FC<RPosLiveViewProps> = ({
  initialView = "order",
}) => {
  const [activeView, setActiveView] = React.useState<"order" | "kot">(
    initialView
  );
  const [selectedOrderType, setSelectedOrderType] =
    React.useState<string>("All");

  const orders: Order[] = [
    {
      id: "1",
      cafeName: "Teapol Cafe",
      billNumber: "27",
      time: "01:20",
      orderType: "Pick Up",
      status: "Not Assigned",
      items: ["1 x Test Item"],
    },
    {
      id: "2",
      cafeName: "Teapol Cafe",
      billNumber: "26",
      time: "01:36",
      orderType: "Delivery",
      status: "Not Assigned",
      phoneNumber: "9744688453",
      items: ["1 x Khoya Kaju (Full)"],
    },
    {
      id: "3",
      cafeName: "Teapol Cafe",
      billNumber: "25",
      time: "02:39",
      orderType: "Dine In",
      status: "Not Assigned",
      table: "C1",
      items: ["1 x Hakka Noodles (1 Bowl)"],
    },
  ];

  const orderTypes = [
    "All",
    "Dine In",
    "Delivery",
    "Pick Up",
    "Online",
    "Other",
  ];

  const filteredOrders = React.useMemo(() => {
    if (selectedOrderType === "All") return orders;
    return orders.filter((order) => order.orderType === selectedOrderType);
  }, [selectedOrderType, orders]);

  const handleViewChange = (view: "order" | "kot") => {
    setActiveView(view);
  };

  const handleOrderTypeChange = (type: string) => {
    setSelectedOrderType(type);
  };

  // CSS for the toggle switch
  const style = document.createElement("style");
  style.textContent = `
    .toggle-checkbox:checked {
        right: 0;
        border-color: #68D391;
    }
    .toggle-checkbox:checked + .toggle-label {
        background-color: #68D391;
    }
`;


  return (
    <div>
      <div className="flex items-center p-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 p-2 border rounded-lg">
            <i className="fas fa-clipboard-list text-[#ef4444]"></i>
            <span className="text-[#ef4444]">Order View</span>
          </div>
          <div className="flex items-center space-x-1 p-2 border rounded-lg">
            <i className="fas fa-receipt text-black"></i>
            <span className="text-black">Kot View</span>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-4">
          <span>View Details</span>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          <i className="fas fa-filter text-black"></i>
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
            <span>Foodready</span>
            <span className="bg-[#ef4444] text-white rounded-full px-2">2</span>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
            <span>Dispatch</span>
            <span className="bg-[#ef4444] text-white rounded-full px-2">0</span>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
            <span>Deliver</span>
            <span className="bg-[#ef4444] text-white rounded-full px-2">0</span>
          </div>
          <i className="fas fa-sync-alt text-black"></i>
          <div className="flex items-center space-x-1 p-2 border rounded-lg">
            <i className="fas fa-arrow-left text-black"></i>
            <span className="text-black">Back</span>
          </div>
        </div>
      </div>
      {/* <header className="bg-white shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-4">
            <button className="bg-slate-400 flex items-center space-x-2 text-[#ef4444]">
              <span>Order View</span>
            </button>
            <button className="text-gray-500">Kot View</button>
          </div>
          <div className="flex-grow flex items-center justify-center space-x-4">
            <span>View Details</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-10 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-green-500 peer-checked:bg-transition duration-200"></div>
              <div className="absolute w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 border p-2 rounded">
              <i className="fas fa-filter"></i>
              <span>Foodready</span>
              <span className="bg-[#ef4444] text-white rounded-full px-2">
                2
              </span>
            </button>
            <button className="flex items-center space-x-2 border p-2 rounded">
              <span>Dispatch</span>
              <span className="bg-[#ef4444] text-white rounded-full px-2">
                0
              </span>
            </button>
            <button className="flex items-center space-x-2 border p-2 rounded">
              <span>Deliver</span>
              <span className="bg-[#ef4444] text-white rounded-full px-2">
                0
              </span>
            </button>
            <button className="p-2 rounded">
              <i className="fas fa-sync-alt"></i>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded">
              <i className="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
          </div>

          <Link
            to="/settings"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="bx bx-cog header-link-icon text-[23px] "></i>
          </Link>

          <Link
            to="/"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="ri-shut-down-line text-[23px]"></i>
          </Link>
        </div>
      </header> */}
      <header className="bg-white shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center space-x-6 text-gray-600">
          {/* <button className="flex items-center space-x-2 text-[#ef4444] bg-red-100 p-2 rounded">
            <i className="fas fa-th-large"></i>
            <span>All</span>
          </button>
          <button className="flex items-center space-x-2">
            <i className="fas fa-utensils"></i>
            <span>Dine In</span>
          </button>
          <button className="flex items-center space-x-2">
            <i className="fas fa-truck"></i>
            <span>Delivery</span>
          </button>
          <button className="flex items-center space-x-2">
            <i className="fas fa-shopping-bag"></i>
            <span>Pick Up</span>
          </button>
          <button className="flex items-center space-x-2">
            <i className="fas fa-wifi"></i>
            <span>Online</span>
          </button>
          <button className="flex items-center space-x-2">
            <i className="fas fa-ellipsis-h"></i>
            <span>Other</span>
          </button> */}
          <div className="flex space-x-4">
            {orderTypes.map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded rounded-md ${
                  selectedOrderType === type
                    ? "bg-[#fee2e2] text-[#ef4444]"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
                onClick={() => handleOrderTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="order No"
              className="border p-1 rounded w-24 rounded-md"
            />

            <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
              MFR
            </button>
          </div>

          {/* <Link
            to="/settings"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="bx bx-cog header-link-icon text-[23px] "></i>
          </Link>

          <Link
            to="/"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="ri-shut-down-line text-[23px]"></i>
          </Link> */}
        </div>
      </header>
      <div className="p-4">
        {/* <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeView === "order"
                ? "bg-[#fee2e2] text-[#ef4444]"
                : "bg-[#e5e7eb] text-[#6b7280]"
            }`}
            onClick={() => handleViewChange("order")}
          >
            Order View
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeView === "kot"
                ? "bg-[#fee2e2] text-[#ef4444]"
                : "bg-[#e5e7eb] text-[#6b7280]"
            }`}
            onClick={() => handleViewChange("kot")}
          >
            Kot View
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-[#e5e7eb] text-[#6b7280] px-4 py-2 rounded">
            Foodready{" "}
            <span className="bg-[#ef4444] text-white px-2 py-1 rounded-full">
              2
            </span>
          </button>
          <button className="bg-[#e5e7eb] text-[#6b7280] px-4 py-2 rounded">
            Dispatch{" "}
            <span className="bg-[#ef4444] text-white px-2 py-1 rounded-full">
              0
            </span>
          </button>
          <button className="bg-[#e5e7eb] text-[#6b7280] px-4 py-2 rounded">
            Back
          </button>
          <input
            type="text"
            placeholder="Enter order no."
            className="border border-[#d1d5db] rounded px-4 py-2"
          />
        </div>
      </div> */}

        {/* <div className="flex space-x-4">
        {orderTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              selectedOrderType === type
                ? "bg-[#fee2e2] text-[#ef4444]"
                : "bg-[#e5e7eb] text-[#6b7280]"
            }`}
            onClick={() => handleOrderTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div> */}

        <div className="mt-4">
          <span className="text-[#6b7280]">
            Total Orders | {filteredOrders.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} {...order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RPosLiveView;
