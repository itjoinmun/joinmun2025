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
import { TeamPositionPaperGroup } from "@/utils/types/admin";
import { ExternalLink } from "lucide-react";
import { cn } from "@/utils/helpers/cn";

interface AdminPositionPapersTableProps {
  papersData: TeamPositionPaperGroup[] | null;
}

const AdminPositionPapersTable = ({ papersData }: AdminPositionPapersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!papersData || papersData.length === 0) {
    return (
      <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
        No papers found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {papersData?.map((teamGroup, teamIndex) => (
        <div
          key={`${teamGroup.mun_team_id || "individual"}-${teamIndex}`}
          className="overflow-hidden rounded-lg border bg-white shadow-sm"
        >
          {/* Team Header */}
          <div
            className={cn(
              "border-b px-6 py-4",
              teamGroup.mun_team_id
                ? "border-l-4 border-l-blue-500 bg-blue-50"
                : "border-l-4 border-l-green-500 bg-green-50",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {teamGroup.mun_team_id
                    ? `Team ${teamGroup.mun_team_id}`
                    : "Individual Submission"}
                </h3>
                <p className="mt-1 text-sm text-gray-600">Team Lead: {teamGroup.mun_team_lead}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{teamGroup.paper_count}</div>
                <div className="text-sm text-gray-500">paper(s)</div>
              </div>
            </div>
          </div>

          {/* Position Papers Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/3 min-w-[200px] font-semibold text-gray-700">
                    Delegate Email
                  </TableHead>
                  <TableHead className="w-1/4 min-w-[150px] font-semibold text-gray-700">
                    Submission Date
                  </TableHead>
                  <TableHead className="w-1/6 min-w-[100px] font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="w-1/4 min-w-[120px] font-semibold text-gray-700">
                    File
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamGroup.position_papers.map((paper, paperIndex) => (
                  <TableRow
                    key={`${paper.mun_delegate_email}-${paperIndex}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell
                      className={cn(
                        "w-1/3 min-w-[200px] py-4",
                        paperIndex === 0 && "border-t-2 border-t-blue-200",
                      )}
                    >
                      <div className="text-sm font-semibold break-all text-gray-900">
                        {paper.mun_delegate_email}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "w-1/4 min-w-[150px] py-4",
                        paperIndex === 0 && "border-t-2 border-t-blue-200",
                      )}
                    >
                      <div className="text-sm text-gray-700">
                        {new Date(paper.submission_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "w-1/6 min-w-[100px] py-4",
                        paperIndex === 0 && "border-t-2 border-t-blue-200",
                      )}
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(paper.submission_status)}`}
                      >
                        {paper.submission_status.charAt(0).toUpperCase() +
                          paper.submission_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "w-1/4 min-w-[120px] py-4",
                        paperIndex === 0 && "border-t-2 border-t-blue-200",
                      )}
                    >
                      {paper.submission_file ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-full border-blue-200 px-2 text-xs text-white hover:bg-blue-50 hover:text-black"
                          onClick={() => window.open(paper.submission_file, "_blank")}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Paper
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">No file uploaded</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPositionPapersTable;
