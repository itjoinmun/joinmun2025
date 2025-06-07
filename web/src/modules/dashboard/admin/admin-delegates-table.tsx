"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COUNCILS } from "@/utils/helpers/councils";
import { TeamDelegateGroup, MUNDelegate } from "@/utils/types/admin";
import {
  approveParticipantRegistration,
  rejectParticipantRegistration,
  updateDelegateCountryAndCouncil,
  makeDelegatePairing,
} from "@/utils/helpers/fetch/admin/admin";
import { Check, Users, X, ChevronDown, MoreVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/helpers/cn";

interface AdminDelegatesTableProps {
  teamsData: TeamDelegateGroup[];
  onDataChange: () => void;
}

const AdminDelegatesTable = ({ teamsData, onDataChange }: AdminDelegatesTableProps) => {
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

  const DelegateRow = ({ delegate, isFirst }: { delegate: MUNDelegate; isFirst: boolean }) => {
    const [tempCountry, setTempCountry] = useState(delegate?.country || "");
    const [tempCouncil, setTempCouncil] = useState(delegate?.council || "");
    const [tempPairEmail, setTempPairEmail] = useState(delegate?.pair || "");

    const isConfirmed = delegate?.confirmed === "confirmed";
    const isPending = delegate?.confirmed !== "confirmed" && delegate?.confirmed !== "rejected";
    const isRejected = delegate?.confirmed === "rejected";

    // Add null check for delegate
    if (!delegate) {
      return null;
    }

    return (
      <TableRow className="border-b border-gray-100 hover:bg-gray-50">
        <TableCell
          className={cn("w-1/4 min-w-[200px] py-4", isFirst && "border-t-2 border-t-blue-200")}
        >
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-900">{delegate?.mun_delegate_name || 'N/A'}</div>
            <div className="text-xs break-all text-gray-600">{delegate?.mun_delegate_email || 'N/A'}</div>
            <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {delegate?.participant_type || 'N/A'}
            </div>
            {delegate?.type === "double_delegate" && delegate?.pair && (
              <div className="mt-1 flex items-center gap-1 text-xs text-purple-600">
                <Users className="h-3 w-3" />
                <span className="break-all">Paired: {delegate.pair}</span>
              </div>
            )}
          </div>
        </TableCell>

        {/* Council & Country Column - Only show for confirmed delegates */}
        <TableCell
          className={cn("w-1/4 min-w-[180px] py-4", isFirst && "border-t-2 border-t-blue-200")}
        >
          {isConfirmed ? (
            <div className="space-y-2">
              <select
                value={tempCouncil}
                onChange={(e) => setTempCouncil(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading[`assign-council-${delegate?.mun_delegate_email || ''}`]}
              >
                <option value="">Select Council</option>
                {COUNCILS?.map((council) => (
                  <option key={council?.slug} value={council?.name}>
                    {council?.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={tempCountry}
                onChange={(e) => setTempCountry(e.target.value)}
                placeholder="Enter country"
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading[`assign-council-${delegate?.mun_delegate_email || ''}`]}
              />
              <Button
                size="sm"
                variant="default"
                className="h-7 w-full bg-blue-600 text-xs hover:bg-blue-700"
                onClick={() => {
                  if (tempCountry && tempCouncil && delegate?.mun_delegate_email) {
                    handleAction(
                      () =>
                        updateDelegateCountryAndCouncil(
                          delegate.mun_delegate_email,
                          tempCountry,
                          tempCouncil,
                        ),
                      delegate.mun_delegate_email,
                      "assign-council",
                    );
                  }
                }}
                disabled={
                  loading[`assign-council-${delegate?.mun_delegate_email || ''}`] ||
                  !tempCountry ||
                  !tempCouncil ||
                  !delegate?.mun_delegate_email
                }
              >
                {loading[`assign-council-${delegate?.mun_delegate_email || ''}`] ? "Assigning..." : "Assign"}
              </Button>
              {delegate?.country && delegate?.council && (
                <div className="rounded bg-gray-50 p-1 text-xs text-gray-600">
                  <div>Council: {delegate.council}</div>
                  <div>Country: {delegate.country}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              {isRejected ? "Registration Rejected" : "Awaiting Approval"}
            </div>
          )}
        </TableCell>

        {/* Pairing Column - Only show for confirmed delegates */}
        <TableCell
          className={cn("w-1/4 min-w-[180px] py-4", isFirst && "border-t-2 border-t-blue-200")}
        >
          {isConfirmed ? (
            <div className="space-y-2">
              <input
                type="email"
                value={tempPairEmail}
                onChange={(e) => setTempPairEmail(e.target.value)}
                placeholder="Enter pair email"
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading[`make-pairing-${delegate?.mun_delegate_email || ''}`]}
              />
              <Button
                size="sm"
                variant="default"
                className="h-7 w-full bg-purple-600 text-xs hover:bg-purple-700"
                onClick={() => {
                  if (tempPairEmail && tempPairEmail !== delegate?.pair && delegate?.mun_delegate_email) {
                    handleAction(
                      () => makeDelegatePairing(delegate.mun_delegate_email, tempPairEmail),
                      delegate.mun_delegate_email,
                      "make-pairing",
                    );
                  }
                }}
                disabled={
                  loading[`make-pairing-${delegate?.mun_delegate_email || ''}`] ||
                  !tempPairEmail ||
                  tempPairEmail === delegate?.pair ||
                  !delegate?.mun_delegate_email
                }
              >
                {loading[`make-pairing-${delegate?.mun_delegate_email || ''}`] ? "Pairing..." : "Pair"}
              </Button>
              <div className="space-y-1">
                {delegate?.type === "double_delegate" && (
                  <div className="rounded bg-green-50 p-1 text-xs font-medium text-green-600">
                    ✓ Double Delegate  
                  </div>
                )}
                {delegate?.type === "single_delegate" && (
                  <div className="rounded bg-blue-50 p-1 text-xs font-medium text-blue-600">
                    Single Delegate
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              {isRejected ? "Registration Rejected" : "Awaiting Approval"}
            </div>
          )}
        </TableCell>

        {/* Registration Status Column */}
        <TableCell
          className={cn("w-1/4 min-w-[160px] py-4", isFirst && "border-t-2 border-t-blue-200")}
        >
          <div className="space-y-3">
            {/* Show approval/rejection buttons only for pending delegates */}
            {isPending && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full justify-between text-xs"
                    disabled={!delegate?.mun_delegate_email}
                  >
                    <span>Actions</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      if (delegate?.mun_delegate_email) {
                        handleAction(
                          () => approveParticipantRegistration(delegate.mun_delegate_email),
                          delegate.mun_delegate_email,
                          "approve-reg",
                        );
                      }
                    }}
                    disabled={
                      loading[`approve-reg-${delegate?.mun_delegate_email || ''}`] ||
                      !delegate?.mun_delegate_email
                    }
                    className="cursor-pointer text-green-700 focus:bg-green-50 focus:text-green-800"
                  >
                    <Check className="mr-2 h-3 w-3" />
                    {loading[`approve-reg-${delegate?.mun_delegate_email || ''}`] ? "Approving..." : "Approve"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (delegate?.mun_delegate_email) {
                        handleAction(
                          () => rejectParticipantRegistration(delegate.mun_delegate_email),
                          delegate.mun_delegate_email,
                          "reject-reg",
                        );
                      }
                    }}
                    disabled={
                      loading[`reject-reg-${delegate?.mun_delegate_email || ''}`] ||
                      !delegate?.mun_delegate_email
                    }
                    className="cursor-pointer text-red-700 focus:bg-red-50 focus:text-red-800"
                  >
                    <X className="mr-2 h-3 w-3" />
                    {loading[`reject-reg-${delegate?.mun_delegate_email || ''}`] ? "Rejecting..." : "Reject"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Status badge */}
            <div
              className={`inline-flex w-full items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium ${
                isConfirmed 
                  ? "bg-green-100 text-green-800" 
                  : isRejected 
                  ? "bg-red-100 text-red-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isConfirmed ? "Approved" : isRejected ? "Rejected" : "Pending"}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      {teamsData?.map((team) => {
        const teamKey = team?.mun_team_id || `individual-${team?.mun_team_lead}`;

        return (
          <div key={teamKey} className="overflow-hidden rounded-lg border bg-white shadow-sm">
            {/* Team Header */}
            <div
              className={cn(
                "border-b px-6 py-4",
                team?.mun_team_id
                  ? "border-l-4 border-l-blue-500 bg-blue-50"
                  : "border-l-4 border-l-green-500 bg-green-50",
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team?.mun_team_id ? `Team ${team.mun_team_id}` : "Individual Registration"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Team Lead: {team?.mun_team_lead || 'N/A'} • {team?.delegate_count || 0} delegate(s)
                  </p>
                </div>
                <div
                  className={cn(
                    "self-start rounded-full px-3 py-1 text-sm font-medium sm:self-center",
                    team?.mun_team_id ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
                  )}
                >
                  {team?.mun_team_id ? "Team" : "Individual"}
                </div>
              </div>
            </div>

            {/* Delegates Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-1/4 min-w-[200px] font-semibold text-gray-700">
                      Delegate Information
                    </TableHead>
                    <TableHead className="w-1/4 min-w-[180px] font-semibold text-gray-700">
                      Council & Country
                    </TableHead>
                    <TableHead className="w-1/4 min-w-[180px] font-semibold text-gray-700">
                      Pairing
                    </TableHead>
                    <TableHead className="w-1/4 min-w-[160px] font-semibold text-gray-700">
                      Registration Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team?.delegates?.map((delegate, index) => (
                    <DelegateRow
                      key={delegate?.mun_delegate_email || index}
                      delegate={delegate}
                      isFirst={index === 0}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      }) || []}

      {(!teamsData || teamsData.length === 0) && (
        <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
          No delegates found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminDelegatesTable;