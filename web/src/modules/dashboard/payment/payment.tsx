"use client";

import { DashboardModule, DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCurrentPaymentPhase } from "@/utils/helpers/registration-wave";
import { useState } from "react";
import PackageCard from "./package-card";
import PaymentDetails from "./payment-details";
import PaymentNav from "./payment-nav";

type PaymentStep = "package" | "payment";
type AccommodationType = "accommodation" | "nonAccommodation";
type PackageType = "Early Bird" | "Regular" | "Late";
type ParticipantType = "single_delegate" | "team_delegation" | "observer" | "advisor";

const Payment = () => {
  const currentPhase = (getCurrentPaymentPhase() as PackageType) || "Early Bird";
  const [currentStep, setCurrentStep] = useState<PaymentStep>("package");
  const [selectedPackageType, setSelectedPackageType] = useState<AccommodationType | undefined>(
    undefined,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePackageSelect = (type: AccommodationType, price: string) => {
    setSelectedPackageType(type);
    setSelectedPrice(price);
  };

  const handleNext = () => {
    if (currentStep === "package") {
      if (!selectedPackageType || !selectedPrice) {
        alert("Please select a package first");
        return;
      }
      setCurrentStep("payment");
    }
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("package");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === "payment") {
      setShowModal(true);
    } else {
      handleNext();
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // TODO: Implement payment submission logic
      alert("Payment submitted successfully");
      setShowModal(false);
    } catch (error) {
      alert("Failed to submit payment");
    }
  };

  return (
    <DashboardModule>
      <DashboardModuleContent className="no-scrollbar">
        <p className="mb-6 text-2xl font-bold">Payment</p>

        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-8">
            <PaymentNav
              currentStep={currentStep === "package" ? 0 : 1}
              onNext={handleNext}
              onPrevious={handleBack}
              onSubmit={() => handleFormSubmit({ preventDefault: () => {} } as React.FormEvent)}
              isFirstStep={currentStep === "package"}
              isLastStep={currentStep === "payment"}
              canProceed={currentStep === "package" ? !!selectedPackageType : true}
            />

            {currentStep === "package" ? (
              <div className="flex justify-center">
                <PackageCard
                  type={currentPhase}
                  participantType="single_delegate"
                  onSelect={handlePackageSelect}
                  selectedType={selectedPackageType}
                />
              </div>
            ) : (
              <PaymentDetails
                selectedPrice={selectedPrice!}
                onBack={handleBack}
                onSubmit={(file) => {
                  // TODO: Handle file upload
                  console.log("File uploaded:", file);
                  setShowModal(true);
                }}
              />
            )}
          </div>

          <div className="mt-8 flex justify-between">
            {currentStep === "payment" && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              {currentStep === "package" ? "Next" : "Submit Payment"}
            </Button>
          </div>
        </form>
      </DashboardModuleContent>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to complete the payment?</p>
            <p className="text-muted-foreground mt-2 text-sm">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentComplete}>Complete Payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardModule>
  );
};

export default Payment;
