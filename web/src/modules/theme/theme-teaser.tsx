"use client";

import BatikPattern from "@/components/Element/batik-pattern";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import * as motion from "motion/react-client";
import { fadeInVariants } from "@/utils/helpers/animation-variants";

const ThemeTeaser = () => {
  return (
    <main className="from-foreground to-red-normal relative overflow-hidden bg-gradient-to-b">
      {/* Animasi untuk heading dan deskripsi */}
      <div>
        <Container className="gap-2">
          <SubHeading>Teaser</SubHeading>
          <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
            <Heading className="col-span-2">Whispers of The Theme</Heading>

            <motion.div
              variants={fadeInVariants}
              initial={"hidden"}
              whileInView={"visible"}
              viewport={{ once: true, amount: 0.8 }}
              className="text-sm text-white md:col-span-3"
            >
              Discover the essence behind the theme, before it unfolds in full. A quiet nod to
              something greater.
            </motion.div>
          </section>
        </Container>
      </div>

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
