"use client";

import { Button } from "@/components/ui/button";
import { pricePackage as basePricing } from "@/utils/helpers/price-package";

type PackageType = "Early Bird" | "Regular" | "Late";
type ParticipantType = "single_delegate" | "team_delegation" | "observer" | "advisor";
type AccommodationType = "accommodation" | "nonAccommodation";

interface PackageCardProps {
  type: PackageType;
  participantType: ParticipantType;
  onSelect: (type: AccommodationType, price: string) => void;
  selectedType?: AccommodationType;
}

const PaymentPackageCard = ({
  type,
  participantType,
  onSelect,
  selectedType,
}: PackageCardProps) => {
  const option = basePricing[participantType][type];
  const isTeam = participantType === "team_delegation";

  return (
    <article className="bg-background border-gray-light mx-auto flex w-full max-w-xs flex-col items-center gap-2 rounded-sm border p-8 text-center">
      <h2 className="text-lg font-bold">
        {participantType === "single_delegate"
          ? "Single Delegate"
          : participantType === "team_delegation"
            ? "Team Delegation"
            : participantType === "observer"
              ? "Observer"
              : "Advisor"}{" "}
        - {type}
      </h2>
      {isTeam && "delegateRange" in option && (
        <div className="mb-2 text-sm">{option.delegateRange}</div>
      )}
      <hr className="border-gray-light my-2 w-full" />
      <div className="grid w-full grid-cols-1 gap-4">
        <div>
          <div className="font-bold">{option.nonAccommodation.label}</div>
          <div className="text-xs">{option.nonAccommodation.description}</div>
          <div className="relative text-4xl font-bold">
            {/* <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">Rp</span> */}
            {option.nonAccommodation.price}
          </div>
        </div>
        <div>
          <div className="font-bold">{option.accommodation.label}</div>
          <div className="text-xs">{option.accommodation.description}</div>
          <div className="relative text-4xl font-bold">
            {/* <span className="absolute -top-1 right-0 left-0 -translate-x-8 text-xl">Rp</span> */}
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
      <div className="mt-4 flex w-full flex-col gap-2">
        <Button
          variant={selectedType === "accommodation" ? "default" : "warning"}
          onClick={() => onSelect("accommodation", option.accommodation.price)}
          className="w-full"
        >
          With Accommodation
        </Button>
        <Button
          variant={selectedType === "nonAccommodation" ? "default" : "warning"}
          onClick={() => onSelect("nonAccommodation", option.nonAccommodation.price)}
          className="w-full"
        >
          Without Accommodation
        </Button>
      </div>
    </article>
  );
};

export default PaymentPackageCard;
