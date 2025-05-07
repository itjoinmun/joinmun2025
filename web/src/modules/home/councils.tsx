"use client";
import { Heading, SubHeading } from "@/components/section-heading";
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
          <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
            <Heading>{isCouncilsReveal ? "Councils" : "The Council"}</Heading>

            <div className="text-sm text-white md:col-span-2">
              At JOINMUN, each council is thoughtfully curated to reflect pressing real-world
              issues, offering delegates the space to debate. Our councils are designed to stimulate
              critical thinking, encourage collaboration, and develop articulate, confident leaders.
            </div>
          </section>
        </Container>

        <Carousel
          opts={{
            align: "center",
            breakpoints: {
              "(min-width: 640px)": { align: "end" },
            },
          }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-2 px-4 md:-ml-4 md:px-6 lg:px-8">
            {(isCouncilsReveal ? COUNCILS : COUNCILS.slice(-4)).map((theme, index) => (
              <CarouselItem
                key={index}
                className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
              >
                <CouncilCard {...theme} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="block md:hidden" />
          <CarouselNext className="right-2 z-10 block md:hidden" />
        </Carousel>

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
      <Link href={`/councils/${props.slug}`} className="group absolute top-4 right-4 w-fit">
        <Button variant={`insideCard`} className="text-xs hover:cursor-pointer">
          Read More <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
    ) : (
      ""
    )}

    {isCouncilsReveal ? (
      <div className="z-10 flex min-h-[35%] w-full items-center gap-3 bg-black/70 p-4 backdrop-blur-sm">
        <aside className="relative size-14 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          <Image
            src={`/assets/councils/${props.src}`}
            alt={`${props.name} Image`}
            fill
            sizes="50%"
            className="pointer-events-none object-cover"
          />
        </aside>
        <summary className="flex flex-col gap-1 text-white">
          <h1 className="text-xl font-bold xl:text-2xl">{props.name}</h1>
          <h6 className="text-xs text-pretty xl:text-sm">{props.fullname}</h6>
        </summary>
      </div>
    ) : (
      <div className="z-10 flex min-h-[35%] w-full flex-col items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold">To be Announced</h1>
        <h6 className="text-xs text-pretty">The Council Awaits. Stay Tuned.</h6>
      </div>
    )}

    <Image
      src={isCouncilsReveal ? `/lebron.webp` : `/assets/councils/coming-soon-council.webp`}
      alt={isCouncilsReveal ? props.name : ""}
      fill
      sizes="100%"
      className="-z-10 object-cover"
    />
  </article>
);

export default Councils;
