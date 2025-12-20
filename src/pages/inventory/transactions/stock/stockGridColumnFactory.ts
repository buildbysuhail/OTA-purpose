import { UserModel } from "../../../../redux/slices/user-session/reducer";
import { ApplicationSettingsType } from "../../../settings/system/application-settings-types/application-settings-types";
import { ColumnModel, TransactionFormState } from "../transaction-types";
import { stockGridColBranchTransfer } from "./transaction-grid-cols-branch-transfer";
import { stockGridColItemLoadRequest } from "./transaction-grid-cols-itemload-request";
import { stockGridColOpeningStock } from "./transaction-grid-cols-opening-stock";
import { stockGridColStockAdjuster } from "./transaction-grid-cols-stock-adjuster";
import { stockGridColSubstitute } from "./transaction-grid-cols-substitute";


export interface StockGridColumnFactoryArgs {
  applicationSettings: ApplicationSettingsType,
  userSession: UserModel,
  voucherType: string,
  formType: string,
  t: any,
  formState: TransactionFormState
}

export type StockGridColumnFactory = (
  args: StockGridColumnFactoryArgs
) => ColumnModel[];

/**
 * Module-scope factory map
 * - Created once at module load
 * - Never recreated per render
 * - Safe for memoization
 */
export const STOCK_GRID_COLUMN_FACTORY: Record<
  string,
  StockGridColumnFactory
> = Object.freeze({
    // Opening Stock
  OS: (args) =>
    stockGridColOpeningStock(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),

  // Item Load Request
  ILR: (args) =>
    stockGridColItemLoadRequest(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),

  // Branch Transfer (multiple voucher types)
  BTO: (args) =>
    stockGridColBranchTransfer(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),

  BTI: (args) =>
    stockGridColBranchTransfer(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),

  // Stock Adjuster
  AD: (args) =>
    stockGridColStockAdjuster(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),

  // Substitute
  SUB: (args) =>
    stockGridColSubstitute(
      args.applicationSettings,
      args.userSession,
      args.voucherType,
      args.formType,
      args.t,
      args.formState
    ),
});