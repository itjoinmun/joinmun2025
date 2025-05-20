import BatikPattern from "@/components/Element/batik-pattern";
import {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cookies } from "next/headers";
import { fetchUserClient } from "@/utils/helpers/fetch/auth/user";
import { getDelegate } from "@/utils/helpers/fetch/delegates/delegates";

const ParticipantStatus = async () => {
  let hasRegistered = false;
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const delegate = await getDelegate(accessToken);
  if (!delegate) {
    hasRegistered = false
  } else {
    hasRegistered = true
  }
  const result = await fetchUserClient(accessToken)
  const user = result.user
  return (
    <DashboardModule className="flex flex-col gap-6">
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Status bro</DashboardModuleTitle>
      </DashboardModuleHeader>

      <section className="from-red-dark-hover/60 to-red-dark relative z-0 w-full rounded-md bg-gradient-to-b p-3 text-pretty md:p-6">
        <div className="flex flex-col gap-5 md:min-h-50">
          {hasRegistered ? (
            <>
              <div className="flex flex-col gap-3 md:max-w-1/2">
                <h1 className="text-2xl leading-normal">
                  Welcome Back! <br /> <Bold>{user.Username}</Bold>
                </h1>
                <p className="text-sm leading-normal">
                  <Bold>(delegate name)</Bold>
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
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <BatikPattern className="opacity-30" />
        </div>

        {/* Second absolute child with overflow visible */}
        <div className="absolute inset-0 -z-20 overflow-visible">
          <Image
            src={`/assets/dashboard/home/${hasRegistered ? "model-2.webp" : "model-1.webp"}`}
            alt="Dashboard Image"
            width={250}
            height={250}
            className="absolute right-0 bottom-0"
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
