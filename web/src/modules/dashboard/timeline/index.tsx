import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import Handbook from "./handbook";
import Days from "./days";

const DashboardTimeline = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-2">
        <DashboardPageTitle className="text-3xl font-bold md:text-4xl xl:text-5xl">
          Timeline
        </DashboardPageTitle>
        <DashboardPageDescription>
          Information about each of the competition events
        </DashboardPageDescription>
      </DashboardPageHeader>

      {/* Content Here */}
      <Handbook />
      <Days />
    </DashboardPage>
  );
};

export default DashboardTimeline;
