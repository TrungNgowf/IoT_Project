"use client";

import { use, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { GetSensorHistory } from "../api/DashboardRepository";
import moment from "moment";
import { Console } from "console";
import { debug } from "util";
import { start } from "repl";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { colors, TextField, TextFieldProps } from "@mui/material";

export default function SensorHistory() {
  const [listSensorHistory, setListSensorHistory] = useState(
    [] as SensorHistory[]
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [brightness, setBrightness] = useState<number | null>(null);
  const [windspeed, setWindSpeed] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState(0);
  const [isAsc, setIsAsc] = useState(false);

  useEffect(() => {
    handlePageChange(
      currentPage,
      orderBy,
      isAsc,
      startDate,
      endDate,
      temperature,
      humidity,
      brightness
    );
  }, []);

  const handlePageChange = (
    pageNumber: number,
    orderBy: number,
    isAsc: boolean,
    startDate?: Dayjs | null,
    endDate?: Dayjs | null,
    temperature?: number | null,
    humidity?: number | null,
    brightness?: number | null,
    windspeed?: number | null
  ) => {
    console.log(
      pageNumber,
      orderBy,
      isAsc,
      startDate,
      endDate,
      temperature,
      humidity,
      brightness,
      windspeed
    );
    if (pageNumber < 1 || pageNumber > totalPages) return;
    GetSensorHistory(
      pageNumber,
      orderBy,
      isAsc,
      startDate,
      endDate,
      temperature,
      humidity,
      brightness,
      windspeed
    ).then((data) => {
      const sensorList = data as SensorHistoryList;
      setCurrentPage(sensorList.currentPage);
      setListSensorHistory(sensorList.items);
      setTotalPages(sensorList.totalPages);
      setOrderBy(orderBy);
      setIsAsc(isAsc);
    });
  };

  return (
    <>
      <div className="w-screen h-screen bg-slate-600 flex flex-col items-center dark">
        <Navbar index={1} />
        <div className="flex items-end justify-center mt-2 gap-20">
          <div className="flex justify-center items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      input: { color: "white" },
                      label: { color: "white" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <div className="text-base ml-3 mr-3">To</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      input: { color: "white" },
                      label: { color: "white" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Temperature
              </label>
              <input
                type="number"
                id="default-input"
                defaultValue={temperature ?? ""}
                onChange={(e) => {
                  setTemperature(Number.parseInt(e.target.value));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Humidity
              </label>
              <input
                type="number"
                id="default-input"
                defaultValue={humidity ?? ""}
                onChange={(e) => {
                  setHumidity(Number.parseInt(e.target.value));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Brightness
              </label>
              <input
                type="number"
                id="default-input"
                defaultValue={brightness ?? ""}
                onChange={(e) => {
                  setBrightness(Number.parseInt(e.target.value));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                WindSpeed
              </label>
              <input
                type="number"
                id="default-input"
                defaultValue={windspeed ?? ""}
                onChange={(e) => {
                  setWindSpeed(Number.parseInt(e.target.value));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={() =>
              handlePageChange(
                1,
                0,
                false,
                startDate,
                endDate,
                temperature,
                humidity,
                brightness,
                windspeed
              )
            }
            className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            Search
          </button>
        </div>
        <div className="p-5 m-auto w-[60vw]">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      Temperature
                      <a
                        href="#"
                        onClick={() =>
                          handlePageChange(
                            1,
                            1,
                            orderBy == 1 ? !isAsc : false,
                            startDate,
                            endDate,
                            temperature,
                            humidity,
                            brightness
                          )
                        }
                      >
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      Humidity
                      <a
                        href="#"
                        onClick={() =>
                          handlePageChange(
                            1,
                            2,
                            orderBy == 2 ? !isAsc : false,
                            startDate,
                            endDate,
                            temperature,
                            humidity,
                            brightness
                          )
                        }
                      >
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      Brightness
                      <a
                        href="#"
                        onClick={() =>
                          handlePageChange(
                            1,
                            3,
                            orderBy == 3 ? !isAsc : false,
                            startDate,
                            endDate,
                            temperature,
                            humidity,
                            brightness
                          )
                        }
                      >
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      Wind Speed
                      <a
                        href="#"
                        onClick={() =>
                          handlePageChange(
                            1,
                            4,
                            orderBy == 4 ? !isAsc : false,
                            startDate,
                            endDate,
                            temperature,
                            humidity,
                            brightness,
                            windspeed
                          )
                        }
                      >
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      Measurement Time
                      <a
                        href="#"
                        onClick={() =>
                          handlePageChange(
                            1,
                            0,
                            orderBy == 0 ? !isAsc : false,
                            startDate,
                            endDate,
                            temperature,
                            humidity,
                            brightness
                          )
                        }
                      >
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {listSensorHistory.map((item, i, items) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {item.temperature}°C
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {item.humidity}%
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {item.brightness}lm
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {item.windSpeed} m/s
                      </th>
                      <td className="px-6 py-4 text-center">
                        {moment(item.creationTime).format(
                          "DD/MM/YYYY hh:mm:ss"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <a
            href="#"
            onClick={() => handlePageChange(currentPage - 1, orderBy, isAsc)}
            className="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-3.5 h-3.5 me-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Previous
          </a>
          <h1 className="text-[17px]">
            Page {currentPage} of {totalPages}
          </h1>
          <a
            href="#"
            onClick={() => handlePageChange(currentPage + 1, orderBy, isAsc)}
            className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
