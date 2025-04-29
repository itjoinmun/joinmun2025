import BackLink from "@/components/back-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AuthTemplate = ({
  children,
  src,
  caption,
}: {
  children?: React.ReactNode;
  src: string;
  caption?: string | React.ReactNode;
}) => {
  return (
    <main className="relative z-0 grid min-h-screen auto-rows-min grid-cols-1 md:auto-rows-auto md:grid-cols-2">
      {/* back button on top left */}
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline" }), "absolute top-8 left-8 z-10 w-fit")}
      >
        <ChevronLeft className="size-4" /> Back
      </Link>

      {/* image + overlay section */}
      <section className="relative flex h-[40vh] items-end justify-center overflow-clip md:order-2 md:h-full">
        <Image
          src={src || `/lebron.webp`}
          alt="JOINMUN Image"
          fill
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
        {/* caption */}
        <p className="absolute inset-x-8 bottom-4 text-center text-xs md:bottom-12 md:text-sm">
          {caption}
        </p>
      </section>

      {/* form and other children elements */}
      <section className="no-scrollbar relative flex h-screen flex-col items-center justify-start gap-6 overflow-x-hidden p-6 text-center md:justify-center md:overflow-y-auto md:p-8">
        {children}
      </section>
    </main>
  );
};

export default AuthTemplate;
