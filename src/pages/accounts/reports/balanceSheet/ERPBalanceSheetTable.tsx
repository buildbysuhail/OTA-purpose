// import React, { Fragment, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { getCurrentCurrencySymbol } from "../../../../../utilities/Utils";

// function ERPBalanceSheetTable({ data, customizationData, hasBalanceSheet, reportLoading }: any) {
//   const CurrencySymbol = getCurrentCurrencySymbol();
//   const initialValue = data?.[0];
//   const [customizeData, setCustomizeData] = useState<any>({
//     report_code: "profit_and_loss",
//     account_type: "",
//     upto_date: "",
//     vendor_name: "",
//     group_by: "",
//     customer_name: "",
//     start_date: "",
//     end_date: "",
//     entities: [],
//     report_basic: "",
//     filter_accounts: "",
//     compare_basic: "",
//     compare_with: "",
//     number_of_period: null,
//     arrange_period_latest_to_oldest: true,
//     advance_filter: "",
//     item_id: [],
//     bill_statuses: "",
//     statuses: [],
//     stock_avilability: "",
//     aging_by: "",
//     aging_interval: "",
//     show_by: "",
//     interval_of_type: "",
//     interval_of: null,
//     transaction_type: "",
//     report_by: "",
//     is_transaction_trail_balance_table: false,
//   });
//   const dispatch = useDispatch();

//   const navigate = useNavigate();
//   const organizedData: any = [];
//   data &&
//     data.forEach((item: any) => {
//       if (!organizedData[item.parent_node]) {
//         organizedData[item.parent_node] = [];
//       }
//       organizedData[item.parent_node].push(item);
//     });

//   // Function to calculate the sums of balance_amount for each level 1 node for respective years
//   const calculateSumsForYears = (data: any) => {
//     const yearSums: any = {};

//     data?.forEach((node: any, index: any) => {
//       if (node.level === 1) {
//         const sumsForYear: Record<string, number> = {};

//         // Find all child nodes under this level 1 node until the next level 1 node appears
//         const childNodes: any = [];
//         let nextLevel1Index = data.findIndex((nextNode: any, i: any) => i > index && nextNode.level === 1);
//         if (nextLevel1Index === -1) {
//           nextLevel1Index = data.length; // If no next level 1 node, set it to the end
//         }

//         for (let i = index + 1; i < nextLevel1Index; i++) {
//           const childNode = data[i];
//           if (childNode.level > 1) {
//             childNodes.push(childNode);
//           }
//         }

//         node?.dates?.forEach((date: any) => {
//           let sumForYear = 0;

//           // Calculate the sum for each year
//           childNodes.forEach((childNode: any) => {
//             if (childNode.dates) {
//               const balanceForYear = childNode.dates.find((d: any) => d.date === date.date);
//               if (balanceForYear) {
//                 sumForYear += balanceForYear.balance_amount;
//               }
//             }
//           });

//           sumsForYear[date.date] = sumForYear;
//         });

//         yearSums[node.name] = sumsForYear;
//       }
//     });

//     return yearSums;
//   };

//   // Calling the sum of years function
//   const yearSums = calculateSumsForYears(data);

//   const renderTableCells = (nodeName: any) => {
//     return (
//       <>
//         <td className="py-6 text-sm font-semibold" style={{ paddingLeft: "20px" }}>
//           {nodeName}
//         </td>
//         {Object.values(yearSums[nodeName]).map((sum: any, idx: any) => (
//           <td key={idx} className="whitespace-nowrap text-center text-sm font-semibold">
//             {sum}
//           </td>
//         ))}
//       </>
//     );
//   };

//   // Individual Amount Calculator
//   const TotalFinder = (code: string) => {
//     let arr = data?.filter((h: any) => h?.account_code?.startsWith(code));
//     let revenue = data?.find((h: any) => h?.type === "revenue");

//     let sum = 0;
//     arr?.map((obj: any) => {
//       if (obj?.balance_amount != "") {
//         sum = sum + parseFloat(obj?.balance_amount);
//       }
//     });
//     return sum;
//   };

//   const shouldRenderCell = (item: any, customizationData: any) => {
//     const hideAccountName = item?.dates?.length > 0 && item.dates.every((date: any) => date.balance_amount === 0);

//     const isValidFilter = ["accounts_without_zero", "accounts_with_transactions"].includes(customizationData?.filter_accounts);

//     return isValidFilter ? item?.level < 3 || !hideAccountName : true;
//   };

//   const handleNavigation = (item: any) => {
//     const queryParams = new URLSearchParams({
//       account_code: item?.account_code,
//       title: item?.name,
//     }).toString();
//     if (item?.name === "Current Results") {
//       navigate(`/reports/profitandloss`);
//     } else {
//       navigate(`/reports/accounttransactions?${queryParams}`);
//     }
//   };

//   let currentParentLevel = -1;

//   useEffect(() => {
//     dispatch(getAction(Urls.customize_report) as any).then((res: any) => {
//       if (res?.payload?.data?.length > 0) {
//         let respIndex = -1;
//         res?.payload?.data?.forEach((item: any, idx: any) => {
//           const reportCode = item?.report_code;
//           if (reportCode === "profit_and_loss") {
//             respIndex = idx;
//           }
//         });
//         if (respIndex !== -1) {
//           setCustomizeData({ ...customizationData, ...res?.payload?.data[respIndex], report_code: "profit_and_loss" });
//         }
//       }
//     });
//   }, []);

//   const handleCustomizeReportSubmit = (childItem: any) => {
//     dispatch(
//       postAction(Urls.customize_report, {
//         ...customizeData,
//         upto_date: "custom_date_value",
//         start_date: childItem?.date_from,
//         end_date: childItem?.date_to,
//       }) as any
//     ).then((res: any) => {
//       handleResponse(res, () => {
//         dispatch(getAction(Urls.customize_report));
//         handleNavigation(childItem);
//         // window.location.reload();
//       });
//     });
//   };

//   const calculateBalanceSum = (items: any[]) => {
//     let sum = 0;
//     items &&
//       items.forEach((item) => {
//         sum += item.balance_amount;
//         if (organizedData[item.node_id]) {
//           sum += calculateBalanceSum(organizedData[item.node_id]);
//         }
//       });
//     return sum;
//   };

//   const calculateTotalBalance = (items: any[]) => {
//     let total = 0;
//     items.forEach((item) => {
//       total += item.balance_amount;
//       if (organizedData[item.node_id]) {
//         total += calculateTotalBalance(organizedData[item.node_id]);
//       }
//     });
//     return total;
//   };

//   const renderItems = (items: any[], level: number) => (
//     <div className="" style={{ paddingLeft: `${level * 10}px` }}>
//       {items.map((childItem: any) => {
//         const balanceSum = calculateBalanceSum(organizedData[childItem.node_id] || []);
//         const childNodes = organizedData[childItem.node_id] || [];
//         // Check if all child balances are zero
//         const allBalancesZero = childNodes.every((node: any) => node.balance_amount === 0);
//         if (childItem.balance_amount !== 0 || childItem.is_group || balanceSum !== 0) {
//           return (
//             <div key={childItem.node_id}>
//               {(childItem.balance_amount != 0 || childItem?.is_group) && (
//                 <tr className="flex justify-between">
//                   {childItem?.name === "Current Results" ? (
//                     <td
//                       className={`${!childItem?.is_group && "text-accent hover:underline cursor-pointer"} text-sm`}
//                       onClick={() => {
//                         handleCustomizeReportSubmit(childItem);
//                       }}
//                     >
//                       {childItem.name}
//                     </td>
//                   ) : (
//                     <td
//                       className={`${!childItem?.is_group && "text-accent hover:underline cursor-pointer"} text-sm py-2`}
//                       onClick={() => {
//                         !childItem?.is_group && childItem?.name != "Previous Results" && handleNavigation(childItem);
//                       }}
//                     >
//                       {childItem.name}
//                     </td>
//                   )}
//                   <td
//                     className={`${!childItem?.is_group && "text-accent hover:underline cursor-pointer"} text-sm`}
//                     onClick={() => {
//                       !childItem?.is_group && childItem?.name != "Previous Results" && handleNavigation(childItem);
//                     }}
//                   >
//                     {childItem?.is_group
//                       ? null
//                       : currencyFormatter(childItem?.balance_amount, { format: childItem?.format, decimal_places: childItem?.decimal })}
//                   </td>
//                 </tr>
//               )}
//               {/* {childItem.balance_amount != 0 && !childItem?.is_group && (
              
//             )} */}
//               {organizedData[childItem.node_id] && renderItems(organizedData[childItem.node_id], level + 1)}
//               {/* {!allBalancesZero && renderItems(childNodes, level + 1)} */}
//               {level === 1 &&
//                 (["accounts_without_zero", "accounts_with_transactions"].includes(customizationData?.filter_accounts) ? balanceSum !== 0 : true) && (
//                   <tr className="flex justify-between py-2" key={`total_${childItem.node_id}`}>
//                     <td className="font-semibold text-sm">Total for {childItem.name}</td>
//                     <td className="font-semibold text-sm">
//                       {currencyFormatter(balanceSum, { format: initialValue?.format, decimal_places: initialValue?.decimal })}
//                     </td>
//                   </tr>
//                 )}
//             </div>
//           );
//         }
//       })}
//     </div>
//   );

//   return reportLoading ? (
//     <div className="w-screen bg-transparent flex items-center justify-center">
//       <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
//     </div>
//   ) : customizationData?.custom_table_active ? (
//     // <div className="overflow-scroll scrollbar-hide mb-14 rounded border w-auto min-w-full">
//     //   <div className="">
//     //     <div className="flex flex-col">
//     //       <table className="">
//     <div className="rounded border w-auto min-w-full">
//       <div className="">
//         <div className="overflow-scroll max-h-[calc(100vh-320px)]">
//           <table className="table-auto w-full relative">
//             <thead className="bg-gray-50 text-slate-600 sticky top-0">
//               <th className="whitespace-nowrap border-r-1 text-sm text-center capitalize">Account</th>
//               {data?.length > 0 &&
//                 data[0]?.dates?.map((item: any, dateIdx: any) => (
//                   <th className="whitespace-nowrap border-r-1 text-sm text-center capitalize" key={`A34FD_${dateIdx}`}>
//                     <tr className="whitespace-nowrap flex justify-center text-sm border-b border-r">
//                       <td className="w-48 py-2">{item?.date}</td>
//                     </tr>
//                     <tr className="whitespace-nowrap flex justify-center text-sm border-b border-r">
//                       <td className="w-48 py-2">Total</td>
//                     </tr>
//                   </th>
//                 ))}
//             </thead>
//             <ERPBalanceSheetCustomisedTbody data={data} />
//           </table>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className=" print:border-0 flex justify-center items-center">
//       <table className="flex flex-col py-5 w-[980px]">
//         <thead className="text-left bg-white flex flex-col text-sm sticky top-0 z-10">
//           <tr className="flex bg-gray-50 justify-between px-10 py-3 font-light">
//             <th>Account</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody className="px-10 py-3 text-sm">
//           {data &&
//             data
//               .filter((item: any) => item.level === 1)
//               .map((item: any) => {
//                 const totalBalance = calculateTotalBalance(organizedData[item.node_id] || []);
//                 return (
//                   <React.Fragment key={item.node_id}>
//                     <tr>
//                       <td colSpan={2}>{item.name}</td>
//                     </tr>
//                     {organizedData[item.node_id] && renderItems(organizedData[item.node_id], 1)}
//                     <tr className={`flex justify-between border-y py-2 ${item.name === "Assets" && "bg-gray-100"}`}>
//                       <td className={`font-semibold text-[13px] ${item.name === "Assets" && "text-sm"}`}>Total for {item.name}</td>
//                       <td className={`font-semibold text-[13px] ${item.name === "Assets" && "text-sm"}`}>
//                         {currencyFormatter(totalBalance, { format: item?.format, decimal_places: item?.decimal })}
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 );
//               })}
//           <tr className="flex justify-between border-y py-2 bg-gray-100">
//             <td className="font-semibold text-sm">Total for Liabilities & Equity</td>
//             <td className="font-semibold text-sm">
//               {data &&
//                 currencyFormatter(
//                   data
//                     .filter((item: any) => item.name === "Liabilities" || item.name === "Equity")
//                     .reduce((acc: number, curr: any) => {
//                       return acc + calculateTotalBalance(organizedData[curr.node_id] || []);
//                     }, 0),
//                   { format: initialValue?.format, decimal_places: initialValue?.decimal }
//                 )}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ERPBalanceSheetTable;
