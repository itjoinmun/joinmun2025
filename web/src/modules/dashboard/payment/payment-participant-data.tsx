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
import { getCurrentPaymentPhase } from "@/utils/helpers/registration-wave";

const ParticipantData = async () => {
  const delegates = await getDelegates();
  const participantData = await delegates?.participant_data;

  // Get the registration wave (e.g., Early Bird / Regular / Late)
  const currentPhase = getCurrentPaymentPhase();

  // Map phase to fixed date (hardcoded for now)
  const verificationDateMap: Record<string, string> = {
    "Early Bird": "12 December 2025",
    Regular: "12 December 2025",
    Late: "12 December 2025",
  };

  const paymentVerificationDate = verificationDateMap[currentPhase] || "TBA";

  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Participant Data</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent className="no-scrollbar">
        <p className="text-sm md:text-base">
          Single Delegates - Payment verification at <b>{paymentVerificationDate}</b>
        </p>

        <Table>
          <TableHeader>
            <TableRow className="bg-background hover:bg-background">
              <TableHead className="w-[60%] first:rounded-tl-lg last:rounded-tr-lg">Name</TableHead>
              <TableHead className="w-[40%] text-center">Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-blue-100">
            {participantData && participantData.length > 0 ? (
              participantData.map((participant: {}, index: number) => (
                <TableRow key={participant.mun_delegate_name} className="hover:bg-blue-100/80">
                  <TableCell
                    className={cn(index === participantData.length - 1 && "first:rounded-bl-lg")}
                  >
                    {participant.mun_delegate_name}
                  </TableCell>
                  <TableCell className="text-center">{participant.payment_status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-neutral-400">
                <TableCell colSpan={2} className="text-center font-medium text-black">
                  You haven&apos;t registered.
                  <br className="block sm:hidden" />
                  Register now
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <p className="text-sm md:text-base">
          Payment of delegates team are paid by each of the members.
        </p>
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default ParticipantData;
