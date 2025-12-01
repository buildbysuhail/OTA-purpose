import React from "react";

import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { merge } from "lodash";
import { initialUserConfig } from "../../transaction-type-data";
import { ArrowBigDownDash } from "lucide-react";

interface TransactionHeaderProps {
  formState: any;
  dispatch: any;
}

const PosFooter: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
}) => {
  const { t } = useTranslation("transaction");
  return (
    <div className="w-full h-[240px] flex flex-col justify-between px-2 gap-1">
      {/* <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-1 items-center justify-center">
          <div>Name</div>
          <ERPInput id="round" type="text" noLabel={true} />
        </div>
        <ERPButton
          title={t("offer_achieved")}
          variant="secondary"
          className="h-6 text-black"
        />
        <div className="flex gap-1 items-center justify-center">
          <div>Name</div>
          <ERPInput id="round" type="text" noLabel={true} />
        </div>
      </div> */}
      <div className="flex flex-row w-full h-full mt-1 gap-4 justify-end">
        <div className="flex flex-col gap-2 ">
          <div className="w-full grid grid-cols-[100px_1fr] items-center justify-center">
            <label className="font-medium">{t("tax_on_disc")}</label>
            <div className="flex ">
              <ERPButton variant="secondary" className="w-8 h-8" title="" startIcon={<ArrowBigDownDash size={20} />}/>
              <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              id={t("taxOnDisc")}
              type="number"
              customSize="customize"
              value={0.00}
              noLabel
              className="w-36 text-center"
            />
            </div>
            <label className="font-medium">{t("tot_tax")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              id={t("totalTax")}
              type="number"
              customSize="customize"
              value={1}
              noLabel
              className="w-44 text-center"
            />
            <label className="font-medium">{t("round")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-44"
              customSize="customize"
              id={t("round")}
              type="number"
              value={1}
              noLabel
            />
            <label className="font-medium">{t("credit_note")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-44"
              customSize="customize"
              id="creditNote"
              type="number"
              noLabel={true}
              value={0.0}
            />
            <label className="font-medium">{t("cr.card_amount")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-44"
              customSize="customize"
              id="crCardAmount"
              type="number"
              noLabel={true}
              value={0.0}
            />
            <label className="font-medium">{t("cash_recd")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-44"
              customSize="customize"
              id="cashReceived"
              type="number"
              noLabel={true}
              value={0.0}
            />
            <ERPCheckbox
              id="printAfterSave"
              label={t("print_after_save")}
              // onChangeData={(data: any) => handleFieldChange("isDeletable", data.isDeletable)}
            />
            <ERPCheckbox
              id="isReturnItem"
              label={t("is_return_item")}
              // onChangeData={(data: any) => handleFieldChange("isDeletable", data.isDeletable)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="w-full grid grid-cols-[100px_1fr] items-center justify-center">
            <label className="font-medium">{t("coupon_amt")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-52"
              customSize="customize"
              id="couponAmount"
              type="number"
              noLabel={true}
              value={0.0}
            />
            <label className="font-medium">{t("net_amount")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 2,
                fontSize: 20,
                fontColor: "0, 0, 0",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-52"
              customSize="customize"
              id="netAmount"
              type="number"
              noLabel={true}
              value={0.0}
            />
            <label className="font-medium">{t("bill_discount")}</label>
            <div className="flex">
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                  inputHeight: 2,
                  fontSize: 20,
                  fontColor: "0, 0, 0",
                  marginTop: 0,
                  marginBottom: 0,
                })}
                className="w-24"
                customSize="customize"
                id="billDiscountPercentage"
                type="number"
                noLabel={true}
                value={0.0}
              />
              <ERPInput
                localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                  inputHeight: 2,
                  fontSize: 20,
                  fontColor: "0, 0, 0",
                  marginTop: 0,
                  marginBottom: 0,
                })}
                className="w-28"
                customSize="customize"
                id="billDiscountAmount"
                type="number"
                noLabel={true}
                value={0.0}
              />
            </div>
            <label className="font-medium">{t("grand_total")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 3,
                fontSize: 30,
                fontColor: "255, 255, 255",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-52"
              customSize="customize"
              id="grandTotal"
              type="number"
              noLabel={true}
              readOnly
              value={0.0}
            />
            <label className="font-medium">{t("balance")}</label>
            <ERPInput
              localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
                inputHeight: 3,
                fontSize: 30,
                fontColor: "255, 255, 255",
                marginTop: 0,
                marginBottom: 0,
              })}
              className="w-52"
              customSize="customize"
              id="balance"
              type="number"
              noLabel={true}
              readOnly
              value={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosFooter;
