import BatikPattern from "@/components/Element/batik-pattern";
import { Heading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { ThemeCarousel } from "../home/home-theme";

const ThemePhilosophy = () => {
  return (
    <main className="from-foreground to-red-normal relative z-0 overflow-hidden bg-gradient-to-b pb-12">
      <Container className="gap-2">
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading>Sumbu Filosofi</Heading>

          <div className="text-sm text-pretty text-white md:col-span-2">
            The Imaginary Axis in Yogyakarta symbolizes two journeys in human life, the journey from
            Panggung Krapyak to the Keraton represents the process of personal growth , where one
            discovers their life&apos;s lessons. Meanwhile, the journey from Tugu to the Keraton
            represents the human quest towards the Creator, reflecting the search for spiritual
            fulfillment and a higher meaning in life. Together, the axis represents the path from
            origin and maturation to a deeper spiritual purpose.
          </div>
        </section>
      </Container>

      <ThemeCarousel />

      <BatikPattern />
    </main>
  );
};

export default ThemePhilosophy;
