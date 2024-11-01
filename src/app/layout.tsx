"use client";

import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";
import { metadata } from "./metadata";
import { Provider } from "react-redux";
import { store } from "./store/store";
// import { metadata } from "./metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/" || pathname === "/register";

  return (
    <html lang="en">
      <head>
        <title>{(metadata?.title as string) || "Diary"}</title>
        <meta name="description" content={metadata?.description || "Diary"} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          {!hideNavbar && <Navbar />}
          {children}
        </Provider>
      </body>
    </html>
  );
}
