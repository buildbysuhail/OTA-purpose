import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Receipt,
  Filter,
  RefreshCcw,
  ArrowLeft,
  Printer,
  Info,
  Grid2x2,
  Utensils,
  Truck,
  PackageCheck,
  Wifi,
  BookHeart,
} from "lucide-react";

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
          <Printer className="w-5 h-5" />
        </button>
        <button className="bg-[#e5e7eb] text-[#374151] px-4 py-2 rounded rounded-md mr-[6px]">
          <Info className="w-5 h-5" />
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

  // const orderTypes = [
  //   "All",
  //   "Dine In",
  //   "Delivery",
  //   "Pick Up",
  //   "Online",
  //   "Other",
  // ];

  const orderTypes = [
    { label: "All", icon: <Grid2x2 /> },
    { label: "Dine In", icon: <Utensils /> },
    { label: "Delivery", icon: <Truck /> },
    { label: "Pick Up", icon: <PackageCheck /> },
    { label: "Online", icon: <Wifi /> },
    { label: "Other", icon: <BookHeart /> },
    // { label: "Other", icon: null },
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

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center p-2 bg-white shadow border-b-[1px] border-t-[1px] border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 p-2 border rounded-lg">
            <ClipboardList className="w-[1rem] h-[1rem] text-[#ef4444]" />
            <span className="text-[#ef4444]">Order View</span>
          </div>
          <div className="flex items-center space-x-1 p-2 border rounded-lg">
            <Receipt className="w-[1rem] h-[1rem]" />
            <span className="text-black">Kot View</span>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-4">
          <span>View Details</span>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#fca5a5] dark:peer-focus:ring-[#991b1b] dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc2626]"></div>
            </label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
            <Filter className="w-5 h-5" />
          </div>
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
          <div onClick={handleRefresh} className="flex items-center space-x-2 p-2 border rounded-lg">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <div
            className="flex items-center space-x-1 p-2 border rounded-lg cursor-pointer"
            onClick={handleClick}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-black">Back</span>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex space-x-4">
            {/* {orderTypes.map((type) => (
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
            ))} */}
            {orderTypes.map((type) => (
              <button
                key={type.label}
                className={`px-4 py-2 rounded rounded-md flex items-center space-x-2 ${
                  selectedOrderType === type.label
                    ? "bg-[#fee2e2] text-[#ef4444]"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
                onClick={() => handleOrderTypeChange(type.label)}
              >
                {type.icon && <span className="mr-2">{type.icon}</span>}
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 p-2 absolute right-4">
            <input
              type="text"
              placeholder="order No"
              className="border p-1 rounded w-24 rounded-md"
            />

            <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
              MFR
            </button>
          </div>
        </div>
      </header>
      <div className="p-4">
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
