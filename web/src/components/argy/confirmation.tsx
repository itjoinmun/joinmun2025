"use client";
import { Button } from "@/components/ui/button";
import {
  FormHeader,
  RegistrationFormModule,
} from "@/components/dashboard/form-module";
import { DelegateOptions } from "@/utils/helpers/delegates";
import usePersistedState from "@/utils/hooks/use-persisted-state";
import { DelegateRegistration } from "@/utils/types/delegate-registration";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fileStorageDB } from "@/utils/helpers/file-storage-db";
import { submitDelegateRegistration } from "@/utils/helpers/submit_delegate";
import { Loader2 } from "lucide-react";
import parseSlug from "@/utils/helpers/api-slug-parse";

const ConfirmationPage = ({ 
  slug, 
  index = 0,
  isTeam = false 
}: { 
  slug: DelegateOptions; 
  index?: number;
  isTeam?: boolean;
}) => {
  const [formData, setFormData] = usePersistedState<DelegateRegistration[] | Record<number, DelegateRegistration>>(
    `${slug}Registration`,
    isTeam ? {} : []
  );
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileStorageInitialized, setFileStorageInitialized] = useState(false);

  // Initialize file storage
  useEffect(() => {
    fileStorageDB.isInitialized().then(isInit => {
      if (isInit) {
        setFileStorageInitialized(true);
      } else {
        fileStorageDB.init().then(() => {
          setFileStorageInitialized(true);
        }).catch(err => {
          console.error("Failed to initialize file storage:", err);
        });
      }
    });
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { success, error } = await submitDelegateRegistration({
        formData,
        index,
        slug,
        isTeam
      });

      if (success) {
        // Show success message
        alert("Your registration has been submitted successfully!");
        router.push("/dashboard/delegates");
      } else {
        // Show error message
        setSubmitError(error || "Unknown error occurred during submission");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display delegate information in a readable format
  const renderDelegateInfo = (delegateData: DelegateRegistration, delegateIndex?: number) => {
    const biodata = delegateData.biodata_responses || [];
    const health = delegateData.health_responses || [];
    const mun = delegateData.mun_responses || [];

    const getResponseText = (responses: any[], id: number) => {
      const response = responses.find(r => 
        r.biodata_question_id === id || 
        r.health_question_id === id || 
        r.mun_question_id === id
      );
      return response ? 
        (response.biodata_answer_text || response.health_answer_text || response.mun_answer_text) : 
        'Not provided';
    };
    
    // Check if any of the required fields are missing
    const email = getResponseText(biodata, 1);
    const name = getResponseText(biodata, 2);
    const institution = getResponseText(biodata, 4);
    
    const missingRequiredFields = !email || !name || !institution;

    return (
      <div key={delegateIndex} className="bg-slate-800 p-6 rounded-lg mb-6">
        {isTeam && (
          <h3 className="text-xl font-bold mb-4 text-white">
            Team Member {delegateIndex !== undefined ? delegateIndex + 1 : ''}
          </h3>
        )}
        
        {missingRequiredFields && (
          <div className="bg-red-900/50 text-red-300 p-4 mb-6 rounded-md">
            <strong>Warning:</strong> Some required information is missing. Please complete all required fields.
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Personal Information</h4>
            <InfoItem label="Email" value={email} />
            <InfoItem label="Full Name" value={name} />
            <InfoItem label="Institution" value={institution} />
            <InfoItem label="Nationality" value={getResponseText(biodata, 5)} />
            <InfoItem label="Phone Number" value={getResponseText(biodata, 7)} />
            <InfoItem label="Gender" value={getResponseText(biodata, 6)} />
            <InfoItem label="LINE ID" value={getResponseText(biodata, 8)} />
            <InfoItem 
              label="ID Card" 
              value={
                getResponseText(biodata, 3)?.startsWith("FILE:") 
                  ? "Uploaded" 
                  : "Not uploaded"
              } 
            />
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Medical Information</h4>
            <InfoItem 
              label="Medical Condition" 
              value={getResponseText(health, 1)} 
            />
            <InfoItem 
              label="Current Treatment" 
              value={getResponseText(health, 2)} 
            />
            {/* Add more medical info as needed */}
          </div>

          {/* MUN info if present */}
          {mun.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">MUN Information</h4>
              {/* Add MUN info here */}
            </div>
          )}
        </div>
        
        {isTeam && (
          <div className="mt-4">
            <Button
              onClick={() => router.push(`/dashboard/delegates/${slug}/registration/1?idx=${delegateIndex}`)}
              variant="outline"
              className="mr-2"
            >
              Edit Information
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Helper component for info display
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-2">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-white">{value || 'Not provided'}</div>
    </div>
  );
  
  // Check if we have data to display
  const hasData = isTeam 
    ? Object.keys(formData).length > 0
    : formData[index] !== undefined;
  
  if (!hasData) {
    return (
      <RegistrationFormModule>
        <FormHeader>Registration Confirmation</FormHeader>
        <div className="bg-amber-900/50 p-6 rounded-lg text-amber-300">
          <h3 className="text-lg font-bold">No registration data found</h3>
          <p className="mt-2">
            Please complete the registration forms before proceeding to confirmation.
          </p>
          <Button 
            onClick={() => router.push(`/dashboard/delegates/${slug}/registration/1`)}
            className="mt-4"
          >
            Start Registration
          </Button>
        </div>
      </RegistrationFormModule>
    );
  }

  return (
    <RegistrationFormModule>
      <FormHeader>Registration Confirmation</FormHeader>
      
      <div className="mb-6">
        <p className="text-white text-opacity-80">
          Please review your registration information below. Once you're satisfied with all details,
          click the "Submit Registration" button to complete your registration.
        </p>
      </div>
      
      {submitError && (
        <div className="bg-red-900/50 p-4 mb-6 rounded-md text-red-300">
          <strong>Error:</strong> {submitError}
        </div>
      )}
      
      {/* Render delegate information */}
      {isTeam ? (
        // For team, render all members
        Object.keys(formData).map((key, i) => renderDelegateInfo(formData[parseInt(key)], i))
      ) : (
        // For single delegate, render the current index
        formData[index] && renderDelegateInfo(formData[index])
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => router.push(`/dashboard/delegates/${slug}/registration/${isTeam ? 'team' : '3'}`)}
          variant="outline"
        >
          Back
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !fileStorageInitialized}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      </div>
    </RegistrationFormModule>
  );
};

export default ConfirmationPage;