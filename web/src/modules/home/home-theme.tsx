"use client";
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

const HomeTheme = () => {
  return (
    <>
      <div
        id="theme"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      {isThemeReveal ? (
        <main className="bg-background relative z-0 scroll-mt-20 overflow-hidden pb-12">
          <Container className="gap-2">
            <SubHeading>Event Theme</SubHeading>
            <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-12">
              <Heading className="">
                Redefining Justice, Reshaping Destiny: Uniting for a World of True Equity and
                Enduring Security
              </Heading>
              <div className="flex flex-col gap-4 text-sm text-pretty text-white md:max-w-2xl">
                JOINMUN is a 3-day event that brings together participants for diplomatic
                discussions. During the conference, delegates represent different countries and
                participate in workshops to enhance their skills. The event aims to foster
                collaboration, critical thinking, and international awareness.
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
      ) : (
        <div className="bg-background relative min-h-[85dvh] w-full overflow-hidden md:min-h-[70vh]">
          {/* Background solid color */}
          <div className="bg-background absolute inset-0" />

          {/* Background image */}
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: `url('/assets/theme/coming-soon-theme.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.8,
            }}
          />

          {/* Top gradient overlay */}
          <div className="from-background via-background absolute top-0 right-0 left-0 z-10 h-[22rem] bg-gradient-to-b via-40% to-transparent lg:h-84" />

          {/* Bottom gradient overlay */}
          <div className="from-background via-background absolute right-0 bottom-0 left-0 z-10 h-20 bg-gradient-to-t via-30% to-transparent md:h-32" />

          {/* Centered text */}

          {/* <Heading className="scale-75">Grand Theme is Coming.</Heading> */}
          <div className="absolute inset-x-0 z-20 flex flex-col items-center justify-center">
            <Container className="h-full min-h-[85dvh] gap-2 md:min-h-[70vh]">
              <SubHeading>Coming Soon</SubHeading>
              <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
                <Heading className="col-span-2">2025 JOINMUN Theme</Heading>
                <div className="flex flex-col gap-4 text-sm text-pretty text-white md:col-span-3">
                  Get ready to witness the big reveal of this year&apos;s theme —This year,
                  we&apos;re taking inspiration from something deeply rooted — in place, in meaning,
                  and in movement.
                </div>
              </section>
              <div className="my-auto flex h-full flex-col items-center justify-center">
                <Heading className="text-gradient-gold mt-auto">Soon to Be Revealed</Heading>
              </div>
            </Container>
          </div>
        </div>
      )}
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
  // description = "A short description",
}: {
  title?: string;
  src: string;
  description?: string;
}) => {
  return (
    <div className="relative flex h-80 flex-col justify-end gap-0 px-5 py-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      {/* <h3>{description}</h3> */}

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
