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

interface AdminPositionPapersTableProps {
  papersData: TeamPositionPaperGroup[];
}

const AdminPositionPapersTable = ({ papersData }: AdminPositionPapersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'submitted': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-4">
      {papersData.map((teamGroup, teamIndex) => (
        <div key={`${teamGroup.mun_team_id || 'individual'}-${teamIndex}`} className="border rounded-lg">
          {/* Team Header */}
          <div className="bg-slate-100 p-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {teamGroup.mun_team_id ? `Team ${teamGroup.mun_team_id}` : 'Individual Submission'}
                </h3>
                <p className="text-sm text-gray-600">
                  Lead: {teamGroup.mun_team_lead}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {teamGroup.paper_count} paper(s)
                </div>
              </div>
            </div>
          </div>

          {/* Position Papers Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delegate Email</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamGroup.position_papers.map((paper, paperIndex) => (
                <TableRow key={`${paper.mun_delegate_email}-${paperIndex}`}>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {paper.mun_delegate_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(paper.submission_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${getStatusColor(paper.submission_status)}`}>
                      {paper.submission_status.charAt(0).toUpperCase() + paper.submission_status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {paper.submission_file ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(paper.submission_file, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Paper
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      
      {papersData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No position papers found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdminPositionPapersTable;
