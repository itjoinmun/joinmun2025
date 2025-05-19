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

const MunForm = ({ slug }: { slug: DelegateOptions }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration | object>(`${slug}Registration`, {});
  const router = useRouter();

  // Get the saved data from localStorage for this specific form
  const savedData = formData[INDEX]?.mun_responses || {};
  console.log(savedData);

  const formFields: FormFieldConfig[] = [
    {
      id: 2,
      name: "firstCouncilName",
      label: "First preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData[0]?.mun_answer_text || "",
    },
    {
      id: 3,
      name: "firstCouncilReason",
      label: "Reason of your first preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData[1]?.mun_answer_text || "",
    },
    {
      id: 4,
      name: "firstCouncilCountry",
      label: "First preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData[2]?.mun_answer_text || "",
    },
    {
      id: 5,
      name: "secondCouncilName",
      label: "Second preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData[3]?.mun_answer_text || "",
    },
    {
      id: 6,
      name: "secondCouncilReason",
      label: "Reason of your second preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData[4]?.mun_answer_text || "",
    },
    {
      id: 7,
      name: "secondCouncilCountry",
      label: "Second preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData[5]?.mun_answer_text || "",
    },
    {
      id: 8,
      name: "thirdCouncilName",
      label: "Third preferred council",
      placeholder: "Enter your full name",
      validation: z.string().min(1, "Preferred council is required"),
      defaultValue: savedData[6]?.mun_answer_text || "",
    },
    {
      id: 9,
      name: "thirdCouncilReason",
      label: "Reason of your third preferred council",
      placeholder: "Enter your institution",
      validation: z.string().min(1, "Reason is required"),
      defaultValue: savedData[7]?.mun_answer_text || "",
    },
    {
      id: 10,
      name: "thirdCouncilCountry",
      label: "Third preferred country",
      placeholder: "Enter your country",
      validation: z.string().min(1, "Country is required"),
      defaultValue: savedData[8]?.mun_answer_text || "",
    },
  ];
  const onSubmit = (values: any) => {
    // Do something with the form values.
    console.log(values);
    const userEmail = "andre@gmail.com";

    // Structure the form data to match the API requirements
    const newData = {
      ...formData[INDEX],
      mun_delegates: {
        mun_delegate_email: userEmail,
        type: "",
        council: "",
        country: "",
        participant_type: parseSlug(slug),
      },
      mun_responses: formFields.map((field) => ({
        mun_question_id: field.id,
        delegate_email: userEmail,
        mun_answer_text: values[field.name],
      })),
    };

    // Store in localStorage
    setFormData({
      ...formData,
      [INDEX]: newData,
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
