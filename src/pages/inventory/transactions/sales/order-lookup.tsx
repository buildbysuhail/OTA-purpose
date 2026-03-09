import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

interface OrderLookupProps {
  t: (key: string) => string;
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  onHide?: () => void;
  voucherType: string;
}

const OrderLookup: React.FC<OrderLookupProps> = ({ t, loadAndSetTransVoucher, onHide, voucherType }) => {
  const [orderNo, setOrderNo] = useState<{vrPrefix: string; vrNumber: string;}>({vrPrefix: "",vrNumber: ""});
  const [quotationNo, setQuotationNo] = useState<{vrPrefix: string; vrNumber: string;}>({vrPrefix: "",vrNumber: ""});
  const [deliveryNo, setDeliveryNo] = useState<{vrPrefix: string; vrNumber: string;}>({vrPrefix: "",vrNumber: ""});
  const [deliveryQuotNo, setDeliveryQuotNo] = useState<{vrPrefix: string; vrNumber: string;}>({vrPrefix: "",vrNumber: ""});

  const handleLoadClick = async (LoadPrefixType: string) => {
    let vNumber = "";
    let vPrefix = "";
    let vType = "";
    if (LoadPrefixType.toUpperCase() === "SO") {
      vNumber = orderNo.vrNumber;
      vPrefix = orderNo.vrPrefix;
      vType = "SO";
    } else if (LoadPrefixType.toUpperCase() === "SQ") {
      vNumber = quotationNo.vrNumber;
      vPrefix = quotationNo.vrPrefix;
      vType = "SQ";
    } else if (LoadPrefixType.toUpperCase() === "GD") {
      vNumber = deliveryNo.vrNumber;
      vPrefix = deliveryNo.vrPrefix;
      vType = "GD";
    } else if (LoadPrefixType.toUpperCase() === "GDQ") {
      vNumber = deliveryQuotNo.vrNumber;
      vPrefix = deliveryQuotNo.vrPrefix;
      vType = "GDQ";
    }
      const res = await loadAndSetTransVoucher(
        false,
        Number(vNumber),
        vPrefix.toUpperCase(),
        voucherType,
        "",
        "",
        0,
        undefined,
        true,
        false,
        vType,
        undefined,
        vPrefix,
        undefined,
        undefined,
        true,
      );
      if (res === true) {
        onHide?.();
      }
    };

  return (
    <div className="space-y-3 p-2">

      {/* Column Headers */}
      <div className="grid grid-cols-[120px_1fr_80px] gap-3 items-center">
        <div />
        <div className="flex gap-2">
          <span className="flex-1 text-xs font-semibold text-gray-500 text-center">{t("vr_prefix")}</span>
          <span className="flex-1 text-xs font-semibold text-gray-500 text-center">{t("vr_number")}</span>
        </div>
        <div />
      </div>

      {/* Order No */}
      <div className="grid grid-cols-[120px_1fr_80px] gap-3 items-center">
        <label className="text-left text-md text-semibold text-black">
          {t('order_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="orderPrefix"
            type="text"
            value={orderNo.vrPrefix}
            noLabel={true}
            onChange={(e) => setOrderNo(prev => ({ ...prev, vrPrefix: e.target.value.toUpperCase() }))}
            className="flex-1"
          />
          <ERPInput
            id="orderNumber"
            type="text"
            value={orderNo.vrNumber}
            noLabel={true}
            onChange={(e) => setOrderNo(prev => ({ ...prev, vrNumber: e.target.value }))}
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoadClick("SO")}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Quotation No */}
      <div className="grid grid-cols-[120px_1fr_80px] gap-3 items-center">
        <label className="text-left text-md text-semibold text-black">
          {t('quotation_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="quotationPrefix"
            type="text"
            value={quotationNo.vrPrefix}
            noLabel={true}
            onChange={(e) => setQuotationNo(prev => ({ ...prev, vrPrefix: e.target.value.toUpperCase() }))}
            className="flex-1"
          />
          <ERPInput
            id="quotationNumber"
            type="text"
            value={quotationNo.vrNumber}
            noLabel={true}
            onChange={(e) => setQuotationNo(prev => ({ ...prev, vrNumber: e.target.value }))}
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoadClick('SQ')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Delivery No */}
      <div className="grid grid-cols-[120px_1fr_80px] gap-3 items-center">
        <label className="text-left text-md text-semibold text-black">
          {t('delivery_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="deliveryPrefix"
            type="text"
            value={deliveryNo.vrPrefix}
            noLabel={true}
            onChange={(e) => setDeliveryNo(prev => ({ ...prev, vrPrefix: e.target.value.toUpperCase() }))}
            className="flex-1"
          />
          <ERPInput
            id="deliveryNumber"
            type="text"
            value={deliveryNo.vrNumber}
            noLabel={true}
            onChange={(e) => setDeliveryNo(prev => ({ ...prev, vrNumber: e.target.value }))}
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoadClick('GD')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Delivery Quot No */}
      <div className="grid grid-cols-[120px_1fr_80px] gap-3 items-center">
        <label className="text-left text-md text-semibold text-black">
          {t('delivery_quot_no')}:
        </label>
        <div className="flex gap-2">
          <ERPInput
            id="deliveryQuotPrefix"
            type="text"
            value={deliveryQuotNo.vrPrefix}
            noLabel={true}
            onChange={(e) => setDeliveryQuotNo(prev => ({ ...prev, vrPrefix: e.target.value.toUpperCase() }))}
            className="flex-1"
          />
          <ERPInput
            id="deliveryQuotNumber"
            type="text"
            value={deliveryQuotNo.vrNumber}
            noLabel={true}
            onChange={(e) => setDeliveryQuotNo(prev => ({ ...prev, vrNumber: e.target.value }))}
            className="flex-1"
          />
        </div>
        <ERPButton
          title={t("load")}
          onClick={() => handleLoadClick('GDQ')}
          variant="secondary"
          className="w-full"
        />
      </div>

      {/* Hide Button */}
      <div className="flex justify-end pt-4">
        <ERPButton
          title={t("hide")}
          variant="secondary"
          className="w-32"
          onClick={onHide}
        />
      </div>
    </div>
  );
};

export default OrderLookup;