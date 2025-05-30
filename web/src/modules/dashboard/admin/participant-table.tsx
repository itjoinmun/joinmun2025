"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { COUNCIL_OPTIONS } from "@/utils/constants/councils";
import type { Participant } from "@/utils/helpers/fetch/delegates/mock-data";
import { DashboardModuleContent } from "@/components/dashboard/dashboard-module";

interface ParticipantTableProps {
  participants: Participant[];
  onApproveRegistration: (id: number) => Promise<void>;
  onRejectRegistration: (id: number) => Promise<void>;
  onApprovePayment: (id: number) => Promise<void>;
  onRejectPayment: (id: number) => Promise<void>;
  onAssignCouncil: (id: number, council: string) => Promise<void>;
  onAssignCountry: (id: number, country: string) => Promise<void>;
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

  const handleAction = async (action: () => Promise<void>, id: number, actionType: string) => {
    try {
      setLoading((prev) => ({ ...prev, [`${actionType}-${id}`]: true }));
      await action();
    } finally {
      setLoading((prev) => ({ ...prev, [`${actionType}-${id}`]: false }));
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
            <TableRow key={participant.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>
                <select
                  name="Council"
                  onChange={(e) =>
                    handleAction(
                      () => onAssignCouncil(participant.id, e.target.value),
                      participant.id,
                      "assign-council",
                    )
                  }
                  value={participant.council || ""}
                  className="w-full rounded border p-1 pr-3"
                  disabled={loading[`assign-council-${participant.id}`]}
                >
                  <option value="">Select Council</option>
                  {COUNCIL_OPTIONS.map((council) => (
                    <option key={council} value={council}>
                      {council}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={participant.country || ""}
                  onChange={(e) => onAssignCountry(participant.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAction(
                        () => onAssignCountry(participant.id, e.currentTarget.value),
                        participant.id,
                        "assign-country",
                      );
                    }
                  }}
                  className="w-full rounded border p-1"
                  placeholder="Enter country and press Enter"
                  disabled={loading[`assign-country-${participant.id}`]}
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
                          () => onApproveRegistration(participant.id),
                          participant.id,
                          "approve-reg",
                        )
                      }
                      disabled={
                        loading[`approve-reg-${participant.id}`] ||
                        participant.registration_status === "approved"
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
                          () => onRejectRegistration(participant.id),
                          participant.id,
                          "reject-reg",
                        )
                      }
                      disabled={
                        loading[`reject-reg-${participant.id}`] ||
                        participant.registration_status === "rejected"
                      }
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-sm">
                    {participant.registration_status === "approved" && "✓ Approved"}
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
                          () => onApprovePayment(participant.id),
                          participant.id,
                          "approve-pay",
                        )
                      }
                      disabled={
                        loading[`approve-pay-${participant.id}`] ||
                        participant.payment_status === "approved"
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
                          () => onRejectPayment(participant.id),
                          participant.id,
                          "reject-pay",
                        )
                      }
                      disabled={
                        loading[`reject-pay-${participant.id}`] ||
                        participant.payment_status === "rejected"
                      }
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-sm">
                    {participant.payment_status === "approved" && "✓ Approved"}
                    {participant.payment_status === "rejected" && "✗ Rejected"}
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
