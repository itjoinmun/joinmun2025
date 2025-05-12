"use client";
import * as motion from "motion/react-client";
import BatikPattern from "@/components/Element/batik-pattern";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
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
    date: "Coming Soon",
    title: "Regular Wave Registration",
  },
  {
    date: "Coming Soon",
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
      <motion.main
        className="from-foreground to-red-normal relative z-0 overflow-hidden bg-gradient-to-b pb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <Container className="gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <SubHeading>Save The Date</SubHeading>
          </motion.div>

          <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2"
            >
              <Heading>Timeline</Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-white md:col-span-3"
            >
              Get a clear view of all the important dates, from registration to the conference days.
              This timeline helps you stay prepared at every stage.
            </motion.div>
          </section>
        </Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Carousel
            opts={{
              align: "end",
            }}
            className="relative w-full"
          >
            <CarouselContent className="-ml-4 px-4 md:-ml-6 md:px-6 lg:px-8">
              {TIMELINE_CONTENT.map((timeline, index) => (
                <CarouselItem
                  key={index}
                  className="2xs:basis-1/2 pl-4 sm:basis-1/4 md:pl-6 lg:basis-1/5"
                >
                  <TimelineCard {...timeline} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="block md:hidden" />
            <CarouselNext className="right-2 z-10 block md:hidden" />
          </Carousel>
        </motion.div>

        <BatikPattern />
      </motion.main>
    </>
  );
};

const TimelineCard = ({ date, title, index }: { date: string; title: string; index: number }) => {
  return (
    <motion.div
      className="flex h-full flex-col items-center gap-1 rounded-xs bg-gradient-to-br from-white/40 to-white/10 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
    >
      <h2 className="w-full text-center">{date}</h2>
      <motion.div
        className="my-2 w-full border-b"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay: 0.2 * (index + 1) }}
      />
      <h1 className="my-auto text-center text-lg/snug font-bold">{title}</h1>
    </motion.div>
  );
};

export default Timeline;
