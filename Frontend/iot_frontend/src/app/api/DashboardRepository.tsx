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
  searchDate?: string,
  temperature?: number | null | "",
  humidity?: number | null | "",
  brightness?: number | null | "",
  windSpeed?: number | null | ""
) {
  var request = `${Config.baseApi}/Dashboard/SensorHistory?pageNumber=${page}&orderBy=${orderBy}&isAsc=${isAsc}`;
  if (searchDate != "" && searchDate != null)
    request += `&searchDate=${searchDate}`;
  if (temperature != null && temperature != "")
    request += `&specifiedTemperature=${temperature}`;
  if (humidity != null && humidity != "")
    request += `&specifiedHumidity=${humidity}`;
  if (brightness != null && brightness != "")
    request += `&specifiedBrightness=${brightness}`;
  if (windSpeed != null && windSpeed != "")
    request += `&specifiedWindSpeed=${windSpeed}`;
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
  searchDate?: string
) {
  let request = `${Config.baseApi}/Dashboard/SwitchHistory?pageNumber=${page}&filter=${filter}`;
  if (searchDate != "" && searchDate != null)
    request += `&searchDate=${searchDate}`;
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
