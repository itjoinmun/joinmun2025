"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PaymentNavProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
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
  const handleNextClick = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <>
      <div className="bg-background border-gray-light fixed inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-3 p-4 md:absolute md:right-8 md:bottom-8 md:left-auto md:w-auto md:grid-cols-2 md:rounded-lg md:border md:shadow-md">
        {isFirstStep ? (
          <Button
            type="button"
            variant="outline"
            disabled
            className="bg-gray-light/40 hover:bg-gray-light/60 border border-gray-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="bg-gray-light/40 hover:bg-gray-light/60 border border-gray-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        )}

        <Button
          type="button"
          variant="default"
          onClick={handleNextClick}
          disabled={!canProceed}
          className={` ${isLastStep ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} ${!canProceed ? "cursor-not-allowed opacity-50" : "cursor-pointer"} `}
        >
          {isLastStep ? (
            <>Submit Payment</>
          ) : (
            <>
              Next
              <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
            </>
          )}
        </Button>
      </div>

      {/* Spacer for mobile fixed navigation */}
      <div className="h-20 w-full md:hidden" />
    </>
  );
};

export default PaymentNav;
