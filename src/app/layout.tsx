import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHARLES & KEITH Indonesia - Belanja di situs resmi",
  description:
    "Belanja di situs resmi CHARLES & KEITH untuk fashion wanita dan fashion anak-anak terbaru, termasuk tas, sepatu, dan aksesori. Lihat koleksi baru hari ini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/exv2fdk.css" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
