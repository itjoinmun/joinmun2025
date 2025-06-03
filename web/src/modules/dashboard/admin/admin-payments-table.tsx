"use client";
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
import { approvePayment } from "@/utils/helpers/fetch/admin/admin";
import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AdminPaymentsTableProps {
  paymentsData: TeamPaymentSummary[];
  onDataChange: () => void;
}

const AdminPaymentsTable = ({ paymentsData, onDataChange }: AdminPaymentsTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleApprovePayment = async (delegateEmail: string) => {
    try {
      setLoading((prev) => ({ ...prev, [`approve-${delegateEmail}`]: true }));
      await approvePayment(delegateEmail);
      onDataChange();
    } catch (error) {
      console.error('Error approving payment:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [`approve-${delegateEmail}`]: false }));
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-4">
      {paymentsData.map((teamSummary, teamIndex) => (
        <div key={`${teamSummary.mun_team_id || 'individual'}-${teamIndex}`} className="border rounded-lg">
          {/* Team Header */}
          <div className="bg-slate-100 p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {teamSummary.mun_team_id ? `Team ${teamSummary.mun_team_id}` : 'Individual Payment'}
                </h3>
                <p className="text-sm text-gray-600">
                  Lead: {teamSummary.mun_team_lead}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {formatAmount(teamSummary.total_amount)}
                </div>
                <div className="text-sm text-gray-600">
                  {teamSummary.payment_count} payment(s) • 
                  <span className="text-green-600 ml-1">{teamSummary.paid_count} paid</span> • 
                  <span className="text-yellow-600 ml-1">{teamSummary.pending_count} pending</span>
                  {teamSummary.failed_count > 0 && (
                    <span className="text-red-600 ml-1">• {teamSummary.failed_count} failed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delegate</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamSummary.team_payments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>
                    <div className="text-sm">
                      <div>{payment.mun_delegate_email}</div>
                      <div className="text-xs text-gray-500">{payment.participant_type}</div>
                    </div>
                  </TableCell>
                  <TableCell>{payment.package}</TableCell>
                  <TableCell>{formatAmount(payment.payment_amount)}</TableCell>
                  <TableCell>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${getStatusColor(payment.payment_status)}`}>
                      {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.payment_file ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => window.open(payment.payment_file, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => handleApprovePayment(payment.mun_delegate_email)}
                      disabled={
                        loading[`approve-${payment.mun_delegate_email}`] ||
                        payment.payment_status === 'paid'
                      }
                    >
                      <Check className="h-3 w-3 text-green-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      
      {paymentsData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No payment data found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsTable;
