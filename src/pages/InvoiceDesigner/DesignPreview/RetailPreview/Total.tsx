import { RetailPreviewProps } from "./PreviewWrapper";

const Total = ({ template, data, currency }: RetailPreviewProps) => {
  const backgroundColor = template?.totalState?.totalBgColor || "#fff";
  const wordsBackgroudColor = template?.totalState?.balanceBgColor || "#fff";

  /// Font
  const fontSize = template?.totalState?.totalFontSize || 12;
  const color = template?.totalState?.totalFontColor || "#000";

  const balnceFontSize = template?.totalState?.balanceFontSize || 12;

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;

  const totalState = template?.totalState;

  const DECIMALS = 2;

  return (
    <div
      style={{
        paddingLeft,
        paddingRight,
      }}
      className="flex w-full py-2"
    >
      <div className="w-full h-full ">
        {totalState?.showTotalSection && (
          <div
            style={
              {
                //   backgroundColor,
              }
            }
          >
            <div
              style={{
                backgroundColor,
                fontSize,
              }}
              className="grid grid-cols-2 "
            >
              {totalState.showSubTotalLabel && data?.sub_total !== undefined && (
                <>
                  <a>{totalState.subTotalLabel}</a>
                  <a className="text-right">
                    {currency} {Number(data?.sub_total).toFixed(DECIMALS)}
                  </a>
                </>
              )}
              {data?.discount_price !== undefined && (
                <>
                  <a>Discount</a>
                  <a className="text-right">
                    {currency} {Number(data?.discount_price).toFixed(DECIMALS)}
                  </a>
                </>
              )}

              {totalState.showTax && data?.total_tax_amount !== undefined && (
                <>
                  <span>Tax</span>
                  <span className="text-right">
                    {currency} {Number(data?.total_tax_amount).toFixed(DECIMALS)}
                  </span>
                </>
              )}

              {data?.total_price !== undefined && (
                <>
                  <span className="border-t border-b py-2 my-1 font-bold border-black">Total</span>
                  <span className="text-right border-t border-b py-2 my-1 font-bold border-black">
                    {currency} {Number(data?.total_price).toFixed(DECIMALS)}
                  </span>
                </>
              )}

              {data?.paid_amount !== undefined && (
                <>
                  <a>Amount Paid</a>
                  <a className="text-right">
                    {currency} {Number(data?.paid_amount).toFixed(DECIMALS)}
                  </a>
                </>
              )}
            </div>
            {totalState && data?.balance_due !== undefined && (
              <div
                style={{
                  backgroundColor: wordsBackgroudColor,
                  fontSize: balnceFontSize,
                }}
                className="grid grid-cols-2 col-span-full "
              >
                <a>Amount Due</a>
                <a className="text-right">
                  {currency} {Number(data?.balance_due).toFixed(DECIMALS)}
                </a>
              </div>
            )}
          </div>
        )}
        {/* {data?.total_price !== undefined && (
          <div
            style={{
              color,
              fontSize,
            }}
            className=" py-2"
          >
            Total In Words: <span className=" font-medium">{getAmountInWords(Number(data?.total_price))}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Total;
