import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function IdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header theme="solid" />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
