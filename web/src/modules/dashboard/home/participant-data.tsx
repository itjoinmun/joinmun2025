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
import { cookies } from "next/headers";

interface ParticipantTableData {
  id: string;
  name: string;
  delegateStatus: string;
  council: string;
  country: string;
}

// Dummy data for development
const dummyData: ParticipantTableData[] = [
  {
    id: "1",
    name: "John Doe",
    delegateStatus: "Single Delegate",
    council: "UNSC",
    country: "United States",
  },
  {
    id: "2",
    name: "Jane Smith",
    delegateStatus: "Double Delegate",
    council: "WHO",
    country: "United Kingdom",
  },
  // Add more dummy data as needed
];

const ParticipantData = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const delegates = await getDelegates(accessToken);
  console.log(delegates);
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
            {delegates?.map((participant: any, index: number) => (
              <TableRow key={participant.mun_delegate_name} className="hover:bg-blue-100/80">
                <TableCell
                  className={cn(
                    "font-medium",
                    index === participant.length - 1 && "first:rounded-bl-lg",
                  )}
                >
                  {participant.mun_delegate_name}
                </TableCell>
                <TableCell>{participant.confirmed ? "Confirmed" : "Not Confirmed"}</TableCell>
                <TableCell>{participant.council}</TableCell>
                <TableCell className={cn(index === participant.length - 1 && "rounded-br-lg")}>
                  {participant.country}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default ParticipantData;
