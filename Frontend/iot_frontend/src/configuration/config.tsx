const Config = () => {};

export default Config;

Config.baseApi = "https://localhost:7000/api";
Config.mqttUri = `ws://10.0.0.203`;

async function POST(api: string, params: any) {
  try {
    const res = await fetch(`${Config.baseApi + api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: params,
    });
  } catch (error) {
    console.log(error);
  }
}
async function GET(api: string, params: any) {
  try {
    const res = await fetch(`${Config.baseApi + api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: params,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
