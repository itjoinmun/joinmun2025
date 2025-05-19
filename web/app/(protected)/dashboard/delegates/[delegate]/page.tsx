import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle
} from "@/components/dashboard/dashboard-module";
import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader
} from "@/components/dashboard/dashboard-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { redirect } from "next/navigation";

// This page is ONLY for the delegation team, which is a special case of delegates which has a different registration process.

const DelegationTeamPage = async ({ params }: { params: Promise<{ delegate: string }> }) => {
  const { delegate } = await params;
  if (delegate !== "team") redirect(`/dashboard/delegates/${delegate}/registration`);

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        {/* Title using breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/delegates">Delegates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Delegation Team</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Big Title */}
        <h1 className="text-gradient-gold mt-4 text-3xl font-bold">Delegation Team</h1>
        <DashboardPageDescription className="mt-2 text-sm">
          lorem ipsum dolor sit andre
        </DashboardPageDescription>
      </DashboardPageHeader>

      {/* Page content */}

      <DashboardModule>
        <DashboardModuleHeader>
          <DashboardModuleTitle>Team Registration</DashboardModuleTitle>
        </DashboardModuleHeader>
        <DashboardModuleContent>
          {/* TO DO: Table */}
          TO DO: Table
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DelegationTeamPage;
