import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { DM_Sans, Kalam } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import { PMCTheme } from "./themes";
import { RenameModalProvider } from "@/context/RenameModalContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from "@/context/SocketProvider";
import { UserModeProvider } from "@/context/UserModeContext";
import StoreProvider from "./StoreProvider";
import { Suspense } from "react";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "manob.ai | Human + AI Code Workspace",
  description: "manob.ai blends human engineers with AI to buy, modify, and deploy production-ready code together.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={PMCTheme}>
      <html lang="en">
        <body className={`${dmSans.variable} ${kalam.variable} antialiased`}>
          <AntdRegistry>
            <AuthProvider>
              <UserModeProvider>
              <CartProvider>
                <RenameModalProvider>
                  <SettingsModalProvider>
                    <Suspense fallback={null}>
                      <StoreProvider>
                        <SocketProvider>
                          <Toaster position="top-right" />
                          {children}
                        </SocketProvider>
                      </StoreProvider>
                    </Suspense>
                  </SettingsModalProvider>
                </RenameModalProvider>
              </CartProvider>
              </UserModeProvider>
            </AuthProvider>
          </AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
