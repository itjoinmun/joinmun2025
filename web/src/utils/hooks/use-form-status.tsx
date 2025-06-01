"use client";

import { createContext, useContext, useState } from "react";

type FormStatusContextType = {
  submitting: boolean;
  setSubmitting: (submitting: boolean) => void;
};

const FormStatusContext = createContext<FormStatusContextType | undefined>(undefined);

export function FormStatusProvider({ children }: { children: React.ReactNode }) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  return (
    <FormStatusContext.Provider value={{ submitting, setSubmitting }}>
      {children}
    </FormStatusContext.Provider>
  );
}

export function useFormStatus() {
  const context = useContext(FormStatusContext);
  if (!context) {
    throw new Error("useFormStatus must be used within an FormStatusProvider");
  }
  return context;
}
