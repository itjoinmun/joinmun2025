import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import ParticipantTable from "@/modules/dashboard/admin/participant-table";
import {
  approvePayment,
  approveRegistration,
  assignCouncil,
  assignCountry,
  getDelegates,
  Participant,
  rejectPayment,
  rejectRegistration,
} from "@/utils/helpers/fetch/delegates/delegates";

const DashboardHome = async () => {
  const allParticipants = await getDelegates();

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Admin</DashboardPageTitle>
      </DashboardPageHeader>

      <ParticipantTable
        participants={allParticipants.participant_data.map((participant: Participant) => ({
          id: participant.id,
          name: participant.name,
          email: participant.email,
          payment_status: participant.payment_status || "pending",
          registration_status: participant.registration_status || "pending",
          council: participant.council,
          country: participant.country,
        }))}
        onApproveRegistration={async (id) => {
          await approveRegistration(id);
        }}
        onRejectRegistration={async (id) => {
          await rejectRegistration(id);
        }}
        onApprovePayment={async (id) => {
          await approvePayment(id);
        }}
        onRejectPayment={async (id) => {
          await rejectPayment(id);
        }}
        onAssignCouncil={async (id, council) => {
          await assignCouncil(id, council);
        }}
        onAssignCountry={async (id, country) => {
          await assignCountry(id, country);
        }}
      />
    </DashboardPage>
  );
};

export default DashboardHome;
