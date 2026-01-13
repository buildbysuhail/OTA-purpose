import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import PosComponents from "./pos-sections";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import CounterShift from "./counter-shift";
import ERPProductSearch from "../../../../../components/ERPComponents/erp-searchbox";
import {
  formStateHandleFieldChangeKeysOnly,
  formStateHandleFieldChange,
  formStateTransactionMasterHandleFieldChange,
} from "../../reducer";
import Urls from "../../../../../redux/urls";
import { merge } from "lodash";
import { initialUserConfig } from "../../transaction-type-data";
import PrivilegeCardEntry from "../privilege-card-entry";
import GiftOrCashCouponSelector from "../giftOrCash-Coupon-Selector";
import { Link } from "react-router-dom";
import { inputBox } from "../../../../../redux/slices/app/types";
import PosKeyBoard from "./pos-keyboard";
import PosPaymentSection from "./pos-payment-section";

interface TransactionHeaderProps {
  formState: any;
  dispatch: any;
}

const PosSideSection: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
}) => {
  const { t } = useTranslation("transaction");
  const [selectedBtn, setSelectedBtn] = useState("main");
  const [chooseSubBtn, setChooseSubBtn] = useState("");
  const [chooseSubBtnModals, setChooseSubBtnModals] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  // Need to manage this perfectly, now it is added just for testing
  const handleKeyPress = (key: string) => {
    switch (key) {
      case "Back":
        // Remove the last character
        setSearchText((prev) => prev.slice(0, -1));
        break;
      case "Clear":
        // Clear the entire text
        setSearchText("");
        break;
      case "Space":
        // Add a space
        setSearchText((prev) => prev + " ");
        break;
      case "Enter":
        // Optional: Perform a search or submit action here
        console.log("Search initiated for:", searchText);
        // For this example, we won't clear the text on Enter
        break;
      case "Small":
        // Optional: Implement lowercase toggle logic here
        console.log("Toggle case requested");
        // For now, we will treat it as a non-printing key
        break;
      case "]":
        // Treat as a normal key press if it's meant to be input
        setSearchText((prev) => prev + key);
        break;
      // Handle all other character keys
      default:
        // Append the clicked key's value
        setSearchText((prev) => prev + key);
        break;
    }
  };

  // ----------------- Quantity and Barcode section --------------------------
  const QtyBarcodeControl = () => {
    return (
      <div className="flex items-center gap-4 px-3 py-2 rounded-sm mx-1">
        {/* Qty Section */}
        <div className="flex gap-2 flex-col">
          <label className="text-xs font-medium text-gray-600">
            {t("quantity")}
          </label>
          <div className="flex gap-1">
            <ERPButton title="-" variant="primary" className="px-4 h-8" />

            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
              })}
              id={t("quantity")}
              type="number"
              customSize="customize"
              value={1}
              noLabel
              className="w-14 text-center"
            />

            <ERPButton title="+" variant="primary" className="px-4 h-8" />
          </div>
        </div>

        {/* Barcode Section */}
        <div className="flex flex-col flex-1">
          <label className="text-xs font-medium text-gray-600">
            {t("barcode")}
          </label>
          <ERPInput
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
            id={t("barcode")}
            type="number"
            noLabel
            customSize="customize"
            className="w-full"
            value={1}
          />
        </div>
      </div>
    );
  };

  // ----------------- Temp keyboard section --------------------------
  //   const PosNumericKeypad = () => {
  //   const baseBtn =
  //     "flex items-center justify-center text-[22px] font-semibold rounded-md select-none";

  //   return (
  //     <div className="grid grid-cols-4 gap-2 p-2 bg-[#f7f7f7] shadow-lg w-full max-w-sm">

  //       {/* Row 1 */}
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>7</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>8</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>9</button>
  //       <button className={`${baseBtn} bg-[#616161] text-white h-14`}>KB</button>

  //       {/* Row 2 */}
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>4</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>5</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>6</button>
  //       <button className={`${baseBtn} bg-[#616161] text-white h-14`}>Clear</button>

  //       {/* Row 3 */}
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>1</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>2</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>3</button>
  //       <button className={`${baseBtn} bg-[#616161] text-white h-14`}>Enter</button>

  //       {/* Row 4 */}
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14 col-span-2`}>0</button>
  //       <button className={`${baseBtn} bg-[#2d2d2d] text-white h-14`}>.</button>
  //       <button className={`${baseBtn} bg-[#616161] text-white h-14`}>←</button>

  //     </div>
  //   );
  // };

  const PosNumericKeypad = () => {
    const baseBtn =
      "flex items-center justify-center text-[22px] font-semibold rounded-md select-none border border-gray-300 shadow-sm";

    return (
      <div className="grid grid-cols-4 gap-2 px-1 bg-white border w-full">
        {/* Row 1 */}
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>7</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>8</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>9</button>
        <button
          className={`${baseBtn} bg-gray-200 text-gray-800 h-12 text-base`}
        >
          KB
        </button>

        {/* Row 2 */}
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>4</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>5</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>6</button>
        <button
          className={`${baseBtn} bg-gray-200 text-gray-800 h-12 text-base`}
        >
          Clear
        </button>

        {/* Row 3 */}
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>1</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>2</button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>3</button>
        <button
          className={`${baseBtn} bg-gray-200 text-gray-800 h-12 text-base`}
        >
          Enter
        </button>

        {/* Row 4 */}
        <button className={`${baseBtn} bg-white text-gray-900 h-12 col-span-2`}>
          0
        </button>
        <button className={`${baseBtn} bg-white text-gray-900 h-12`}>.</button>
        <button className={`${baseBtn} bg-gray-200 text-gray-800 h-12`}>
          ←
        </button>
      </div>
    );
  };

  // ------------------ Privilege card section for india - Not using right now here ------------------------
  const PrivilegeCard = () => {
    return (
      <div className="flex items-center gap-2 bg-gray-100 p-2">
        <ERPInput
          id="privilegeCard"
          type="number"
          label="privilege_card_no"
          value={0}
          labelDirection="horizontal"
        />
      </div>
    );
  };

  // ----------------- Discount section --------------------------
  const DiscountSection = () => {
    return (
      <div className="bg-gray-100 p-4 rounded-md flex flex-col h-full">
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("total")}</label>
          <ERPInput
            id="total"
            type="number"
            noLabel={true}
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("discount")}</label>

          <div className="flex gap-1 w-full">
            <ERPInput
              id="billDiscountAmount"
              type="number"
              noLabel={true}
              placeholder={t("amount")}
              className="flex-1"
              value={0.0}
              customSize="customize"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
              })}
            />
            <ERPInput
              id="billDiscountPercentage"
              type="number"
              noLabel={true}
              placeholder="%"
              className="w-20"
              value={0.0}
              customSize="customize"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
              })}
            />
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("balance")}</label>
          <ERPInput
            id="balance"
            type="number"
            noLabel={true}
            readOnly
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>
        <ERPButton
          title={t("apply")}
          variant="primary"
          className="w-full mt-2"
        />
      </div>
    );
  };

  // ----------------- Final tick button section --------------------------
  const FinalVerifySection = () => {
    const inputClass = "w-full";

    return (
      <div className="flex flex-col gap-0.5 bg-gray-100 p-3 rounded-md h-full">
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm text-gray-700">{t("total")}</label>
          <ERPInput
            id="total"
            type="number"
            value={0}
            noLabel
            // className={inputClass}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm text-gray-700">{t("cash_rcvd")}</label>

          <div className="flex gap-1 items-center">
            <ERPButton title="Add" variant="primary" className="h-8 w-12" />
            <ERPInput
              id="cashRcvd"
              type="number"
              value={0}
              noLabel
              // className={inputClass}
              customSize="customize"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="text-sm text-gray-700">Balance</label>
          <ERPInput
            id="balance"
            type="number"
            value={0}
            readOnly
            noLabel
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>

        <ERPButton title="Apply" variant="primary" className="mt-2" />
      </div>
    );
  };

  // ---------------- Credit note section ------------------

  const CreditNoteSection = () => {
    return (
      <div className="bg-gray-100 py-4 px-6 rounded-md flex flex-col h-full">
        {/* Total */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("total")}</label>
          <ERPInput
            id="total"
            type="number"
            noLabel
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>

        {/* Credit Amount */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("credit_amt")}</label>
          <ERPInput
            id="creditAmount"
            type="number"
            noLabel
            placeholder={t("credit_amt")}
            // className="w-full"
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>

        {/* SR Voucher No + Add Button */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700 w-[120px]">
            {t("sr_vchr_no")}
          </label>

          <div className="flex gap-1 items-center">
            <ERPInput
              id="srVoucherNo"
              type="number"
              noLabel
              readOnly
              value={0.0}
              className="flex-1"
              customSize="customize"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
              })}
            />

            <ERPButton
              title={t("add")}
              variant="primary"
              className="min-w-[24px] h-8"
            />
          </div>
        </div>

        {/* Balance */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <label className="font-medium text-gray-700">{t("balance")}</label>
          <ERPInput
            id="balance"
            type="number"
            noLabel
            readOnly
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
        </div>

        {/* Apply Button */}
        <ERPButton
          title={t("apply")}
          variant="primary"
          className="w-full mt-2"
        />
      </div>
    );
  };

  const gccProductSearchRef = useRef<HTMLInputElement>(null);
  const productGroupRef = useRef<HTMLInputElement>(null);
  const customStyle = {
    ...formState.userConfig?.inputBoxStyle,
    inputSize: "customize",
    inputHeight: 2,
  } as inputBox;

  const ItemLookupSection = () => {
    return (
      <div className="flex flex-row gap-0.5 px-3 rounded-md h-fit">
        <div className="w-[90%] ">
          <ERPProductSearch
            //  disabled={isView}
            showInputSymbol={false}
            closeIfNodata={false}
            noLabel={true}
            label="Product Name"
            placeholder="Product Name"
            customStyle={customStyle}
            className="w-[95%]"
            showCheckBox={false}
            //  value={getFieldProps("product.productName").value}
            // value={searchText}
            //  onChange={(e) => handleFieldChange({
            //    "product.productName": e.target.value
            //  })}
            productDataUrl={Urls.load_product_details}
            //  onProductSelected={(data: any) => {
            //    handleFieldChange({
            //      "product.productName": data.productName
            //    });
            //    setTimeout(() => {
            //      gccProductSearchRef.current?.focus();
            //    }, 100);
            //  }}
            ref={gccProductSearchRef}
            onEnterKeyDown={() => {
              productGroupRef?.current?.focus();
            }}
            isMainPurchaseGrid={false}  // Change based on the use
          />
        </div>
        <div className="w-[10%] flex items-center">
          <ERPButton
            onClick={() => setKeyboardOpen((prev: any) => !prev)}
            title={t("kb")}
            variant="secondary"
            className="h-8 mb-0"
          />
        </div>
      </div>
    );
  };

  const DefaultSection = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-2 bg-white border rounded-lg p-6 shadow-sm h-full">
        <h1 className="text-xl font-semibold text-gray-700">Polosys POS</h1>
        <p className="text-sm text-gray-500 tracking-wide">www.polosys.com</p>
      </div>
    );
  };

  // ----------------- Lock Section ---------------------
  const LockSection = () => {
    return (
      <div className="flex flex-col gap-3 p-3 rounded-md items-center justify-center">
        <h3>
          {t("user:")}
          {t("admin_india")}
        </h3>
        <div className="flex flex-col items-start">
          <label>{t("unlock_polosys_erp")}</label>
          <div className="flex gap-2 w-full flex-row items-center">
            <ERPInput
              id="unlock_polosys_erp"
              type="number"
              className="flex-1"
              noLabel
              customSize="customize"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
              })}
            />
            <ERPButton title={t("unlock")} variant="primary" className=" h-8" />
          </div>
        </div>
      </div>
    );
  };

  // Privilege modal close, need to make this a component in this instead of modal
  const handlePrivilegeCardClose = () => {
    dispatch(
      formStateHandleFieldChange({
        fields: { privilegeCardOpen: false },
      })
    );
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 200; // Move left
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 200; // Move right
  };

  return (
    <div className="w-full h-full flex p-1">
      {/* Screen section */}
      <div className="w-[80%] h-full flex flex-col *shrink">
        {/* Top Bill Tabs */}
        <div className="relative group flex items-center w-full h-16 my-1">
          <button
            onClick={scrollLeft}
            className="absolute left-0 bg-gray-200 text-black w-8 h-12 rounded-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex flex-1 mx-10 gap-2 overflow-x-auto no-scrollbar scroll-smooth h-full items-center"
          >
            {[1, 2, 3, 4, 5, 6,8,9,10,11].map((billNumber) => (
              <button
                key={billNumber}
                className="bg-primary text-white text-lg font-semibold min-w-[22%] h-16 rounded-sm shadow-sm flex items-center justify-center"
              >
                {billNumber}
              </button>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 bg-gray-200 text-black w-8 h-12 rounded-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Middle Working Area */}
        <div className="w-full h-[40%] ">
          {chooseSubBtn === "settlement" && (
            <PosComponents formState={formState} dispatch={dispatch} />
            // The below one is for cash, upi, card, coupons section, need to set where it place
            // <PosPaymentSection formState={formState} dispatch={dispatch}/> 
          )}
          {chooseSubBtn === "finalVerify" && <FinalVerifySection />}
          {chooseSubBtn === "discount" && <DiscountSection />}
          {chooseSubBtn === "creditNote" && <CreditNoteSection />}
          {chooseSubBtn === "itemLookUp" && <ItemLookupSection />}
          {chooseSubBtn === "" && <DefaultSection />}
          {chooseSubBtnModals === "privilegeCard" && (
            <PrivilegeCardEntry
              isOpen={formState.privilegeCardOpen}
              formState={formState}
              onClose={handlePrivilegeCardClose}
              t={t}
              data={""}
            />
          )}
        </div>
        <div className="w-full h-[10%] flex items-center justify-center">
          <QtyBarcodeControl />
        </div>
        <div className="w-full h-[25%]">
          <PosNumericKeypad />
        </div>
      </div>

      {/* Menubar section */}
      <div className="w-[20%] h-full flex flex-col pt-1">
        {/* Main Buttons */}
        <div className="flex flex-row px-1">
          <button
            className="flex flex-col items-center px-2 py-2 w-1/2 border rounded bg-gray-200 border-gray-300 text-xs"
            onClick={() => setSelectedBtn("main")}
          >
            {t("main")}
          </button>
          <button
            className="flex flex-col items-center px-2 py-2 w-1/2 border rounded bg-gray-200 border-gray-300 text-xs"
            onClick={() => setSelectedBtn("more")}
          >
            {t("more")}
          </button>
          {/* <ERPButton
            title={t("main")}
            variant="secondary"
            className="w-1/2 h-12"
            onClick={() => setSelectedBtn("main")}
          />
          <ERPButton
            title={t("more")}
            variant="secondary"
            className="w-1/2 h-12"
            onClick={() => setSelectedBtn("more")}
          /> */}
        </div>

        {/* Sub Button List */}
        {selectedBtn === "main" && (
          <div className="flex flex-col gap-0.5 text-sm p-1">
            {/* <ERPButton
              title={t("item_lookup")}
              variant="primary"
              className="overflow-hidden"
              onClick={() => setChooseSubBtn("itemLookUp")}
            /> */}
            <button
              onClick={() => setChooseSubBtn("itemLookUp")}
              className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs"
            >
              {t("item_lookup")}
            </button>
            {/* <ERPButton title={t("print_last_bill")} variant="primary" />  */}
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("print_last_bill")}
            </button>
            {/* <ERPButton title={t("void_item")} variant="primary" />
            <ERPButton title={t("cancel")} variant="primary" />
            <ERPButton title={t("edit")} variant="primary" /> */}
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("void_item")}
            </button>
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("cancel")}
            </button>
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("edit")}
            </button>
            <button
              onClick={() => setChooseSubBtn("creditNote")}
              className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs"
            >
              {t("credit_note")}
            </button>
            {/* <ERPButton
              title={t("credit_note")}
              variant="primary"
              onClick={() => setChooseSubBtn("creditNote")}
            /> */}
            {/* <ERPButton
              title={t("privilege_card")}
              variant="primary"
              onClick={() => {
                setChooseSubBtn("privilegeCard");
                dispatch(
                  formStateHandleFieldChange({
                    fields: { privilegeCardOpen: true },
                  })
                );
              }}
            /> */}

            <button
              className="flex flex-col items-center py-2 border rounded bg-gray-200 border-gray-300 text-xs"
              onClick={() => {
                setChooseSubBtn("");
                setChooseSubBtnModals("privilegeCard");
                dispatch(
                  formStateHandleFieldChange({
                    fields: { privilegeCardOpen: true },
                  })
                );
              }}
            >
              {t("privilege_card")}
            </button>
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("qrpay/_card")}
            </button>
            {/* <ERPButton title={t("qrpay/_card")} variant="primary" /> */}
            {/* <ERPButton
              title={t("qty+")}
              variant="primary"
              onClick={() => setChooseSubBtn2("qty")}
            /> */}
            <button className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs">
              {t("qty+")}
            </button>
            <button
              className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs"
              onClick={() => setChooseSubBtn("discount")}
            >
              {t("discount")}
            </button>
            {/* <ERPButton
              title={t("discount")}
              variant="primary"
              onClick={() => setChooseSubBtn("discount")}
            /> */}
            <button
              onClick={() => setChooseSubBtn("settlement")}
              className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs"
            >
              {t("settlement")}
            </button>
            {/* <ERPButton
              title={t("settlement")}
              variant="primary"
              onClick={() => setChooseSubBtn("settlement")}
            /> */}
            <button
              className="flex flex-col items-center px-2 py-2 border rounded bg-gray-200 border-gray-300 text-xs"
              onClick={() => setChooseSubBtn("finalVerify")}
            >
              <Check size={20} />
            </button>
          </div>
        )}
        {selectedBtn === "more" && (
          <div className="flex flex-col gap-0.5 text-sm p-1">
            <ERPButton
              title={t("close")}
              variant="primary"
              className=" text-sm"
            />
            <ERPButton
              title={t("lock")}
              variant="primary"
              onClick={() => setChooseSubBtnModals("lock")}
            />
            <ERPButton title={t("refresh")} variant="primary" />
            <ERPButton title={t("open_cash")} variant="primary" />
            <ERPButton
              title={t("sales_report")}
              variant="primary"
              className="text-sm"
            />
            <ERPButton title={t("pending_so")} variant="primary" />
            <ERPButton title={t("reprint")} variant="primary" />
            <ERPButton title={t("order")} variant="primary" />
            <ERPButton
              title={t("coupon")}
              variant="primary"
              onClick={() => setChooseSubBtnModals("coupons")}
            />
            <ERPButton title={t("sync")} variant="primary" />
            <ERPButton title={t("next_customer")} variant="primary" />
            <ERPButton title={t("load")} variant="primary" />
            <ERPButton
              title={t("shift_open/cash")}
              variant="primary"
              // onClick={() => setChooseSubBtnModals("shift")}
            />
            <ERPButton
              title={t("privilege_card")}
              variant="primary"
              onClick={() => {
                setChooseSubBtn("");
                setChooseSubBtnModals("privilegeCard");
                dispatch(
                  formStateHandleFieldChange({
                    fields: { privilegeCardOpen: true },
                  })
                );
              }}
            />

            <ERPButton title={t("show_total")} variant="primary" />
            <ERPButton title={t("return")} variant="primary" />
          </div>
        )}
      </div>
      {keyboardOpen && (
        <PosKeyBoard
          formState={formState}
          dispatch={dispatch}
          onKeyPress={handleKeyPress}
        />
      )}
      <ERPModal
        isOpen={chooseSubBtnModals === "lock" ? true : false}
        title={t("lock_polosys_erp")}
        width={280}
        height={50}
        isForm={true}
        closeModal={() => setChooseSubBtnModals("")}
        content={<LockSection />}
      />
      <ERPModal
        isOpen={chooseSubBtnModals === "coupons" ? true : false}
        title={t("gift/cash_coupon_selector")}
        width={700}
        height={100}
        isForm={true}
        closeModal={() => setChooseSubBtnModals("")}
        content={
          <GiftOrCashCouponSelector
            closeModal={() => setChooseSubBtnModals("")}
            t={t}
            formState={formState}
          />
        }
      />
      {/* <ERPModal
        isOpen={chooseSubBtnModals === "shift" ? true : false}
        title={t("counter_shift")}
        width={300}
        height={130}
        isForm={true}
        closeModal={() => handleCloseModal()}
        content={<CounterShift formState={formState} dispatch={dispatch} />}
      /> */}
    </div>
  );
};

export default PosSideSection;
