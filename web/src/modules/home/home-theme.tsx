"use client";
import { Heading, SubHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import { THEMES } from "@/utils/helpers/themes";
import Image from "next/image";
import Link from "next/link";

const HomeTheme = () => {
  return (
    <>
      <div
        id="theme"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      <main className="bg-background relative z-0 scroll-mt-20 overflow-hidden pb-12">
        <Container className="gap-2">
          <SubHeading>Grand Theme</SubHeading>
          <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
            <Heading>stop troll</Heading>
            <div className="flex flex-col gap-4 text-sm text-pretty text-white md:col-span-2 md:max-w-2xl">
              JoinMUN is a 3-day event that brings together participants for diplomatic discussions.
              During the conference, delegates represent different countries and participate in
              workshops to enhance their skills. The event aims to foster collaboration, critical
              thinking, and international awareness.
              <Link
                href={`/theme`}
                className={cn(buttonVariants({ variant: "primary" }), "ml-auto w-fit md:ml-0")}
              >
                Read More
              </Link>
            </div>
          </section>
        </Container>

        <ThemeCarousel />
      </main>
    </>
  );
};

export const ThemeCarousel = () => {
  return (
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
        {THEMES.map((theme, index) => (
          <CarouselItem key={index} className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/5">
            <ThemeCard {...theme} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="block md:hidden" />
      <CarouselNext className="right-2 z-10 block md:hidden" />
    </Carousel>
  );
};

const ThemeCard = ({
  title = "Card Title",
  src,
  description = "A short description",
}: {
  title?: string;
  src: string;
  description?: string;
}) => {
  return (
    <div className="relative flex h-80 flex-col justify-end gap-0 p-6">
      <h1 className="font-semibold">{title}</h1>
      <h3>{description}</h3>

      {/* image + overlay */}
      <Image
        src={`/assets/home/themes/${src}`}
        alt={`${title}`}
        fill
        sizes="50%"
        className="pointer-events-none -z-10 object-cover"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/20" />
    </div>
  );
};

export default HomeTheme;
