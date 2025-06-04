import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/helpers/cn";
import { Delegate, getDelegates } from "@/utils/helpers/fetch/delegates/delegates";
import { Suspense } from "react";

const ParticipantData = () => {
  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Data</DashboardModuleTitle>
      </DashboardModuleHeader>

      <Suspense fallback={<Skeleton className="h-24" />}>
        <Body />
      </Suspense>
    </DashboardModule>
  );
};

const Body = async () => {
  const delegates = await getDelegates();

  let participantData: Delegate[] | undefined;
  if (delegates) {
    participantData = delegates.participant_data;
  }

  return (
    <DashboardModuleContent className="no-scrollbar max-h-96 overflow-scroll">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-b">
            <TableHead className="first:rounded-tl-lg last:rounded-tr-lg font-semibold text-gray-700">
              Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Delegate Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Council</TableHead>
            <TableHead className="font-semibold text-gray-700">Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {participantData ? (
            participantData.map((participant: Delegate, index: number) => (
              <TableRow key={participant.mun_delegate_name} className="hover:bg-blue-50 border-b border-gray-100">
                <TableCell
                  className={cn(
                    "font-medium text-gray-900 py-3",
                    index === participantData.length - 1 && "first:rounded-bl-lg"
                  )}
                >
                  {participant.mun_delegate_name}
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      participant.confirmed === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : participant.confirmed === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {participant.confirmed === "confirmed" 
                      ? "Confirmed" 
                      : participant.confirmed === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-700 py-3">{participant.council ?? "-"}</TableCell>
                <TableCell className={cn(
                  "text-gray-700 py-3",
                  index === participantData.length - 1 && "rounded-br-lg"
                )}>
                  {participant.country ?? "-"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-red-50 border-b">
              <TableCell colSpan={4} className="text-center font-medium text-red-700 py-6">
                You haven&apos;t registered. Register now
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DashboardModuleContent>
  );
};

export default ParticipantData;
