import DashboardContainer from "@/components/dashboard/dashboard-container";
import DashboardNav from "@/modules/dashboard/dashboard-nav";
import UserProfileInfo from "@/modules/dashboard/user-profile-info";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen relative flex-col gap-6 md:overflow-hidden md:flex-row md:gap-0">
      <DashboardContainer className="shrink-0 md:w-80 pb-0 md:py-4 md:pr-0">
        <DashboardNav />
      </DashboardContainer>
      <section className="max-h-screen w-full md:overflow-y-auto">
        <DashboardContainer className="md:px-6 pt-0 md:pt-6">
          <header className="hidden md:flex items-center justify-between gap-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <UserProfileInfo />
          </header>
          {children}
        </DashboardContainer>
      </section>
    </main>
  );
};

export default DashboardLayout;
