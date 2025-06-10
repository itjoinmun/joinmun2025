import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import { Skeleton } from "@/components/ui/skeleton";
import InformationCenter from "@/modules/dashboard/home/dashboard-status";
import ParticipantData from "@/modules/dashboard/home/participant-data";
import ParticipantStatus from "@/modules/dashboard/home/participant-status";
import { Suspense } from "react";

const DashboardHome = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Home</DashboardPageTitle>
      </DashboardPageHeader>

      <ParticipantStatus />

      <Suspense fallback={<></>}>
        <InformationCenter />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-24" />}>
        <ParticipantData />
      </Suspense>
    </DashboardPage>
  );
};

export default DashboardHome;
