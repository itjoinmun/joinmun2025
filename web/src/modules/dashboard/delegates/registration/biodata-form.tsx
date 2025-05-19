"use client";
import {
  FormContent,
  FormFieldConfig,
  FormHeader,
  RegistrationFormModule,
} from "@/components/dashboard/form-module";
import parseSlug from "@/utils/helpers/api-slug-parse";
import { DelegateOptions } from "@/utils/helpers/delegates";
import { fileToBase64 } from "@/utils/helpers/file-to-base-64";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { useRouter } from "next/navigation";
import { z } from "zod";

const BiodataForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );
  const router = useRouter();

  // Get the saved data from localStorage for this specific form
  const savedData = formData[index]?.biodata_responses || {};

  // Define our form fields array with all metadata
  const formFields: FormFieldConfig[] = [
    {
      id: 2,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      description: "Example: 'Rika Lembing Setyawan'",
      validation: z.string().min(1, "Name is required"),
      // defaultValue:
      //   savedData.find((item: BiodataResponse) => item.biodata_question_id === 2)
      //     ?.biodata_answer_text || "",
      defaultValue: savedData[0]?.biodata_answer_text || "",
    },
    {
      id: 4,
      name: "institution",
      label: "Institution",
      placeholder: "Enter your institution",
      description: "Example: 'Universitas Gadjah Mada'",
      validation: z.string().min(1, "Institution is required"),
      defaultValue: savedData[1]?.biodata_answer_text || "",
    },
    {
      id: 5,
      name: "nationality",
      label: "Nationality",
      placeholder: "Enter your nationality",
      description: "Example: 'Indonesia'",
      validation: z.string().min(1, "Nationality is required"),
      defaultValue: savedData[2]?.biodata_answer_text || "",
    },
    {
      id: 7,
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      validation: z.string().min(1, "Phone number is required"),
      defaultValue: savedData[3]?.biodata_answer_text || "",
    },
    {
      id: 6,
      name: "gender",
      label: "Gender",
      placeholder: "Enter your gender",
      validation: z.string().min(1, "Gender is required"),
      defaultValue: savedData[4]?.biodata_answer_text || "",
    },
    {
      id: 8,
      name: "lineId",
      label: "LINE ID",
      placeholder: "Enter your LINE ID (optional)",
      description: "Optional contact information",
      validation: z.string().optional(),
      defaultValue: savedData[5]?.biodata_answer_text || "",
    },
    {
      id: 3,
      name: "identityCard",
      type: "file",
      label: "Identification Card",
      placeholder: "Upload your identification card here",
      description: ".pdf, .png, .jpg, .jpeg",
      validation: z.instanceof(File).refine(
        (file) => {
          // Apalah ini intinya biar bisa disave di context atau localStorage
          // The FileReader logic here is mainly for validation if needed,
          // actual conversion for submission is handled in onSubmit
          if (!file) return false; // Handle case where file might be undefined initially
          return ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type);
        },
        { message: "Invalid document file type. Must be .pdf, .png, .jpg, or .jpeg" },
      ),
      defaultValue: savedData[6]?.biodata_answer_text || "", // Or handle file default value appropriately
    },
  ];

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    // Do something with the form values.
    // Parse the slug to prepare for form submission to API
    const userEmail = "andre@gmail.com";

    // Vibe Coded
    // Only Gemini and God knows how this code works
    // ---------------------------------------------------------------------
    const biodataResponses = await Promise.all(
      formFields.map(async (field) => {
        let answer = values[field.name];
        if (field.name === "identityCard" && values[field.name] instanceof File) {
          try {
            answer = await fileToBase64(values[field.name]);
          } catch (error) {
            console.error("Error converting file to base64:", error);
            answer = null; // Or handle the error as appropriate for your application
          }
        }
        return {
          biodata_question_id: field.id,
          delegate_email: userEmail,
          biodata_answer_text: answer,
        };
      }),
    );
    // ---------------------------------------------------------------------
    // End of Vibe Coding

    const newData = {
      ...formData[index],
      mun_delegates: {
        mun_delegate_email: userEmail,
        type: "",
        council: "",
        country: "",
        participant_type: parseSlug(slug),
      },
      biodata_responses: biodataResponses,
    };
    setFormData({
      ...formData,
      [index]: newData,
    });
    router.push("2");
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Biodata</FormHeader>
        <FormContent fields={formFields} onSubmit={onSubmit} />
      </RegistrationFormModule>
    </>
  );
};

export default BiodataForm;
