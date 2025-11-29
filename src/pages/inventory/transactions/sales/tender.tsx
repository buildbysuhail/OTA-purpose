import React, { useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataComboBox from "../../../../components/ERPComponents/erp-data-combobox";
import { ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { initialUserConfig } from "../transaction-type-data";
import { merge } from 'lodash';

interface TenderProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const Tender: React.FC<TenderProps> = ({ isOpen, onClose, t}) => {
  const [total, setTotal] = useState<number>(0);
  const [discEnabled, setDiscEnabled] = useState<boolean>(false);
  const [discAmount, setDiscAmount] = useState<number>(0);
  const [discPercent, setDiscPercent] = useState<number>(0);
  const [taxOnDisc, setTaxOnDisc] = useState<string>("");
  const [taxOnDiscAmount, setTaxOnDiscAmount] = useState<number>(0);
  const [netTotal, setNetTotal] = useState<number>(0);
  const [cashRcvd, setCashRcvd] = useState<number>(0);
  const [cardAmtEnabled, setCardAmtEnabled] = useState<boolean>(false);
  const [upiEnabled, setUpiEnabled] = useState<boolean>(false);
  const [cardAmt, setCardAmt] = useState<number>(0);
  const [bankAcEnabled, setBankAcEnabled] = useState<boolean>(false);
  const [bankAc, setBankAc] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const formState = useSelector((state:RootState) => state.InventoryTransaction)
  const discAmountRef = useRef<HTMLInputElement>(null);
  const taxOptions = [
    { value: "", label: "Select" },
    { value: "gst5", label: "GST 5%" },
    { value: "gst12", label: "GST 12%" },
    { value: "gst18", label: "GST 18%" },
  ];
  const bankOptions = [
    { value: "", label: "Select Bank Account" },
    { value: "bank1", label: "Bank Account 1" },
    { value: "bank2", label: "Bank Account 2" },
  ];

  useEffect(() => {
    // Calculate net total
    let calculatedNetTotal = total;
    if (discEnabled) {
      calculatedNetTotal = total - discAmount + taxOnDiscAmount;
    }
    setNetTotal(calculatedNetTotal);

    // Calculate balance
    const totalReceived = cashRcvd + (cardAmtEnabled ? cardAmt : 0);
    setBalance(totalReceived - calculatedNetTotal);
  }, [total, discEnabled, discAmount, taxOnDiscAmount, cashRcvd, cardAmtEnabled, cardAmt]);

  const handleDiscAmountChange = (value: number) => {
    setDiscAmount(value);
    if (total > 0) {
      setDiscPercent((value / total) * 100);
    }
  };

  const handleDiscPercentChange = (value: number) => {
    setDiscPercent(value);
    setDiscAmount((total * value) / 100);
  };

  const handleApply = () => {
    // Handle apply logic here
    console.log("Apply clicked", {
      total,
      discAmount,
      netTotal,
      cashRcvd,
      cardAmt,
      balance,
    });
    onClose();
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("tender")}
      width={480}
      height={470}
      content={
        <div className="flex items-center justify-center w-full">
        <div className="px-2">
          <h1 className="text-2xl font-bold text-purple-800 my-3 text-center mx-w-md">
            {t("tender").toUpperCase()}
          </h1>
          {/* Total */}
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center bg-gray-300 px-2 rounded-md">
            <label className="text-left sm:text-[10px] leading-[12px] font-bold md:text-lg  text-black">{t("total").toUpperCase()}</label>
            {/* <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:3, fontSize:30, fontColor:"255, 0, 0", borderColor: '255, 255, 255'})}
              id=""
              customSize="customize"
              type="number"
              value={total}
              noLabel={true}
              onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
            /> */}
            <div className="text-red-700 text-4xl px-2 font-bold text-right">{999.00}</div>
          </div>
          {/* ------------------------------ */}
          <div className="flex flex-col gap-1 items-start py-2 rounded-md px-2">

        {/* Checkbox Left Section */}
        <div className="flex items-start pt-1">
          <ERPCheckbox
            id="discEnabled"
            checked={discEnabled}
            label={t('disc').toUpperCase()}
            onChange={(e) => setDiscEnabled(e.target.checked)}
            labelClassName="font-semibold text-base text-gray-800"
          />
        </div>

        {/* Discount Inputs */}
        <div className="flex flex-row gap-3">

          {/* Discount Amount */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600">
              {t('discount_amount')}
            </label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 24,
                fontColor: "0, 0, 0",
                borderColor: "180, 180, 180",
                marginTop:0,
              })}
              ref={discAmountRef}
              id="discAmount"
              customSize="customize"
              type="number"
              noLabel={true}
              value={discAmount}
              onChange={(e) => handleDiscAmountChange(parseFloat(e.target.value) || 0)}
              disabled={!discEnabled}
            />
          </div>

          {/* Discount Percentage */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600">
              {t('discount_percent')}
            </label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 24,
                fontColor: "0, 0, 0",
                borderColor: "180, 180, 180",
                marginTop:0
              })}
              id="discPercent"
              customSize="customize"
              type="number"
              noLabel={true}
              value={discPercent?.toFixed(2)}
              onChange={(e) => handleDiscPercentChange(parseFloat(e.target.value) || 0)}
              disabled={!discEnabled}
            />
          </div>

        </div>
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          {/* FIELD ROW (button + input) */}
          <div className="mt-3">
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center rounded-md bg-gray-500 hover:bg-gray-600 transition text-white"
              // onClick={() => { if (applyDiscountsToItems) applyDiscountsToItems(); }}
            >
              <ChevronUp size={16} />
            </button>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600">
                {t('tax_on_disc')}
              </label>
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                  inputHeight: 2,
                  fontSize: 25,
                  fontColor: "255, 0, 0",
                  borderColor: "200, 200, 200",
                  marginTop:0,
                })}
                id="taxOnDisc"
                customSize="customize"
                type="number"
                noLabel={true}
                value={discPercent.toFixed(2)}
                onChange={(e) => handleDiscPercentChange(parseFloat(e.target.value) || 0)}
                disabled={!discEnabled}
              />
            </div>

            {/* Input Field */}
            
          </div>

      </div>


          {/* Discount Row */}
          {/* <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
            <div className="flex items-center gap-2">
              <ERPCheckbox
                id="discEnabled"
                checked={discEnabled}
                label={t('disc').toUpperCase()}
                onChange={(e) => setDiscEnabled(e.target.checked)}
                labelClassName="font-bold text-lg text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                ref={discAmountRef}
                id="discAmount"
                customSize="customize"
                type="number"
                noLabel={true}
                value={discAmount}
                onChange={(e) => handleDiscAmountChange(parseFloat(e.target.value) || 0)}
                disabled={!discEnabled}
              />
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
                id="discPercent"
                customSize="customize"
                type="number"
                noLabel={true}
                value={discPercent.toFixed(2)}
                onChange={(e) => handleDiscPercentChange(parseFloat(e.target.value) || 0)}
                disabled={!discEnabled}
              />
            </div>
          </div> */}
          {/* ------------------- */}
          

          {/* Tax on Disc */}
          {/* <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
            <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black">{t('tax_on_disc').toUpperCase()}</label>
            <div className="flex gap-2 items-center"> */}
              {/* <ERPDataComboBox
                id="taxOnDisc"
                noLabel={true}
                value={taxOnDisc}
                onChange={(value) => setTaxOnDisc(value)}
                options={taxOptions}
                disabled={!discEnabled}
              /> */}
              {/* This button component is available in footer, can use that component if needed */}
              {/* <button
                type="button"
                style={{
                  background: "#8080809c",
                  border: "none",
                  borderRadius: "6px 6px 6px 6px",
                  padding: "0px 0px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }} */}
                {/* // onClick={() => { if (applyDiscountsToItems) applyDiscountsToItems(); }}
          //       >
          //       <ChevronUp size={20} color="#fff" />
          //     </button>

          //     <ERPInput */}
          {/* //       localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:20, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
          //       id="taxOnDisc"
          //       customSize="customize"
          //       type="number"
          //       noLabel={true}
          //       value={discPercent.toFixed(2)}
          //       onChange={(e) => handleDiscPercentChange(parseFloat(e.target.value) || 0)}
          //       disabled={!discEnabled}
          //     />
          //   </div>
          // </div> */}

          {/* Net Total */}
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center px-2 bg-gray-300 rounded-md ">
            <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black ">{t('net_total').toUpperCase()}</label>
            {/* <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
              id="netTotal"
              customSize="customize"
              type="number"
              noLabel={true}
              value={netTotal.toFixed(2)}
              readOnly
            /> */}
            <div className="text-red-700 text-3xl px-2 font-bold text-right">{netTotal.toFixed(2)}</div>
          </div>

          {/* Cash Received */}
          <div className="flex flex-col my-2 p-2 rounded-md">
            <label className="text-left text-[10px] leading-[12px] font-semibold md:text-[12px] text-black">{t('cash_received').toUpperCase()}</label>
            <div className="flex gap-2 items-center">
              <ERPButton
                className="h-8 bg-[#8080809c] text-black"
                title="ADD"
              />
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:25, fontColor:"0, 0, 0", borderColor: '200, 200, 200'})}
              customSize="customize"
              id="cashRcvd"
              type="number"
              noLabel={true}
              value={cashRcvd}
              onChange={(e) => setCashRcvd(parseFloat(e.target.value) || 0)}
            />
            </div>
            <div className="flex flex-col">
            <div className="flex flex-row gap-2 mt-1">
              <ERPCheckbox
                id="cardAmtEnabled"
                label={t('bank_card')}
                checked={cardAmtEnabled}
                onChange={(e) => setCardAmtEnabled(e.target.checked)}
                labelClassName="font-bold text-lg text-black"
              />
              <ERPCheckbox
                id="upiEnabled"
                label={t('UPI')}
                checked={upiEnabled}
                onChange={(e) => setUpiEnabled(e.target.checked)}
                labelClassName="font-bold text-lg text-black"
              />
            </div>
            <div className="flex items-center">
              {/* <button className="px-2 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">
                <ChevronUp size={16} />
              </button> */}
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"0, 0, 0", borderColor: '200, 200, 200', marginTop:0})}
                customSize="customize"
                id="cardAmt"
                type="number"
                noLabel={true}
                value={cardAmt}
                onChange={(e) => setCardAmt(parseFloat(e.target.value) || 0)}
                disabled={!cardAmtEnabled}
              />
            </div>
          </div>
          </div>

          {/* Card Amount */}
          

          {/* Bank Account */}
          {/* <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
            <div className="flex items-center gap-2">
              <ERPCheckbox
                id="bankAcEnabled"
                label={t('bank_a/c')}
                checked={bankAcEnabled}
                onChange={(e) => setBankAcEnabled(e.target.checked)}
              />
            </div>
            <ERPDataComboBox
              id="bankAc"
              value={bankAc}
              onChange={(value) => setBankAc(value)}
              options={bankOptions}
              disabled={!bankAcEnabled}
              noLabel={true}
            />
          </div> */}

          {/* Balance */}
          <div className="grid grid-cols-[120px_1fr] gap-4 items-center px-2 bg-gray-300 rounded-md">
            <label className="text-left text-[10px] leading-[12px] font-bold md:text-lg text-black">{t('balance').toUpperCase()}</label>
            {/* <ERPInput
              id="balance"
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {inputHeight:2, fontSize:30, fontColor:"255, 0, 0", borderColor: '200, 200, 200'})}
              customSize="customize"
              type="number"
              noLabel={true}
              value={balance.toFixed(2)}
              readOnly
            /> */}
            <div className="text-red-700 text-3xl px-2 font-bold text-right">{balance.toFixed(2)}</div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end py-2">
            <ERPButton
              title={t("apply")}
              onClick={handleApply}
              variant="primary"
              className=""
            />
          </div>
        </div>
        </div>
      }
      
    />
  );
};

export default Tender;