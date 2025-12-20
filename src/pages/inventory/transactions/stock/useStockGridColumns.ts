import { useMemo } from "react";
import {
  STOCK_GRID_COLUMN_FACTORY,
  StockGridColumnFactoryArgs,
} from "./stockGridColumnFactory";
import { ColumnModel } from "../transaction-types";
import { stockGridColStockJournal } from "./transaction-grid-cols-stock-journals";


export function useStockGridColumns(
  args: StockGridColumnFactoryArgs
): ColumnModel[] {
  const {
    voucherType,
    formType,
    applicationSettings,
    userSession,
    t,
    formState,
  } = args;

  return useMemo(() => {
    const factory = STOCK_GRID_COLUMN_FACTORY[voucherType];

    // Default fallback (Stock Journal)
    if (!factory) {
      return stockGridColStockJournal(
        applicationSettings,
        userSession,
        voucherType,
        formType,
        t,
        formState
      );
    }

    return factory(args);
  }, [
    voucherType,
    formType,
    applicationSettings,
    userSession,
    t,
    formState,
  ]);
}
