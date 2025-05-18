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
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) => {
  const { slug } = await params;
  const delegate = DELEGATES[slug as DelegateOptions];

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/delegates">{delegate.name}</BreadcrumbLink>
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
        <DashboardModuleContent>
          {children}
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DelegateRegistrationLayout;
