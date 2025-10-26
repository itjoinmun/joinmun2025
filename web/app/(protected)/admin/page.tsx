/*eslint-disable @typescript-eslint/no-explicit-any*/
"use client";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
} from "@/components/dashboard/dashboard-module";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileDownIcon, Send } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getDelegatesByTeam,
  getPaymentsByTeam,
  getPositionPapersByTeam,
  downloadResponsesCSV,
  sendPaymentReminderEmail,
  exportToCSV,
} from "@/utils/helpers/fetch/admin/admin";
import {
  TeamDelegateGroup,
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
import { LogoutButton } from "@/modules/dashboard/dashboard-nav";
import { cn } from "@/utils/helpers/cn";

// ========================================================================================
// CONSTANTS & TYPES
// ========================================================================================

const DELEGATE_TYPES: readonly { value: DelegateType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "single_delegate", label: "Single Delegate" },
  { value: "team_delegate", label: "Delegation Team" },
  { value: "faculty_advisor", label: "Faculty Advisor" },
  { value: "observer", label: "Observer" },
] as const;

const TIME_WAVES: readonly { value: TimeWave; label: string }[] = [
  { value: "all", label: "All Waves" },
  { value: "earlybird", label: "Early Bird" },
  { value: "regular", label: "Regular" },
  { value: "late", label: "Late" },
] as const;

const ITEMS_PER_PAGE = 10;
const MAX_FETCH_LIMIT = 1000;

type TabType = "delegates" | "payments" | "papers";

interface TabData {
  delegates: TeamDelegateGroup[];
  payments: any[]; // Raw payment data from backend (flat array)
  papers: TeamPositionPaperGroup[];
}

interface PaginationState {
  delegates: number;
  payments: number;
  papers: number;
}

// ========================================================================================
// CUSTOM HOOKS
// ========================================================================================

/**
 * Custom hook for managing pagination state across all tabs
 */
const usePagination = () => {
  const [pages, setPages] = useState<PaginationState>({
    delegates: 0,
    payments: 0,
    papers: 0,
  });

  const updatePage = useCallback((tab: TabType, page: number) => {
    setPages((prev) => ({ ...prev, [tab]: page }));
  }, []);

  const resetPagination = useCallback(() => {
    setPages({ delegates: 0, payments: 0, papers: 0 });
  }, []);

  return { pages, updatePage, resetPagination };
};

/**
 * Custom hook for managing all tab data and total counts
 */
const useTabData = () => {
  const [allData, setAllData] = useState<TabData>({
    delegates: [],
    payments: [],
    papers: [],
  });

  const [totals, setTotals] = useState({
    delegates: 0,
    payments: 0,
    papers: 0,
  });

  const updateTabData = useCallback((tab: TabType, data: any[], total: number) => {
    setAllData((prev) => ({ ...prev, [tab]: data }));
    setTotals((prev) => ({ ...prev, [tab]: total }));
  }, []);

  return { allData, totals, updateTabData };
};

/**
 * Custom hook for efficient data fetching with caching
 */
const useDataFetcher = (
  delegateType: DelegateType,
  timeWave: TimeWave,
  updateTabData: (tab: TabType, data: any[], total: number) => void,
) => {
  const [loading, setLoading] = useState(false);
  const [dataCache, setDataCache] = useState<Map<string, any>>(new Map());

  const getCacheKey = useCallback((tab: TabType, type: string, wave: string) => {
    return `${tab}-${type}-${wave}`;
  }, []);

  const fetchWithCache = useCallback(
    async (
      tab: TabType,
      fetchFn: () => Promise<any>,
      dataExtractor: (response: any) => { data: any[]; total: number },
    ) => {
      const cacheKey = getCacheKey(tab, delegateType, timeWave);

      // Check cache first
      if (dataCache.has(cacheKey)) {
        const cachedResult = dataCache.get(cacheKey);
        updateTabData(tab, cachedResult.data, cachedResult.total);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchFn();
        const result = dataExtractor(response);

        // Cache the result
        setDataCache((prev) => new Map(prev).set(cacheKey, result));
        updateTabData(tab, result.data, result.total);
      } catch (error) {
        console.error(`Error fetching ${tab}:`, error);
        updateTabData(tab, [], 0);
      } finally {
        setLoading(false);
      }
    },
    [delegateType, timeWave, dataCache, getCacheKey, updateTabData],
  );

  const fetchDelegates = useCallback(() => {
    return fetchWithCache(
      "delegates",
      () => getDelegatesByTeam(delegateType, timeWave, MAX_FETCH_LIMIT, 0),
      (response) => ({
        data: response.delegates_by_team || [],
        total: response.total_teams || response.delegates_by_team?.length || 0,
      }),
    );
  }, [fetchWithCache, delegateType, timeWave]);

  const fetchPayments = useCallback(() => {
    return fetchWithCache(
      "payments",
      () => getPaymentsByTeam(delegateType, timeWave, MAX_FETCH_LIMIT, 0),
      (response) => {
        // Simple approach like delegates - use the raw data from backend
        const paymentsData = response.payments_by_team || {};

        // Convert Map to flat array for frontend pagination
        const paymentsArray = Object.values(paymentsData).flat();

        return {
          data: paymentsArray,
          total: response.total_payments || paymentsArray.length || 0,
        };
      },
    );
  }, [fetchWithCache, delegateType, timeWave]);

  const fetchPositionPapers = useCallback(() => {
    return fetchWithCache(
      "papers",
      () => getPositionPapersByTeam(timeWave, MAX_FETCH_LIMIT, 0),
      (response) => ({
        data: response.papers_by_team || [],
        total: response.total_teams || response.papers_by_team?.length || 0,
      }),
    );
  }, [fetchWithCache, timeWave]);

  // Clear cache when filters change
  useEffect(() => {
    setDataCache(new Map());
  }, [delegateType, timeWave]);

  const clearCache = useCallback(() => {
    setDataCache(new Map());
  }, []);

  return { loading, fetchDelegates, fetchPayments, fetchPositionPapers, clearCache };
};

// ========================================================================================
// MAIN COMPONENT
// ========================================================================================

const DashboardAdmin = () => {
  // ==================== STATE MANAGEMENT ====================
  const [delegateType, setDelegateType] = useState<DelegateType>("all");
  const [timeWave, setTimeWave] = useState<TimeWave>("all");
  const [activeTab, setActiveTab] = useState<TabType>("delegates");
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ==================== CUSTOM HOOKS ====================
  const { pages, updatePage, resetPagination } = usePagination();
  const { allData, totals, updateTabData } = useTabData();
  const { loading, fetchDelegates, fetchPayments, fetchPositionPapers, clearCache } =
    useDataFetcher(delegateType, timeWave, updateTabData);

  // ==================== MEMOIZED VALUES ====================
  const paginatedDelegatesData = useMemo(() => {
    if (activeTab !== "delegates") return [];
    const currentPage = pages.delegates;
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allData.delegates.slice(startIndex, endIndex);
  }, [allData.delegates, activeTab, pages.delegates]);

  const paginatedPaymentsData = useMemo(() => {
    if (activeTab !== "payments") return [];
    const currentPage = pages.payments;
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allData.payments.slice(startIndex, endIndex);
  }, [allData.payments, activeTab, pages.payments]);

  const paginatedPapersData = useMemo(() => {
    if (activeTab !== "papers") return [];
    const currentPage = pages.papers;
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allData.papers.slice(startIndex, endIndex);
  }, [allData.papers, activeTab, pages.papers]);

  const totalPages = useMemo(() => {
    return Math.ceil(totals[activeTab] / ITEMS_PER_PAGE);
  }, [totals, activeTab]);

  const currentPage = pages[activeTab];

  // ==================== HANDLERS ====================
  const scrollActiveTabIntoView = useCallback((tabId: string) => {
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      setTimeout(() => scrollActiveTabIntoView(`tab-${tab}`), 100);
    },
    [scrollActiveTabIntoView],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updatePage(activeTab, newPage);
    },
    [activeTab, updatePage],
  );

  const handleDataChange = useCallback(() => {
    // Force refresh by clearing cache and refetching
    clearCache(); // Clear all cache
    const fetchMap = {
      delegates: fetchDelegates,
      payments: fetchPayments,
      papers: fetchPositionPapers,
    };
    fetchMap[activeTab]?.();
  }, [activeTab, fetchDelegates, fetchPayments, fetchPositionPapers, clearCache]);

  const handleDownloadCSV = useCallback(async () => {
    try {
      setDownloading(true);
      await downloadResponsesCSV(delegateType, MAX_FETCH_LIMIT, 0);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setDownloading(false);
    }
  }, [delegateType]);

  const handleExportToCSV = useCallback(async () => {
    try {
      setExporting(true);
      await exportToCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setExporting(false);
    }
  }, []);

  const handleSendEmail = useCallback(async () => {
    try {
      setSendingEmail(true);
      await sendPaymentReminderEmail();
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSendingEmail(false);
    }
  }, []);
  // ==================== EFFECTS ====================
  // Fetch data when active tab changes
  useEffect(() => {
    const fetchMap = {
      delegates: fetchDelegates,
      payments: fetchPayments,
      papers: fetchPositionPapers,
    };
    fetchMap[activeTab]?.();
  }, [activeTab, fetchDelegates, fetchPayments, fetchPositionPapers]);

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [delegateType, timeWave, resetPagination]);

  // ==================== RENDER ====================
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardModule>
        <DashboardModuleHeader>
          <div className="mb-2 flex w-full flex-col gap-3">
            <Heading className="block">Admin Dashboard</Heading>

            {/* Button group dengan scroll horizontal di mobile */}
            <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
              <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap sm:justify-end">
                <Button
                  variant="warning"
                  size={"sm"}
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={handleExportToCSV}
                  disabled={exporting}
                >
                  <FileDownIcon className="h-4 w-4" />
                  {exporting ? "Exporting..." : "Export To CSV"}
                </Button>

                <Button
                  variant="warning"
                  size={"sm"}
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={handleDownloadCSV}
                  disabled={downloading}
                >
                  <FileDownIcon className="h-4 w-4" />
                  {downloading ? "Downloading..." : "Download CSV (Old)"}
                </Button>

                <Button
                  variant="warning"
                  size={"sm"}
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                >
                  <Send className="h-4 w-4" />
                  {sendingEmail ? "Sending..." : "Send Email Reminder (Not Updated)"}
                </Button>

                <LogoutButton isAdmin={true} />
              </div>
            </div>
          </div>
        </DashboardModuleHeader>

        <DashboardModuleContent>
          {/* Note */}
          <div className="border-red-dark bg-red-normal text-red-white mb-4 flex w-fit flex-col items-center justify-center gap-1 rounded-lg border p-2 text-xs sm:flex-row sm:gap-2">
            <div className="flex gap-2 self-start sm:items-center sm:self-auto">
              <AlertCircle className="h-5 w-5" />
              Note:
            </div>
            <p className="text-pretty">Response files are only valid for 8 hours after download.</p>
          </div>

          {/* Filters */}
          <div className="xs:flex-row mb-3 flex flex-col gap-4">
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
              Delegates ({totals.delegates})
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
              Payments ({totals.payments})
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
              Position Papers ({totals.papers})
            </button>
          </div>

          {/* Tab Content */}
          <div className="no-scrollbar overflow-auto">
            {activeTab === "delegates" && (
              <AdminDelegatesTable
                teamsData={paginatedDelegatesData}
                onDataChange={handleDataChange}
              />
            )}

            {activeTab === "payments" && (
              <AdminPaymentsTable
                paymentsData={paginatedPaymentsData}
                onDataChange={handleDataChange}
              />
            )}

            {activeTab === "papers" && (
              <AdminPositionPapersTable papersData={paginatedPapersData} />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:justify-between">
              {/* Page Info */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  ({totals[activeTab]} total {activeTab})
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || loading}
                  className="px-3 py-1 text-xs"
                >
                  Previous
                </Button>

                {/* Page Numbers - Always show consistent buttons */}
                {(() => {
                  const maxVisiblePages = 5;
                  const startPage = Math.max(
                    0,
                    Math.min(
                      currentPage - Math.floor(maxVisiblePages / 2),
                      totalPages - maxVisiblePages,
                    ),
                  );
                  const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                  const pages = [];

                  // Show first page + ellipsis if we're far from start
                  if (startPage > 0) {
                    pages.push(
                      <Button
                        key={0}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(0)}
                        disabled={loading}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        1
                      </Button>,
                    );
                    if (startPage > 1) {
                      pages.push(
                        <span key="start-ellipsis" className="px-1 text-sm text-gray-400">
                          ...
                        </span>,
                      );
                    }
                  }

                  // Show main page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "white" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={loading}
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          currentPage === i
                            ? "text-background border-background border bg-white shadow-md"
                            : "",
                        )}
                      >
                        {i + 1}
                      </Button>,
                    );
                  }

                  // Show ellipsis + last page if we're far from end
                  if (endPage < totalPages - 1) {
                    if (endPage < totalPages - 2) {
                      pages.push(
                        <span key="end-ellipsis" className="px-1 text-sm text-gray-400">
                          ...
                        </span>,
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages - 1}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={loading}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {totalPages}
                      </Button>,
                    );
                  }

                  return pages;
                })()}

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="px-3 py-1 text-xs"
                >
                  Next
                </Button>
              </div>

              {/* Mobile-friendly page selector for many pages */}
              {totalPages > 7 && (
                <div className="flex items-center gap-2 sm:hidden">
                  <span className="text-xs text-gray-600">Go to page:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value))}
                    disabled={loading}
                    className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {Array.from({ length: totalPages }, (_, index) => (
                      <option key={index} value={index}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DashboardAdmin;
