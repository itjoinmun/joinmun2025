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
import { Check, Download, X, ChevronDown, ChevronRight } from "lucide-react";
import { DashboardModuleContent } from "@/components/dashboard/dashboard-module";
import { downloadResponses } from "@/utils/helpers/fetch/delegates/delegates";
import { TeamDelegateGroup, MUNDelegate } from "@/utils/types/delegate-registration";
import { cn } from "@/utils/helpers/cn";

// Add council options
const COUNCIL_OPTIONS = [
  "UN Women",
  "WHO", 
  "ECOFIN",
  "UNSC",
  "Crisis",
  "BRICS+",
  "Press"
];

const COUNTRY_OPTIONS = [
  "United States",
  "United Kingdom", 
  "China",
  "Russia",
  "France",
  "Germany",
  "Japan",
  "India",
  "Brazil",
  "South Africa"
];

interface TeamDelegateTableProps {
  teamsData: TeamDelegateGroup[];
  onApproveRegistration: (email: string) => Promise<void>;
  onRejectRegistration: (email: string) => Promise<void>;
  onApprovePayment: (email: string) => Promise<void>;
  onRejectPayment: (email: string) => Promise<void>;
  onAssignCouncilAndCountry: (email: string, council: string, country: string) => Promise<void>;
}

const TeamDelegateTable = ({
  teamsData,
  onApproveRegistration,
  onRejectRegistration,
  onApprovePayment,
  onRejectPayment,
  onAssignCouncilAndCountry,
}: TeamDelegateTableProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const handleAction = async (
    action: () => Promise<void>,
    email: string,
    actionType: string,
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [`${actionType}-${email}`]: true }));
      await action();
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error(`Error with ${actionType}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [`${actionType}-${email}`]: false }));
    }
  };

  const handleDownloadResponses = async () => {
    try {
      setLoading((prev) => ({ ...prev, download: true }));
      const responses = await downloadResponses();
      if (responses) {
        console.log("Responses:", responses);
      }
    } catch (error) {
      console.error("Error downloading responses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, download: false }));
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

  const getStatusBadge = (confirmed: boolean, confirmedDate: string) => {
    if (confirmed && confirmedDate !== "0001-01-01T00:00:00Z") {
      return <span className="text-green-600 text-sm">✓ Approved</span>;
    }
    return <span className="text-yellow-600 text-sm">⏳ Pending</span>;
  };

  const DelegateRow = ({ delegate }: { delegate: MUNDelegate }) => (
    <TableRow className="bg-slate-100">
      <TableCell className="pl-8">
        <div className="text-sm">
          <div className="font-medium">{delegate.mun_delegate_name}</div>
          <div className="text-gray-500">{delegate.mun_delegate_email}</div>
          <div className="text-xs text-blue-600">{delegate.participant_type}</div>
        </div>
      </TableCell>
      <TableCell>
        <select
          name="council"
          onChange={(e) => {
            const council = e.target.value;
            if (council) {
              // For now, set country same as council - you can modify this logic
              handleAction(
                () => onAssignCouncilAndCountry(delegate.mun_delegate_email, council, "TBD"),
                delegate.mun_delegate_email,
                "assign-council",
              );
            }
          }}
          value={delegate.council || ""}
          className="w-full rounded border p-1 text-sm"
          disabled={loading[`assign-council-${delegate.mun_delegate_email}`]}
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
          value={delegate.country || ""}
          placeholder="Enter country"
          className="w-full rounded border p-1 text-sm"
          onBlur={(e) => {
            const country = e.target.value;
            if (country && delegate.council) {
              handleAction(
                () => onAssignCouncilAndCountry(delegate.mun_delegate_email, delegate.council!, country),
                delegate.mun_delegate_email,
                "assign-country",
              );
            }
          }}
        />
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
                  () => onApproveRegistration(delegate.mun_delegate_email),
                  delegate.mun_delegate_email,
                  "approve-reg",
                )
              }
              disabled={
                loading[`approve-reg-${delegate.mun_delegate_email}`] ||
                delegate.confirmed
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
                  () => onRejectRegistration(delegate.mun_delegate_email),
                  delegate.mun_delegate_email,
                  "reject-reg",
                )
              }
              disabled={loading[`reject-reg-${delegate.mun_delegate_email}`]}
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          </div>
          {getStatusBadge(delegate.confirmed, delegate.confirmed_date)}
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
                  () => onApprovePayment(delegate.mun_delegate_email),
                  delegate.mun_delegate_email,
                  "approve-pay",
                )
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
                  () => onRejectPayment(delegate.mun_delegate_email),
                  delegate.mun_delegate_email,
                  "reject-pay",
                )
              }
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          </div>
          <span className="text-sm text-yellow-600">⏳ Pending</span>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <DashboardModuleContent className="max-h-[86.7dvh] overflow-scroll">
      <div className="flex justify-between mb-4">
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={handleDownloadResponses}
          disabled={loading.download}
        >
          <Download className="h-4 w-4" /> 
          {loading.download ? "Downloading..." : "Download Responses"}
        </Button>
        <div className="text-sm text-gray-600">
          Total Teams: {teamsData.length} | 
          Total Delegates: {teamsData.reduce((acc, team) => acc + team.delegate_count, 0)}
        </div>
      </div>
      
      <div className="text-xs text-amber-600 mb-4">
        Note: Response files are only valid for 8 hours after download.
      </div>

      <Table className="bg-white">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="min-w-[250px]">Team / Delegate</TableHead>
            <TableHead className="min-w-[120px]">Council</TableHead>
            <TableHead className="min-w-[120px]">Country</TableHead>
            <TableHead className="min-w-[120px]">Registration</TableHead>
            <TableHead className="min-w-[120px]">Payment</TableHead>
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
    </DashboardModuleContent>
  );
};

export default TeamDelegateTable;
