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
import { Check, ChevronDown, ChevronRight, ExternalLink, X } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

interface AdminPaymentsTableProps {
  paymentsData: TeamPaymentSummary[];
  onDataChange: () => void;
}

const AdminPaymentsTable = ({ paymentsData, onDataChange }: AdminPaymentsTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

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

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const getPaymentStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
        return { text: "✓ Paid", color: "text-green-600" };
      case "failed":
        return { text: "✗ Failed", color: "text-red-600" };
      case "pending":
      default:
        return { text: "⏳ Pending", color: "text-yellow-600" };
    }
  };

  return (
    <div className="space-y-4">
      <Table className="bg-white">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="min-w-[250px]">Team / Payment</TableHead>
            <TableHead className="min-w-[120px]">Amount</TableHead>
            <TableHead className="min-w-[120px]">Package</TableHead>
            <TableHead className="min-w-[120px]">File</TableHead>
            <TableHead className="min-w-[150px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentsData.map((team) => {
            const teamKey = team.mun_team_id || `individual-${team.mun_team_lead}`;
            const isExpanded = expandedTeams.has(teamKey);

            return (
              <React.Fragment key={teamKey}>
                {/* Team Header Row */}
                <TableRow
                  className={cn(
                    "bg-slate-200 cursor-pointer hover:bg-slate-300",
                    team.mun_team_id ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-green-500"
                  )}
                  onClick={() => toggleTeamExpansion(teamKey)}
                >
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      {team.payment_count > 1 ? (
                        isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                      ) : null}
                      <div>
                        <div className="text-base">
                          {team.mun_team_id ? `Team ${team.mun_team_id}` : 'Individual'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Lead: {team.mun_team_lead} | {team.payment_count} payment(s) | Total: ${team.total_amount}
                        </div>
                        <div className="text-xs text-gray-500">
                          Paid: {team.paid_count} | Pending: {team.pending_count} | Failed: {team.failed_count}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-500">${team.total_amount}</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                </TableRow>

                {/* Payment Rows */}
                {(isExpanded || team.payment_count === 1) &&
                  team.team_payments.map((payment) => {
                    const statusDisplay = getPaymentStatusDisplay(payment.payment_status);
                    
                    return (
                      <TableRow key={payment.payment_id} className="bg-slate-50">
                        <TableCell className="pl-8">
                          <div className="text-sm">
                            <div className="font-medium">{payment.mun_delegate_email}</div>
                            <div className="text-xs text-blue-600">{payment.participant_type}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">${payment.payment_amount}</TableCell>
                        <TableCell className="text-center">{payment.package}</TableCell>
                        <TableCell className="text-center">
                          {payment.payment_file && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(payment.payment_file, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
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
                                <Check className="h-3 w-3 text-green-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
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
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                            <span className={`text-xs ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPaymentsTable;
