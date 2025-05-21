"use client";
import {
  FormContent,
  FormFieldConfig,
  FormHeader,
  RegistrationFormModule,
} from "@/components/dashboard/form-module";
import parseSlug from "@/utils/helpers/api-slug-parse";
import { DelegateOptions } from "@/utils/helpers/delegates";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";
// import { submitDelegateRegistration } from "@/utils/helpers/submit_delegate";
import { useEffect, useState } from "react";

const MedicalForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );
  const router = useRouter();

  // Initialize file storage
  // eslint-disable-next-line
  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);
  {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
  const [isSubmitting, setIsSubmitting] = useState(false);
  {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
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

  // Replace the onSubmit function with:
  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  const onSubmit = async (values: any) => {
    // Do something with the form values.
    console.log(values);
    // Parse the slug to prepare for form submission to API
    const delegateEmail = formData[index]?.biodata_responses?.[0]?.biodata_answer_text || "";

    // Structure the form data to match the API requirements
    const newData = {
      ...formData[index],
      mun_delegates: {
        mun_delegate_email: delegateEmail,
        type: "",
        council: "",
        country: "",
        participant_type: parseSlug(slug),
      },
      health_responses: formFields.map((field) => ({
        health_question_id: field.id,
        delegate_email: delegateEmail,
        health_answer_text: values[field.name],
      })),
    };

    // Store in localStorage
    setFormData({
      ...formData,
      [index]: newData,
    });

    // Instead of submitting here, navigate to confirmation page
    // router.push(`/dashboard/delegates/${slug}/registration/confirmation${index !== 0 ? `?idx=${index}` : ''}`);
    router.push(`/dashboard/delegates/${slug}/registration/confirmation`);
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Medical Questions</FormHeader>
        {submitError && <div className="mb-4 font-medium text-red-500">Error: {submitError}</div>}
        <FormContent fields={formFields} onSubmit={onSubmit} />
        {isSubmitting && (
          <div className="mt-4 font-medium text-amber-500">
            Submitting your registration, please wait...
          </div>
        )}
      </RegistrationFormModule>
    </>
  );
};

export default MedicalForm;
