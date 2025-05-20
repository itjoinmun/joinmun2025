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
import { fileStorageDB } from "@/utils/file-storage-db";
import { useEffect, useState } from "react";

const MedicalForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );
  const router = useRouter();

  // Initialize file storage
  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize IndexedDB when component mounts
  useEffect(() => {
    console.log("🚀 Starting IndexedDB initialization...");
    
    // Check if IndexedDB is already initialized
    fileStorageDB.isInitialized().then(isInit => {
      if (isInit) {
        console.log("✅ IndexedDB was already initialized");
        setFileStorageInitialized(true);
        
        // Log all stored files 
        fileStorageDB.getAllKeys().then(keys => {
          console.log("📂 Currently stored file keys:", keys);
        });
      } else {
        console.log("🔄 IndexedDB needs initialization");
        fileStorageDB.init().then(() => {
          setFileStorageInitialized(true);
          console.log("✅ IndexedDB initialized successfully");
          
          // Log all stored files on initialization
          fileStorageDB.getAllKeys().then(keys => {
            console.log("📂 Currently stored file keys:", keys);
          });
        }).catch(err => {
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

  // Function to submit all form data to the backend
  const submitAllFormData = async () => {
    if (!fileStorageInitialized) {
      console.error("❌ File storage not initialized");
      setSubmitError("File storage not initialized. Please refresh and try again.");
      return false;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log("🚀 Starting submission process...");

      // Get the complete data from localStorage
      const completeData = formData[index];

      if (!completeData) {
        console.error("❌ No form data found in localStorage");
        setSubmitError("No form data found. Please complete all previous steps first.");
        return false;
      }

      // Log the complete data from localStorage
      console.log("📝 Complete form data from localStorage:", completeData);

      // Create a FormData object for the backend submission
      const formDataObj = new FormData();

      // Prepare the delegates payload structure
      const delegatePayload = {
        delegates: [
          {
            mun_delegates: completeData.mun_delegates,
            biodata_responses: completeData.biodata_responses || [],
            mun_responses: completeData.mun_responses || [],
            health_responses: completeData.health_responses || [],
          },
        ],
      };

      console.log("📦 Prepared delegate payload:", delegatePayload);

      // Add the JSON data to the FormData
      formDataObj.append("json", JSON.stringify(delegatePayload));

      // Find all file references in biodata_responses
      const fileReferences: string[] = [];

      if (completeData.biodata_responses && Array.isArray(completeData.biodata_responses)) {
        completeData.biodata_responses.forEach((response: { biodata_question_id: number; biodata_answer_text: string }) => {
          if (
            typeof response.biodata_answer_text === "string" &&
            response.biodata_answer_text.startsWith("FILE:")
          ) {
            const fileKey = response.biodata_answer_text.replace("FILE:", "");
            fileReferences.push(fileKey);
            console.log(`🔍 Found file reference: ${fileKey} for question ID: ${response.biodata_question_id}`);
          }
        });
      }

      // Retrieve all files from IndexedDB and add them to FormData
      for (const fileKey of fileReferences) {
        try {
          const file = await fileStorageDB.getFile(fileKey);
          if (file) {
            console.log(`✅ Retrieved file from IndexedDB: ${file.name} (${file.size} bytes)`);

            // Extract the question ID from the file key (assuming format: email_questionId)
            const questionId = fileKey.split("_").pop();

            // Add file to FormData with a field name that backend can understand
            formDataObj.append(fileKey, file, file.name);
            console.log(`📎 Added file to FormData with field name: file_${questionId}`);
          } else {
            console.warn(`⚠️ File with key ${fileKey} not found in IndexedDB`);
          }
        } catch (error) {
          console.error(`❌ Error retrieving file with key ${fileKey}:`, error);
        }
      }

      // Send the FormData to the backend
      console.log("📤 Sending form data to backend...");

      // Your backend URL
      const apiUrl = "http://localhost:8080/api/v1/dashboard/delegates";

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include", // Include cookies in the request
        body: formDataObj,
        // No need to set Content-Type header for FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}. Details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("✅ Form submission successful:", responseData);
      localStorage.removeItem(`${slug}Registration`);
      await fileStorageDB.clearAll()
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("❌ Error submitting form data:", error);
      setSubmitError(error instanceof Error ? error.message : "Unknown error occurred");
      setIsSubmitting(false);
      return false;
    }
  };

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    // Do something with the form values.
    console.log(values);
    // Parse the slug to prepare for form submission to API
    const userEmail = "andre@gmail.com";

    // Structure the form data to match the API requirements
    const newData = {
      ...formData[index],
      mun_delegates: {
        mun_delegate_email: userEmail,
        type: "",
        council: "",
        country: "",
        participant_type: parseSlug(slug),
      },
      health_responses: formFields.map((field) => ({
        health_question_id: field.id,
        delegate_email: userEmail,
        health_answer_text: values[field.name],
      })),
    };

    // Store in localStorage
    setFormData({
      ...formData,
      [index]: newData,
    });

    // Submit all form data to the backend
    const success = await submitAllFormData();
    if (success) {
      // Show success message
      alert("Your registration has been submitted successfully!");
      router.push("/dashboard/delegates");
    } else {
      // Show error message
      alert(`Failed to submit registration: ${submitError || "Unknown error"}`);
    }
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Medical Questions</FormHeader>
        {submitError && (
          <div className="text-red-500 mb-4 font-medium">Error: {submitError}</div>
        )}
        <FormContent fields={formFields} onSubmit={onSubmit} />
        {isSubmitting && (
          <div className="text-amber-500 mt-4 font-medium">
            Submitting your registration, please wait...
          </div>
        )}
      </RegistrationFormModule>
    </>
  );
};

export default MedicalForm;
