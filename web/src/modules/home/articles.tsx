"use client";
import * as motion from "motion/react-client";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Container from "@/components/ui/container";
import { cn } from "@/utils/helpers/cn";
import { isThemeReveal } from "@/utils/helpers/reveal";
import { THEMES } from "@/utils/helpers/themes";
import Image from "next/image";
import Link from "next/link";
import { fadeInVariants, slideInItemVariants } from "@/utils/helpers/animation-variants";

const Articles = () => {
  return (
    <>
      <div
        id="articles"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      <motion.main
        className="bg-background relative z-0 scroll-mt-20 overflow-hidden pb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.2 }}
      >
        <Container className="gap-2">
          <SubHeading>Articles</SubHeading>

          <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-12">
            <Heading>Progressive Writing by Joinmun Delegates</Heading>

            <div className="flex flex-col items-end justify-end gap-4 text-sm text-pretty text-white md:max-w-2xl">
              {/*<motion.p
                variants={fadeInVariants}
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true }}
              >
                JOINMUN is a 3-day event that brings together participants for diplomatic
                discussions. During the conference, delegates represent different countries and
                participate in workshops to enhance their skills. The event aims to foster
                collaboration, critical thinking, and international awareness.
              </motion.p>*/}
              <Link
                href={`/theme`}
                className={cn(buttonVariants({ variant: "primary" }), "ml-auto w-fit md:ml-0")}
              >
                Read More
              </Link>
            </div>
          </section>
        </Container>

        {/* INSERT CARD HERE */}
        <Container className="py-0">
          <div className="h-[200px] w-full bg-amber-300">a</div>
        </Container>
      </motion.main>
    </>
  );
};

export default Articles;
