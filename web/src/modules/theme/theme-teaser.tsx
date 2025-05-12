"use client";

import BatikPattern from "@/components/Element/batik-pattern";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import * as motion from "motion/react-client";

const ThemeTeaser = () => {
  return (
    <main className="from-foreground to-red-normal relative max-h-[100dvh] overflow-hidden bg-gradient-to-b">
      {/* Animasi untuk heading dan deskripsi */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Container className="gap-2">
          <SubHeading>Teaser</SubHeading>
          <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
            <Heading className="col-span-2">Whispers of The Theme</Heading>

            <div className="text-sm text-white md:col-span-3">
              Discover the essence behind the theme, before it unfolds in full. A quiet nod to
              something greater.
            </div>
          </section>
        </Container>
      </motion.div>

      <Container className="max-w-4xl pt-0 2xl:max-w-6xl">
        {/* Light mode video */}
        <HeroVideoDialog
          className="z-20 block dark:hidden"
          animationStyle="from-bottom"
          videoSrc="/assets/theme/like him.mp4?autoplay=1&mute=1"
          thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
          thumbnailAlt="JOINMUN 2025 Teaser"
        />

        {/* Dark mode video */}
        {/* <HeroVideoDialog
            className="block max-h-full w-auto dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
            thumbnailAlt="JOINMUN 2025 Teaser"
          /> */}
      </Container>

      <BatikPattern className="z-10" />
    </main>
  );
};

export default ThemeTeaser;
