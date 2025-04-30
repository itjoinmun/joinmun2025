import CTACard from "@/components/dashboard/cta-card";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { PRICES } from "@/utils/helpers/pricing";

const DelegatesParticipant = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant</DashboardModuleTitle>
      </DashboardModuleHeader>
      <DashboardModuleContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(PRICES).map((price, i) => (
          <CTACard
            title={price[1].name}
            description={price[1].description}
            href={"/dashboard"}
            key={i}
          />
        ))}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesParticipant;
