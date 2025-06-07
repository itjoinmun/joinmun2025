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
import { useEffect, useState } from "react";
import { z } from "zod";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";
import { useSession } from "@/utils/hooks/use-session";

const BiodataForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );

  const { user } = useSession();

  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);

  useEffect(() => {
    fileStorageDB
      .init()
      .then(() => {
        setFileStorageInitialized(true);
        fileStorageDB.getAllKeys();
      })
      .catch((err) => {
        console.error("❌ Failed to initialize file storage:", err);
      });
  }, []);

  const router = useRouter();

  const savedData = formData[index]?.biodata_responses || {};

  const getFileKey = (email: string, questionId: number) => `${email}_${questionId}`;

  const getStoredFile = async (fileKey: string): Promise<File | null> => {
    if (!fileStorageInitialized) {
      console.warn("⚠️ File storage not initialized yet");
      return null;
    }

    try {
      const file = await fileStorageDB.getFile(fileKey);
      return file;
    } catch (error) {
      console.error(`❌ Failed to retrieve file with key ${fileKey}:`, error);
      return null;
    }
  };

  const identityCardFileKey = savedData[7]?.biodata_answer_text?.startsWith("FILE:")
    ? savedData[7]?.biodata_answer_text.replace("FILE:", "")
    : null;

  const formFields: FormFieldConfig[] = [
    {
      id: 1,
      name: "email",
      label: "Email",
      placeholder: "Enter your email address",
      description: "This will be used as your login identifier",
      validation: z.string().email("Invalid email address").min(1, "Email is required"),
      defaultValue: savedData[0]?.biodata_answer_text || (user?.email as string),
    },
    {
      id: 2,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      description: "Example: 'Rika Lembing Setyawan'",
      validation: z.string().min(1, "Name is required"),
      defaultValue: savedData[1]?.biodata_answer_text || "",
    },
    {
      id: 4,
      name: "institution",
      label: "Institution",
      placeholder: "Enter your institution",
      description: "Example: 'Universitas Gadjah Mada'",
      validation: z.string().min(1, "Institution is required"),
      defaultValue: savedData[2]?.biodata_answer_text || "",
    },
    {
      id: 5,
      name: "nationality",
      label: "Nationality",
      placeholder: "Enter your nationality",
      description: "Example: 'Indonesia'",
      validation: z.string().min(1, "Nationality is required"),
      defaultValue: savedData[3]?.biodata_answer_text || "",
    },
    {
      id: 7,
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      validation: z.string().min(1, "Phone number is required"),
      defaultValue: savedData[4]?.biodata_answer_text || "",
    },
    {
      id: 6,
      name: "gender",
      label: "Gender",
      placeholder: "Enter your gender",
      validation: z.string().min(1, "Gender is required"),
      defaultValue: savedData[5]?.biodata_answer_text || "",
    },
    {
      id: 8,
      name: "lineId",
      label: "LINE ID",
      placeholder: "Enter your LINE ID (optional)",
      description: "Optional contact information",
      validation: z.string().optional(),
      defaultValue: savedData[6]?.biodata_answer_text || "",
    },
    {
      id: 3,
      name: "identityCard",
      type: "file",
      label: "Identification Card",
      placeholder: "Upload your identification card here",
      description: ".pdf, .png, .jpg, .jpeg",
      validation: z.instanceof(File).optional().or(z.literal("")).or(z.literal(null)),
      defaultValue: null,
      savedFileKey: identityCardFileKey,
    },
  ];

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    if (!fileStorageInitialized) {
      return;
    }

    const submittedEmail = values.email;

    const identityCardFile = values.identityCard;

    if (identityCardFile instanceof File) {
      const fileKey = getFileKey(submittedEmail, 3);

      try {
        await fileStorageDB.storeFile(fileKey, identityCardFile);
        values.identityCard = `FILE:${fileKey}`;
      } catch (error) {
        console.error("❌ Error storing file in IndexedDB:", error);
      }
    } else if (!identityCardFile && identityCardFileKey) {
      values.identityCard = `FILE:${identityCardFileKey}`;
    } else {
      console.log("ℹ️ No file selected and no previous file exists");
    }
    const biodataResponses = formFields.map((field) => {
      let answerValue = values[field.name];

      if (field.type === "file") {
        if (answerValue instanceof File) {
          answerValue = `FILE:${getFileKey(submittedEmail, field.id)}`; // Use submitted email
        } else if (!answerValue && field.savedFileKey) {
          answerValue = `FILE:${field.savedFileKey}`;
        }
      }

      return {
        biodata_question_id: field.id,
        delegate_email: submittedEmail,
        biodata_answer_text: answerValue || "",
      };
    });

    const newData = {
      ...formData[index],
      mun_delegates: {
        mun_delegate_email: submittedEmail,
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

    if (slug === "observer" || slug === "advisor") {
      router.push("3");
    } else {
      if (slug === "team") {
        router.push(`2?idx=${index}`);
      } else {
        router.push("2");
      }
    }
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Biodata</FormHeader>
        <FormContent fields={formFields} onSubmit={onSubmit} getStoredFile={getStoredFile} />
      </RegistrationFormModule>
    </>
  );
};

export default BiodataForm;
