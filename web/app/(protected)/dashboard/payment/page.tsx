<<<<<<< HEAD
"use client";
=======
>>>>>>> bc7cdb1c6ae905b922cb3f2d1b0729f86ebf611a
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
<<<<<<< HEAD
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
    <PaymentContext value={{ packageSelection: null, setPackageSelection: () => {} }}>
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
    </PaymentContext>
  );
};

export default PackageSelectionPage;
=======

const PaymentPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>
    </DashboardPage>
  );
};

export default PaymentPage;
>>>>>>> bc7cdb1c6ae905b922cb3f2d1b0729f86ebf611a
