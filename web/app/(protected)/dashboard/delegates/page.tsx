import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import DelegatesCompanion from "@/modules/dashboard/delegates/delegates-companion";
import DelegatesParticipant from "@/modules/dashboard/delegates/delegates-participant";
import YourRole from "@/modules/dashboard/delegates/your-role";

const DelegatesPage = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Delegates Lumayan </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DashboardPageDescription className="text-base">
          Welcome to delegates, choose role to see more information
        </DashboardPageDescription>
      </DashboardPageHeader>

      <YourRole />
      <DelegatesParticipant />
      <DelegatesCompanion />
    </DashboardPage>
  );
};

export default DelegatesPage;
