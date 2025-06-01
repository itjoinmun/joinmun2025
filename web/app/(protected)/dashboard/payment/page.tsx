import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";

import ParticipantData from "@/modules/dashboard/payment/payment-participant-data";
import { Suspense } from "react";

const PaymentPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>

      <Suspense fallback={<div>Loading participant data...</div>}>
        <ParticipantData />
      </Suspense>

      <Suspense fallback={<div>Loading participant data...</div>}>
        <h1>dsajdslkaj</h1>
      </Suspense>
    </DashboardPage>
  );
};

export default PaymentPage;
