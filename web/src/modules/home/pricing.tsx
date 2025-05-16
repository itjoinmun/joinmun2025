"use client";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { PriceOptions, PRICES } from "@/utils/helpers/pricing";
import { isPriceReveal } from "@/utils/helpers/reveal";
import { useState } from "react";
import * as motion from "motion/react-client";

const Pricing = () => {
  const [active, setActive] = useState<PriceOptions>("single");

  return (
    <>
      <div
        id="pricing"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      {isPriceReveal ? (
        // If price reveal is true, show the pricing page
        <main className="relative z-0 overflow-hidden pb-12">
          <Container className="gap-2">
            <section className="flex flex-col items-center gap-2">
              <Heading>Pricing</Heading>

              <div className="text-center text-sm text-white md:max-w-2xl">
                Find the Right Fit — We&apos;ve Got Options For You.
              </div>

              <nav className="no-scrollbar mt-10 flex w-full max-w-full snap-x snap-mandatory gap-5 overflow-auto md:justify-center lg:gap-10">
                {Object.entries(PRICES).map(([key, value]) => (
                  <Button
                    key={key}
                    onClick={() => setActive(key as PriceOptions)}
                    variant={active === key ? "primary" : "outline"}
                    className="shrink-0 snap-start transition-all"
                  >
                    {value.name}
                  </Button>
                ))}
              </nav>

              <div className="mt-8 flex w-full flex-col items-start gap-2">
                <h1 className="text-xl leading-snug font-bold md:text-2xl">
                  {PRICES[active].name}
                </h1>
                <p className="leading-snug">{PRICES[active].description}</p>

                <div className="mt-10 grid min-h-80 w-full auto-cols-min grid-cols-1 gap-10 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:px-10">
                  {PRICES[active].package.map((option, index) => (
                    <PricingCard key={index} {...option} />
                  ))}
                </div>
              </div>
            </section>
          </Container>
        </main>
      ) : (
        // If price reveal is false, show the coming soon page
        <motion.div
          className="bg-background relative min-h-[85dvh] w-full overflow-hidden md:min-h-[70vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background solid color */}
          <div className="bg-background absolute inset-0" />

          {/* Background image */}
          <motion.div
            className="absolute inset-0 h-full w-full"
            initial={{ scale: 1.1, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 2 }}
            style={{
              backgroundImage: `url('/assets/theme/coming-soon-theme.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.8,
            }}
          />

          {/* Top gradient overlay */}
          <div className="from-background via-background absolute top-0 right-0 left-0 z-10 h-[22rem] bg-gradient-to-b via-40% to-transparent lg:h-84" />

          {/* Bottom gradient overlay */}
          <div className="from-background via-background absolute right-0 bottom-0 left-0 z-10 h-20 bg-gradient-to-t via-30% to-transparent md:h-32" />

          {/* Centered text */}

          {/* <Heading className="scale-75">Grand Theme is Coming.</Heading> */}
          <div className="absolute inset-x-0 z-20 flex flex-col items-center justify-center">
            <Container className="h-full min-h-[85dvh] gap-2 *:text-center md:min-h-[70vh]">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 1.2,
                  type: "spring",
                  stiffness: 80,
                }}
                className="my-auto flex h-full flex-col items-center justify-center"
              >
                <SubHeading>Stay tuned.</SubHeading>
                <Heading className="text-gradient-gold mt-auto">
                  Pricing details will be revealed soon
                </Heading>
              </motion.div>
            </Container>
          </div>
        </motion.div>
      )}
    </>
  );
};

const PricingCard = (option: any) => {
  // Team package detection
  const isTeam = option.delegateRange && option.nonAccommodation && option.accommodation;

  if (isTeam) {
    return (
      <article className="bg-gray border-gray-light mx-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center md:max-w-none">
        <h2 className="text-lg font-bold">{option.name}</h2>
        <div className="mb-2 text-sm">{option.delegateRange}</div>
        <hr className="border-gray-light my-2 w-full" />
        <div className="flex w-full flex-col gap-4">
          <div>
            <div className="font-bold">{option.nonAccommodation.label}</div>
            <div className="relative text-4xl font-bold">
              <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">$</span>
              {option.nonAccommodation.price}
            </div>
          </div>
          <div>
            <div className="font-bold">{option.accommodation.label}</div>
            <div className="text-xs">{option.accommodation.description}</div>
            <div className="relative text-4xl font-bold">
              <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">$</span>
              {option.accommodation.price}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full text-left">
          <div className="mb-1 font-bold">Included Facilities</div>
          <ul className="list-inside list-disc space-y-1.5 text-sm font-light">
            {option.points.map((point: string, idx: number) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </article>
    );
  }

  // Default card for single, observer, advisor
  return (
    <article className="bg-gray border-gray-light mx-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center md:max-w-none">
      <h2 className="text-lg font-bold">{option.name}</h2>
      <h1 className="relative text-4xl font-bold">
        <span className="absolute -top-1 -left-4 text-xl">$</span>
        {option.price}
      </h1>
      <ul className="mt-4 mb-auto w-full list-inside list-disc space-y-1.5 text-start text-sm font-light">
        {option.points.map((point: string, index: number) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </article>
  );
};

export default Pricing;
