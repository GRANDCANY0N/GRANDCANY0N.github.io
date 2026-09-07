import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "孙嘉豪｜Agent 工程与 RAG 项目",
  description: "孙嘉豪的个人主页，记录 Agent 系统、复杂文档 RAG 与后端工程项目。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
