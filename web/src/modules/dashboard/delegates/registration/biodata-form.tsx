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
import { fileStorageDB } from "@/utils/file-storage-db";

const BiodataForm = ({ slug, index = 0 }: { slug: DelegateOptions; index?: number }) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | object>(
    `${slug}Registration`,
    [],
  );
  
  // Initialize file storage
  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);
  
  // Initialize IndexedDB when component mounts
  useEffect(() => {
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
  }, []);
  
  // More comprehensive logging for getStoredFile
  
  const router = useRouter();

  // Get the saved data from localStorage for this specific form
  const savedData = formData[index]?.biodata_responses || {};
  
  // Email we'll use for this delegate
  const userEmail = "andre@gmail.com";
  
  // Define file key pattern
  const getFileKey = (email: string, questionId: number) => `${email}_${questionId}`;

  // Function to retrieve files from storage
    // More comprehensive logging for getStoredFile
    const getStoredFile = async (fileKey: string): Promise<File | null> => {
      if (!fileStorageInitialized) {
        console.warn("⚠️ File storage not initialized yet");
        return null;
      }
      
      console.log(`🔍 Attempting to retrieve file with key: ${fileKey}`);
      try {
        const file = await fileStorageDB.getFile(fileKey);
        if (file) {
          console.log(`✅ Retrieved file: ${file.name}, size: ${file.size} bytes`);
        } else {
          console.log(`ℹ️ No file found with key: ${fileKey}`);
        }
        return file;
      } catch (error) {
        console.error(`❌ Failed to retrieve file with key ${fileKey}:`, error);
        return null;
      }
    };

    // Check for saved file references
    const identityCardFileKey = savedData[6]?.biodata_answer_text?.startsWith("FILE:") 
      ? savedData[6]?.biodata_answer_text.replace("FILE:", "")
      : null;
    
    console.log("🔑 Saved file reference key:", identityCardFileKey);

  // Define our form fields array with all metadata
  const formFields: FormFieldConfig[] = [
    {
      id: 2,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      description: "Example: 'Rika Lembing Setyawan'",
      validation: z.string().min(1, "Name is required"),
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
      validation: z.instanceof(File).optional().or(z.literal('')).or(z.literal(null)),
      defaultValue: null, // File inputs don't have default values in the form
      savedFileKey: identityCardFileKey // The key for any previously saved file
    },
  ];

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    if (!fileStorageInitialized) {
      console.error("❌ File storage not initialized");
      return;
    }

    console.log("🔍 Raw submitted values:", values);

    // Extract the file from form values
    const identityCardFile = values.identityCard;
    
    if (identityCardFile instanceof File) {
      console.log(`📄 New file selected: ${identityCardFile.name}, size: ${identityCardFile.size} bytes, type: ${identityCardFile.type}`);
      
      const fileKey = getFileKey(userEmail, 3); // 3 is the ID for identityCard
      console.log(`🔑 Generated file key: ${fileKey}`);

      try {
        await fileStorageDB.storeFile(fileKey, identityCardFile);
        console.log(`💾 Stored file "${identityCardFile.name}" in IndexedDB with key: ${fileKey}`);
        
        // Verify the file was stored by retrieving it
        const storedFile = await fileStorageDB.getFile(fileKey);
        if (storedFile) {
          console.log(`✅ Verification successful - retrieved stored file: ${storedFile.name}`);
        } else {
          console.warn("⚠️ Verification failed - could not retrieve stored file");
        }

        // Replace file object with a placeholder in values
        values.identityCard = `FILE:${fileKey}`;
        console.log(`🔄 Replaced file object with reference: ${values.identityCard}`);
      } catch (error) {
        console.error("❌ Error storing file in IndexedDB:", error);
      }
    } else if (!identityCardFile && identityCardFileKey) {
      // Keep the previous file reference if no new file was provided
      values.identityCard = `FILE:${identityCardFileKey}`;
      console.log(`🔄 Keeping existing file reference: ${values.identityCard}`);
    } else {
      console.log("ℹ️ No file selected and no previous file exists");
    }
    // Process JSON data
    const biodataResponses = formFields.map((field) => {
      let answerValue = values[field.name];
      
      // Handle special file type fields
      if (field.type === "file") {
        if (answerValue instanceof File) {
          answerValue = `FILE:${getFileKey(userEmail, field.id)}`;
        } else if (!answerValue && field.savedFileKey) {
          // Use the previously saved file if no new file was uploaded
          answerValue = `FILE:${field.savedFileKey}`;
        }
      }
      
      return {
        biodata_question_id: field.id,
        delegate_email: userEmail,
        biodata_answer_text: answerValue || "",
      };
    });

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

    // Log what's actually being saved to localStorage
    console.log("📦 Final localStorage data:", {
      ...formData,
      [index]: newData,
    });
    
    // After setting form data, log all stored file keys for verification
    fileStorageDB.getAllKeys().then(keys => {
      console.log("📂 All stored file keys after submission:", keys);
    });

    // Update localStorage
    setFormData({
      ...formData,
      [index]: newData,
    });

    // Move to next step
    router.push("2");
  };

  return (
    <>
      <RegistrationFormModule>
        <FormHeader>Biodata</FormHeader>
        <FormContent 
          fields={formFields} 
          onSubmit={onSubmit} 
          getStoredFile={getStoredFile}
        />
      </RegistrationFormModule>
    </>
  );
};

export default BiodataForm;