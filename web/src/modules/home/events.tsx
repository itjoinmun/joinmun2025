"use client";
import { Heading, SubHeading } from "@/components/section-heading";
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

const Events = () => {
  return (
    <main className="bg-background relative z-0 overflow-hidden pb-24">
      <Container className="gap-2">
        <SubHeading>Explore our</SubHeading>
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading>Series of Events</Heading>
          <div className="text-sm text-white md:col-span-2">
            JoinMUN is a 3-day event that brings together participants for diplomatic discussions.
            During the conference, delegates represent different countries and participate in
            workshops to enhance their skills. The event aims to foster collaboration, critical
            thinking, and international awareness.
          </div>
        </section>
      </Container>
      {EVENTS.map((event, i) => (
        <section key={i} className="flex flex-col gap-4">
          <Container className="py-5">
            <h3 className="w-full border-b pb-4 font-bold">{event.section}</h3>
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
              {event.events.map((subEvent, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
                >
                  <EventCard {...subEvent} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="block md:hidden" />
            <CarouselNext className="right-2 z-10 block md:hidden" />
          </Carousel>
        </section>
      ))}
    </main>
  );
};

const EventCard = (props: Event) => (
  <div className="relative flex min-h-96 flex-col justify-end gap-0 p-6">
    <div className="bg-gray/40 backdrop-blur-sm absolute top-2 right-2 flex aspect-square size-12 items-center justify-center rounded-sm p-1 text-center text-sm text-white">
      {props.date}
    </div>
    <h1 className="font-semibold leading-snug">{props.title}</h1>
    <h3 className="text-sm leading-snug mt-1">{props.location}</h3>

    {/* image + overlay */}
    <Image
      // src={`/assets/home/events/${props.src}`}
      src={`/lebron.webp`}
      alt={`${props.title}`}
      fill
      sizes="50%"
      className="pointer-events-none -z-10 object-cover"
    />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/20" />
  </div>
);

export default Events;
