"use client";
import BatikPattern from "@/components/batik-pattern";
import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TIMELINE_CONTENT = [
  {
    date: "1 - 30 June",
    title: "Early Bird Registration",
  },
  {
    date: "14 July - 14 Aug",
    title: "Regular Wave Registration",
  },
  {
    date: "18 Aug - 18 Sep",
    title: "Late Wave Registration",
  },
  {
    date: "Coming Soon",
    title: "Roadshow",
  },
  {
    date: "31 Oct - 2 Nov",
    title: "Main Event",
  },
];

const Timeline = () => {
  return (
    <>
      <div
        id="rundown"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      <main className="from-foreground to-red-normal relative z-0 overflow-hidden bg-gradient-to-b pb-12">
        <Container className="gap-2">
          <SubHeading>Save The Date</SubHeading>
          <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
            <Heading className="col-span-2">Timeline</Heading>

            <div className="text-sm text-white md:col-span-3">
              Get a clear view of all the important dates, from registration to the conference days.
              This timeline helps you stay prepared at every stage.
            </div>
          </section>
        </Container>

        <Carousel
          opts={{
            align: "end",
            // breakpoints: {
            //   "(min-width: 640px)": { align: "end" },
            // },
          }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-4 px-4 md:-ml-6 md:px-6 lg:px-8">
            {TIMELINE_CONTENT.map((timeline, index) => (
              <CarouselItem
                key={index}
                className="2xs:basis-1/2 pl-4 sm:basis-1/4 md:pl-6 lg:basis-1/5"
              >
                <TimelineCard {...timeline} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="block md:hidden" />
          <CarouselNext className="right-2 z-10 block md:hidden" />
        </Carousel>

        <BatikPattern />
      </main>
    </>
  );
};

const TimelineCard = ({ date, title }: { date: string; title: string }) => {
  return (
    <div className="flex h-full flex-col items-center gap-1 rounded-xs bg-gradient-to-br from-white/40 to-white/10 p-4 backdrop-blur-sm">
      <h2 className="w-full text-center">{date}</h2>
      <div className="my-2 w-full border-b" />
      <h1 className="my-auto text-center text-lg/snug font-bold">{title}</h1>
    </div>
  );
};

export default Timeline;
