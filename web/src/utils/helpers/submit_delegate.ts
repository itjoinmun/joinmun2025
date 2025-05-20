import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";

export const submitDelegateRegistration = async ({
  formData,
  index,
  slug,
}: {
  formData: DelegateRegistration[] | object;
  index: number;
  slug: string;
}): Promise<{ success: boolean; error?: string }> => {
  if (!await fileStorageDB.isInitialized()) {
    return { success: false, error: "File storage not initialized. Please refresh and try again." };
  }

  const completeData = (formData as DelegateRegistration[])[index];
  if (!completeData) {
    return { success: false, error: "No form data found. Please complete all previous steps first." };
  }

  const formDataObj = new FormData();

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

  formDataObj.append("json", JSON.stringify(delegatePayload));

  const fileReferences: string[] = [];

  completeData.biodata_responses?.forEach((response) => {
    if (
      typeof response.biodata_answer_text === "string" &&
      response.biodata_answer_text.startsWith("FILE:")
    ) {
      const fileKey = response.biodata_answer_text.replace("FILE:", "");
      fileReferences.push(fileKey);
    }
  });

  for (const fileKey of fileReferences) {
    try {
      const file = await fileStorageDB.getFile(fileKey);
      if (file) {
        const questionId = fileKey.split("_").pop();
        formDataObj.append(fileKey, file, file.name);
      }
    } catch (error) {
      console.error(`❌ Error retrieving file with key ${fileKey}:`, error);
    }
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/dashboard/delegates", {
      method: "POST",
      credentials: "include",
      body: formDataObj,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Server responded with status: ${response.status}. Details: ${errorText}`,
      };
    }

    localStorage.removeItem(`${slug}Registration`);
    await fileStorageDB.clearAll();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
};
