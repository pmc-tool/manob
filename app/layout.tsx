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
              <CartProvider>
                <RenameModalProvider>
                  <SettingsModalProvider>
                    <Toaster position="top-right" />
                    {children}
                  </SettingsModalProvider>
                </RenameModalProvider>
              </CartProvider>
            </AuthProvider>
          </AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
