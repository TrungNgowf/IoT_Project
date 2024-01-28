"use client";
import Navbar from "../components/navbar";
import Image from "next/image";

export default function Profile() {
  return (
    <>
      <div className="w-screen h-screen bg-slate-600 flex flex-col items-center">
        <Navbar index={3} />
        <div className="flex items-center justify-center px-5 py-5 m-8">
          <style jsx>{`
            * {
              font-family: "Fira Code", monospace;
            }
          `}</style>
          <div className="rounded-lg shadow-xl bg-gray-900 text-white px-5">
            <div className="border-b border-gray-800 px-8 py-3">
              <div className="inline-block w-3 h-3 mr-2 rounded-full bg-red-500"></div>
              <div className="inline-block w-3 h-3 mr-2 rounded-full bg-yellow-300"></div>
              <div className="inline-block w-3 h-3 mr-2 rounded-full bg-green-400"></div>
            </div>
            <div className="flex items-start justify-center gap-3 py-5">
            <Image src="/img/profile.jpg" alt={""} className="rounded" width={150} height={20}/>
              <div className="px-8">
                <p>
                  <em className="text-blue-400">const</em>{" "}
                  <span className="text-green-400">aboutMe</span>{" "}
                  <span className="text-pink-500">=</span>{" "}
                  <em className="text-blue-400">function</em>
                  {`() {`}
                </p>
                <p>
                  &nbsp;&nbsp;<span className="text-pink-500">return </span>
                  {`{`}
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;name:{" "}
                  <span className="text-yellow-300">'Nguyen Viet Trung'</span>,
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;dob:{" "}
                  <span className="text-yellow-300">'2002-02-25'</span>,
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;studentCode:{" "}
                  <span className="text-yellow-300">'B20DCPT219'</span>,
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;class:{" "}
                  <span className="text-yellow-300">'D20PTDPT'</span>,
                </p>
                <p>&nbsp;&nbsp;{`}`}</p>
                <p>{`}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
