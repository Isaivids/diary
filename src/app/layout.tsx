"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";
import { metadata } from "./metadata";
import { Provider } from "react-redux";
import { store } from "./store/store";

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
        <link rel="icon" href="/diarylogo.svg" type="image/svg+xml" />
      </head>
      <body>
        <Provider store={store}>
          {!hideNavbar && <Navbar />}
          {children}
        </Provider>
      </body>
    </html>
  );
}
