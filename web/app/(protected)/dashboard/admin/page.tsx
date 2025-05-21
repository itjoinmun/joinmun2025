import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
// import { Button } from "@/components/ui/button";
// import DashboardEvents from "@/modules/dashboard/home/dashboard-events";
// import ParticipantData from "@/modules/dashboard/home/participant-data";

import { getUser } from "@/utils/helpers/fetch/auth/user";
// import { fetchAllParticipants, getDelegates } from "@/utils/helpers/fetch/delegates/delegates";
// import { cookies } from "next/headers";
const DashboardHome = async () => {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("access_token")?.value;
  // const allParticipants = await getDelegates(accessToken);
  const user = await getUser();
  console.log("user", user);

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader>
        <DashboardPageTitle>Admin</DashboardPageTitle>
        {/* <GetAllParticipants /> */}
      </DashboardPageHeader>

      {/* fill the table about all registered participants */}
      {/* <ParticipantData delegates={allParticipants.participant_data} /> */}
    </DashboardPage>
  );
};

export default DashboardHome;

// const GetAllParticipants = async () => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("access_token")?.value;
//   const allParticipants = await fetchAllParticipants(accessToken);
//   return <Button>Get All Participants</Button>;
// };
