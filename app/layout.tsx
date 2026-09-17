import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "특별실 예약",
  description: "교과2실과 수업나눔카페 예약 서비스",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
