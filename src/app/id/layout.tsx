import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function IdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1918] flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-1 bg-[#FAF7F2] text-[#1A1918]">{children}</main>
      <Footer />
    </div>
  );
}
