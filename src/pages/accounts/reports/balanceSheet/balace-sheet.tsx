import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, { BalanceSheetFilterInitialState, } from "./balance-sheet-filter";
import Urls from "../../../../redux/urls";
import "./Loader.css";
import LoadingPopup from "./LoadingPopup";
import { Clock1, FileDown, Forward, Printer, RectangleVertical, X, } from "lucide-react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import BalancesheetDetails from "./balancesheet-details";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const api = new APIClient();
const BalanceSheetRow: React.FC<{
  item: any;
  setIsOpenDetails: (data: any) => void;
}> = ({ item, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    debugger;

    setIsOpenDetails({
      isOpen: true,
      key: item.groupID,
      groupName: item.groupName,
      item: item
    });
  };
  return (
    <tr>
      <td className={`py-2 ${item.title == "M" ? "text-[#3b82f6]" : item.groupName == "TOTAL" ? "text-[#FF0000]" : "text-[#03070f]"}`}
        style={{
          paddingLeft: item.title == "M" || item.groupName == "TOTAL" ? "0px" : "20px",
          fontWeight: item.title == "M" || item.groupName == "TOTAL" ? "bold" : "normal",
        }}>
        <a href="#" onClick={handleClick} className="hover:text-[#1d4ed8]">
          {item.groupName}
        </a>
      </td>
      {item.total !== undefined && (
        <td className="py-2 text-end">
          <a href="#" className={`py-2 hover:text-[#1d4ed8] ${item.title == "M" ? "text-[#3b82f6]" : item.groupName == "TOTAL" ? "text-[#FF0000]" : "text-[#03070f]"}`}
            style={{
              paddingRight: item.title == "M" || item.groupName == "TOTAL" ? "0px" : "20px",
              fontWeight: item.title == "M" || item.groupName == "TOTAL" ? "bold" : "normal",
            }}>
          {`${item.transType == "L" 
  ? (item.title == "M"
      ? getFormattedValue(item.total)
      : item.total > 0
        ? '(-)' + getFormattedValue(item.total)
        : item.total === 0
          ? getFormattedValue(0)
          : getFormattedValue(-1 * item.total))
  : (item.title == "M"
      ? getFormattedValue(item.total)
      : item.total < 0
        ? '(-)' + getFormattedValue(-1 * item.total)
        : item.total === 0
          ? getFormattedValue(0)
          : getFormattedValue(item.total))}`}

          </a>
        </td>
      )}
    </tr>
  );
};

const goToPreviousPage = () => {
  window.history.back();
};

// Horizontal format component
const HorizontalBalanceSheet: React.FC<{
  data: any;
  setIsOpenDetails: any;
}> = ({ data, setIsOpenDetails }) => {
  const assets = data?.filter((item: any) =>
    item?.transType === "A" && item?.groupName !== "TOTAL"
  );
  const liabilities = data?.filter((item: any) =>
    item?.transType === "L" && item?.groupName !== "TOTAL"
  );
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat();

  const assetTotal = data?.find((item: any) =>
    item?.transType === "A" && item?.groupName === "TOTAL"
  )?.total || 0;
  const liabilityTotal = data?.find((item: any) =>
    item?.transType === "L" && item?.groupName === "TOTAL"
  )?.total || 0;

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="py-2 ps-2">{t("liabilities")}</th>
                <th className="py-2 text-end pe-2">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {liabilities?.map((item: any, index: number) => (
                <BalanceSheetRow
                  key={`liability-${index}`}
                  item={item}
                  setIsOpenDetails={(data: any) => {
                    setIsOpenDetails(data);

                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400">
                <th className="py-2 ps-2">{t("assets")}</th>
                <th className="py-2 text-end pe-2">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {assets?.map((item: any, index: number) => (
                <BalanceSheetRow
                  key={`asset-${index}`}
                  item={item}
                  setIsOpenDetails={(data: any) => {
                    setIsOpenDetails(data);

                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">{getFormattedValue(liabilityTotal)}</h6>
        </div>
        <div className="grid grid-cols-2 bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">{getFormattedValue(assetTotal)}</h6>
        </div>
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
  const [filterValidations, setFilterValidations] = useState();
  // const [isOpenDetails, setIsOpenDetails] = useState<{isOpen: boolean; key: number}>({isOpen:false,key:0});
  const [isOpenDetails, setIsOpenDetails] = useState<{
    isOpen: boolean;
    key: number;
    groupName?: string;
    item?: any
  }>({ isOpen: false, key: 0, item: {} });
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
      Urls.acc_reports_balance_sheet,
      _filter || filter
    );
    if (
      res != undefined &&
      res.isOk != undefined &&
      res.isOk == false
    ) {
      setFilterValidations(res.validations);
      setShowFilter((prev: any) => { return true });
    } else {
      setFilterValidations(undefined);
    }
    setData(res?.data || []);
    setLoading(false);
  };

  const onApplyFilter = async (_filter: any) => {
debugger;
    setShowFilter(false);
    setFilter({ ..._filter });
    await LoadAsync(_filter);
  };

  const onCloseFilter = useCallback(() => {1
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
              {t("balance_sheet")}
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
              onClick={() => setIsVerticalView(!isVerticalView)}>
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
                gridId="gridBalanceSheet"
                initialData={BalanceSheetFilterInitialState}
                content={<BalanceSheetFilter getFieldProps={function (fieldName: string) {
                  throw new Error("Function not implemented.");
                }} handleFieldChange={function (field: string | object, value?: any): void {
                  throw new Error("Function not implemented.");
                }} />}
                toogleFilter={showFilter}
                onApplyFilters={(filters) => onApplyFilter(filters)}
                onOpened={(status: any) => setShowFilter(status)}
                onClose={onCloseFilter} validations={filterValidations} title={"Balance sheet"} />
            </button>
            {/* <button className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-share-alt me-1"></i> */}
            {/* <Forward className="pe-2" /> */}
            {/* <span>{t("share")}</span> */}
            {/* <span className="ms-1 bg-[#3b82f6] text-white rounded-full px-2"> */}
            {/* 0 */}
            {/* </span> */}
            {/* </button> */}
            {/* <button className="flex items-center bg-gray-100 p-2 rounded-md"> */}
            {/* <i className="fas fa-clock me-1"></i> */}
            {/* <Clock1 className="pe-2" /> */}
            {/* <span>{t("schedule_report")}</span> */}
            {/* </button> */}
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
            <button onClick={goToPreviousPage} className="flex items-center bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-times"></i> */}
              {/* <Timer /> */}
              <X />
            </button>
          </div>
        </div>
        {/* <h1 className="text-center text-xl font-bold mb-2">UK Company</h1> */}
        {/* <h2 className="text-center text-lg mb-4">Balance Sheet</h2> */}
        <p className="text-center mb-4">
          As of {new Date(filter.asonDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })}
        </p>
        {/* <p className="text-center mb-4">As of {filter.asOnDate.toString("MMMM dd yyyy")}</p> */}
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
              <HorizontalBalanceSheet
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
                  {data?.map((item, index) => (
                    <BalanceSheetRow
                      key={index}
                      item={item ?? []}
                      setIsOpenDetails={(data: any) => {
                        setIsOpenDetails(data);

                      }}
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
      {/* {JSON.stringify(isOpenDetails.item)} */}
      {(isOpenDetails.key > 0 &&

        <ERPModal
          isOpen={isOpenDetails.isOpen}
          // title={t("bank_cards")}
          title={t("balance_sheet")}
          width="w-full max-w-[90%]"
          isForm={true}
          closeModal={() => {
            setIsOpenDetails({ isOpen: false, key: 0, item: {} });
          }}
          rowData={isOpenDetails.item}
          content={
            <BalancesheetDetails
              postData={{
                ...filter, accGroupID: isOpenDetails.key
              }}
              origin="balancesheet"
              groupName={isOpenDetails.groupName}
              rowData={isOpenDetails.item}
              
            />
          }

        />
      )}
    </div>
  );
};
export default BalanceSheet;