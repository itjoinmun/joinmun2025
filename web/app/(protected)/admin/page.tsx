"use client";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"delegates" | "payments" | "papers">("delegates");

  // Separate pagination for each tab
  const [delegatesPage, setDelegatesPage] = useState(0);
  const [paymentsPage, setPaymentsPage] = useState(0);
  const [papersPage, setPapersPage] = useState(0);

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

  // Use useCallback to memoize fetch functions
  const fetchDelegates = useCallback(
    async (page: number = delegatesPage) => {
      try {
        setLoading(true);
        const response = await getDelegatesByTeam(
          delegateType,
          timeWave,
          itemsPerPage,
          page * itemsPerPage,
        );
        setDelegatesData(response.delegates_by_team);
        setTotalTeams(response.total_teams);
      } catch (error) {
        console.error("Error fetching delegates:", error);
      } finally {
        setLoading(false);
      }
    },
    [delegateType, timeWave, itemsPerPage, delegatesPage],
  );

  const fetchPayments = useCallback(
    async (page: number = paymentsPage) => {
      try {
        setLoading(true);
        const response = await getPaymentsByTeam(
          delegateType,
          timeWave,
          itemsPerPage,
          page * itemsPerPage,
        );

        // Safely handle the payments_by_team data structure
        const paymentArray = Object.values(response.payments_by_team).flat();
        setPaymentsData(paymentArray);
        setTotalPayments(response.total_payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    },
    [delegateType, timeWave, itemsPerPage, paymentsPage],
  );

  const fetchPositionPapers = useCallback(
    async (page: number = papersPage) => {
      try {
        setLoading(true);
        const response = await getPositionPapersByTeam(timeWave, itemsPerPage, page * itemsPerPage);
        setPositionPapersData(response.papers_by_team);
        setTotalPapers(response.total_teams);
      } catch (error) {
        console.error("Error fetching position papers:", error);
      } finally {
        setLoading(false);
      }
    },
    [timeWave, itemsPerPage, papersPage],
  );

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

  // Fetch data when active tab changes
  useEffect(() => {
    if (activeTab === "delegates") {
      fetchDelegates();
    } else if (activeTab === "payments") {
      fetchPayments();
    } else if (activeTab === "papers") {
      fetchPositionPapers();
    }
  }, [activeTab, fetchDelegates, fetchPayments, fetchPositionPapers]);

  // Reset pagination when filters change
  useEffect(() => {
    setDelegatesPage(0);
    setPaymentsPage(0);
    setPapersPage(0);
  }, [delegateType, timeWave]);

  const handleDataChange = () => {
    if (activeTab === "delegates") {
      fetchDelegates();
    } else if (activeTab === "payments") {
      fetchPayments();
    }
  };

  // Get current pagination info based on active tab
  const getCurrentPaginationInfo = () => {
    switch (activeTab) {
      case "delegates":
        return {
          currentPage: delegatesPage,
          totalItems: totalTeams,
          setCurrentPage: setDelegatesPage,
        };
      case "payments":
        return {
          currentPage: paymentsPage,
          totalItems: totalPayments,
          setCurrentPage: setPaymentsPage,
        };
      case "papers":
        return {
          currentPage: papersPage,
          totalItems: totalPapers,
          setCurrentPage: setPapersPage,
        };
      default:
        return {
          currentPage: 0,
          totalItems: 0,
          setCurrentPage: () => {},
        };
    }
  };

  const paginationInfo = getCurrentPaginationInfo();
  const totalPages = Math.ceil(paginationInfo.totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    paginationInfo.setCurrentPage(newPage);

    // Fetch data for the new page
    setTimeout(() => {
      if (activeTab === "delegates") {
        fetchDelegates(newPage);
      } else if (activeTab === "payments") {
        fetchPayments(newPage);
      } else if (activeTab === "papers") {
        fetchPositionPapers(newPage);
      }
    }, 0);
  };

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardModule>
        <DashboardModuleHeader>
          <div className="mb-2 flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <Heading className="hidden sm:block">Admin Dashboard</Heading>
            <Button
              variant="warning"
              className="flex w-fit items-center gap-2 self-end sm:self-auto"
              onClick={handleDownloadCSV}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              {loading ? "Downloading..." : "Download All Responses as CSV"}
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
          <div className="border-red-dark bg-red-normal text-red-white mb-4 flex w-fit flex-col items-center justify-center gap-1 rounded-lg border p-2 text-xs sm:flex-row sm:gap-2">
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
              Delegates ({totalTeams})
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
              Payments ({totalPayments})
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
              Position Papers ({totalPapers})
            </button>
          </div>

          {/* Tab Content */}
          <div className="no-scrollbar overflow-auto">
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
                onClick={() => handlePageChange(Math.max(0, paginationInfo.currentPage - 1))}
                disabled={paginationInfo.currentPage === 0 || loading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>

              <span className="px-4 text-sm text-gray-600">
                Page {paginationInfo.currentPage + 1} of {totalPages}
                <span className="ml-2 text-xs text-gray-500">
                  ({paginationInfo.totalItems} total {activeTab})
                </span>
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(Math.min(totalPages - 1, paginationInfo.currentPage + 1))
                }
                disabled={paginationInfo.currentPage >= totalPages - 1 || loading}
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
