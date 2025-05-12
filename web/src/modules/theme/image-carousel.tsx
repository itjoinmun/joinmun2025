"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IMAGE_INSPIRED } from "@/utils/helpers/themes";
import Image from "next/image";

export const ImageCarousel = () => {
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
        {IMAGE_INSPIRED.map((image, index) => (
          <CarouselItem key={index} className="2xs:basis-1/2 pl-2 md:basis-1/3 md:pl-4">
            <ImageCard {...image} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="block md:hidden" />
      <CarouselNext className="right-2 z-10 block md:hidden" />
    </Carousel>
  );
};

const ImageCard = ({
  title = "Card Title",
  src,
}: {
  title?: string;
  src: string;
  description?: string;
}) => {
  return (
    <div className="relative flex h-56 flex-col justify-end gap-0 p-6">
      {/* image + overlay */}
      <Image
        src={`/assets/theme/what-inspired-us/${src}`}
        alt={`${title}`}
        fill
        sizes="50%"
        className="pointer-events-none -z-10 object-cover"
      />
    </div>
  );
};
