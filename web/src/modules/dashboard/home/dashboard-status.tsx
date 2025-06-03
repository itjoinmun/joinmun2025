import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleDescription,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { cn } from "@/utils/helpers/cn";
import {
  getDelegate,
  getDelegatePaper,
  getPayment,
} from "@/utils/helpers/fetch/delegates/delegates";

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

const DashboardStatus = async () => {
  const userStatus = await getDelegate();
  const paperStatus = await getDelegatePaper();
  const paymentStatus = await getPayment();

  const registrationStatus: RegistrationStatus = (() => {
    if (!userStatus?.confirmed) return "waiting_verification";
    if (userStatus.confirmed && !paymentStatus?.confirmed) return "verified_pending_payment";
    if (paymentStatus?.payment_status === "checking") return "payment_checking";
    if (userStatus.confirmed && paymentStatus?.confirmed) return "payment_verified";
    return "not_registered";
  })();

  const paperSubmission: PaperSubmissionStatus = (() => {
    if (!userStatus?.confirmed || !paymentStatus?.confirmed) return "registration_pending";
    if (paperStatus?.paperUrl) return "uploaded";
    return "can_upload";
  })();

  const delegateCode: DelegateCodeStatus = (() => {
    if (userStatus?.confirmed) return "code_available";
    return "registration_pending";
  })();

  const informationCenter: InformationCenterStatus = (() => {
    if (!userStatus?.confirmed) return "registration_pending";
    return "no_information"; // Placeholder
  })();

  const regInfo = getRegistrationStatusInfo(registrationStatus);
  const codeInfo = getDelegateCodeInfo(delegateCode);
  const paperInfo = getPaperSubmissionInfo(paperSubmission);
  const infoInfo = getInformationCenterInfo(informationCenter);

  return (
    <DashboardModule className="">
      <section className="mt-3 grid grid-cols-1 gap-4 md:auto-rows-fr lg:grid-cols-2">
        <StatusCard
          cardHeader="Status"
          cardDescription=""
          status={regInfo.status}
          description={regInfo.description}
        />
        <StatusCard
          cardHeader="Delegate Code"
          cardDescription="Give code to your Faculty Advisor"
          status={codeInfo.status}
          description={codeInfo.description}
        />
        <StatusCard
          cardHeader="Paper Submission"
          cardDescription=""
          status={paperInfo.status}
          description={paperInfo.description}
        />
        <StatusCard
          cardHeader="Information Center"
          cardDescription=""
          status={infoInfo.status}
          description={infoInfo.description}
        />
      </section>
    </DashboardModule>
  );
};

const StatusCard = ({
  status,
  description,
  cardHeader,
  cardDescription,
}: {
  status: string;
  description: string;
  cardHeader: string;
  cardDescription: string;
}) => {
  return (
    <DashboardModule
      className={cn(
        "flex flex-col gap-3 transition-all",
        // variantStyles[variant],
      )}
    >
      {status}
      <DashboardModuleHeader className="flex shrink-0 flex-col text-nowrap 2xl:flex-row 2xl:justify-between 2xl:*:max-w-1/2">
        <DashboardModuleTitle>{cardHeader}</DashboardModuleTitle>
        <DashboardModuleDescription className="text-wrap opacity-80">
          {cardDescription}
        </DashboardModuleDescription>
      </DashboardModuleHeader>
      <DashboardModuleContent className="mt-auto">
        <p className="text-sm opacity-90">{description}</p>
        {/* <p className="text-xs opacity-75">{description}</p> */}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

const getRegistrationStatusInfo = (status: RegistrationStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Registered",
        description: "You haven't registered, <b>Register Now</b>",
      };
    case "waiting_verification":
      return {
        status: "Waiting for Verification",
        description: "Waiting For Verification...",
      };
    case "verified_pending_payment":
      return {
        status: "Payment Required",
        description: "Verified, Go To Payment",
      };
    case "payment_checking":
      return {
        status: "Payment Being Checked",
        description: "Verified, Go To Payment",
      };
    case "payment_verified":
      return {
        status: "Fully Registered",
        description: "Your registration is complete",
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

export default DashboardStatus;
