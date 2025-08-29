"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamPaymentSummary } from "@/utils/types/admin";
import { approvePayment, rejectPayment } from "@/utils/helpers/fetch/admin/admin";
import { Check, ExternalLink, X } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

interface PaymentData {
  payment_id?: string | number;
  mun_delegate_email: string;
  mun_team_id?: string | null;
  package?: string;
  payment_file?: string;
  payment_status?: string;
  payment_date?: string;
  payment_amount?: number;
  participant_type?: string;
}

interface AdminPaymentsTableProps {
  paymentsData: PaymentData[] | TeamPaymentSummary[];
  onDataChange: () => void;
}

const AdminPaymentsTable = ({ paymentsData, onDataChange }: AdminPaymentsTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Function to convert flat payment array to team groupings
  const convertToTeamSummaries = (flatPayments: PaymentData[]): TeamPaymentSummary[] => {
    const teamGroups: { [key: string]: PaymentData[] } = {};

    // Group payments by team
    flatPayments.forEach((payment) => {
      const teamKey = payment.mun_team_id || `individual-${payment.mun_delegate_email}`;
      if (!teamGroups[teamKey]) {
        teamGroups[teamKey] = [];
      }
      teamGroups[teamKey].push(payment);
    });

    // Convert to TeamPaymentSummary format
    return Object.entries(teamGroups).map(([teamKey, payments]) => {
      const firstPayment = payments[0];
      const isIndividual = teamKey.startsWith("individual-");

      return {
        mun_team_id: isIndividual ? null : teamKey,
        mun_team_lead: firstPayment.mun_delegate_email,
        team_payments: payments.map((p) => ({
          payment_id: String(p.payment_id || ""),
          mun_delegate_email: p.mun_delegate_email,
          mun_team_id: p.mun_team_id,
          package: p.package || "",
          payment_file: p.payment_file || "",
          payment_status: (p.payment_status as "pending" | "paid" | "failed") || "pending",
          payment_date: p.payment_date || "",
          payment_amount: p.payment_amount || 0,
          participant_type: p.participant_type || "",
        })),
        total_amount: payments.reduce((sum, p) => sum + (Number(p.payment_amount) || 0), 0),
        payment_count: payments.length,
        pending_count: payments.filter((p) => p.payment_status === "pending").length,
        paid_count: payments.filter((p) => p.payment_status === "paid").length,
        failed_count: payments.filter((p) => p.payment_status === "failed").length,
      };
    });
  };

  // Determine if data is flat array or already team summaries
  const teamSummaries: TeamPaymentSummary[] = (() => {
    if (!paymentsData || paymentsData.length === 0) return [];

    // Check if first item has team_payments property (TeamPaymentSummary format)
    const firstItem = paymentsData[0];
    if ("team_payments" in firstItem) {
      return paymentsData as TeamPaymentSummary[];
    } else {
      // Convert flat array to team summaries
      return convertToTeamSummaries(paymentsData as PaymentData[]);
    }
  })();

  const handleAction = async (
    action: () => Promise<void>,
    identifier: string,
    actionType: string,
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [`${actionType}-${identifier}`]: true }));
      await action();
      onDataChange();
    } catch (error) {
      console.error(`Error with ${actionType}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [`${actionType}-${identifier}`]: false }));
    }
  };

  const getPaymentStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
        return { text: "Paid", color: "bg-green-100 text-green-800" };
      case "failed":
        return { text: "Failed", color: "bg-red-100 text-red-800" };
      case "pending":
      default:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
    }
  };

  if (teamSummaries.length === 0) {
    return (
      <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
        No payments found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {teamSummaries.map((team) => {
        const teamKey = team.mun_team_id || `individual-${team.mun_team_lead}`;

        return (
          <div key={teamKey} className="overflow-hidden rounded-lg border bg-white shadow-sm">
            {/* Team Header */}
            <div
              className={cn(
                "border-b px-6 py-4",
                team.mun_team_id
                  ? "border-l-4 border-l-blue-500 bg-blue-50"
                  : "border-l-4 border-l-green-500 bg-green-50",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.mun_team_id ? `Team ${team.mun_team_id}` : "Individual Payment"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Team Lead: {team.mun_team_lead} • Total Amount: IDR{" "}
                    {team.total_amount.toLocaleString("en-US")}
                  </p>
                  <div className="mt-1 flex gap-4 text-xs text-gray-500">
                    <span className="text-green-600">Paid: {team.paid_count}</span>
                    <span className="text-yellow-600">Pending: {team.pending_count}</span>
                    <span className="text-red-600">Failed: {team.failed_count}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    IDR {team.total_amount.toLocaleString("en-US")}
                  </div>
                  <div className="text-sm text-gray-500">{team.payment_count} payment(s)</div>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Payment Information</TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount & Package</TableHead>
                  <TableHead className="font-semibold text-gray-700">File</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.team_payments.map((payment, index) => {
                  const statusDisplay = getPaymentStatusDisplay(payment.payment_status);

                  return (
                    <TableRow
                      key={payment.payment_id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <TableCell
                        className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {payment.mun_delegate_email}
                          </div>
                          <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {payment.participant_type}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.payment_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}
                      >
                        <div className="space-y-1">
                          <div className="text-xl font-bold text-gray-900">
                            IDR {payment.payment_amount.toLocaleString("en-US")}
                          </div>
                          <div className="text-sm font-medium text-gray-600">{payment.package}</div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}
                      >
                        {payment.payment_file ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2 border-blue-200 text-white hover:bg-blue-50 hover:text-black"
                            onClick={() => window.open(payment.payment_file, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View File
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-400">No file uploaded</span>
                        )}
                      </TableCell>
                      <TableCell
                        className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}
                      >
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-200 px-3 text-white hover:bg-green-50 hover:text-black"
                              onClick={() =>
                                handleAction(
                                  () => approvePayment(payment.mun_delegate_email),
                                  payment.mun_delegate_email,
                                  "approve-payment",
                                )
                              }
                              disabled={
                                loading[`approve-payment-${payment.mun_delegate_email}`] ||
                                payment.payment_status === "paid"
                              }
                            >
                              <Check className="mr-1 h-3 w-3 text-green-600" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-red-200 px-3 text-white hover:bg-red-50 hover:text-black"
                              onClick={() =>
                                handleAction(
                                  () => rejectPayment(payment.mun_delegate_email),
                                  payment.mun_delegate_email,
                                  "reject-payment",
                                )
                              }
                              disabled={
                                loading[`reject-payment-${payment.mun_delegate_email}`] ||
                                payment.payment_status === "failed"
                              }
                            >
                              <X className="mr-1 h-3 w-3 text-red-600" />
                              Reject
                            </Button>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusDisplay.color}`}
                          >
                            {statusDisplay.text}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}

      {paymentsData.length === 0 && (
        <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
          No payments found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsTable;
