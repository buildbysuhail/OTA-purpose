import { FC, useEffect, useState } from 'react';
import { ItemSummaryCard} from './summaryCardModels';
import ReactApexChart from 'react-apexcharts';

interface CashflowProps {
    cash: ItemSummaryCard;
    bank: ItemSummaryCard;
}


const CashflowChart: FC<CashflowProps> = (props) => {
  const [data, setData] = useState<any>( {
    series: [],
    options: {
        chart: {
            height: 350,
            animations: {
                speed: 500
            },
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 8,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.1
            },
            toolbar : {
                show: false,
            },
            events: {
                mounted: (chart:any) => {
                  chart.windowResizeHandler();
                }
              },
        },
        colors: ["rgb(132, 90, 223)", "rgba(35, 183, 229, 0.85)", "rgba(119, 119, 142, 0.05)"],
        dataLabels: {
            enabled: false
        },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 3
        },
        stroke: {
            curve: 'smooth',
            width: [2, 2, 0],
            dashArray: [0, 5, 0],
        },
        xaxis: {
            reversed: true,
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                formatter: function (value: any) {
                    return "$" + value;
                }
            },
        },
        tooltip: {
            y: [{
                formatter: function (e: any) {
                    return void 0 !== e ? "$" + e.toFixed(0) : e;
                }
            }, {
                formatter: function (e: any) {
                    return void 0 !== e ? "$" + e.toFixed(0) : e;
                }
            }, {
                formatter: function (e: any) {
                    return void 0 !== e ? e.toFixed(0) : e;
                }
            }]
        },
        legend: {
            show: true,
            customLegendItems: ['Cash', 'Bank', 'Total'],
            inverseOrder: true
        },
        title: {
            text: 'Cashflow',
            align: 'right',
            style: {
                fontSize: '.8125rem',
                fontWeight: 'semibold',
                color: '#8c9097'
            },
        },
        markers: {
            hover: {
                sizeOffset: 5
            }
        }
    }

});
  useEffect(() => {
    const newSeries = [
        {
            type: 'line',
            name: 'Cash',
            data: props.cash.summary.map(item => ({
              x: item.monthAndYear,  
              y: item.amount  
          }))
        },
        {
            type: 'line',
            name: 'Bank',                 
            data: props.bank.summary.map(item => ({
              x: item.monthAndYear,  
              y: item.amount  
          }))
        },
    ];
    setData((prevData: any) => ({
        ...prevData,
        series: newSeries
    }));
  },[props.bank,props.bank]);
  

  return (
      <div>
          <ReactApexChart options={data.options} series={data.series} type="line" height={350} />
      </div>

  );
};
export default CashflowChart;
