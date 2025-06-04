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
import { AlertCircle, Download, ChevronDown } from "lucide-react";
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
import { Heading } from "@/components/Layout/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const DELEGATE_TYPES: { value: DelegateType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "single_delegate", label: "Single Delegate" },
  { value: "team_delegate", label: "Delegation Team" },
  { value: "faculty_advisor", label: "Faculty Advisor" },
  { value: "observer", label: "Observer" },
];

const TIME_WAVES: { value: TimeWave; label: string }[] = [
  { value: "all", label: "All Waves" },
  { value: "earlybird", label: "Early Bird" },
  { value: "regular", label: "Regular" },
  { value: "late", label: "Late" },
];

const DashboardAdmin = () => {
  const [delegateType, setDelegateType] = useState<DelegateType>("all");
  const [timeWave, setTimeWave] = useState<TimeWave>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"delegates" | "payments" | "papers">("delegates");

  // Data states
  const [delegatesData, setDelegatesData] = useState<TeamDelegateGroup[]>([]);
  const [paymentsData, setPaymentsData] = useState<TeamPaymentSummary[]>([]);
  const [positionPapersData, setPositionPapersData] = useState<TeamPositionPaperGroup[]>([]);

  // Totals for pagination
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);

  // Function to ensure active tab is visible
  const scrollActiveTabIntoView = (tabId: string) => {
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  // Update active tab and ensure it's visible
  const handleTabChange = (tab: "delegates" | "payments" | "papers") => {
    setActiveTab(tab);
    setTimeout(() => scrollActiveTabIntoView(`tab-${tab}`), 100);
  };

  const fetchDelegates = async () => {
    try {
      setLoading(true);
      const response = await getDelegatesByTeam(
        delegateType,
        timeWave,
        itemsPerPage,
        currentPage * itemsPerPage,
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
        currentPage * itemsPerPage,
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
        currentPage * itemsPerPage,
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
      <DashboardModule>
        <DashboardModuleHeader>
          <div className="mb-2 flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
            {/* <DashboardModuleTitle> */}
            <Heading className="hidden sm:block">Dashboard Admin</Heading>
            {/* </DashboardModuleTitle> */}
            <Button
              variant="warning"
              className="flex w-fit items-center gap-2 self-end sm:self-auto"
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
          <div className="xs:flex-row mb-6 flex flex-col gap-4">
            <Select
              value={delegateType}
              onValueChange={(value: string) => setDelegateType(value as DelegateType)}
            >
              <SelectTrigger className="text-background w-full bg-white sm:w-48">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {DELEGATE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={timeWave}
              onValueChange={(value: string) => setTimeWave(value as TimeWave)}
            >
              <SelectTrigger className="text-background w-full bg-white sm:w-48">
                <SelectValue placeholder="Select Wave" />
              </SelectTrigger>
              <SelectContent>
                {TIME_WAVES.map((wave) => (
                  <SelectItem key={wave.value} value={wave.value}>
                    {wave.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="mb-4 flex w-fit flex-col items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-600 sm:flex-row sm:gap-2">
            <div className="flex gap-2 self-start sm:items-center sm:self-auto">
              <AlertCircle className="h-5 w-5" />
              Note:
            </div>
            <p className="text-pretty">Response files are only valid for 8 hours after download.</p>
          </div>

          {/* Tab Navigation */}
          <h3>Choose one out of three</h3>
          <div className="bg-muted mb-4 flex w-full space-x-1 overflow-x-auto rounded-lg p-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:w-fit [&::-webkit-scrollbar]:hidden">
            <button
              id="tab-delegates"
              onClick={() => handleTabChange("delegates")}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "delegates"
                  ? "bg-background text-white shadow-sm"
                  : "text-muted-foreground hover:text-background"
              }`}
            >
              Delegates ({delegatesData?.length || 0})
            </button>
            <button
              id="tab-payments"
              onClick={() => handleTabChange("payments")}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "payments"
                  ? "bg-background text-white shadow-sm"
                  : "text-muted-foreground hover:text-background"
              }`}
            >
              Payments ({paymentsData?.length || 0})
            </button>
            <button
              id="tab-papers"
              onClick={() => handleTabChange("papers")}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === "papers"
                  ? "bg-background text-white shadow-sm"
                  : "text-muted-foreground hover:text-background"
              }`}
            >
              Position Papers ({positionPapersData?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-[70vh] overflow-auto">
            {activeTab === "delegates" && (
              <AdminDelegatesTable teamsData={delegatesData} onDataChange={handleDataChange} />
            )}

            {activeTab === "payments" && (
              <AdminPaymentsTable paymentsData={paymentsData} onDataChange={handleDataChange} />
            )}

            {activeTab === "papers" && <AdminPositionPapersTable papersData={positionPapersData} />}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0 || loading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>

              <span className="px-4 text-sm text-gray-600">
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
