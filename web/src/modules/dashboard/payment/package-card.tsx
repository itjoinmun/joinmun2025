"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/helpers/cn";
import { pricePackage as basePricing } from "@/utils/helpers/price-package";
import { getCurrentPaymentPhase } from "@/utils/helpers/registration-wave";

type PackageType = "EarlyBird" | "Regular" | "Late";
type ParticipantType = "single_delegate" | "team_delegate" | "observer" | "advisor";
type AccommodationType = "accommodation" | "nonAccommodation";

interface PackageOption {
  delegateRange?: string;
  nonAccommodation: {
    label: string;
    price: {
      idr: string;
      usd: string;
    };
    description: string;
  };
  accommodation: {
    label: string;
    price: {
      idr: string;
      usd: string;
    };
    description: string;
  };
  points: string[];
}

interface PackageCardProps {
  participantType: ParticipantType;
  onSelect: (type: AccommodationType, price: { idr: string; usd: string }) => void;
  selectedType?: AccommodationType;
  teamPackage?: "packageA" | "packageB" | "packageC" | "packageD";
}

const PaymentPackageCard = ({
  participantType,
  onSelect,
  selectedType,
  teamPackage,
}: PackageCardProps) => {
  // Get current wave and map it to package type
  const currentWave = getCurrentPaymentPhase();
  const type: PackageType =
    currentWave === "Early Bird"
      ? "EarlyBird"
      : currentWave === "Regular"
        ? "Regular"
        : currentWave === "Late"
          ? "Late"
          : "EarlyBird";
  const isTeam = participantType === "team_delegate";
  const option: PackageOption = isTeam
    ? {
        ...basePricing[participantType][type][teamPackage || "packageA"],
        nonAccommodation: {
          ...basePricing[participantType][type][teamPackage || "packageA"].nonAccommodation,
          price: {
            idr: `Rp${basePricing[participantType][type][teamPackage || "packageA"].nonAccommodation.price.idr}`,
            usd: `$${basePricing[participantType][type][teamPackage || "packageA"].nonAccommodation.price.usd}`,
          },
        },
        accommodation: {
          ...basePricing[participantType][type][teamPackage || "packageA"].accommodation,
          price: {
            idr: `Rp${basePricing[participantType][type][teamPackage || "packageA"].accommodation.price.idr}`,
            usd: `$${basePricing[participantType][type][teamPackage || "packageA"].accommodation.price.usd}`,
          },
        },
      }
    : {
        ...basePricing[participantType][type],
        nonAccommodation: {
          ...basePricing[participantType][type].nonAccommodation,
          price: {
            idr: `Rp${basePricing[participantType][type].nonAccommodation.price.idr}`,
            usd: `$${basePricing[participantType][type].nonAccommodation.price.usd}`,
          },
        },
        accommodation: {
          ...basePricing[participantType][type].accommodation,
          price: {
            idr: `Rp${basePricing[participantType][type].accommodation.price.idr}`,
            usd: `$${basePricing[participantType][type].accommodation.price.usd}`,
          },
        },
      };

  return (
    <article className="bg-background border-gray-light mr-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center">
      <h2 className="text-lg font-bold">
        {participantType === "single_delegate"
          ? "Single Delegate"
          : participantType === "team_delegate"
            ? "Team Delegation"
            : participantType === "observer"
              ? "Observer"
              : "Advisor"}{" "}
        - {currentWave}
      </h2>
      {isTeam && option.delegateRange && <div className="mb-2 text-sm">{option.delegateRange}</div>}
      <hr className="border-gray-light my-2 w-full" />
      <div className="grid w-full grid-cols-1 gap-4">
        <div>
          <div className="font-bold">{option.nonAccommodation.label}</div>
          {/* <div className="text-xs">{option.nonAccommodation.description}</div> */}
          <div className="relative text-2xl font-bold">
            {/* <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">Rp</span> */}
            {option.nonAccommodation.price.idr} {" / "} {option.nonAccommodation.price.usd}
          </div>
        </div>
        <div>
          <div className="font-bold">{option.accommodation.label}</div>
          <div className="relative text-2xl font-bold">
            {/* <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">Rp</span> */}
            {option.accommodation.price.idr} {" / "} {option.accommodation.price.usd}
          </div>
          <p className="text-[50%]">{option.accommodation.description}</p>
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
      <div className="mt-4 flex w-full flex-col gap-2">
        <Button
          variant={selectedType === "accommodation" ? "default" : "warning"}
          onClick={() => onSelect("accommodation", option.accommodation.price)}
          className={cn(selectedType === "accommodation" && "border border-white", "w-full")}
        >
          {selectedType === "accommodation" ? "Selected" : "With Accommodation"}
        </Button>
        <Button
          variant={selectedType === "nonAccommodation" ? "default" : "warning"}
          onClick={() => onSelect("nonAccommodation", option.nonAccommodation.price)}
          className={cn(selectedType === "nonAccommodation" && "border border-white", "w-full")}
        >
          {selectedType === "nonAccommodation" ? "Selected" : "Without Accommodation"}
        </Button>
      </div>
    </article>
  );
};

export default PaymentPackageCard;
