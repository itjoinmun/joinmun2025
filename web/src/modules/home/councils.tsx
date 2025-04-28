import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";

const Councils = () => {
  return (
    <main id="councils" className="relative z-0 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Explore our</SubHeading>
        <section className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-6">
          <Heading>Councils</Heading>

          <div className="text-sm text-white md:max-w-2xl">
            At JoinMUN, each council is thoughtfully curated to reflect pressing real-world issues,
            offering delegates the space to debate. Our councils are designed to stimulate critical
            thinking, encourage collaboration, and develop articulate, confident leaders.
          </div>
        </section>
      </Container>

      <Image
        src={`/assets/home/councils.webp`}
        alt="JOINMUN Council Image"
        fill
        sizes="80%"
        className="object-cover -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />
    </main>
  );
};

export default Councils;
