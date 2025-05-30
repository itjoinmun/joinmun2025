"use server";
import { cookies } from "next/headers";

// TO DO: tolong benerin type nya sesuai postman siapa aja
// eslint-disable-next-line
export async function getDelegate(): Promise<any> {
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

export async function getDelegates(): Promise<any> {
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

// eslint-disable-next-line
export async function getPayment(): Promise<any> {
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
