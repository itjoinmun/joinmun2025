const API_BASE = process.env.API_URL;

// TO DO: tolong benerin type nya sesuai postman siapa aja
// eslint-disable-next-line
export async function getDelegate(accessToken?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/dashboard/whoami`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
      credentials: "include",
    },
  }).then((res) => res.json());

  if (!res.ok) {
    return null;
  }

  return res;
}

// eslint-disable-next-line
export async function getDelegates(accessToken?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/dashboard/participants`, {
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
export async function fetchDelegatePaper(accessToken?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/position`, {
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
