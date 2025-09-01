"use client";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Council, COUNCILS } from "@/utils/helpers/councils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { isCouncilsReveal } from "@/utils/helpers/reveal";
import * as motion from "motion/react-client";
import { fadeInVariants, slideInItemVariants } from "@/utils/helpers/animation-variants";

const Councils = () => {
  return (
    <>
      <div
        id="councils"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      <main className="relative z-0 overflow-hidden pb-12">
        <Container className="gap-2">
          <SubHeading>{isCouncilsReveal ? "Explore our" : "Coming Soon"}</SubHeading>

          <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
            <div className="col-span-2">
              <Heading>{isCouncilsReveal ? "Councils" : "The Council"}</Heading>
            </div>

            <motion.div
              variants={fadeInVariants}
              initial={"hidden"}
              whileInView={"visible"}
              viewport={{ once: true }}
              className="text-sm text-white md:col-span-3"
            >
              At JOINMUN, each council is thoughtfully curated to reflect pressing real-world
              issues, offering delegates the space to debate. Our councils are designed to stimulate
              critical thinking, encourage collaboration, and develop articulate, confident leaders.
            </motion.div>
          </section>
        </Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Carousel>
            <CarouselContent className="-ml-2 px-4 md:-ml-4 md:px-6 lg:px-8">
              {(isCouncilsReveal ? COUNCILS : COUNCILS.slice(-4)).map((theme, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
                >
                  <motion.div
                    variants={slideInItemVariants}
                    initial={"hidden"}
                    whileInView={"visible"}
                    custom={index}
                    viewport={{ once: true }}
                  >
                    <CouncilCard {...theme} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="block md:hidden" />
            <CarouselNext className="right-2 z-10 block md:hidden" />
          </Carousel>
        </motion.div>

        {/* image + overlay */}
        <Image
          src={`/assets/home/council.webp`}
          alt="JOINMUN Council Image"
          fill
          sizes="80%"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/60" />
      </main>
    </>
  );
};

const CouncilCard = (props: Council) => (
  <article className="bg-gold/5 relative flex h-80 flex-col justify-end overflow-hidden rounded-sm xl:h-[380px]">
    {isCouncilsReveal ? (
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="absolute top-4 right-4 w-fit"
      >
        <Link href={`/councils/${props.slug}`} className="group">
          <Button variant={`insideCard`} className="text-xs hover:cursor-pointer">
            Read More <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>
    ) : (
      ""
    )}

    {isCouncilsReveal ? (
      <div className="z-10 flex min-h-[30%] w-full items-center gap-3 bg-black/70 px-4 py-2 backdrop-blur-sm">
        <aside className="relative size-14 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          <Image
            src={`/assets/councils/logo/${props.logo}`}
            alt={`${props.name} Image`}
            fill
            sizes="50%"
            className="pointer-events-none object-cover"
          />
        </aside>
        <summary className="flex flex-col gap-1 text-white">
          <h1 className="text-xl font-bold xl:text-2xl">{props.name}</h1>
          {/* <h6 className="text-xs text-pretty xl:text-sm">{props.fullname}</h6> */}
          <h6 className="text-xs text-pretty xl:text-sm">{props.delegate}</h6>
        </summary>
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
        className="z-10 flex min-h-[30%] w-full flex-col items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <h1 className="text-xl font-bold">To be Announced</h1>
        <h6 className="text-xs text-pretty">The Council Awaits. Stay Tuned.</h6>
      </motion.div>
    )}

    <Image
      src={
        isCouncilsReveal
          ? `/assets/councils/thumbnail/${props.src}`
          : `/assets/councils/coming-soon/coming-soon-council.webp`
      }
      alt={isCouncilsReveal ? props.name : "Councils JOINMUN 2025"}
      fill
      sizes="100%"
      className="-z-10 object-cover"
    />
  </article>
);

export default Councils;
