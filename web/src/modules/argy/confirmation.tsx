"use client";
import { Button } from "@/components/ui/button";
import { FormHeader, RegistrationFormModule } from "@/components/dashboard/form-module";
import { DelegateOptions } from "@/utils/helpers/delegates";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";

const ConfirmationPage = ({
  slug,
  index = 0,
  isTeam = false,
}: {
  slug: DelegateOptions;
  index?: number;
  isTeam?: boolean;
}) => {
  const [formData] = usePersistedState<
    DelegateRegistration[] | Record<number, DelegateRegistration>
  >(`${slug}Registration`, isTeam ? {} : []);

  const router = useRouter();
  {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  }
  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);

  // Initialize file storage
  useEffect(() => {
    fileStorageDB.isInitialized().then((isInit) => {
      if (isInit) {
        setFileStorageInitialized(true);
      } else {
        fileStorageDB
          .init()
          .then(() => {
            setFileStorageInitialized(true);
          })
          .catch((err) => {
            console.error("Failed to initialize file storage:", err);
          });
      }
    });
  }, []);

  // Display delegate information in a readable format
  const renderDelegateInfo = (delegateData: DelegateRegistration, delegateIndex?: number) => {
    const biodata = delegateData.biodata_responses || [];
    const health = delegateData.health_responses || [];
    const mun = delegateData.mun_responses || [];

    const getResponseText = (
      responses: Array<{
        biodata_question_id?: number;
        health_question_id?: number;
        mun_question_id?: number;
        biodata_answer_text?: string;
        health_answer_text?: string;
        mun_answer_text?: string;
      }>,
      id: number,
    ): string => {
      const response = responses.find(
        (r) =>
          r.biodata_question_id === id || r.health_question_id === id || r.mun_question_id === id,
      );
      return response
        ? response.biodata_answer_text ||
            response.health_answer_text ||
            response.mun_answer_text ||
            "Not provided"
        : "Not provided";
    };

    // Check if any of the required fields are missing
    const email = getResponseText(biodata, 1);
    const name = getResponseText(biodata, 2);
    const institution = getResponseText(biodata, 4);

    const missingRequiredFields = !email || !name || !institution;

    return (
      <div key={delegateIndex} className="mb-6 rounded-lg bg-slate-800 p-6">
        {isTeam && (
          <h3 className="mb-4 text-xl font-bold text-white">
            Team Member {delegateIndex !== undefined ? delegateIndex + 1 : ""}
          </h3>
        )}

        {missingRequiredFields && (
          <div className="mb-6 rounded-md bg-red-900/50 p-4 text-red-300">
            <strong>Warning:</strong> Some required information is missing. Please complete all
            required fields before submission.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-semibold text-white">Personal Information</h4>
            <InfoItem label="Email" value={email} />
            <InfoItem label="Full Name" value={name} />
            <InfoItem label="Institution" value={institution} />
            <InfoItem label="Nationality" value={getResponseText(biodata, 5)} />
            <InfoItem label="Phone Number" value={getResponseText(biodata, 7)} />
            <InfoItem label="Gender" value={getResponseText(biodata, 6)} />
            <InfoItem label="LINE ID" value={getResponseText(biodata, 8)} />
            <InfoItem
              label="ID Card"
              value={getResponseText(biodata, 3)?.startsWith("FILE:") ? "Uploaded" : "Not uploaded"}
            />
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-white">Medical Information</h4>
            <InfoItem label="Medical Condition" value={getResponseText(health, 1)} />
            <InfoItem label="Current Treatment" value={getResponseText(health, 2)} />
          </div>

          {mun.length > 0 && (
            <div>
              <h4 className="mb-3 text-lg font-semibold text-white">MUN Information</h4>
            </div>
          )}
        </div>

        {isTeam && (
          <div className="mt-4">
            <Button
              onClick={() =>
                // Navigate to the first step of registration for editing
                router.push(
                  `/dashboard/delegates/${slug}/registration/1${delegateIndex !== undefined && delegateIndex !== 0 ? `?idx=${delegateIndex}` : ""}`,
                )
              }
              variant="outline"
              className="mr-2"
            >
              Edit Information
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Helper component for info display
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-2">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-white">{value || "Not provided"}</div>
    </div>
  );

  // Check if we have data to display
  const hasData = isTeam ? Object.keys(formData).length > 0 : formData[index] !== undefined;

  if (!hasData) {
    return (
      <RegistrationFormModule>
        <FormHeader>Registration Confirmation</FormHeader>
        <div className="rounded-lg bg-amber-900/50 p-6 text-amber-300">
          <h3 className="text-lg font-bold">No registration data found</h3>
          <p className="mt-2">
            Please complete the registration forms before proceeding to confirmation.
          </p>
          <Button
            onClick={() => router.push(`/dashboard/delegates/${slug}/registration/1`)}
            className="mt-4"
          >
            Start Registration
          </Button>
        </div>
      </RegistrationFormModule>
    );
  }

  return (
    <RegistrationFormModule>
      <FormHeader>Registration Confirmation</FormHeader>

      {isTeam
        ? // Render team members
          Object.entries(formData).map(([idx, data]) =>
            renderDelegateInfo(data as DelegateRegistration, parseInt(idx)),
          )
        : // Render single delegate
          renderDelegateInfo((formData as DelegateRegistration[])[index] as DelegateRegistration)}

      {/* Removed submission button and error display */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => router.back()} // Example: Go back to previous page (e.g., medical form)
          variant="outline"
          className="mr-2"
        >
          Back to Edit
        </Button>
        {/* Or a button to navigate to the start of this delegate's form */}
        <Button
          onClick={() =>
            router.push(
              `/dashboard/delegates/${slug}/registration/1${index !== 0 ? `?idx=${index}` : ""}`,
            )
          }
        >
          Edit Registration Details
        </Button>
      </div>
    </RegistrationFormModule>
  );
};

export default ConfirmationPage;
