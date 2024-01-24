import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="w-screen h-screen p-5 m-auto bg-white">
      <div className="grid grid-cols-3 gap-2 w-full h-full">
        <div className="dashboard-card bg-gradient-to-tr from-[#ffd8d8] to-[#ff0000]">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[40px] font-semibold text-black">
                Temperature
              </p>
              <p className="text-[60px] font-semibold">30°C</p>
            </div>
            <Image
              src="/icons/temperature.png"
              alt="temperature"
              width={130}
              height={100}
              priority={true}
            />
          </div>
        </div>
        <div className="dashboard-card bg-gradient-to-tr from-[#c8d4ff] to-[#0339fc]">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[40px] font-semibold text-black">
                Humidity
              </p>
              <div>
                <p className="text-[60px] font-semibold font">30%</p>
              </div>
            </div>
            <Image
              src="/icons/humidity.png"
              alt="humidity"
              width={130}
              height={50}
              priority={true}
            />
          </div>
        </div>
        <div className="dashboard-card bg-gradient-to-tr from-[#fff2c4] to-[#fcc603]">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[40px] font-semibold text-black">
                Brightness
              </p>
              <p className="text-[60px] font-semibold">30 Lux</p>
            </div>
            <Image
              src="/icons/brightness.png"
              alt="brightness"
              width={130}
              height={50}
              priority={true}
            />
          </div>
        </div>
        <div className="dashboard-card col-span-2 row-span-4"></div>
        <div className="dashboard-card row-span-2"></div>
        <div className="dashboard-card row-span-2"></div>
      </div>
    </div>
  );
}
