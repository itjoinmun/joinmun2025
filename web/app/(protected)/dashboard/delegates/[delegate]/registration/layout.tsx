import { DashboardModule, DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import { DashboardPage, DashboardPageHeader } from "@/components/dashboard/dashboard-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DelegateOptions, DELEGATES } from "@/utils/helpers/delegates";

const DelegateRegistrationLayout = async ({
  params,
  children,
}: {
  params: Promise<{ delegate: string }>;
  children: React.ReactNode;
}) => {
  const { delegate } = await params;
  const delegateData = DELEGATES[delegate as DelegateOptions];

  return (
    <DashboardPage className="flex flex-col gap-6">
      {/* Header (title or breadcrumbs) */}
      <DashboardPageHeader className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* If team redirect to the team page, else go back to delegate dashboard */}
              <BreadcrumbLink
                href={delegate === "team" ? "/dashboard/delegates/team " : "/dashboard/delegates"}
              >
                {delegateData.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Registration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashboardPageHeader>

      {/* Form */}
      <DashboardModule>
        <DashboardModuleContent>{children}</DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DelegateRegistrationLayout;
