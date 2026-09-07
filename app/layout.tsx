import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "孙嘉豪｜Agent 工程师",
  description: "孙嘉豪的个人主页与项目履历：Agent 系统、复杂文档 RAG、Multi-Agent 与后端工程。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
