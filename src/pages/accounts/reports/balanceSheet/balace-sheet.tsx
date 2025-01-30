import {MouseEventHandler,useCallback,useEffect,useRef,useState} from "react";
import { APIClient } from "../../../../helpers/api-client";
import ErpGridGlobalFilter from "../../../../components/ERPComponents/erp-grid-global-filter";
import BalanceSheetFilter, {BalanceSheetFilterInitialState} from "./balance-sheet-filter";
import Urls from "../../../../redux/urls";
import "./Loader.css";
import LoadingPopup from "./LoadingPopup";
import {EllipsisVertical,FileText,FileUp,Printer,RectangleVertical,X} from "lucide-react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import BalancesheetDetails from "./balancesheet-details";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import ExcelJS from "exceljs";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";
import { PDFDownloadLink, BlobProvider, PDFViewer } from '@react-pdf/renderer';
import BalanceSheetVerticalTemplate from "../../../InvoiceDesigner/DownloadPreview/balance-sheet/balance-sheet-vertical";
import BalanceSheetPDFTemplate from "./balance-sheet-horizontal-pdf";
import { useSelector } from "react-redux";

const api = new APIClient();
const BalanceSheetRow: React.FC<{
  item: any;
  setIsOpenDetails: (data: any) => void;
}> = ({ item, setIsOpenDetails }) => {
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");
  const userSession =  useSelector((state: RootState) => (state.UserSession));
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    setIsOpenDetails({
      isOpen: true,
      key: item.groupID,
      groupName: item.groupName,
      item: item,
    });
  };
  return (
    <tr>
      <td
        className={`py-2 ${
          item.title == "M"
            ? "text-[#3b82f6]"
            : item.groupName == "TOTAL"
            ? "text-[#FF0000]"
            : "dark:text-dark-text text-[#03070f]"
        }`}
        style={{
          paddingLeft:
            item.title == "M" || item.groupName == "TOTAL" ? "0px" : "20px",
          fontWeight:
            item.title == "M" || item.groupName == "TOTAL" ? "bold" : "normal",
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
            className={`py-2 hover:text-[#1d4ed8] ${
              item.title == "M"
                ? "text-[#3b82f6]"
                : item.groupName == "TOTAL"
                ? "text-[#FF0000]"
                : "dark:text-dark-text text-[#03070f]"
            }`}
            style={{
              paddingRight:
                item.title == "M" || item.groupName == "TOTAL" ? "0px" : "20px",
              fontWeight:
                item.title == "M" || item.groupName == "TOTAL"
                  ? "bold"
                  : "normal",
            }}
          >
            {`${
              item.transType == "L"
                ? item.title == "M"
                  ? getFormattedValue(item.total)
                  : item.total > 0
                  ? "(-)" + getFormattedValue(item.total)
                  : item.total === 0
                  ? getFormattedValue(0)
                  : getFormattedValue(-1 * item.total)
                : item.title == "M"
                ? getFormattedValue(item.total)
                : item.total < 0
                ? "(-)" + getFormattedValue(-1 * item.total)
                : item.total === 0
                ? getFormattedValue(0)
                : getFormattedValue(item.total)
            }`}
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
  const assets = data?.filter(
    (item: any) => item?.transType === "A" && item?.groupName !== "TOTAL"
  );
  const liabilities = data?.filter(
    (item: any) => item?.transType === "L" && item?.groupName !== "TOTAL"
  );
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const assetTotal =
    data?.find(
      (item: any) => item?.transType === "A" && item?.groupName === "TOTAL"
    )?.total || 0;
  const liabilityTotal =
    data?.find(
      (item: any) => item?.transType === "L" && item?.groupName === "TOTAL"
    )?.total || 0;

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="dark:bg-dark-bg-header bg-gray-400">
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
              <tr className="dark:bg-dark-bg-header bg-gray-400">
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
        <div className="grid grid-cols-2 dark:bg-dark-bg-header bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">
            {getFormattedValue(liabilityTotal)}
          </h6>
        </div>
        <div className="grid grid-cols-2 dark:bg-dark-bg-header bg-gray-50 p-2">
          <h6 className="text-sm font-bold text-[#f00]">Total</h6>
          <h6 className="text-sm font-bold text-[#f00] text-right">
            {getFormattedValue(assetTotal)}
          </h6>
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
    item?: any;
  }>({ isOpen: false, key: 0, item: {} });
  const userSession = useAppSelector(
    (state: RootState) => state.UserSession as any
  );
  const { t } = useTranslation("accountsReport");
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
    if (res != undefined && res.isOk != undefined && res.isOk == false) {
      setFilterValidations(res.validations);
      setShowFilter((prev: any) => {
        return true;
      });
    } else {
      setFilterValidations(undefined);
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
    1;
    if (filterShowCount === 0) {
      setFilter({});
      setFilterShowCount((prev) => prev + 1);
    }
    setShowFilter(false);
  }, [filterShowCount]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getFormattedValue } = useNumberFormat();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
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

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Balance Sheet");
  
    // Add page title
    const pageTitle = `Balance Sheet - As of ${new Date(
      filter.asonDate
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })}`;
  
    // Merge cells for the title
    const lastColumnLetter = String.fromCharCode(64 + 4); // Assuming 4 columns (A, B, C, D)
    let mergeRange = `A1:${lastColumnLetter}1`;
    worksheet.mergeCells(mergeRange);
    worksheet.getCell(`A1`).value = pageTitle;
    worksheet.getCell(`A1`).font = { bold: true, size: 12 };
    worksheet.getCell(`A1`).alignment = { horizontal: "left" };
  
    let currentRow = 2; // Start from row 2 after the title
  
    // Add header footer information from userSession
    if (
      userSession.headerFooter != undefined &&
      !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading7)
    ) {
      mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
      worksheet.mergeCells(mergeRange);
      worksheet.getCell(`A${currentRow}`).value =
        userSession.headerFooter.heading7;
      worksheet.getCell(`A${currentRow}`).font = {
        bold: true,
        size: 13,
      };
      worksheet.getCell(`A${currentRow}`).alignment = {
        horizontal: "left",
      };
      currentRow += 1;
    }
    if (
      userSession.headerFooter != undefined &&
      !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading8)
    ) {
      mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
      worksheet.mergeCells(mergeRange);
      worksheet.getCell(`A${currentRow}`).value =
        userSession.headerFooter.heading8;
      worksheet.getCell(`A${currentRow}`).font = { size: 9 };
      worksheet.getCell(`A${currentRow}`).alignment = {
        horizontal: "left",
      };
      currentRow += 1;
    }
    if (
      userSession.headerFooter != undefined &&
      !isNullOrUndefinedOrEmpty(userSession.headerFooter.heading9)
    ) {
      mergeRange = `A${currentRow}:${lastColumnLetter}${currentRow}`;
      worksheet.mergeCells(mergeRange);
      worksheet.getCell(`A${currentRow}`).value =
        userSession.headerFooter.heading9;
      worksheet.getCell(`A${currentRow}`).font = { size: 9 };
      worksheet.getCell(`A${currentRow}`).alignment = {
        horizontal: "left",
      };
      currentRow += 1;
    }
  
    // Headers
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);
    const headers = [
      { header: "Liabilities", key: "liabilities" },
      { header: "Amount", key: "liabilitiesAmount" },
      { header: "Assets", key: "assets" },
      { header: "assetsAmount", key: "assetsAmount" },
    ];
    worksheet.getRow(currentRow).values = ["Liabilities", "Amount", "Assets", "Amount"];
    worksheet.getRow(currentRow).font = { bold: true };
    worksheet.getRow(currentRow).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
    currentRow += 1;
  
    // Filter and prepare data
    const assets = data.filter(
      (item) => item?.transType === "A" && item?.groupName !== "TOTAL"
    );
    const liabilities = data.filter(
      (item) => item?.transType === "L" && item?.groupName !== "TOTAL"
    );
    const maxLength = Math.max(assets.length, liabilities.length);
  
    // Add data rows
    for (let i = 0; i < maxLength; i++) {
      if (liabilities[i]) {
        worksheet.getCell(`A${currentRow}`).value = liabilities[i].groupName;
        worksheet.getCell(`B${currentRow}`).value =
          liabilities[i].transType == "L"
            ? liabilities[i].title == "M"
              ? getFormattedValue(liabilities[i].total)
              : liabilities[i].total > 0
              ? "(-)" + getFormattedValue(liabilities[i].total)
              : liabilities[i].total === 0
              ? getFormattedValue(0)
              : getFormattedValue(-1 * liabilities[i].total)
            : liabilities[i].title == "M"
            ? getFormattedValue(liabilities[i].total)
            : liabilities[i].total < 0
            ? "(-)" + getFormattedValue(-1 * liabilities[i].total)
            : liabilities[i].total === 0
            ? getFormattedValue(0)
            : getFormattedValue(liabilities[i].total);
  
        if (liabilities[i].title === "M") {
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
          };
          worksheet.getCell(`B${currentRow}`).alignment = {
            horizontal: "right",
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
  
      if (assets[i]) {
        worksheet.getCell(`C${currentRow}`).value = assets[i].groupName;
        worksheet.getCell(`D${currentRow}`).value =
          assets[i].transType == "L"
            ? assets[i].title == "M"
              ? getFormattedValue(assets[i].total)
              : assets[i].total > 0
              ? "(-)" + getFormattedValue(assets[i].total)
              : assets[i].total === 0
              ? getFormattedValue(0)
              : getFormattedValue(-1 * assets[i].total)
            : assets[i].title == "M"
            ? getFormattedValue(assets[i].total)
            : assets[i].total < 0
            ? "(-)" + getFormattedValue(-1 * assets[i].total)
            : assets[i].total === 0
            ? getFormattedValue(0)
            : getFormattedValue(assets[i].total);
  
        if (assets[i].title === "M") {
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
          };
          worksheet.getCell(`D${currentRow}`).alignment = {
            horizontal: "right",
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
        data.find((item) => item?.transType === "L" && item?.groupName === "TOTAL")
          ?.total
      ) || 0;
    worksheet.getCell(`C${totalRow}`).value = "Total";
    worksheet.getCell(`D${totalRow}`).value =
      getFormattedValue(
        data.find((item) => item?.transType === "A" && item?.groupName === "TOTAL")
          ?.total
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
    };
    worksheet.getCell(`B${totalRow}`).alignment = {
      horizontal: "right",
    };
    worksheet.getCell(`C${totalRow}`).alignment = {
      horizontal: "left",
    };
    worksheet.getCell(`D${totalRow}`).alignment = {
      horizontal: "right",
    };
  
    // Set column widths
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });
  
    // Format amounts as numbers
    ["B", "D"].forEach((col) => {
      worksheet.getColumn(col).numFmt = "#,##0.00";
    });
  
    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BalanceSheet.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="p-6 dark:bg-dark-bg bg-white">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="max-w-full mx-2">
        <div className="flex items-center p-1  border border-gray-300 rounded-md mb-4 justify-between">
          {/* <h6 className="text-center text-lg mb-4">Balance Sheet</h6> */}
          <div className="flex items-center ms-4 text-blue-500 cursor-pointer">
            {/* <span>Customise</span> */}
            <h6 className="text-center text-lg font-bold  mb-0">
              {t("balance_sheet")}
            </h6>
            <i className="fas fa-cog ms-1"></i>
          </div>

          <div className="flex items-center ms-auto space-x-2">
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
            <div
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
            </div>

            <button className="flex items-center dark:bg-dark-bg bg-gray-100 p-0 rounded-md">
              <ErpGridGlobalFilter
                width="w-full max-w-[500px]"
                gridId="gridBalanceSheet"
                initialData={BalanceSheetFilterInitialState}
                content={
                  <BalanceSheetFilter
                    getFieldProps={function (fieldName: string) {
                      throw new Error("Function not implemented.");
                    }}
                    handleFieldChange={function (
                      field: string | object,
                      value?: any
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                }
                toogleFilter={showFilter}
                onApplyFilters={(filters) => onApplyFilter(filters)}
                onOpened={(status: any) => setShowFilter(status)}
                onClose={onCloseFilter}
                validations={filterValidations}
                title={"Balance sheet"}
              />
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
            <button className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-md">

              <Printer className="pe-2" />
              <span>{t("print")}</span>
            </button>
          
            <div className="relative">
              <button
                className="flex items-center dark:bg-dark-bg-card bg-gray-100 p-2 rounded-full hover:bg-slate-300"
                ref={buttonRef}
              >
                {/* <i className="fas fa-file-export me-1"></i> */}
                <EllipsisVertical className="!w-4 !h-4" 
                 onClick={() => setIsPopupVisible(!isPopupVisible)}
                />
                {/* <span>{t("export")}</span> */}
              </button>

              {/* {isPopupVisible && (
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
                              <BalanceSheetPDFTemplate
                              getFormattedValue={getFormattedValue}
                                filter={filter}
                                data={data}
                              />
                            }
                          >
                            {({ blob, loading }) => (
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors rounded-sm"
                                disabled={loading} // Disable the button while loading
                                onClick={async () => {
                                  if (blob) {
                                    // Create a download link and trigger the download
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'BalanceSheet.pdf';
                                    a.click();
                                    URL.revokeObjectURL(url); // Clean up the URL object
                                  }
                                }}
                              >
                                <FileText className="pe-2" />
                                <span>{loading ? 'Loading document...' : t('export_to_pdf')}</span>
                              </button>
                            )}
                          </BlobProvider>
                        </li>
                    </ul>
                  </nav>
                </div>
              )} */}
            </div>
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
          As of{" "}
          {new Date(filter.asonDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
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
                  <tr className="dark:bg-dark-bg-header bg-gray-400">
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
      {isOpenDetails.key > 0 && (
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
              origin={"balancesheet"}
              groupName={"balancesheet"}
              rowData={isOpenDetails.item}
            />
          }
          postData={{
            ...filter,
            accGroupID: isOpenDetails.key,
          }}
        />
      )}

      <ERPModal
          isOpen={isPopupVisible}
          // title={t("bank_cards")}
          title={t("balance_sheet")}
          width="w-full max-w-[90%]"
          minHeight={1200}
          isForm={true}
          closeModal={() => {
            setIsPopupVisible(false)
          }}
    
          content={
                   <PDFViewer
                        className="pdf-viewer"
                        width="100%"
                        height={1200}
                        style={{ padding: "10px" }}
                      >
                          <BalanceSheetPDFTemplate
                           userSession={userSession}
                              getFormattedValue={getFormattedValue}
                                filter={filter}
                                data={data}
                              />
                      </PDFViewer>
          }
     
        />
    </div>
  );
};
export default BalanceSheet;
