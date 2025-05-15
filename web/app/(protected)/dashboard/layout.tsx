"use client";
import DashboardContainer from "@/components/dashboard/dashboard-container";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ComingSoon from "@/modules/coming-soon";
import DashboardNav from "@/modules/dashboard/dashboard-nav";
import UserProfileInfo from "@/modules/dashboard/user-profile-info";
import { isRegistrationOpen } from "@/utils/helpers/reveal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {isRegistrationOpen ? (
        <SidebarProvider>
          <main className="relative flex h-screen w-full flex-col gap-6 md:flex-row md:gap-0 md:overflow-clip">
            <DashboardNav />
            <section className="max-h-screen w-full md:overflow-y-auto">
              <DashboardContainer className="gap-6 pt-0 md:px-6 md:pt-6">
                <header className="hidden w-full items-center justify-between gap-8 md:flex">
                  <div className="group flex items-baseline gap-4">
                    <SidebarToggle />
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                  </div>
                  <UserProfileInfo />
                </header>
                {children}
              </DashboardContainer>
            </section>
          </main>
        </SidebarProvider>
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

const SidebarToggle = ({ className }: { className?: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarTrigger className={className} />
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Sidebar</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default DashboardLayout;
