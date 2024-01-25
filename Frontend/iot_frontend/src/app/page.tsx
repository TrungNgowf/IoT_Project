"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import IndexChart from "./components/index-chart";
import { number } from "echarts";

export default function Dashboard() {
  const [lightSwitch, setLightSwitch] = useState(false);
  const [fanSwitch, setFanSwitch] = useState(false);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentBrightness, setCurrentBrightness] = useState(0);
  const [temperatureList, setTemperatureList] = useState(Array(10).fill(0));
  const [humidityList, setHumidityList] = useState(Array(10).fill(0));
  const [brightnessList, setBrightnessList] = useState(Array(10).fill(0));

  const handleLightSwitch = () => {
    setLightSwitch(!lightSwitch);
  };
  const handleFanSwitch = () => {
    setFanSwitch(!fanSwitch);
  };

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperatureList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        let crtTemp = generateRandomNumber(0, 100);
        setCurrentTemperature(crtTemp);
        newNumbers.push(crtTemp);
        return newNumbers;
      });
      setHumidityList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        let crtHum = generateRandomNumber(50, 100);
        setCurrentHumidity(crtHum);
        newNumbers.push(crtHum);
        return newNumbers;
      });
      setBrightnessList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        let crtBright = generateRandomNumber(100, 1000);
        setCurrentBrightness(crtBright);
        newNumbers.push(crtBright);
        return newNumbers;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
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
  return (
    <div className="w-screen h-screen p-5 m-auto bg-white">
      <div className="grid grid-cols-3 gap-2 w-full h-full">
        <div
          className={`dashboard-card bg-gradient-to-tr from-[#ffd8d8] ${temperatureColor(
            currentTemperature
          )} row-span-1`}
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
        <div className={`dashboard-card bg-gradient-to-tr from-[#c8d4ff] ${humidityColor(currentHumidity)}`}>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[30px] font-semibold text-black">Humidity</p>
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
        <div className={`dashboard-card bg-gradient-to-tr from-[#fffebe] ${brightnessColor(currentBrightness)}`}>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[30px] font-semibold text-black">Brightness</p>
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
        <div className="dashboard-card col-span-2 row-span-4">
          <IndexChart
            temperatureList={temperatureList}
            humidityList={humidityList}
            brightnessList={brightnessList}
          />
        </div>
        <div className="dashboard-card row-span-2">
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
        <div className="dashboard-card row-span-2">
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
  );
}
