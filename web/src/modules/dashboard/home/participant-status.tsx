import {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ParticipantStatus = () => {
  const hasRegistered = true;

  return (
    <DashboardModule className="flex flex-col gap-6">
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Status</DashboardModuleTitle>
      </DashboardModuleHeader>

      <section className="from-red-dark-hover/60 to-red-dark relative z-0 w-full rounded-md bg-gradient-to-b p-3 text-pretty md:p-6">
        <div className="flex flex-col gap-5 md:min-h-50">
          {hasRegistered ? (
            <>
              <div className="flex flex-col gap-3 md:max-w-1/2">
                <h1 className="text-2xl leading-normal">
                  Welcome Back! <br /> <Bold>Nama Orang</Bold>!
                </h1>
                <p className="text-sm leading-normal">
                  <Bold>Delegate apa user ini, council apa</Bold>
                </p>
              </div>
              <footer className="mt-auto flex w-full justify-end gap-3 justify-self-end">
                <Button variant={`warningOutline`} className="mt-40 w-fit md:mt-0">
                  Delegate Status
                </Button>
                <Button variant={`warning`} className="mt-40 w-fit md:mt-0">
                  See Council
                </Button>
              </footer>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 md:max-w-1/2">
                <h1 className="text-2xl leading-normal">
                  You Haven&apos;t Been Identified as a Participant. <Bold>Register Now</Bold>!
                </h1>
                <p className="text-sm leading-normal">
                  Register as <Bold>Single Delegates</Bold>, <Bold>Double Delegates</Bold>,{" "}
                  <Bold>Delegates Team</Bold>, <Bold>Observer or Faculty Advisor</Bold>
                </p>
              </div>
              <Button variant={`warning`} className="mt-40 w-fit md:mt-0 md:ml-auto">
                Register Now
              </Button>
            </>
          )}
        </div>

        {/* First absolute child with overflow hidden */}
        {/* <div className="absolute inset-0 -z-10 overflow-hidden">
          <BatikPattern square className="left-0 inset-y-0 h-full rotate-90" />
        </div> */}

        {/* Second absolute child with overflow visible */}
        <div className="absolute inset-0 -z-20 overflow-visible">
          <Image
            src={`/assets/dashboard/home/dashboard-girl.webp`}
            alt="Dashboard Image"
            width={500}
            height={500}
            className="absolute right-0 bottom-0 size-60 md:size-80"
          />
        </div>
      </section>
    </DashboardModule>
  );
};

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold">{children}</span>
);

export default ParticipantStatus;
