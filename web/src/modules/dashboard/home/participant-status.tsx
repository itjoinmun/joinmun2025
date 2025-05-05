import BatikPattern from "@/components/batik-pattern";
import {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type RegistrationStatus =
  | "not_registered"
  | "waiting_verification"
  | "verified_pending_payment"
  | "payment_checking"
  | "payment_verified";

type DelegateCodeStatus = "not_registered" | "registration_pending" | "code_available";

type PaperSubmissionStatus = "not_registered" | "registration_pending" | "can_upload" | "uploaded";

type InformationCenterStatus =
  | "not_registered"
  | "registration_pending"
  | "no_information"
  | "has_information";

interface ParticipantData {
  registrationStatus: RegistrationStatus;
  delegateCode: DelegateCodeStatus;
  paperSubmission: PaperSubmissionStatus;
  informationCenter: InformationCenterStatus;
  paperUrl?: string; // Optional: only exists if paperSubmission is "uploaded"
  delegateCodeValue?: string; // Optional: only exists if delegateCode is "code_available"
  informationContent?: string; // Optional: only exists if informationCenter is "has_information"
}

// Dummy data representing different possible states
const DUMMY_STATES: Record<string, ParticipantData> = {
  newUser: {
    registrationStatus: "not_registered",
    delegateCode: "not_registered",
    paperSubmission: "not_registered",
    informationCenter: "not_registered",
  },
  registering: {
    registrationStatus: "waiting_verification",
    delegateCode: "registration_pending",
    paperSubmission: "registration_pending",
    informationCenter: "registration_pending",
  },
  verifiedUnpaid: {
    registrationStatus: "verified_pending_payment",
    delegateCode: "registration_pending",
    paperSubmission: "registration_pending",
    informationCenter: "no_information",
  },
  paymentChecking: {
    registrationStatus: "payment_checking",
    delegateCode: "registration_pending",
    paperSubmission: "registration_pending",
    informationCenter: "no_information",
  },
  fullyRegistered: {
    registrationStatus: "payment_verified",
    delegateCode: "code_available",
    paperSubmission: "can_upload",
    informationCenter: "has_information",
    delegateCodeValue: "DELEGATE2024-001",
    informationContent: "Welcome to JOINMUN 2024! Your first council meeting will be held on...",
  },
  paperSubmitted: {
    registrationStatus: "payment_verified",
    delegateCode: "code_available",
    paperSubmission: "uploaded",
    informationCenter: "has_information",
    delegateCodeValue: "DELEGATE2024-002",
    paperUrl: "/papers/position-paper-v1.pdf",
    informationContent: "Your position paper has been received. Next council meeting schedule...",
  },
};

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
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <BatikPattern className="opacity-30" />
        </div>

        {/* Second absolute child with overflow visible */}
        <div className="absolute inset-0 -z-20 overflow-visible">
          <Image
            src={`/assets/dashboard/home/1st Model.webp`}
            alt="Dashboard Image"
            width={310}
            height={310}
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
