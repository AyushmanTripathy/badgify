import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BadgiFy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body
        className="min-h-screen w-screen flex flex-col items-center"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
