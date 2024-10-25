import React, { useState } from "react";
export default function Component() {
  const [selectedMenu, setSelectedMenu] = useState("Customers");

  const menuItems = [
    {
      name: "Credit Notes",
      content:
        "Send Credit Notes: Share the credit note details with your customers and keep them informed on the amount you owe them. Also, you can choose to attach and send a PDF copy of the sales receipt along with the message.",
      smsDemo:
        "Dear valued customer, we've issued a credit note #CN001 for $50.00. This amount will be credited to your account. Find attached PDF for details. Thank you for your business!",
    },
    {
      name: "Payment Receipts",
      content:
        "Thank Customers for Prompt Payments: Send thank you messages to your customers once they've paid you. Also, you can choose to attach and send a PDF copy of the payment receipt along with the message.",
      smsDemo:
        "Thank you for your prompt payment of $500.00 for invoice #INV123. We've attached the receipt for your records. We appreciate your business!",
    },
    {
      name: "Customers",
      content:
        "To send promotional messages or customer statement to your customers, you will have to create those messages as templates and get them approved by WhatsApp.",
      smsDemo:
        "Hi John, Get 10% off on all products with ABC credit cards! Shop now and enjoy the discounts until 12 PM tomorrow.",
    },
    {
      name: "Quotes",
      content:
        "Share Quotes: Send the quote details to your customers as soon as you create the quote. Also, you can choose to attach and send a PDF copy of the along with the message.",
      smsDemo:
        "Dear customer, your requested quote #Q001 for Project X is ready. Total amount: $1,000.00. Valid for 30 days. PDF attached for your review. Let us know if you have any questions!",
    },
    {
      name: "Invoices",
      content:
        "Send Invoices: Send the invoice details to your customers as soon as you create the invoice. Also, you can choose to attach and send a PDF copy of the invoice along with the message.",
      smsDemo:
        "Invoice #INV456 for $750.00 is due on 05/15/2024. Payment details in the attached PDF. Thank you for your business!",
    },
    {
      name: "Sales Orders1",
      content:
        "Share1 Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your1 sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
    {
      name: "Sales Orders",
      content:
        "Share Sales Orders: Once you have a finalised sales order, send it to your customer via WhatsApp to share the details of the confirmed sale.",
      smsDemo:
        "Your sales order #SO789 has been confirmed. Total items: 5, Amount: $1,200.00. Estimated delivery: 7-10 business days. Thank you for choosing us!",
    },
  ];

  const WhatsAppDemo = ({ message }: { message: string; sender: string }) => (
    <div className="bg-gray p-4 rounded-lg mt-4 w-full max-w-sm">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-xs mx-auto">
        <div className="bg-green text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <i className="ti ti-chevron-left mr-2 text-[15px]"></i>
            <div className="w-8 h-8 bg-[#dee2e6] rounded-full mr-2"></div>
            <span className="font-semibold">Customer</span>
          </div>
          <div className="flex items-center">
            <i className="ti ti-phone mr-4 text-[15px]"></i>
            <i className="ti ti-video mr-4 text-[15px]"></i>
            <i className="ti ti-dots-vertical text-[15px]"></i>
          </div>
        </div>

        <div className="bg-[#dcebdc] h-[] p-4 overflow-y-auto flex flex-col justify-end">
          <div className="bg-white rounded-lg p-2 max-w-[80%] ml-auto mb-2 shadow">
            <p className="text-sm">{message}</p>
            <p className="text-right text-xs text-gray mt-1">12:00 PM</p>
          </div>
        </div>

        <div className="bg-gray px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-white rounded-full px-4 py-2 flex-grow mr-2"
            readOnly
          />
          <button className="bg-green text-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const MainContent = () => {
    const selectedItem = menuItems.find((item) => item.name === selectedMenu);

    return (
      <div className="flex flex-row min-h-screen p-6">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">{selectedMenu}</h2>
          <p className="mb-4">{selectedItem?.content}</p>
        </div>
        <div className="w-1/2">
          <WhatsAppDemo
            message={selectedItem?.smsDemo || ""}
            sender="Your Company"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[389px] bg-gray">
      <aside className="w-64 h-auto bg-white shadow overflow-y-auto rounded-lg">
        <nav className="mt-6">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center px-6 py-2 mt-4 duration-200 border-r-4 ${selectedMenu === item.name
                ? "bg-gray border-green text-green"
                : "border-transparent hover:bg-gray hover:border-gray"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedMenu(item.name);
              }}
            >
              {/* {item.icon} */}
              <span className="mx-4">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto shadow rounded-lg">
        <MainContent />
      </main>
    </div>
  );
}
