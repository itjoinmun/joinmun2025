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

const INDEX = 0;

const BiodataForm = ({ slug }: { slug: DelegateOptions }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration | object>(`${slug}Registration`, {});
  const router = useRouter();

  // Get the saved data from localStorage for this specific form
  const savedData = formData[INDEX]?.biodata_responses || {};

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
      validation: z
        .instanceof(File)
        .refine(
          (file) => ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type),
          { message: "Invalid document file type" },
        ),
      defaultValue: "",
    },
  ];

  const onSubmit = (values: any) => {
    // Do something with the form values.
    console.log(values);
    // Parse the slug to prepare for form submission to API
    const userEmail = "andre@gmail.com";
    const newData = {
      ...formData[INDEX],
      mun_delegates: {
        mun_delegate_email: userEmail,
        type: "",
        council: "",
        country: "",
        participant_type: parseSlug(slug),
      },
      biodata_responses: formFields.map((field) => ({
        biodata_question_id: field.id,
        delegate_email: userEmail,
        biodata_answer_text: values[field.name],
      })),
    };
    setFormData({
      ...formData,
      [INDEX]: newData,
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
