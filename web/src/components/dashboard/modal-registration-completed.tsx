import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

const ModalRegistrationCompleted = ({ open }: { open?: boolean }) => {
  const { delegates } = useParams();

  return (
    <Dialog open={open}>
      <DialogContent className="p-3">
        <DialogHeader>
          <DialogTitle className="my-1 flex items-center gap-4">Registration Completed</DialogTitle>
          <hr className="mt-1 opacity-20" />
          <DialogDescription className="text-start text-[105%] text-white">
            Wait and check for <b>status in homepage</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href={delegates === "team" ? "/dashboard/delegates/team" : "/dashboard/delegates"}>
            <Button variant={"primary"} className="cursor-pointer">
              Homepage
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRegistrationCompleted;
