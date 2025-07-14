"use client";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/helpers/cn";
import {
  Delegate,
  getDelegate,
  getDelegates,
  getPayment,
  Payment,
  submitPayment,
} from "@/utils/helpers/fetch/delegates/delegates";
import { useSession } from "@/utils/hooks/use-session";
import { paymentStorage } from "@/utils/storage/indexeddb";
import { useContext, useEffect, useState } from "react";
import PaymentPackageCard from "./package-card";
import { PackageSelection, PaymentContext } from "./payment-context";
import PaymentNav from "./payment-nav";
import { getCurrentPaymentPhase } from "@/utils/helpers/registration-wave";

const useDelegatesApprovalStatus = () => {
  const [delegates, setDelegates] = useState<{
    participant_data: Delegate[];
    team_id: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDelegates = async () => {
      try {
        const data = await getDelegates();
        if (!data || !data.participant_data) {
          try {
            const observerOrAdvisorData = await getDelegate();
            setDelegates({
              participant_data: observerOrAdvisorData ? [observerOrAdvisorData] : [],
              team_id: "",
            });
          } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch delegates");
          } finally {
            setLoading(false);
          }
          return;
        }
        setDelegates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch delegates");
      } finally {
        setLoading(false);
      }
    };

    fetchDelegates();
  }, []);

  return { delegates, loading, error };
};

const usePaymentStatus = () => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await getPayment();
        setPayment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch payment status");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, []);

  return { payment, loading, error };
};

const PaymentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageSelection, setPackageSelection] = useState<PackageSelection | null>(null);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const TOTAL_STEPS = 2;

  const delegateFromHook = useDelegatesApprovalStatus();
  const paymentFromHook = usePaymentStatus();
  const { user } = useSession();
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && packageSelection) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (paymentFile: File) => {
    if (!packageSelection) {
      setSubmitError("Please select a package first");
      return;
    }

    setSubmitError("");

    // Format package string as expected by backend: "type - accommodation"
    const packageString = `${packageSelection.type} - ${packageSelection.accommodationType}`;

    // Data untuk backend (hanya USD)
    const paymentData = {
      package: packageString,
      payment_amount: packageSelection.price.usd,
    };

    // Data untuk local storage (IDR dan USD)
    const storageData = {
      ...paymentData,
      payment_amount: {
        usd: packageSelection.price.usd,
        idr: packageSelection.price.idr,
      },
      payment_file: paymentFile,
      timestamp: Date.now(),
      status: "pending" as const,
    };

    try {
      const storageId = await paymentStorage.storePayment(storageData);

      await submitPayment(paymentData, paymentFile);
      await paymentStorage.updatePaymentStatus(storageId, "submitted");

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Payment submission failed:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit payment");

      try {
        await paymentStorage.storePayment({
          ...storageData,
          status: "failed" as const,
        });
      } catch (storageError) {
        console.error("Failed to store payment locally:", storageError);
      }
    }
  };

  const renderStepContent = () => {
    if (submitSuccess) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Payment Submitted Successfully!</h2>
          <p className="text-muted-foreground text-center">
            Your payment proof has been submitted and is being reviewed. You will receive
            confirmation once approved.
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <>
            <h1>Price Package</h1>
            <PackageSelectionStep />
          </>
        );
      case 2:
        return (
          <>
            <h1>Payment Details</h1>
            <PaymentDetailsStep />
          </>
        );
      default:
        return null;
    }
  };

  const allDelegatesConfirmed =
    delegateFromHook.delegates &&
    delegateFromHook.delegates.participant_data &&
    delegateFromHook.delegates.participant_data.length > 0 &&
    delegateFromHook.delegates.participant_data.every(
      (delegate) => delegate.confirmed === "confirmed",
    );

  const paymentInfo = paymentFromHook.payment;
  let userHasPackage = false;

  if (paymentInfo) {
    if (paymentInfo.team_members && paymentInfo.team_members.length > 0) {
      userHasPackage = !!paymentInfo.team_members.find(
        (member) => member.mun_delegate_email === user?.email,
      )?.package;
    } else {
      userHasPackage = !!paymentInfo.package;
    }
  }

  const showPaymentStatus = allDelegatesConfirmed && userHasPackage;

  return (
    <PaymentContext.Provider value={{ packageSelection, setPackageSelection }}>
      <DashboardModule>
        <DashboardModuleHeader>
          <DashboardModuleTitle>
            {showPaymentStatus ? "Payment Status" : "Registration Status"}
          </DashboardModuleTitle>
        </DashboardModuleHeader>
        <DashboardModuleContent>
          {showPaymentStatus ? (
            <ParticipantDataTable
              loading={paymentFromHook.loading}
              participants={paymentFromHook.payment}
            />
          ) : (
            <RegistrationDataTable
              loading={delegateFromHook.loading}
              delegates={delegateFromHook.delegates}
            />
          )}
        </DashboardModuleContent>
      </DashboardModule>
      <DashboardModule>
        <DashboardModuleHeader>
          <DashboardModuleTitle>Payment Details</DashboardModuleTitle>
        </DashboardModuleHeader>
        <DashboardModuleContent>
          <PaymentWithApprovalCheck
            renderStepContent={renderStepContent}
            submitSuccess={submitSuccess}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleSubmit={handleSubmit}
            currentStep={currentStep}
            TOTAL_STEPS={TOTAL_STEPS}
            packageSelection={packageSelection}
            submitError={submitError}
            user={user?.email}
          />
        </DashboardModuleContent>
      </DashboardModule>
    </PaymentContext.Provider>
  );
};

const PaymentWithApprovalCheck = ({
  renderStepContent,
  submitSuccess,
  handleNext,
  handlePrevious,
  handleSubmit,
  currentStep,
  TOTAL_STEPS,
  packageSelection,
  submitError,
  user,
}: {
  renderStepContent: () => React.ReactNode;
  submitSuccess: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: (file: File) => Promise<void>;
  currentStep: number;
  TOTAL_STEPS: number;
  packageSelection: PackageSelection | null;
  submitError: string;
  user: string | undefined;
}) => {
  const {
    delegates,
    loading: delegatesLoading,
    error: delegatesError,
  } = useDelegatesApprovalStatus();
  const { payment, loading: paymentLoading, error: paymentError } = usePaymentStatus();

  if (delegatesLoading || paymentLoading) {
    return (
      <>
        <h1 className="animate-pulse">Loading...</h1>
      </>
    );
  }

  if (delegatesError || paymentError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-red-100 p-3">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-700">Error Loading Data</h2>
        <p className="text-muted-foreground text-center">{delegatesError || paymentError}</p>
      </div>
    );
  }

  // Check if no registration found
  if (!delegates || !delegates.participant_data || delegates.participant_data.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-sm">
          <b>No approved registration found.</b> Register first to proceed with payment.
        </h1>
      </div>
    );
  }

  // Check delegates approval status
  const allApproved = delegates.participant_data.every(
    (delegate) => delegate.confirmed === "confirmed",
  );
  const anyRejected = delegates.participant_data.some(
    (delegate) => delegate.confirmed === "rejected",
  );

  // If any delegate is rejected, show rejection message
  if (anyRejected) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-red-100 p-3">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-700">Registration Rejected</h2>
        <p className="text-muted-foreground text-center">
          One or more of your team members&apos; registration has been rejected. Please check the
          registration status table above.
        </p>
      </div>
    );
  }

  // If not all approved, show message to wait for approval
  if (!allApproved) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-blue-100 p-3">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Waiting for Registration Approval</h2>
        <p className="text-muted-foreground text-center">
          Your team&apos;s registration is still being reviewed. Payment will be available once all
          team members are approved.
        </p>
      </div>
    );
  }

  // All delegates approved, now check current user's payment status
  const currentUserPayment =
    payment?.team_members && payment.team_members.length > 0
      ? payment.team_members.find((member) => member.mun_delegate_email === user)
      : payment; // Fallback to top-level payment if team_members is empty or null

  const currentUserHasPackage = currentUserPayment?.package;

  // If current user doesn't have a package, show payment flow
  if (!currentUserHasPackage) {
    return (
      <>
        {renderStepContent()}
        {!submitSuccess && (
          <PaymentNav
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isLastStep={currentStep >= TOTAL_STEPS}
            isFirstStep={currentStep <= 1}
            canProceed={!!packageSelection}
            submitError={submitError}
          />
        )}
      </>
    );
  }

  // Current user has submitted payment, show payment status
  if (payment) {
    let allPaid = false;
    let anyPending = false;
    let anyPaymentRejected = false;

    if (payment.team_members && payment.team_members.length > 0) {
      allPaid = payment.team_members.every((member) => member.payment_status === "paid");
      anyPending = payment.team_members.some(
        (member) => !member.package || member.payment_status === "pending",
      );
      anyPaymentRejected = payment.team_members.some(
        (member) => member.payment_status === "failed",
      );
    } else if (payment.payment_status) {
      // Handle single payment scenario (no team_members)
      allPaid = payment.payment_status === "paid";
      anyPending = !payment.package || payment.payment_status === "pending";
      anyPaymentRejected = payment.payment_status === "failed";
    }

    if (allPaid) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Payment Approved!</h2>
          <p className="text-muted-foreground text-center">
            {payment.team_members && payment.team_members.length > 0
              ? "Your team's payment has been approved. You're all set for the event!"
              : "Your payment has been approved. You're all set for the event!"}
          </p>
        </div>
      );
    }

    if (anyPending || anyPaymentRejected) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-blue-100 p-3">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Payment Under Review</h2>
          <p className="text-muted-foreground text-center">
            Your payment is being reviewed. Please check the payment status table above for details.
          </p>
        </div>
      );
    }
  }

  // Fallback - show payment flow
  return (
    <>
      {renderStepContent()}
      {!submitSuccess && (
        <PaymentNav
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isLastStep={currentStep >= TOTAL_STEPS}
          isFirstStep={currentStep <= 1}
          canProceed={!!packageSelection}
          submitError={submitError}
        />
      )}
    </>
  );
};

// Step 1: Package Selection
const PackageSelectionStep = () => {
  const { packageSelection, setPackageSelection } = useContext(PaymentContext);
  const { delegates, loading } = useDelegatesApprovalStatus();
  if (loading || !delegates?.participant_data?.[0]?.insert_date) {
    return <p className="animate-pulse">Loading...</p>;
  }
  // Get number of delegates for team pricing
  const numberOfDelegates = delegates?.participant_data?.length || 0;
  const delegateTime = delegates?.participant_data?.[0]?.insert_date;

  // Determine which package to use based on number of delegates
  const getTeamPackage = () => {
    if (numberOfDelegates >= 2 && numberOfDelegates <= 5) return "packageA";
    if (numberOfDelegates >= 6 && numberOfDelegates <= 8) return "packageB";
    if (numberOfDelegates >= 9 && numberOfDelegates <= 12) return "packageC";
    return "packageD";
  };

  // Get current wave and map it to package type
  const currentWave = getCurrentPaymentPhase(delegateTime);
  const type: "EarlyBird" | "Regular" | "Late" =
    currentWave === "Early Bird"
      ? "EarlyBird"
      : currentWave === "Regular"
        ? "Regular"
        : currentWave === "Late"
          ? "Late"
          : "EarlyBird";
  // Determine participant type from delegate data
  const participantType: "single_delegate" | "team_delegate" | "observer" | "advisor" =
    delegates?.participant_data?.[0]?.participant_type === "single_delegate" ||
    delegates?.participant_data?.[0]?.participant_type === "team_delegate" ||
    delegates?.participant_data?.[0]?.participant_type === "observer" ||
    delegates?.participant_data?.[0]?.participant_type === "faculty_advisor"
      ? delegates.participant_data[0].participant_type === "faculty_advisor"
        ? "advisor"
        : delegates.participant_data[0].participant_type
      : "single_delegate";

  const selectedType =
    packageSelection?.accommodationType === "with_accommodation"
      ? "accommodation"
      : packageSelection?.accommodationType === "non_accommodation"
        ? "nonAccommodation"
        : undefined;

  // Handler for PaymentPackageCard selection
  const handleSelect = (
    accomType: "accommodation" | "nonAccommodation",
    price: { idr: string; usd: string },
  ) => {
    const idr = Number(price.idr.replace("Rp", "").replace(/\./g, ""));
    const usd = Number(price.usd.replace("$", ""));

    const selection: PackageSelection = {
      type,
      participantType,
      accommodationType: accomType === "accommodation" ? "with_accommodation" : "non_accommodation",
      price: {
        usd,
        idr,
      },
      teamPackage: participantType === "team_delegate" ? getTeamPackage() : undefined,
    };

    setPackageSelection(selection);
  };

  return (
    <div className="flex justify-center">
      <PaymentPackageCard
        participantType={participantType}
        onSelect={handleSelect}
        selectedType={selectedType}
        teamPackage={participantType === "team_delegate" ? getTeamPackage() : undefined}
      />
    </div>
  );
};

// Step 2: Payment Details (Fixed component)
const PaymentDetailsStep = () => {
  const { packageSelection } = useContext(PaymentContext);
  const [paymentProof, setPaymentProof] = useState<File>();
  const { delegates } = useDelegatesApprovalStatus();
  // Get number of delegates for team pricing
  const numberOfDelegates = delegates?.participant_data?.length || 0;

  // Determine which package to use based on number of delegates
  const getTeamPackage = () => {
    if (numberOfDelegates >= 2 && numberOfDelegates <= 5) return "packageA";
    if (numberOfDelegates >= 6 && numberOfDelegates <= 8) return "packageB";
    if (numberOfDelegates >= 9 && numberOfDelegates <= 12) return "packageC";
    return "packageD";
  };

  const bankAccounts = [
    {
      bank: "Bank Mandiri",
      number: "1370025432184",
      name: "Drasthya Wironegoro",
    },
  ];

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Match backend file size limit (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      // Match backend allowed file types
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload JPG, JPEG, PNG, or PDF file");
        return;
      }
      setPaymentProof(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
      {/* From here */}
      <div className="w-full space-y-3 lg:w-fit lg:min-w-xs">
        <h3>Chosen Package</h3>
        <PaymentPackageCard
          participantType={packageSelection?.participantType || "single_delegate"}
          onSelect={() => {}}
          selectedType={
            packageSelection?.accommodationType === "with_accommodation"
              ? "accommodation"
              : packageSelection?.accommodationType === "non_accommodation"
                ? "nonAccommodation"
                : undefined
          }
          teamPackage={
            packageSelection?.participantType === "team_delegate" ? getTeamPackage() : undefined
          }
        />
      </div>
      {/* Until here */}

      <div className="flex w-full flex-col gap-6">
        {/* Bank Accounts */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">How To Pay</h3>
          <p>Transfer your money based on the chosen package price to these sources below</p>
          <ul className="list-inside list-disc">
            {bankAccounts.map((account, key) => (
              <li key={key} className="flex flex-row items-start gap-1">
                <span className="mr-2 text-lg leading-5">•</span>
                <div className="flex items-center gap-1">
                  <p className="font-bold">
                    {account.bank}
                    {": "}
                    <span className="font-normal">{account.number}</span>
                  </p>
                  <p className="">{`(${account.name})`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Total */}
        <div className="items-centerp-2 flex justify-between rounded-lg *:text-2xl">
          <h3 className="font-bold">Total: </h3>
          <span className="font-bold">
            Rp {packageSelection?.price?.idr.toLocaleString()} / $
            {packageSelection?.price?.usd.toLocaleString()}
          </span>
        </div>

        {/* Payment Proof Upload */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-proof">Upload Payment Proof</Label>
            <p className="text-muted-foreground text-sm">
              Please upload a screenshot or photo of your payment receipt (MAX 2MB)
            </p>
          </div>
          <div className="space-y-2">
            <Input
              id="payment-proof"
              type="file"
              accept="image/*"
              onChange={handlePaymentProofUpload}
            />
            {paymentProof && (
              <p className="text-muted-foreground text-sm">Selected file: {paymentProof.name}</p>
            )}
          </div>
        </div>
        {!paymentProof && <p className="text-sm text-red-500">Please upload payment proof</p>}
      </div>
    </div>
  );
};

const ParticipantDataTable = ({
  participants,
  loading,
}: {
  participants: Payment | null;
  loading: boolean;
}) => {
  if (loading) {
    return <p className="animate-pulse">Loading...</p>;
  }

  const members = participants?.team_members;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background border-b *:text-white">
          <TableHead className="w-full first:rounded-tl-lg">Name</TableHead>
          <TableHead className="w-auto text-right whitespace-nowrap last:rounded-tr-lg">
            Payment Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-blue-50">
        {members && members.length > 0 ? (
          members.map((participant, index: number) => (
            <TableRow key={participant.mun_delegate_name} className="border-b border-gray-100">
              <TableCell
                className={cn(
                  "w-full py-3 font-medium text-gray-900",
                  index === members.length - 1 && "first:rounded-bl-lg",
                )}
              >
                {participant.mun_delegate_name}
              </TableCell>
              <TableCell className="w-auto py-3 text-right whitespace-nowrap">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    participant.payment_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : participant.payment_status === "failed"
                        ? "bg-red-100 text-red-800"
                        : participant.payment_status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800",
                  )}
                >
                  {participant.payment_status === "paid"
                    ? "Confirmed"
                    : participant.payment_status === "failed"
                      ? "Rejected"
                      : !participant.package
                        ? "Havent paid"
                        : participant.payment_status === "pending"
                          ? "Waiting for Admin Approval"
                          : "Pending"}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : participants && participants.payment_status ? ( // Handle single participant payment display
          <TableRow className="border-b border-gray-100">
            <TableCell className="w-full py-3 font-medium text-gray-900 first:rounded-bl-lg">
              {participants.mun_delegate_name}
            </TableCell>
            <TableCell className="w-auto py-3 text-right whitespace-nowrap">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  participants.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : participants.payment_status === "failed"
                      ? "bg-red-100 text-red-800"
                      : participants.payment_status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800",
                )}
              >
                {participants.payment_status === "paid"
                  ? "Confirmed"
                  : participants.payment_status === "failed"
                    ? "Rejected"
                    : !participants.package
                      ? "Havent paid"
                      : participants.payment_status === "pending"
                        ? "Waiting for Admin Approval"
                        : "Pending"}
              </span>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow className="border-b bg-red-50">
            <TableCell colSpan={2} className="text-primary py-6 text-center font-medium">
              No approved registration found. Please register first and await approval.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const RegistrationDataTable = ({
  delegates,
  loading,
}: {
  delegates: { participant_data: Delegate[]; team_id: string } | null;
  loading: boolean;
}) => {
  if (loading) {
    return <p className="animate-pulse">Loading...</p>;
  }

  if (!delegates || !delegates.participant_data || delegates.participant_data.length === 0)
    return (
      <p className="text-sm">
        <b>No approved registration found.</b> Register first to proceed with payment.
      </p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background border-b *:text-white">
          <TableHead className="w-full first:rounded-tl-lg">Name</TableHead>
          <TableHead className="w-auto text-right whitespace-nowrap last:rounded-tr-lg">
            Registration Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-blue-50">
        {delegates?.participant_data.map((delegate, index: number) => (
          <TableRow key={delegate.mun_delegate_name} className="border-b border-gray-100">
            <TableCell
              className={cn(
                "w-full py-3 font-medium text-gray-900",
                index === delegates.participant_data.length - 1 && "first:rounded-bl-lg",
              )}
            >
              {delegate.mun_delegate_name}
            </TableCell>
            <TableCell className="w-auto py-3 text-right whitespace-nowrap">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  delegate.confirmed === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : delegate.confirmed === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800",
                )}
              >
                {delegate.confirmed === "confirmed"
                  ? "Approved"
                  : delegate.confirmed === "rejected"
                    ? "Rejected"
                    : "Registration Success, Waiting for Admin Approval"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentPage;
