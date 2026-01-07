import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo List",
  description: "A todo list for you to manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen flex flex-col tracking-tight selection:bg-violet-500/30 selection:text-violet-900 dark:selection:text-violet-100`}>
        {children}
      </body>
    </html>
  );
}
