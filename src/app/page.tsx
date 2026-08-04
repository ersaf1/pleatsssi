import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { DualLifestyleBanner } from "@/components/DualLifestyleBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <DualLifestyleBanner />
      </main>
      <Footer />
    </>
  );
}
