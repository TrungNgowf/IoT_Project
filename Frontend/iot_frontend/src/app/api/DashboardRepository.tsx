import Config from "@/configuration/config";

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
  brightness: number
) {
  try {
    const res = await fetch(`${Config.baseApi}/Dashboard/SensorChange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: temperature,
        humidity: humidity,
        brightness: brightness,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function GetSensorHistory(
  page: number = 1,
  orderBy: number = 0,
  isAsc: boolean = false
) {
  try {
    const res = await fetch(
      `${Config.baseApi}/Dashboard/SensorHistory?pageNumber=${page}&orderBy=${orderBy}&isAsc=${isAsc}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function GetSwitchHistory(
  page: number = 1,
  filter: string = "all"
) {
  try {
    const res = await fetch(
      `${Config.baseApi}/Dashboard/SwitchHistory?pageNumber=${page}&filter=${filter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
  }
}
