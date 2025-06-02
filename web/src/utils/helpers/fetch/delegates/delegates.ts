"use server";
import { cookies } from "next/headers";
import { apiSlugs } from "../../api-slug-parse";

export interface Delegate {
  id: number;
  name: string;
  email: string;
  payment_status: "rejected" | "pending" | "approved";
  registration_status: "rejected" | "pending" | "approved";
  mun_delegate_email: string;
  mun_delegate_name: string;
  type: string | null;
  pair: string | null;
  council: string | null;
  country: string | null;
  confirmed: boolean;
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
  });

  if (!res.ok) {
    return null;
  }

  const resBody = await res.json();
  return resBody;
}

// eslint-disable-next-line
export async function getDelegatePaper(): Promise<any> {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/position`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
      credentials: "include",
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
  payment_status: "rejected" | "pending" | "checking" | "approved";
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
    payment_status: "rejected" | "pending" | "checking" | "approved";
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
  });

  if (!res.ok) {
    return null;
  }

  const resBody = await res.json();
  return resBody;
}

export async function approveRegistration(id: number) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/approve-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to approve registration");
  }

  return res.json();
}

export async function rejectRegistration(id: number) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/reject-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to reject registration");
  }

  return res.json();
}

export async function approvePayment(id: number) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/approve-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to approve payment");
  }

  return res.json();
}

export async function rejectPayment(id: number) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/reject-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to reject payment");
  }

  return res.json();
}

export async function assignCouncil(id: number, council: string) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/assign-council`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    body: JSON.stringify({ council }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to assign council");
  }

  return res.json();
}

export async function assignCountry(id: number, country: string) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.API_URL}/admin/participants/${id}/assign-country`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
    body: JSON.stringify({ country }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to assign country");
  }

  return res.json();
}

export interface Participant {
  id: number;
  name: string;
  email: string;
  payment_status: "rejected" | "pending" | "approved";
  registration_status: "rejected" | "pending" | "approved";
  council: string | null;
  country: string | null;
}
