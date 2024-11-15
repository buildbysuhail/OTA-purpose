import React from "react";
import { AlertCircle } from "lucide-react";
import ERPButton from "../../components/ERPComponents/erp-button";

const CustomOrderStatus = () => {
  const statuses = [
    { label: "Order Accepted", color: "bg-[#dc2626]" },
    { label: "Food Is Ready", color: "bg-[#f97316]" },
    { label: "Dispatched", color: "bg-[#3b82f6]" },
    { label: "Delivered", color: "bg-[#16a34a]" },
  ];

  return (
    <div className="h-auto mx-auto bg-[#ffffff] rounded-lg border shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b">
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-[#3b82f6] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">
                Add customized order status
              </h2>
              <p className="text-[#374151] mt-2">
                Tired of manually tracking orders in the reports? Streamline
                your operations with customized order statuses! This feature
                lets you add custom status buttons to live view and KDS order
                cards to easily keep track of each order. Stop wasting time and
                energy on manual updates and take advantage of this convenient
                solution that allows you to keep your staff up-to-date with the
                progress of their orders in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="relative flex flex-col items-center">
          {statuses.map((status, index) => (
            <div
              key={status.label}
              className="relative flex flex-col items-center pb-[1rem] last:pb-0 w-full"
            >
              {/* Status Button */}
              {/* <button
                className={`${status.color} text-[#ffffff] py-2 px-8 rounded-full text-sm font-medium`}
              >
                {status.label}
              </button> */}
              <ERPButton
                // variant="status"
                // status={{ label: status.label, color: status.color }}
                // rounded="full"
              />
              {/* // Status button usage */}
              {/* <ERPButton
                variant="status"
                status={{ label: "Active", color: "bg-[#22c55e]" }}
                rounded="full"
              /> */}
              {/* <ERPButton
                title={status.label}
                // onClick={restLanguage}
                type="button"
                // className="px-6 py-2 rounded bg-[#f3f4f6] text-[#374151] font-medium hover:bg-[#e5e7eb] transition-colors"
                className={`${status.color} text-[#ffffff] py-2 px-8 rounded-full text-sm font-medium`}
              ></ERPButton> */}
              {/* // Regular usage (unchanged) */}
              {/* <ERPButton
                variant="primary"
                title="Submit"
                // onClick={handleSubmit}
              /> */}

              {/* Vertical line and add button section */}
              {index < statuses.length - 1 && (
                <div className="relative w-full h-24">
                  {/* Vertical line */}
                  {/* <div className="absolute left-1/2 -translate-x-1/2 top-2 w-0.5 h-full bg-[#e5e7eb]" /> */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2 w-0.5 h-full border-l-2 border-dashed border-[#e5e7eb]" />

                  {/* Add button and text */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <button className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] hover:bg-[#e5e7eb] transition-colors mb-2">
                        <span className="text-xl">+</span>
                      </button>
                      <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-500 text-sm whitespace-nowrap px-2 bg-[#f3f4f6] p-1 rounded-md ">
                        Add up to 3 new status buttons here
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8 border-t pt-6">
          {/* <button className="px-6 py-2 rounded bg-[#f3f4f6] text-[#374151] font-medium hover:bg-[#e5e7eb] transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 rounded bg-[#dc2626] text-[#ffffff] font-medium hover:bg-[#b91c1c] transition-colors">
            Save
          </button> */}
          <ERPButton
            title="Cancel"
            // onClick={restLanguage}
            type="button"
            className="px-6 py-2 rounded bg-[#f3f4f6] text-[#374151] font-medium hover:bg-[#e5e7eb] transition-colors"
          ></ERPButton>

          <ERPButton
            title="Save"
            // onClick={updateLanguage}
            variant="primary"
            className="px-6 py-2 rounded bg-[#dc2626] text-[#ffffff] font-medium hover:bg-[#b91c1c] transition-colors"
            // loading={userLanguage.loading}
            // disabled={userLanguage.loading}
          ></ERPButton>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderStatus;
