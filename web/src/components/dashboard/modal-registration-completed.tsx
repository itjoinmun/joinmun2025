import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";

const ModalRegistrationCompleted = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Registration Completed</Button>
      </DialogTrigger>
      <DialogContent className="p-3">
        <DialogHeader>
          <DialogTitle className="my-1 flex items-center gap-4">Registration Completed</DialogTitle>
          <hr className="mt-1 opacity-20" />
          <DialogDescription className="text-start text-[105%] text-white">
            Wait and check for <b>status in homepage</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href={"/dashboard"}>
            <Button variant={"primary"}>Homepage</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRegistrationCompleted;
