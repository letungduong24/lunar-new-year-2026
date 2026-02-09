import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Chúc Mừng Năm Mới 2026 - Bính Ngọ",
  description: "Đếm ngược đến Tết Nguyên Đán 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${roboto.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
