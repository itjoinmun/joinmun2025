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
import { Delegate, getDelegate, getDelegates } from "@/utils/helpers/fetch/delegates/delegates";

const ParticipantData = async () => {
  const showCouncilAndCountry = process.env.NEXT_PUBLIC_CC_REVEAL === "true";
  const delegate = await getDelegate();

  if (delegate?.participant_type === "observer") return <></>;

  const delegates = await getDelegates();

  let participantData: Delegate[] | undefined;

  if (delegates) {
    participantData = delegates.participant_data;
  }

  if (delegate?.participant_type === "faculty_advisor" && !participantData) return <></>;

  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Data</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent className="no-scrollbar max-h-96 overflow-scroll">
        {/* <p className="mb-2 text-xs">Announcement at 12 December 2025</p> */}
        <Table>
          <TableHeader>
            <TableRow className="bg-background border-b *:text-white">
              <TableHead className="first:rounded-tl-lg last:rounded-tr-lg">Name</TableHead>
              <TableHead className="">Delegate Status</TableHead>
              <TableHead className="">Council</TableHead>
              <TableHead className="">Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-blue-50">
            {participantData ? (
              participantData.map((participant: Delegate, index: number) => (
                <TableRow key={participant.mun_delegate_name} className="border-b border-gray-100">
                  <TableCell
                    className={cn(
                      "py-3 font-medium text-gray-900",
                      index === participantData.length - 1 && "first:rounded-bl-lg",
                    )}
                  >
                    {participant.participant_type === "faculty_advisor"
                      ? `${participant.mun_delegate_name} (ADVISOR)`
                      : `${participant.mun_delegate_name}`}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        participant.confirmed === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : participant.confirmed === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800",
                      )}
                    >
                      {participant.confirmed === "confirmed"
                        ? "Confirmed"
                        : participant.confirmed === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-gray-700">
                    {showCouncilAndCountry ? (participant.council ?? "-") : "Wait for reveal"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "py-3 text-gray-700",
                      index === participantData.length - 1 && "rounded-br-lg",
                    )}
                  >
                    {showCouncilAndCountry ? (participant.country ?? "-") : "Wait for reveal"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b bg-red-50">
                <TableCell colSpan={4} className="text-primary py-6 text-center font-medium">
                  You haven&apos;t registered. Register now
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
