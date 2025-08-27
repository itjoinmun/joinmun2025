"use client";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { DelegateOptions, DELEGATES } from "@/utils/helpers/delegates";
import { pricePackage } from "@/utils/helpers/price-package";
import { isPriceReveal } from "@/utils/helpers/reveal";
import { useState } from "react";
import * as motion from "motion/react-client";
import { getCurrentPhase } from "@/utils/helpers/payment-wave";

// Type definitions for package structures
interface PackageOption {
  label: string;
  price: {
    usd: string;
    idr: string;
  };
  description: string;
}

interface BasePackage {
  nonAccommodation: PackageOption;
  accommodation: PackageOption;
  points: string[];
}

interface TeamPackage extends BasePackage {
  delegateRange: string;
}

interface TeamDelegationPackages {
  packageA: TeamPackage;
  packageB: TeamPackage;
  packageC: TeamPackage;
  packageD: TeamPackage;
}

// interface WavePackages {
//   EarlyBird: BasePackage | TeamDelegationPackages;
//   Regular: BasePackage | TeamDelegationPackages;
//   Late: BasePackage | TeamDelegationPackages;
// }

const Pricing = () => {
  const [active, setActive] = useState<DelegateOptions>("single");

  // Get current wave and map it to package type
  const currentWave = getCurrentPhase();
  // const currentWave = "Closed";
  const type = (() => {
    switch (currentWave) {
      case "Early Bird":
        return "EarlyBird";
      case "Regular":
        return "Regular";
      case "Late":
        return "Late";
      default:
        return "Closed";
    }
  })();

  // Map delegate type to price package type
  const getParticipantType = (delegateType: DelegateOptions) => {
    switch (delegateType) {
      case "single":
        return "single_delegate";
      case "team":
        return "team_delegate";
      case "observer":
        return "observer";
      case "advisor":
        return "advisor";
      default:
        return "single_delegate";
    }
  };

  return (
    <>
      <div
        id="pricing"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      {!isPriceReveal || (type !== "EarlyBird" && type !== "Regular" && type !== "Late") ? (
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
      ) : (
        // If price reveal is true, show the pricing page
        <main className="relative z-0 overflow-hidden pb-12">
          <Container className="gap-2">
            <section className="flex flex-col items-center gap-2">
              <Heading>Pricing</Heading>

              <div className="text-center text-sm text-white md:max-w-2xl">
                Find the Right Fit — We&apos;ve Got Options For You.
              </div>

              <nav className="no-scrollbar mt-10 flex w-full max-w-full snap-x snap-mandatory gap-5 overflow-auto md:justify-center lg:gap-10">
                {Object.entries(DELEGATES).map(([key, value]) => (
                  <Button
                    key={key}
                    onClick={() => setActive(key as DelegateOptions)}
                    variant={active === key ? "primary" : "outline"}
                    className="shrink-0 snap-start transition-all"
                  >
                    {value.name}
                  </Button>
                ))}
              </nav>

              <div className="mt-8 flex w-full flex-col items-start gap-2">
                <h1 className="text-xl leading-snug font-bold md:text-2xl">
                  {DELEGATES[active].name}
                </h1>
                <p className="leading-snug">{DELEGATES[active].description}</p>

                <div className="mt-10 grid min-h-80 w-full auto-cols-min grid-cols-1 gap-10 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3 lg:gap-6 lg:px-10">
                  {active === "team" ? (
                    // For team, show all packages
                    Object.entries(pricePackage.team_delegate[type] as TeamDelegationPackages).map(
                      ([packageKey, packageData]) => (
                        <PricingCard
                          key={packageKey}
                          name={`Package ${packageKey.slice(-1)}`}
                          delegateRange={packageData.delegateRange}
                          nonAccommodation={packageData.nonAccommodation}
                          accommodation={packageData.accommodation}
                          points={packageData.points}
                        />
                      ),
                    )
                  ) : (
                    // For others, show both accommodation and non-accommodation cards
                    <>
                      <PricingCard
                        name="Non-Accommodation"
                        nonAccommodation={
                          (pricePackage[getParticipantType(active)][type] as BasePackage)
                            .nonAccommodation
                        }
                        accommodation={
                          (pricePackage[getParticipantType(active)][type] as BasePackage)
                            .nonAccommodation
                        }
                        points={
                          (pricePackage[getParticipantType(active)][type] as BasePackage).points
                        }
                      />
                      <PricingCard
                        name="With Accommodation"
                        nonAccommodation={
                          (pricePackage[getParticipantType(active)][type] as BasePackage)
                            .accommodation
                        }
                        accommodation={
                          (pricePackage[getParticipantType(active)][type] as BasePackage)
                            .accommodation
                        }
                        points={
                          (pricePackage[getParticipantType(active)][type] as BasePackage).points
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </section>
          </Container>
        </main>
      )}
    </>
  );
};

interface PricingCardProps {
  name: string;
  delegateRange?: string;
  nonAccommodation: PackageOption;
  accommodation: PackageOption;
  points: string[];
}

const PricingCard = ({
  name,
  delegateRange,
  nonAccommodation,
  accommodation,
  points,
}: PricingCardProps) => {
  // Team package detection
  const isTeam = delegateRange !== undefined;

  if (isTeam) {
    return (
      <article className="bg-gray border-gray-light mx-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center lg:max-w-none">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="mb-2 text-sm">{delegateRange}</div>
        <hr className="border-gray-light my-2 w-full" />
        <div className="flex w-full flex-col gap-4">
          <div>
            <div className="text-lg font-bold">{nonAccommodation.label}</div>
            <div className="relative text-4xl font-bold">
              <p>${nonAccommodation.price.usd}</p>
              <p className="text-sm">or</p>
              <p>Rp{nonAccommodation.price.idr}</p>
            </div>
          </div>
          <div>
            <div className="font-bold">{accommodation.label}</div>

            <div className="relative text-4xl font-bold">
              <p>${accommodation.price.usd}</p>
              <p className="text-sm">or</p>
              <p>Rp{accommodation.price.idr}</p>
            </div>
            <div className="mt-2 text-xs">
              {accommodation.description.split(",").map((part, index) => (
                <p key={index} className="mb-1">
                  {part.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full text-left">
          <div className="mb-1 font-bold">Included Facilities</div>
          <ul className="list-inside list-disc space-y-1.5 text-sm font-light">
            {points.map((point: string, idx: number) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </article>
    );
  }

  // Default card for single, observer, advisor
  return (
    <article className="bg-gray border-gray-light mx-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center lg:max-w-none">
      <h2 className="text-lg font-bold">{name}</h2>
      <div className="relative text-4xl font-bold">
        <p>${nonAccommodation.price.usd}</p>
        <p className="text-sm">or</p>
        <p>Rp{nonAccommodation.price.idr}</p>
      </div>
      <div className="mt-2 text-xs">
        {nonAccommodation.description.split(",").map((part, index) => (
          <p key={index} className="mb-1">
            {part.trim()}
          </p>
        ))}
      </div>
      <ul className="mt-2 mb-auto w-full list-inside list-disc space-y-1.5 text-start text-sm font-light">
        {points.map((point: string, index: number) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </article>
  );
};

export default Pricing;
