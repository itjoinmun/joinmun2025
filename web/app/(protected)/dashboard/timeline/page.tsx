import dynamic from "next/dynamic";

const DashboardTimeline = dynamic(() => import("@/modules/dashboard/timeline"), {
  loading: () => <p>Loading...</p>,
});

export default function Timeline() {
  return <DashboardTimeline />;
}
