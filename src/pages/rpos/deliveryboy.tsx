import React, { useState } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeliveryBoy = () => {
  const [paymentData, setPaymentData] = useState([
    {
      id: 1,
      name: "ajml",
      userName: "ajml123",
      userCode: "DB001",
      status: "Active",
      isSelected: false,
      isSettled: false,
      amountGiven: 2000,
      amountToGet: 2000,
    },
    {
      id: 2,
      name: "John",
      userName: "john456",
      userCode: "DB002",
      status: "Active",
      isSelected: false,
      isSettled: false,
      amountGiven: 3000,
      amountToGet: 3500,
    },
    {
      id: 3,
      name: "Mike",
      userName: "mike789",
      userCode: "DB003",
      status: "Inactive",
      isSelected: false,
      isSettled: false,
      amountGiven: 1500,
      amountToGet: 1800,
    },
  ]);

  const [supportPhone] = useState("+91 123456789");
  const [supportEmail] = useState("support@polosys.com");

  const handleStatusChange = (id:any) => {
    setPaymentData(
      paymentData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const handleDelete = (id:any) => {
    setPaymentData(paymentData.filter((item) => item.id !== id));
  };

  const formatPhoneNumber = (phone:any) => {
    return phone
      .split("")
      .reverse()
      .join("")
      .replace(/(\d{3})(?=\d)/, "$1 ");
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="p-0">
      <header className="flex justify-between items-center bg-white p-4 shadow-md border-t border-b">
        <h2 className="text-lg font-bold mb-0">Delivery Boy Listing</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 me-2" />
            <span>Call for support</span>
            <div>
              <span className="font-bold">
                {"+91 " + formatPhoneNumber(supportPhone.replace("+91 ", ""))}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 me-2" />
            <span>Send a mail</span>
            <span className="font-bold">{supportEmail}</span>
          </div>
          <div className="flex items-center space-x-1 p-2 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={handleClick}>
            <ArrowLeft className="w-5 h-5 me-1" />
            <span className="text-black">Back</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="p-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="w-full bg-gray-100 border-b border-gray-200">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left">User Code</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.userName}</td>
                  <td className="py-2 px-4">{item.userCode}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } py-1 px-3 rounded-full text-sm`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex items-center space-x-2">
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                      onClick={() => null}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-700 p-1 rounded hover:bg-gray-100"
                      onClick={() => handleDelete(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <button
                      className="bg-gray-100 text-gray-700 py-1 px-3 rounded border border-gray-300 hover:bg-gray-200"
                      onClick={() => handleStatusChange(item.id)}
                    >
                      {item.status === "Active" ? "Inactive" : "Active"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoy;
