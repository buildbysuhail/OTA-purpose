import { useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, { BalanceSheetFilterInitialState } from "./balance-sheet-filter";
import Urls from "../../../../../redux/urls";

const api = new APIClient();

const BalanceSheetRow: React.FC<{ item: any }> = ({ item }) => {

return (
  <tr>
    <td className={`py-2`}style={{ paddingLeft: item.groupID == 0 ? '0px' : '10px', fontWeight: item.groupID == 0 ? 'normal' : 'bold' }}>
      {/* <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]"> */}
        {item.groupName}
      {/* </Link> */}
    </td>
    {
      item.total !== undefined && (
        <td className="py-2 text-right">
          {/* <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]"> */}
            {item.total}
          {/* </Link> */}
        </td>
      )
    }
  </tr >
);
}
// Horizontal format component
const HorizontalBalanceSheet: React.FC<{ data: any }> = ({
  data,
}) => {
  const assets = data?.filter(
    (item: any) =>
      item?.transType == 'A'
  );

  const liabilities = data?.filter(
    (item: any) =>
      item?.transType == 'L'
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold mb-2">Assets</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="py-2 pl-2">Account</th>
              <th className="py-2 text-right pr-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((item: any, index: number) => (
              <BalanceSheetRow key={`asset-${index}`} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Liabilities & Capital</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="py-2 pl-2">Account</th>
              <th className="py-2 text-right pr-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {liabilities?.map((item: any, index: number) => (
              <BalanceSheetRow key={`liability-${index}`} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BalanceSheet = () => {
  const [data, setData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(BalanceSheetFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (filterShowCount == 0) {
      setShowFilter(true);
    }
    else {
      LoadAsync();
    }
  }, []);

  const LoadAsync = async (_filter?: any) => {
    setLoading(true);
    const res = await api.postAsync(Urls.acc_reports_balance_sheet, _filter || filter);
    setData(res?.data || []);
    setLoading(false);
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
        {loading ? (
          <>loading..</>
        ) : (
          <>
            {filter.showVertical != true ? (
              <HorizontalBalanceSheet data={data??[]} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="py-2 pl-2">Account</th>
                    <th className="py-2 text-right pr-2">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <BalanceSheetRow key={index} item={item??[]} />
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        <p className="text-center mt-4">
          Accrual basis Wednesday, 20 December 2023 11:30 am GMT+00:00
        </p>
      </div>
    </div>
  );
};

export default BalanceSheet;
