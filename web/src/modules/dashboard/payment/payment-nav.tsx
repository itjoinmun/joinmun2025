import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useContext } from "react";
import { PaymentContext } from "./payment-context";
import { useFormStatus } from "@/utils/hooks/use-form-status";

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

export default PaymentNav;
