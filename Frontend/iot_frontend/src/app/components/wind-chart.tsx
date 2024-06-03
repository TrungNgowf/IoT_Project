import { LineChart } from "@mui/x-charts";
import * as React from "react";
import { useEffect, useState } from "react";

export default function WindChart({
  windspeedList,
}: {
  windspeedList: number[];
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
          min: 0,
          max: 20,
          tickMinStep: 1,
          tickMaxStep: 5,
        },
      ]}
      series={[
        {
          label: "Windspeed",
          color: "#00ffc0",
          data: windspeedList,
          curve: "catmullRom",
        },
      ]}
    />
  );
}
