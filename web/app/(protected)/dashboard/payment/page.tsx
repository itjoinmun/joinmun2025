"use client";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import Payment from "@/modules/dashboard/payment/payment";
import { FormStatusProvider } from "@/utils/hooks/use-form-status";
import { createContext, Suspense } from "react";

// Types
interface PackageSelection {
  type: "Early Bird" | "Regular" | "Late";
  participantType: "single_delegate" | "team_delegation" | "observer" | "advisor";
  accommodationType: "with_accommodation" | "non_accommodation";
  price?: number;
}

// Context untuk sharing data antar steps
const PaymentContext = createContext<{
  packageSelection: PackageSelection | null;
  setPackageSelection: (selection: PackageSelection) => void;
}>({
  packageSelection: null,
  setPackageSelection: () => {},
});

const PackageSelectionPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>

      {/* <Suspense fallback={<div>Loading participant data...</div>}>
        <ParticipantData />
      </Suspense> */}

      <Suspense fallback={<div>Loading Payment Details...</div>}>
        <FormStatusProvider>
          <Payment />
        </FormStatusProvider>
      </Suspense>
    </DashboardPage>
  );
};

export default PackageSelectionPage;
