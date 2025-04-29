import ParticipantStatus from "@/modules/dashboard/home/participant-status";

const DashboardHome = () => {
  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-gold text-base">Home</h1>

      <section className="h-screen"></section>
      <ParticipantStatus />
    </main>
  );
};

export default DashboardHome;
