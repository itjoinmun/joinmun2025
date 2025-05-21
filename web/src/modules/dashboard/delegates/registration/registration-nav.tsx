import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const RegistrationNav = () => {
  const pathname = usePathname();

  // Extract the current step from the URL
  const pathSegments: string[] = pathname.split("/");
  const lastSegment: string = pathSegments[pathSegments.length - 1];
  const currentStep: number = parseInt(lastSegment) || 1;

  // Define the total number of steps (we have 3 right now)
  // Biodata, MUN Questions, and Medical Questions
  const TOTAL_STEPS = 3;

  const isFirstStep = currentStep <= 1;
  const isLastStep = currentStep >= TOTAL_STEPS;
  return (
    <>
      <div className="bg-background border-gray-light fixed inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-3 p-2 md:absolute md:right-8 md:bottom-8 md:left-auto md:rounded-xs md:border md:shadow-md">
        {isFirstStep ? (
          <Button
            type="button"
            variant={"outline"}
            disabled
            className="bg-gray-light/40 hover:bg-gray-light/60 border border-white"
          >
            <ChevronLeft />
            Previous
          </Button>
        ) : (
          <Link href={`${currentStep - 1}`} scroll={false} className=" md:w-auto">
            <Button
              type="button"
              variant={"outline"}
              className="bg-gray-light/40 hover:bg-gray-light/60 cursor-pointer border w-full border-white"
            >
              <ChevronLeft />
              Previous
            </Button>
          </Link>
        )}
        {isLastStep ? (
          <Button type="submit" variant={"primary"} className="cursor-pointer">
            {" "}
            Submit
          </Button>
        ) : (
          <Button type="submit" variant={"primary"} className="cursor-pointer">
            {" "}
            Next
            <ChevronLeft className="rotate-180" />
          </Button>
        )}
      </div>
      <div className="h-8 w-full md:hidden">
        {/* This is a spacer to prevent content from being hidden behind the fixed nav bar on mobile */}
      </div>
    </>
  )
};

export default RegistrationNav;
