import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import DashboardEvents from "@/modules/dashboard/home/dashboard-events";
import InformationCenter from "@/modules/dashboard/home/dashboard-status";
import ParticipantData from "@/modules/dashboard/home/participant-data";
import ParticipantStatus from "@/modules/dashboard/home/participant-status";
import Playground from "@/modules/dashboard/playground";
import { getUser } from "@/utils/helpers/fetch/auth/user";
import { fetchDelegatePaper, fetchPayment, getDelegate, getDelegates } from "@/utils/helpers/fetch/delegates/delegates";
import { cookies } from "next/headers";
const DashboardHome = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const allParticipants = await getDelegates(accessToken);
  const delegate = await getDelegate(accessToken);
  const payment = await fetchPayment(accessToken);
  const positionPaper = await fetchDelegatePaper(accessToken);
  const user = await getUser();
  console.log("user", user);
  
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Home</DashboardPageTitle>
      </DashboardPageHeader>

      {/* call in modules here */}
      <ParticipantStatus />
      <InformationCenter userStatus={delegate} paperStatus={positionPaper} paymentStatus={payment} teamID={allParticipants.team_id}/>
      <ParticipantData delegates={allParticipants.participant_data}/>
      <DashboardEvents />
      <Playground />
    </DashboardPage>
  );
};

export default DashboardHome;
