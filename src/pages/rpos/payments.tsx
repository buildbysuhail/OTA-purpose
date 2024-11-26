import { t } from "i18next";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import React, { useState, useEffect, FC } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

interface Payment {
  id: number;
  deliveryBoy: string;
  amountGiven: number;
  amountToGet: number;
  isSelected: boolean;
  isSettled: boolean;
}

const Payments: FC = () => {
  const [paymentData, setPaymentData] = useState<Payment[]>([
    {
      id: 1,
      deliveryBoy: "ajml",
      amountGiven: 2000,
      amountToGet: 2000,
      isSelected: false,
      isSettled: false,
    },
    {
      id: 2,
      deliveryBoy: "john",
      amountGiven: 3000,
      amountToGet: 3500,
      isSelected: false,
      isSettled: false,
    },
  ]);

  const [supportPhone] = useState<string>("+91 123456789");
  const [supportEmail] = useState<string>("support@polosys.com");

  const handleSelection = (id: number): void => {
    setPaymentData(
      paymentData.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleSettlement = (id: number): void => {
    setPaymentData(
      paymentData.map((item) =>
        item.id === id ? { ...item, isSettled: true } : item
      )
    );
  };

  const handleFinalizeSelected = (): void => {
    setPaymentData(
      paymentData.map((item) =>
        item.isSelected ? { ...item, isSettled: true } : item
      )
    );
  };

  const formatPhoneNumber = (phone: string): string => {
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
        <h2 className="text-lg font-bold mb-0">Payments</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 me-2" />
            <span>{t("call_for_support")}</span>
            <div>
              <span className="font-bold">
                {"+91 " + formatPhoneNumber(supportPhone.replace("+91 ", ""))}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 me-2" />
            <span>{t("send_a_mail")}</span>
            <span className="font-bold">{supportEmail}</span>
          </div>
          <div className="flex items-center space-x-1 p-2 border rounded-lg cursor-pointer" onClick={handleClick} >
            <ArrowLeft className="w-5 h-5 me-1" />
            <span className="text-black">{t("back")}</span>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="border border-stone-100 rounded-lg overflow-hidden shadow-sm">
          <div className="flex justify-between items-center bg-gray-100 p-4">
            <div className="flex items-center w-1/4">
              <input
                type="checkbox"
                className="mr-4"
                onChange={() =>
                  setPaymentData(
                    paymentData.map((item) => ({
                      ...item,
                      isSelected: !item.isSelected,
                    }))
                  )
                }
                checked={paymentData.every((item) => item.isSelected)}
              />
              <span className="font-semibold">Delivery Boy</span>
            </div>
            <div className="flex w-1/2 justify-center space-x-24">
              <span className="font-semibold w-24 text-center">
                Amount Given
              </span>
              <span className="font-semibold w-24 text-center">
                Amount to Get
              </span>
            </div>
            <div className="w-1/4 flex justify-end">
              <button
                className="bg-[#dc2626] text-white px-4 py-2 rounded rounded-md"
                onClick={handleFinalizeSelected}
              >
                Finalized Amount Given
              </button>
            </div>
          </div>
          {paymentData.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border-t"
            >
              <div className="flex items-center w-1/4">
                <input
                  type="checkbox"
                  className="mr-4"
                  checked={item.isSelected}
                  onChange={() => handleSelection(item.id)}
                  disabled={item.isSettled}
                />
                <span>{item.deliveryBoy}</span>
              </div>
              <div className="flex w-1/2 justify-center space-x-24">
                <div className="w-24 text-center">
                  <input
                    type="number"
                    // value={item.amountGiven}
                    placeholder={item.amountGiven.toString()}
                    className="border rounded p-2 w-full bg-gray-100 text-center rounded-md"
                    // readOnly
                  />
                </div>
                {/* <div className="w-24 text-center">
                  <span className="inline-block w-full text-center">
                    {item.amountToGet}
                  </span>
                </div> */}
                <div className="w-24 text-center flex justify-center items-center">
                  <span className="inline-block w-full text-center">
                    {item.amountToGet}
                  </span>
                </div>
              </div>
              <div className="w-1/4 flex justify-end">
                <button
                  className={`border rounded rounded-md px-4 py-2 ${
                    item.isSettled
                      ? "bg-[#dcfce7] text-[#15803d] border-[#22c55e]"
                      : "border-gray-500"
                  }`}
                  onClick={() => handleSettlement(item.id)}
                  disabled={item.isSettled}
                >
                  {/* {item.isSettled ? 'Settled' : 'Settlement'} */}
                  Settlement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
