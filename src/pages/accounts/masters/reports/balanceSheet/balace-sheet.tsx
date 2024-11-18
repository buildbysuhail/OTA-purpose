import { useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, { BalanceSheetFilterInitialState } from "./balance-sheet-filter";
import Urls from "../../../../../redux/urls";

interface BalanceSheet {
  from: Date;
}
const api = new APIClient();
const BalanceSheet = () => {
  const [data, setData] = useState();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(BalanceSheetFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  useEffect(() => {

  }, []);
  const LoadAsysnc = async () => {
    const res = await api.postAsync(Urls.acc_reports_balance_sheet,filter)
    setData(res);
  }
  const onApplyFilter = useCallback(
    (_filter: any) => {
      const dss = { ..._filter }
      setFilter(dss);
    },
    []
  ); 
  const onCloseFilter = useCallback(
    () => {
      if (filterShowCount == 0) {
        setFilter({});
        setFilterShowCount((prev) => prev + 1);
      }
      setShowFilter(false);
    },
    []
  );
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-xl font-bold mb-2">UK Company</h1>
        <ErpGridGlobalFilter
        width="w-full max-w-[1000px]"
          gridId={"gridBalanceSheet"}
          initialData={BalanceSheetFilterInitialState}
          content={
            <BalanceSheetFilter/>
            // <LedgerReportFilter /> // Pass standalone JSX content
          }
          toogleFilter={showFilter}
          onApplyFilters={(filters) => onApplyFilter(filters)}
          onClose={onCloseFilter}
        />
        <h2 className="text-center text-lg mb-4">Balance Sheet</h2>
        <p className="text-center mb-4">As of December 20, 2023</p>
        <table className="w-full text-left border-collapse">
          <thead>
            {/* <tr>
              <th className="border-b-2 border-black py-2">Account</th>
              <th className="border-b-2 border-black py-2">TOTAL</th>
            </tr> */}
            <tr>
              <th className="border-b-2 border-black py-2">Account</th>
              <th className="border-b-2 border-black py-2 end-1">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Fixed Asset</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">Total Fixed Asset</td>
            </tr>
            <tr>
              <td className="py-2 pl-4">- Debtors</td>
            </tr>
            <tr>
              <td className="py-2 pl-8">Debtors</td>
              <td className="py-2 text-right">20.00</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">Total Debtors</td>
              <td className="py-2 text-right font-bold">£20.00</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">NET CURRENT ASSETS</td>
              <td className="py-2 text-right font-bold">£20.00</td>
            </tr>
            <tr>
              <td className="py-2 pl-4">
                - Creditors: amounts falling due within one year
              </td>
            </tr>
            <tr>
              <td className="py-2 pl-8">- Current Liabilities</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">
                Employee National Insurance Liability
              </td>
              <td className="py-2 text-right">204.96</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">National Insurance Liability</td>
              <td className="py-2 text-right">243.98</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">PAYE Liability</td>
              <td className="py-2 text-right">0.00</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">Payment</td>
              <td className="py-2 text-right">2,295.04</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">
                Postgraduate Student Loan Liability
              </td>
              <td className="py-2 text-right">0.00</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">Student Loan Liability</td>
              <td className="py-2 text-right">0.00</td>
            </tr>
            <tr>
              <td className="py-2 pl-12">VAT Control</td>
              <td className="py-2 text-right">20.00</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">Total Current Liabilities</td>
              <td className="py-2 text-right font-bold">£2,763.98</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">
                Total Creditors: amounts falling due within one year
              </td>
              <td className="py-2 text-right font-bold">£2,763.98</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">
                NET CURRENT ASSETS (LIABILITIES)
              </td>
              <td className="py-2 text-right font-bold">£-2,743.98</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">
                TOTAL ASSETS LESS CURRENT LIABILITIES
              </td>
              <td className="py-2 text-right font-bold">£-2,743.98</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">TOTAL NET ASSETS (LIABILITIES)</td>
              <td className="py-2 text-right font-bold">£-2,743.98</td>
            </tr>
            <tr>
              <td className="py-2">- Capital and Reserves</td>
            </tr>
            <tr>
              <td className="py-2 pl-4">Retained Earnings</td>
              <td className="py-2 text-right">-2,743.98</td>
            </tr>
            <tr>
              <td className="py-2 pl-4">Profit for the year</td>
            </tr>
            <tr>
              <td className="py-2 font-bold">Total Capital and Reserves</td>
              <td className="py-2 text-right font-bold">£-2,743.98</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center mt-4">
          Accrual basis Wednesday, 20 December 2023 11:30 am GMT+00:00
        </p>
      </div>
    </div>
  );
};

export default BalanceSheet;
