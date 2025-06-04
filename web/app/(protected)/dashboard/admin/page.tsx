"use client";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getDelegatesByTeam,
  getPaymentsByTeam,
  getPositionPapersByTeam,
  downloadResponsesCSV,
} from "@/utils/helpers/fetch/admin/admin";
import {
  TeamDelegateGroup,
  TeamPaymentSummary,
  TeamPositionPaperGroup,
  DelegateType,
  TimeWave,
} from "@/utils/types/admin";
import AdminDelegatesTable from "@/modules/dashboard/admin/admin-delegates-table";
import AdminPaymentsTable from "@/modules/dashboard/admin/admin-payments-table";
import AdminPositionPapersTable from "@/modules/dashboard/admin/admin-position-papers-table";

const DELEGATE_TYPES: { value: DelegateType; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "single_delegate", label: "Single Delegate" },
  { value: "team_delegate", label: "Team Delegate" },
  { value: "faculty_advisor", label: "Faculty Advisor" },
  { value: "observer", label: "Observer" },
];

const TIME_WAVES: { value: TimeWave; label: string }[] = [
  { value: "", label: "All Waves" },
  { value: "earlybird", label: "Early Bird" },
  { value: "regularwave", label: "Regular Wave" },
  { value: "latewave", label: "Late Wave" },
];

const DashboardAdmin = () => {
  const [delegateType, setDelegateType] = useState<DelegateType>("");
  const [timeWave, setTimeWave] = useState<TimeWave>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'delegates' | 'payments' | 'papers'>('delegates');

  // Data states
  const [delegatesData, setDelegatesData] = useState<TeamDelegateGroup[]>([]);
  const [paymentsData, setPaymentsData] = useState<TeamPaymentSummary[]>([]);
  const [positionPapersData, setPositionPapersData] = useState<TeamPositionPaperGroup[]>([]);

  // Totals for pagination
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  
  const fetchDelegates = async () => {
    try {
      setLoading(true);
      const response = await getDelegatesByTeam(
        delegateType,
        timeWave,
        itemsPerPage,
        currentPage * itemsPerPage
      );
      setDelegatesData(response.delegates_by_team);
      setTotalTeams(response.total_teams);
    } catch (error) {
      console.error("Error fetching delegates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPaymentsByTeam(
        delegateType,
        timeWave,
        itemsPerPage,
        currentPage * itemsPerPage
      );
      // Convert the payments_by_team object to array
      const paymentsArray = Object.values(response.payments_by_team).flat();
      setPaymentsData(paymentsArray);
      setTotalPayments(response.total_payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositionPapers = async () => {
    try {
      setLoading(true);
      const response = await getPositionPapersByTeam(
        timeWave,
        itemsPerPage,
        currentPage * itemsPerPage
      );
      setPositionPapersData(response.papers_by_team);
      setTotalPapers(response.total_teams);
    } catch (error) {
      console.error("Error fetching position papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setLoading(true);
      await downloadResponsesCSV(delegateType, 1000, 0);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchDelegates();
  }, [delegateType, timeWave, currentPage]);

  useEffect(() => {
    fetchPayments();
  }, [delegateType, timeWave, currentPage]);

  useEffect(() => {
    fetchPositionPapers();
  }, [timeWave, currentPage]);

  const handleDataChange = () => {
    fetchDelegates();
    fetchPayments();
  };

  const totalPages = Math.ceil(Math.max(totalTeams, totalPayments, totalPapers) / itemsPerPage);

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Admin Dashboard</DashboardPageTitle>
      </DashboardPageHeader>

      <DashboardModule>
        <DashboardModuleHeader>
          <div className="flex justify-between items-center w-full">
            <DashboardModuleTitle>Administration</DashboardModuleTitle>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={handleDownloadCSV}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              {loading ? "Downloading..." : "Download All Responses CSV"}
            </Button>
          </div>
        </DashboardModuleHeader>

        <DashboardModuleContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              value={delegateType}
              onChange={(e) => setDelegateType(e.target.value as DelegateType)}
              className="h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {DELEGATE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={timeWave}
              onChange={(e) => setTimeWave(e.target.value as TimeWave)}
              className="h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIME_WAVES.map((wave) => (
                <option key={wave.value} value={wave.value}>
                  {wave.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div className="text-xs text-amber-600 mb-4 p-2 bg-amber-50 rounded border border-amber-200">
            ⚠️ Note: Response files are only valid for 8 hours after download.
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('delegates')}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'delegates'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Delegates ({delegatesData?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Payments ({paymentsData?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('papers')}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'papers'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Position Papers ({positionPapersData?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-[70vh] overflow-auto">
            {activeTab === 'delegates' && (
              <AdminDelegatesTable
                teamsData={delegatesData}
                onDataChange={handleDataChange}
              />
            )}

            {activeTab === 'payments' && (
              <AdminPaymentsTable
                paymentsData={paymentsData}
                onDataChange={handleDataChange}
              />
            )}

            {activeTab === 'papers' && (
              <AdminPositionPapersTable
                papersData={positionPapersData}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 p-4 bg-gray-50 rounded-lg">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0 || loading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600 px-4">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1 || loading}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DashboardAdmin;
