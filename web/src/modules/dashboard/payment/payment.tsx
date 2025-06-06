import { PaymentContext } from "./payment-context";
import { useContext, useState, useEffect } from "react";
import { PackageSelection } from "./payment-context";
import { DashboardModule, DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentPackageCard from "./package-card";
import PaymentNav from "./payment-nav";
import { submitPayment, getDelegates, Delegate } from "@/utils/helpers/fetch/delegates/delegates";
import { paymentStorage } from "@/utils/storage/indexeddb";

// Custom hook for fetching delegate data
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

const Payment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageSelection, setPackageSelection] = useState<PackageSelection | null>(null);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const TOTAL_STEPS = 2;

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

    const paymentData = {
      package: packageString,
      payment_amount: packageSelection.price || 0,
    };

    try {
      // Store in IndexedDB first for offline support
      const storageId = await paymentStorage.storePayment({
        ...paymentData,
        payment_file: paymentFile,
        timestamp: Date.now(),
        status: "pending",
      });

      // Submit to backend
      const result = await submitPayment(paymentData, paymentFile);

      // Update storage status on success
      await paymentStorage.updatePaymentStatus(storageId, "submitted");

      setSubmitSuccess(true);
      console.log("Payment submitted successfully:", result);
    } catch (error) {
      console.error("Payment submission failed:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit payment");

      // Try to store locally on failure
      try {
        await paymentStorage.storePayment({
          ...paymentData,
          payment_file: paymentFile,
          timestamp: Date.now(),
          status: "failed",
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
          <h2 className="text-xl font-bold text-green-700">Payment Submitted Successfully!</h2>
          <p className="text-center text-gray-600">
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

  return (
    <PaymentContext.Provider value={{ packageSelection, setPackageSelection }}>
      <DashboardModule>
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
}) => {
  const { delegates, loading, error } = useDelegatesApprovalStatus();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading approval status...</p>
      </div>
    );
  }

  if (error) {
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
        <p className="text-center text-gray-600">{error}</p>
      </div>
    );
  }

  if (!delegates || !delegates.participant_data || delegates.participant_data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-yellow-100 p-3">
          <svg
            className="h-8 w-8 text-yellow-600"
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
        <h2 className="text-xl font-bold text-yellow-700">No Registration Found</h2>
        <p className="text-center text-gray-600">
          You haven&apos;t registered yet. Please register first before proceeding with payment.
        </p>
      </div>
    );
  }

  const hasRejected = delegates.participant_data.some(
    (delegate) => delegate.confirmed === "rejected",
  );
  const allConfirmed = delegates.participant_data.every(
    (delegate) => delegate.confirmed === "confirmed",
  );

  if (hasRejected) {
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-700">Registration Rejected</h2>
        <p className="text-center text-gray-600">
          One or more of your delegates have been rejected. Please contact the admin for more
          information.
        </p>
      </div>
    );
  }

  if (!allConfirmed) {
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
        <h2 className="text-xl font-bold text-blue-700">Approval Pending</h2>
        <p className="text-center text-gray-600">
          You are not fully approved yet. Please wait for admin approval before proceeding with
          payment.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Delegate Status:</p>
          <ul className="mt-2 space-y-1">
            {delegates.participant_data.map((delegate, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    delegate.confirmed === "confirmed"
                      ? "bg-green-500"
                      : delegate.confirmed === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                ></span>
                <span>
                  {delegate.mun_delegate_name}:{" "}
                  {delegate.confirmed === "confirmed"
                    ? "Confirmed"
                    : delegate.confirmed === "rejected"
                      ? "Rejected"
                      : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // All delegates are confirmed, show normal payment flow
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

  // Only allow valid values
  const type: "EarlyBird" | "Regular" | "Late" =
    packageSelection?.type === "EarlyBird" ||
    packageSelection?.type === "Regular" ||
    packageSelection?.type === "Late"
      ? packageSelection.type
      : "EarlyBird";
  const participantType: "single_delegate" | "team_delegation" | "observer" | "advisor" =
    packageSelection?.participantType === "single_delegate" ||
    packageSelection?.participantType === "team_delegation" ||
    packageSelection?.participantType === "observer" ||
    packageSelection?.participantType === "advisor"
      ? packageSelection.participantType
      : "single_delegate";
  const selectedType =
    packageSelection?.accommodationType === "with_accommodation"
      ? "accommodation"
      : packageSelection?.accommodationType === "non_accommodation"
        ? "nonAccommodation"
        : undefined;

  // Handler for PaymentPackageCard selection
  const handleSelect = (accomType: "accommodation" | "nonAccommodation", price: string) => {
    setPackageSelection({
      type,
      participantType,
      accommodationType: accomType === "accommodation" ? "with_accommodation" : "non_accommodation",
      price: Number(price.replace(/[^0-9]/g, "")),
    });
  };

  return (
    <div className="flex justify-center">
      <PaymentPackageCard
        type={type}
        participantType={participantType}
        onSelect={handleSelect}
        selectedType={selectedType}
      />
    </div>
  );
};

// Step 2: Payment Details (Fixed component)
const PaymentDetailsStep = () => {
  const { packageSelection } = useContext(PaymentContext);
  const [paymentProof, setPaymentProof] = useState<File>();

  const bankAccounts = [
    {
      bank: "BCA",
      number: "1234567890",
      name: "Arthur",
    },
    {
      bank: "Mandiri",
      number: "0987654321",
      name: "Vale",
    },
    {
      bank: "Mandiri",
      number: "0987654321",
      name: "Vale",
    },
    {
      bank: "Mandiri",
      number: "0987654321",
      name: "Vale",
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
          type={packageSelection?.type || "EarlyBird"}
          participantType={packageSelection?.participantType || "single_delegate"}
          onSelect={() => {}}
          selectedType={
            packageSelection?.accommodationType === "with_accommodation"
              ? "accommodation"
              : packageSelection?.accommodationType === "non_accommodation"
                ? "nonAccommodation"
                : undefined
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
            Rp {packageSelection?.price?.toLocaleString("id-ID") || "0"}
          </span>
        </div>

        {/* Payment Proof Upload */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-proof">Upload Payment Proof</Label>
            <p className="text-sm text-gray-600">
              Please upload a screenshot or photo of your payment receipt
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
              <p className="text-sm text-gray-600">Selected file: {paymentProof.name}</p>
            )}
          </div>
        </div>
        {!paymentProof && <p className="text-sm text-red-500">Please upload payment proof</p>}
      </div>
    </div>
  );
};

export default Payment;
