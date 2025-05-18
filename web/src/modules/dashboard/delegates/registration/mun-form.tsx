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

const MunForm = ({ slug }: { slug: DelegateOptions }) => {
  const [formData, setFormData] = usePersistedState(`registrationData`, JSON.stringify({}));
  const router = useRouter();

  const savedData = formData.slug?.mun || {};

  const formFields: FormFieldConfig[] = [
    {
      name: "firstCouncilName",
      label: "First preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData.firstCouncilName || "",
    },
    {
      name: "firstCouncilReason",
      label: "Reason of your first preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData.firstCouncilReason || "",
    },
    {
      name: "firstCouncilCountry",
      label: "First preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData.firstCouncilCountry || "",
    },
    {
      name: "secondCouncilName",
      label: "Second preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData.secondCouncilName || "",
    },
    {
      name: "secondCouncilReason",
      label: "Reason of your second preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData.secondCouncilReason || "",
    },
    {
      name: "secondCouncilCountry",
      label: "Second preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData.secondCouncilCountry || "",
    },
    {
      name: "thirdCouncilName",
      label: "Third preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData.thirdCouncilName || "",
    },
    {
      name: "thirdCouncilReason",
      label: "Reason of your third preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData.thirdCouncilReason || "",
    },
    {
      name: "thirdCouncilCountry",
      label: "Third preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData.thirdCouncilCountry || "",
    },
  ];
  const onSubmit = (values: any) => {
    // Do something with the form values.
    console.log(values);
    setFormData({
      ...formData,
      [slug]: {
        ...formData[slug],
        mun: values,
      },
    });
    router.push("3");
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>MUN Questions</FormHeader>
        <FormContent fields={formFields} onSubmit={onSubmit} />
      </RegistrationFormModule>
    </>
  );
};

export default MunForm;
