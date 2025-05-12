"use client";
import * as motion from "motion/react-client";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { Event, EVENTS } from "@/utils/helpers/events";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

const Events = () => {
  return (
    <motion.main
      className="bg-background relative z-0 overflow-hidden pb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1 }}
    >
      <Container className="gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SubHeading>Explore our</SubHeading>
        </motion.div>

        <section className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-12">
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Heading>Series of Events</Heading>
          </motion.div>

          <motion.div
            className="text-sm text-white md:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            JOINMUN is a 3-day event that brings together participants for diplomatic discussions.
            During the conference, delegates represent different countries and participate in
            workshops to enhance their skills. The event aims to foster collaboration, critical
            thinking, and international awareness.
          </motion.div>
        </section>
      </Container>

      {EVENTS.map((event, i) => (
        <motion.section
          key={i}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 * (i + 1) }}
        >
          <Container className="py-5">
            <h3 className="w-full border-b pb-4 font-bold">{event.section}</h3>
          </Container>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, delay: 0.4 * (i + 1) }}
          >
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
                {event.events.map((subEvent, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
                  >
                    <EventCard {...subEvent} index={index} sectionIndex={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="block md:hidden" />
              <CarouselNext className="right-2 z-10 block md:hidden" />
            </Carousel>
          </motion.div>
        </motion.section>
      ))}
    </motion.main>
  );
};

const EventCard = (props: Event & { index: number; sectionIndex: number }) => (
  <div className="relative flex min-h-96 flex-col justify-end gap-0 p-6">
    <div className="bg-gray/40 absolute top-2 right-2 flex aspect-square size-12 items-center justify-center rounded-sm p-1 text-center text-sm text-white backdrop-blur-sm">
      {props.date}
    </div>

    <h1 className="text-lg leading-snug font-semibold">{props.title}</h1>

    {props.loc === "" ? (
      <div className="bg-red-normal mt-2 flex w-full items-center justify-center rounded-md">
        <h3 className="py-1 text-sm leading-snug">{props.location}</h3>
      </div>
    ) : (
      <div>
        <Link
          href={props.loc || "#"}
          target="_blank"
          rel="noopener noreferer"
          className="bg-red-normal mt-2 flex w-full items-center justify-center rounded-md"
        >
          <h3 className="py-1 text-sm leading-snug">{props.location}</h3>
        </Link>
      </div>
    )}

    {/* image + overlay */}
    <Image
      src={`/assets/home/event/${props.src}`}
      alt={`${props.title}`}
      fill
      sizes="50%"
      className="pointer-events-none -z-10 object-cover"
    />
    <motion.div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/20" />
  </div>
);

export default Events;
