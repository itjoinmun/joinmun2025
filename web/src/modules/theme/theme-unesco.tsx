"use client";

import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";
import * as motion from "motion/react-client";

const RECOGNIZED_VALUE = [
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/natural-food.png",
    title: "Living cultural traditions",
    subtitle:
      "The axis connects Mount Merapi, the Yogyakarta Palace, and the Indian Ocean — reflecting Javanese cosmology and the concept of harmony between nature, human life, and the spiritual realm.",
  },
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/triskelion.png",
    title: "Philosophical Value",
    subtitle:
      "Embodies the Tri Mandala principle, a spatial and philosophical concept emphasizing balance between microcosm (individual), mesocosm (society), and macrocosm (universe).",
  },
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/french-canadian-fleur-de-lys.png",
    title: "Cultural and Spiritual Heritage",
    subtitle:
      "The alignment hosts significant cultural and spiritual sites, integrating rituals, traditions, and daily life into a unified sacred landscape.",
  },
];

const ThemeUnesco = () => {
  return (
    <main className="bg-background relative -z-10 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Why is The Sumbu Filosofi of Yogyakarta</SubHeading>

        <section className="grid grid-cols-1 gap-y-2">
          <Heading>Recognized by UNESCO</Heading>

          <div className="mt-7 flex flex-col gap-x-11 gap-y-8 lg:flex-row">
            <div className="relative aspect-[354/219] w-full shrink-0 shadow-lg lg:aspect-auto lg:h-full lg:max-w-[32%]">
              <Image
                src="/assets/theme/recognized.webp"
                alt="The Sumbu Filosofi of Yogyakarta"
                fill
                sizes="100%"
                loading="lazy"
                className="object-cover"
              />
            </div>

            <div className="flex h-fit flex-col gap-y-2 self-center">
              {RECOGNIZED_VALUE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="mb-4 flex items-center gap-x-3 lg:gap-x-7"
                >
                  <Image
                    width="90"
                    height="90"
                    src={item.icon}
                    alt="Icon"
                    className="w-11 text-white lg:w-14"
                  />
                  <div className="flex flex-col">
                    <h3 className="mb-1 text-lg font-semibold lg:mb-3">{item.title}</h3>
                    <p className="text-primary-foreground text-xs md:text-sm xl:text-base">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default ThemeUnesco;
