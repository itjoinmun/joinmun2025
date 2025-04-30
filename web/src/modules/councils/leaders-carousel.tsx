"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Council } from "@/utils/helpers/councils";
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
          <CarouselItem key={index} className="basis-1/2">
        <LeaderCard {...chair} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="block border" />
      <CarouselNext className="right-2 z-10 block border" />
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
    <div className="relative flex h-56 gap-2 rounded-lg bg-black/50 lg:bg-transparent">
      {/* Image Section */}
      <div className="relative h-full w-full overflow-hidden rounded-md lg:w-1/3">
        <Image
          // src={`/assets/councils/${image}`}
          src={`/lebron.webp`}
          alt={`${name}'s Image`}
          fill
          sizes="33%"
          className="pointer-events-none object-cover"
        />
        <div className="absolute bottom-4 left-4 lg:bottom-2 lg:left-2 z-10">
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
            <li key={index} className="rounded-md border border-white px-2 py-1">
              {experience}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
