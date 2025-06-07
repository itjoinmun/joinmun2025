"use client";
import {
  FormContent,
  FormFieldConfig,
  FormHeader,
  RegistrationFormModule,
} from "@/components/dashboard/form-module";
import parseSlug from "@/utils/helpers/api-slug-parse";
import { DelegateOptions } from "@/utils/helpers/delegates";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";
import { submitDelegateRegistration } from "@/utils/helpers/submit_delegate"; // Added import
import { useFormStatus } from "@/utils/hooks/use-form-status";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const MedicalForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const { setSubmitting } = useFormStatus();
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );
  const router = useRouter();

  const [, setFileStorageInitialized] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize IndexedDB when component mounts
  useEffect(() => {
    console.log("🚀 Starting IndexedDB initialization...");

    // Check if IndexedDB is already initialized
    fileStorageDB.isInitialized().then((isInit) => {
      if (isInit) {
        console.log("✅ IndexedDB was already initialized");
        setFileStorageInitialized(true);

        // Log all stored files
        fileStorageDB.getAllKeys().then((keys) => {
          console.log("📂 Currently stored file keys:", keys);
        });
      } else {
        console.log("🔄 IndexedDB needs initialization");
        fileStorageDB
          .init()
          .then(() => {
            setFileStorageInitialized(true);
            console.log("✅ IndexedDB initialized successfully");

            // Log all stored files on initialization
            fileStorageDB.getAllKeys().then((keys) => {
              console.log("📂 Currently stored file keys:", keys);
            });
          })
          .catch((err) => {
            console.error("❌ Failed to initialize file storage:", err);
          });
      }
    });
  }, []);

  // Get the data from localStorage for this specific form
  const savedData = formData[index]?.health_responses || {};

  // Define our form fields array with all metadata
  const formFields: FormFieldConfig[] = [
    {
      id: 1,
      name: "medicalConditionTrackRecord",
      label: "Do you have any track record on your medical condition?",
      placeholder: "Enter your answer",
      validation: z.string().optional(),
      defaultValue: savedData[0]?.health_answer_text || "",
    },
    {
      id: 2,
      name: "currentMedicalTreatment",
      label: "At this moment, are you receiving any medical treatment?",
      placeholder: "Explain your medical treatment, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[1]?.health_answer_text || "",
    },
    {
      id: 3,
      name: "currentMedication",
      label: "At this moment, are you consuming any medicine?",
      placeholder: "Explain your medication, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[2]?.health_answer_text || "",
    },
    {
      id: 4,
      name: "specificMedicalIssues",
      label: "Have you ever had specific medical issues? ",
      description: "Example: 'asthma, migraine, vertigo, TBC, etc.'",
      placeholder: "Explain your medical issues, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[3]?.health_answer_text || "",
    },
    {
      id: 5,
      name: "insuranceDetails",
      label: "Are you registered with any insurance company?",
      description: "Example: 'BPJS 09776541123'",
      placeholder: "Enter your insurance details, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[4]?.health_answer_text || "",
    },
    {
      id: 6,
      name: "familyDiseaseHistory",
      label: "Do you have a family history of any specific diseases? ",
      placeholder: "Explain the diseases or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[5]?.health_answer_text || "",
    },
    {
      id: 7,
      name: "currentMedicationsOrSupplements",
      label: "Are you currently taking any medications or supplements?",
      placeholder: "Enter your medications or supplements, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[6]?.health_answer_text || "",
    },
    {
      id: 8,
      name: "medicationAllergies",
      label: "Do you have any allergies to medication? ",
      placeholder: "Explain your allergies or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[7]?.health_answer_text || "",
    },
    {
      id: 9,
      name: "conditionOrObjectAllergies",
      label: "Are you allergic to specific conditions/objects?",
      description: "Example: 'cold, heat, windy conditions'",
      placeholder: "Explain your allergies or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[8]?.health_answer_text || "",
    },
    {
      id: 10,
      name: "phobiasOrAbstentions",
      label: "Do you have any phobia, abstention, or other things you avoid?",
      placeholder: "Explain your phobias or abstentions, or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[9]?.health_answer_text || "",
    },
    {
      id: 11,
      name: "mentalCounseling",
      label: "At this moment, are you under mental counseling/therapy/assessment?",
      placeholder: "Explain your therapy or fill '-'",
      validation: z.string().optional(),
      defaultValue: savedData[10]?.health_answer_text || "",
    },
  ];

  // Simplified submission similar to team page - save to localStorage and then submit directly
  const onSubmit = async (values: Record<string, string>) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Save the health responses to localStorage first
      let currentFormData: DelegateRegistration[] | Record<number, DelegateRegistration>;
      
      if (slug === "team") {
        currentFormData = (formData as Record<number, DelegateRegistration>) || {};
      } else {
        currentFormData = Array.isArray(formData) ? formData : [];
      }

      const existingDelegateData =
        slug === "team"
          ? (currentFormData as Record<number, DelegateRegistration>)[index] || ({} as Partial<DelegateRegistration>)
          : (currentFormData as DelegateRegistration[])[index] || ({} as Partial<DelegateRegistration>);

      const delegateEmail = existingDelegateData.biodata_responses?.[0]?.biodata_answer_text || "";

      // Create the updated delegate data with health responses
      const updatedDelegateData: DelegateRegistration = {
        ...existingDelegateData,
        mun_delegates: {
          ...(existingDelegateData.mun_delegates || {}),
          mun_delegate_email: delegateEmail,
          type: existingDelegateData.mun_delegates?.type || "",
          council: existingDelegateData.mun_delegates?.council || "",
          country: existingDelegateData.mun_delegates?.country || "",
          participant_type: parseSlug(slug) as "observer" | "single_delegate" | "faculty_advisor" | "team_delegate",
        },
        health_responses: formFields.map((field) => ({
          health_question_id: field.id,
          delegate_email: delegateEmail,
          health_answer_text: values[field.name] || "",
        })),
        biodata_responses: existingDelegateData.biodata_responses || [],
        mun_responses: existingDelegateData.mun_responses || [],
      };

      // Update localStorage
      let updatedFormData;
      if (slug === "team") {
        updatedFormData = {
          ...(currentFormData as Record<number, DelegateRegistration>),
          [index]: updatedDelegateData,
        };
      } else {
        const allDelegatesData = [...(currentFormData as DelegateRegistration[])];
        while (allDelegatesData.length <= index) {
          allDelegatesData.push({} as DelegateRegistration);
        }
        allDelegatesData[index] = updatedDelegateData;
        updatedFormData = allDelegatesData;
      }

      setFormData(updatedFormData);

      if (slug === "team") {
        // For team, just navigate back to team page
        setSubmitting(false);
        router.push("/dashboard/delegates/team");
      } else {
        // Get the complete data from localStorage (like team page does)
        const storedData = localStorage.getItem(`${slug}Registration`);
        if (!storedData) {
          setSubmitError("No registration data found. Please complete all previous steps first.");
          setSubmitting(false);
          return;
        }

        const registrationData: DelegateRegistration[] = JSON.parse(storedData);

        const { success, error } = await submitDelegateRegistration({
          formData: registrationData,
          index,
          slug,
          isTeam: false,
        });

        if (success) {
          router.push("/dashboard/delegates");
        } else {
          setSubmitError(error || "Unknown error occurred during submission");
          setSubmitting(false);
        }
      }
    } catch (err) {
      console.error("💥 Medical form submission error:", err);
      setSubmitError(err instanceof Error ? err.message : "Unknown error occurred");
      setSubmitting(false);
    }
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Medical Questions</FormHeader>
        <FormContent fields={formFields} onSubmit={onSubmit} />
        {submitError && (
          <div className="mt-4 border-2 border-red-700 bg-red-500 p-4 font-medium text-white">
            Error: {submitError}
          </div>
        )}
      </RegistrationFormModule>
    </>
  );
};

export default MedicalForm;
