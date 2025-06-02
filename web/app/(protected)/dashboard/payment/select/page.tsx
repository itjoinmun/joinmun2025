"use client";
import { DashboardModule, DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PackageCard from "@/modules/dashboard/payment/package-card";
import { ChevronLeft, Copy } from "lucide-react";
import ParticipantData from "@/modules/dashboard/payment/payment-participant-data";
import { Suspense, useState, createContext, useContext } from "react";
import { FormStatusProvider, useFormStatus } from "@/utils/hooks/use-form-status";
import { cn } from "@/utils/helpers/cn";
import PaymentPackageCard from "@/modules/dashboard/payment/package-card";

// Types
interface PackageSelection {
  type: "Early Bird" | "Regular" | "Late";
  participantType: "single_delegate" | "team_delegation" | "observer" | "advisor";
  accommodationType: "with_accommodation" | "non_accommodation";
  price?: number;
}

// Context untuk sharing data antar steps
const PaymentContext = createContext<{
  packageSelection: PackageSelection | null;
  setPackageSelection: (selection: PackageSelection) => void;
}>({
  packageSelection: null,
  setPackageSelection: () => {},
});

const PackageSelectionPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>

      {/* <Suspense fallback={<div>Loading participant data...</div>}>
        <ParticipantData />
      </Suspense> */}

      <Suspense fallback={<div>Loading Payment Details...</div>}>
        <FormStatusProvider>
          <Payment />
        </FormStatusProvider>
      </Suspense>
    </DashboardPage>
  );
};

export default PackageSelectionPage;

const Payment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageSelection, setPackageSelection] = useState<PackageSelection | null>(null);
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

  const handleSubmit = (paymentFile?: File) => {
    // Handle final submission logic here
    console.log("Form submitted with selection:", packageSelection);
    console.log("Payment proof file:", paymentFile);
  };

  const renderStepContent = () => {
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
            <PaymentDetailsStep onSubmit={handleSubmit} />
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
          {renderStepContent()}
          <PaymentNav
            currentStep={currentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isLastStep={currentStep >= TOTAL_STEPS}
            isFirstStep={currentStep <= 1}
            canProceed={!!packageSelection} // Bisa proceed kalau sudah pilih package
          />
        </DashboardModuleContent>
      </DashboardModule>
    </PaymentContext.Provider>
  );
};

// Step 1: Package Selection
const PackageSelectionStep = () => {
  const { packageSelection, setPackageSelection } = useContext(PaymentContext);

  // Only allow valid values
  const type: "Early Bird" | "Regular" | "Late" =
    packageSelection?.type === "Early Bird" ||
    packageSelection?.type === "Regular" ||
    packageSelection?.type === "Late"
      ? packageSelection.type
      : "Early Bird";
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
const PaymentDetailsStep = ({ onSubmit }: { onSubmit: (file?: File) => void }) => {
  const { packageSelection } = useContext(PaymentContext);
  const [paymentProof, setPaymentProof] = useState<File>();
  const [selectedBank, setSelectedBank] = useState<string>();

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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
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
          type={packageSelection?.type || "Early Bird"}
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

interface PaymentNavProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (file?: File) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  canProceed?: boolean;
}

const PaymentNav = ({
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  isLastStep,
  isFirstStep,
  canProceed = true,
}: PaymentNavProps) => {
  const { submitting, setSubmitting } = useFormStatus();
  const { packageSelection } = useContext(PaymentContext);

  const handleNextClick = () => {
    if (isLastStep) {
      // Validation untuk step terakhir
      const paymentProofInput = document.getElementById("payment-proof") as HTMLInputElement;

      if (!paymentProofInput?.files?.[0]) {
        alert("Please upload payment proof");
        return;
      }

      setSubmitting(true);
      onSubmit(paymentProofInput.files[0]);
      // Reset submitting state after submission
      setTimeout(() => setSubmitting(false), 2000);
    } else {
      onNext();
    }
  };

  // Untuk step terakhir, cek apakah form sudah lengkap
  const canSubmit = isLastStep
    ? document.querySelector(".border-blue-500.bg-blue-500\\/5") &&
      (document.getElementById("payment-proof") as HTMLInputElement)?.files?.[0]
    : canProceed;

  return (
    <>
      <div className="bg-background border-gray-light fixed inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-3 p-2 md:absolute md:right-8 md:bottom-8 md:left-auto md:rounded-xs md:border md:shadow-md">
        <Button
          type="button"
          variant={"outline"}
          disabled={isFirstStep}
          onClick={onPrevious}
          className="bg-gray-light/40 hover:bg-gray-light/60 border border-white"
        >
          <ChevronLeft />
          Previous
        </Button>

        <Button
          type="button"
          disabled={submitting || (isLastStep ? false : !canProceed)}
          variant={"primary"}
          className="cursor-pointer"
          onClick={handleNextClick}
        >
          {isLastStep ? (
            submitting ? (
              <>Submitting...</>
            ) : (
              <>Submit Payment</>
            )
          ) : (
            <>
              Next
              <ChevronLeft className="rotate-180" />
            </>
          )}
        </Button>
      </div>
      <div className="h-8 w-full md:hidden" />
    </>
  );
};
