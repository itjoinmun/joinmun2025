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

// Types
interface PackageSelection {
  type: "Early Bird" | "Regular" | "Late Bird";
  participantType: "single_delegate" | "team_delegate";
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
  const [selectedAccommodation, setSelectedAccommodation] = useState<"with_accommodation" | "non_accommodation" | null>(
    packageSelection?.accommodationType || null
  );

  const handleAccommodationSelect = (type: "with_accommodation" | "non_accommodation") => {
    setSelectedAccommodation(type);
    
    // Update package selection
    const newSelection: PackageSelection = {
      type: "Early Bird", // Atau ambil dari props
      participantType: "single_delegate", // Atau ambil dari props
      accommodationType: type,
      price: type === "with_accommodation" ? 1500000 : 1000000, // Contoh harga
    };
    
    setPackageSelection(newSelection);
  };

  return (
    <div className="space-y-4">
      {/* Package Card */}
      <PackageCard type="Early Bird" participantType="single_delegate" />
      
      {/* Accommodation Selection */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Choose Accommodation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* With Accommodation */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedAccommodation === "with_accommodation"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleAccommodationSelect("with_accommodation")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">With Accommodation</h4>
                <p className="text-sm text-gray-600">Includes hotel stay</p>
                <p className="text-lg font-bold text-green-600 mt-2">Rp 1,500,000</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedAccommodation === "with_accommodation"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedAccommodation === "with_accommodation" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>

          {/* Non Accommodation */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedAccommodation === "non_accommodation"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleAccommodationSelect("non_accommodation")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Non Accommodation</h4>
                <p className="text-sm text-gray-600">Conference only</p>
                <p className="text-lg font-bold text-green-600 mt-2">Rp 1,000,000</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedAccommodation === "non_accommodation"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedAccommodation === "non_accommodation" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedAccommodation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Selected:</h4>
          <p className="text-sm text-gray-600">
            Early Bird - {selectedAccommodation === "with_accommodation" ? "With Accommodation" : "Non Accommodation"}
          </p>
          <p className="font-bold text-green-600">
            Total: Rp {selectedAccommodation === "with_accommodation" ? "1,500,000" : "1,000,000"}
          </p>
        </div>
      )}
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
      bank: "Bank BCA",
      number: "1234567890",
      name: "JoinMUN 2025",
    },
    {
      bank: "Bank Mandiri",
      number: "0987654321",
      name: "JoinMUN 2025",
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

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    alert("Account number copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      {packageSelection && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Your Selection</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Package:</span> {packageSelection.type}</p>
            <p><span className="font-medium">Type:</span> {packageSelection.participantType.replace('_', ' ')}</p>
            <p><span className="font-medium">Accommodation:</span> {
              packageSelection.accommodationType === "with_accommodation" ? "With Accommodation" : "Non Accommodation"
            }</p>
            <p className="text-lg font-bold text-green-600 mt-2">
              Total: Rp {packageSelection.price?.toLocaleString('id-ID') || '0'}
            </p>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-bold">Payment Summary</h3>
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-bold">
            Rp {packageSelection?.price?.toLocaleString('id-ID') || '0'}
          </span>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Select Bank Account</h3>
        <div className="grid gap-4">
          {bankAccounts.map((account) => (
            <div
              key={account.number}
              className={cn(
                "cursor-pointer rounded-lg border p-4 transition-colors",
                selectedBank === account.number
                  ? "border-blue-500 bg-blue-500/5"
                  : "hover:border-blue-500/50",
              )}
              onClick={() => setSelectedBank(account.number)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{account.bank}</p>
                  <p className="text-gray-600 text-sm">{account.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAccount(account.number);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 font-mono text-lg">{account.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Proof Upload */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="payment-proof">Upload Payment Proof</Label>
          <p className="text-gray-600 text-sm">
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
            <p className="text-gray-600 text-sm">Selected file: {paymentProof.name}</p>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {!selectedBank && (
        <p className="text-red-500 text-sm">Please select a bank account</p>
      )}
      {!paymentProof && (
        <p className="text-red-500 text-sm">Please upload payment proof</p>
      )}
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
      const paymentProofInput = document.getElementById('payment-proof') as HTMLInputElement;
      const selectedBankElement = document.querySelector('.border-blue-500.bg-blue-500\\/5');
      
      if (!selectedBankElement) {
        alert("Please select a bank account");
        return;
      }
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
  const canSubmit = isLastStep ? (
    document.querySelector('.border-blue-500.bg-blue-500\\/5') && 
    (document.getElementById('payment-proof') as HTMLInputElement)?.files?.[0]
  ) : canProceed;

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