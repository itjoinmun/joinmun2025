import BatikPattern from "@/components/batik-pattern";
import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const ThemePhilosophy = () => {
  return (
    <main className="from-foreground to-red-normal relative -z-10 overflow-hidden bg-gradient-to-b">
      <Container className="gap-2">
        <section className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
          <Heading>Sumbu Filosofis</Heading>

          <div className="text-sm text-white md:max-w-2xl">
            The Imaginary Axis in Yogyakarta symbolizes two journeys in human life, the journey from
            Panggung Krapyak to the Keraton represents the process of personal growth , where one
            discovers their life&apos;s lessons. Meanwhile, the journey from Tugu to the Keraton
            represents the human quest towards the Creator, reflecting the search for spiritual
            fulfillment and a higher meaning in life. Together, the axis represents the path from
            origin and maturation to a deeper spiritual purpose.
          </div>
        </section>
      </Container>

      <BatikPattern />
    </main>
  );
};

export default ThemePhilosophy;
