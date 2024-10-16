import { readFile } from "xlsx";
import { Request, Response, NextFunction } from "express";
import xlsx from "xlsx";
import { format, addDays } from "date-fns";
import { formatChartData, formatExcelDate, IexcelData } from "../lib/utils";

export const getChartDataController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { from, to } = req.query;

    const workbook = readFile(`src/static/data.csv`);

    const sheetName = workbook.SheetNames[0];

    const excelData: IexcelData[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName],
    );

    const formattedData = formatChartData(excelData);

    return res.status(200).json({ chartData: formattedData });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal server error in getChartData",
      e,
    });
  }
};

export const getFilteredDataController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    Object.keys(req.query).forEach((obj) => {
      if (req.query[obj] === "null") {
        req.query[obj] = undefined;
      }
    });

    const { from, to, age, gender, selectedBar } = req.query;

    if (!from && !to && !age && !gender && !selectedBar)
      return res.status(400).json({
        error: "any one filter is required",
      });

    const workbook = readFile(`src/static/data.csv`);

    const sheetName = workbook.SheetNames[0];

    const excelData: IexcelData[] = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName],
    );

    for (let i = 0; i < excelData.length; i++) {
      if (typeof excelData[i].Day === "number") {
        excelData[i].Day = formatExcelDate(excelData[i].Day);
      }
    }

    let filteredData: IexcelData[] = excelData;

    if (from && !age && !gender && !to) {
      filteredData = excelData.filter((data) => from === data?.Day);
    } else if (to && !from && !age && !gender) {
      filteredData = excelData.filter((data) => to === data?.Day);
    } else if (age && !from && !gender && !to) {
      filteredData = excelData.filter((data) => data.Age === age);
    } else if (gender && !to && !from && !age) {
      filteredData = excelData.filter((data) => data.Gender === gender);
    } else if (from && to && !age && !gender) {
      filteredData = excelData.filter(
        (data) => data.Day >= from && data.Day <= to,
      );
    } else if (from && age && !to && !gender) {
      filteredData = excelData.filter(
        (data) => data.Age == age && data.Day === from,
      );
    } else if (from && gender && !to && !age) {
      filteredData = excelData.filter(
        (data) => data.Day == from && data.Gender === gender,
      );
    } else if (to && age && !gender && !from) {
      filteredData = excelData.filter(
        (data) => data.Age == age && data.Day === to,
      );
    } else if (to && gender && !from && !age) {
      filteredData = excelData.filter(
        (data) => data.Gender == gender && data.Day === to,
      );
    } else if (age && gender && !to && !from) {
      filteredData = excelData.filter(
        (data) => data.Age == age && data.Gender === gender,
      );
    } else if (to && from && age && !gender) {
      filteredData = excelData.filter(
        (data) => data.Day <= to && data.Day >= from && age === data.Age,
      );
    } else if (gender && to && from && !age) {
      filteredData = excelData.filter(
        (data) =>
          from <= data?.Day && to >= data?.Day && gender === data.Gender,
      );
    } else if (gender && age && from && !to) {
      filteredData = excelData.filter(
        (data) =>
          from === data?.Day && gender >= data?.Gender && age === data.Age,
      );
    } else if (age && to && gender && !from) {
      filteredData = excelData.filter(
        (data) => to >= data?.Day && age === data.Age && gender === data.Gender,
      );
    } else if (from && to && age && gender) {
      filteredData = excelData.filter(
        (data) =>
          from <= data?.Day &&
          to >= data?.Day &&
          age === data.Age &&
          gender === data.Gender,
      );
    }
    if (selectedBar) {
      const validBars = ["A", "B", "C", "D", "E", "F"];
      if (!validBars.includes(selectedBar as string)) {
        return res.status(400).json({ error: "Invalid selectedBar value" });
      }
      const selectedBarData = filteredData.map((data) => ({
        value: data[selectedBar as keyof IexcelData],
        Day: data.Day,
      }));
      return res.status(200).json({ chartData: selectedBarData });
    }
    const formattedData = formatChartData(filteredData);
    return res.status(200).json({ chartData: formattedData });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal server error in getFilteredData",
      e,
    });
  }
};
