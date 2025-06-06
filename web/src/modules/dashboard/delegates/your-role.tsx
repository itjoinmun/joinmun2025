import CTACard from "@/components/dashboard/cta-card";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import { parseSlugFromApi } from "@/utils/helpers/api-slug-parse";
import { DELEGATES } from "@/utils/helpers/delegates";
import { getDelegate } from "@/utils/helpers/fetch/delegates/delegates";
import Link from "next/link";

const YourRole = async () => {
  let res;
  try {
    res = await getDelegate();
  } catch (error) {
    console.error("Error fetching delegate:", error);
  }

  const delegate = DELEGATES[parseSlugFromApi(res?.participant_type || "no_slug")];

  return (
    <DashboardModule>
      <DashboardModuleHeader>
        <DashboardModuleTitle>Your Role</DashboardModuleTitle>
      </DashboardModuleHeader>

      <DashboardModuleContent>
        {res ? (
          <div className="space-y-6">
            <p className="text-sm">
              You have already registered,{" "}
              <strong>
                please see the{" "}
                <Link href="/dashboard/home" className="underline">
                  homepage
                </Link>
              </strong>
            </p>
            <CTACard
              title={delegate.name}
              description={delegate.description}
              className="md:w-1/3"
            />
          </div>
        ) : (
          <p>
            You haven&apos;t chosen a role.{" "}
            <span className="font-bold">Choose below now!</span>{" "}
          </p>
        )}
      </DashboardModuleContent>
    </DashboardModule>
  );
};

export default YourRole;
