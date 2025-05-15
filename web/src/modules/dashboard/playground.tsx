"use client";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, CreditCard, CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

// Fixed Role Modal
const FixedRoleModal = () => {
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

// Complete Registration Modal
const CompleteRegistrationModal = () => {
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

// Registration Completed Modal
const RegistrationCompletedModal = () => {
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

// Payment Completed Modal
const PaymentCompletedModal = () => {
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

export default function Playground() {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <FixedRoleModal />
      <CompleteRegistrationModal />
      <RegistrationCompletedModal />
      <PaymentCompletedModal />
    </div>
  );
}
