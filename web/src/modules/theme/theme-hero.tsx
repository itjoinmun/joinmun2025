import Container from "@/components/ui/container";
import NavbarResolver from "../../components/Layout/navbar-resolver";
import Image from "next/image";

const ThemeHero = () => {
  return (
    <main className="relative flex min-h-[80dvh] items-center md:min-h-screen">
      <NavbarResolver />
      <Container className="max-w-8xl mt-[10vh]">
        <h4 className="text-gradient-gold font-semibold">Event Theme</h4>
        <h1 className="max-w-2xl text-3xl/snug font-bold text-pretty md:text-4xl/normal">
          Redefining Justice, Reshaping Destiny: Uniting for a World of True Equity and Enduring
          Security
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
