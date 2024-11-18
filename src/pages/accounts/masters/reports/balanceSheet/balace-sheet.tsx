import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

// Types for balance sheet data
interface BalanceSheetItem {
  name: string;
  amount?: number;
  indent?: number;
  isBold?: boolean;
  isTotal?: boolean;
  isLink?: boolean;
  link?: string;
  children?: BalanceSheetItem[];
}

interface BalanceSheetData {
  companyName: string;
  date: string;
  items: BalanceSheetItem[];
  timestamp?: string;
}

// Utility function for currency formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Sample data
const initialData: BalanceSheetData = {
  companyName: "UK Company",
  date: "December 20, 2023",
  timestamp: "Wednesday, 20 December 2023 11:30 am GMT+00:00",
  items: [
    { name: "Fixed Asset" },
    { name: "Total Fixed Asset", isBold: true },
    { name: "- Debtors", indent: 1 },
    {
      name: "Debtors",
      amount: 20.0,
      indent: 2,
      isLink: true,
      link: "/balance-sheet",
    },
    { name: "Total Debtors", amount: 20.0, isBold: true, isTotal: true },
    { name: "NET CURRENT ASSETS", amount: 20.0, isBold: true, isTotal: true },
    {
      name: "- Creditors: amounts falling due within one year",
      indent: 1,
    },
    { name: "- Current Liabilities", indent: 2 },
    {
      name: "Employee National Insurance Liability",
      amount: 204.96,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "National Insurance Liability",
      amount: 243.98,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "PAYE Liability",
      amount: 0.0,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "Payment",
      amount: 2295.04,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "Student Loan Liability",
      amount: 0.0,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "VAT Control",
      amount: 20.0,
      indent: 3,
      isLink: true,
      link: "/balance-sheet",
    },
    {
      name: "Total Current Liabilities",
      amount: 2763.98,
      isBold: true,
      isTotal: true,
    },
    {
      name: "Total Creditors: amounts falling due within one year",
      amount: 2763.98,
      isBold: true,
      isTotal: true,
    },
    {
      name: "NET CURRENT ASSETS (LIABILITIES)",
      amount: -2743.98,
      isBold: true,
      isTotal: true,
    },
    {
      name: "TOTAL ASSETS LESS CURRENT LIABILITIES",
      amount: -2743.98,
      isBold: true,
      isTotal: true,
    },
    {
      name: "TOTAL NET ASSETS (LIABILITIES)",
      amount: -2743.98,
      isBold: true,
      isTotal: true,
    },
    { name: "- Capital and Reserves" },
    {
      name: "Retained Earnings",
      amount: -2743.98,
      indent: 1,
    },
    { name: "Profit for the year", indent: 1 },
    {
      name: "Total Capital and Reserves",
      amount: -2743.98,
      isBold: true,
      isTotal: true,
    },
  ],
};

// Individual row component for vertical format
const BalanceSheetRow: React.FC<{ item: BalanceSheetItem }> = ({ item }) => {
  const paddingLeft = `pl-${item.indent ? item.indent * 4 : 0}`;
  const fontWeight = item.isBold ? "font-bold" : "font-normal";

  if (item.isLink && item.link) {
    return (
      <tr>
        <td className={`py-2 ${paddingLeft} ${fontWeight}`}>
          <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]">
            {item.name}
          </Link>
        </td>
        {item.amount !== undefined && (
          <td className="py-2 text-right">
            <Link to={item.link} className="text-[#3b82f6] hover:text-[#1d4ed8]">
              {item.amount.toFixed(2)}
            </Link>
          </td>
        )}
      </tr>
    );
  }

  return (
    <tr>
      <td className={`py-2 ${paddingLeft} ${fontWeight}`}>{item.name}</td>
      {item.amount !== undefined && (
        <td className={`py-2 text-right ${fontWeight}`}>
          {item.isTotal ? formatCurrency(item.amount) : item.amount.toFixed(2)}
        </td>
      )}
    </tr>
  );
};

// Horizontal format component
const HorizontalBalanceSheet: React.FC<{ data: BalanceSheetData }> = ({
  data,
}) => {
  const assets = data.items.filter(
    (item) =>
      !item.name.toLowerCase().includes("liabilities") &&
      !item.name.toLowerCase().includes("creditors") &&
      !item.name.toLowerCase().includes("capital")
  );

  const liabilities = data.items.filter(
    (item) =>
      item.name.toLowerCase().includes("liabilities") ||
      item.name.toLowerCase().includes("creditors") ||
      item.name.toLowerCase().includes("capital")
  );

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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold mb-2">Assets</h3>
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
            <tr className="bg-gray-400">
              <th className="py-2 pl-2">Account</th>
              <th className="py-2 text-right pr-2">Amount</th>
            <tr>
              <th className="border-b-2 border-black py-2">Group Name</th>
              <th className="border-b-2 border-black py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item, index) => (
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
            {liabilities.map((item, index) => (
              <BalanceSheetRow key={`liability-${index}`} item={item} />
            ))}
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
      </div>
    </div>
  );
};

// Main component
const BalanceSheet = () => {
  const [data] = useState<BalanceSheetData>(initialData);
  const [isHorizontal, setIsHorizontal] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{data.companyName}</h1>
          <button
            onClick={() => setIsHorizontal(!isHorizontal)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
          >
            <ArrowLeftRight size={16} />
            {isHorizontal ? "Vertical Format" : "Horizontal Format"}
          </button>
        </div>

        <h2 className="text-center text-lg mb-2">Balance Sheet</h2>
        <p className="text-center mb-4">As of {data.date}</p>

        {isHorizontal ? (
          <HorizontalBalanceSheet data={data} />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="py-2 pl-2">Account</th>
                <th className="py-2 text-right pr-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <BalanceSheetRow key={index} item={item} />
              ))}
            </tbody>
          </table>
        )}

        {data.timestamp && (
          <p className="text-center mt-4">Accrual basis {data.timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default BalanceSheet;
