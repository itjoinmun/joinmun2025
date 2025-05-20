import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";

/**
 * Function to submit registration data to the backend
 * Works for both single delegates and team registrations
 */
export const submitDelegateRegistration = async ({
  formData,
  index = 0,
  slug,
  isTeam = false,
}: {
  formData: DelegateRegistration[] | Record<number, DelegateRegistration>;
  index?: number;
  slug: string;
  isTeam?: boolean;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!await fileStorageDB.isInitialized()) {
      return { success: false, error: "File storage not initialized. Please refresh and try again." };
    }

    // Create a FormData object for the backend submission
    const formDataObj = new FormData();
    
    let delegatePayload: { delegates?: any[], advisor_or_observer?: any };
    const isObserverOrAdvisor = slug === "observer" || slug === "advisor";

    if (isTeam) {
      // For team submissions, gather all team members
      const delegates = Object.values(formData).filter(Boolean);
      
      if (!delegates.length) {
        return { success: false, error: "No team members found. Please add at least one team member." };
      }

      // Create payload with all team members
      if (isObserverOrAdvisor) {
        delegatePayload = {
          advisor_or_observer: delegates.map((delegate) => ({
            mun_delegates: delegate.mun_delegates,
            biodata_responses: delegate.biodata_responses || [],
            health_responses: delegate.health_responses || [],
          }))[0], // Take first item since we expect only one advisor/observer
        };
      } else {
        delegatePayload = {
          delegates: delegates.map((delegate) => ({
            mun_delegates: delegate.mun_delegates,
            biodata_responses: delegate.biodata_responses || [],
            mun_responses: delegate.mun_responses || [],
            health_responses: delegate.health_responses || [],
          })),
        };
      }
    } else {
      // Single delegate submission (original logic)
      const completeData = formData[index];
      if (!completeData) {
        return { success: false, error: "No form data found. Please complete all previous steps first." };
      }

      if (isObserverOrAdvisor) {
        delegatePayload = {
          advisor_or_observer: {
            mun_delegates: completeData.mun_delegates,
            biodata_responses: completeData.biodata_responses || [],
            health_responses: completeData.health_responses || [],
          },
        };
      } else {
        delegatePayload = {
          delegates: [
            {
              mun_delegates: completeData.mun_delegates,
              biodata_responses: completeData.biodata_responses || [],
              mun_responses: completeData.mun_responses || [],
              health_responses: completeData.health_responses || [],
            },
          ],
        };
      }
    }

    // Add the JSON data to the FormData
    formDataObj.append("json", JSON.stringify(delegatePayload));

    // Collect all file references from all delegates
    const fileReferences: string[] = [];

    if (isTeam) {
      // Team submission - gather files from all delegates
      Object.values(formData).forEach(delegate => {
        if (delegate?.biodata_responses) {
          delegate.biodata_responses.forEach(response => {
            if (
              typeof response.biodata_answer_text === "string" &&
              response.biodata_answer_text.startsWith("FILE:")
            ) {
              const fileKey = response.biodata_answer_text.replace("FILE:", "");
              fileReferences.push(fileKey);
            }
          });
        }
      });
    } else {
      // Single delegate submission
      const completeData = formData[index];
      if (completeData?.biodata_responses) {
        completeData.biodata_responses.forEach(response => {
          if (
            typeof response.biodata_answer_text === "string" &&
            response.biodata_answer_text.startsWith("FILE:")
          ) {
            const fileKey = response.biodata_answer_text.replace("FILE:", "");
            fileReferences.push(fileKey);
          }
        });
      }
    }

    // Retrieve all files from IndexedDB and add them to FormData
    for (const fileKey of fileReferences) {
      try {
        const file = await fileStorageDB.getFile(fileKey);
        if (file) {
          // Add file to FormData with a field name that backend can understand
          formDataObj.append(fileKey, file, file.name);
        } else {
          console.warn(`⚠️ File with key ${fileKey} not found in IndexedDB`);
        }
      } catch (error) {
        console.error(`❌ Error retrieving file with key ${fileKey}:`, error);
      }
    }


    let apiUrl: string;
    // Your backend URL
    if (slug === "observer" || slug === "advisor") {
        apiUrl = "http://localhost:8080/api/v1/dashboard/advisor-or-observer";
    } else {
        apiUrl = "http://localhost:8080/api/v1/dashboard/delegates";
    }
    

    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include", // Include cookies in the request
      body: formDataObj,
      // No need to set Content-Type header for FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Server responded with status: ${response.status}. Details: ${errorText}`,
      };
    }
    
    // Clear storage after successful submission
    localStorage.removeItem(`${slug}Registration`);
    await fileStorageDB.clearAll();
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};