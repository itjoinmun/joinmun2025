import CTACard from "@/components/dashboard/cta-card";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { DELEGATES } from "@/utils/helpers/delegates";

const DelegatesParticipant = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant</DashboardModuleTitle>
      </DashboardModuleHeader>
      <DashboardModuleContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(DELEGATES)
          .filter(([, delegate]) => delegate.type === "participant")
          .map(([key, delegate]) => (
            <CTACard
              title={delegate.name}
              description={delegate.description}
              href={`delegates/${key === 'team' ? 'team' : key + '/registration/1'}`}
              key={key}
            />
          ))}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesParticipant;
