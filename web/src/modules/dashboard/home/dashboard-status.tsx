import {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
  DashboardModuleDescription,
} from "@/components/dashboard/dashboard-module";
import { cn } from "@/utils/cn";

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
  paperUrl?: string;
  delegateCodeValue?: string;
  informationContent?: string;
}

const currentUserState: ParticipantData = {
  registrationStatus: "verified_pending_payment",
  delegateCode: "registration_pending",
  paperSubmission: "registration_pending",
  informationCenter: "no_information",
};

interface StatusCardProps {
  title: string;
  status: string;
  description: string;
  cardHeader: string;
  cardDescription: string;
}

const StatusCard = ({
  // title,
  status,
  description,
  cardHeader,
  cardDescription,
}: StatusCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-all",
        // variantStyles[variant],
      )}
    >
      <div className="space-1 flex flex-col items-baseline justify-between 2xl:flex-row">
        <DashboardModuleHeader>
          <DashboardModuleTitle>{cardHeader}</DashboardModuleTitle>
        </DashboardModuleHeader>
        {/* <p className="hidden text-xs opacity-75 2xl:flex">{cardDescription}</p> */}
        <DashboardModuleDescription className="opacity-80">{cardDescription}</DashboardModuleDescription>
      </div>

      <div className="space-y-2 rounded-md bg-white/5 p-3">
        {/* <h3 className="font-semibold">{title}</h3> */}
        <p className="text-base opacity-90">{status}</p>
        <p className="text-xs opacity-75">{description}</p>
      </div>
    </div>
  );
};

const getRegistrationStatusInfo = (status: RegistrationStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Registered",
        description: "You haven't started the registration process yet",
        variant: "error" as const,
      };
    case "waiting_verification":
      return {
        status: "Waiting for Verification",
        description: "Your registration is being reviewed by our team",
        variant: "warning" as const,
      };
    case "verified_pending_payment":
      return {
        status: "Payment Required",
        description: "Your registration is verified. Please proceed with payment",
        variant: "info" as const,
      };
    case "payment_checking":
      return {
        status: "Payment Being Checked",
        description: "We're verifying your payment",
        variant: "warning" as const,
      };
    case "payment_verified":
      return {
        status: "Fully Registered",
        description: "Your registration is complete",
        variant: "success" as const,
      };
  }
};

const getDelegateCodeInfo = (status: DelegateCodeStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: "Complete registration to get your delegate code",
        variant: "error" as const,
      };
    case "registration_pending":
      return {
        status: "Pending Registration",
        description: "Code will be available after registration is complete",
        variant: "warning" as const,
      };
    case "code_available":
      return {
        status: "Code Available",
        description: "Your delegate code is ready to use",
        variant: "success" as const,
      };
  }
};

const getPaperSubmissionInfo = (status: PaperSubmissionStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: "Register first to submit your paper",
        variant: "error" as const,
      };
    case "registration_pending":
      return {
        status: "Pending Registration",
        description: "Complete registration to access paper submission",
        variant: "warning" as const,
      };
    case "can_upload":
      return {
        status: "Ready for Upload",
        description: "You can now upload your position paper",
        variant: "info" as const,
      };
    case "uploaded":
      return {
        status: "Paper Submitted",
        description: "Your paper has been uploaded successfully",
        variant: "success" as const,
      };
  }
};

const getInformationCenterInfo = (status: InformationCenterStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: "Register to access information center",
        variant: "error" as const,
      };
    case "registration_pending":
      return {
        status: "Pending Registration",
        description: "Complete registration to view information",
        variant: "warning" as const,
      };
    case "no_information":
      return {
        status: "No Updates",
        description: "No new information available at this time",
        variant: "info" as const,
      };
    case "has_information":
      return {
        status: "Updates Available",
        description: "New information is available for you",
        variant: "success" as const,
      };
  }
};

const DashboardStatus = () => {
  const regInfo = getRegistrationStatusInfo(currentUserState.registrationStatus);
  const codeInfo = getDelegateCodeInfo(currentUserState.delegateCode);
  const paperInfo = getPaperSubmissionInfo(currentUserState.paperSubmission);
  const infoInfo = getInformationCenterInfo(currentUserState.informationCenter);

  return (
    <DashboardModule className="">
      <section className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusCard
          cardHeader="Registration Status"
          cardDescription="Track your registration progress from initial signup to payment verification"
          title="Current Status"
          status={regInfo.status}
          description={regInfo.description}
        />
        <StatusCard
          cardHeader="Delegate Code"
          cardDescription="Your unique identifier for the JOINMUN 2025 conference"
          title="Code Status"
          status={codeInfo.status}
          description={codeInfo.description}
        />
        <StatusCard
          cardHeader="Paper Submission"
          cardDescription="Submit and manage your position papers for the conference"
          title="Submission Status"
          status={paperInfo.status}
          description={paperInfo.description}
        />
        <StatusCard
          cardHeader="Information Center"
          cardDescription="Stay updated with important announcements and conference details"
          title="Update Status"
          status={infoInfo.status}
          description={infoInfo.description}
        />
      </section>
    </DashboardModule>
  );
};

export default DashboardStatus;
