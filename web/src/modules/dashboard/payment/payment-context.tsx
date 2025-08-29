import { createContext } from "react";

export interface PackageSelection {
  type: "EarlyBird" | "Regular" | "Late";
  participantType: "single_delegate" | "team_delegate" | "observer" | "advisor";
  accommodationType: "with_accommodation" | "non_accommodation";
  price: {
    usd: number;
    idr: number;
  };
  teamPackage?: "packageA" | "packageB" | "packageC" | "packageD";
}

export const PaymentContext = createContext<{
  packageSelection: PackageSelection | null;
  setPackageSelection: (selection: PackageSelection) => void;
}>({
  packageSelection: null,
  setPackageSelection: () => {},
});
