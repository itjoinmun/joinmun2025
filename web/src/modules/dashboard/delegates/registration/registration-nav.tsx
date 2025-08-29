import ModalCompleteRegistration from "@/components/dashboard/modal-complete-registration";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "@/utils/hooks/use-form-status";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const RegistrationNav = ({ onSubmit }: { onSubmit?: () => void }) => {
  const { submitting } = useFormStatus();
  const pathname = usePathname();

  const pathSegments: string[] = pathname.split("/");
  const lastSegment: string = pathSegments[pathSegments.length - 1];
  const currentStep: number = parseInt(lastSegment) || 1;

  // Define the total number of steps (we have 3 right now)
  // Biodata, MUN Questions, and Medical Questions
  const TOTAL_STEPS = 3;

  const isFirstStep = currentStep <= 1;
  const isLastStep = currentStep >= TOTAL_STEPS;

  const isCompanion = pathSegments.includes("observer") || pathSegments.includes("advisor");

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
          <Link
            href={`${isCompanion ? currentStep - 2 : currentStep - 1}`}
            scroll={false}
            className="md:w-auto"
          >
            <Button
              type="button"
              variant={"outline"}
              className="bg-gray-light/40 hover:bg-gray-light/60 w-full cursor-pointer border border-white"
            >
              <ChevronLeft />
              Previous
            </Button>
          </Link>
        )}{" "}
        {isLastStep ? (
          <ModalCompleteRegistration submitting={submitting} onSubmit={onSubmit}>
            <Button
              type="button"
              disabled={submitting}
              variant={"primary"}
              className="cursor-pointer"
            >
              {submitting ? <>Submitting...</> : <>Submit</>}
            </Button>
          </ModalCompleteRegistration>
        ) : (
          <Button type="submit" variant={"primary"} className="cursor-pointer">
            {" "}
            Next
            <ChevronLeft className="rotate-180" />
          </Button>
        )}
      </div>
      <div className="h-8 w-full md:hidden" />
    </>
  );
};

export default RegistrationNav;
