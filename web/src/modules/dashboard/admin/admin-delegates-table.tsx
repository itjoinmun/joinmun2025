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
import { Check, ChevronDown, ChevronRight, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/helpers/cn";

interface AdminDelegatesTableProps {
  teamsData: TeamDelegateGroup[];
  onDataChange: () => void;
}

const AdminDelegatesTable = ({ teamsData, onDataChange }: AdminDelegatesTableProps) => {
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

  const DelegateRow = ({ delegate }: { delegate: MUNDelegate }) => {
    const [tempCountry, setTempCountry] = useState(delegate.country || "");
    const [tempPairEmail, setTempPairEmail] = useState(delegate.pair || "");
    
    // Helper function to get status display
    const getRegistrationStatus = () => {
      if (delegate.confirmed === "confirmed") {
        return { text: "✓ Approved", color: "text-green-600" };
      } else if (delegate.confirmed === "rejected") {
        return { text: "✗ Rejected", color: "text-red-600" };
      } else {
        return { text: "⏳ Pending", color: "text-yellow-600" };
      }
    };

    const status = getRegistrationStatus();
    
    return (
      <TableRow className="bg-slate-50">
        <TableCell className="pl-8">
          <div className="text-sm">
            <div className="font-medium">{delegate.mun_delegate_name}</div>
            <div className="text-gray-500 text-xs">{delegate.mun_delegate_email}</div>
            <div className="text-xs text-blue-600">{delegate.participant_type}</div>
            {delegate.type === "double_delegate" && delegate.pair && (
              <div className="text-xs text-purple-600 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Paired with: {delegate.pair}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <select
            value={delegate.council || ""}
            onChange={(e) => {
              const council = e.target.value;
              if (council && tempCountry) {
                handleAction(
                  () => updateDelegateCountryAndCouncil(delegate.mun_delegate_email, tempCountry, council),
                  delegate.mun_delegate_email,
                  "assign-council",
                );
              }
            }}
            className="w-full rounded border p-1 text-sm"
            disabled={loading[`assign-council-${delegate.mun_delegate_email}`]}
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
            value={tempCountry}
            onChange={(e) => setTempCountry(e.target.value)}
            onBlur={() => {
              if (tempCountry && delegate.council) {
                handleAction(
                  () => updateDelegateCountryAndCouncil(delegate.mun_delegate_email, tempCountry, delegate.council!),
                  delegate.mun_delegate_email,
                  "assign-country",
                );
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tempCountry && delegate.council) {
                handleAction(
                  () => updateDelegateCountryAndCouncil(delegate.mun_delegate_email, tempCountry, delegate.council!),
                  delegate.mun_delegate_email,
                  "assign-country",
                );
              }
            }}
            placeholder="Enter country"
            className="w-full rounded border p-1 text-sm"
          />
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <input
              type="email"
              value={tempPairEmail}
              onChange={(e) => setTempPairEmail(e.target.value)}
              onBlur={() => {
                if (tempPairEmail && tempPairEmail !== delegate.pair) {
                  handleAction(
                    () => makeDelegatePairing(delegate.mun_delegate_email, tempPairEmail),
                    delegate.mun_delegate_email,
                    "make-pairing",
                  );
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tempPairEmail && tempPairEmail !== delegate.pair) {
                  handleAction(
                    () => makeDelegatePairing(delegate.mun_delegate_email, tempPairEmail),
                    delegate.mun_delegate_email,
                    "make-pairing",
                  );
                }
              }}
              placeholder="Enter pair email"
              className="w-full rounded border p-1 text-sm"
              disabled={loading[`make-pairing-${delegate.mun_delegate_email}`]}
            />
            {delegate.type === "double_delegate" && (
              <div className="text-xs text-green-600">
                ✓ Double Delegate
              </div>
            )}
            {delegate.type === "single_delegate" && (
              <div className="text-xs text-blue-600">
                Single Delegate
              </div>
            )}
          </div>
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
                <Check className="h-3 w-3 text-green-500" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
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
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </div>
            <span className={`text-xs ${status.color}`}>
              {status.text}
            </span>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <Table className="bg-white">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="min-w-[250px]">Team / Delegate</TableHead>
            <TableHead className="min-w-[120px]">Council</TableHead>
            <TableHead className="min-w-[120px]">Country</TableHead>
            <TableHead className="min-w-[150px]">Pairing</TableHead>
            <TableHead className="min-w-[120px]">Registration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamsData.map((team) => {
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
                      {team.delegate_count > 1 ? (
                        isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                      ) : null}
                      <div>
                        <div className="text-base">
                          {team.mun_team_id ? `Team ${team.mun_team_id}` : 'Individual'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Lead: {team.mun_team_lead} | {team.delegate_count} delegate(s)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                  <TableCell className="text-center text-gray-500">-</TableCell>
                </TableRow>

                {/* Delegate Rows */}
                {(isExpanded || team.delegate_count === 1) &&
                  team.delegates.map((delegate) => (
                    <DelegateRow key={delegate.mun_delegate_email} delegate={delegate} />
                  ))
                }
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDelegatesTable;
