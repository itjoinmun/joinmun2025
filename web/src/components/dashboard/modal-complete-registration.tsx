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

const ModalCompleteRegistration = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Registration</Button>
      </DialogTrigger>
      <DialogContent className="p-3">
        <DialogHeader>
          <DialogTitle className="my-1 flex items-center gap-4">Complete Registration?</DialogTitle>
          <hr className="mt-1 opacity-20" />
          <DialogDescription className="text-start text-[105%] text-white">
            After the registration, you will have to wait for verification for further information
            and payment!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href={"/dashboard/delegates"}>
            {/* Kalo gabisa nnti pake yg ini  */}
            {/* <Button type="submit" onClick={handleNavigation}> */}
            <Button type="submit" variant={"primary"}>
              Finish and Submit
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCompleteRegistration;
