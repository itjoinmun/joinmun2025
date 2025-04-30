import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";

const DelegatesCompanion = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Companion</DashboardModuleTitle>
      </DashboardModuleHeader>
      <DashboardModuleContent>
        <p>This is the content for the companion section.</p>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesCompanion;
