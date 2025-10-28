import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleDescription,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { PositionPaperModal } from "@/components/dashboard/position-paper-modal";
import { ViewPaperButton } from "@/components/dashboard/view-paper-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/helpers/cn";
import {
  Delegate,
  getDelegate,
  getDelegatePaper,
  getPayment,
  getDelegates,
  Payment,
  Delegates,
  Paper,
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

/**
 * Function 1: Registration Status Logic
 * Handles only registration and verification status
 */
const getRegistrationStatus = (
  delegate: Delegate,
  delegates: Delegates,
  payment: Payment,
): RegistrationStatus => {
  if (!delegate) return "not_registered";

  // Team logic
  if (delegates?.participant_data?.length > 0) {
    const teamMembers = delegates.participant_data;
    const hasRejected = teamMembers.some((member) => member.confirmed === "rejected");
    const hasPending = teamMembers.some((member) => member.confirmed === "pending");
    const allApproved = teamMembers.every((member) => member.confirmed === "confirmed");

    if (hasRejected) return "not_registered";
    if (hasPending) return "waiting_verification";

    if (allApproved) {
      if (!payment) return "verified_pending_payment";

      // Check team payment status
      if (payment.team_members?.length > 0) {
        const allPaid = payment.team_members.every((member) => member.payment_status === "paid");
        const anyPending = payment.team_members.some(
          (member) => member.payment_status === "pending",
        );
        const haventPaid = payment.team_members.some((member) => !member.package);

        if (haventPaid) return "verified_pending_payment";
        if (allPaid) return "payment_verified";
        if (anyPending) return "payment_checking";
        return "verified_pending_payment";
      }

      // Fallback to single payment check
      if (!payment.package) return "verified_pending_payment";
      if (payment.payment_status === "paid") return "payment_verified";
      if (payment.payment_status === "pending") return "payment_checking";
      return "verified_pending_payment";
    }
  }

  // Single delegate fallback
  if (delegate.confirmed === "pending") return "waiting_verification";
  if (delegate.confirmed === "rejected") return "not_registered";
  if (delegate.confirmed === "confirmed") {
    if (!payment) return "verified_pending_payment";
    if (!payment.package) return "verified_pending_payment";
    if (payment.payment_status === "paid") return "payment_verified";
    if (payment.payment_status === "pending") return "payment_checking";
    return "verified_pending_payment";
  }

  return "verified_pending_payment";
};

/**
 * Function 2: Delegate Code Status Logic
 * Handles delegate code availability
 */
const getDelegateCodeStatus = (
  delegate: Delegate,
  delegates: Delegates,
  payment: Payment,
): DelegateCodeStatus => {
  if (!delegate) return "not_registered";
  // Faculty advisor special case

  if (delegate.participant_type === "faculty_advisor" && payment.payment_status === "paid") {
    return "can_input";
  }

  // Check if all team members are approved
  if (delegates?.participant_data?.length > 0) {
    const allApproved = delegates.participant_data.every(
      (member) => member.confirmed === "confirmed",
    );
    return allApproved ? "code_available" : "registration_pending";
  }

  // Single delegate
  return delegate.confirmed === "confirmed" ? "code_available" : "registration_pending";
};

/**
 * Function 3: Paper Submission Status Logic
 * Handles position paper submission status
 */
const getPaperSubmissionStatus = (
  delegate: Delegate,
  delegates: Delegates,
  payment: Payment,
  paper: Paper,
): PaperSubmissionStatus => {
  if (!delegate) return "not_registered";

  let registrationComplete = false;
  let paymentComplete = false;

  // Team logic
  if (delegates?.participant_data?.length > 0) {
    const allApproved = delegates.participant_data.every(
      (member) => member.confirmed === "confirmed",
    );
    registrationComplete = allApproved && !!delegate.council && !!delegate.country;

    if (payment?.team_members?.length > 0) {
      paymentComplete = payment.team_members.every((member) => member.payment_status === "paid");
    } else {
      paymentComplete = payment?.payment_status === "paid";
    }
  } else {
    // Single delegate
    registrationComplete =
      delegate.confirmed === "confirmed" && !!delegate.council && !!delegate.country;
    paymentComplete = payment?.payment_status === "paid";
  }

  if (!registrationComplete || !paymentComplete) {
    return "registration_pending";
  }

  // Check paper status
  if (paper?.submission_file) return "uploaded";
  if (process.env.NEXT_PUBLIC_CC_REVEAL === "false") return "not_revealed";
  return "can_upload";
};

/**
 * Function 4: Information Center Status Logic
 * Handles council/country assignment information
 */
const getInformationCenterStatus = (
  delegate: Delegate,
  delegates: Delegates,
  payment: Payment,
): InformationCenterStatus => {
  if (!delegate) return "not_registered";

  let registrationComplete = false;
  let paymentComplete = false;

  // Team logic
  if (delegates?.participant_data?.length > 0) {
    registrationComplete = delegates.participant_data.every(
      (member) => member.confirmed === "confirmed",
    );

    if (payment?.team_members?.length > 0) {
      paymentComplete = payment.team_members.every((member) => member.payment_status === "paid");
    } else {
      // Fallback for team if team_members is not populated but a general payment status exists
      // This case might need review based on actual data structure for team payments without team_members array
      paymentComplete = payment?.payment_status === "paid";
    }
  } else {
    // Single delegate
    registrationComplete = delegate.confirmed === "confirmed";
    paymentComplete = payment?.payment_status === "paid";
  }

  const requirementsMet = registrationComplete && paymentComplete;

  if (!requirementsMet) return "registration_pending";

  // Check if council and country are assigned
  return delegate.council && delegate.country && process.env.NEXT_PUBLIC_GROUP_REVEAL === "true"
    ? "has_information"
    : "no_information";
};

const DashboardStatus = async () => {
  const delegate = (await getDelegate()) as Delegate;
  const delegates = (await getDelegates()) as Delegates;
  const paper = (await getDelegatePaper()) as Paper;
  const payment = (await getPayment()) as Payment;

  const registrationStatus = getRegistrationStatus(delegate, delegates, payment);
  const delegateCode = getDelegateCodeStatus(delegate, delegates, payment);
  const paperSubmission = getPaperSubmissionStatus(delegate, delegates, payment, paper);
  const informationCenter = getInformationCenterStatus(delegate, delegates, payment);

  const regInfo = getRegistrationStatusInfo(registrationStatus);
  const codeInfo = getDelegateCodeInfo(delegateCode, payment?.mun_team_id);
  const paperInfo = getPaperSubmissionInfo(paperSubmission);
  const infoInfo = getInformationCenterInfo(informationCenter);

  return (
    <DashboardModule className="">
      <section className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(delegate?.participant_type === "single_delegate" ||
          delegate?.participant_type === "team_delegate" ||
          !delegate) && (
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
              canSubmitPaper={
                paperSubmission === "can_upload" && !!delegate.country && !!delegate.council
              }
              paperUploaded={paperSubmission === "uploaded"}
              userStatus={delegate}
            />
            <StatusCard
              cardHeader="Information Center"
              cardDescription=""
              description={infoInfo.description}
            />
          </>
        )}

        {delegate?.participant_type === "faculty_advisor" && (
          <>
            <StatusCard cardHeader="Status" cardDescription="" description={regInfo.description} />
            <StatusCard cardHeader="Information Center" description={infoInfo.description} />
            {delegateCode === "can_input" && (
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
            <StatusCard cardHeader="Status" cardDescription="" description={regInfo.description} />
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
      <DashboardModuleContent className="mt-auto flex min-h-20 flex-row items-center justify-between gap-4">
        <div className="text-sm opacity-90">{description}</div>
        <div>
          {canSubmitPaper && userStatus && <PositionPaperModal userStatus={userStatus} />}
          {paperUploaded && <ViewPaperButton />}
        </div>
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
          <div className="flex items-center justify-between gap-4">
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
        status: "Input Delegate Code",
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

const getInformationCenterInfo = (status: InformationCenterStatus) => {
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
        description: (
          <div className="flex items-center justify-between gap-2">
            <p>Join whatsapp group:</p>
            <Link
              rel="noopener noreferrer"
              target="_blank"
              // TODO : GRUP WA
              href="https://chat.whatsapp.com/D666666666666666666666666666666666666666"
            >
              <Button variant="primary" className="h-8 text-xs" size="sm">
                Join
              </Button>
            </Link>
          </div>
        ),
      };
  }
};

export default DashboardStatus;
