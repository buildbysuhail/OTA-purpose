import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../components/ERPComponents/erp-grid-global-filter";
import Urls from "../../../../redux/urls";
import "../balanceSheet/Loader.css";
// import LoadingPopup from "./LoadingPopup";
import { Clock1, FileDown, Forward, Printer, RectangleVertical, Timer, X } from "lucide-react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
// import BalancesheetDetails from "./balancesheet-details";
import { Link } from "react-router-dom";
import { t } from "i18next";
import ProfitAndLossReportFilter, { ProfitAndLossReportFilterInitialState } from "./profit-and-loss-report-filter";
import LoadingPopup from "../balanceSheet/LoadingPopup";
import ProfitAndLossSubledgerwiseView from "./profit-and-loss-sub-ledger-view";
import ProfitAndLossClosingStockDetails from "./profit-and-loss-closing-stock-details";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
// import { MouseEventHandler } from "@types/react";

const api = new APIClient();
const ProfitAndLossRow: React.FC<{
  item: any;
  setIsOpenDetails: (isOpen: any) => void;
}> = ({ item, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    setIsOpenDetails({
      isOpen: true,
      key: item.groupID,
      groupName: item.groupName,
    });
  };

  return (
    <tr>
      <td
        className={`py-2 ${item.title == "M" ? "text-[#8B4513]" : item.title == "L" || item.title == "G" ? "" : item.groupName == "TOTAL" ? "text-[#FF0000]" : "text-[#3b82f6]"
          }`}
        style={{
          paddingLeft: item.title == "M" ? "0px" : item.title == "G" ? "50px" : "20px",
          fontWeight: item.title == "M" ? "bold" : "normal",
        }}
      >
        <a href="#" onClick={handleClick} className="hover:text-[#1d4ed8]">
          {item.groupName}
        </a>
      </td>
      {item.total !== undefined && (
        <td className="py-2 text-end">
          <a
            href="#"
            // onClick={handleClick}
            className={`py-2 hover:text-[#1d4ed8] ${item.title == "M" ? "text-[#8B4513]" : item.title == "L" || item.title == "G" ? "" : item.groupName == "TOTAL" ? "text-[#FF0000]" : "text-[#3b82f6]"
              }`}
            style={{
              paddingRight: item.title == "M" ? "0px" : item.title == "" ? "50px" : item.title == "L" ? "100px" : "100px",
              fontWeight: item.title == "M" ? "bold" : "normal",
            }}
          // className="text-[#3b82f6] hover:text-[#1d4ed8]"
          >
            {getFormattedValue(item.total)}
          </a>
        </td>
      )}
    </tr>
  );
};

// Horizontal format component
const HorizontalProfitAndLoss: React.FC<{
  data: any[];
  setIsOpenDetails: any;
}> = ({ data, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation('accountsReport');
  const expense = data?.filter((item: any) => item?.transType == "E");

  const income = data?.filter((item: any) => item?.transType == "I");
  // const subLedger = data?.filter((item: any) => item?.ti == "L");

  return (
    <div className="relative">
    <div className="grid grid-cols-2 gap-4">
      <div>
        {/* <h3 className="text-lg font-bold mb-2">{t("expense")}</h3> */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="py-2 ps-2">{t("expense")}</th>
              <th className="py-2 text-end pe-2">{t("amount")}</th>
            </tr>
          </thead>
          <tbody>
            {expense?.filter(x=>x.groupName!="TOTAL").map((item: any, index: number) => (
              <ProfitAndLossRow
                key={`asset-${index}`}
                item={item}
                setIsOpenDetails={setIsOpenDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* <div>
        <h3 className="text-lg font-bold mb-2">{t("subLedger")}</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="py-2 ps-2">{t("subLedger")}</th>
              <th className="py-2 text-end pe-2">{t("amount")}</th>
            </tr>
          </thead>
          <tbody>
            {subLedger?.map((item: any, index: number) => (
              <ProfitAndLossRow
                key={`liability-${index}`}
                item={item}
                setIsOpenDetails={setIsOpenDetails}
              />
            ))}
          </tbody>
        </table>
      </div> */}
      <div>
        {/* <h3 className="text-lg font-bold mb-2">{t("income")}</h3> */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="py-2 ps-2">{t("income")}</th>
              <th className="py-2 text-end pe-2">{t("amount")}</th>
            </tr>
          </thead>
          <tbody>
            {income?.filter(x=>x.groupName!="TOTAL").map((item: any, index: number) => (
              <ProfitAndLossRow
                key={`liability-${index}`}
                item={item}
                setIsOpenDetails={setIsOpenDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">{getFormattedValue( data?.find((item: any) =>
    item?.transType === "E" && item?.groupName === "TOTAL"
  )?.total || 0)}</h6>
        </div>
        <div className="grid grid-cols-2 bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">{getFormattedValue( data?.find((item: any) =>
    item?.transType === "I" && item?.groupName === "TOTAL"
  )?.total || 0)}</h6>
        </div>
      </div>
    </div>
  );
};

const ProfitAndLossDetailedReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(ProfitAndLossReportFilterInitialState);
  const [filterShowCount, setFilterShowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  // const [isOpenDetails, setIsOpenDetails] = useState<{isOpen: boolean; key: number}>({isOpen:false,key:0});
  const [isOpenDetails, setIsOpenDetails] = useState<{
    isOpen: boolean;
    key: number;
    groupName?: string;
    title?: string;
  }>({ isOpen: false, key: 0 });
  const { t } = useTranslation('accountsReport');
  const [isVerticalView, setIsVerticalView] = useState<boolean>(false);

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
      Urls.acc_reports_profit_and_loss_detailed,
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
    <div className="p-6 bg-white">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="max-w-full mx-2">
        <div className="flex items-center p-1  border border-gray-300 rounded-md mb-4">
          {/* <h6 className="text-center text-lg mb-4">Balance Sheet</h6> */}
          <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
            {/* <span>Customise</span> */}
            <h6 className="text-center text-lg font-bold  mb-0">
              {t("profit_and_loss_account")}
            </h6>
            <i className="fas fa-cog ms-1"></i>
          </div>

          <div className="flex items-center ms-auto space-x-4">
            {/* <div className="flex items-center bg-gray-100 p-2 rounded-md ">
              <RectangleVertical />
              <p  className="pe-2">Show Vertical</p>
              <div className="">
                <label className="switch">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isVerticalView}
                    onChange={(e) => setIsVerticalView(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div> */}

            <button
              className="flex items-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setIsVerticalView(!isVerticalView)}
            >
              <RectangleVertical className="mr-2" />
              <span className="mr-2">
                {isVerticalView ? t("show_horizontal") : t("show_vertical")}
              </span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={isVerticalView}
                  onChange={() => setIsVerticalView(!isVerticalView)}
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </button>

            <button className="flex items-center bg-gray-100 p-0 rounded-md">
              <ErpGridGlobalFilter
                width="w-full max-w-[500px]"
                gridId="gridPandL_detailed"
                initialData={ProfitAndLossReportFilterInitialState}
                content={<ProfitAndLossReportFilter />}
                toogleFilter={showFilter}
                onApplyFilters={(filters) => onApplyFilter(filters)}
                onClose={onCloseFilter} validations={undefined} title={"Profit and Loss Detailed"}              />
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-share-alt me-1"></i> */}
              <Forward className="pe-2" />
              <span>{t("share")}</span>
              <span className="ms-1 bg-[#3b82f6] text-white rounded-full px-2">
                0
              </span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-clock me-1"></i> */}
              <Clock1 className="pe-2" />
              <span>{t("schedule_report")}</span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-print me-1"></i> */}
              <Printer className="pe-2" />
              <span>{t("print")}</span>
            </button>
            <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-file-export me-1"></i> */}
              <FileDown className="pe-2" />
              <span>{t("export")}</span>
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
        <p className="text-center mb-4">
          As of {new Date(filter.asOnDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })}
        </p>
        {loading ? (
          <>
            <div className="bg-white">
              <LoadingPopup loading={loading} />
            </div>
          </>
        ) : (
          <>
            {/* {filter.showVertical != true ? (
              <HorizontalBalanceSheet
                data={data ?? []}
                setIsOpenDetails={setIsOpenDetails}
              />
            ) : ( */}
            {!isVerticalView ? (
              <HorizontalProfitAndLoss
                data={data ?? []}
                setIsOpenDetails={setIsOpenDetails}
              />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-400">
                    <th className="py-2 ps-2">{t("account")}</th>
                    <th className="py-2 text-end pe-2">{t("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.filter(x=>x.groupName!="TOTAL").map((item, index) => (
                    <ProfitAndLossRow
                      key={index}
                      item={item ?? []}
                      setIsOpenDetails={setIsOpenDetails}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {/* <p className="text-center mt-4">
          Accrual basis Wednesday, 20 December 2023 11:30 am GMT+00:00
        </p> */}
      </div>
      {(isOpenDetails.key !== 0 && isOpenDetails.key !== -400 &&

        <ERPModal
          isOpen={isOpenDetails.isOpen}
          // title={t("bank_cards")}
          title="Account Report"
          width="w-full max-w-[90%]"
          isForm={true}
          closeModal={() => {
            setIsOpenDetails({ isOpen: false, key: 0 });
          }}
          content={
            isOpenDetails.key == -500 ?
              <ProfitAndLossClosingStockDetails
                postData={{
                  fromDate: filter.fromDate,
                  toDate: filter.toDate,
                  valuationUsing: filter.valuationUsing,
                }}
                groupName={isOpenDetails.groupName}
              /> : isOpenDetails.title == "L" ?
                <CashBookMonthWise
                  postData={{
                    // accGroupID: isOpenDetails.key,
                    // expAccGroupID:isOpenDetails.key===19?23:isOpenDetails.key===10?26:0,
                    // dateFrom: filter.fromDate,
                    asOnDate: filter.toDate,
                    ledgerID: isOpenDetails.key,
                  }}
                  groupName={isOpenDetails.groupName}
                /> :
                <ProfitAndLossSubledgerwiseView
                  postData={{
                    accGroupID: isOpenDetails.key,
                    expAccGroupID: isOpenDetails.key === 19 ? 23 : isOpenDetails.key === 10 ? 26 : 0,
                    dateFrom: filter.fromDate,
                    asOnDate: filter.toDate,
                    isDateForm: true,
                  }}
                  groupName={isOpenDetails.groupName}
                />
          }
        />
      )}
    </div>
  );
};

export default ProfitAndLossDetailedReport;
