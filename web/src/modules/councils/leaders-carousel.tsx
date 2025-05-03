"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Council } from "@/utils/helpers/councils";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

export const LeaderCarousel = (props: Council) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="relative w-full px-20"
    >
      <CarouselContent className="">
        {props.chairs.map((chair, index) => (
          <CarouselItem key={index} className="xs:basis-1/2">
            <LeaderCard {...chair} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="block border" />
      <CarouselNext className="z-10 block border" />
    </Carousel>
  );
};

const LeaderCard = ({
  name,
  role,
  image,
  experiences,
}: {
  name: string;
  role: string;
  image: string;
  experiences: string[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="pointer-events-auto relative flex h-56 gap-2 rounded-lg bg-black/50 lg:pointer-events-none lg:bg-transparent">
          {/* Image Section */}
          <div className="relative h-full w-full overflow-hidden rounded-md lg:w-1/3">
            <div className="bg-gray/80 hover:bg-gray/60 absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 lg:hidden">
              <ArrowUpRightIcon color="white" />
            </div>

            <Image
              // src={`/assets/councils/${image}`}
              src={`/lebron.webp`}
              alt={`${name}'s Image`}
              fill
              sizes="33%"
              className="pointer-events-none object-cover"
            />
            <div className="absolute bottom-4 left-4 z-10 lg:bottom-2 lg:left-2">
              <h1 className="text-lg font-bold text-white lg:hidden">{role}</h1>
              <h1 className="font-medium text-white lg:text-lg lg:font-bold">{name}</h1>
            </div>
            <div className="bg-gradient-from-transparent absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Role & Experience Section */}
          <div className="bg-gray hidden w-2/3 flex-col justify-start rounded-md p-4 lg:flex">
            <h2 className="text-lg font-bold text-white">{role}</h2>

            <hr className="border-gray-light my-2 w-full border-b" />

            <h3 className="text-sm">Past Experience</h3>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-white">
              {experiences.map((experience, index) => (
                <li
                  key={index}
                  className="rounded-full border border-neutral-500 bg-neutral-700/50 px-2.5 py-1 text-nowrap"
                >
                  {experience}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="2xs:scale-95 xs:scale-100 scale-110 border-0 bg-transparent">
        <DialogHeader>
          <DialogTitle className="hidden">{""}</DialogTitle>
          <DialogDescription className="flex">
            <div className="relative flex h-56 w-full gap-2 rounded-lg bg-transparent">
              {/* Image Section */}
              <div className="relative h-full w-2/5 overflow-hidden rounded-md *:text-start">
                <Image
                  // src={`/assets/councils/${image}`}
                  src={`/lebron.webp`}
                  alt={`${image}'s Image`}
                  // alt={`${name}'s Image`}
                  fill
                  sizes="33%"
                  className="pointer-events-none object-cover"
                />
                <div className="absolute bottom-4 left-4 z-10 lg:bottom-2 lg:left-2">
                  <h1 className="font-bold text-white sm:text-lg lg:hidden">{role}</h1>
                  <h1 className="text-sm font-medium text-white sm:text-base lg:text-lg lg:font-bold">
                    {name}
                  </h1>
                </div>
                <div className="bg-gradient-from-transparent absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />
              </div>

              <div className="bg-gray 2xs:p-4 flex w-3/5 flex-col justify-start rounded-md p-2">
                <h3 className="self-start text-white">Past Experience</h3>
                <ul className="xs:text-xs mt-3 flex flex-wrap gap-2 text-[10px] text-white">
                  {experiences.map((experience, index) => (
                    <li
                      key={index}
                      className="rounded-full border border-neutral-500 bg-neutral-700/50 px-2.5 py-1"
                    >
                      {experience}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
