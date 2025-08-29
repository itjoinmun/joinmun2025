import BatikPattern from "@/components/Element/batik-pattern";
import { Heading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { ThemeCarousel } from "../home/home-theme";
import * as motion from "motion/react-client";
import { fadeInVariants } from "@/utils/helpers/animation-variants";

const ThemePhilosophy = () => {
  return (
    <main className="from-foreground to-red-normal relative z-0 overflow-hidden bg-gradient-to-b pb-12">
      <Container className="gap-2">
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading className="">Sumbu Filosofi</Heading>

          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            whileInView={"visible"}
            viewport={{ once: true, amount: 0.8 }}
            className="text-sm text-pretty text-white md:col-span-2"
          >
            The Imaginary Axis in Yogyakarta symbolizes two journeys in human life, the journey from
            Panggung Krapyak to the Keraton represents the process of personal growth , where one
            discovers their life&apos;s lessons. Meanwhile, the journey from Tugu to the Keraton
            represents the human quest towards the Creator, reflecting the search for spiritual
            fulfillment and a higher meaning in life. Together, the axis represents the path from
            origin and maturation to a deeper spiritual purpose.
          </motion.div>
        </section>
      </Container>

      <ThemeCarousel />

      <BatikPattern />
    </main>
  );
};

export default ThemePhilosophy;
