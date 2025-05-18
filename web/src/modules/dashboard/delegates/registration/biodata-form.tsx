"use client";
import {
  FormContent,
  FormFieldConfig,
  FormHeader,
  RegistrationFormModule,
} from "@/components/dashboard/form-module";
import { DelegateOptions } from "@/utils/helpers/delegates";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { useRouter } from "next/navigation";
import { z } from "zod";

const BiodataForm = ({ slug }: { slug: DelegateOptions }) => {
  const [formData, setFormData] = usePersistedState(`registrationData`, JSON.stringify({}));
  const router = useRouter();
  const savedData = formData.slug?.biodata || {};

  // Define our form fields array with all metadata
  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      description: "Your complete name as it appears in official documents",
      validation: z.string().min(1, "Name is required"),
      defaultValue: savedData.name || "",
    },
    {
      name: "institution",
      label: "Institution",
      placeholder: "Enter your institution",
      description: "University or organization you represent",
      validation: z.string().min(1, "Institution is required"),
      defaultValue: savedData.institution || "",
    },
    {
      name: "nationality",
      label: "Nationality",
      placeholder: "Enter your nationality",
      validation: z.string().min(1, "Nationality is required"),
      defaultValue: savedData.nationality || "",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      validation: z.string().min(1, "Phone number is required"),
      defaultValue: savedData.phoneNumber || "",
    },
    {
      name: "gender",
      label: "Gender",
      placeholder: "Enter your gender",
      validation: z.string().min(1, "Gender is required"),
      defaultValue: savedData.gender || "",
    },
    {
      name: "lineId",
      label: "LINE ID",
      placeholder: "Enter your LINE ID (optional)",
      description: "Optional contact information",
      validation: z.string().optional(),
      defaultValue: savedData.lineId || "",
    },
  ];

  const onSubmit = (values: any) => {
    // Do something with the form values.
    console.log(values);
    setFormData({
      ...formData,
      [slug]: {
        ...formData[slug],
        biodata: values,
      },
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
