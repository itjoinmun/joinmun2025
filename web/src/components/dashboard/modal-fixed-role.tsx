import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Image from "next/image";

const ModalFixedRole = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Role fixing</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="group xs:scale-75 scale-90 p-3 md:scale-80 lg:scale-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="my-1 flex items-center gap-4 font-normal">
            Choose Role?
          </AlertDialogTitle>
          <hr className="mt-1 mb-3 opacity-20" />
          <AlertDialogDescription className="relative text-[105%] text-white">
            {/* Kotak Abu */}
            <div className="bg-gray 2xs:h-[6.5rem] relative h-[5.5rem] overflow-clip rounded-md">
              {/* Bulat Kuning */}
              <div className="2xs:w-[100px] absolute -bottom-8 left-8 h-full w-[80px] scale-125 rounded-full bg-[#EBCD2E]" />
              {/* Teks di dalam Kotak */}
              <p className="2xs:mx-0 2xs:max-w-[52%] xs:max-w-[63%] 2xs:text-[80%] xs:text-[100%] absolute inset-y-0 right-2 z-10 my-auto w-full max-w-[50%] self-end text-start text-[75%] sm:max-w-[67%] md:right-0">
                <b>Warning! </b>You can only choose one role and can no longer change afterwards
              </p>
              {/* Gambar di dalam Kotak */}
              <Image
                src="/assets/dashboard/modal.webp"
                alt="Fixed Role"
                width={100}
                height={100}
                priority
                className="2xs:translate-x-8 absolute inset-x-0 aspect-[1269/1565] max-w-[100px] translate-x-6 -translate-y-1"
              />
            </div>
            {/* Teks di bawah kotak */}
            <div className="my-2 text-start text-[80%] sm:text-[100%]">
              Are you sure you want to <b>choose role</b> as
            </div>
            <div className="bg-gray flex h-[3rem] items-center justify-center rounded-md lg:h-12">
              Observer?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction>Choose</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalFixedRole;
