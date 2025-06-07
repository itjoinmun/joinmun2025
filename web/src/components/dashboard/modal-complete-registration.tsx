import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const ModalCompleteRegistration = ({
  children,
  submitting,
  onSubmit,
}: {
  children: React.ReactNode;
  submitting: boolean;
  onSubmit?: () => void;
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-3">
          <DialogHeader>
            <DialogTitle className="my-1 flex items-center gap-4">
              Complete Registration?
            </DialogTitle>
            <hr className="mt-1 opacity-20" />
            <DialogDescription className="text-start text-[105%] text-white">
              After the registration, you will have to wait for verification for further information
              and payment!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                disabled={submitting}
                variant={"primary"}
                className="cursor-pointer"
                onClick={onSubmit}
              >
                {submitting ? <>Submitting...</> : <>Finish and Submit</>}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCompleteRegistration;
