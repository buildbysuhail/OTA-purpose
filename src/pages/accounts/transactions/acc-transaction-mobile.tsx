import React, { useCallback, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import ERPPreviousUrlButton from "../../../components/ERPComponents/erp-previous-uirl-button";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import {
  AccountGroupData,
  initialAccountGroup,
} from "../masters/account-groups/account-group-types";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
// import { t } from "i18next";
import { toggleAccountGroupPopup } from "../../../redux/slices/popup-reducer";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useDispatch } from "react-redux";
import {
  ApplicationMainSettings,
  ApplicationMainSettingsInitialState,
} from "../../settings/system/application-settings-types";

interface BilledItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  cashacc?: string;
  discount: number;
  tax: number;
}

interface FormData {
  itemName: string;
  quantity: string;
  cashacc?: string;
  unit: string;
  rate: string;
  taxOption: "Without Tax" | "With Tax";
}

const AccTransactionMobile = () => {
  const [activeButton, setActiveButton] = useState("credit");
  const [items, setItems] = useState<BilledItem[]>([
    { id: 1, name: "Apple", price: 100, quantity: 2, discount: 0, tax: 0 },
    { id: 2, name: "Banana", price: 50, quantity: 3, discount: 0, tax: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  // const [invoiceNo, setInvoiceNo] = useState<number>(3); // Default Invoice No.
  // const [date, setDate] = useState<string>("2024-09-23"); // Default Date

  const addItem = () => {
    const newItem: BilledItem = {
      id: items.length + 1,
      name: "New Item",
      price: 0,
      quantity: 1,
      discount: 0,
      tax: 0,
    };
    setItems([...items, newItem]);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    quantity: "",
    unit: "",
    rate: "",
    taxOption: "Without Tax",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleFieldChange = (keys: any, value: any) => {
  //   setFormData((prevSettings = {} as FormData) => ({
  //     ...prevSettings,
  //     [keys]: value ?? "",
  //   }));
  // };
  const handleFieldChange = (settingName: any, value: any) => {
    setSettings((prevSettings = {} as ApplicationMainSettings) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };

  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef && !popupRef.contains(event.target as Node)) {
        setShowPopup(false);
        setIsHovered(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const [showTotalsPopup, setShowTotalsPopup] = useState(false); // State for showing totals popup

  // const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to a server or perform other actions
  };

  const [isPageVisible, setIsPageVisible] = useState(true);

  const closePage = () => {
    setIsPageVisible(false);
  };

  if (!isPageVisible) {
    return null; // Don't render anything if the page is hidden
  }

  const [showInputBox, setShowInputBox] = useState(false);

  const [settings, setSettings] = useState<ApplicationMainSettings>(
    ApplicationMainSettingsInitialState
  );

  return (
    <div className="top-0 left-0 z-50 fixed flex flex-col bg-gray-100 w-screen h-screen max-h-full font-sans overflow-scroll">
      {/* Sale Header */}
      <div className="flex items-center bg-white shadow-sm p-3 border-b-2 fixed top-0 left-0 w-full z-50">
        <ERPPreviousUrlButton></ERPPreviousUrlButton>
        <h1 className="flex-grow font-semibold text-[18px] text-zinc-800">
          Cash payment
        </h1>
        <i className="ri-settings-3-line" style={{ fontSize: "23px" }}></i>
      </div>
      {/* Scrollable Content */}
      <div className="flex flex-col mt-[58px] w-full overflow-scroll"></div>
      <div className="flex items-center space-x-4 bg-white mb-0 p-0 rounded-none shadow-md text-gray-600">
        <div className="flex-1  px-2  rounded-md">
          <label className="block mb-0 font-medium text-center text-sm text-gray-700">
            Voucher No
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue="3"
              className="bg-transparent px-3 py-2 w-full text-center border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[10px]"
            />
            {/* <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i> */}
          </div>
        </div>

        {/* Centered divider */}
        <div className="border-gray-300 border-l h-12"></div>

        <div className="flex-1  px-2 rounded-md">
          <label className="block mb-0 font-medium text-center text-sm text-gray-700">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="bg-transparent px-3 py-2 w-full text-center border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[10px]"
            />
          </div>
        </div>
      </div>

      <div className="pt-1 pb-[54px]">
        <div className="bg-white mb-0 p-4 rounded-lg text-zinc-800 ">
          {/* <div className="mb-4">
            <label
              htmlFor="cashacc"
              className="block font-medium text-gray-700 text-sm"
            >
              Cash Account
            </label>
            <select
              id="cashacc"
              name="cashacc"
              value={formData.cashacc}
              onChange={handleInputChange}
              className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
            >
              <option value="">Select Cash Account</option>
              <option value="cash">cash</option>
              <option value="bank">bank</option>
              <option value="upi">upi</option>
            </select>
          </div> */}
          <div className="mb-1">
            <ERPDataCombobox
              id="cashacc"
              field={{
                id: "cashacc",
                // required: true,
                getListUrl: Urls.data_CashLedgers,
                valueKey: "id",
                labelKey: "name",
              }}
              data={formData}
              value={formData?.cashacc}
              onChangeData={(data) =>
                handleFieldChange("cashacc", data.cashacc)
              }
              // label={t("cost_center")}
              label="Cash Account"
            />
          </div>
          {/* <div className="mb-4">
            <input
              type="text"
              placeholder="Remark"
              // className="bg-white p-2 border rounded w-full"
              className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
            />
          </div> */}
          <div className="mb-1">
            <ERPInput
              id="autoUpdateReleaseUpTo"
              label="Remark"
              type="text"
              data={settings}
              value={settings?.autoUpdateReleaseUpTo}
              onChangeData={(data) =>
                handleFieldChange(
                  "autoUpdateReleaseUpTo",
                  data.autoUpdateReleaseUpTo
                )
              }
            />
          </div>

          <div className="flex justify-center mb-2">
            <button
              className="w-full border border-gray-300 px-4 py-2  text-gray-600 focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200  focus:border-b-0 "
              onClick={() => setShowInputBox(!showInputBox)}
            >
              {showInputBox ? "View Less" : "View More"}
            </button>
          </div>
          {showInputBox && (
            // <div className="flex justify-center">
            <div>
              {/* <div className="mb-1">
                <input
                  type="text"
                  placeholder="Ref No"
                  // className="bg-white p-2 border rounded w-full"
                  className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                />
              </div> */}
              <div className="mb-1">
                <ERPInput
                  id="autoUpdateReleaseUpTo"
                  label="Ref No"
                  type="text"
                  data={settings}
                  value={settings?.autoUpdateReleaseUpTo}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "autoUpdateReleaseUpTo",
                      data.autoUpdateReleaseUpTo
                    )
                  }
                />
              </div>
              <div className="mb-1">
                <label
                  className="block font-medium text-gray-700 text-sm"
                  htmlFor=""
                >
                  Ref Date
                </label>
                <input
                  type="date"
                  placeholder="Ref Date"
                  // className="bg-white p-2 border rounded w-full"
                  className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                />
              </div>
              {/* <div className="mb-4">
                <label
                  htmlFor="cashacc"
                  className="block font-medium text-gray-700 text-sm"
                >
                  Paid By
                </label>
                <select
                  id="cashacc"
                  name="cashacc"
                  value={formData.cashacc}
                  onChange={handleInputChange}
                  className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full"
                >
                  <option value="">Select Paid By</option>
                  <option value="ajmal">ajmal</option>
                  <option value="vajid">vajid</option>
                  <option value="nizam">nizam</option>
                  <option value="safvan">safvan</option>
                  <option value="sreeram">sreeram</option>
                  <option value="javad">javad</option>
                </select>
              </div> */}
              <div className="mb-1">
                <ERPDataCombobox
                  id="cashacc"
                  field={{
                    id: "cashacc",
                    // required: true,
                    getListUrl: Urls.data_employees,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  data={formData}
                  value={formData?.cashacc}
                  onChangeData={(data) =>
                    handleFieldChange("cashacc", data.cashacc)
                  }
                  // label={t("cost_center")}
                  label="Paid By"
                />
              </div>
              {/* <div className="mb-1">
                <input
                  type="text"
                  placeholder="Notes"
                  // className="bg-white p-2 border rounded w-full"
                  className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                />
              </div> */}
              <div className="mb-2">
                <ERPInput
                  id="autoUpdateReleaseUpTo"
                  label="Notes"
                  type="text"
                  data={settings}
                  value={settings?.autoUpdateReleaseUpTo}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "autoUpdateReleaseUpTo",
                      data.autoUpdateReleaseUpTo
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* Billed Items Section */}
          <div className="bg-custom-blue mb-1 p-1 rounded-lg text-white">
            <h2 className="font-light text-sm">Billed Items</h2>
          </div>
          <div className="pt-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#f3f3f3] shadow-md mb-3 p-2 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  {/* <span className="text-gray-500 text-sm">#{item.id}</span> */}
                  {/* <span className="font-bold text-sm">
                    ₹ {item.price * item.quantity}
                  </span> */}
                </div>
                <h6 className="mb-1 font-bold text-[20px]">{item.name}</h6>
                <p className="mb-1 text-gray text-sm">
                  Item Subtotal: {item.quantity} x ₹{item.price} = ₹
                  {item.price * item.quantity}
                </p>
                <p className="mb-1 text-yellow info">
                  Discount (%): {item.discount}
                </p>
                <p className="text-gray-600 text-sm">Tax: {item.tax}%</p>
              </div>
            ))}

            {/* Total Summary */}
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
              <div className="flex justify-between mb-2 text-gray-600 text-sm">
                <span>
                  Total Disc:{" "}
                  {items
                    .reduce((total, item) => total + item.discount, 0)
                    .toFixed(1)}
                </span>
                <span>
                  Total Tax Amt:{" "}
                  {items
                    .reduce((total, item) => total + item.tax, 0)
                    .toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <span>Total Qty: {calculateTotalQuantity().toFixed(1)}</span>
                <span>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Add Items Button */}
            <button
              // onClick={addItem}
              onClick={() => setIsOpen(true)}
              className="flex justify-center items-center border-2 border-gray-400 bg-white mb-4 p-2 rounded w-full text-blue-500"
            >
              {/* <Plus className="mr-2 text-blue-500" size={16} /> Add Items{" "} */}
              <i
                className="ri-add-circle-fill pr-2"
                style={{ fontSize: "18px" }}
              ></i>
              <div
                className="mr-2 text-amber-700"
                // size={16}
              >
                {" "}
                Add Items{" "}
              </div>
              <div className="pl-1 text-gray-500">(Optional)</div>
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex bg-white mt-auto p-2 fixed bottom-0 w-full z-10 pr-[29px]">
            <ERPButton
              title="Save & New"
              onClick={() => {
                // deleteWorkspacePopup({isOpen: false});
              }}
              variant="primary"
              className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
            ></ERPButton>

            {/* <button className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white">
              Save
            </button> */}
            <ERPButton
              title="Save"
              onClick={() => {
                // deleteWorkspacePopup({isOpen: false});
              }}
              variant="primary"
              className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
            ></ERPButton>
          </div>
          {/* ======= */}
          <div>
            {/* The ERPModal component */}
            <ERPModal
              isForm={true}
              isOpen={isOpen}
              closeButton="LeftArrow"
              hasSubmit={false}
              closeTitle="Close"
              title="Add Ledger"
              width="w-full"
              isFullHeight={true}
              closeModal={() => setIsOpen(false)}
              content={
                <div
                  className="flex flex-col gap-0 px-0 py-0 pb-[130px] h-screen overflow-y-auto   "
                  style={{}} // Inline styles for full screen
                >
                  <div className=" max-w-md flex-grow h-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-gray-600"></div>

                      <div className="text-gray-600"></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        {/* <div className="mb-1">
                          <label
                            className="block font-medium text-gray-700 text-sm"
                            htmlFor=""
                          >
                            Ledger Code
                          </label>
                          <input
                            type="text"
                            placeholder="Ledger Code"
                            // className="bg-white p-2 border rounded w-full"
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                          />
                        </div> */}
                        <div className="mb-4">
                          <ERPInput
                            id="autoUpdateReleaseUpTo"
                            label="Ledger Code"
                            type="text"
                            data={settings}
                            value={settings?.autoUpdateReleaseUpTo}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "autoUpdateReleaseUpTo",
                                data.autoUpdateReleaseUpTo
                              )
                            }
                          />
                        </div>
                        <div className="mb-1">
                          <ERPDataCombobox
                            id="cashacc"
                            field={{
                              id: "cashacc",
                              // required: true,
                              getListUrl: Urls.data_acc_ledgers,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            data={formData}
                            value={formData?.cashacc}
                            onChangeData={(data) =>
                              handleFieldChange("cashacc", data.cashacc)
                            }
                            // label={t("cost_center")}
                            label="Ledger"
                          />
                        </div>
                        {/* <div className="mb-1">
                          <label
                            className="block font-medium text-gray-700 text-sm"
                            htmlFor=""
                          >
                            Amount
                          </label>
                          <input
                            type="number"
                            placeholder="Amount"
                            // className="bg-white p-2 border rounded w-full"
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                          />
                        </div> */}
                        <div className="mb-4">
                          <ERPInput
                            id="autoUpdateReleaseUpTo"
                            label="Amount"
                            type="number"
                            data={settings}
                            value={settings?.autoUpdateReleaseUpTo}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "autoUpdateReleaseUpTo",
                                data.autoUpdateReleaseUpTo
                              )
                            }
                          />
                        </div>
                        {/* <div className="mb-1">
                          <label
                            className="block font-medium text-gray-700 text-sm"
                            htmlFor=""
                          >
                            Narration
                          </label>
                          <input
                            type="text"
                            placeholder="Narration"
                            // className="bg-white p-2 border rounded w-full"
                            className="block border-2 border-gray-300 focus:border-indigo-300 bg-white focus:ring-opacity-50 shadow-sm mt-1 p-2 rounded-md focus:ring focus:ring-indigo-200 w-full focus:border-b-0"
                          />
                        </div> */}
                        <div className="mb-4">
                          <ERPInput
                            id="autoUpdateReleaseUpTo"
                            label="Narration"
                            type="string"
                            data={settings}
                            value={settings?.autoUpdateReleaseUpTo}
                            onChangeData={(data) =>
                              handleFieldChange(
                                "autoUpdateReleaseUpTo",
                                data.autoUpdateReleaseUpTo
                              )
                            }
                          />
                        </div>

                        <div className="mb-1">
                          <ERPDataCombobox
                            id="cashacc"
                            field={{
                              id: "cashacc",
                              // required: true,
                              getListUrl: Urls.data_costcentres,
                              valueKey: "id",
                              labelKey: "name",
                            }}
                            data={formData}
                            value={formData?.cashacc}
                            onChangeData={(data) =>
                              handleFieldChange("cashacc", data.cashacc)
                            }
                            // label={t("cost_center")}
                            label="Cost Center"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* <div className=" flex space-x-4 fixed bottom-0 w-full z-10 p-2 pr-[52px]"> */}
                  <div className="flex bg-white mt-auto p-2 fixed bottom-0 w-full z-10 pr-[29px]">
                    <ERPButton
                      title="Save &amp; New"
                      onClick={() => {
                        // Handle Save & New
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
                    {/* <button
                          type="submit"
                          className="flex-1 bg-red-500 hover:bg-red-600 focus:ring-opacity-50 px-4 py-2 rounded-md focus:ring-2 focus:ring-red-500 text-white focus:outline-none"
                        >
                          Save
                        </button> */}
                    <ERPButton
                      title="Save"
                      onClick={() => {
                        // deleteWorkspacePopup({isOpen: false});
                      }}
                      variant="primary"
                      className="flex-1 bg-blue-500 px-4 py-3 rounded font-semibold text-sm text-white"
                    ></ERPButton>
                  </div>

                  {/* Close button */}
                  {/* <button
                    onClick={() => setIsOpen(false)}
                    className="bg-red-500 mt-auto p-2 rounded text-white"
                  >
                    Close
                  </button> */}
                  <div>
                    {/* Totals & Taxes Popup */}
                    {/* {showTotalsPopup && ( */}
                    <div className="max-w-md mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className=" pt-1">
                        {/* Discount Section */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Discount</span>
                          <div className="flex items-center">
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                            />
                            <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                              %
                            </button>
                            <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                              ₹
                            </button>
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                          <div>
                            <span className="text-sm font-semibold">
                              Total Amount:
                            </span>
                          </div>
                          <div>
                            <span className="text-sm  font-semibold">₹</span>
                            <span className="text-sm font-semibold">
                              200.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className=" pt-1">
                        {/* Discount Section */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Discount</span>
                          <div className="flex items-center">
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                            />
                            <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                              %
                            </button>
                            <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                              ₹
                            </button>
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                          <div>
                            <span className="text-sm font-semibold">
                              Total Amount:
                            </span>
                          </div>
                          <div>
                            <span className="text-sm  font-semibold">₹</span>
                            <span className="text-sm font-semibold">
                              200.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className=" pt-1">
                        {/* Discount Section */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Discount</span>
                          <div className="flex items-center">
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                            />
                            <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                              %
                            </button>
                            <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                              ₹
                            </button>
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                          <div>
                            <span className="text-sm font-semibold">
                              Total Amount:
                            </span>
                          </div>
                          <div>
                            <span className="text-sm  font-semibold">₹</span>
                            <span className="text-sm font-semibold">
                              200.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md mx-auto mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className=" pt-1">
                        {/* Discount Section */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Discount</span>
                          <div className="flex items-center">
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-orange rounded-l-md text-orange-400 focus:outline-none w-16"
                            />
                            <button className="bg-orange mr-2 px-4 py-2 pt-[11px] pb-[10px] border border-b border-orange rounded-r-md text-orange-400 focus:outline-none">
                              %
                            </button>
                            <button className="bg-gray-400 px-4 py-2 pt-[11px] pb-[10px] border border-b border-gray-400 rounded-l-md text-orange-400 focus:outline-none">
                              ₹
                            </button>
                            <input
                              type="number"
                              defaultValue="0"
                              className=" px-4 py-2 pr-5 border border-gray-400 rounded-r-md text-orange-400 focus:outline-none w-16"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-200">
                          <div>
                            <span className="text-sm font-semibold">
                              Total Amount:
                            </span>
                          </div>
                          <div>
                            <span className="text-sm  font-semibold">₹</span>
                            <span className="text-sm font-semibold">
                              200.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccTransactionMobile;
