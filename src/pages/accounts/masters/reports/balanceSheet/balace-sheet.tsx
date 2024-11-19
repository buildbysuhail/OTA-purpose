import { useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, {
  BalanceSheetFilterInitialState,
} from "./balance-sheet-filter";
import Urls from "../../../../../redux/urls";
import "./Loader.css";
import LoadingPopup from "./LoadingPopup";
import { Clock1, FileDown, Forward, Printer, Timer, X } from "lucide-react";

const api = new APIClient();

const BalanceSheetRow: React.FC<{ item: any }> = ({ item }) => {
  return (
    <tr>
      <td
        className={`py-2`}
        style={{
          paddingLeft: item.groupID == 0 ? "10px" : "0px",
          fontWeight: item.groupID == 0 ? "bold" : "normal",
        }}
      >
        {/* <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]"> */}
        {item.groupName}
        {/* </Link> */}
      </td>
      {item.total !== undefined && (
        <td className="py-2 text-right">
          {/* <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]"> */}
          {item.total}
          {/* </Link> */}
        </td>
      )}
    </tr>
  );
};
// Horizontal format component
const HorizontalBalanceSheet: React.FC<{ data: any }> = ({ data }) => {
  const assets = data?.filter((item: any) => item?.transType == "A");

  const liabilities = data?.filter((item: any) => item?.transType == "L");

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
    } else {
      LoadAsync();
    }
  }, []);

  const LoadAsync = async (_filter?: any) => {
    setLoading(true);
    const res = await api.postAsync(
      Urls.acc_reports_balance_sheet,
      _filter || filter
    );
    setData(res?.data || []);
    setLoading(false);
  };

  const onApplyFilter = useCallback((_filter: any) => {
    setFilter({ ..._filter });
    LoadAsync(_filter);
  }, []);

  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center p-1  border border-gray-300 rounded-md mb-4">
          {/* <div className="flex items-center border border-gray-300 rounded-md p-2">
            <input
              type="text"
              value="Today"
              className="border-none focus:outline-none"
              readOnly
            />
            <i className="fas fa-calendar-alt ml-2 text-gray-500"></i>
          </div> */}
          {/* <div className="flex items-center ml-4 text-blue-500 cursor-pointer">
            <span>Customise</span>
            <i className="fas fa-cog ml-1"></i>
          </div> */}
          {/* <h6 className="text-center text-lg mb-4">Balance Sheet</h6> */}
          <div className="flex items-center ml-4 text-blue-500 cursor-pointer">
            {/* <span>Customise</span> */}
            <h6 className="text-center text-lg font-bold  mb-0">Balance Sheet</h6>
            <i className="fas fa-cog ml-1"></i>
          </div>

          <div className="flex items-center ml-auto space-x-4">
            <button className="flex items-center bg-gray-100 p-0 rounded-md">
              <ErpGridGlobalFilter
                width="w-full max-w-[500px]"
                gridId="gridBalanceSheet"
                initialData={BalanceSheetFilterInitialState}
                content={<BalanceSheetFilter />}
                toogleFilter={showFilter}
                onApplyFilters={(filters) => onApplyFilter(filters)}
                onClose={onCloseFilter}
              />
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-share-alt mr-1"></i> */}
              <Forward className="pr-2" />
              <span>Share</span>
              <span className="ml-1 bg-[#3b82f6] text-white rounded-full px-2">
                0
              </span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-clock mr-1"></i> */}
              <Clock1 className="pr-2" />
              <span>Schedule Report</span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-print mr-1"></i> */}
              <Printer className="pr-2" />
              <span>Print</span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-file-export mr-1"></i> */}
              <FileDown className="pr-2" />
              <span>Export</span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-times"></i> */}
              {/* <Timer /> */}
              <X />
            </button>
          </div>
        </div>
        {/* <h1 className="text-center text-xl font-bold mb-2">UK Company</h1> */}
        {/* <h2 className="text-center text-lg mb-4">Balance Sheet</h2> */}
        <p className="text-center mb-4">As of December 20, 2023</p>
        {loading ? (
          <>
            <div className="bg-white">
              <LoadingPopup loading={loading} />
            </div>
          </>
        ) : (
          <>
            {filter.showVertical != true ? (
              <HorizontalBalanceSheet data={data ?? []} />
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
                    <BalanceSheetRow key={index} item={item ?? []} />
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
