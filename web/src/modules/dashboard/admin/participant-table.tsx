"use client";
import { DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COUNCILS } from "@/utils/helpers/councils";
import { Participant } from "@/utils/helpers/fetch/delegates/delegates";
import { Check, Download, X } from "lucide-react";
import { useState } from "react";

interface ParticipantTableProps {
  participants: Participant[];
  onApproveRegistration: (email: string) => Promise<void>;
  onRejectRegistration: (email: string) => Promise<void>;
  onApprovePayment: (email: string) => Promise<void>;
  onRejectPayment: (email: string) => Promise<void>;
  onAssignCouncil: (email: string, council: string) => Promise<void>;
  onAssignCountry: (email: string, country: string) => Promise<void>;
}

const ParticipantTable = ({
  participants,
  onApproveRegistration,
  onRejectRegistration,
  onApprovePayment,
  onRejectPayment,
  onAssignCouncil,
  onAssignCountry,
}: ParticipantTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (action: () => Promise<void>, email: string, actionType: string) => {
    try {
      setLoading((prev) => ({ ...prev, [`${actionType}-${email}`]: true }));
      await action();
    } finally {
      setLoading((prev) => ({ ...prev, [`${actionType}-${email}`]: false }));
    }
  };

  return (
    <DashboardModuleContent className="max-h-[86.7dvh] overflow-scroll">
      <div className="flex justify-between">
        <Button variant="warning" className="flex items-center gap-2">
          <Download /> Download Responses
        </Button>
        <h1 className="mb-5">
          Notes: Images from Reponses only valid for 8 hours since the responses downlaoded.
        </h1>
      </div>
      <Table className="bg-neutral-400">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-12">No</TableHead>
            <TableHead className="min-w-[200px]">Nama</TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Council</TableHead>
            <TableHead className="min-w-[100px]">Country</TableHead>
            <TableHead className="min-w-[100px]">Registration</TableHead>
            <TableHead className="min-w-[100px]">Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-300">
          {participants.map((participant, index) => (
            <TableRow key={participant.email}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>
                <select
                  name="Council"
                  onChange={(e) =>
                    handleAction(
                      () => onAssignCouncil(participant.email, e.target.value),
                      participant.email,
                      "assign-council",
                    )
                  }
                  value={participant.council || ""}
                  className="w-full rounded border p-1 pr-3"
                  disabled={loading[`assign-council-${participant.email}`]}
                >
                  <option value="">Select Council</option>
                  {COUNCILS.map((council) => (
                    <option key={council.slug} value={council.slug}>
                      {council.name}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={participant.country || ""}
                  onChange={(e) => onAssignCountry(participant.email, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAction(
                        () => onAssignCountry(participant.email, e.currentTarget.value),
                        participant.email,
                        "assign-country",
                      );
                    }
                  }}
                  className="w-full rounded border p-1"
                  placeholder="Enter country and press Enter"
                  disabled={loading[`assign-country-${participant.email}`]}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleAction(
                          () => onApproveRegistration(participant.email),
                          participant.email,
                          "approve-reg",
                        )
                      }
                      disabled={
                        loading[`approve-reg-${participant.email}`] ||
                        participant.registration_status === "confirmed"
                      }
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleAction(
                          () => onRejectRegistration(participant.email),
                          participant.email,
                          "reject-reg",
                        )
                      }
                      disabled={
                        loading[`reject-reg-${participant.email}`] ||
                        participant.registration_status === "rejected"
                      }
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-sm">
                    {participant.registration_status === "confirmed" && "✓ Approved"}
                    {participant.registration_status === "rejected" && "✗ Rejected"}
                    {!participant.registration_status && "Pending"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleAction(
                          () => onApprovePayment(participant.email),
                          participant.email,
                          "approve-pay",
                        )
                      }
                      disabled={
                        loading[`approve-pay-${participant.email}`] ||
                        participant.payment_status === "paid"
                      }
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleAction(
                          () => onRejectPayment(participant.email),
                          participant.email,
                          "reject-pay",
                        )
                      }
                      disabled={
                        loading[`reject-pay-${participant.email}`] ||
                        participant.payment_status === "failed"
                      }
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-sm">
                    {participant.payment_status === "paid" && "✓ Approved"}
                    {participant.payment_status === "failed" && "✗ Rejected"}
                    {!participant.payment_status && "Pending"}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardModuleContent>
  );
};

export default ParticipantTable;
