import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";

interface OrderLookupProps {
  t: (key: string) => string;
}

const OrderLookup: React.FC<OrderLookupProps> = ({  t }) => {
  const [orderNo, setOrderNo] = useState<string>("");
  const [quotationNo, setQuotationNo] = useState<string>("");
  const [deliveryNo, setDeliveryNo] = useState<string>("");
  const [deliveryQuotNo, setDeliveryQuotNo] = useState<string>("");

  const handleLoad = (type: string) => {
    console.log(`Load clicked for ${type}`, {
      orderNo,
      quotationNo,
      deliveryNo,
      deliveryQuotNo,
    });
  };


  return (
    <div className="space-y-3 p-2">
      {/* Order No */}
      <div className="grid grid-cols-[140px_1fr_80px] gap-3 items-center">
        <label className="text-left text-[11px] text-black">
          {t('order_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="orderNo"
            type="text"
            value={orderNo}
            noLabel={true}
            onChange={(e) => setOrderNo(e.target.value)}
            className="flex-1"
          />
          <ERPInput
            id="orderNo2"
            type="text"
            value=""
            noLabel={true}
            onChange={(e) => { }}
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoad('order')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Quotation No */}
      <div className="grid grid-cols-[140px_1fr_80px] gap-3 items-center">
        <label className="text-left text-[11px] text-black">
          {t('quotation_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="quotationNo"
            type="text"
            value={quotationNo}
            noLabel={true}
            onChange={(e) => setQuotationNo(e.target.value)}
            className="flex-1"
          />
          <ERPInput
            id="quotationDisplay"
            type="text"
            value="0"
            noLabel={true}
            readOnly
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoad('quotation')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Delivery No */}
      <div className="grid grid-cols-[140px_1fr_80px] gap-3 items-center">
        <label className="text-left text-[11px] text-black">
          {t('delivery_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="deliveryNo"
            type="text"
            value={deliveryNo}
            noLabel={true}
            onChange={(e) => setDeliveryNo(e.target.value)}
            className="flex-1"
          />
          <ERPInput
            id="deliveryDisplay"
            type="text"
            value="0"
            noLabel={true}
            readOnly
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoad('delivery')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Delivery Quot No */}
      <div className="grid grid-cols-[140px_1fr_80px] gap-3 items-center">
        <label className="text-left text-[11px] text-black">
          {t('delivery_quot_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="deliveryQuotNo"
            type="text"
            value={deliveryQuotNo}
            noLabel={true}
            onChange={(e) => setDeliveryQuotNo(e.target.value)}
            className="flex-1"
          />
          <ERPInput
            id="deliveryQuotDisplay"
            type="text"
            value="0"
            noLabel={true}
            readOnly
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoad('deliveryQuot')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Hide Button */}
      <div className="flex justify-center pt-4">
        <ERPButton
          title={t("hide")}
          variant="secondary"
          className="w-32"
        />
      </div>
    </div>
  );
};

export default OrderLookup;