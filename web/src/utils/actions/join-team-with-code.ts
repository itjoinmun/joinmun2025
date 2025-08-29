"use server";

import { cookies } from "next/headers";
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

  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/dashboard/join-team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    body: JSON.stringify({ team_id: validatedFields.data.code }),
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      message: data.message || "Failed to join team",
      errors: data.errors || { code: ["Invalid team code"] },
    };
  }

  return {
    ok: true,
    message: "Successfully joined team!",
    errors: {},
  };
};

export default joinTeamWithCode;
