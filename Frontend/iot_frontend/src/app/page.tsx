"use client";
import Image from "next/image";
import React, { StrictMode, useEffect, useState } from "react";
import IndexChart from "./components/index-chart";
import Config from "../configuration/config";
import Navbar from "./components/navbar";
import { Toaster, toast } from "sonner";
import { SwitchChange, SensorChange } from "./api/DashboardRepository";
import mqtt from "mqtt";
import WindChart from "./components/wind-chart";

export default function Dashboard() {
  const [lightSwitch, setLightSwitch] = useState(false);
  const [fanSwitch, setFanSwitch] = useState(false);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentBrightness, setCurrentBrightness] = useState(0);
  const [currentWindspeed, setCurrentWindspeed] = useState(0);
  const [temperatureList, setTemperatureList] = useState(Array(10).fill(0));
  const [humidityList, setHumidityList] = useState(Array(10).fill(0));
  const [brightnessList, setBrightnessList] = useState(Array(10).fill(0));
  const [windspeedList, setWindspeedList] = useState(Array(10).fill(0));
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  const handleLightSwitch = () => {
    // setLightSwitch(!lightSwitch);
    // SwitchChange(!lightSwitch, 1);
    client?.publish("light/pub1/control", lightSwitch ? "OFF" : "ON");
  };
  const handleFanSwitch = () => {
    // setFanSwitch(!fanSwitch);
    // SwitchChange(!fanSwitch, 2);
    client?.publish("light/pub2/control", fanSwitch ? "OFF" : "ON");
  };

  const sensorChange = (
    temperature: number,
    humidity: number,
    brightness: number,
    windspeed: number
  ) => {
    setCurrentTemperature(temperature);
    setCurrentHumidity(humidity);
    setCurrentBrightness(brightness);
    setCurrentWindspeed(windspeed);
    if (temperature > 85) toast.error("Temperature is too high");
    if (humidity > 95) toast.info("Humidity is too high");
    if (brightness > 850) toast.warning("Brightness is too high");
    if (windspeed > 15) toast.warning("Windspeed is too high");
    setTemperatureList((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers.shift();
      newNumbers.push(temperature);
      return newNumbers;
    });
    setHumidityList((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers.shift();
      newNumbers.push(humidity);
      return newNumbers;
    });
    setBrightnessList((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers.shift();
      newNumbers.push(brightness);
      return newNumbers;
    });
    setWindspeedList((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers.shift();
      newNumbers.push(windspeed);
      return newNumbers;
    });
    SensorChange(temperature, humidity, brightness, windspeed);
  };

  useEffect(() => {
    if (client) {
      console.log("client", client);
      client.on("connect", () => {
        console.log("connected");
        client?.publish("light/pub1/control", "OFF");
        client?.publish("light/pub2/control", "OFF");
        client?.subscribe("sensor-client", (err) => {
          if (err) {
            console.log("error subscribing to sensor-client topic", err);
          }
        });
        client?.subscribe("light/pub1/success", (err) => {
          if (err) {
            console.log("error subscribing to light/pub1/success topic", err);
          }
        });
        client?.subscribe("light/pub2/success", (err) => {
          if (err) {
            console.log("error subscribing to light/pub2/success topic", err);
          }
        });
      });

      client.on("error", (err) => {
        console.log("error", err);
      });

      client.on("reconnect", () => {
        console.log("reconnecting");
      });

      client.on("close", () => {
        console.log("closed");
      });

      client.on("disconnect", () => {
        console.log("disconnected");
      });

      //on end
      client.on("end", () => {
        console.log("ended");
      });

      //listen to test topic
      client.on("message", (topic, message) => {
        if (topic == "sensor-client") {
          const data = JSON.parse(message.toString());
          console.log(data);
          sensorChange(
            data.temperature,
            data.humidity,
            data.brightness,
            data.windspeed
          );
        }
        if (topic == "light/pub1/success") {
          console.log("light/pub1/success", message.toString());
          setLightSwitch(message.toString() === "ON");
          SwitchChange(message.toString() === "ON", 1);
        }
        if (topic == "light/pub2/success") {
          console.log("light/pub2/success", message.toString());
          setFanSwitch(message.toString() === "ON");
          SwitchChange(message.toString() === "ON", 2);
        }
        if (topic == "light/pub1/failed") {
          toast.error(`Failed to turn ${message} light 1`);
        }
        if (topic == "light/pub2/failed") {
          toast.error(`Failed to turn ${message} light 2`);
        }
      });
    } else {
      console.log("creating new client");
      setClient(
        mqtt.connect({
          host: Config.mqttUri,
          port: 1602,
          protocol: "ws",
          clientId: "iot-client-1602",
          username: "iot-prj",
          password: "Abc1@345",
        })
      );
    }
    return () => {
      client?.end();
    };
  }, [client]);

  const temperatureColor = (temp: number) => {
    if (temp < 25) return "to-[#ffa4a4]";
    else if (temp < 50) return "to-[#ff7c7c]";
    else if (temp < 75) return "to-[#ff4545]";
    else return "to-[#ff0000]";
  };
  const humidityColor = (hum: number) => {
    if (hum < 65) return "to-[#9db2ff]";
    else if (hum < 80) return "to-[#7190ff]";
    else if (hum < 90) return "to-[#3a65ff]";
    else return "to-[#0037ff]";
  };
  const brightnessColor = (bri: number) => {
    if (bri < 250) return "to-[#fffd8f]";
    else if (bri < 500) return "to-[#fffd6c]";
    else if (bri < 750) return "to-[#fffc3f]";
    else return "to-[#fffb00]";
  };
  const windspeedColor = (temp: number) => {
    if (temp < 5) return "to-[#cffff3]";
    else if (temp < 10) return "to-[#a7fce7]";
    else if (temp < 15) return "to-[#61ffd8]";
    else return "to-[#00ffc0]";
  };
  return (
    <>
      <Toaster expand={true} position="top-center" richColors />
      <div className="w-screen h-screen bg-slate-600 flex flex-col items-center">
        <Navbar index={0} />
        <div className="p-5 mx-auto mb-3 w-full">
          <div className="grid grid-cols-8 gap-2 w-full h-[80vh]">
            <div
              className={`dashboard-card bg-gradient-to-tr from-[#ffd8d8] ${temperatureColor(
                currentTemperature
              )} row-span-1 col-span-2`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[30px] font-semibold text-black">
                    Temperature
                  </p>
                  <p className="text-[50px] text-black font-semibold drop-shadow-lg">
                    {currentTemperature}°C
                  </p>
                </div>
                <Image
                  src="/icons/temperature.png"
                  alt="temperature"
                  width={100}
                  height={100}
                  priority={true}
                />
              </div>
            </div>
            <div
              className={`dashboard-card bg-gradient-to-tr from-[#c8d4ff] ${humidityColor(
                currentHumidity
              )} col-span-2`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[30px] font-semibold text-black">
                    Humidity
                  </p>
                  <div>
                    <p className="text-[50px] text-black font-semibold drop-shadow-lg">
                      {currentHumidity}%
                    </p>
                  </div>
                </div>
                <Image
                  src="/icons/humidity.png"
                  alt="humidity"
                  width={100}
                  height={50}
                  priority={true}
                />
              </div>
            </div>
            <div
              className={`dashboard-card bg-gradient-to-tr from-[#fffebe] ${brightnessColor(
                currentBrightness
              )} col-span-2`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[30px] font-semibold text-black">
                    Brightness
                  </p>
                  <p className="text-[50px] text-black font-semibold drop-shadow-lg">
                    {currentBrightness}lm
                  </p>
                </div>
                <Image
                  src="/icons/brightness.png"
                  alt="brightness"
                  width={100}
                  height={50}
                  priority={true}
                />
              </div>
            </div>
            <div
              className={`dashboard-card bg-gradient-to-tr from-[#cffff3] ${windspeedColor(
                currentWindspeed
              )} row-span-1 col-span-2`}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[30px] font-semibold text-black">
                    Wind Speed
                  </p>
                  <p className="text-[50px] text-black font-semibold drop-shadow-lg">
                    {currentWindspeed} m/s
                  </p>
                </div>
                <Image
                  src="/icons/temperature.png"
                  alt="temperature"
                  width={100}
                  height={100}
                  priority={true}
                />
              </div>
            </div>
            <div className="dashboard-card col-span-3 row-span-4">
              <IndexChart
                temperatureList={temperatureList}
                humidityList={humidityList}
                brightnessList={brightnessList}
              />
            </div>
            <div className="dashboard-card col-span-3 row-span-4">
              <WindChart windspeedList={windspeedList} />
            </div>
            <div className="dashboard-card row-span-2 col-span-2">
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-[40px] font-semibold text-black">Light</p>
                <Image
                  src={
                    lightSwitch
                      ? "/icons/light-bulb_ON.png"
                      : "/icons/light-bulb_OFF.png"
                  }
                  alt="brightness"
                  width={80}
                  height={50}
                  priority={true}
                />
                <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center m-3">
                  <input
                    type="checkbox"
                    checked={lightSwitch}
                    onChange={handleLightSwitch}
                    className="sr-only"
                  />
                  <span className="label flex items-center text-xl font-medium text-black">
                    OFF
                  </span>
                  <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                      lightSwitch ? "bg-[#39ab9c]" : "bg-[#CCCCCE]"
                    }`}
                  >
                    <span
                      className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                        lightSwitch ? "translate-x-[28px]" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="label flex items-center text-xl font-medium text-black">
                    ON
                  </span>
                </label>
              </div>
            </div>
            <div className="dashboard-card row-span-2 col-span-2">
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-[40px] font-semibold text-black">Fan</p>
                <Image
                  className={fanSwitch ? "animate-spin" : ""}
                  src={"/icons/fan.png"}
                  alt="brightness"
                  width={80}
                  height={50}
                  priority={true}
                />
                <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center m-3">
                  <input
                    type="checkbox"
                    checked={fanSwitch}
                    onChange={handleFanSwitch}
                    className="sr-only"
                  />
                  <span className="label flex items-center text-xl font-medium text-black">
                    OFF
                  </span>
                  <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                      fanSwitch ? "bg-[#39ab9c]" : "bg-[#CCCCCE]"
                    }`}
                  >
                    <span
                      className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                        fanSwitch ? "translate-x-[28px]" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="label flex items-center text-xl font-medium text-black">
                    ON
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
