import { Component, FC, Fragment, useEffect, useState } from "react";
import {
  ItemSummaryCard,
  ItemSummaryCardStateSummary,
} from "./summaryCardModels";
import CurrencyFormatter from "../../../components/formatters/currency-formatter";
import ERPReactApexChartForSummaryCard from "./crmdata";
import { Link } from "react-router-dom";

interface SummaryProps {
  summary: ItemSummaryCard;
  icon: string;
  color: string;
}

const SummaryCard: FC<SummaryProps> = (props) => {
  const [data, setData] = useState<SummaryProps>(props);
  useEffect(() => {
    setData(props);
  }, [props]);

  return (
    <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
      <div className="box overflow-hidden">
        <div className="box-body">
          <div className="flex items-top justify-between">
            <div>
              <span
                className={`!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-${data.color}`}
              >
                <i className={`${props.icon} text-[1rem] text-white`}></i>
              </span>
            </div>
            <div className="flex-grow ms-4">
            <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                  {data.summary.for}
                </p>
              <div className="flex items-center justify-between flex-wrap">
                
                  <h4 className="font-semibold  text-[1.5rem] !mb-2 ">
                    <CurrencyFormatter
                      amount={data.summary?.total}
                      currency={data.summary?.currency}
                    ></CurrencyFormatter>
                  </h4>
                <div id="crm-total-customers">
                  <ERPReactApexChartForSummaryCard
                    summary={
                      data && data.summary != undefined
                        ? data.summary.summary.map((x) => x.amount)
                        : []
                    }
                    color="data.color"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between !mt-1">
                <div>
                  <Link className={`text-${data.color} text-[0.813rem]`} to="#">
                    View All
                    <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                  </Link>
                </div>
                <div className="text-end">
                  <p
                    className={`mb-0 ${
                      data.summary && data.summary?.monthVariation > 0
                        ? "text-success"
                        : data.summary && data.summary?.monthVariation < 0
                        ? "text-danger"
                        : "text-default"
                    } text-[0.813rem] font-semibold`}
                  >
                    {data.summary && (data.summary?.monthVariation ?? 0) > 0
                      ? `+${data.summary?.monthVariation ?? 0}%`
                      : data.summary && (data.summary?.monthVariation ?? 0) < 0
                      ? `${data.summary?.monthVariation}%`
                      : 0}
                  </p>
                  <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">
                    this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
