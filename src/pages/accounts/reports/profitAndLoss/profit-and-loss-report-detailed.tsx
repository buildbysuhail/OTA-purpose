import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { APIClient } from "../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../components/ERPComponents/erp-grid-global-filter";
import Urls from "../../../../redux/urls";
import "../balanceSheet/Loader.css";
import {
  Clock1,
  EllipsisVertical,
  FileDown,
  FileText,
  FileUp,
  Forward,
  Printer,
  RectangleVertical,
  X,
} from "lucide-react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import ProfitAndLossReportFilter, {
  ProfitAndLossReportFilterInitialState,
} from "./profit-and-loss-report-filter";
import LoadingPopup from "../balanceSheet/LoadingPopup";
import ProfitAndLossSubledgerwiseView from "./profit-and-loss-sub-ledger-view";
import ProfitAndLossClosingStockDetails from "./profit-and-loss-closing-stock-details";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ExcelJS from "exceljs";
import { BlobProvider } from "@react-pdf/renderer";
import { userSession } from "../../../../redux/slices/user-session/thunk";
import BalanceSheetPDFTemplate from "../balanceSheet/balance-sheet-pdf/balance-sheet-horizontal-pdf";
import BalanceSheetVerticalPDFTemplate from "../balanceSheet/balance-sheet-pdf/balance-sheet-vertical-pdf";
import ProfitAndLossPDFTemplate from "./profit-and-loss-horizontal-pdf";
import ProfitAndLossVerticalPDFTemplate from "./profit-and-loss-vertical-pdf";
import ProfitAndLossDetailedPDFTemplate from "./profit-and-loss-detailed-horizontal-pdf ";
import ProfitAndLossDetailedVerticalPDFTemplate from "./profit-and-loss-detailed-vertical-pdf";
const api = new APIClient();
const ProfitAndLossRow: React.FC<{
  item: any;
  setIsOpenDetails: (isOpen: any) => void;
}> = ({ item, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    setIsOpenDetails({
      isOpen: true,
      key: item.groupID,
      groupName: item.groupName,
      item: item,
      title: item.title,
    });
  };

  return (
    <tr>
      <td
        className={`py-2 ${
          item.title == "M"
            ? "text-[#8B4513]"
            : item.title == "L" || item.title == "G"
            ? ""
            : item.groupName == "TOTAL"
            ? "text-sm font-bold text-[#f00]"
            : "text-[#3b82f6]"
        }`}
        style={{
          paddingLeft:
            item.title == "M" ? "0px" : item.title == "G" ? "50px" : "20px",
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
            className={`py-2 hover:text-[#1d4ed8] ${
              item.title == "M"
                ? "text-[#8B4513]"
                : item.title == "L" || item.title == "G"
                ? ""
                : item.groupName == "TOTAL"
                ? "text-sm font-bold text-[#f00]"
                : "text-[#3b82f6]"
            }`}
            style={{
              paddingRight:
                item.title == "M"
                  ? "0px"
                  : item.title == ""
                  ? "50px"
                  : item.title == "L"
                  ? "100px"
                  : "100px",
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
const goToPreviousPage = () => {
  window.history.back();
};
// Horizontal format component
const HorizontalProfitAndLoss: React.FC<{
  data: any[];
  setIsOpenDetails: any;
}> = ({ data, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");
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
              <tr className="dark:bg-dark-bg-header bg-gray-400">
                <th className="py-2 ps-2">{t("expense")}</th>
                <th className="py-2 text-end pe-2">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {expense
                ?.filter((x) => x.groupName != "TOTAL")
                .map((item: any, index: number) => (
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
              <tr className="dark:bg-dark-bg-header bg-gray-400">
                <th className="py-2 ps-2">{t("income")}</th>
                <th className="py-2 text-end pe-2">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {income
                ?.filter((x) => x.groupName != "TOTAL")
                .map((item: any, index: number) => (
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
        <div className="grid grid-cols-2 dark:bg-dark-bg-header bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">
            {getFormattedValue(
              data?.find(
                (item: any) =>
                  item?.transType === "E" && item?.groupName === "TOTAL"
              )?.total || 0
            )}
          </h6>
        </div>
        <div className="grid grid-cols-2 dark:bg-dark-bg-header bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">
            {getFormattedValue(
              data?.find(
                (item: any) =>
                  item?.transType === "I" && item?.groupName === "TOTAL"
              )?.total || 0
            )}
          </h6>
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
  const [filterValidations, setFilterValidations] = useState();
  // const [isOpenDetails, setIsOpenDetails] = useState<{isOpen: boolean; key: number}>({isOpen:false,key:0});
  const [isOpenDetails, setIsOpenDetails] = useState<{
    isOpen: boolean;
    key: number;
    groupName?: string;
    title?: string;
    item?: any;
  }>({ isOpen: false, key: 0 });
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isVerticalView, setIsVerticalView] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is outside the popup AND not on the button
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (res != undefined && res.isOk != undefined && res.isOk == false) {
      setFilterValidations(res.validations);
      setShowFilter((prev: any) => {
        return true;
      });
    } else {
      setFilterValidations(undefined);
      // setShowFilter(false);
    }
    setData(res?.data || []);
    setLoading(false);
  };

  const onApplyFilter = async (_filter: any) => {
    setShowFilter(false);
    setFilter({ ..._filter });
    await LoadAsync(_filter);
  };

  const onCloseFilter = useCallback(() => {
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const goToPreviousPage = () => {
    window.history.back();
  };
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Profit And Loss");

    // Add title and date
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `From
    ${new Date(filter.fromDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })}
    to
    ${new Date(filter.toDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })}`;

    // `As of ${new Date(filter.asonDate).toLocaleDateString(
    //   "en-US",
    //   {
    //     year: "numeric",
    //     month: "long",
    //     day: "2-digit",
    //   }
    // )}`;
    titleCell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    titleCell.font = { bold: true };

    // Headers
    worksheet.mergeCells("A3:B3");
    worksheet.mergeCells("C3:D3");
    const headers = [
      { header: "Expense", key: "expense" },
      { header: "Amount", key: "expenseAmount" },
      { header: "Income", key: "income" },
      { header: "Amount", key: "incomeAmount" },
    ];
    worksheet.getRow(3).values = ["Expense", "Amount", "Income", "Amount"];
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    // Filter and prepare data
    const expense = data.filter(
      (item) => item?.transType === "E" && item?.groupName !== "TOTAL"
    );
    const income = data.filter(
      (item) => item?.transType === "I" && item?.groupName !== "TOTAL"
    );
    const maxLength = Math.max(expense.length, income.length);

    // Add data rows
    let currentRow = 4;

    // Add Capital Accounts section
    // const capitalAccounts = expense.filter(
    //   (item) => item.title === "M" && item.groupName === "Capital Accounts"
    // );
    // if (capitalAccounts.length > 0) {
    //   worksheet.getCell(`A${currentRow}`).value = "Capital Accounts";
    //   worksheet.getCell(`B${currentRow}`).value = capitalAccounts[0].total;
    //   worksheet.getCell(`A${currentRow}`).font = {
    //     color: { argb: "3b82f6" },
    //     bold: true,
    //   };
    //   worksheet.getCell(`B${currentRow}`).font = {
    //     color: { argb: "3b82f6" },
    //     bold: true,
    //   };
    //   currentRow++;
    // }

    // Add data rows with proper formatting
    for (let i = 0; i < maxLength; i++) {
      if (expense[i]) {
        worksheet.getCell(`A${currentRow}`).value = expense[i].groupName;

        worksheet.getCell(`B${currentRow}`).value = getFormattedValue(
          expense[i].total
        );

        if (expense[i].title === "M") {
          worksheet.getCell(`A${currentRow}`).font = {
            bold: true,
            color: { argb: "3b82f6" },
          };
          worksheet.getCell(`B${currentRow}`).font = {
            bold: true,
            color: { argb: "3b82f6" },
          };
          worksheet.getCell(`A${currentRow}`).alignment = {
            horizontal: "left",
            // indent: 2,
          };
          worksheet.getCell(`B${currentRow}`).alignment = {
            horizontal: "right",
            // indent: 2,
          };
        } else {
          worksheet.getCell(`A${currentRow}`).font = {
            color: { argb: "000000" },
          };
          worksheet.getCell(`B${currentRow}`).font = {
            color: { argb: "000000" },
          };
          worksheet.getCell(`A${currentRow}`).alignment = {
            horizontal: "left",
            indent: 2,
          };
          worksheet.getCell(`B${currentRow}`).alignment = {
            horizontal: "right",
            indent: 2,
          };
        }
      }

      if (income[i]) {
        worksheet.getCell(`C${currentRow}`).value = income[i].groupName;

        worksheet.getCell(`D${currentRow}`).value = getFormattedValue(
          income[i].total
        );
        // assets[i].transType == "E"
        // ? assets[i].title == "M"
        //   ?getFormattedValue(assets[i].total)
        //   : assets[i].total > 0
        //   ? "(-)" +getFormattedValue(assets[i].total)
        //   : assets[i].total === 0
        //   ? getFormattedValue(0)
        //   : getFormattedValue(-1 * assets[i].total)

        // : assets[i].title == "M"
        // ?getFormattedValue(assets[i].total)
        // : assets[i].total < 0
        // ? "(-)" + getFormattedValue(-1 * assets[i].total)
        // : assets[i].total === 0
        // ? getFormattedValue(0)
        // : getFormattedValue(assets[i].total);

        if (income[i].title === "M") {
          worksheet.getCell(`C${currentRow}`).font = {
            bold: true,
            color: { argb: "3b82f6" },
          };

          worksheet.getCell(`D${currentRow}`).font = {
            bold: true,
            color: { argb: "3b82f6" },
          };
          worksheet.getCell(`C${currentRow}`).alignment = {
            horizontal: "left",
            // indent: 2,
          };
          worksheet.getCell(`D${currentRow}`).alignment = {
            horizontal: "right",
            // indent: 2,
          };
        } else {
          worksheet.getCell(`C${currentRow}`).font = {
            color: { argb: "000000" },
          };
          worksheet.getCell(`D${currentRow}`).font = {
            color: { argb: "000000" },
          };
          worksheet.getCell(`C${currentRow}`).alignment = {
            horizontal: "left",
            indent: 2,
          };
          worksheet.getCell(`D${currentRow}`).alignment = {
            horizontal: "right",
            indent: 2,
          };
        }
      }
      currentRow++;
    }

    // Add totals
    const totalRow = currentRow;
    worksheet.getCell(`A${totalRow}`).value = "Total";
    worksheet.getCell(`B${totalRow}`).value =
      getFormattedValue(
        data.find(
          (item) => item?.transType === "I" && item?.groupName === "TOTAL"
        )?.total
      ) || 0;
    worksheet.getCell(`C${totalRow}`).value = "Total";
    worksheet.getCell(`D${totalRow}`).value =
      getFormattedValue(
        data.find(
          (item) => item?.transType === "E" && item?.groupName === "TOTAL"
        )?.total
      ) || 0;

    // Format totals row
    ["A", "B", "C", "D"].forEach((col) => {
      worksheet.getCell(`${col}${totalRow}`).font = {
        bold: true,
        color: { argb: "FF0000" },
      };
    });
    worksheet.getCell(`A${totalRow}`).alignment = {
      horizontal: "left",
      // indent: 2,
    };
    worksheet.getCell(`B${totalRow}`).alignment = {
      horizontal: "right",
      // indent: 2,
    };
    worksheet.getCell(`C${totalRow}`).alignment = {
      horizontal: "left",
      // indent: 2,
    };
    worksheet.getCell(`D${totalRow}`).alignment = {
      horizontal: "right",
      // indent: 2,
    };
    // Set column widths
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    // Format amounts as numbers
    ["B", "D"].forEach((col) => {
      worksheet.getColumn(col).numFmt = "#,##0.00";
      // worksheet.getColumn(col).alignment = { horizontal: "right" };
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ProfitAndLossDetailed.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="p-6 dark:bg-dark-bg bg-white">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="max-w-full mx-2">
        <div className="flex items-center p-1  border dark:!border-dark-border border-gray-300 rounded-md mb-4">
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
              className={`flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out ${
                isVerticalView ? "h-12 w-[220px]" : "h-12 w-[215px]"
              }`}
            >
              <div
                className="flex justify-center items-center w-8 h-8"
                style={{
                  minWidth: "2rem",
                  minHeight: "2rem",
                }} /* Ensures consistent dimensions */
              >
                <div
                  className={`transition-transform duration-500 ${
                    isVerticalView ? "rotate-0" : "rotate-90"
                  }`}
                >
                  <RectangleVertical />
                </div>
              </div>
              <span className="ml-2">
                {isVerticalView ? t("show_horizontal") : t("show_vertical")}
              </span>
              <div className="relative inline-block w-12 h-6 ml-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out transform checked:translate-x-6"
                  checked={isVerticalView}
                  onChange={() => setIsVerticalView(!isVerticalView)}
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block h-6 w-full bg-gray-300 rounded-full cursor-pointer transition-colors duration-300 ease-in-out checked:bg-blue-500"
                ></label>
              </div>
            </button>

            <button className="flex items-center dark:bg-dark-bg bg-gray-100 p-0 rounded-md">
              <ErpGridGlobalFilter
                width="w-full max-w-[500px]"
                gridId="gridPandL_detailed"
                initialData={ProfitAndLossReportFilterInitialState}
                content={<ProfitAndLossReportFilter />}
                toogleFilter={showFilter}
                onApplyFilters={(filters) => onApplyFilter(filters)}
                onClose={onCloseFilter}
                validations={filterValidations}
                onOpened={(status: any) => setShowFilter(status)}
                title={"Profit and Loss Detailed"}
              />
            </button>
            <button className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-share-alt me-1"></i> */}
              <Forward className="pe-2" />
              <span>{t("share")}</span>
              <span className="ms-1 bg-[#3b82f6] text-white rounded-full px-2">
                0
              </span>
            </button>
            <button className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-clock me-1"></i> */}
              <Clock1 className="pe-2" />
              <span>{t("schedule_report")}</span>
            </button>
            <button className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md">
              {/* <i className="fas fa-print me-1"></i> */}
              <Printer className="pe-2" />
              <span>{t("print")}</span>
            </button>

            <div className="relative">
              <button
                className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-full hover:bg-slate-300"
                ref={buttonRef}
              >
                {/* <i className="fas fa-file-export me-1"></i> */}
                <EllipsisVertical
                  className="!w-4 !h-4"
                  onClick={() => setIsPopupVisible(!isPopupVisible)}
                />
                {/* <span>{t("export")}</span> */}
              </button>

              {isPopupVisible && (
                <div
                  ref={popupRef} // Attach ref to the popup
                  className="absolute  rounded-sm dark:bg-dark-bg dark:text-dark-text  bg-gray-100 shadow-lg p-4 z-50 "
                  style={{
                    top: "100%", // Position the popup right below the button
                    left: "-139px", // Align it with the left edge of the button
                    width: "221px", // Set your desired width
                    marginTop: "8px", // Add some spacing between the button and the popup
                  }}
                >
                  <nav className="w-full dark:bg-dark-bg dark:text-dark-text  bg-gray-100 text-black">
                    <ul className="space-y-1">
                      <li>
                        <button
                          className="w-full flex items-center px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                          onClick={handleExport}
                        >
                          <FileUp className="pe-2" />
                          <span>{t("export_to_excel")}</span>
                        </button>
                      </li>
                      <li>
                        <BlobProvider
                          document={
                            !isVerticalView ? (
                              <ProfitAndLossDetailedPDFTemplate
                                userSession={userSession}
                                getFormattedValue={getFormattedValue}
                                filter={filter}
                                data={data}
                              />
                            ) : (
                              <ProfitAndLossDetailedVerticalPDFTemplate
                                userSession={userSession}
                                getFormattedValue={getFormattedValue}
                                filter={filter}
                                data={data}
                              />
                            )
                          }
                        >
                          {({ blob, loading }) => (
                            <button
                              className="w-full flex items-center px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                              disabled={loading}
                              onClick={async () => {
                                if (blob) {
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = "ProfitAndLoss.pdf";
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }
                              }}
                            >
                              <FileText className="pe-2" />
                              <span>
                                {loading
                                  ? "Loading document..."
                                  : t("export_to_pdf")}
                              </span>
                            </button>
                          )}
                        </BlobProvider>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>

            <button
              className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md"
              onClick={handleExport}
            >
              {/* <i className="fas fa-file-export me-1"></i> */}
              <FileDown className="pe-2" />
              <span>{t("export")}</span>
            </button>
            <button
              onClick={goToPreviousPage}
              className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md"
            >
              {/* <i className="fas fa-times"></i> */}
              {/* <Timer /> */}
              <X />
            </button>
          </div>
        </div>
        {/* <h1 className="text-center text-xl font-bold mb-2">UK Company</h1> */}
        {/* <h2 className="text-center text-lg mb-4">Balance Sheet</h2> */}
        <p className="text-center mb-4">
          From{" "}
          {new Date(filter.fromDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}{" "}
          to{" "}
          {new Date(filter.toDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
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
                  <tr className="dark:bg-dark-bg-header bg-gray-400">
                    <th className="py-2 ps-2">{t("account")}</th>
                    <th className="py-2 text-end pe-2">{t("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
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
      {isOpenDetails.isOpen == true &&
        isOpenDetails.item !== undefined &&
        isOpenDetails.item !== null &&
        isOpenDetails.key !== 0 &&
        isOpenDetails.key !== -400 && (
          <ERPModal
            isOpen={
              isOpenDetails.isOpen &&
              isOpenDetails.item !== undefined &&
              isOpenDetails.item !== null
            }
            // title={t("bank_cards")}
            title={
              isOpenDetails.key == -500
                ? "Inventory Value"
                : isOpenDetails.title === "L"
                ? "Ledger Report monthview"
                : "Account Ledger"
            }
            width={
              isOpenDetails.key == -500
                ? "w-full max-w-[500px]"
                : "max-w-[1200px]"
            }
            isForm={true}
            closeModal={() => {
              setIsOpenDetails({ isOpen: false, key: 0, item: undefined });
            }}
            content={
              isOpenDetails.key == -500 ? (
                <ProfitAndLossClosingStockDetails
                  postData={{
                    fromDate: filter.fromDate,
                    toDate: filter.toDate,
                    valuationUsing: filter.valuationUsing,
                  }}
                  groupName={isOpenDetails.groupName}
                />
              ) : isOpenDetails.title === "L" ? (
                <CashBookMonthWise groupName={isOpenDetails.groupName} />
              ) : (
                <ProfitAndLossSubledgerwiseView
                  postData={{
                    accGroupID: isOpenDetails.key,
                    expAccGroupID:
                      isOpenDetails.key === 19
                        ? 23
                        : isOpenDetails.key === 10
                        ? 26
                        : 0,
                    dateFrom: filter.fromDate,
                    asOnDate: filter.toDate,
                    isDateForm: true,
                  }}
                  groupName={isOpenDetails.groupName}
                />
              )
            }
            postData={
              isOpenDetails.key == -500
                ? {
                    fromDate: filter.fromDate,
                    toDate: filter.toDate,
                    valuationUsing: filter.valuationUsing,
                  }
                : isOpenDetails.title === "L"
                ? {
                    asOnDate: filter.toDate,
                    ledgerID: isOpenDetails.key,
                    fromDate: filter.fromDate,
                  }
                : {
                    accGroupID: isOpenDetails.key,
                    expAccGroupID:
                      isOpenDetails.key === 19
                        ? 23
                        : isOpenDetails.key === 10
                        ? 26
                        : 0,
                    dateFrom: filter.fromDate,
                    asOnDate: filter.toDate,
                    isDateForm: true,
                  }

              // accGroupID: isOpenDetails.key,
              // expAccGroupID:isOpenDetails.key===19?23:isOpenDetails.key===10?26:0,
              // dateFrom: filter.fromDate,
            }
            rowData={isOpenDetails.item}
            origin="PandL"
          />
        )}
    </div>
  );
};

export default ProfitAndLossDetailedReport;
