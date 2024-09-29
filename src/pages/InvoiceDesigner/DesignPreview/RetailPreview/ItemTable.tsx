import { TemplateState } from "../../Designer/interfaces";
import { TemplateGroupTypes } from "../../constants/TemplateCategories";

interface ItemTableProps {
  template?: TemplateState;
  data?: any;
  templateGroupId?: TemplateGroupTypes;
}

const ItemTable = ({ template, data }: ItemTableProps) => {
  const items = [
    {
      id: 1,
      name: "Item 1",
      description: "Description 1",
      quantity: 1,
      rate: 100,
      amount: 100,
    },
    {
      id: 2,
      name: "Item 2",
      description: "Description 2",
      quantity: 2,
      rate: 200,
      amount: 400,
    },
    {
      id: 3,
      name: "Item 3",
      description: "Description 3",
      quantity: 3,
      rate: 300,
      amount: 900,
    },
  ];
  const titles = ["Item", "Description", "Quantity", "Rate", "Amount"];

  //   /// Font
  //   const fontSize = template?.itemTableState?.headerFontSize || 12;
  //   const fontColor = template?.itemTableState?.headerFontColor || "#000";

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;

  const itemTableState = template?.itemTableState;

  /// Header
  const headerFontSize = itemTableState?.headerFontSize || "#fff";
  const headerFontColor = itemTableState?.headerFontColor || "#000";
  const headerBgColor = itemTableState?.tableHeaderBgColor || "#fff";

  /// Items
  const backgroundColor = itemTableState?.itemRowBgColor || "#fff";
  const color = itemTableState?.itemRowFontColor || "#000";
  const fontSize = itemTableState?.itemRowFontSize;
  const borderColor = itemTableState?.tableBorderColor;

  return (
    <div
      style={{
        paddingLeft,
        paddingRight,
      }}
    >
      <table className="w-full ">
        <thead>
          <tr
            style={{
              backgroundColor: headerBgColor,
              color: headerFontColor,
              fontSize: headerFontSize,
              borderColor,
            }}
            className=" bg-slate-100 border-t border-b border-dashed"
          >
            {itemTableState?.showLineItemNumber && <th className=" p-1">#</th>}
            {itemTableState?.showLineItem && <th className=" p-1">{itemTableState?.lineItemLabel}</th>}
            {itemTableState?.showHsnSac && <th className="  p-1">{itemTableState?.hsnSacLabel}</th>}
            {itemTableState?.showQuantity && <th className=" p-1">{itemTableState?.quantityLabel}</th>}
            {itemTableState?.showRate && <th className="  p-1">{itemTableState?.rateLabel}</th>}
            {itemTableState?.showAmount && <th className="  p-1">{itemTableState?.amountLabel}</th>}
          </tr>
        </thead>
        <tbody className=" text-xs">
          {data?.items?.map((val: any, index: number) => (
            <tr key={`tbr${index}`}>
              {itemTableState?.showLineItemNumber && (
                <td
                  style={{
                    borderColor,
                    backgroundColor,
                    color,
                    fontSize,
                  }}
                  className={`${itemTableState.showTableBorder && "border-b border-dashed"} p-1 px-2`}
                >
                  {index + 1}
                </td>
              )}
              {itemTableState?.showLineItem && (
                <td
                  style={{
                    borderColor,
                    backgroundColor,
                    color,
                    fontSize,
                  }}
                  className={`${itemTableState.showTableBorder && "border-b border-dashed"}  p-1`}
                >
                  {val?.item_name}
                </td>
              )}
              {itemTableState?.showQuantity && (
                <td
                  style={{
                    borderColor,
                    backgroundColor,
                    color,
                    fontSize,
                  }}
                  className={`${itemTableState.showTableBorder && "border-b border-dashed"} text-center p-1`}
                >
                  {Number(val?.qty)}
                </td>
              )}

              {itemTableState?.showRate && (
                <td
                  style={{
                    borderColor,
                    backgroundColor,
                    color,
                    fontSize,
                  }}
                  className={`${itemTableState.showTableBorder && "border-b border-dashed"} text-center p-1`}
                >
                  {val?.item_rate}
                </td>
              )}
              {itemTableState?.showAmount && (
                <td
                  style={{
                    borderColor,
                    backgroundColor,
                    color,
                    fontSize,
                  }}
                  className={`${itemTableState.showTableBorder && "border-b border-dashed"} text-right p-1`}
                >
                  {val?.total_price}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
