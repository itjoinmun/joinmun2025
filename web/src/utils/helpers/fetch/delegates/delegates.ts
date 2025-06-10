"use server";
import { cookies } from "next/headers";
import { apiSlugs } from "../../api-slug-parse";
import { revalidateTag } from "next/cache";

export interface Delegate {
  id: number;
  name: string;
  email: string;
  payment_status: "rejected" | "pending" | "paid";
  mun_delegate_email: string;
  mun_delegate_name: string;
  type: string | null;
  pair: string | null;
  council: string | null;
  country: string | null;
  confirmed: "rejected" | "pending" | "confirmed";
  confirmed_date: string | null;
  council_date: string | null;
  insert_date: string;
  participant_type: apiSlugs;
}

export async function getDelegate(): Promise<Delegate | null> {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/dashboard/whoami`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    next: {
      revalidate: 30,
      tags: [`delegate-${accessToken}`],
    },
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

export async function getDelegates(): Promise<{
  participant_data: Delegate[];
  team_id: string;
} | null> {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/dashboard/participants`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
      credentials: "include",
    },
    next: {
      revalidate: 30,
      tags: [`delegates-${accessToken}`],
    },
  });

  if (!res.ok) {
    return null;
  }

  const resBody = await res.json();
  return resBody;
}

interface Paper {
  mun_delegate_email: string;
  submission_file: string;
  submission_date: string;
  submission_status: string;
}

export async function getDelegatePaper(): Promise<Paper | null> {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/position`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
      credentials: "include",
    },
    next: {
      revalidate: 30,
      tags: [`delegate-paper-${accessToken}`],
    },
  });

  if (!res.ok) {
    return null;
  }

  const resBody = await res.json();
  return resBody;
}

export interface Payment {
  payment_id: number;
  mun_team_id: string;
  mun_delegate_email: string;
  package: string;
  payment_file: string;
  payment_status: "paid" | "failed" | "pending";
  payment_date: string | null;
  payment_amount: number;
  mun_delegate_name: string;
  confirmed: boolean;
  insert_date: string;
  participant_type: apiSlugs;
  mun_team_lead: string;
  team_members: {
    mun_delegate_email: string;
    mun_delegate_name: string;
    participant_type: apiSlugs;
    confirmed: boolean;
    payment_status: "paid" | "failed" | "pending";
    payment_amount: number;
    package: string;
  }[];
}

export async function getPayment(): Promise<Payment | null> {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/payment`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    next: {
      revalidate: 30,
      tags: [`payment-${accessToken}`],
    },
  });

  if (!res.ok) {
    return null;
  }

  const resBody = await res.json();
  return resBody;
}

export interface Participant {
  name: string;
  email: string;
  payment_status: "paid" | "pending" | "failed";
  registration_status: "rejected" | "pending" | "confirmed";
  council: string | null;
  country: string | null;
}

export async function submitPayment(
  paymentData: {
    package: string;
    payment_amount: number;
  },
  paymentFile: File,
): Promise<{ success: boolean; message: string; payment_id?: number; payment_file?: string }> {
  const accessToken = (await cookies()).get("access_token")?.value;
  const formData = new FormData();
  formData.append("payment", JSON.stringify(paymentData));
  formData.append("payment_proof", paymentFile);

  const res = await fetch(`${process.env.API_URL}/payment`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to submit payment");
  }

  const result = await res.json();
  revalidateTag(`payment-${accessToken}`);
  revalidateTag(`delegates-${accessToken}`);
  return {
    success: true,
    message: result.message,
    payment_id: result.payment_id,
    payment_file: result.payment_file,
  };
}

export async function submitPositionPaper(
  file: File,
): Promise<{ success: boolean; message: string }> {
  const accessToken = (await cookies()).get("access_token")?.value;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.API_URL}/position`, {
    method: "POST",
    body: formData,
    headers: {
      Cookie: `access_token=${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to submit position paper");
  }

  const result = await res.json();
  return {
    success: true,
    message: result.message,
  };
}
