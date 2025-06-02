import { createContext } from "react";

export interface PackageSelection {
  type: "Early Bird" | "Regular" | "Late";
  participantType: "single_delegate" | "team_delegation" | "observer" | "advisor";
  accommodationType: "with_accommodation" | "non_accommodation";
  price?: number;
}

export const PaymentContext = createContext<{
  packageSelection: PackageSelection | null;
  setPackageSelection: (selection: PackageSelection) => void;
}>({
  packageSelection: null,
  setPackageSelection: () => {},
});
