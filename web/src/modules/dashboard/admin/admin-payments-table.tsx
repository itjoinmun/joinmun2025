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

interface AdminPaymentsTableProps {
  paymentsData: TeamPaymentSummary[];
  onDataChange: () => void;
}

const AdminPaymentsTable = ({ paymentsData, onDataChange }: AdminPaymentsTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

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

  return (
    <div className="space-y-6">
      {paymentsData.map((team) => {
        const teamKey = team.mun_team_id || `individual-${team.mun_team_lead}`;

        return (
          <div key={teamKey} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Team Header */}
            <div className={cn(
              "px-6 py-4 border-b",
              team.mun_team_id ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-green-50 border-l-4 border-l-green-500"
            )}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.mun_team_id ? `Team ${team.mun_team_id}` : 'Individual Payment'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Team Lead: {team.mun_team_lead} • Total Amount: ${team.total_amount}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span className="text-green-600">Paid: {team.paid_count}</span>
                    <span className="text-yellow-600">Pending: {team.pending_count}</span>
                    <span className="text-red-600">Failed: {team.failed_count}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${team.total_amount}</div>
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
                    <TableRow key={payment.payment_id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">{payment.mun_delegate_email}</div>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {payment.participant_type}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.payment_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}>
                        <div className="space-y-1">
                          <div className="text-xl font-bold text-gray-900">${payment.payment_amount}</div>
                          <div className="text-sm text-gray-600 font-medium">{payment.package}</div>
                        </div>
                      </TableCell>
                      <TableCell className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}>
                        {payment.payment_file ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
                            onClick={() => window.open(payment.payment_file, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View File
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">No file uploaded</span>
                        )}
                      </TableCell>
                      <TableCell className={cn("py-4", index === 0 && "border-t-2 border-t-blue-200")}>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 border-green-200 hover:bg-green-50"
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
                              <Check className="h-3 w-3 text-green-600 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 border-red-200 hover:bg-red-50"
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
                              <X className="h-3 w-3 text-red-600 mr-1" />
                              Reject
                            </Button>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
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
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
          No payments found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsTable;
