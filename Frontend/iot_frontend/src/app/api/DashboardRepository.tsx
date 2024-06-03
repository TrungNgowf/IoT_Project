import Config from "@/configuration/config";
import { Dayjs } from "dayjs";

export async function SwitchChange(state: boolean, switchType: number) {
  try {
    const res = await fetch(`${Config.baseApi}/Dashboard/SwitchChange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: state,
        switchType: switchType,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function SensorChange(
  temperature: number,
  humidity: number,
  brightness: number,
  windspeed: number
) {
  try {
    const res = await fetch(`${Config.baseApi}/Dashboard/SensorChange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: temperature,
        humidity: humidity,
        brightness: brightness,
        windSpeed: windspeed,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function GetSensorHistory(
  page: number = 1,
  orderBy: number = 0,
  isAsc: boolean = false,
  startDate?: Dayjs | null,
  endDate?: Dayjs | null,
  temperature?: number | null,
  humidity?: number | null,
  brightness?: number | null,
  windSpeed?: number | null
) {
  var request = `${Config.baseApi}/Dashboard/SensorHistory?pageNumber=${page}&orderBy=${orderBy}&isAsc=${isAsc}`;
  if (startDate) request += `&startDate=${startDate.toISOString()}`;
  if (endDate) request += `&endDate=${endDate.toISOString()}`;
  if (temperature) request += `&specifiedTemperature=${temperature}`;
  if (humidity) request += `&specifiedHumidity=${humidity}`;
  if (brightness) request += `&specifiedBrightness=${brightness}`;
  if (windSpeed) request += `&specifiedWindSpeed=${windSpeed}`;
  try {
    console.log(request);
    const res = await fetch(request, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function GetSwitchHistory(
  page: number = 1,
  filter: string = "all",
  startDate?: Dayjs | null,
  endDate?: Dayjs | null
) {
  let request = `${Config.baseApi}/Dashboard/SwitchHistory?pageNumber=${page}&filter=${filter}`;
  if (startDate) request += `&startDate=${startDate.toISOString()}`;
  if (endDate) request += `&endDate=${endDate.toISOString()}`;
  try {
    const res = await fetch(request, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}
