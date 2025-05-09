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
import { cn } from "@/utils/cn";

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

const ParticipantData = () => {
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
            {dummyData.map((participant, index) => (
              <TableRow key={participant.id} className="hover:bg-blue-100/80">
                <TableCell
                  className={cn(
                    "font-medium",
                    index === dummyData.length - 1 && "first:rounded-bl-lg",
                  )}
                >
                  {participant.name}
                </TableCell>
                <TableCell>{participant.delegateStatus}</TableCell>
                <TableCell>{participant.council}</TableCell>
                <TableCell className={cn(index === dummyData.length - 1 && "rounded-br-lg")}>
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
