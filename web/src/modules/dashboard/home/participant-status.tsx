import { Button } from "@/components/ui/button";
import Image from "next/image";

const ParticipantStatus = () => {
  const hasRegistered = false;

  return (
    <main className="flex flex-col gap-6">
      <h3 className="font-bold">Participant Status</h3>

      <section className="from-red-dark-hover/60 to-red-dark relative z-0 w-full rounded-md bg-gradient-to-b p-6 text-pretty">
        <div className="flex flex-col gap-5">
          {hasRegistered ? (
            <></>
          ) : (
            <>
              <div className="flex flex-col gap-3 md:max-w-1/2">
                <h1 className="text-2xl leading-normal">
                  You Haven&apos;t Been Identified as a Participant. <Bold>Register Now</Bold>!
                </h1>
                <p className="text-sm">
                  Register as <Bold>Single Delegates</Bold>, <Bold>Double Delegates</Bold>,{" "}
                  <Bold>Delegates Team</Bold>, <Bold>Observer or Faculty Advisor</Bold>
                </p>
              </div>
              <Button variant={`warning`} className="md:ml-auto w-fit mt-40 md:mt-0">
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
    </main>
  );
};

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold">{children}</span>
);

export default ParticipantStatus;
