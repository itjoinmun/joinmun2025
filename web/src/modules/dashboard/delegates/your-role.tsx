import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";

const YourRole = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Your Role</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent>
        <p>
          You haven&apos;t chosen a role. <span className="font-bold">Choose below now!</span>{" "}
        </p>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default YourRole;
