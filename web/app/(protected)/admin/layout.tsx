"use client";
import DashboardContainer from "@/components/dashboard/dashboard-container";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ComingSoon from "@/modules/coming-soon";
import DashboardNav from "@/modules/dashboard/dashboard-nav";
import UserProfileInfo from "@/modules/dashboard/user-profile-info";
import { isRegistrationOpen } from "@/utils/helpers/reveal";
import { useState } from "react";
import { Heading } from "@/components/Layout/section-heading";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {isRegistrationOpen ? (
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <main className="relative flex h-screen w-full flex-col gap-6 md:flex-row md:gap-0 md:overflow-clip">
            {/*<DashboardNav />*/}
            <section className="max-h-screen w-full md:overflow-y-auto">
              <DashboardContainer className="gap-6 pt-6 md:px-6">{children}</DashboardContainer>
            </section>
          </main>
        </SidebarProvider>
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

export default DashboardLayout;
