import Container from "@/components/ui/container";
import NavbarResolver from "../navbar-resolver";
import Image from "next/image";

const ThemeHero = () => {
  return (
    <main className="relative flex min-h-[60vh] items-center md:min-h-screen">
      <NavbarResolver />
      <Container className="mt-[10vh] max-w-[1536px]">
        <h4 className="text-gradient-gold font-semibold">Grand Theme</h4>
        <h1 className="max-w-lg text-3xl/snug font-bold text-pretty md:text-5xl/normal">
          Renjana Furniture
        </h1>
      </Container>

      {/* image + overlay */}
      <Image
        src={`/assets/theme/theme-hero.webp`}
        alt="JOINMUN Theme"
        fill
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />
    </main>
  );
};

export default ThemeHero;
