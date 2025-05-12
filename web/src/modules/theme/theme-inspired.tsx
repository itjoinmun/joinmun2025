"use client";
import { Heading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { ImageCarousel } from "@/modules/theme/image-carousel";
import * as motion from "motion/react-client";

const ThemeInspired = () => {
  return (
    <main className="bg-background relative z-0 overflow-hidden pb-12">
      <Container className="gap-2">
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Heading>What Inspired Us</Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-white"
          >
            This year, JOINMUN adopts the profound concept of the Sumbu Filosofi of Yogyakarta—a
            sacred line that connects the Southern Ocean, the Yogyakarta Palace, and Mount Merapi.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-white"
          >
            By choosing this theme, we aim to reflect the essence of balanced governance, unity in
            diversity, and the pursuit of peace—values deeply emainable vision.
          </motion.div>
        </section>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <ImageCarousel />
      </motion.div>

      {/* <BatikPattern /> */}
    </main>
  );
};

export default ThemeInspired;
