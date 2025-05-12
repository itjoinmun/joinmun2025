"use client";

import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { cn } from "@/utils/helpers/cn";
import { isThemeReveal, isTrailerReveal } from "@/utils/helpers/reveal";
import Image from "next/image";
import * as motion from "motion/react-client";
import { fadeInVariants } from "@/utils/helpers/animation-variants";

const ThemeTrailer = () => {
  return (
    <main className="bg-background relative overflow-hidden bg-gradient-to-b">
      <Container className="gap-2">
        <SubHeading>Story Behind The Theme</SubHeading>

        <section
          className={cn("grid grid-cols-1 gap-2 md:gap-12", isThemeReveal ? "md:grid-cols-5" : "")}
        >
          <div
            className={cn(isThemeReveal ? "md:col-span-2" : "")}
          >
            <Heading>2025 JOINMUN Trailer</Heading>
          </div>

          {isThemeReveal && (
            <motion.div
              className="text-sm text-white md:col-span-3"
              variants={fadeInVariants}
              initial={'hidden'}
              whileInView={'visible'}
              viewport={{ once: true, amount: 0.8}}
            >
              Now that the theme is out, let this trailer walk you through the feeling, message, and
              inspiration behind it — captured in one short visual journey.
            </motion.div>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 60,
            damping: 15,
          }}
          className="border-gold relative mx-auto mt-10 w-full rounded-xl border p-6 pt-0 md:border-2 md:p-12 lg:w-4xl 2xl:w-6xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute top-3 right-3 z-50 md:top-6 md:right-6 lg:top-3 lg:right-3"
          >
            <Image
              src="/assets/theme/pattern.webp"
              alt="Pattern JOINMUN 2025"
              height={392}
              width={392}
              className="max-w-24 md:max-w-36 lg:max-w-64"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-3 left-3 z-50 md:bottom-6 md:left-6 lg:bottom-3 lg:left-3"
          >
            <Image
              src="/assets/theme/pattern.webp"
              alt="Pattern JOINMUN 2025"
              height={392}
              width={392}
              className="max-w-24 rotate-180 md:max-w-36 lg:max-w-64"
            />
          </motion.div>

          {isTrailerReveal ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <HeroVideoDialog
                className="z-20 block dark:hidden"
                animationStyle="from-bottom"
                videoSrc="/assets/theme/like him.mp4?autoplay=1&mute=1"
                thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
                thumbnailAlt="JOINMUN 2025 Teaser"
              />
              {/* Video Player */}
              <HeroVideoDialog
                className="hidden max-h-full w-auto dark:block"
                animationStyle="top-in-bottom-out"
                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
                thumbnailAlt="JOINMUN 2025 Teaser"
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Image
                  src="/assets/theme/tugu.webp"
                  alt="Pattern JOINMUN 2025"
                  height={232}
                  width={394}
                  className="mx-auto mt-10 max-w-28"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <Heading>Coming Soon</Heading>
              </motion.div>

              <motion.p
                className="mb-10 text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                You&apos;ve been waiting. We&apos;ve been building.
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </main>
  );
};

export default ThemeTrailer;
