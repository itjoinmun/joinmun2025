import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { getDelegate } from "@/utils/helpers/fetch/delegates/delegates";

const YourRole = async () => {
  let res;
  try {
    res = await getDelegate();
  } catch (error) {
    console.error("Error fetching delegate:", error);
  }

  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Your Role</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent>
        {res ? (
          <p>TO DO: Ini user udah register, tapi {JSON.stringify(res)}</p>
        ) : (
          <p>
            You haven&apos;t chosen a role.{" "}
            <span className="font-bold">Choose below now!</span>{" "}
          </p>
        )}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default YourRole;
