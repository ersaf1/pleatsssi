import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLEATSSSI Indonesia - Belanja di situs resmi",
  description:
    "Belanja di situs resmi PLEATSSSI untuk fashion wanita dan fashion anak-anak terbaru, termasuk tas, sepatu, dan aksesori. Lihat koleksi baru hari ini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <head>
        <meta name="theme-color" content="#FAF7F2" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1918] font-sans antialiased">{children}</body>
    </html>
  );
}
