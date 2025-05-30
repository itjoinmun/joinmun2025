import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import { cookies } from "next/headers";
import {
  getDelegates,
  approveRegistration,
  rejectRegistration,
  approvePayment,
  rejectPayment,
  assignCouncil,
  assignCountry,
} from "@/utils/helpers/fetch/delegates/delegates";
import ParticipantTable from "@/modules/dashboard/admin/participant-table";

const DashboardHome = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const allParticipants = await getDelegates(accessToken);

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Admin</DashboardPageTitle>
      </DashboardPageHeader>

      <ParticipantTable
        participants={allParticipants.participant_data.map((participant: any) => ({
          id: participant.id,
          name: participant.name,
          email: participant.email,
          payment_status: participant.payment_status || "pending",
          registration_status: participant.registration_status || "pending",
          council: participant.council,
          country: participant.country,
        }))}
        onApproveRegistration={async (id) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await approveRegistration(id, accessToken);
        }}
        onRejectRegistration={async (id) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await rejectRegistration(id, accessToken);
        }}
        onApprovePayment={async (id) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await approvePayment(id, accessToken);
        }}
        onRejectPayment={async (id) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await rejectPayment(id, accessToken);
        }}
        onAssignCouncil={async (id, council) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await assignCouncil(id, council, accessToken);
        }}
        onAssignCountry={async (id, country) => {
          "use server";
          const cookieStore = await cookies();
          const accessToken = cookieStore.get("access_token")?.value;
          if (!accessToken) {
            throw new Error("No access token found");
          }
          await assignCountry(id, country, accessToken);
        }}
      />
    </DashboardPage>
  );
};

export default DashboardHome;
