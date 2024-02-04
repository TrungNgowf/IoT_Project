"use client";
import Image from "next/image";
import React, { StrictMode, useEffect, useState } from "react";
import IndexChart from "./components/index-chart";
import Config from "../configuration/config";
import Navbar from "./components/navbar";
import { Toaster, toast } from 'sonner'
import { SwitchChange, SensorChange } from "./api/DashboardRepository";

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
    SwitchChange(!lightSwitch, 1);
  };
  const handleFanSwitch = () => {
    setFanSwitch(!fanSwitch);
    SwitchChange(!fanSwitch, 2);
  };

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let updatedValue = {
        temperature: -1,
        humidity: -1,
        brightness: -1,
      };
      setTemperatureList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        const crtTemp = generateRandomNumber(0, 100);
        console.log(crtTemp);
        setCurrentTemperature(crtTemp);
        newNumbers.push(crtTemp);
        updatedValue.temperature = crtTemp;
        if(crtTemp > 85) toast.error('Temperature is too high');
        return newNumbers;
      });
      setHumidityList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        const crtHum = generateRandomNumber(50, 100);
        console.log(crtHum);
        setCurrentHumidity(crtHum);
        newNumbers.push(crtHum);
        updatedValue.humidity = crtHum;
        if(crtHum > 90) toast.info('Humidity is too high');
        return newNumbers;
      });
      setBrightnessList((prevNumbers) => {
        const newNumbers = [...prevNumbers];
        newNumbers.shift();
        const crtBright = generateRandomNumber(100, 1000);
        console.log(crtBright);
        setCurrentBrightness(crtBright);
        newNumbers.push(crtBright);
        updatedValue.brightness = crtBright;
        if(crtBright > 850) toast.warning('Brightness is too high');
        if (
          updatedValue.temperature >= 0 &&
          updatedValue.humidity >= 0 &&
          updatedValue.brightness >= 0
        ) {
          console.log(updatedValue);
          SensorChange(
            updatedValue.temperature,
            updatedValue.humidity,
            updatedValue.brightness
          );
        }
        return newNumbers;
      });
    }, 2000);
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
    <>
    <Toaster expand={true} position="top-center" richColors/>
      <div className="w-screen h-screen bg-slate-600 flex flex-col items-center">
        <Navbar index={0} />
        <div className="p-5 mx-auto mb-3 w-full">
          <div className="grid grid-cols-3 gap-2 w-full h-[80vh]">
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
            <div
              className={`dashboard-card bg-gradient-to-tr from-[#c8d4ff] ${humidityColor(
                currentHumidity
              )}`}
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
              )}`}
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
      </div>
    </>
  );
}
