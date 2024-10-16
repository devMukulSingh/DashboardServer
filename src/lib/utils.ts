import { addDays, format } from "date-fns";

export const base_url_client =
  process.env.NODE_ENV === "production"
    ? "https://roc8-dashboard-client.vercel.app"
    : `http://localhost:3000`;

export interface IexcelData {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  Age: string;
  Gender: string;
  Day: number | string;
}

export const formatExcelDate = (serial: number | string) => {
  // Excel's starting date is 1899-12-30
  if (typeof serial === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = addDays(excelEpoch, serial);
    const formatted = format(jsDate, "MM/dd/yyyy");
    return formatted;
  }
  return "";
};
export const formatChartData = (excelData: IexcelData[]) => {
  const totalATime = excelData.reduce((prev, curr) => prev + curr.A, 0);
  const totalBTime = excelData.reduce((prev, curr) => prev + curr.B, 0);
  const totalCTime = excelData.reduce((prev, curr) => prev + curr.C, 0);
  const totalDTime = excelData.reduce((prev, curr) => prev + curr.D, 0);
  const totalETime = excelData.reduce((prev, curr) => prev + curr.E, 0);
  const totalFTime = excelData.reduce((prev, curr) => prev + curr.F, 0);
  const formattedChartData = [
    {
      name: "A",
      totalTime: totalATime,
    },
    {
      name: "B",
      totalTime: totalBTime,
    },
    {
      name: "C",
      totalTime: totalCTime,
    },
    {
      name: "D",
      totalTime: totalDTime,
    },
    {
      name: "E",
      totalTime: totalETime,
    },
    {
      name: "F",
      totalTime: totalFTime,
    },
  ];
  return formattedChartData;
};
