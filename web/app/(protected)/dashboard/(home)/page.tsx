import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import DashboardEvents from "@/modules/dashboard/home/dashboard-events";
import InformationCenter from "@/modules/dashboard/home/dashboard-status";
import ParticipantData from "@/modules/dashboard/home/participant-data";
import ParticipantStatus from "@/modules/dashboard/home/participant-status";

const DashboardHome = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Home</DashboardPageTitle>
      </DashboardPageHeader>

      {/* call in modules here */}
      <ParticipantStatus />
      <InformationCenter />
      <ParticipantData />
      <DashboardEvents />
    </DashboardPage>
  );
};

export default DashboardHome;
