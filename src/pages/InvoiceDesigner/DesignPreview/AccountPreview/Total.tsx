import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { reducerNameFromUrl } from "../../../../redux/actions/AppActions";
import { getAmountInWords } from "../../../../utilities/Utils";
import { isTaxApplicable, taxListFinder, taxListFinderInclusive } from "../../../../utilities/ERPUtils";
import Urls from "../../../../redux/urls";
import { AccountPreviewProps } from "./index";

const Total = ({ template, data, templateGroupId, currency }: AccountPreviewProps) => {
  const backgroundColor = template?.totalState?.showTotalBgColor ? template?.totalState?.totalBgColor : "#fff";
  const balancesBackgroudColor = template?.totalState?.showBalanceBgColor ? template?.totalState?.balanceBgColor : "#fff";

  /// Font
  const fontSize = template?.totalState?.totalFontSize || 12;
  const color = template?.totalState?.totalFontColor || "#000";

  const balnceFontSize = template?.totalState?.balanceFontSize || 12;
  const balanceFontColor = template?.totalState?.balanceFontColor || "#000";

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;

  const totalState = template?.totalState;

  const DECIMALS = 2;

  return (
    <div style={{ paddingLeft, paddingRight }} className="mb-2">
      <div className="flex w-full">

        <div className="flex flex-col w-1/2  h-full">
          {totalState?.showQuantity && (
            <div className="max-w-min whitespace-nowrap px-2" style={{ backgroundColor, fontSize, color }}>
              {totalState?.quantityInfoLabel || "Total"} : {data?.items?.length}
            </div>
          )}
        </div>

        <div className="w-1/2 h-full text-right">
          {totalState?.showTotalSection && (
            <div>
              <div style={{ backgroundColor, fontSize, color }} className="grid grid-cols-2 p-1">
                {totalState.showSubTotalLabel && data?.sub_total !== undefined && (
                  <>
                    <a>{totalState.subTotalLabel}</a>
                    <a>
                      {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.sub_total).toFixed(DECIMALS)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currency}
                    </a>
                  </>
                )}
                {totalState?.showDicount && data?.discount_price !== undefined && (
                  <>
                    <a>Discount</a>
                    <a>
                      {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.discount_price).toFixed(DECIMALS)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currency}
                    </a>
                  </>
                )}

                {totalState.showTax && data?.total_tax_amount !== undefined && (
                  <>
                    <a>Tax</a>
                    <a>
                      {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.total_tax_amount).toFixed(DECIMALS)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currency}
                    </a>
                  </>
                )}

                {totalState?.showTotal && data?.total_price !== undefined && (
                  <>
                    <a>{totalState?.totalInfoLabel || "Total"} </a>
                    <a>
                      {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.total_price).toFixed(DECIMALS)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currency}
                    </a>
                  </>
                )}

                {totalState?.showPaymentDetail && data?.paid_amount !== undefined && (
                  <>
                    <a>{totalState?.paymentMadeLabel || "Amount Paid"}</a>
                    <a>
                      {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.paid_amount).toFixed(DECIMALS)}{" "}
                      {totalState?.currencyPosition?.value === "After" && currency}
                    </a>
                  </>
                )}
              </div>
              {totalState?.showPaymentDetail && data?.balance_due !== undefined && (
                <div
                  className="grid grid-cols-2 col-span-full p-1"
                  style={{ backgroundColor: balancesBackgroudColor, fontSize: balnceFontSize, color: balanceFontColor }}
                >
                  <a>{totalState?.balanceAmountLabel || "Amount Due"}</a>
                  <a>
                    {totalState?.currencyPosition?.value === "Before" && currency} {Number(data?.balance_due).toFixed(DECIMALS)}{" "}
                    {totalState?.currencyPosition?.value === "After" && currency}
                  </a>
                </div>
              )}
            </div>
          )}
          {totalState?.showAmoutInWords && data?.total_price !== undefined && (
            <div style={{ fontSize }} className=" p-2">
              Total In Words: <span className=" font-medium">{getAmountInWords(Number(data?.total_price), currency)}</span>
            </div>
          )}
        </div>

        {templateGroupId === "journal_entry" && <JournalTotalTable data={data} template={template} currency={currency} />}
      </div>

      {totalState?.showTaxSummaryTable && <TaxSummaryTable data={data} template={template} />}
    </div>
  );
};

export default Total;

const TaxSummaryTable = ({ data, template }: AccountPreviewProps) => {

  const { pathname } = useLocation();

  const gstTreatmentReducerName = reducerNameFromUrl(Urls.tax_treatment, "GET");
  const gstTreatmentList = useSelector((state: any) => state?.[gstTreatmentReducerName])?.data?.results;
  const hasTax = isTaxApplicable(pathname, data, gstTreatmentList, data?.items, data);
  const tableSummary = useSelector((state: any) => state.ERPTableSummary);

  /* ########################################################################################### */

  const updatedTableData = data?.items?.map((item: any) => ({
    ...item,
    tax_split: item?.item_tax_category?.tax_split?.map((split: any) => ({ ...split, name: item?.item_tax_category?.name }))
  }))

  let taxInfo: any = {};
  if (data?.is_tax == "inclusive") {
    taxInfo = hasTax ? taxListFinderInclusive(updatedTableData, tableSummary, data?.discount_type) : [];
  } else {
    taxInfo = hasTax ? taxListFinder(updatedTableData, tableSummary, data?.discount_type) : [];
  }

  const taxSplitView = () => {
    let arr: any = [];
    let taxArr = taxInfo;
    taxArr?.map((item: any) => {
      let taxFilterList = arr?.filter((value: any) => value?.tax_label?.replace(" ", "_") == item.tax_label?.replace(" ", "_"));
      if (taxFilterList?.length > 0) {
        let idx = arr.findIndex((t: any) => t.tax_label?.replace(" ", "_") === item.tax_label?.replace(" ", "_"));
        arr.splice(idx, 1);
        arr.push({ ...item, tax_value: taxFilterList?.[0]?.tax_value + item.tax_value });
      } else {
        arr.push(item);
      }
    });
    return arr;
  };

  /* ########################################################################################### */

  const itemTableState = template?.itemTableState;
  const totalState = template?.totalState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.showTableHeaderBg ? itemTableState?.tableHeaderBgColor : "#fff";

  /// Items
  const backgroundColor = itemTableState?.showRowBg ? itemTableState?.itemRowBgColor : "#fff";
  const color = itemTableState?.itemRowFontColor || "#000";
  const borderColor = itemTableState?.tableBorderColor;
  const fontSize = itemTableState?.itemRowFontSize;

  /* ########################################################################################### */


  return <div>
    <div className="text-xs my-2">{totalState?.taxSummaryTitle ?? "Tax Summary"}</div>
    <table className="w-full ">
      <thead className="w-full">

        <tr style={{
          backgroundColor: headerBgColor,
          color: headerFontColor,
          fontSize: headerFontSize,
        }} className="flex">
          <th className="flex-1 ">{totalState?.taxDetailsLabel ?? "Tax Details"}</th>
          {totalState?.showTaxableAmountLabel && <th className="flex-1 text-right">{totalState?.taxableAmountLabel ?? "Taxable Amount"}</th>}
          {totalState?.showTaxAmountLabel && <th className="flex-1 text-right">{totalState?.taxAmountLabel ?? "Tax Amount"}</th>}
          {totalState?.showTotalAmountLabel && <th className="flex-1 text-right">{totalState?.totalAmountLabel ?? "Total Amount"}</th>}
        </tr>

      </thead>
      <tbody>

        {taxSplitView()?.map((tax: any) => {
          return <tr className="flex w-full ">
            <td className="flex-1" style={{ borderColor, backgroundColor, color, fontSize }}>
              {tax?.tax_origin_name}
            </td>

            {totalState?.showTaxableAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
              {Number((tax?.tax_value / tax?.tax_rate) * 100).toFixed(2)}
            </td>}

            {totalState?.showTaxAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
              {Number(tax?.tax_value).toFixed(2)}
            </td>}

            {totalState?.showTotalAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
              {Number(((tax?.tax_value / tax?.tax_rate) * 100) + tax?.tax_value).toFixed(2)}
            </td>
            }
          </tr>
        })}

        <tr className="flex w-full border-t border-b py-0.5 font-semibold">
          <td className="flex-1" style={{ borderColor, backgroundColor, color, fontSize }}>
            {totalState?.totalLabel ?? "Total"}
          </td>

          {totalState?.showTaxableAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
            {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) =>
              accumulator + ((currentValue?.tax_value / currentValue?.tax_rate) * 100), 0)).toFixed(2)}
          </td>}

          {totalState?.showTaxAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
            {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) => accumulator + currentValue?.tax_value, 0)).toFixed(2)}
          </td>}

          {totalState?.showTotalAmountLabel && <td className="flex-1 text-right" style={{ borderColor, backgroundColor, color, fontSize }}>
            {Number(taxSplitView()?.reduce((accumulator: any, currentValue: any) =>
              accumulator + (((currentValue?.tax_value / currentValue?.tax_rate) * 100) + currentValue?.tax_value), 0)).toFixed(2)}
          </td>}
        </tr>

      </tbody>
    </table>
  </div>
}

const JournalTotalTable = ({ data, template, currency }: AccountPreviewProps) => {
  const subFontSIze = template?.totalState?.totalFontSize || 12;
  const subFontColor = template?.totalState?.totalFontColor || "#000";
  const subBgColor = template?.totalState?.showTotalBgColor ? template?.totalState?.totalBgColor : "#fff";

  const totalBgColor = template?.totalState?.showBalanceBgColor ? template?.totalState?.balanceBgColor : "#fff";
  const totalFontSize = template?.totalState?.balanceFontSize || 12;
  const totalFontColor = template?.totalState?.balanceFontColor || "#000";

  return (
    <div className="text-xs grid grid-cols-3 w-full py-10">
      <div style={{ fontSize: subFontSIze, backgroundColor: subBgColor, color: subFontColor }} className="text-right">
        Sub Total
      </div>
      <div style={{ fontSize: subFontSIze, backgroundColor: subBgColor, color: subFontColor }} className="text-right">
        {data?.debit_sub_total}
      </div>
      <div style={{ fontSize: subFontSIze, backgroundColor: subBgColor, color: subFontColor }} className="text-right pr-1">
        {data?.credit_sub_total}
      </div>

      <div style={{ backgroundColor: totalBgColor, fontSize: totalFontSize, color: totalFontColor }} className="text-right font-semibold py-1">
        Total
      </div>
      <div style={{ backgroundColor: totalBgColor, fontSize: totalFontSize, color: totalFontColor }} className="text-right font-semibold py-1">
        {currency} {data?.debit_total}
      </div>
      <div style={{ backgroundColor: totalBgColor, fontSize: totalFontSize, color: totalFontColor }} className="text-right font-semibold p-1">
        {currency} {data?.credit_total}
      </div>
    </div>
  );
};
