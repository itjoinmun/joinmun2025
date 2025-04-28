import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import NavbarResolver from "../navbar-resolver";
import { NumberTicker } from "@/components/magicui/number-ticker";

const Hero = () => {
  const IDK_SECTION = [
    {
      header: 100,
      description: "Participants",
    },
    {
      header: 100,
      description: "Councils",
    },
    {
      header: 100,
      description: "Years",
    },
  ];

  return (
    <main id="hero" className="relative flex min-h-screen items-end">
      <NavbarResolver />
      <Container className="max-w-[1536px] justify-end pb-12">
        <div className="h-24" />
        <h1 className="max-w-lg text-3xl/normal font-bold md:text-4xl/normal">
          Your Chance to Take on Real-World Issues and Shape Meaningful Change
        </h1>
        <h3>Join an experience that grows your voice and sharpens your mind.</h3>
        <Link
          href={`/signup`}
          className={cn(buttonVariants({ variant: "primary" }), "mt-2 mb-8 w-fit text-sm md:mb-0")}
        >
          Register Now
        </Link>

        <section className="flex w-full flex-col justify-between gap-6 md:flex-row-reverse md:items-end">
          <div className="mx-auto flex w-full max-w-xs items-end justify-between md:mr-0 md:ml-auto">
            {IDK_SECTION.map((section, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <h1 className="text-center text-xl font-bold md:text-2xl">
                  <NumberTicker
                    className="text-white"
                    value={section.header}
                    delay={index * 0.2}
                    // startValue={50}
                  />
                  +
                </h1>
                <h3 className="text-center text-sm md:text-base">{section.description}</h3>
              </div>
            ))}
          </div>

          <div className="flex h-fit items-center justify-center gap-3 md:justify-start">
            <Image src={`/MUN-UGM.png`} alt="Logo" width={100} height={100} className="size-8" />
            <h4 className="text-center text-xs font-semibold md:text-base">
              Model United Nations Universitas Gadjah Mada
            </h4>
          </div>
        </section>
      </Container>

      {/* image + overlay */}
      <Image
        src={`/assets/home/hero.webp`}
        alt="JOINMUN Image"
        fill
        sizes="100%"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/10 to-black/10" />
    </main>
  );
};

export default Hero;
