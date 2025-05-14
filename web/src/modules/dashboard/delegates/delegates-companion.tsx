import CTACard from "@/components/dashboard/cta-card";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";

const DelegatesCompanion = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Companion</DashboardModuleTitle>
      </DashboardModuleHeader>
      <DashboardModuleContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({length: 2}).map((price, i) => (
          <CTACard
            title={`Companion Title`}
            description={`Description for this card`}
            href={"/dashboard"}
            key={i}
          />
        ))}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesCompanion;
