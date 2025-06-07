"use server";

import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, "Code is required"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const joinTeamWithCode = async (initialState: any, formData: FormData) => {
  const validatedFields = schema.safeParse({
    code: formData.get("code") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //   POST data to backend
};

export default joinTeamWithCode;
