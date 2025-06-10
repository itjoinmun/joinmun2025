import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleDescription,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { PositionPaperModal } from "@/components/dashboard/position-paper-modal";
import { ViewPaperButton } from "@/components/dashboard/view-paper-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/helpers/cn";
import {
  Delegate,
  getDelegate,
  getDelegatePaper,
  getPayment,
  getDelegates,
} from "@/utils/helpers/fetch/delegates/delegates";
import Link from "next/link";
import DelegateCodeInput from "./delegate-code-input";

type RegistrationStatus =
  | "not_registered"
  | "waiting_verification"
  | "verified_pending_payment"
  | "payment_checking"
  | "payment_verified";
type DelegateCodeStatus =
  | "not_registered"
  | "registration_pending"
  | "can_input"
  | "code_available";
type PaperSubmissionStatus =
  | "not_registered"
  | "registration_pending"
  | "can_upload"
  | "uploaded"
  | "not_revealed";
type InformationCenterStatus =
  | "not_registered"
  | "registration_pending"
  | "no_information"
  | "has_information";

const DashboardStatus = async () => {
  const delegate = await getDelegate();
  const delegates = await getDelegates();
  const paper = await getDelegatePaper();
  const payment = await getPayment();

  const registrationStatus: RegistrationStatus = (() => {
    if (!delegate) return "not_registered";

    // Check all team members' registration status
    if (delegates && delegates.participant_data && delegates.participant_data.length > 0) {
      const teamMembers = delegates.participant_data;
      const rejectedMembers = teamMembers.filter((member) => member.confirmed === "rejected");
      const pendingMembers = teamMembers.filter((member) => member.confirmed === "pending");
      const approvedMembers = teamMembers.filter((member) => member.confirmed === "confirmed");

      // If ANY team member is rejected, show not registered
      if (rejectedMembers.length > 0) return "not_registered";

      // If ANY team member is still pending, show waiting verification
      if (pendingMembers.length > 0) return "waiting_verification";

      // All team members are approved
      if (approvedMembers.length === teamMembers.length) {
        // Now check payment status
        if (!payment) return "verified_pending_payment";

        // Check payment status for all team members
        if (payment.team_members && payment.team_members.length > 0) {
          const allPaid = payment.team_members.every((member) => member.payment_status === "paid");
          const anyPending = payment.team_members.some(
            (member) => member.payment_status === "pending",
          );

          if (allPaid) return "payment_verified";
          if (anyPending) return "payment_checking";
        } else {
          // Fallback to overall payment status
          if (payment.payment_status === "paid") return "payment_verified";
          if (payment.payment_status === "pending") return "payment_checking";
        }

        return "verified_pending_payment";
      }
    }

    // Fallback to single delegate logic
    if (delegate.confirmed === "pending") return "waiting_verification";
    if (delegate.confirmed === "rejected") return "not_registered";
    if (delegate.confirmed === "confirmed" && (!payment || payment.payment_status === "pending"))
      return "verified_pending_payment";
    if (delegate.confirmed === "confirmed" && payment?.payment_status === "pending")
      return "payment_checking";
    if (delegate.confirmed === "confirmed" && payment?.payment_status === "paid")
      return "payment_verified";
    return "verified_pending_payment";
  })();

  const paperSubmission: PaperSubmissionStatus = (() => {
    if (!delegate) return "not_registered";

    // Check if all team members are approved for registration
    if (delegates && delegates.participant_data && delegates.participant_data.length > 0) {
      const teamMembers = delegates.participant_data;
      const allApproved = teamMembers.every((member) => member.confirmed === "confirmed");

      if (!allApproved) return "registration_pending";

      // Check if all team members have paid
      if (payment && payment.team_members && payment.team_members.length > 0) {
        const allPaid = payment.team_members.every((member) => member.payment_status === "paid");
        if (!allPaid) return "registration_pending";
      } else if (!payment || payment.payment_status !== "paid") {
        return "registration_pending";
      }
    } else {
      // Fallback to single delegate logic
      if (delegate.confirmed !== "confirmed") return "registration_pending";
      if (!payment || payment.payment_status !== "paid") return "registration_pending";
    }

    if (paper?.submission_file) return "uploaded";
    if (process.env.NEXT_PUBLIC_CC_REVEAL === "false") return "not_revealed";
    return "can_upload";
  })();

  const delegateCode: DelegateCodeStatus = (() => {
    if (!delegate) return "not_registered";
    if (delegate.participant_type === "faculty_advisor" && !delegate.pair) return "can_input";
    if (delegate.participant_type !== "single_delegate") return "code_available";
    return "registration_pending";
  })();

  const informationCenter: InformationCenterStatus = (() => {
    if (!delegate) return "not_registered";

    // Check if all team members are approved and paid
    if (delegates && delegates.participant_data && delegates.participant_data.length > 0) {
      const teamMembers = delegates.participant_data;
      const allApproved = teamMembers.every((member) => member.confirmed === "confirmed");

      if (!allApproved) return "registration_pending";

      // Check payment status
      if (payment && payment.team_members && payment.team_members.length > 0) {
        const allPaid = payment.team_members.every((member) => member.payment_status === "paid");
        if (!allPaid) return "registration_pending";
      } else if (!payment || payment.payment_status !== "paid") {
        return "registration_pending";
      }
    } else {
      // Fallback to single delegate logic
      if (delegate.confirmed !== "confirmed") return "registration_pending";
      if (!payment || payment.payment_status !== "paid") return "registration_pending";
    }

    if (delegate.council && delegate.country) return "has_information";
    return "no_information";
  })();
  const regInfo = getRegistrationStatusInfo(registrationStatus);
  const codeInfo = getDelegateCodeInfo(delegateCode, payment?.mun_team_id);
  const paperInfo = getPaperSubmissionInfo(paperSubmission);
  const infoInfo = getInformationCenterInfo(informationCenter, delegate);

  return (
    <DashboardModule className="">
      <section className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(delegate?.participant_type === "single_delegate" ||
          delegate?.participant_type === "team_delegate") && (
          <>
            <StatusCard
              cardHeader="Registration Status"
              cardDescription="Your current registration progress"
              status={regInfo.status}
              description={regInfo.description}
            />
            <StatusCard
              cardHeader="Delegate Code"
              cardDescription="Your unique delegate identifier"
              status={codeInfo.status}
              description={codeInfo.description}
            />
            <StatusCard
              cardHeader="Paper Submission"
              cardDescription="Position paper upload status"
              status={paperInfo.status}
              description={paperInfo.description}
              canSubmitPaper={paperSubmission === "can_upload"}
              paperUploaded={paperSubmission === "uploaded"}
              userStatus={delegate}
            />
            <StatusCard
              cardHeader="Assignment Information"
              cardDescription="Council and country assignment"
              status={infoInfo.status}
              description={infoInfo.description}
            />
          </>
        )}

        {delegate?.participant_type === "faculty_advisor" && (
          <>
            <StatusCard
              cardHeader="Status"
              cardDescription="Verification announcement at 15 Dec 2025"
              description={regInfo.description}
            />
            <StatusCard cardHeader="Information Center" description={infoInfo.description} />
            {delegate?.payment_status === "paid" && (
              <StatusCard
                cardHeader="Delegate Code"
                cardDescription="Input code from your delegates"
                description={codeInfo.description}
              />
            )}
          </>
        )}

        {delegate?.participant_type === "observer" && (
          <>
            <StatusCard
              cardHeader="Status"
              cardDescription="Verification announcement at 15 Dec 2025"
              description={regInfo.description}
            />
            <StatusCard cardHeader="Information Center" description={infoInfo.description} />
          </>
        )}
      </section>
    </DashboardModule>
  );
};

const StatusCard = ({
  description,
  cardHeader,
  cardDescription,
  canSubmitPaper = false,
  userStatus,
  paperUploaded = false,
}: {
  status?: string;
  description: string | React.ReactNode;
  cardHeader: string;
  cardDescription?: string;
  canSubmitPaper?: boolean;
  userStatus?: Delegate | null;
  paperUploaded?: boolean;
}) => {
  return (
    <DashboardModule className={cn("flex flex-col gap-3 transition-all")}>
      <DashboardModuleHeader className="flex shrink-0 flex-col text-nowrap lg:flex-row lg:gap-4 lg:max-2xl:items-center 2xl:justify-between 2xl:*:max-w-1/2">
        <DashboardModuleTitle>{cardHeader}</DashboardModuleTitle>
        <DashboardModuleDescription className="text-wrap opacity-80">
          {cardDescription}
        </DashboardModuleDescription>
      </DashboardModuleHeader>
      <DashboardModuleContent className="mt-auto space-y-3">
        <div className="text-sm opacity-90">{description}</div>
        {canSubmitPaper && userStatus && <PositionPaperModal userStatus={userStatus} />}
        {paperUploaded && <ViewPaperButton />}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

const getRegistrationStatusInfo = (status: RegistrationStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Registered",
        description: (
          <div className="flex items-center justify-between gap-4">
            <p>
              You haven&apos;t registered yet. <strong>Register Now</strong>
            </p>
            <Link
              href="/dashboard/delegates"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-7 text-xs")}
            >
              Register Now
            </Link>
          </div>
        ),
      };
    case "waiting_verification":
      return {
        status: "Pending Verification",
        description: <>Your registration is being reviewed by administrators.</>,
      };
    case "verified_pending_payment":
      return {
        status: "Payment Required",
        description: (
          <>Registration approved! Please proceed with payment to complete your registration.</>
        ),
      };
    case "payment_checking":
      return {
        status: "Payment Under Review",
        description: <>Your payment is being verified by our team.</>,
      };
    case "payment_verified":
      return {
        status: "Fully Registered",
        description: <>Congratulations! Your registration and payment are complete.</>,
      };
  }
};

const getDelegateCodeInfo = (status: DelegateCodeStatus, paymentCode?: string) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: (
          <div className="flex justify-between gap-4">
            <p>
              You haven&apos;t registered yet. <strong>Register Now</strong>
            </p>
          </div>
        ),
      };
    case "registration_pending":
      return {
        status: "Pending Approval",
        description: "Code will be available after registration approval",
      };
    case "can_input":
      return {
        description: <DelegateCodeInput />,
      };
    case "code_available":
      const delegateCode = paymentCode || "Individual";
      return {
        status: delegateCode,
        description: `${delegateCode}`,
      };
  }
};

const getPaperSubmissionInfo = (status: PaperSubmissionStatus) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: (
          <div className="flex justify-between gap-4">
            <p>
              You haven&apos;t registered yet. <strong>Register Now</strong>
            </p>
          </div>
        ),
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
    case "not_revealed":
      return {
        status: "Not Revealed",
        description: "Position paper submission is not yet available",
        variant: "info" as const,
      };
  }
};

const getInformationCenterInfo = (
  status: InformationCenterStatus,
  userStatus?: Delegate | null,
) => {
  switch (status) {
    case "not_registered":
      return {
        status: "Not Available",
        description: (
          <div className="flex justify-between gap-4">
            <p>
              You haven&apos;t registered yet. <strong>Register Now</strong>
            </p>
          </div>
        ),
      };
    case "registration_pending":
      return {
        status: "Pending Registration",
        description: "Complete registration and payment to view assignments",
      };
    case "no_information":
      return {
        status: "Assignment Pending",
        description: "Council and country assignments will be available soon",
      };
    case "has_information":
      return {
        status: "Assignment Available",
        description: `Council: ${userStatus?.council || "TBA"} | Country: ${userStatus?.country || "TBA"}`,
      };
  }
};

export default DashboardStatus;
