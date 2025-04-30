import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import DashboardEvents from "@/modules/dashboard/home/dashboard-events";
import ParticipantStatus from "@/modules/dashboard/home/participant-status";

const DashboardHome = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Home</DashboardPageTitle>
      </DashboardPageHeader>

      {/* call in modules here */}
      <ParticipantStatus />
      <DashboardEvents />
    </DashboardPage>
  );
};

export default DashboardHome;
