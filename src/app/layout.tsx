
import type { Metadata } from "next";
import { TRPCProviderWrapper } from "@/trpc/client";

import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Simple task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProviderWrapper>
          {children}
        </TRPCProviderWrapper>
      </body>
    </html>
  );
}
