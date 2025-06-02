import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { cn } from "@/utils/helpers/cn";
import PaymentPackageCard from "./package-card";
import { PaymentContext } from "./payment-context";

interface PaymentDetailsProps {
  onSubmit: (file?: File) => void;
}

const PaymentDetails = ({ onSubmit }: PaymentDetailsProps) => {
  const { packageSelection, setPackageSelection } = useContext(PaymentContext);
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
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
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

  // Handler for updating package selection from PaymentPackageCard
  const handlePackageChange = (type: "accommodation" | "nonAccommodation", price: string) => {
    if (!packageSelection) return;
    setPackageSelection({
      ...packageSelection,
      accommodationType: type === "accommodation" ? "with_accommodation" : "non_accommodation",
      price: Number(price.replace(/[^0-9]/g, "")),
    });
  };

  return (
    <div className="space-y-6">
      {packageSelection && (
        <div className="mb-6">
          <PaymentPackageCard
            type={packageSelection.type}
            participantType={packageSelection.participantType}
            onSelect={handlePackageChange}
            selectedType={
              packageSelection.accommodationType === "with_accommodation"
                ? "accommodation"
                : "nonAccommodation"
            }
          />
        </div>
      )}
      {packageSelection && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-800">Your Selection</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Package:</span> {packageSelection.type}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {packageSelection.participantType.replace("_", " ")}
            </p>
            <p>
              <span className="font-medium">Accommodation:</span>{" "}
              {packageSelection.accommodationType === "with_accommodation"
                ? "With Accommodation"
                : "Non Accommodation"}
            </p>
            <p className="mt-2 text-lg font-bold text-green-600">
              Total: Rp {packageSelection.price?.toLocaleString("id-ID") || "0"}
            </p>
          </div>
        </div>
      )}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-bold">Payment Summary</h3>
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-bold">
            Rp {packageSelection?.price?.toLocaleString("id-ID") || "0"}
          </span>
        </div>
      </div>
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
                  <p className="text-sm text-gray-600">{account.name}</p>
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
      {!selectedBank && <p className="text-sm text-red-500">Please select a bank account</p>}
      {!paymentProof && <p className="text-sm text-red-500">Please upload payment proof</p>}
    </div>
  );
};

export default PaymentDetails;
