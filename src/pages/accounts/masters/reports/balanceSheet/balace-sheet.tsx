import { useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, { BalanceSheetFilterInitialState } from "./balance-sheet-filter";
import Urls from "../../../../../redux/urls";

const api = new APIClient();
const BalanceSheet = () => {
  const [data, setData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(BalanceSheetFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);

  useEffect(() => {
    LoadAsync();
  }, []);

  const LoadAsync = async (_filter?: any) => {
    const res = await api.postAsync(Urls.acc_reports_balance_sheet, _filter || filter);
    setData(res?.data || []);
  };

  const onApplyFilter = useCallback(
    (_filter: any) => {
      setFilter({ ..._filter });
      LoadAsync(_filter);
    },
    []
  );

  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-xl font-bold mb-2">UK Company</h1>
        <ErpGridGlobalFilter
          width="w-full max-w-[500px]"
          gridId="gridBalanceSheet"
          initialData={BalanceSheetFilterInitialState}
          content={<BalanceSheetFilter />}
          toogleFilter={showFilter}
          onApplyFilters={(filters) => onApplyFilter(filters)}
          onClose={onCloseFilter}
        />
        <h2 className="text-center text-lg mb-4">Balance Sheet</h2>
        <p className="text-center mb-4">As of December 20, 2023</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-black py-2">Group Name</th>
              <th className="border-b-2 border-black py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className={`py-2 ${item.groupID < 0 ? "pl-4" : ""}`}>
                  {item.groupName || "Unnamed Group"}
                </td>
                <td className="py-2 text-right">
                  {item.total ? `£${item.total.toLocaleString()}` : "£0.00"}
                </td>
              </tr>
            ))}
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
