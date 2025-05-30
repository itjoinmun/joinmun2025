import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/helpers/cn";
import { getDelegates } from "@/utils/helpers/fetch/delegates/delegates";

const ParticipantData = async () => {
  const delegates = await getDelegates();
  console.log("Delegates data:", delegates); // null

  let participantData;
  if (delegates) {
    participantData = await delegates.participant_data;
  }

  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Data</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent className="no-scrollbar max-h-96 overflow-scroll">
        <Table>
          <TableHeader>
            <TableRow className="bg-background hover:bg-background">
              <TableHead className="first:rounded-tl-lg last:rounded-tr-lg">Name</TableHead>
              <TableHead>Delegate Status</TableHead>
              <TableHead>Council</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-blue-100">
            {participantData ? (
              participantData.map((participant: any, index: number) => (
                <TableRow key={participant.mun_delegate_name} className="hover:bg-blue-100/80">
                  <TableCell
                    className={cn(index === participantData.length - 1 && "first:rounded-bl-lg")}
                  >
                    {participant.mun_delegate_name}
                  </TableCell>
                  <TableCell>{participant.confirmed ? "Confirmed" : "Not Confirmed"}</TableCell>
                  <TableCell>{participant.council}</TableCell>
                  <TableCell
                    className={cn(index === participantData.length - 1 && "rounded-br-lg")}
                  >
                    {participant.country}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-neutral-400">
                <TableCell colSpan={4} className="text-start font-medium text-black">
                  You haven't registered. Register now
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default ParticipantData;
