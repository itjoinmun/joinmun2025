import { Button } from "@/components/ui/button";
import { useFormStatus } from "@/utils/hooks/use-form-status";
import { ChevronLeft } from "lucide-react";

interface PaymentNavProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (file: File) => Promise<void>;
  isLastStep: boolean;
  isFirstStep: boolean;
  canProceed?: boolean;
  submitError?: string;
}

const PaymentNav = ({
  onNext,
  onPrevious,
  onSubmit,
  isLastStep,
  isFirstStep,
  canProceed = true,
  submitError,
}: PaymentNavProps) => {
  const { submitting, setSubmitting } = useFormStatus();

  const handleNextClick = async () => {
    if (isLastStep) {
      const paymentProofInput = document.getElementById("payment-proof") as HTMLInputElement;

      if (!paymentProofInput?.files?.[0]) {
        alert("Please upload payment proof");
        return;
      }

      setSubmitting(true);
      try {
        await onSubmit(paymentProofInput.files[0]);
      } catch (error) {
        console.error("Payment submission failed:", error);
      } finally {
        setSubmitting(false);
      }
    } else {
      onNext();
    }
  };

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
      {submitError && (
        <div className="fixed inset-x-0 bottom-20 z-20 mx-4 rounded bg-red-100 p-3 text-red-700 md:absolute md:bottom-24 md:right-8 md:left-auto md:mx-0">
          {submitError}
        </div>
      )}
      <div className="h-8 w-full md:hidden" />
    </>
  );
};

export default PaymentNav;
