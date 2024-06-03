import { LineChart } from "@mui/x-charts";
import * as React from "react";
import { useEffect, useState } from "react";

export default function IndexChart({
  temperatureList,
  humidityList,
  brightnessList,
}: {
  temperatureList: number[];
  humidityList: number[];
  brightnessList: number[];
}) {
  return (
    <LineChart
      xAxis={[
        {
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          tickMinStep: 1,
        },
      ]}
      yAxis={[
        {
          id: "leftYAxis",
          min: 0,
          max: 100,
          tickMinStep: 10,
          tickMaxStep: 10,
        },
        {
          id: "rightYAxis",
          min: 0,
          max: 1000,
          tickMinStep: 50,
          tickMaxStep: 100,
        },
      ]}
      series={[
        {
          label: "Brightness",
          color: "#fffb12",
          data: brightnessList,
          curve: "catmullRom",
          yAxisKey: "rightYAxis",
        },
        {
          label: "Humidity",
          color: "#0339fc",
          data: humidityList,
          curve: "catmullRom",
          yAxisKey: "leftYAxis",
        },
        {
          label: "Temperature",
          color: "#ff0000",
          data: temperatureList,
          curve: "catmullRom",
          yAxisKey: "leftYAxis",
        },
      ]}
      rightAxis="rightYAxis"
    />
  );
}
