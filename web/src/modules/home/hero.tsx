import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import NavbarResolver from "../navbar-resolver";
import { NumberTicker } from "@/components/magicui/number-ticker";
import * as motion from "motion/react-client";

const Hero = () => {
  const IDK_SECTION = [
    {
      header: 180,
      description: "Participants",
    },
    {
      header: 7,
      description: "Councils",
    },
    {
      header: 10,
      description: "Years",
    },
  ];

  return (
    <main id="hero" className="relative flex min-h-[85vh] items-end md:min-h-screen">
      <NavbarResolver />
      <Container className="max-w-8xl justify-end pb-12">
        <div className="h-24" />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0, type: "spring" }}
          className="max-w-lg text-3xl/normal font-bold md:text-4xl/normal"
        >
          Your Chance to Take on Real-World Issues and Shape Meaningful Change
        </motion.h1>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
        >
          Join an experience that grows your voice and sharpens your mind.
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "tween" }}
        >
          <Link
            href={`/signup`}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "mt-2 mb-8 w-fit text-sm md:mb-0",
            )}
          >
            Register Now
          </Link>
        </motion.div>

        <section className="flex w-full flex-col justify-between gap-6 md:flex-row-reverse md:items-end">
          <div className="mx-auto flex w-full max-w-xs items-end justify-between md:mr-0 md:ml-auto">
            {IDK_SECTION.map((section, index) => (
              <div key={index} className="flex min-w-20 flex-col items-center gap-2">
                <h1 className="text-center text-xl font-bold md:text-2xl">
                  <NumberTicker
                    className="text-white"
                    value={section.header}
                    delay={index * 0.2}
                    // startValue={50}
                  />
                    {section.description !== "Councils" && <span className={cn()}>+</span>}
                </h1>
                <h3 className="text-center text-sm md:text-base">{section.description}</h3>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3, type: "tween" }}
            className="flex h-fit items-center justify-center gap-3 md:justify-start"
          >
            <Image src={`/MUN-UGM.png`} alt="Logo" width={100} height={100} className="size-8" />
            <h4 className="text-center text-xs font-semibold text-pretty md:text-start md:text-base">
              Model United Nations Universitas Gadjah Mada
            </h4>
          </motion.div>
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
      <motion.div 
      initial={{ opacity: 0}}
      animate={{ opacity: 100 }}
      transition={{ duration: 1}}
      className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/30 to-black/10" />
    </main>
  );
};

export default Hero;
