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
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

const ModalPaymentCompleted = () => {
  // Terus pake ini
  // const [open, setOpen] = useState(false);
  // const router = useRouter();

  // const handleNavigation = () => {
  //   setOpen(false);
  //   router.push("/dashboard");
  // };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Payment Completed</Button>
      </DialogTrigger>
      <DialogContent className="p-3">
        <DialogHeader>
          <DialogTitle className="my-1 flex items-center gap-4">
            <CircleCheckBig className="h-6 w-6" /> Payment Completed
          </DialogTitle>
          <hr className="mt-1 opacity-20" />
          <DialogDescription className="text-start text-[105%] text-white">
            Wait and check for <b>status in homepage</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="self-end">
          <Link href={"/dashboard"}>
            {/* Kalo gabisa nnti pake yg ini  */}
            {/* <Button type="submit" onClick={handleNavigation}> */}
            <Button variant={"primary"}>Homepage</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPaymentCompleted;
