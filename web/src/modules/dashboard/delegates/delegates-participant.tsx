import CTACard from "@/components/dashboard/cta-card";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { DELEGATES } from "@/utils/helpers/delegates";
import { getDelegate } from "@/utils/helpers/fetch/delegates/delegates";

const DelegatesParticipant = async () => {
  let res;
  try {
    res = await getDelegate();
  } catch (error) {
    console.error("Error fetching delegate:", error);
  }

  if (res) return <></>;

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
              href={`delegates/${key === "team" ? "team" : key + "/registration/1"}`}
              key={key}
            />
          ))}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default DelegatesParticipant;
