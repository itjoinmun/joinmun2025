import BatikPattern from "@/components/Element/batik-pattern";
import {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/utils/actions/session";
import { getDelegate } from "@/utils/helpers/fetch/delegates/delegates";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const ParticipantStatus = () => {
  return (
    <DashboardModule className="flex flex-col gap-6">
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Status</DashboardModuleTitle>
      </DashboardModuleHeader>

      <Suspense
        fallback={<Skeleton className="from-red-dark-hover/60 to-red-dark h-64 bg-gradient-to-b" />}
      >
        <Body />
      </Suspense>
    </DashboardModule>
  );
};

const Body = async () => {
  let hasRegistered = false;
  const delegate = await getDelegate();
  const user = (await getSession())?.name;

  if (delegate) {
    hasRegistered = true;
  }

  return (
    <section className="from-red-dark-hover/60 to-red-dark relative z-0 w-full rounded-md bg-gradient-to-b p-3 text-pretty md:p-6">
      <div className="flex h-full flex-col gap-5 md:min-h-50 md:flex-row">
        {hasRegistered ? (
          <>
            <div className="flex w-full flex-col gap-3 md:max-w-1/2">
              <h1 className="text-2xl leading-normal">
                Welcome Back! <br /> <Bold>{user}</Bold>
              </h1>
              <p className="text-sm leading-normal">
                <Bold>
                  {delegate?.council
                    ? "JOINMUN 2025 Registrant"
                    : "Your council assignment is currently pending admin approval. Please wait for further updates."}
                </Bold>
              </p>
            </div>
            <footer className="xs:flex-row xs:mt-auto mt-30 flex w-full flex-col justify-end gap-3 justify-self-end">
              <Link href={`/dashboard/delegates`}>
                <Button
                  variant={`warningOutline`}
                  className="xs:mt-40 w-fit cursor-pointer md:mt-0"
                >
                  See Council
                </Button>
              </Link>
              <Link href={`/dashboard/timeline`}>
                <Button variant={`warning`} className="xs:mt-40 w-fit cursor-pointer md:mt-0">
                  See Event Schedule
                </Button>
              </Link>
            </footer>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 w-full md:max-w-1/2">
              <h1 className="text-2xl leading-normal">
                You Haven&apos;t Been Identified as a Participant. <Bold>Register Now</Bold>!
              </h1>
              <p className="text-sm leading-normal">
                Register as <Bold>Single Delegate</Bold>, <Bold>Double Delegates</Bold>,{" "}
                <Bold>Delegates Team</Bold>, <Bold>Observer or Faculty Advisor</Bold>
              </p>
            </div>
            <Link
              href={`/dashboard/delegates`}
              className="mt-40 inline-flex w-fit md:mt-auto md:ml-auto"
            >
              <Button variant={`warning`} className="cursor-pointer">
                Register Now
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* First absolute child with overflow hidden */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <BatikPattern className="opacity-30" />
      </div>

      {/* Second absolute child with overflow visible */}
      <div className="absolute inset-0 -z-20 overflow-hidden md:overflow-visible">
        <Image
          src={`/assets/dashboard/home/${hasRegistered ? "model-2.webp" : "model-1.webp"}`}
          alt="Dashboard Image"
          width={250}
          height={250}
          className="absolute right-0 -bottom-16 md:bottom-0"
        />
      </div>
    </section>
  );
};

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold">{children}</span>
);

export default ParticipantStatus;
