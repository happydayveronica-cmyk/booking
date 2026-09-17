import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "반포고 면접 교실 예약",
  description: "반포고등학교 면접 교실 예약 서비스",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
