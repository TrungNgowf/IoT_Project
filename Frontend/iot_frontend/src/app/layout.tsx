import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";


const montserrat = Montserrat({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "IoT Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'font-boxedRound'}>{children}</body>
    </html>
  );
}
