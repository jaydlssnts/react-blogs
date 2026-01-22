"use client";
import "./globals.css";
import { Toaster } from "sonner";
import { store } from "@/lib/store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster position="top-center" richColors />
          {children}
        </Provider>
      </body>
    </html>
  );
}
