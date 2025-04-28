import { Heading, SubHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import Link from "next/link";

const HomeTheme = () => {
  return (
    <main id="theme" className="bg-background relative z-0 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Grand Theme</SubHeading>
        <section className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-6">
          <Heading>Renjana Furniture</Heading>
          <div className="text-sm text-white md:max-w-2xl">
            JoinMUN is a 3-day event that brings together participants for diplomatic discussions.
            During the conference, delegates represent different countries and participate in
            workshops to enhance their skills. The event aims to foster collaboration, critical
            thinking, and international awareness.
            <Link href={`/theme`} className={cn(buttonVariants({ variant: "primary" }), "mt-4")}>
              Read More
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default HomeTheme;
