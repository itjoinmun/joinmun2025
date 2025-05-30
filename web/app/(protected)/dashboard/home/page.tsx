import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import DashboardEvents from "@/modules/dashboard/home/dashboard-events";
import InformationCenter from "@/modules/dashboard/home/dashboard-status";
import ParticipantData from "@/modules/dashboard/home/participant-data";
import ParticipantStatus from "@/modules/dashboard/home/participant-status";
import Playground from "@/modules/dashboard/playground";
import { Suspense } from "react";

const DashboardHome = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Home</DashboardPageTitle>
      </DashboardPageHeader>

      <Suspense fallback={<div>Loading participant status...</div>}>
        <ParticipantStatus />
      </Suspense>

      <Suspense>
        <InformationCenter />
      </Suspense>

      <Suspense>
        <ParticipantData />
      </Suspense>

      <DashboardEvents />
      <Playground />
    </DashboardPage>
  );
};

export default DashboardHome;
