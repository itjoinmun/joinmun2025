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
            <Heading>What Inspired Us</Heading>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, type: 'tween' }}
            className="text-sm text-white"
          >
            This year, JOINMUN adopts the profound concept of the Sumbu Filosofi of Yogyakarta—a
            sacred line that connects the Southern Ocean, the Yogyakarta Palace, and Mount Merapi.
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, delay: 0.5, type: 'tween' }}
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
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, delay: 0.8, type: 'tween', ease: 'easeOut' }}
      >
        <ImageCarousel />
      </motion.div>

      {/* <BatikPattern /> */}
    </main>
  );
};

export default ThemeInspired;
