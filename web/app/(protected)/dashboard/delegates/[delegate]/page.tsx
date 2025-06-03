"use client";
import {
  DashboardModule,
  DashboardModuleContent,
  DashboardModuleHeader,
  DashboardModuleTitle,
} from "@/components/dashboard/dashboard-module";
import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { redirect, useRouter } from "next/navigation";
import { TeamRegistrationTable } from "@/modules/dashboard/delegates/team/team-delegation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitDelegateRegistration } from "@/utils/helpers/submit_delegate";

// This page is ONLY for the delegation team, which is a special case of delegates which has a different registration process.

const DelegationTeamPage = ({ params }: { params: { delegate: string } }) => {
  const { delegate } = params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (delegate !== "team") redirect(`/dashboard/delegates/${delegate}/registration`);

  const handleTeamSubmission = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get team data from localStorage
      const storedData = localStorage.getItem("teamRegistration");

      if (!storedData) {
        setSubmitError("No team data found. Please add team members first.");
        setIsSubmitting(false);
        return;
      }

      const teamData = JSON.parse(storedData);

      // Check if there are any team members
      const teamMembers = Object.values(teamData).filter(Boolean);
      if (!teamMembers.length) {
        setSubmitError("No team members found. Please add at least one team member.");
        setIsSubmitting(false);
        return;
      }

      // Submit the team registration
      const { success, error } = await submitDelegateRegistration({
        formData: teamData,
        slug: "team",
        isTeam: true,
      });

      if (success) {
        // Clear localStorage after successful submission
        localStorage.removeItem("teamRegistration");
        router.push("/dashboard/delegates");
      } else {
        setSubmitError(error || "Unknown error occurred during submission");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardPage className="flex flex-col gap-6">
      <DashboardPageHeader className="space-y-1">
        {/* Title using breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/delegates">Delegates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Delegation Team</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Big Title */}
        <h1 className="text-gradient-gold mt-4 text-3xl font-bold">Delegation Team</h1>
        <DashboardPageDescription className="mt-2 text-sm">
          Manage your team members and submit your team registration.
        </DashboardPageDescription>
      </DashboardPageHeader>

      {/* Page content */}
      <DashboardModule>
        <DashboardModuleHeader>
          <DashboardModuleTitle>Team Registration</DashboardModuleTitle>
        </DashboardModuleHeader>
        <DashboardModuleContent>
          <TeamRegistrationTable />

          {submitError && (
            <div className="mt-4 border-2 border-red-700 bg-red-500 p-4 font-medium text-white">
              Error: {submitError}
            </div>
          )}

          <Button
            variant="primary"
            className="ml-auto"
            onClick={handleTeamSubmission}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Team Registration"}
          </Button>
        </DashboardModuleContent>
      </DashboardModule>
    </DashboardPage>
  );
};

export default DelegationTeamPage;
