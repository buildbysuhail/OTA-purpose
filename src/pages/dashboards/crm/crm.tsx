import { FC, Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Totalcustomers, { Conversionratio, Dealsstatistics, Profit, Profitearned, Sourcedata, Totaldeals, Totalrevenue } from './crmdata';
import face10 from "../../../assets/images/faces/10.jpg";
import face12 from "../../../assets/images/faces/12.jpg";
import CurrencyFormatter from '../../../components/formatters/currency-formatter';
import SummaryCard from './summaryCard';
import { APIClient } from '../../../helpers/api-client';
import CashflowChart from './cashflowChart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import QuickCreate from './quick-create';
import MobileFooter from './mobile-footer';
import ERPModalResizable from '../../../components/ERPComponents/erp-modal-resizle';

interface CrmProps { }
class ItemSummaryCard {total: number = 0; currency: string = ""; summary:ItemSummaryCardStateSummary[] = new Array<ItemSummaryCardStateSummary>();monthVariation: number=0; for:string=""; branchData:ItemSummaryCardBranchSummary[] = new Array<ItemSummaryCardBranchSummary>; totalBranches: number = 0; contextBranches: number = 0; branches:string[] = new Array<string>;}
class ItemSummaryCardBranchSummary {branchId: number = 0; branchName: string = ""; total: number = 0; currency: string = ""; summary:ItemSummaryCardStateSummary[] = [];}
class ItemSummaryCardStateSummary {amount: number = 0; monthAndYear: string = ""; currency: string = ""; }

const Crm: FC<CrmProps> = () => {
  let api = new APIClient();
  // for User search function
  const [Data, setData] = useState(Dealsstatistics);
  const [salesSummary, setSalesSummary] = useState<ItemSummaryCard>();
  const [purchaseSummary, setPurchaseSummary] = useState<ItemSummaryCard>();
  const [incomeSummary, setIncomeSummary] = useState<ItemSummaryCard>();
  const [expenseSummary, setExpenseSummary] = useState<ItemSummaryCard>();
  const [PayableSummary, setPayableSummary] = useState<ItemSummaryCard>();
  const [receivableSummary, setReceivableSummary] = useState<ItemSummaryCard>();
  const [cashSummary, setCashSummary] = useState<ItemSummaryCard>(new ItemSummaryCard());
  const [bankSummary, setBankSummary] = useState<ItemSummaryCard>(new ItemSummaryCard());
  const [topExpenses, setTopExpenses] = useState<[]>([]);
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  useEffect(() => {
    // api.get('/Inventory/Dashboard/GetSalesMonthwiseSummary').then(res =>{
    //   setSalesSummary(res);
    // });
    // api.get('/Inventory/Dashboard/GetPurchaseMonthwiseSummary').then(res =>{
    //   setPurchaseSummary(res);
    // });
    // api.get('/Accounts/Dashboard/GetIncomeMonthly').then(res =>{
    //   setIncomeSummary(res);
    // });
    // api.get('/Accounts/Dashboard/GetExpenseMonthly').then(res =>{
    //   setExpenseSummary(res);
    // });
    // api.get('/Accounts/Dashboard/GetReceivableMonthly').then(res =>{
    //   setReceivableSummary(res);
    // });
    // api.get('/Accounts/Dashboard/GetPayableMonthly').then(res =>{
    //   setPayableSummary(res);
    // });
    // api.post('/Accounts/Dashboard/GetTopExpense',{offset: 0,pageSize: 6}).then(res =>{
    //   setTopExpenses(res);
    // });
    // api.get('/Accounts/Dashboard/GetCashMonthwiseSummary').then(res =>{
    //   setCashSummary(res);
    // });
    // api.get('/Accounts/Dashboard/GetBankMonthwiseSummary').then(res =>{
    //   setBankSummary(res);
    // });
    ///////
    // load();
  }, []);
  const load = async () => {
    // setSalesSummary(await  api.get('/Inventory/Dashboard/GetSalesMonthwiseSummary'));    
    // setPurchaseSummary(await api.get('/Inventory/Dashboard/GetSalesMonthwiseSummary'));
    // setIncomeSummary(await api.get('/Accounts/Dashboard/GetIncomeMonthly'));
    // setExpenseSummary(await api.get('/Accounts/Dashboard/GetExpenseMonthly'));    
    // setReceivableSummary(await api.get('/Accounts/Dashboard/GetReceivableMonthly'));
    // setPayableSummary(await api.get('/Accounts/Dashboard/GetPayableMonthly'));
    // setTopExpenses(await api.post('/Accounts/Dashboard/GetTopExpense',{offset: 0,pageSize: 6}));
  }
  const userdata: any = [];

  const myfunction = (idx: any) => {
    let Data;
    for (Data of Dealsstatistics) {
      if (Data.name[0] == " ") {
        Data.name = Data.name.trim();
      }
      if (Data.name.toLowerCase().includes(idx.toLowerCase())) {
        if (Data.name.toLowerCase().startsWith(idx.toLowerCase())) {
          userdata.push(Data);
        }
      }

    }
    setData(userdata);
  };
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          {/* <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">Welcome back, Json Taylor !</p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">Track your sales activity, leads and deals here.</p> */}
        </div>
        <div className="btn-list md:mt-0 mt-2">
          {/* <button type="button"
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.375rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0">
            <i className="ri-filter-3-fill  inline-block"></i>Filters
          </button>
          <button type="button"
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium  !me-[0.375rem]  !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0">
            <i className="ri-upload-cloud-line  inline-block"></i>Export
          </button> */}
        </div>
      </div>
      <ERPModalResizable></ERPModalResizable>
      <div className="grid grid-cols-12 gap-x-6 px-4">
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-4 xl:col-span-4  col-span-12">
              <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              {!deviceInfo?.isMobile && (
                <div className="box crm-highlight-card">
                  <div className="box-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[1.125rem] text-white mb-2">Your target is incomplete</div>
                        <span className="block text-[0.75rem] text-white"><span className="opacity-[0.7]">You have
                          completed</span>&nbsp; <span className="font-semibold text-warning">48%</span> <span className="opacity-[0.7]">of the given
                            target, you can also check your status</span>.</span>
                        <span className="block font-semibold mt-[0.125rem]"><Link className="text-white text-[0.813rem]"
                          to="#"><u>Click
                            here</u></Link></span>
                      </div>
                      <div>
                        <div id="crm-main"> 
                          <Profit />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
              {deviceInfo?.isMobile && (
              <div>
              <QuickCreate/>
              </div>
              )}
              <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header flex justify-between">
                    <div className="box-title">
                      Top Expenses
                    </div>
                    <div className="hs-dropdown ti-dropdown">
                      {/* <Link aria-label="anchor" to="#"
                        className="flex items-center justify-center w-[1.75rem] h-[1.75rem]  !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                        aria-expanded="false">
                        <i className="fe fe-more-vertical text-[0.8rem]"></i>
                      </Link> */}
                      {/* <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Week</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Month</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Year</Link></li>
                      </ul> */}
                    </div>
                  </div>
                  <div className="box-body">
                      {topExpenses != undefined && topExpenses != null && topExpenses.length > 0 ?(
                        <ul className="list-none crm-top-deals mb-0">
                        {topExpenses.map((item: any, index) => (
                           <li key={'topExpenses_'+index} className="mb-[0.9rem]">
                           <div className="flex items-start flex-wrap">
                             <div className="me-2">
                               <span className=" inline-flex items-center justify-center">
                                 <img src={face10} alt=""
                                   className="w-[1.75rem] h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full" />
                               </span>
                             </div>
                             <div className="flex-grow">
                               <p className="font-semibold mb-[1.4px]  text-[0.813rem]">{item.ledgerName}
                               </p>
                             </div>
                             <div className="font-semibold text-[0.9375rem] "><CurrencyFormatter currency='' amount={item.indirectExpenses}></CurrencyFormatter></div>
                           </div>
                         </li>
                          ))}

                        </ul>
                      ):
                      <ul className="list-none crm-top-deals mb-0">
                         <li  className="mb-[0.9rem]">
                          No item loaded
                         </li>
                         </ul>
                          }
                  </div>
                </div>
              </div>
              <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header justify-between">
                    <div className="box-title">Profit Earned</div>
                    <div className="hs-dropdown ti-dropdown">
                      <Link to="#" className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
                        aria-expanded="false">
                        View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                      </Link>
                      <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Today</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">This Week</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Last Week</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="box-body !py-0 !ps-0">
                    <div id="crm-profits-earned">
                      <Profitearned />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-8  xl:col-span-8  col-span-12">
              <div className="grid grid-cols-12 gap-x-6">
              <SummaryCard  summary={salesSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='success'></SummaryCard>
              <SummaryCard  summary={purchaseSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='secondary'></SummaryCard>
              <SummaryCard  summary={incomeSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='warning'></SummaryCard>
              <SummaryCard  summary={receivableSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='success'></SummaryCard>
              <SummaryCard  summary={expenseSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='success'></SummaryCard>
              <SummaryCard  summary={PayableSummary??new ItemSummaryCard()} icon="ti ti-wave-square" color='success'></SummaryCard>
                
                
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                  <div className="box">
                    <div className="box-header !gap-0 !m-0 justify-between">
                      <div className="box-title">
                        Revenue Analytics
                      </div>
                      <div className="hs-dropdown ti-dropdown">
                        <Link to="#" className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                          aria-expanded="false">
                          View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                        </Link>
                        <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                          <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            to="#">Today</Link></li>
                          <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            to="#">This Week</Link></li>
                          <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            to="#">Last Week</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="box-body !py-5">
                      <div id="crm-revenue-analytics">
                        <CashflowChart cash={cashSummary} bank={bankSummary} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              <div className="box custom-card">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Sales Statistics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div>
                      <input className="ti-form-control form-control-sm" type="text" placeholder="Search Here" onChange={(ele) => { myfunction(ele.target?.value); }}
                        aria-label=".form-control-sm example" />
                    </div>
                    <div className="hs-dropdown ti-dropdown">
                      <Link to="#"
                        className="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                        aria-expanded="false">
                        Sort By<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                      </Link>
                      <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">New</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Popular</Link></li>
                        <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#">Relevant</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="box-body">
                  <div className="overflow-x-auto">
                    <table className="table min-w-full whitespace-nowrap table-hover border table-bordered">
                      <thead>
                        <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                          <th scope="row" className="!ps-4 !pe-5"><input className="form-check-input" type="checkbox"
                            id="checkboxNoLabel1" defaultValue="" aria-label="..." /></th>
                          <th scope="col" className="!text-start !text-[0.85rem] min-w-[200px]">Sales Rep</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Category</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Mail</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Location</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Date</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data && Data.map((idx) => (
                          <tr className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light" key={Math.random()}>
                            <th scope="row" className="!ps-4 !pe-5"><input className="form-check-input" type="checkbox" defaultChecked={idx.checked === 'defaultChecked'}
                              id="checkboxNoLabel2" defaultValue="" aria-label="..." /></th>
                            <td>
                              <div className="flex items-center font-semibold">
                                <span className="!me-2 inline-flex justify-center items-center">
                                  <img src={idx.src} alt="img"
                                    className="w-[1.75rem] h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full" />
                                </span>{idx.name}
                              </div>
                            </td>
                            <td>{idx.role}</td>
                            <td>{idx.mail}</td>
                            <td>
                              <span
                                className={`inline-flex text-${idx.color} !py-[0.15rem] !px-[0.45rem] rounded-sm !font-semibold !text-[0.75em] bg-${idx.color}/10`}>{idx.location}</span>
                            </td>
                            <td>{idx.date}</td>
                            <td>
                              <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                                <Link aria-label="anchor" to="#"
                                  className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-success/10 text-success hover:bg-success hover:text-white hover:border-success"><i
                                    className="ri-download-2-line"></i></Link>
                                <Link aria-label="anchor" to="#"
                                  className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary"><i
                                    className="ri-edit-line"></i></Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="box-footer">
                  <div className="sm:flex items-center">
                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                      Showing 5 Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                    </div>
                    <div className="ms-auto">
                      <nav aria-label="Page navigation" className="pagination-style-4">
                        <ul className="ti-pagination mb-0">
                          <li className="page-item disabled">
                            <Link className="page-link" to="#">
                              Prev
                            </Link>
                          </li>
                          <li className="page-item"><Link className="page-link active" to="#">1</Link></li>
                          <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                          <li className="page-item">
                            <Link className="page-link !text-primary" to="#">
                              next
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Stock
                  </div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link aria-label="anchor" to="#"
                      className="flex items-center justify-center w-[1.75rem] h-[1.75rem] ! !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                      aria-expanded="false">
                      <i className="fe fe-more-vertical text-[0.8rem]"></i>
                    </Link>
                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Week</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Month</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Year</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    <Sourcedata />
                    <div className="lead-source-value ">
                      <span className="block text-[0.875rem] ">Total</span>
                      <span className="block text-[1.5625rem] font-bold">4,145</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-dashed dark:border-defaultborder/10">
                  <div className="col !p-0">
                    <div className="!ps-4 p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend mobile inline-block">Mobile
                      </span>
                      <div><span className="text-[1rem]  font-semibold">1,624</span>
                      </div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend desktop inline-block">Desktop
                      </span>
                      <div><span className="text-[1rem]  font-semibold">1,267</span></div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend laptop inline-block">Laptop
                      </span>
                      <div><span className="text-[1rem]  font-semibold">1,153</span>
                      </div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="!pe-4 p-[0.95rem] text-center">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend tablet inline-block">Tablet
                      </span>
                      <div><span className="text-[1rem]  font-semibold">679</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Order Status
                  </div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link to="#" className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false">
                      View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Today</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">This Week</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Last Week</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div className="flex items-center mb-[0.8rem]">
                    <h4 className="font-bold mb-0 text-[1.5rem] ">4,289</h4>
                    <div className="ms-2">
                      <span
                        className="py-[0.18rem] px-[0.45rem] rounded-sm text-success !font-medium !text-[0.75em] bg-success/10">1.02<i
                          className="ri-arrow-up-s-fill align-mmiddle ms-1"></i></span>
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.813rem] ms-1">compared to last week</span>
                    </div>
                  </div>

                  <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
                    <div className="flex flex-col justify-center rounded-s-[0.625rem] overflow-hidden bg-primary w-[21%]" style={{ width: "21%" }} aria-valuenow={21} aria-valuemin={0} aria-valuemax={100}>
                    </div>
                    <div className="flex flex-col justify-center rounded-none overflow-hidden bg-info w-[26%]" style={{ width: "26%" }} aria-valuenow={26} aria-valuemin={0} aria-valuemax={100}>
                    </div>
                    <div className="flex flex-col justify-center rounded-none overflow-hidden bg-warning w-[35%]" style={{ width: "35%" }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
                    </div>
                    <div className="flex flex-col justify-center rounded-e-[0.625rem] overflow-hidden bg-success w-[18%]" style={{ width: "18%" }} aria-valuenow={18} aria-valuemin={0} aria-valuemax={100}>
                    </div>
                  </div>
                  <ul className="list-none mb-0 pt-2 crm-deals-status">
                    <li className="primary">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Successful Order</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">987 deals</div>
                      </div>
                    </li>
                    <li className="info">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Pending Order</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">1,073 deals</div>
                      </div>
                    </li>
                    <li className="warning">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Rejected Order</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">1,674 deals</div>
                      </div>
                    </li>
                    <li className="success">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Upcoming Order</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">921 deals</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Recent Activity
                  </div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link to="#" className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false">
                      View All<i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Today</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">This Week</Link></li>
                      <li><Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#">Last Week</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div>
                    <ul className="list-none mb-0 crm-recent-activity">
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center font-medium leading-[1.25rem] text-[0.65rem] text-primary bg-primary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content text-defaultsize">
                            <span className="font-semibold ">Update of calendar events
                              &amp;</span><span><Link to="#" className="text-primary font-semibold">
                                Added new events in next week.</Link></span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">4:45PM</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start  text-defaultsize">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-secondary bg-secondary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>New theme for <span className="font-semibold">Spruko Website</span> completed</span>
                            <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">Lorem ipsum, dolor sit amet.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">3 hrs</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-success bg-success/10 rounded-full">
                              <i className="bi bi-circle-fill  text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>Created a <span className="text-success font-semibold">New Task</span> today <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] text-[0.65rem] inline-flex items-center justify-center font-medium bg-purple/10 rounded-full ms-1"><i
                                className="ri-add-fill text-purple text-[0.75rem]"></i></span></span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">22 hrs</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-pink bg-pink/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>New member <span
                              className="py-[0.2rem] px-[0.45rem] font-semibold rounded-sm text-pink text-[0.75em] bg-pink/10">@andreas
                              gurrero</span> added today to AI Summit.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">Today</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-warning bg-warning/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>32 New people joined summit.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">22 hrs</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-info bg-info/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>Neon Tarly added <span className="text-info font-semibold">Robert Bright</span> to AI
                              summit project.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">12 hrs</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-[#232323] dark:text-white bg-[#232323]/10 dark:bg-white/20 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>Replied to new support request <i
                              className="ri-checkbox-circle-line text-success text-[1rem] align-middle"></i></span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">4 hrs</span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span
                              className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-purple bg-purple/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>Completed documentation of <Link to="#"
                              className="text-purple underline font-semibold">AI Summit.</Link></span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">4 hrs</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
      {deviceInfo?.isMobile && (
      <div className="w-full h-16 bg-white fixed bottom-0 left-0">
        <MobileFooter/>
      </div>
    )} */}
    </Fragment>
  );
}

export default Crm;
