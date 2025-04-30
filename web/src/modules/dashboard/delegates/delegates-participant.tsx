import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";

const DelegatesParticipant = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant</DashboardModuleTitle>
      </DashboardModuleHeader>
      <DashboardModuleContent>
        <p>This is the content for the participant section.</p>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesParticipant;
