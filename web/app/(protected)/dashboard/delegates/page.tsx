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
import { Skeleton } from "@/components/ui/skeleton";
import DelegatesCompanion from "@/modules/dashboard/delegates/delegates-companion";
import DelegatesParticipant from "@/modules/dashboard/delegates/delegates-participant";
import YourRole from "@/modules/dashboard/delegates/your-role";
import { Suspense } from "react";

const DelegatesPage = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Registration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DashboardPageDescription className="text-base">
          Welcome to Registration, choose role to see more information
        </DashboardPageDescription>
      </DashboardPageHeader>
      <Suspense fallback={<Skeleton className="h-24" />}>
        <YourRole />
      </Suspense>
      <Suspense fallback={<></>}>
        <DelegatesParticipant />
      </Suspense>
      <Suspense fallback={<></>}>
        <DelegatesCompanion />
      </Suspense>
    </DashboardPage>
  );
};

export default DelegatesPage;
