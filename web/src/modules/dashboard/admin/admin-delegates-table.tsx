"use client";
import React from "react";
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
import { TeamDelegateGroup, MUNDelegate, DelegateType } from "@/utils/types/admin";
import { 
  approveParticipantRegistration, 
  rejectParticipantRegistration,
  updateDelegateCountryAndCouncil,
  makeDelegatePairing
} from "@/utils/helpers/fetch/admin/admin";
import { Check, Users, X } from "lucide-react";
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
    const [tempCountry, setTempCountry] = useState(delegate.country || "");
    const [tempCouncil, setTempCouncil] = useState(delegate.council || "");
    const [tempPairEmail, setTempPairEmail] = useState(delegate.pair || "");
    
    const getRegistrationStatus = () => {
      if (delegate.confirmed === "confirmed") {
        return { text: "Approved", color: "bg-green-100 text-green-800" };
      } else if (delegate.confirmed === "rejected") {
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      } else {
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      }
    };

    const status = getRegistrationStatus();
    
    return (
      <TableRow className="hover:bg-gray-50 border-b border-gray-100">
        <TableCell className={cn("py-4 w-1/4 min-w-[200px]", isFirst && "border-t-2 border-t-blue-200")}>
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-sm">{delegate.mun_delegate_name}</div>
            <div className="text-xs text-gray-600 break-all">{delegate.mun_delegate_email}</div>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {delegate.participant_type}
            </div>
            {delegate.type === "double_delegate" && delegate.pair && (
              <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                <Users className="h-3 w-3" />
                <span className="break-all">Paired: {delegate.pair}</span>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className={cn("py-4 w-1/4 min-w-[180px]", isFirst && "border-t-2 border-t-blue-200")}>
          <div className="space-y-2">
            <select
              value={tempCouncil}
              onChange={(e) => setTempCouncil(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading[`assign-council-${delegate.mun_delegate_email}`]}
            >
              <option value="">Select Council</option>
              {COUNCILS.map((council) => (
                <option key={council.slug} value={council.slug}>
                  {council.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={tempCountry}
              onChange={(e) => setTempCountry(e.target.value)}
              placeholder="Enter country"
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading[`assign-council-${delegate.mun_delegate_email}`]}
            />
            <Button
              size="sm"
              variant="default"
              className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (tempCountry && tempCouncil) {
                  handleAction(
                    () => updateDelegateCountryAndCouncil(delegate.mun_delegate_email, tempCountry, tempCouncil),
                    delegate.mun_delegate_email,
                    "assign-council",
                  );
                }
              }}
              disabled={
                loading[`assign-council-${delegate.mun_delegate_email}`] ||
                !tempCountry ||
                !tempCouncil
              }
            >
              {loading[`assign-council-${delegate.mun_delegate_email}`] ? "Assigning..." : "Assign"}
            </Button>
            {delegate.country && delegate.council && (
              <div className="text-xs text-gray-600 p-1 bg-gray-50 rounded">
                <div>Council: {delegate.council}</div>
                <div>Country: {delegate.country}</div>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className={cn("py-4 w-1/4 min-w-[180px]", isFirst && "border-t-2 border-t-blue-200")}>
          <div className="space-y-2">
            <input
              type="email"
              value={tempPairEmail}
              onChange={(e) => setTempPairEmail(e.target.value)}
              placeholder="Enter pair email"
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading[`make-pairing-${delegate.mun_delegate_email}`]}
            />
            <Button
              size="sm"
              variant="default"
              className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                if (tempPairEmail && tempPairEmail !== delegate.pair) {
                  handleAction(
                    () => makeDelegatePairing(delegate.mun_delegate_email, tempPairEmail),
                    delegate.mun_delegate_email,
                    "make-pairing",
                  );
                }
              }}
              disabled={
                loading[`make-pairing-${delegate.mun_delegate_email}`] ||
                !tempPairEmail ||
                tempPairEmail === delegate.pair
              }
            >
              {loading[`make-pairing-${delegate.mun_delegate_email}`] ? "Pairing..." : "Pair"}
            </Button>
            <div className="space-y-1">
              {delegate.type === "double_delegate" && (
                <div className="text-xs text-green-600 font-medium bg-green-50 p-1 rounded">
                  ✓ Double Delegate
                </div>
              )}
              {delegate.type === "single_delegate" && (
                <div className="text-xs text-blue-600 font-medium bg-blue-50 p-1 rounded">
                  Single Delegate
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className={cn("py-4 w-1/4 min-w-[160px]", isFirst && "border-t-2 border-t-blue-200")}>
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs border-green-200 hover:bg-green-50 w-full"
                onClick={() =>
                  handleAction(
                    () => approveParticipantRegistration(delegate.mun_delegate_email),
                    delegate.mun_delegate_email,
                    "approve-reg",
                  )
                }
                disabled={
                  loading[`approve-reg-${delegate.mun_delegate_email}`] ||
                  delegate.confirmed === "confirmed" 
                }
              >
                <Check className="h-3 w-3 text-green-600 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs border-red-200 hover:bg-red-50 w-full"
                onClick={() =>
                  handleAction(
                    () => rejectParticipantRegistration(delegate.mun_delegate_email),
                    delegate.mun_delegate_email,
                    "reject-reg",
                  )
                }
                disabled={
                  loading[`reject-reg-${delegate.mun_delegate_email}`] ||
                  delegate.confirmed === "rejected"
                }
              >
                <X className="h-3 w-3 text-red-600 mr-1" />
                Reject
              </Button>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color} w-full justify-center`}>
              {status.text}
            </span>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      {teamsData.map((team) => {
        const teamKey = team.mun_team_id || `individual-${team.mun_team_lead}`;

        return (
          <div key={teamKey} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Team Header */}
            <div className={cn(
              "px-6 py-4 border-b",
              team.mun_team_id ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-green-50 border-l-4 border-l-green-500"
            )}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.mun_team_id ? `Team ${team.mun_team_id}` : 'Individual Registration'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Team Lead: {team.mun_team_lead} • {team.delegate_count} delegate(s)
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center",
                  team.mun_team_id ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                )}>
                  {team.mun_team_id ? "Team" : "Individual"}
                </div>
              </div>
            </div>

            {/* Delegates Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[200px]">Delegate Information</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[180px]">Council & Country</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[180px]">Pairing</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[160px]">Registration Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.delegates.map((delegate, index) => (
                    <DelegateRow key={delegate.mun_delegate_email} delegate={delegate} isFirst={index === 0} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
      
      {teamsData.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
          No delegates found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminDelegatesTable;
