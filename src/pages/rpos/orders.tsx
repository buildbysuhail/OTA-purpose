// import React from "react";
import React, { useState } from "react";

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
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
  RotateCcw,
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

interface RPosOrdersProps {
  initialView?: "order" | "kot";
}

const RPosOrders: React.FC<RPosOrdersProps> = ({ initialView = "order" }) => {
  const [activeView, setActiveView] = React.useState<"order" | "kot">(
    initialView
  );
  const [selectedOrderType, setSelectedOrderType] =
    React.useState<string>("All");

  // const orders: Order[] = [
  //   {
  //     id: "1",
  //     cafeName: "Teapol Cafe",
  //     billNumber: "27",
  //     time: "01:20",
  //     orderType: "Pick Up",
  //     status: "Not Assigned",
  //     items: ["1 x Test Item"],
  //   },
  //   {
  //     id: "2",
  //     cafeName: "Teapol Cafe",
  //     billNumber: "26",
  //     time: "01:36",
  //     orderType: "Delivery",
  //     status: "Not Assigned",
  //     phoneNumber: "9744688453",
  //     items: ["1 x Khoya Kaju (Full)"],
  //   },
  //   {
  //     id: "3",
  //     cafeName: "Teapol Cafe",
  //     billNumber: "25",
  //     time: "02:39",
  //     orderType: "Dine In",
  //     status: "Not Assigned",
  //     table: "C1",
  //     items: ["1 x Hakka Noodles (1 Bowl)"],
  //   },
  // ];

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
    // { label: "Online", icon: <Wifi /> },
    // { label: "Other", icon: <BookHeart /> },
    // { label: "Other", icon: null },
  ];

  // const filteredOrders = React.useMemo(() => {
  //   if (selectedOrderType === "All") return orders;
  //   return orders.filter((order) => order.orderType === selectedOrderType);
  // }, [selectedOrderType, orders]);

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

  interface FilterState {
    orderNo: string;
    paymentType: string;
    tableNo: string;
    customerName: string;
    mobile: string;
    orderStatus: string;
    onlinePartner: string;
    sortByCreated: string;
    sortByDesc: string;
    total: string;
  }

  const [filters, setFilters] = React.useState<FilterState>({
    orderNo: "",
    paymentType: "All",
    tableNo: "",
    customerName: "",
    mobile: "",
    orderStatus: "All",
    onlinePartner: "All",
    sortByCreated: "Created",
    sortByDesc: "DESC",
    total: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const orders = [
    {
      orderNo: 34,
      orderType: "Dine In (A C 1)",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 50.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 50.0,
      created: "2024-11-01 10:04:28",
    },
    {
      orderNo: 33,
      orderType: "Pick Up",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 1.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 1.0,
      created: "2024-10-31 12:14:16",
    },
    {
      orderNo: 32,
      orderType: "Delivery",
      customerPhone: "9633587623",
      customerName: "mj",
      paymentType: "Cash",
      myAmount: 80.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 80.0,
      created: "2024-10-31 12:14:04",
    },
    {
      orderNo: 31,
      orderType: "Dine In (A C 1)",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 50.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 50.0,
      created: "2024-10-31 12:13:44",
    },
    {
      orderNo: 30,
      orderType: "Pick Up",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 2000.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 2000.0,
      created: "2024-10-30 10:39:13",
    },
    {
      orderNo: 29,
      orderType: "Delivery",
      customerPhone: "9633587623",
      customerName: "mj",
      paymentType: "Cash",
      myAmount: 51.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 51.0,
      created: "2024-10-30 10:38:53",
    },
    {
      orderNo: 28,
      orderType: "Dine In (A C 1)",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 140.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 140.0,
      created: "2024-10-30 08:25:14",
    },
    {
      orderNo: 27,
      orderType: "Pick Up",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 1.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 1.0,
      created: "2024-10-24 15:19:30",
    },
    {
      orderNo: 26,
      orderType: "Delivery",
      customerPhone: "9744668453",
      customerName: "",
      paymentType: "Cash",
      myAmount: 80.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 80.0,
      created: "2024-10-24 15:19:14",
    },
    {
      orderNo: 25,
      orderType: "Dine In (A C 1)",
      customerPhone: "",
      customerName: "",
      paymentType: "Cash",
      myAmount: 50.0,
      tax: 0.0,
      discount: 0.0,
      grandTotal: 50.0,
      created: "2024-10-24 15:18:11",
    },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
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
        </div>
      </header>
      <div>
        <div className="flex items-center justify-between mb-0 mt-[12px]">
          <button
            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md ml-[10px]"
            onClick={toggleExpand}
            // onClick={() => toggleExpand(!isExpanded)}
          >
            {/* <i className="fas fa-search mr-2"></i> Search */}
            <Search className="mr-2 w-5 h-5" /> Search
            {/* <i className="fas fa-chevron-down ml-2"></i> */}
            {/* <ChevronDown className="ml-2 w-5 h-5" /> */}
            {isExpanded ? <ChevronUp  className="ml-2 w-5 h-5"  /> :  <ChevronDown className="ml-2 w-5 h-5" /> }
          </button>
          <div className="flex space-x-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-[10px]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span>Saved Bill</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
              <span>Printed Bill</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>
              <span>Cancelled Bill</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
              <span>Paid</span>
            </div>
          </div>
        </div>
        <div>
          {isExpanded && (
            <div className="bg-white shadow-md rounded-lg p-0">
              <div className="p-0 px-4">
                <div className="grid grid-cols-5 gap-1 pt-[10px]">
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Order No.
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Payment Type
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>All</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Table No.
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Mobile
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Order Status
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>All</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Online Partner
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>All</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Sort By
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Created</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Sort By
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>DESC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Total
                    </label>
                    <select className="border border-gray-300 rounded-md p-2.5 w-full h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>=</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-[16px] pb-[10px] pr-[10px]">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2 flex items-center">
                <RotateCcw className="mr-2 w-5 h-5" />  Reset
                </button>
                <button className="bg-[#ef4444] text-white px-4 py-2 rounded-md mr-2 flex items-center">
                <Globe className="mr-2 w-5 h-5" /> Search From Web
                </button>
                <button className="bg-[#ef4444] text-white px-4 py-2 rounded-md flex items-center">
                <Search className="mr-2 w-5 h-5" /> Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-0 ">
        {/* <div className="container mx-auto p-4"> */}
        <div className="p-4">
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="border-t-[1px]">
                <tr>
                  <th className="py-2 px-4 border-b">Order No.</th>
                  <th className="py-2 px-4 border-b">Order Type</th>
                  <th className="py-2 px-4 border-b">Customer Phone</th>
                  <th className="py-2 px-4 border-b">Customer Name</th>
                  <th className="py-2 px-4 border-b">Payment Type</th>
                  <th className="py-2 px-4 border-b">My Amount (₹)</th>
                  <th className="py-2 px-4 border-b">Tax (₹)</th>
                  <th className="py-2 px-4 border-b">Discount (₹)</th>
                  <th className="py-2 px-4 border-b">Grand Total (₹)</th>
                  <th className="py-2 px-4 border-b">Created</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={order.orderNo === 28 ? "bg-orange-100" : ""}
                  >
                    <td className="py-2 px-4 border-b text-red-500">
                      {order.orderNo}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.orderType.split(" ")[0]}
                      <br />
                      <span className="italic font-bold">
                        ({order.orderType.split(" ")[1]})
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.customerPhone}
                    </td>
                    <td className="py-2 px-4 border-b">{order.customerName}</td>
                    <td className="py-2 px-4 border-b">{order.paymentType}</td>
                    <td className="py-2 px-4 border-b">
                      {order.myAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.tax.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      ({order.discount.toFixed(2)})
                    </td>
                    <td
                      className={`py-2 px-4 border-b ${
                        order.orderNo === 34 ||
                        order.orderNo === 33 ||
                        order.orderNo === 32 ||
                        order.orderNo === 31 ||
                        order.orderNo === 30 ||
                        order.orderNo === 29 ||
                        order.orderNo === 28 ||
                        order.orderNo === 27 ||
                        order.orderNo === 26 ||
                        order.orderNo === 25
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {order.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">{order.created}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-gray-500 hover:text-gray-700 mx-1">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 mx-1">
                        <i className="fas fa-print"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button className="mx-1 px-3 py-1 bg-gray-200 rounded-full">
              1
            </button>
            <button className="mx-1 px-3 py-1 bg-gray-200 rounded-full">
              2
            </button>
            <button className="mx-1 px-3 py-1 bg-gray-200 rounded-full">
              3
            </button>
            <button className="mx-1 px-3 py-1 bg-gray-200 rounded-full">
              4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPosOrders;
