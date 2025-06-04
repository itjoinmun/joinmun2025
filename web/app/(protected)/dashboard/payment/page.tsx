"use client";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import Payment from "@/modules/dashboard/payment/payment";
import { FormStatusProvider } from "@/utils/hooks/use-form-status";
import { Suspense } from "react";

const PackageSelectionPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>

      <Suspense fallback={<div>Loading Payment Details...</div>}>
        <FormStatusProvider>
          <Payment />
        </FormStatusProvider>
      </Suspense>
    </DashboardPage>
  );
};

export default PackageSelectionPage;
