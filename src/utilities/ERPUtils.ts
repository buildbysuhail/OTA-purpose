export const isTaxApplicable = (path: string, data: any, taxTreatments: any, tableData: any, defaultData: any) => {
  const currentGstTreatment = taxTreatments?.find((item: any) => item?.id === data?.gst_treatment_id);
  const gstTreatmentCode = currentGstTreatment?.code?.replaceAll("-", "")?.toLowerCase();
  const updatedTable = tableData?.filter((item: any) => item?.mark_delete == false);
  const serviceItems = updatedTable?.every((item: any) => item?.type == "service");
  const creditNote = updatedTable?.every((item: any) => item?.type == "credit_note");
  const hasReverseCharge = data?.is_reverse_charge ?? defaultData?.is_reverse_charge;

  if (path?.includes("purchase")) {
    if (gstTreatmentCode == "vat") {
      return true;
    } else if (gstTreatmentCode == "nonvat123") {
      return false;
    } else if (gstTreatmentCode?.includes("gcc") && (serviceItems || creditNote) && hasReverseCharge) {
      return true;
    } else if (gstTreatmentCode?.includes("gcc")) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
export const taxListFinder = (data: any, tableSummary?: any, discountType?: any) => {
  // ================== Function for returning tax values ===============
  const getTaxValue = (data: any, taxData: any, summary?: any, allItems?: any) => {
    if (discountType == "TRANSACTION_LEVEL" && !summary?.is_after_tax && summary?.discount_price) {
      let total_discount: any;
      if (summary?.discount_kind == "percentage") {
        total_discount = summary?.sub_total * (summary?.discount_price / 100);
      } else {
        total_discount = summary?.discount_price;
      }
      let itemLevelDiscount = (data?.total_price * total_discount) / summary?.sub_total;
      let discountedAmount = data?.total_price - itemLevelDiscount;

      return discountedAmount * (parseInt(taxData?.percentage) / 100);
    } else {
      return parseFloat(data?.total_price) * (parseInt(taxData?.percentage) / 100);
    }
  };
  let taxList: any = [];
  data?.map((item: any) => {
    if (item?.tax_split?.length > 0) {
      let list = item?.tax_split?.map((obj: any) => {
        return {
          total_price: item?.item_rate,
          tax_rate: obj?.percentage,
          tax_label: `${obj?.name} [${obj?.percentage} %]`,
          tax_value: getTaxValue(item, obj, tableSummary, data),
          tax_origin_name: obj?.name,
        };
      });
      taxList = [...taxList, ...list];
    }
  });
  return taxList;
};
export const taxListFinderInclusive = (data: any, tableSummary?: any, discountType?: string) => {
  // ============= Function for getting tax values based on tax ===============
  const getTaxValue = (data: any, taxData: any, summary?: any, allItems?: any) => {
    if (discountType == "TRANSACTION_LEVEL" && !tableSummary?.is_after_tax && tableSummary?.discount_price) {
      let subtotal = allItems?.reduce((amount: any, item: any) => {
        let amountWithoutTax = item?.total_price * (100 / (100 + item?.tax_split[0]?.percentage));
        return amountWithoutTax + amount;
      }, 0);

      let itemSubtotal = data?.total_price * (100 / (100 + data?.tax_split[0]?.percentage));

      let itemDiscount = tableSummary?.total_discount?.toFixed(2) * (itemSubtotal / subtotal);

      return (itemSubtotal - itemDiscount) * (data?.tax_split[0]?.percentage / 100);
    } else {
      return (parseFloat(data?.total_price) / (100 + data?.tax_split[0]?.percentage)) * data?.tax_split[0]?.percentage;
    }
  };
  //=============================================================================

  let taxList: any = [];
  data?.map((item: any) => {
    if (item?.tax_split?.length > 0) {
      let list = item?.tax_split?.map((obj: any) => {
        return {
          total_price: item?.item_rate,
          tax_rate: obj?.percentage,
          tax_label: `${obj?.name} [${obj?.percentage} %]`,
          tax_value: getTaxValue(item, obj, tableSummary, data),
        };
      });
      taxList = [...taxList, ...list];
    }
  });

  return taxList;
};
