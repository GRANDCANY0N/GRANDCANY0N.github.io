import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "孙嘉豪｜Agent / 后端开发",
  description: "孙嘉豪的个人主页：实习经历、Agent Runtime、复杂文档检索、高并发后端项目与荣誉成果。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
