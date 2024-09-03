import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
let fiscal_year: any = 1;

// Check Fiscal Year
const checkFiscalYear = () => {
  let fiscalYearStart;
  let fiscalYearEnd;
  if (fiscal_year === 1) {
    fiscalYearStart = dayjs(dayjs())
      .subtract(dayjs().month(), "month")
      .subtract(dayjs().date() - 1, "day")
      .add(90, "day")
      .subtract(1, "year")
      .format("YYYY-MM-DD");
    fiscalYearEnd = dayjs(fiscalYearStart).add(364, "day").format("YYYY-MM-DD");
  } else if (fiscal_year === 2) {
    fiscalYearStart = dayjs(dayjs())
      .subtract(dayjs().month(), "month")
      .subtract(dayjs().date() - 1, "day")
      .format("YYYY-MM-DD");
    fiscalYearEnd = dayjs(fiscalYearStart).add(364, "day").format("YYYY-MM-DD");
  }
  return {
    fiscalYearStart,
    fiscalYearEnd,
  };
};

dayjs.extend(quarterOfYear);
export const currentDate = dayjs().format("YYYY-MM-DD");
export const currentDay = dayjs().date();
export const currentMonth = dayjs().month();
export const today = `date_from=${dayjs().format("YYYY-MM-DD")}&date_to=${dayjs().format("YYYY-MM-DD")}`;
export const yesterday = `date_from=${dayjs().subtract(1, "day").format("YYYY-MM-DD")}&date_to=${dayjs().subtract(1, "day").format("YYYY-MM-DD")}`;

export const thisWeek = (firstDay?: string) => {
  let firstDayIndex = 1; // Default First Day : Monday (1)
  if (firstDay === "Saturday") firstDayIndex = -1;
  else if (firstDay === "Sunday") firstDayIndex = 0;
  return `date_from=${dayjs().day(firstDayIndex).format("YYYY-MM-DD")}&date_to=${dayjs()
    .day(firstDayIndex + 6)
    .format("YYYY-MM-DD")}`;
};

export const thisQuarter = `date_from=${dayjs().startOf("quarter").format("YYYY-MM-DD")}&date_to=${dayjs().endOf("quarter").format("YYYY-MM-DD")}`;
export const thisMonth = `date_from=${dayjs()
  .subtract(currentDay - 1, "day")
  .format("YYYY-MM-DD")}&date_to=${dayjs().endOf("month").format("YYYY-MM-DD")}`;
export const thisYear = `date_from=${dayjs().startOf("year").format("YYYY-MM-DD")}&date_to=${dayjs().endOf("year").format("YYYY-MM-DD")}`;
// export const thisYear = `date_from=${dayjs(checkFiscalYear().fiscalYearStart).format("YYYY-MM-DD")}&date_to=${checkFiscalYear().fiscalYearEnd}`;

export const lastWeek = (firstDay?: string) => {
  let firstDayIndex = -6; // Default First Day : Monday
  if (firstDay === "Saturday") firstDayIndex = -8;
  else if (firstDay === "Sunday") firstDayIndex = -7;
  return `date_from=${dayjs().day(firstDayIndex).format("YYYY-MM-DD")}&date_to=${dayjs().day(-1).format("YYYY-MM-DD")}`;
};

export const lastMonth = `date_from=${dayjs(currentDate)
  .subtract(1, "month")
  .subtract(currentDay - 1, "day")
  .format("YYYY-MM-DD")}&date_to=${dayjs(currentDate).subtract(currentDay, "day").format("YYYY-MM-DD")}`;
export const lastYear = `date_from=${dayjs().startOf("year").subtract(1, "year").format("YYYY-MM-DD")}&date_to=${dayjs()
  .endOf("year")
  .subtract(1, "year")
  .format("YYYY-MM-DD")}`;

// export const lastYear = `date_from=${dayjs(checkFiscalYear().fiscalYearStart).subtract(1, "year").format("YYYY-MM-DD")}&date_to=${dayjs(
//   checkFiscalYear().fiscalYearEnd
// )
//   .subtract(1, "year")
//   .format("YYYY-MM-DD")}`;
// Quater of year Calculation
export const quaterOfYear = (hasNewFilter?: any) => {
  const startDate1 = dayjs(currentDate)
    .subtract(currentMonth, "month")
    .subtract(currentDay - 1, "day")
    .format("YYYY-MM-DD");
  const startDate2 = dayjs(startDate1).add(currentMonth, "month").format("YYYY-MM-DD");
  const startDate3 = dayjs(startDate2).add(currentMonth, "month").format("YYYY-MM-DD");
  const startDate4 = dayjs(startDate3).add(currentMonth, "month").format("YYYY-MM-DD");
  const endDate1 = dayjs(startDate1).add(89, "day").format("YYYY-MM-DD");
  const endDate2 = dayjs(startDate2).add(90, "day").format("YYYY-MM-DD");
  const endDate3 = dayjs(startDate3).add(91, "day").format("YYYY-MM-DD");
  const endDate4 = dayjs(startDate4).add(91, "day").format("YYYY-MM-DD");

  if (dayjs().month() == 1 || dayjs().month() == 2 || dayjs().month() == 3) {
    return `date_from=${startDate1}&date_to=${endDate1}`;
  } else if (dayjs().month() == 3 || dayjs().month() == 4 || dayjs().month() == 5) {
    return `date_from=${startDate2}&date_to=${endDate2}`;
  } else if (dayjs().month() == 6 || dayjs().month() == 7 || dayjs().month() == 8) {
    return `date_from=${startDate3}&date_to=${endDate3}`;
  } else if (dayjs().month() == 9 || dayjs().month() == 10 || dayjs().month() == 11) {
    return `date_from=${startDate4}&date_to=${endDate4}`;
  }
};

// // Dates For Schedule 3 Reports
// const today_schedule = `date_from_first=${dayjs().format("YYYY-MM-DD")}&date_to_first=${dayjs().format("YYYY-MM-DD")}&date_from_second=${dayjs()
//   .subtract(1, "day")
//   .format("YYYY-MM-DD")}&date_to_second=${dayjs().format("YYYY-MM-DD")}`;
// const yesterday_schedule = `date_from_first=${dayjs().subtract(1, "day").format("YYYY-MM-DD")}&date_to_first=${dayjs().format(
//   "YYYY-MM-DD"
// )}&date_from_second=${dayjs().subtract(2, "day").format("YYYY-MM-DD")}&date_to_second=${dayjs().subtract(1, "day").format("YYYY-MM-DD")}`;
// const thisWeek_schedule = `date_from_first=${dayjs().subtract(7, "day").format("YYYY-MM-DD")}&date_to_first=${dayjs().format(
//   "YYYY-MM-DD"
// )}&date_from_second=${dayjs().subtract(14, "day").format("YYYY-MM-DD")}&date_to_second=${dayjs().subtract(7, "day").format("YYYY-MM-DD")}`;
// const thisYear_schedule = `date_from_first=${dayjs(checkFiscalYear().fiscalYearStart).format("YYYY-MM-DD")}&date_to_first=${
//   checkFiscalYear().fiscalYearEnd
// }&date_from_second=${dayjs(checkFiscalYear().fiscalYearStart).subtract(1, "year").format("YYYY-MM-DD")}&date_to_second=${dayjs(
//   checkFiscalYear().fiscalYearEnd
// )
//   .subtract(1, "year")
//   .format("YYYY-MM-DD")}`;
// const lastWeek_schedule = `date_from_first=${dayjs().subtract(14, "day").format("YYYY-MM-DD")}&date_to_first=${dayjs()
//   .subtract(7, "day")
//   .format("YYYY-MM-DD")}&date_from_second=${dayjs().subtract(21, "day").format("YYYY-MM-DD")}&date_to_second=${dayjs()
//   .subtract(14, "day")
//   .format("YYYY-MM-DD")}`;
// const lastMonth_schedule = `date_from_first=${dayjs()
//   .subtract(currentDay - 1, "day")
//   .subtract(1, "month")
//   .format("YYYY-MM-DD")}&date_to_first=${dayjs(currentDate).subtract(currentDay, "day").format("YYYY-MM-DD")}&date_from_second=${dayjs(currentDate)
//   .subtract(2, "month")
//   .subtract(currentDay - 1, "day")
//   .format("YYYY-MM-DD")}&date_to_second=${dayjs(currentDate).subtract(currentDay, "day").subtract(1, "month").format("YYYY-MM-DD")}`;
// const lastYear_schedule = `date_from_first=${dayjs(checkFiscalYear().fiscalYearStart)
//   .subtract(1, "year")
//   .format("YYYY-MM-DD")}&date_to_first=${dayjs(checkFiscalYear().fiscalYearEnd).subtract(1, "year").format("YYYY-MM-DD")}&date_from_second=${dayjs(
//   checkFiscalYear().fiscalYearStart
// )
//   .subtract(2, "year")
//   .format("YYYY-MM-DD")}&date_to_second=${dayjs(checkFiscalYear().fiscalYearEnd).subtract(2, "year").format("YYYY-MM-DD")}`;
// const thisMonth_schedule = `date_from_first=${dayjs()
//   .subtract(currentDay - 1, "day")
//   .format("YYYY-MM-DD")}&date_to_first=${dayjs().format("YYYY-MM-DD")}&date_from_second=${dayjs(currentDate)
//   .subtract(1, "month")
//   .subtract(currentDay - 1, "day")
//   .format("YYYY-MM-DD")}&date_to_second=${dayjs(currentDate).subtract(currentDay, "day").format("YYYY-MM-DD")}`;
