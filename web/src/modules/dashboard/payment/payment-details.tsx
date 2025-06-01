"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

interface PaymentDetailsProps {
  selectedPrice: string;
  onBack: () => void;
  onSubmit: (file: File) => void;
}

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

const PaymentDetails = ({ selectedPrice, onBack, onSubmit }: PaymentDetailsProps) => {
  const [paymentProof, setPaymentProof] = useState<File>();
  const [selectedBank, setSelectedBank] = useState<string>();

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

  const handleSubmit = () => {
    if (!selectedBank) {
      alert("Please select a bank account");
      return;
    }
    if (!paymentProof) {
      alert("Please upload payment proof");
      return;
    }
    onSubmit(paymentProof);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Payment Summary */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-bold">Payment Summary</h3>
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-bold">Rp {selectedPrice}</span>
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

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!paymentProof || !selectedBank}>
          Submit Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;