"use client";

import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import { Download, ChevronDown } from "lucide-react";
import { COUNCILS } from "@/utils/helpers/councils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardModule, DashboardModuleContent } from "@/components/dashboard/dashboard-module";

const CouncilsPage = () => {
  return (
    <DashboardPage>
      <DashboardModule>
        <DashboardPageHeader>
          <DashboardPageTitle>Councils Guidebook</DashboardPageTitle>
        </DashboardPageHeader>
        <DashboardModuleContent>
          <Accordion
            type="single"
            collapsible
            className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3"
          >
            {COUNCILS.map((council) => (
              <AccordionItem key={council.slug} value={council.slug} className="border-0">
                <AccordionTrigger className="bg-background flex items-center justify-between px-4 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4">
                    <Avatar className="border-primary/10 h-12 w-12 border-2">
                      <AvatarImage src={`/assets/councils/logo/${council.logo}`} />
                      <AvatarFallback>{council.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="xs:block hidden text-base font-semibold">
                        {council.fullname}
                      </span>
                      <span className="xs:hidden block text-base font-semibold">
                        {council.name}
                      </span>
                    </div>
                  </div>

                  <a
                    className="bg-gray rounded p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const link = document.createElement("a");
                      // link.href = `/assets/guidebooks/${council.slug}.pdf`;
                      link.href = "/MRPL.pdf";
                      link.download = "/MRPL.pdf";
                      // link.download = `${council.name}-Guidebook.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 space-y-4">
                    <div className="bg-muted aspect-[3/4] w-full overflow-hidden rounded-lg border">
                      <iframe
                        // src={`/assets/guidebooks/${council.slug}.pdf`}
                        src="/MRPL.pdf"
                        className="h-full w-full"
                        title={`${council.fullname} Guidebook`}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default CouncilsPage;
