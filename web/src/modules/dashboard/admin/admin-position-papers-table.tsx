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
  papersData: TeamPositionPaperGroup[];
}

const AdminPositionPapersTable = ({ papersData }: AdminPositionPapersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {papersData.map((teamGroup, teamIndex) => (
        <div key={`${teamGroup.mun_team_id || 'individual'}-${teamIndex}`} className="border rounded-lg overflow-hidden bg-white shadow-sm">
          {/* Team Header */}
          <div className={cn(
            "px-6 py-4 border-b",
            teamGroup.mun_team_id ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-green-50 border-l-4 border-l-green-500"
          )}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {teamGroup.mun_team_id ? `Team ${teamGroup.mun_team_id}` : 'Individual Submission'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Team Lead: {teamGroup.mun_team_lead}
                </p>
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
                  <TableHead className="font-semibold text-gray-700 w-1/3 min-w-[200px]">Delegate Email</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[150px]">Submission Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-1/6 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-1/4 min-w-[120px]">File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamGroup.position_papers.map((paper, paperIndex) => (
                  <TableRow key={`${paper.mun_delegate_email}-${paperIndex}`} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className={cn("py-4 w-1/3 min-w-[200px]", paperIndex === 0 && "border-t-2 border-t-blue-200")}>
                      <div className="font-semibold text-gray-900 text-sm break-all">
                        {paper.mun_delegate_email}
                      </div>
                    </TableCell>
                    <TableCell className={cn("py-4 w-1/4 min-w-[150px]", paperIndex === 0 && "border-t-2 border-t-blue-200")}>
                      <div className="text-sm text-gray-700">
                        {new Date(paper.submission_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className={cn("py-4 w-1/6 min-w-[100px]", paperIndex === 0 && "border-t-2 border-t-blue-200")}>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.submission_status)}`}>
                        {paper.submission_status.charAt(0).toUpperCase() + paper.submission_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className={cn("py-4 w-1/4 min-w-[120px]", paperIndex === 0 && "border-t-2 border-t-blue-200")}>
                      {paper.submission_file ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs border-blue-200 hover:bg-blue-50 w-full"
                          onClick={() => window.open(paper.submission_file, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Paper
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">No file uploaded</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
      
      {papersData.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
          No position papers found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminPositionPapersTable;
