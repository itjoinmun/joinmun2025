import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import DelegatesCompanion from "@/modules/dashboard/delegates/delegates-companion";
import DelegatesParticipant from "@/modules/dashboard/delegates/delegates-participant";
import YourRole from "@/modules/dashboard/delegates/your-role";
import { getCurrentPhase } from "@/utils/helpers/payment-wave";

import { SquareXIcon } from "lucide-react";
import { Suspense } from "react";

const DelegatesPage = () => {
  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Registration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DashboardPageDescription className="text-base">
          Welcome to Registration, choose role to see more information
        </DashboardPageDescription>
      </DashboardPageHeader>
      {getCurrentPhase() === "Closed After Early Bird" ? (
        <>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold">
              <span className="flex flex-col-reverse items-center gap-2 md:flex-row">
                Early Bird Registration Has Closed
                <SquareXIcon className="size-10" />
              </span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base lg:max-w-3xl lg:text-lg">
              If you have already registered during the Early Bird phase, please wait for the
              verification process. You may still proceed with your payment. If you haven&apos;t
              registered yet, please wait for the Regular Wave Registration to open soon.
              <br />
              <br />
              Thank you for your understanding.
            </p>
          </div>
        </>
      ) : getCurrentPhase() === "Closed After Regular" ? (
        <>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold">
              <span className="flex flex-col-reverse items-center gap-2 md:flex-row">
                Regular Wave Registration Has Closed
                <SquareXIcon className="size-10" />
              </span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base lg:max-w-3xl lg:text-lg">
              If you have already registered during the Regular phase, please wait for the
              verification process. You may still proceed with your payment. If you haven&apos;t
              registered yet, please wait for the Late Wave Registration to open soon.
              <br />
              <br />
              Thank you for your understanding.
            </p>
          </div>
        </>
      ) : getCurrentPhase() === "Closed" ? (
        <>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold">
              <span className="flex flex-col-reverse items-center gap-2 md:flex-row">
                Registration Has Closed
                <SquareXIcon className="size-10" />
              </span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base lg:max-w-3xl lg:text-lg">
              If you have already registered, please wait for the verification process. You may
              still proceed with your payment.
              <br />
              <br />
              Thank you for your understanding.
            </p>
          </div>
        </>
      ) : (
        <>
          <Suspense fallback={<Skeleton className="h-24" />}>
            <YourRole />
          </Suspense>
          <Suspense fallback={<></>}>
            <DelegatesParticipant />
          </Suspense>
          <Suspense fallback={<></>}>
            <DelegatesCompanion />
          </Suspense>
        </>
      )}
    </DashboardPage>
  );
};

export default DelegatesPage;
